import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http.filter';
import { PrismaService } from './shared/services/prisma.service';

async function bootstrap() {
  const CORS_OPTIONS = {
    origin: [
      'http://localhost:3000'
    ],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization'
    ],
    exposedHeaders: 'Authorization',
    credentials: true,
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE']
  };

  const fAdapt = new FastifyAdapter();
  fAdapt.enableCors(CORS_OPTIONS);
  fAdapt.register(require('fastify-multipart'));

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fAdapt
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(8080, '0.0.0.0');
}

void bootstrap();
