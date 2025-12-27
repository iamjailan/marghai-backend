import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    try {
      if (!authHeader) {
        throw new UnauthorizedException();
      }

      const [type, token] = authHeader.split(' ');

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req['user'] = decoded;

      next();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
