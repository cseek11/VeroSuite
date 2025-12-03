# Structured Logging Testing Guide

**Last Updated:** 2025-11-23  
**Rule:** R08 - Structured Logging  
**Purpose:** Guide for testing structured logging in VeroField applications

---

## Overview

This guide provides testing patterns for structured logging, covering:
- Required fields verification
- Trace ID propagation testing
- Logger injection testing
- Console.log elimination verification
- Optional fields testing

---

## Testing Philosophy

**Structured logging tests should verify:**
1. **Required fields present** - level, message, timestamp, traceId, context, operation, severity
2. **Proper logger usage** - StructuredLoggerService or Logger, not console.log
3. **Trace ID propagation** - traceId flows through service calls
4. **Optional fields when applicable** - tenantId, userId, errorCode, rootCause
5. **Logger injection** - Logger properly injected/imported

---

## Unit Testing Patterns

### Pattern 1: Testing Required Fields

**Objective:** Verify logs include all required fields.

```typescript
describe('Structured Logging - Required Fields', () => {
  it('should log with all required fields', async () => {
    // Arrange
    const mockLogger = {
      info: jest.fn()
    };
    const mockRequestContext = {
      getRequestId: jest.fn().mockReturnValue('req-123'),
      getTraceId: jest.fn().mockReturnValue('trace-456')
    };
    const service = new MyService(mockLogger, mockRequestContext);
    
    // Act
    await service.process(data);
    
    // Assert
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.any(String),                    // message
      'MyService',                           // context
      'req-123',                             // requestId (for traceId)
      'process',                             // operation
      expect.any(Object)                     // additionalData
    );
  });
});
```

### Pattern 2: Testing Trace ID Propagation

**Objective:** Verify traceId propagates through service calls.

```typescript
describe('Trace ID Propagation', () => {
  it('should propagate traceId to downstream services', async () => {
    // Arrange
    const mockLogger = {
      info: jest.fn()
    };
    const mockRequestContext = {
      getRequestId: jest.fn().mockReturnValue('req-123'),
      getTraceId: jest.fn().mockReturnValue('trace-456')
    };
    const mockDownstreamService = {
      process: jest.fn()
    };
    const service = new MyService(mockLogger, mockRequestContext, mockDownstreamService);
    
    // Act
    await service.processWithDownstream(data);
    
    // Assert
    // Verify traceId in logger call
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.any(String),
      'MyService',
      'req-123',  // requestId provides traceId
      'processWithDownstream',
      expect.any(Object)
    );
    
    // Verify traceId passed to downstream service
    expect(mockDownstreamService.process).toHaveBeenCalledWith(
      'trace-456',  // traceId propagated
      data
    );
  });
});
```

### Pattern 3: Testing Logger Injection

**Objective:** Verify logger is properly injected.

```typescript
describe('Logger Injection', () => {
  it('should inject StructuredLoggerService', () => {
    // Arrange
    const mockLogger = {
      info: jest.fn()
    };
    
    // Act
    const service = new MyService(mockLogger);
    
    // Assert
    expect(service['logger']).toBe(mockLogger);
  });
  
  it('should use injected logger for logging', async () => {
    // Arrange
    const mockLogger = {
      info: jest.fn()
    };
    const service = new MyService(mockLogger);
    
    // Act
    await service.process(data);
    
    // Assert
    expect(mockLogger.info).toHaveBeenCalled();
  });
});
```

### Pattern 4: Testing Console.log Elimination

**Objective:** Verify no console.log in production code.

```typescript
describe('Console.log Elimination', () => {
  it('should not use console.log in production code', () => {
    // This is more of a static analysis test
    // Use check-structured-logging.py or linter
    
    const code = fs.readFileSync('src/service.ts', 'utf-8');
    const hasConsoleLog = /console\.(log|error|warn|info|debug)/.test(code);
    
    expect(hasConsoleLog).toBe(false);
  });
});
```

### Pattern 5: Testing Optional Fields

**Objective:** Verify optional fields included when applicable.

```typescript
describe('Optional Fields', () => {
  it('should include errorCode and rootCause for error logs', async () => {
    // Arrange
    const mockLogger = {
      error: jest.fn()
    };
    const service = new MyService(mockLogger);
    mockApi.process.mockRejectedValue(new Error('API error'));
    
    // Act
    try {
      await service.process(data);
    } catch (error) {
      // Expected
    }
    
    // Assert
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.any(String),
      'MyService',
      expect.any(String),
      'process',
      expect.objectContaining({
        errorCode: expect.any(String),
        rootCause: expect.any(String)
      })
    );
  });
  
  it('should include tenantId for multi-tenant operations', async () => {
    // Arrange
    const mockLogger = {
      info: jest.fn()
    };
    const mockRequestContext = {
      getRequestId: jest.fn().mockReturnValue('req-123'),
      getTenantId: jest.fn().mockReturnValue('tenant-789')
    };
    const service = new MyService(mockLogger, mockRequestContext);
    
    // Act
    await service.processTenantData(data);
    
    // Assert
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.any(String),
      'MyService',
      'req-123',
      'processTenantData',
      expect.objectContaining({
        tenantId: 'tenant-789'
      })
    );
  });
});
```

