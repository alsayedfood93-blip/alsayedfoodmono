import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AdminDto } from '@alsayed/shared-types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import type { AuthenticatedAdmin } from './auth.types';

@ApiTags('auth')
@Controller('auth/admin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiOkResponse({ description: 'Login succeeded; tokens issued.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(
      dto.username,
      dto.password,
      req.headers['user-agent'],
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate access token using a refresh token' })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired.' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke the refresh session' })
  async logout(@Body() dto: RefreshDto): Promise<{ success: true }> {
    await this.authService.logout(dto.refreshToken);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('admin-access')
  @ApiOperation({ summary: 'Get the authenticated admin profile' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated.' })
  me(@CurrentAdmin() admin: AuthenticatedAdmin): Promise<AdminDto> {
    return this.authService.getAdminById(admin.id);
  }
}
