import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { validateEnvironmentVariables, logEnvironmentStatus } from './common/utils/env-validation';

// Increase Node.js memory limit
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

async function bootstrap() {
  // Configure raw body parsing for Stripe webhooks
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body for webhook signature verification
  });
  
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Environment validation failed:', errorMessage);
    process.exit(1);
  }

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false, // Allow extra properties for now, log them instead
    transformOptions: {
      enableImplicitConversion: true, // Automatically convert string numbers to numbers
    },
    exceptionFactory: (errors) => {
      const messages = errors.map(err => {
        const constraints = err.constraints ? Object.values(err.constraints).join(', ') : '';
        return `${err.property}: ${constraints}`;
      });
      console.error('Validation errors:', messages);
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: messages
      });
    }
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

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v'
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server is running on port ${port}`);
}

bootstrap();
