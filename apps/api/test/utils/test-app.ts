import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';

/**
 * Configure test application with same settings as production
 * This ensures routes match between tests and production
 */
export function configureTestApp(app: INestApplication): void {
  // Set global prefix (matches main.ts)
  app.setGlobalPrefix('api');

  // Enable API versioning (matches main.ts)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v'
  });

  // Add validation pipe (matches main.ts)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
}

