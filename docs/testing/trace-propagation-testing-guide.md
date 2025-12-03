# Trace Propagation Testing Guide

**Rule:** R09 - Trace Propagation  
**Purpose:** Ensure traceId propagates across all service boundaries  
**Last Updated:** 2025-11-23

---

## Overview

This guide provides testing patterns for verifying trace propagation across:
- HTTP headers (x-trace-id, x-span-id, x-request-id)
- Service-to-service calls
- Database queries
- External API calls
- Message queues
- Frontend-backend boundaries

---

## Testing Patterns

### 1. HTTP Header Propagation

**Objective:** Verify traceId is included in HTTP request headers.

```typescript
describe('HTTP Header Propagation', () => {
  it('should include trace headers in HTTP requests', async () => {
    // Arrange
    const traceContext = {
      traceId: 'trace-123',
      spanId: 'span-456',
      requestId: 'req-789'
    };
    
    jest.spyOn(requestContext, 'getTraceContext').mockReturnValue(traceContext);
    
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' })
    } as Response);
    
    // Act
    await service.callExternalAPI();
    
    // Assert
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-trace-id': 'trace-123',
          'x-span-id': 'span-456',
          'x-request-id': 'req-789'
        })
      })
    );
  });
});
```

---

### 2. Service-to-Service Propagation

**Objective:** Verify traceId is passed to downstream services.

```typescript
describe('Service-to-Service Propagation', () => {
  it('should propagate traceId to downstream services', async () => {
    // Arrange
    const traceId = 'trace-123';
    jest.spyOn(requestContext, 'getTraceId').mockReturnValue(traceId);
    
    const downstreamSpy = jest.spyOn(downstreamService, 'process');
    
    // Act
    await service.processData(data);
    
    // Assert
    expect(downstreamSpy).toHaveBeenCalledWith(
      traceId,  // TraceId passed as parameter
      expect.any(Object)
    );
  });
});
```

---

### 3. Database Propagation

**Objective:** Verify traceId is included in database query context.

```typescript
describe('Database Propagation', () => {
  it('should include traceId in database query context', async () => {
    // Arrange
    const traceId = 'trace-123';
    jest.spyOn(requestContext, 'getTraceId').mockReturnValue(traceId);
    
    const executeSpy = jest.spyOn(prisma, '$executeRaw');
    
    // Act
    await service.queryUsers(tenantId);
    
    // Assert
    expect(executeSpy).toHaveBeenCalledWith(
      expect.stringContaining('SET LOCAL app.trace_id')
    );
    expect(executeSpy).toHaveBeenCalledWith(
      expect.stringContaining(traceId)
    );
  });
  
  it('should use trace context wrapper for database queries', async () => {
    // Arrange
    const traceId = 'trace-123';
    const wrapperSpy = jest.spyOn(databaseService, 'withTraceContext');
    
    // Act
    await service.queryUsers(tenantId);
    
    // Assert
    expect(wrapperSpy).toHaveBeenCalledWith(
      traceId,
      expect.any(Function)
    );
  });
});
```

---

### 4. External API Propagation

**Objective:** Verify traceId is included in external API call headers.

```typescript
describe('External API Propagation', () => {
  it('should include trace headers in external API calls', async () => {
    // Arrange
    const traceContext = {
      traceId: 'trace-123',
      spanId: 'span-456',
      requestId: 'req-789'
    };
    
    jest.spyOn(requestContext, 'getTraceContext').mockReturnValue(traceContext);
    
    const axiosSpy = jest.spyOn(axios, 'get').mockResolvedValue({
      data: { result: 'success' }
    });
    
    // Act
    await service.callExternalService();
    
    // Assert
    expect(axiosSpy).toHaveBeenCalledWith(
      'https://external-api.com/data',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-trace-id': 'trace-123'
        })
      })
    );
  });
});
```

---

### 5. Message Queue Propagation

**Objective:** Verify traceId is included in message queue message headers.

```typescript
describe('Message Queue Propagation', () => {
  it('should include trace headers in message queue messages', async () => {
    // Arrange
    const traceContext = {
      traceId: 'trace-123',
      spanId: 'span-456',
      requestId: 'req-789'
    };
    
    jest.spyOn(requestContext, 'getTraceContext').mockReturnValue(traceContext);
    
    const publishSpy = jest.spyOn(channel, 'publish');
    
    // Act
    await service.publishEvent(eventData);
    
    // Assert
    expect(publishSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Buffer),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-trace-id': 'trace-123',
          'x-span-id': 'span-456'
        })
      })
    );
  });
});
```

---

### 6. Frontend-Backend Propagation

**Objective:** Verify traceId propagates from frontend to backend.

```typescript
describe('Frontend-Backend Propagation', () => {
  it('should include trace headers in API requests', async () => {
    // Arrange
    const traceContext = getOrCreateTraceContext();
    const fetchSpy = jest.spyOn(global, 'fetch');
    
    // Act
    await apiClient.getUsers();
    
    // Assert
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-trace-id': traceContext.traceId
        })
      })
    );
  });
  
  it('should extract trace context from API response', async () => {
    // Arrange
    const responseHeaders = new Headers({
      'x-trace-id': 'trace-123',
      'x-span-id': 'span-456'
    });
    
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      headers: responseHeaders,
      json: async () => ({ data: 'test' })
    } as Response);
    
    // Act
    const response = await apiClient.getUsers();
    
    // Assert
    const extractedContext = extractTraceContextFromHeaders(response.headers);
    expect(extractedContext.traceId).toBe('trace-123');
  });
});
```

---

### 7. Trace Context Creation

**Objective:** Verify trace context is created at request entry point.

