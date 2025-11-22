import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Optional Sentry imports - gracefully handle if not installed
let Sentry: any;
let nodeProfilingIntegration: any;

try {
  Sentry = require('@sentry/node');
  const profilingModule = require('@sentry/profiling-node');
  nodeProfilingIntegration = profilingModule.nodeProfilingIntegration;
} catch (error) {
  // Sentry not installed - service will be disabled
}

@Injectable()
export class SentryService implements OnModuleInit {
  private readonly logger = new Logger(SentryService.name);
  private initialized = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeSentry();
  }

  private initializeSentry() {
    // Skip if Sentry packages not installed
    if (!Sentry) {
      this.logger.warn('Sentry packages not installed - error tracking disabled');
      return;
    }

    const dsn = this.configService.get<string>('SENTRY_DSN');
    const environment = this.configService.get<string>('SENTRY_ENVIRONMENT') || 
                       this.configService.get<string>('NODE_ENV') || 'development';
    const tracesSampleRate = parseFloat(
      this.configService.get<string>('SENTRY_TRACES_SAMPLE_RATE') || '0.1'
    );

    if (!dsn) {
      this.logger.warn('Sentry DSN not configured - error tracking disabled');
      return;
    }

    try {
      const integrations: any[] = [];
      if (nodeProfilingIntegration) {
        integrations.push(nodeProfilingIntegration());
      }

      Sentry.init({
        dsn,
        environment,
        tracesSampleRate,
        profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
        integrations,
        // Filter out certain errors
        beforeSend(event: any, _hint: any) {
          // Filter out chunk load errors (usually network issues)
          if (event.exception) {
            const exception = event.exception.values?.[0];
            if (exception?.type === 'ChunkLoadError') {
              return null;
            }
          }
          return event;
        },
        // Filter sensitive data from breadcrumbs
        beforeBreadcrumb(breadcrumb: any) {
          if (breadcrumb.category === 'http' && breadcrumb.data) {
            // Remove sensitive headers
            if (breadcrumb.data.request_headers) {
              delete breadcrumb.data.request_headers.authorization;
              delete breadcrumb.data.request_headers.cookie;
            }
          }
          return breadcrumb;
        },
      });

      this.initialized = true;
      this.logger.log(`Sentry initialized for environment: ${environment}`);
    } catch (error) {
      this.logger.error('Failed to initialize Sentry', error);
    }
  }

  captureException(exception: any, context?: Record<string, any>) {
    if (!this.initialized || !Sentry) return;

    Sentry.withScope((scope: any) => {
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setContext(key, context[key]);
        });
      }
      Sentry.captureException(exception);
    });
  }

  captureMessage(message: string, level: string = 'info', context?: Record<string, any>) {
    if (!this.initialized || !Sentry) return;

    Sentry.withScope((scope: any) => {
      scope.setLevel(level);
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setContext(key, context[key]);
        });
      }
      Sentry.captureMessage(message);
    });
  }

  setUser(user: { id: string; email?: string; tenantId?: string }) {
    if (!this.initialized || !Sentry) return;

    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.email,
    });

    if (user.tenantId) {
      Sentry.setTag('tenant_id', user.tenantId);
    }
  }

  addBreadcrumb(breadcrumb: any) {
    if (!this.initialized || !Sentry) return;
    Sentry.addBreadcrumb(breadcrumb);
  }

  setContext(key: string, context: Record<string, any>) {
    if (!this.initialized) return;
    Sentry.setContext(key, context);
  }

  setTag(key: string, value: string) {
    if (!this.initialized) return;
    Sentry.setTag(key, value);
  }
}

