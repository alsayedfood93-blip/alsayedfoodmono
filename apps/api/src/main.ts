import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
  const adminWebOrigin =
    process.env.ADMIN_WEB_ORIGIN ?? 'http://localhost:3001';

  app.enableCors({
    origin: [webOrigin, adminWebOrigin],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ALSAYED Food & Beverages API')
    .setDescription('REST API for ALSAYED Food & Beverages')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3002);
  await app.listen(port);
}

void bootstrap();
