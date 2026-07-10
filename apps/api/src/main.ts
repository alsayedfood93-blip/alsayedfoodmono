import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join, isAbsolute } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const webOrigin = config.get<string>('WEB_ORIGIN', 'http://localhost:3000');
  const adminWebOrigin = config.get<string>(
    'ADMIN_WEB_ORIGIN',
    'http://localhost:3001',
  );

  app.enableCors({
    origin: [webOrigin, adminWebOrigin],
    credentials: true,
  });

  // Serve backend-hosted images as public static assets under /uploads.
  const uploadRootSetting = config.get<string>('UPLOAD_ROOT', './uploads');
  const uploadRoot = isAbsolute(uploadRootSetting)
    ? uploadRootSetting
    : join(process.cwd(), uploadRootSetting);
  app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ALSAYED Food & Beverages API')
    .setDescription('REST API for ALSAYED Food & Beverages')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Admin JWT access token',
      },
      'admin-access',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get<number>('PORT', 3002);
  await app.listen(port);
}

void bootstrap();
