/**
 * Centralized logging utility
 * Replaces console.log/error/warn with structured logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  private formatMessage(level: LogLevel, message: string, data?: Record<string, any>, context?: string): LogEntry {
    return {
      level,
      message,
      data: data || {},
      timestamp: new Date().toISOString(),
      context: context || 'CardSystem',
    };
  }

  private addToHistory(entry: LogEntry) {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return false;
    }
    return true;
  }

  debug(message: string, data?: Record<string, any>, context?: string) {
    const entry = this.formatMessage('debug', message, data, context);
    this.addToHistory(entry);
    
    if (this.shouldLog('debug')) {
      console.debug(`[${entry.context}] ${message}`, data || '');
    }
  }

  info(message: string, data?: Record<string, any>, context?: string) {
    const entry = this.formatMessage('info', message, data, context);
    this.addToHistory(entry);
    
    if (this.shouldLog('info')) {
      console.info(`[${entry.context}] ${message}`, data || '');
    }
  }

  warn(message: string, data?: Record<string, any>, context?: string) {
    const entry = this.formatMessage('warn', message, data, context);
    this.addToHistory(entry);
    
    console.warn(`[${entry.context}] ⚠️ ${message}`, data || '');
  }

  error(message: string, error?: Error | unknown, context?: string) {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack, name: error.name }
      : { error };
    
    const entry = this.formatMessage('error', message, errorData, context);
    this.addToHistory(entry);
    
    console.error(`[${entry.context}] ❌ ${message}`, errorData);
    
    // In production, send to error tracking service (e.g., Sentry)
    if (!this.isDevelopment && typeof window !== 'undefined') {
      // TODO: Integrate with error tracking service
      // window.errorTracking?.captureException(error);
    }
  }

  // Get recent logs for debugging
  getHistory(level?: LogLevel, limit = 50): LogEntry[] {
    let logs = this.logHistory;
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    return logs.slice(-limit);
  }

  // Clear log history
  clearHistory() {
    this.logHistory = [];
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions
export const logDebug = (message: string, data?: Record<string, any>, context?: string) => 
  logger.debug(message, data, context);
export const logInfo = (message: string, data?: Record<string, any>, context?: string) => 
  logger.info(message, data, context);
export const logWarn = (message: string, data?: Record<string, any>, context?: string) => 
  logger.warn(message, data, context);
export const logError = (message: string, error?: Error | unknown, context?: string) => 
  logger.error(message, error, context);







