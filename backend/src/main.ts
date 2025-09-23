import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { validateEnvironmentVariables, logEnvironmentStatus } from './common/utils/env-validation';

// Increase Node.js memory limit
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Validate environment variables at startup
  const configService = app.get(ConfigService);
  try {
    const requiredEnvVars = validateEnvironmentVariables(configService);
    const optionalEnvVars = {
      SUPABASE_PUBLISHABLE_KEY: configService.get<string>('SUPABASE_PUBLISHABLE_KEY'),
      JWT_EXPIRES_IN: configService.get<string>('JWT_EXPIRES_IN'),
      REFRESH_TOKEN_EXPIRES_IN: configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      CORS_ORIGIN: configService.get<string>('CORS_ORIGIN'),
      STRIPE_SECRET_KEY: configService.get<string>('STRIPE_SECRET_KEY'),
      STRIPE_PUBLISHABLE_KEY: configService.get<string>('STRIPE_PUBLISHABLE_KEY'),
      STRIPE_WEBHOOK_SECRET: configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      REDIS_URL: configService.get<string>('REDIS_URL'),
    };
    
    logEnvironmentStatus(requiredEnvVars, optionalEnvVars);
    console.log('✅ Environment validation passed');
  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    process.exit(1);
  }

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('VeroField API')
    .setDescription('Multi-tenant Pest Control Operations Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: (process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173']),
    credentials: true,
  });

  // Set API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server is running on port ${port}`);
}

bootstrap();
