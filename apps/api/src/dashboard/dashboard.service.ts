import { Injectable } from '@nestjs/common';
import type { DashboardSummaryDto } from '@alsayed/shared-types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<DashboardSummaryDto> {
    const [totalCategories, totalProducts, activeProducts, featuredProducts] =
      await Promise.all([
        this.prisma.category.count(),
        this.prisma.product.count(),
        this.prisma.product.count({ where: { isActive: true } }),
        this.prisma.product.count({ where: { isFeatured: true } }),
      ]);

    return {
      totalCategories,
      totalProducts,
      activeProducts,
      featuredProducts,
    };
  }
}
