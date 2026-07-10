import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin/dashboard')
@ApiBearerAuth('admin-access')
@UseGuards(JwtAuthGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Real-data dashboard summary counts' })
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
