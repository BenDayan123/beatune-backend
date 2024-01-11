import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mediaURL } from './config';
// import * as bodyParser from 'body-parser';

async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors();

  app.useStaticAssets(mediaURL, {
    prefix: '/media/',
  });
  app.use(express.json());
  await app.listen(PORT);
}
bootstrap();