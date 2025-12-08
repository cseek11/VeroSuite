"use strict";
/**
 * Trace propagation utilities for frontend
 * MANDATORY: All API calls must propagate traceId, spanId, and requestId
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTraceId = generateTraceId;
exports.generateSpanId = generateSpanId;
exports.generateRequestId = generateRequestId;
exports.getOrCreateTraceContext = getOrCreateTraceContext;
exports.createTraceContext = createTraceContext;
exports.extractTraceContextFromHeaders = extractTraceContextFromHeaders;
exports.addTraceContextToHeaders = addTraceContextToHeaders;
exports.createTraceContextForApiCall = createTraceContextForApiCall;
exports.storeTraceContext = storeTraceContext;
exports.clearTraceContext = clearTraceContext;
exports.getCurrentTraceId = getCurrentTraceId;
/**
 * Generate a new trace ID
 */
function generateTraceId() {
    return "trace_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
}
/**
 * Generate a new span ID
 */
function generateSpanId() {
    return "span_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
}
/**
 * Generate a new request ID
 */
function generateRequestId() {
    return "req_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
}
/**
 * Get or create trace context from session storage
 * Maintains trace ID across page navigation within the same session
 */
function getOrCreateTraceContext() {
    var traceKey = 'verofield_trace_id';
    var traceId = sessionStorage.getItem(traceKey);
    if (!traceId) {
        traceId = generateTraceId();
        sessionStorage.setItem(traceKey, traceId);
    }
    // Request ID is generated per request (not stored)
    var requestId = generateRequestId();
    // Span ID is generated per operation
    var spanId = generateSpanId();
    return {
        traceId: traceId,
        spanId: spanId,
        requestId: requestId,
    };
}
/**
 * Create new trace context (for new sessions or explicit new trace)
 */
function createTraceContext() {
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
function extractTraceContextFromHeaders(headers) {
    var traceId = headers.get('x-trace-id');
    var spanId = headers.get('x-span-id');
    var requestId = headers.get('x-request-id');
    if (!traceId) {
        return null;
    }
    return {
        traceId: traceId,
        spanId: spanId || generateSpanId(),
        requestId: requestId || generateRequestId(),
    };
}
/**
 * Add trace context to fetch request headers
 */
function addTraceContextToHeaders(headers, context) {
    var headersObj = headers instanceof Headers ? headers : new Headers(headers);
    headersObj.set('x-trace-id', context.traceId);
    headersObj.set('x-span-id', context.spanId);
    headersObj.set('x-request-id', context.requestId);
    return headersObj;
}
/**
 * Create trace context for API call
 * Generates new span ID for each API call while maintaining trace ID
 */
function createTraceContextForApiCall() {
    var traceKey = 'verofield_trace_id';
    // Get existing trace ID or create new
    var traceId = sessionStorage.getItem(traceKey);
    if (!traceId) {
        traceId = generateTraceId();
        sessionStorage.setItem(traceKey, traceId);
    }
    // New span and request for each API call
    return {
        traceId: traceId,
        spanId: generateSpanId(),
        requestId: generateRequestId(),
    };
}
/**
 * Store trace context in session storage
 */
function storeTraceContext(context) {
    sessionStorage.setItem('verofield_trace_id', context.traceId);
    // Note: spanId and requestId are not stored as they're per-operation
}
/**
 * Clear trace context from session storage
 */
function clearTraceContext() {
    sessionStorage.removeItem('verofield_trace_id');
}
/**
 * Get current trace ID from session storage
 */
function getCurrentTraceId() {
    return sessionStorage.getItem('verofield_trace_id');
}
