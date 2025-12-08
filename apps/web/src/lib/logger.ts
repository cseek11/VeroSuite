import { SentryUtils } from './sentry';
import { config } from './config';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Log entry interface - aligned with backend StructuredLogEntry
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  // Context can be a simple string or an object carrying a type discriminator
  context?: string | { type?: string; [key: string]: any };
  operation?: string; // Operation name (function, endpoint, action)
  severity: 'info' | 'warn' | 'error' | 'debug' | 'verbose';
  errorCode?: string; // Error classification code
  rootCause?: string; // Root cause description
  traceId?: string; // Distributed trace identifier
  spanId?: string; // Span identifier within trace
  requestId?: string; // Request identifier
  additionalData?: Record<string, any>; // Additional structured data
  error?: Error;
  userId?: string;
  tenantId?: string;
  sessionId?: string;
}

// Structured logger class
export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get user context
  private getUserContext() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        userId: user.id,
        tenantId: user.tenant_id,
        email: user.email,
      };
    } catch {
      return {};
    }
  }

  // Create log entry with structured format
  // MANDATORY: All logs must include message, context, traceId, operation, severity, errorCode/rootCause
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string | Record<string, any>,
    error?: Error,
    operation?: string,
    errorCode?: string,
    rootCause?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ): LogEntry {
    const userContext = this.getUserContext();
    
    // Handle context as string (context identifier) or object (legacy support)
    const contextValue: LogEntry['context'] = typeof context === 'string' ? context : (context || 'Application');
    const additionalData = typeof context === 'object' ? context : {};
    
    // Get or generate trace ID
    const finalTraceId = traceId || this.getOrGenerateTraceId();
    const finalRequestId = requestId || this.getOrGenerateRequestId();
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: contextValue,
      severity: this.getSeverityFromLevel(level),
      additionalData: {
        ...additionalData,
        ...userContext,
        sessionId: this.sessionId,
        environment: config.app.environment,
        version: config.app.version,
      },
      userId: userContext.userId,
      tenantId: userContext.tenantId,
      sessionId: this.sessionId,
    };

    if (operation) entry.operation = operation;
    if (errorCode) entry.errorCode = errorCode;
    if (rootCause) entry.rootCause = rootCause;
    if (finalTraceId) entry.traceId = finalTraceId;
    if (spanId) entry.spanId = spanId;
    if (finalRequestId) entry.requestId = finalRequestId;
    if (error) entry.error = error;

    return entry;
  }

  // Get severity string from log level
  private getSeverityFromLevel(level: LogLevel): 'info' | 'warn' | 'error' | 'debug' | 'verbose' {
    switch (level) {
      case LogLevel.DEBUG:
        return 'debug';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.WARN:
        return 'warn';
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return 'error';
      default:
        return 'info';
    }
  }

  // Get or generate trace ID (stored in session storage for consistency)
  private getOrGenerateTraceId(): string {
    const key = 'verofield_trace_id';
    let traceId = sessionStorage.getItem(key);
    if (!traceId) {
      traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(key, traceId);
    }
    return traceId;
  }

  // Get or generate request ID
  private getOrGenerateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add log entry
  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to Sentry for error levels
    if (entry.level >= LogLevel.ERROR) {
      if (entry.error) {
        SentryUtils.captureException(entry.error, { extra: entry.context });
      } else {
        SentryUtils.captureMessage(entry.message, 'error');
      }
    }

    // Console output based on environment
    if (config.app.environment === 'development' || entry.level >= LogLevel.WARN) {
      this.consoleOutput(entry);
    }
  }

  // Console output with formatting
  private consoleOutput(_entry: LogEntry) {
    // Direct console output disabled to enforce structured logging policy.
    // Logs are stored in memory, optionally sent to Sentry, and retrievable via getLogs().
  }

  // Log methods with structured format support
  /**
   * Log debug message with structured format
   * @param message - Human-readable log message
   * @param context - Context identifier (string) or additional data (object for backward compatibility)
   * @param operation - Operation name (function, endpoint, action)
   * @param traceId - Distributed trace identifier
   * @param spanId - Span identifier within trace
   * @param requestId - Request identifier
   */
  debug(
    message: string,
    context?: string | Record<string, any>,
    operation?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context, undefined, operation, undefined, undefined, traceId, spanId, requestId);
    this.addLog(entry);
  }

  /**
   * Log info message with structured format
   */
  info(
    message: string,
    context?: string | Record<string, any>,
    operation?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    const entry = this.createLogEntry(LogLevel.INFO, message, context, undefined, operation, undefined, undefined, traceId, spanId, requestId);
    this.addLog(entry);
  }

  /**
   * Log warning message with structured format
   */
  warn(
    message: string,
    context?: string | Record<string, any>,
    error?: Error,
    operation?: string,
    errorCode?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    const entry = this.createLogEntry(LogLevel.WARN, message, context, error, operation, errorCode, undefined, traceId, spanId, requestId);
    this.addLog(entry);
  }

  /**
   * Log error message with structured format
   */
  error(
    message: string,
    context?: string | Record<string, any>,
    error?: Error,
    operation?: string,
    errorCode?: string,
    rootCause?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId);
    this.addLog(entry);
  }

  /**
   * Log fatal error message with structured format
   */
  fatal(
    message: string,
    context?: string | Record<string, any>,
    error?: Error,
    operation?: string,
    errorCode?: string,
    rootCause?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    const entry = this.createLogEntry(LogLevel.FATAL, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId);
    this.addLog(entry);
  }

  // API call logging
  logApiCall(endpoint: string, method: string, status: number, duration: number, error?: Error) {
    const level = error ? LogLevel.ERROR : (status >= 400 ? LogLevel.WARN : LogLevel.INFO);
    const message = `API ${method} ${endpoint} - ${status} (${duration}ms)`;
    const context = {
      endpoint,
      method,
      status,
      duration,
      type: 'api_call',
    };

    if (error) {
      this.log(level, message, context, error);
    } else {
      this.log(level, message, context);
    }
  }

  // User action logging
  logUserAction(action: string, data?: Record<string, any>) {
    const message = `User action: ${action}`;
    const context = {
      action,
      data,
      type: 'user_action',
    };
    this.info(message, context);
  }

  // Page navigation logging
  logPageNavigation(from: string, to: string, duration?: number) {
    const message = `Navigation: ${from} → ${to}`;
    const context = {
      from,
      to,
      duration,
      type: 'navigation',
    };
    this.info(message, context);
  }

  // Generic log method with structured format support
  log(
    level: LogLevel,
    message: string,
    context?: string | Record<string, any>,
    error?: Error,
    operation?: string,
    errorCode?: string,
    rootCause?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    const entry = this.createLogEntry(level, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId);
    this.addLog(entry);
  }

  // Get logs with filtering
  getLogs(filter?: {
    level?: LogLevel;
    timeRange?: number;
    type?: string;
    userId?: string;
  }): LogEntry[] {
    const now = Date.now();
    return this.logs.filter(entry => {
      if (filter?.level && entry.level < filter.level) {
        return false;
      }
      if (filter?.timeRange) {
        const entryTime = new Date(entry.timestamp).getTime();
        return now - entryTime < filter.timeRange;
      }
      if (filter?.type) {
        const ctxType = typeof entry.context === 'object' ? entry.context?.type : undefined;
        if (ctxType !== filter.type) {
          return false;
        }
      }
      if (filter?.userId && entry.userId !== filter.userId) {
        return false;
      }
      return true;
    });
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Get log statistics
  getLogStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    this.logs.forEach(entry => {
      const level = LogLevel[entry.level];
      stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;
      
      const type = typeof entry.context === 'object' ? entry.context?.type || 'general' : 'general';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }
}

// Logger instance
export const logger = Logger.getInstance();

// React hook for logging
export const useLogger = () => {
  return {
    debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
    info: (message: string, context?: Record<string, any>) => logger.info(message, context),
    warn: (message: string, context?: Record<string, any>, error?: Error) => logger.warn(message, context, error),
    error: (message: string, context?: Record<string, any>, error?: Error) => logger.error(message, context, error),
    fatal: (message: string, context?: Record<string, any>, error?: Error) => logger.fatal(message, context, error),
    logApiCall: (endpoint: string, method: string, status: number, duration: number, error?: Error) =>
      logger.logApiCall(endpoint, method, status, duration, error),
    logUserAction: (action: string, data?: Record<string, any>) => logger.logUserAction(action, data),
    logPageNavigation: (from: string, to: string, duration?: number) => logger.logPageNavigation(from, to, duration),
  };
};
