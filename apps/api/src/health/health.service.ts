import { Injectable, Logger } from '@nestjs/common';
import type { HealthResponse } from '@alsayed/shared-types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<HealthResponse> {
    let database: 'up' | 'down' = 'up';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      database = 'down';
      this.logger.error('Database health check failed', error as Error);
    }

    return {
      status: 'ok',
      service: 'alsayed-api',
      database,
    };
  }
}
