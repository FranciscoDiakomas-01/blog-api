import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const [type, token] = authHeader.split(' ');

    try {
      const payload = this.jwtService.verify(token);
      req.headers['sub'] = payload.sub.toString();
      next();
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
