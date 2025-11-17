import { randomUUID } from 'crypto';

/**
 * Trace propagation utilities for distributed tracing
 * MANDATORY: All service boundaries must propagate traceId, spanId, and requestId
 */

export interface TraceContext {
  traceId: string;
  spanId: string;
  requestId: string;
}

/**
 * Generate a new trace ID
 */
export function generateTraceId(): string {
  return randomUUID();
}

/**
 * Generate a new span ID
 */
export function generateSpanId(): string {
  return randomUUID();
}

/**
 * Generate a new request ID
 */
export function generateRequestId(): string {
  return randomUUID();
}

/**
 * Extract trace context from HTTP headers
 */
export function extractTraceContextFromHeaders(headers: Record<string, string | string[] | undefined>): TraceContext | null {
  const traceId = getHeaderValue(headers, 'x-trace-id');
  const spanId = getHeaderValue(headers, 'x-span-id');
  const requestId = getHeaderValue(headers, 'x-request-id');

  if (!traceId) {
    return null;
  }

  return {
    traceId,
    spanId: spanId || generateSpanId(),
    requestId: requestId || generateRequestId(),
  };
}

/**
 * Create trace context from existing context or generate new
 */
export function createOrExtendTraceContext(
  existingContext?: TraceContext | null,
  parentSpanId?: string
): TraceContext {
  if (existingContext) {
    return {
      traceId: existingContext.traceId,
      spanId: parentSpanId || generateSpanId(),
      requestId: existingContext.requestId,
    };
  }

  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    requestId: generateRequestId(),
  };
}

/**
 * Add trace context to HTTP headers
 */
export function addTraceContextToHeaders(
  headers: Record<string, string>,
  context: TraceContext
): Record<string, string> {
  return {
    ...headers,
    'x-trace-id': context.traceId,
    'x-span-id': context.spanId,
    'x-request-id': context.requestId,
  };
}

/**
 * Get header value as string (handles string[] arrays)
 */
function getHeaderValue(
  headers: Record<string, string | string[] | undefined>,
  key: string
): string | null {
  const value = headers[key.toLowerCase()];
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    return value[0] || null;
  }
  return value;
}

/**
 * Create trace context for NestJS request
 */
export function createTraceContextForRequest(req: any): TraceContext {
  const existingContext = extractTraceContextFromHeaders(req.headers || {});
  
  if (existingContext) {
    // Extend existing trace with new span
    return {
      traceId: existingContext.traceId,
      spanId: generateSpanId(),
      requestId: existingContext.requestId,
    };
  }

  // Create new trace context
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    requestId: generateRequestId(),
  };
}

/**
 * Set trace context on NestJS request object
 */
export function setTraceContextOnRequest(req: any, context: TraceContext): void {
  req.traceId = context.traceId;
  req.spanId = context.spanId;
  req.requestId = context.requestId;
}

/**
 * Get trace context from NestJS request object
 */
export function getTraceContextFromRequest(req: any): TraceContext | null {
  if (req.traceId && req.spanId && req.requestId) {
    return {
      traceId: req.traceId,
      spanId: req.spanId,
      requestId: req.requestId,
    };
  }
  return null;
}

