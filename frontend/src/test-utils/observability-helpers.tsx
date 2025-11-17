/**
 * Observability test helpers for frontend tests
 * Helps verify logs were emitted, trace IDs are present, etc.
 */

import { Logger, LogLevel } from '../lib/logger';

export interface LogAssertion {
  message?: string | RegExp;
  context?: string;
  operation?: string;
  severity?: 'info' | 'warn' | 'error' | 'debug' | 'verbose';
  errorCode?: string;
  traceId?: string;
  spanId?: string;
  requestId?: string;
}

/**
 * Mock logger for testing
 */
export class MockLogger {
  public logs: Array<{
    level: LogLevel;
    message: string;
    context?: string;
    operation?: string;
    severity?: 'info' | 'warn' | 'error' | 'debug' | 'verbose';
    errorCode?: string;
    rootCause?: string;
    traceId?: string;
    spanId?: string;
    requestId?: string;
    [key: string]: any;
  }> = [];

  debug(
    message: string,
    context?: string | Record<string, any>,
    operation?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    this.logs.push({
      level: LogLevel.DEBUG,
      message,
      context: typeof context === 'string' ? context : undefined,
      operation,
      severity: 'debug',
      traceId,
      spanId,
      requestId,
    });
  }

  info(
    message: string,
    context?: string | Record<string, any>,
    operation?: string,
    traceId?: string,
    spanId?: string,
    requestId?: string
  ) {
    this.logs.push({
      level: LogLevel.INFO,
      message,
      context: typeof context === 'string' ? context : undefined,
      operation,
      severity: 'info',
      traceId,
      spanId,
      requestId,
    });
  }

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
    this.logs.push({
      level: LogLevel.WARN,
      message,
      context: typeof context === 'string' ? context : undefined,
      operation,
      severity: 'warn',
      errorCode,
      traceId,
      spanId,
      requestId,
    });
  }

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
    this.logs.push({
      level: LogLevel.ERROR,
      message,
      context: typeof context === 'string' ? context : undefined,
      operation,
      severity: 'error',
      errorCode,
      rootCause,
      traceId,
      spanId,
      requestId,
    });
  }

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
    this.logs.push({
      level: LogLevel.FATAL,
      message,
      context: typeof context === 'string' ? context : undefined,
      operation,
      severity: 'error',
      errorCode,
      rootCause,
      traceId,
      spanId,
      requestId,
    });
  }

  clear() {
    this.logs = [];
  }
}

/**
 * Assert that a log was emitted matching the assertion
 */
export function assertLogEmitted(
  logs: any[],
  assertion: LogAssertion
): { found: boolean; matchingLog?: any } {
  for (const log of logs) {
    let matches = true;

    if (assertion.message) {
      if (assertion.message instanceof RegExp) {
        matches = matches && assertion.message.test(log.message);
      } else {
        matches = matches && log.message.includes(assertion.message);
      }
    }

    if (assertion.context) {
      matches = matches && log.context === assertion.context;
    }

    if (assertion.operation) {
      matches = matches && log.operation === assertion.operation;
    }

    if (assertion.severity) {
      matches = matches && log.severity === assertion.severity;
    }

    if (assertion.errorCode) {
      matches = matches && log.errorCode === assertion.errorCode;
    }

    if (assertion.traceId) {
      matches = matches && log.traceId === assertion.traceId;
    }

    if (assertion.spanId) {
      matches = matches && log.spanId === assertion.spanId;
    }

    if (assertion.requestId) {
      matches = matches && log.requestId === assertion.requestId;
    }

    if (matches) {
      return { found: true, matchingLog: log };
    }
  }

  return { found: false };
}

/**
 * Assert that required log fields are present
 */
export function assertLogHasRequiredFields(log: any): {
  valid: boolean;
  missingFields: string[];
} {
  const requiredFields = ['message', 'context', 'severity', 'timestamp'];
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (!log[field]) {
      missingFields.push(field);
    }
  });

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Assert that error log has required error fields
 */
export function assertErrorLogHasRequiredFields(log: any): {
  valid: boolean;
  missingFields: string[];
} {
  const requiredFields = ['message', 'context', 'severity', 'timestamp'];
  const recommendedFields = ['errorCode', 'rootCause', 'operation'];
  const missingFields: string[] = [];
  const missingRecommended: string[] = [];

  requiredFields.forEach((field) => {
    if (!log[field]) {
      missingFields.push(field);
    }
  });

  recommendedFields.forEach((field) => {
    if (!log[field]) {
      missingRecommended.push(field);
    }
  });

  return {
    valid: missingFields.length === 0,
    missingFields: [...missingFields, ...missingRecommended],
  };
}

/**
 * Assert that trace IDs are present in logs
 */
export function assertTraceIdsPresent(logs: any[]): {
  valid: boolean;
  logsWithoutTraceId: any[];
} {
  const logsWithoutTraceId = logs.filter((log) => !log.traceId);

  return {
    valid: logsWithoutTraceId.length === 0,
    logsWithoutTraceId,
  };
}

/**
 * Create log capture utility for tests
 */
export function createLogCapture() {
  const logs: any[] = [];

  return {
    capture: (log: any) => {
      logs.push(log);
    },
    getLogs: () => logs,
    clear: () => {
      logs.length = 0;
    },
    assertLogEmitted: (assertion: LogAssertion) => {
      return assertLogEmitted(logs, assertion);
    },
  };
}

