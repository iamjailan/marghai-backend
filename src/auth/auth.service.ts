import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/login';
import { createPrismaSelect } from 'src/utils/prismaSelect';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto, fields: string[]) {
    try {
      const checkCustomer: any = await this.prisma.customer.findUnique({
        where: { email: data.email },
        select: createPrismaSelect(fields),
      });

      if (checkCustomer) {
        throw new UnauthorizedException('Try log in');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const customer: any = await this.prisma.customer.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: hashedPassword,
          company: data.company,
          location: data.location,
          phone: data.phone,
        },
        select: createPrismaSelect(fields),
      });
      const token = this.signToken(customer.id, customer.email);

      return {
        token: token,
        data: customer,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Registration failed');
    }
  }

  async login(data: LoginDto, fields: string[]) {
    try {
      const customer: any = await this.prisma.customer.findUnique({
        where: { email: data.email },
        select: createPrismaSelect(fields),
      });

      if (!customer) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(data.password, customer.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.signToken(customer.id, customer.email);

      return { token: token, data: { ...customer, password: null } };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }

  private signToken(userId: string, email: string) {
    return {
      access_token: this.jwtService.sign(
        {
          userId: userId,
          email,
        },
        { expiresIn: '24h', subject: userId },
      ),
    };
  }
}
