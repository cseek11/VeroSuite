/**
 * Observability test helpers for backend tests
 * Helps verify logs were emitted, trace IDs are present, etc.
 */

import { StructuredLoggerService } from '../../src/common/services/logger.service';

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
 * Mock logger service for testing
 */
export class MockLoggerService extends StructuredLoggerService {
  public logs: Array<{
    level: string;
    message: string;
    context?: string;
    operation?: string;
    severity?: string;
    errorCode?: string;
    rootCause?: string;
    traceId?: string;
    spanId?: string;
    requestId?: string;
    [key: string]: any;
  }> = [];

  private requestContexts = new Map<string, any>();

  setRequestContext(requestId: string, context: any) {
    this.requestContexts.set(requestId, context);
  }

  clearRequestContext(requestId: string) {
    this.requestContexts.delete(requestId);
  }

  getRequestContext(requestId: string) {
    return this.requestContexts.get(requestId);
  }

  log(message: string, context?: string, requestId?: string, operation?: string) {
    this.logs.push({
      level: 'log',
      message,
      context,
      operation,
      severity: 'info',
      ...(requestId && this.requestContexts.get(requestId)),
    });
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    requestId?: string,
    operation?: string,
    errorCode?: string,
    rootCause?: string
  ) {
    this.logs.push({
      level: 'error',
      message,
      context,
      operation,
      severity: 'error',
      errorCode,
      rootCause,
      trace,
      ...(requestId && this.requestContexts.get(requestId)),
    });
  }

  warn(
    message: string,
    context?: string,
    requestId?: string,
    operation?: string,
    errorCode?: string
  ) {
    this.logs.push({
      level: 'warn',
      message,
      context,
      operation,
      severity: 'warn',
      errorCode,
      ...(requestId && this.requestContexts.get(requestId)),
    });
  }

  debug(message: string, context?: string, requestId?: string, operation?: string) {
    this.logs.push({
      level: 'debug',
      message,
      context,
      operation,
      severity: 'debug',
      ...(requestId && this.requestContexts.get(requestId)),
    });
  }

  verbose(message: string, context?: string, requestId?: string, operation?: string) {
    this.logs.push({
      level: 'verbose',
      message,
      context,
      operation,
      severity: 'verbose',
      ...(requestId && this.requestContexts.get(requestId)),
    });
  }

  clear() {
    this.logs = [];
    this.requestContexts.clear();
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

