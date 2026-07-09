import { Injectable } from '@nestjs/common';
import type { HealthResponse } from '@alsayed/shared-types';

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'alsayed-api',
    };
  }
}
