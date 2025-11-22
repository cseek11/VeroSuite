import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, VersioningType, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AppModule } from './app.module';
import { validateEnvironmentVariables, logEnvironmentStatus } from './common/utils/env-validation';

// Increase Node.js memory limit
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Generate trace ID for startup
const startupTraceId = randomUUID();

async function bootstrap() {
  // Configure raw body parsing for Stripe webhooks
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body for webhook signature verification
  });
  
  // Validate environment variables at startup
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  try {
    const requiredEnvVars = validateEnvironmentVariables(configService, startupTraceId);
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
    
    logEnvironmentStatus(requiredEnvVars, optionalEnvVars, startupTraceId);
    logger.log('Environment validation passed', {
      traceId: startupTraceId,
      spanId: 'env-validation',
      operation: 'bootstrap',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error('Environment validation failed', {
      traceId: startupTraceId,
      spanId: 'env-validation',
      operation: 'bootstrap',
      error: errorMessage,
      errorStack: error instanceof Error ? error.stack : undefined,
    });
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
      logger.error('Validation errors detected', {
        traceId: startupTraceId,
        spanId: 'validation',
        operation: 'request-validation',
        errors: messages,
      });
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

  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || 
    configService.get<string>('CORS_ORIGIN')?.split(',') || 
    ['http://localhost:3000', 'http://localhost:5173'];
  app.enableCors({
    origin: allowedOrigins,
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

  const port = configService.get<string>('PORT') || '3001';
  await app.listen(port);
  logger.log('Backend server started successfully', {
    traceId: startupTraceId,
    spanId: 'server-startup',
    operation: 'bootstrap',
    port: parseInt(port, 10),
    environment: configService.get<string>('NODE_ENV') || 'development',
  });
}

bootstrap();
