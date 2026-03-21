import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap(): Promise<void> {
  // Ensure uploads directory exists
  if (!existsSync('./uploads')) {
    mkdirSync('./uploads', { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const port = configService.get<number>('PORT');

  if (!corsOrigin || !port) {
    throw new Error('CORS_ORIGIN or PORT environment variables are missing');
  }

  const corsOrigins = corsOrigin.split(',').map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  console.log(
    `🚀 Dom Feliu Backend running on http://localhost:${String(port)}`,
  );
}

void bootstrap();
