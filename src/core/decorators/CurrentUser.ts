import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userId = request.headers['sub'];
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    const id = Number(userId);
    if (isNaN(id)) {
      throw new UnauthorizedException('ID do usuário inválido');
    }
    return Number(userId);
  },
);