```typescript
describe('Trace Context Creation', () => {
  it('should create trace context for new requests', async () => {
    // Arrange
    const request = {
      headers: {}  // No trace headers
    };
    
    // Act
    const traceContext = createTraceContextForRequest(request);
    
    // Assert
    expect(traceContext.traceId).toBeDefined();
    expect(traceContext.spanId).toBeDefined();
    expect(traceContext.requestId).toBeDefined();
  });
  
  it('should extract trace context from existing headers', async () => {
    // Arrange
    const request = {
      headers: {
        'x-trace-id': 'trace-123',
        'x-span-id': 'span-456',
        'x-request-id': 'req-789'
      }
    };
    
    // Act
    const traceContext = createTraceContextForRequest(request);
    
    // Assert
    expect(traceContext.traceId).toBe('trace-123');
    expect(traceContext.spanId).not.toBe('span-456');  // New span for this service
    expect(traceContext.requestId).toBe('req-789');
  });
});
```

---

### 8. Span Creation

**Objective:** Verify new spans are created for child operations.

```typescript
describe('Span Creation', () => {
  it('should create child span for downstream service call', async () => {
    // Arrange
    const parentContext = {
      traceId: 'trace-123',
      spanId: 'span-456',
      requestId: 'req-789'
    };
    
    // Act
    const childContext = createChildSpan(parentContext);
    
    // Assert
    expect(childContext.traceId).toBe('trace-123');  // Same trace
    expect(childContext.spanId).not.toBe('span-456');  // New span
    expect(childContext.requestId).toBe('req-789');  // Same request
  });
});
```

---

### 9. Trace Utility Usage

**Objective:** Verify trace propagation utilities are used correctly.

```typescript
describe('Trace Utility Usage', () => {
  it('should use addTraceContextToHeaders utility', () => {
    // Arrange
    const headers = { 'Content-Type': 'application/json' };
    const traceContext = {
      traceId: 'trace-123',
      spanId: 'span-456',
      requestId: 'req-789'
    };
    
    // Act
    const enrichedHeaders = addTraceContextToHeaders(headers, traceContext);
    
    // Assert
    expect(enrichedHeaders).toEqual({
      'Content-Type': 'application/json',
      'x-trace-id': 'trace-123',
      'x-span-id': 'span-456',
      'x-request-id': 'req-789'
    });
  });
});
```

---

## Integration Testing

### End-to-End Trace Propagation

```typescript
describe('E2E Trace Propagation', () => {
  it('should propagate trace through entire request flow', async () => {
    // Arrange
    const traceId = 'trace-e2e-123';
    
    // Act
    const response = await request(app)
      .get('/api/users')
      .set('x-trace-id', traceId)
      .set('x-span-id', 'span-e2e-456')
      .set('x-request-id', 'req-e2e-789');
    
    // Assert
    expect(response.status).toBe(200);
    
    // Verify trace propagated to logs
    const logs = await getLogsForTrace(traceId);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.every(log => log.traceId === traceId)).toBe(true);
    
    // Verify trace propagated to database
    const dbLogs = await getDatabaseLogsForTrace(traceId);
    expect(dbLogs.length).toBeGreaterThan(0);
    
    // Verify trace propagated to downstream services
    const serviceLogs = await getServiceLogsForTrace(traceId);
    expect(serviceLogs.length).toBeGreaterThan(0);
  });
});
```

---

## Common Patterns

### Pattern 1: HTTP Client with Trace Headers

```typescript
// ✅ CORRECT: Using trace utility
const traceContext = this.requestContext.getTraceContext();
const headers = addTraceContextToHeaders({}, traceContext);
const response = await fetch(url, { headers });
```

### Pattern 2: Service Call with TraceId

```typescript
// ✅ CORRECT: Passing traceId to downstream service
const traceId = this.requestContext.getTraceId();
await this.downstreamService.process(traceId, data);
```

### Pattern 3: Database Query with Trace Context

```typescript
// ✅ CORRECT: Using trace context wrapper
const traceId = this.requestContext.getTraceId();
await withTraceContext(traceId, async () => {
  return this.prisma.user.findMany({ where: { tenantId } });
});
```

---

## Testing Checklist

- [ ] HTTP calls include trace headers (x-trace-id, x-span-id, x-request-id)
- [ ] Service calls pass traceId as parameter
- [ ] Database queries include traceId in context
- [ ] External API calls include trace headers
- [ ] Message queue messages include trace headers
- [ ] Frontend API calls include trace headers
- [ ] Trace context is created at request entry point
- [ ] Child spans are created for downstream operations
- [ ] Trace utilities are used correctly
- [ ] End-to-end trace propagation works

---

## Debugging Tips

### Tip 1: Verify Trace Context Availability

```typescript
// Check if trace context is available
const traceContext = this.requestContext.getTraceContext();
console.log('Trace Context:', traceContext);
```

### Tip 2: Verify HTTP Headers

```typescript
// Log HTTP headers to verify trace headers
console.log('Request Headers:', request.headers);
```

### Tip 3: Verify Database Context

```typescript
// Check if trace context is set in database
await this.prisma.$executeRaw`SELECT current_setting('app.trace_id', true)`;
```

---

## Best Practices

1. **Always use trace utilities** - Use `addTraceContextToHeaders()` instead of manually adding headers
2. **Pass traceId explicitly** - Don't rely on implicit context propagation
3. **Create child spans** - Generate new spanId for each downstream operation
4. **Test trace propagation** - Verify traceId flows through entire request
5. **Log with traceId** - Include traceId in all structured logs
6. **Handle missing traces** - Create new trace if not present
7. **Propagate to external services** - Include trace headers even for external APIs

---

**Last Updated:** 2025-11-23  
**Maintained By:** Platform Core Team  
**Review Frequency:** Quarterly or when observability requirements change





