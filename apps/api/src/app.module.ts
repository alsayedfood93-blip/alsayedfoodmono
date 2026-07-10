import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ContentModule } from './content/content.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    StorageModule,
    CategoriesModule,
    ProductsModule,
    ContentModule,
    SiteSettingsModule,
    DashboardModule,
  ],
})
export class AppModule {}
