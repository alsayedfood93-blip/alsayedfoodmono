import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtAccessPayload } from '../auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token.');
    }

    try {
      const payload = await this.jwt.verifyAsync<JwtAccessPayload>(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET', ''),
      });
      request.admin = { id: payload.sub, username: payload.username };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  private extractToken(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header) {
      return undefined;
    }
    const [type, value] = header.split(' ');
    return type === 'Bearer' ? value : undefined;
  }
}
