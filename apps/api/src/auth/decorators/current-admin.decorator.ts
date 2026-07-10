import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedAdmin } from '../auth.types';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.admin) {
      throw new UnauthorizedException();
    }
    return request.admin;
  },
);
