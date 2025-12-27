import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/login';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    try {
      const checkCustomer = await this.prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (checkCustomer) {
        return this.signToken(checkCustomer.id, checkCustomer.email);
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const customer = await this.prisma.customer.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: hashedPassword,
        },
      });

      return this.signToken(customer.id, customer.email);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Registration failed');
    }
  }

  async login(data: LoginDto) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (!customer) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(data.password, customer.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.signToken(customer.id, customer.email);
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
