/**
 * Trace propagation utilities for frontend
 * MANDATORY: All API calls must propagate traceId, spanId, and requestId
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
  return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a new span ID
 */
export function generateSpanId(): string {
  return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a new request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create trace context from session storage
 * Maintains trace ID across page navigation within the same session
 */
export function getOrCreateTraceContext(): TraceContext {
  const traceKey = 'verofield_trace_id';
  const requestKey = 'verofield_request_id';
  
  let traceId = sessionStorage.getItem(traceKey);
  if (!traceId) {
    traceId = generateTraceId();
    sessionStorage.setItem(traceKey, traceId);
  }

  // Request ID is generated per request (not stored)
  const requestId = generateRequestId();
  
  // Span ID is generated per operation
  const spanId = generateSpanId();

  return {
    traceId,
    spanId,
    requestId,
  };
}

/**
 * Create new trace context (for new sessions or explicit new trace)
 */
export function createTraceContext(): TraceContext {
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    requestId: generateRequestId(),
  };
}

/**
 * Extract trace context from response headers
 * Used when receiving trace context from backend
 */
export function extractTraceContextFromHeaders(headers: Headers): TraceContext | null {
  const traceId = headers.get('x-trace-id');
  const spanId = headers.get('x-span-id');
  const requestId = headers.get('x-request-id');

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
 * Add trace context to fetch request headers
 */
export function addTraceContextToHeaders(
  headers: HeadersInit,
  context: TraceContext
): HeadersInit {
  const headersObj = headers instanceof Headers ? headers : new Headers(headers);
  
  headersObj.set('x-trace-id', context.traceId);
  headersObj.set('x-span-id', context.spanId);
  headersObj.set('x-request-id', context.requestId);

  return headersObj;
}

/**
 * Create trace context for API call
 * Generates new span ID for each API call while maintaining trace ID
 */
export function createTraceContextForApiCall(): TraceContext {
  const traceKey = 'verofield_trace_id';
  
  // Get existing trace ID or create new
  let traceId = sessionStorage.getItem(traceKey);
  if (!traceId) {
    traceId = generateTraceId();
    sessionStorage.setItem(traceKey, traceId);
  }

  // New span and request for each API call
  return {
    traceId,
    spanId: generateSpanId(),
    requestId: generateRequestId(),
  };
}

/**
 * Store trace context in session storage
 */
export function storeTraceContext(context: TraceContext): void {
    sessionStorage.setItem('verofield_trace_id', context.traceId);
  // Note: spanId and requestId are not stored as they're per-operation
}

/**
 * Clear trace context from session storage
 */
export function clearTraceContext(): void {
    sessionStorage.removeItem('verofield_trace_id');
}

/**
 * Get current trace ID from session storage
 */
export function getCurrentTraceId(): string | null {
  return sessionStorage.getItem('verofield_trace_id');
}