---

## Integration Testing Patterns

### Pattern 6: Testing Logger Output Format

**Objective:** Verify logger produces structured JSON output.

```typescript
describe('Logger Output Format', () => {
  it('should produce structured JSON output', () => {
    // Arrange
    const logger = new StructuredLoggerService(configService);
    const consoleLogSpy = jest.spyOn(console, 'log');
    
    // Act
    logger.info('Test message', 'TestContext', 'req-123', 'testOp', { key: 'value' });
    
    // Assert
    expect(consoleLogSpy).toHaveBeenCalled();
    const logOutput = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(logOutput);
    
    expect(parsed).toMatchObject({
      level: 'log',
      message: 'Test message',
      context: 'TestContext',
      operation: 'testOp',
      severity: 'info',
      traceId: expect.any(String),
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
    });
  });
});
```

---

## E2E Testing Patterns

### Pattern 7: Testing End-to-End Logging

**Objective:** Verify logging works end-to-end in API requests.

```typescript
describe('E2E Logging', () => {
  it('should log API request with traceId', async () => {
    // Arrange
    const logSpy = jest.spyOn(console, 'log');
    
    // Act
    const response = await request(app)
      .post('/api/payments')
      .send(paymentData);
    
    // Assert
    expect(response.status).toBe(201);
    
    // Verify structured log was emitted
    const logs = logSpy.mock.calls.map(call => JSON.parse(call[0]));
    const paymentLog = logs.find(log => log.operation === 'processPayment');
    
    expect(paymentLog).toMatchObject({
      level: 'log',
      message: expect.any(String),
      context: 'PaymentService',
      operation: 'processPayment',
      traceId: expect.any(String),
      requestId: expect.any(String)
    });
  });
});
```

---

## Best Practices

### DO:
- ✅ Test all required fields are present
- ✅ Verify traceId propagates correctly
- ✅ Test logger injection
- ✅ Verify optional fields when applicable
- ✅ Test logger output format
- ✅ Use mocks for logger in unit tests
- ✅ Test error logging includes errorCode/rootCause

### DON'T:
- ❌ Skip logger injection tests
- ❌ Assume traceId propagates without testing
- ❌ Use console.log in tests (use logger)
- ❌ Test with real logger in unit tests
- ❌ Ignore optional fields in error logs

---

## Example: Complete Structured Logging Test Suite

```typescript
describe('PaymentService Structured Logging', () => {
  let service: PaymentService;
  let mockLogger: any;
  let mockRequestContext: any;
  
  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    };
    mockRequestContext = {
      getRequestId: jest.fn().mockReturnValue('req-123'),
      getTraceId: jest.fn().mockReturnValue('trace-456'),
      getTenantId: jest.fn().mockReturnValue('tenant-789')
    };
    
    service = new PaymentService(mockLogger, mockRequestContext);
  });
  
  describe('processPayment', () => {
    it('should log with all required fields', async () => {
      // Arrange
      const paymentData = { amount: 100, currency: 'USD' };
      
      // Act
      await service.processPayment(paymentData);
      
      // Assert
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Processing payment',
        'PaymentService',
        'req-123',
        'processPayment',
        expect.objectContaining({
          amount: 100,
          currency: 'USD'
        })
      );
    });
    
    it('should include tenantId in logs', async () => {
      // Arrange
      const paymentData = { amount: 100, currency: 'USD' };
      
      // Act
      await service.processPayment(paymentData);
      
      // Assert
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.any(String),
        'PaymentService',
        'req-123',
        'processPayment',
        expect.objectContaining({
          tenantId: 'tenant-789'
        })
      );
    });
    
    it('should log errors with errorCode and rootCause', async () => {
      // Arrange
      mockApi.process.mockRejectedValue(new Error('Payment failed'));
      
      // Act
      try {
        await service.processPayment(paymentData);
        fail('Should have thrown');
      } catch (error) {
        // Expected
      }
      
      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Payment processing failed',
        'PaymentService',
        'req-123',
        'processPayment',
        expect.objectContaining({
          errorCode: 'PAYMENT_FAILED',
          rootCause: 'Payment failed'
        })
      );
    });
    
    it('should propagate traceId to downstream services', async () => {
      // Arrange
      const mockDownstream = jest.fn();
      service.downstreamService = { process: mockDownstream };
      
      // Act
      await service.processPayment(paymentData);
      
      // Assert
      expect(mockDownstream).toHaveBeenCalledWith(
        'trace-456',
        expect.any(Object)
      );
    });
  });
});
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** Platform Core Team  
**Review Frequency:** Quarterly or when observability requirements change





