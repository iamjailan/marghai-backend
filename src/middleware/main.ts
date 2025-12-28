import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    try {
      if (!authHeader) {
        throw new UnauthorizedException();
      }

      const [type, token] = authHeader.split(' ');

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      const checkCustomer = await this.prismaService.customer.findUnique({
        where: { id: decoded.userId },
      });

      if (!checkCustomer) {
        throw new UnauthorizedException();
      }

      req['user'] = decoded;

      next();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
