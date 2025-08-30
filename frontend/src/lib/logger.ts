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

// Log entry interface
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
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

  // Create log entry
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const userContext = this.getUserContext();
    
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        ...userContext,
        sessionId: this.sessionId,
        environment: config.app.environment,
        version: config.app.version,
      },
      error,
      userId: userContext.userId,
      tenantId: userContext.tenantId,
      sessionId: this.sessionId,
    };
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
  private consoleOutput(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const level = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${level}]`;
    
    const logData = {
      message: entry.message,
      context: entry.context,
      ...(entry.error && { error: entry.error }),
    };

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, logData);
        break;
      case LogLevel.INFO:
        console.info(prefix, logData);
        break;
      case LogLevel.WARN:
        console.warn(prefix, logData);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, logData);
        break;
    }
  }

  // Log methods
  debug(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.addLog(entry);
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.addLog(entry);
  }

  warn(message: string, context?: Record<string, any>, error?: Error) {
    const entry = this.createLogEntry(LogLevel.WARN, message, context, error);
    this.addLog(entry);
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.addLog(entry);
  }

  fatal(message: string, context?: Record<string, any>, error?: Error) {
    const entry = this.createLogEntry(LogLevel.FATAL, message, context, error);
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

  // Generic log method
  log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry = this.createLogEntry(level, message, context, error);
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
      if (filter?.type && entry.context?.type !== filter.type) {
        return false;
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
      
      const type = entry.context?.type || 'general';
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
