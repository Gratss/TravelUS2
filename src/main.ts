import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security
  app.use(helmet());
  app.enableCors();
  
  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('TravelUS API')
    .setDescription('The TravelUS API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('home', 'Home page content endpoints')
    .addTag('routes', 'Travel routes endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Static files
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
