import { Injectable, LoggerService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface LogContext {
  [key: string]: any;
  traceId?: string;
  spanId?: string;
  requestId?: string;
  userId?: string;
  tenantId?: string;
}

interface StructuredLogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  message: string;
  context: string;
  operation?: string;
  severity: 'info' | 'warn' | 'error' | 'debug' | 'verbose';
  errorCode?: string;
  rootCause?: string;
  traceId?: string;
  spanId?: string;
  requestId?: string;
  [key: string]: any;
}

/**
 * Structured logging service with request-scoped logging
 */
@Injectable()
export class StructuredLoggerService implements LoggerService {
  private readonly logger = new Logger(StructuredLoggerService.name);
  private readonly requestContexts = new Map<string, LogContext>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Set request context for scoped logging
   */
  setRequestContext(requestId: string, context: LogContext) {
    this.requestContexts.set(requestId, context);
  }

  /**
   * Clear request context
   */
  clearRequestContext(requestId: string) {
    this.requestContexts.delete(requestId);
  }

  /**
   * Get request context
   */
  getRequestContext(requestId: string): LogContext | undefined {
    return this.requestContexts.get(requestId);
  }

  /**
   * Log with structured format
   * MANDATORY: All logs must include message, context, traceId, operation, severity, errorCode/rootCause
   */
  private logStructured(
    level: 'log' | 'error' | 'warn' | 'debug' | 'verbose',
    message: string,
    context?: string,
    requestId?: string,
    operation?: string,
    errorCode?: string,
    rootCause?: string,
    additionalData?: Record<string, any>
  ) {
    const requestContext = requestId ? this.requestContexts.get(requestId) : undefined;
    
    const logEntry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context || 'Application',
      operation: operation || requestContext?.operation,
      severity: level === 'log' ? 'info' : level,
      ...(errorCode && { errorCode }),
      ...(rootCause && { rootCause }),
      ...(requestContext?.traceId && { traceId: requestContext.traceId }),
      ...(requestContext?.spanId && { spanId: requestContext.spanId }),
      ...(requestContext?.requestId && { requestId: requestContext.requestId }),
      ...(requestContext?.userId && { userId: requestContext.userId }),
      ...(requestContext?.tenantId && { tenantId: requestContext.tenantId }),
      ...(additionalData || {})
    };

    // Output as JSON in production, formatted in development
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    if (isProduction) {
      console.log(JSON.stringify(logEntry));
    } else {
      this.logger[level](message, context);
    }
  }

  /**
   * Log info message with structured format
   * @param message - Human-readable log message
   * @param context - Context identifier (service, module, component name)
   * @param requestId - Request identifier for request-scoped logging
   * @param operation - Operation name (function, endpoint, action)
   * @param additionalData - Additional structured data
   */
  log(
    message: string,
    context?: string,
    requestId?: string,
    operation?: string,
    additionalData?: Record<string, any>
  ) {
    this.logStructured('log', message, context, requestId, operation, undefined, undefined, additionalData);
  }

  /**
   * Log error message with structured format
   * @param message - Human-readable error message
   * @param trace - Error stack trace
   * @param context - Context identifier
   * @param requestId - Request identifier
   * @param operation - Operation name
   * @param errorCode - Error classification code
   * @param rootCause - Root cause description
   * @param additionalData - Additional structured data
   */
  error(
    message: string,
    trace?: string,
    context?: string,
    requestId?: string,
    operation?: string,
    errorCode?: string,
    rootCause?: string,
    additionalData?: Record<string, any>
  ) {
    const requestContext = requestId ? this.requestContexts.get(requestId) : undefined;
    
    const logEntry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context: context || 'Application',
      operation: operation || requestContext?.operation,
      severity: 'error',
      ...(errorCode && { errorCode }),
      ...(rootCause && { rootCause }),
      ...(trace && { trace }),
      ...(requestContext?.traceId && { traceId: requestContext.traceId }),
      ...(requestContext?.spanId && { spanId: requestContext.spanId }),
      ...(requestContext?.requestId && { requestId: requestContext.requestId }),
      ...(requestContext?.userId && { userId: requestContext.userId }),
      ...(requestContext?.tenantId && { tenantId: requestContext.tenantId }),
      ...(additionalData || {})
    };

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    if (isProduction) {
      console.error(JSON.stringify(logEntry));
    } else {
      this.logger.error(message, trace, context);
    }
  }

  /**
   * Log warning message with structured format
   */
  warn(
    message: string,
    context?: string,
    requestId?: string,
    operation?: string,
    errorCode?: string,
    additionalData?: Record<string, any>
  ) {
    this.logStructured('warn', message, context, requestId, operation, errorCode, undefined, additionalData);
  }

  /**
   * Log debug message with structured format
   */
  debug(
    message: string,
    context?: string,
    requestId?: string,
    operation?: string,
    additionalData?: Record<string, any>
  ) {
    this.logStructured('debug', message, context, requestId, operation, undefined, undefined, additionalData);
  }

  /**
   * Log verbose message with structured format
   */
  verbose(
    message: string,
    context?: string,
    requestId?: string,
    operation?: string,
    additionalData?: Record<string, any>
  ) {
    this.logStructured('verbose', message, context, requestId, operation, undefined, undefined, additionalData);
  }
}




