import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import type {
  AdminDto,
  LoginResponseDto,
  AuthTokensDto,
} from '@alsayed/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import type { Admin } from '@alsayed/database';
import { JwtAccessPayload } from './auth.types';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly accessExpiresIn: number;
  private readonly refreshExpiresDays: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.accessSecret = this.config.get<string>('JWT_ACCESS_SECRET', '');
    this.accessExpiresIn = this.config.get<number>(
      'JWT_ACCESS_EXPIRES_IN',
      900,
    );
    this.refreshExpiresDays = this.config.get<number>(
      'JWT_REFRESH_EXPIRES_IN_DAYS',
      30,
    );
  }

  async login(
    username: string,
    password: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    const admin = await this.prisma.admin.findUnique({ where: { username } });

    // Constant-ish behaviour: always compare against a hash to reduce timing
    // signal between "unknown admin" and "wrong password".
    const passwordHash =
      admin?.password ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidin';
    const passwordValid = await bcrypt.compare(password, passwordHash);

    if (!admin || !passwordValid) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const tokens = await this.issueSession(admin, userAgent);
    return { ...tokens, admin: this.toAdminDto(admin) };
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    const parsed = this.parseRefreshToken(refreshToken);
    if (!parsed) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const session = await this.prisma.adminSession.findUnique({
      where: { id: parsed.sessionId },
      include: { admin: true },
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() < Date.now() ||
      session.tokenHash !== this.hashSecret(parsed.secret)
    ) {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    // Rotate the refresh secret on every use.
    const newSecret = randomBytes(32).toString('hex');
    const expiresAt = this.refreshExpiryDate();
    await this.prisma.adminSession.update({
      where: { id: session.id },
      data: { tokenHash: this.hashSecret(newSecret), expiresAt },
    });

    const accessToken = await this.signAccessToken(session.admin);
    return {
      accessToken,
      refreshToken: `${session.id}.${newSecret}`,
      expiresIn: this.accessExpiresIn,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const parsed = this.parseRefreshToken(refreshToken);
    if (!parsed) {
      return;
    }
    // Revoke the session so the refresh credential can no longer be used.
    await this.prisma.adminSession.updateMany({
      where: { id: parsed.sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async getAdminById(id: number): Promise<AdminDto> {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('Admin account not found.');
    }
    return this.toAdminDto(admin);
  }

  private async issueSession(
    admin: Admin,
    userAgent?: string,
  ): Promise<AuthTokensDto> {
    const secret = randomBytes(32).toString('hex');
    const session = await this.prisma.adminSession.create({
      data: {
        adminId: admin.id,
        tokenHash: this.hashSecret(secret),
        userAgent: userAgent?.slice(0, 255),
        expiresAt: this.refreshExpiryDate(),
      },
    });

    const accessToken = await this.signAccessToken(admin);
    return {
      accessToken,
      refreshToken: `${session.id}.${secret}`,
      expiresIn: this.accessExpiresIn,
    };
  }

  private signAccessToken(admin: Admin): Promise<string> {
    const payload: JwtAccessPayload = {
      sub: admin.id,
      username: admin.username,
    };
    return this.jwt.signAsync(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresIn,
    });
  }

  private parseRefreshToken(
    token: string,
  ): { sessionId: string; secret: string } | null {
    const separator = token.indexOf('.');
    if (separator <= 0) {
      return null;
    }
    return {
      sessionId: token.slice(0, separator),
      secret: token.slice(separator + 1),
    };
  }

  private hashSecret(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }

  private refreshExpiryDate(): Date {
    return new Date(Date.now() + this.refreshExpiresDays * 24 * 60 * 60 * 1000);
  }

  private toAdminDto(admin: Admin): AdminDto {
    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };
  }
}
