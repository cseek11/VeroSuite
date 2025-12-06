# Error Handling Testing Guide

**Last Updated:** 2025-12-05  
**Rule:** R07 - Error Handling  
**Purpose:** Guide for testing error handling in VeroField applications

---

## Overview

This guide provides comprehensive testing patterns for error handling, covering:
- Silent failure prevention
- Error logging verification
- Error categorization testing
- User-facing message safety
- Error propagation testing

---

## Testing Philosophy

**Error handling tests should verify:**
1. **No silent failures** - All errors are logged and handled
2. **Proper logging** - Errors logged with context, operation, errorCode, rootCause, traceId
3. **Correct categorization** - Errors mapped to appropriate HTTP status codes
4. **Safe messages** - User-facing messages don't leak sensitive information
5. **Proper propagation** - Errors propagate with context intact

---

## Unit Testing Patterns

### Pattern 1: Testing Error Logging

**Objective:** Verify errors are logged with proper context.

```typescript
describe('Error Logging', () => {
  it('should log error with context when operation fails', async () => {
    // Arrange
    const mockLogger = {
      error: jest.fn()
    };
    const service = new MyService(mockLogger);
    mockApi.get.mockRejectedValue(new Error('API error'));
    
    // Act & Assert
    await expect(service.fetchData()).rejects.toThrow();
    
    // Verify logging
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('API error'),
      expect.objectContaining({
        context: 'MyService',
        operation: 'fetchData',
        errorCode: 'FETCH_FAILED',
        rootCause: 'API error',
        traceId: expect.any(String)
      })
    );
  });
});
```

### Pattern 2: Testing Error Categorization

**Objective:** Verify errors are categorized correctly.

```typescript
describe('Error Categorization', () => {
  it('should throw BadRequestException for validation errors', async () => {
    // Arrange
    const service = new MyService();
    const invalidInput = { email: 'not-an-email' };
    
    // Act & Assert
    await expect(service.processInput(invalidInput))
      .rejects
      .toThrow(BadRequestException);
  });
  
  it('should throw UnprocessableEntityException for business rule errors', async () => {
    // Arrange
    const service = new MyService();
    const input = { amount: -100 }; // Negative amount violates business rule
    
    // Act & Assert
    await expect(service.processPayment(input))
      .rejects
      .toThrow(UnprocessableEntityException);
  });
  
  it('should throw InternalServerErrorException for system errors', async () => {
    // Arrange
    const service = new MyService();
    mockDatabase.query.mockRejectedValue(new Error('Database connection failed'));
    
    // Act & Assert
    await expect(service.fetchData())
      .rejects
      .toThrow(InternalServerErrorException);
  });
});
```

### Pattern 3: Testing User-Facing Messages

**Objective:** Verify error messages are safe and helpful.

```typescript
describe('User-Facing Messages', () => {
  it('should not leak stack traces in error messages', async () => {
    // Arrange
    const service = new MyService();
    mockApi.get.mockRejectedValue(new Error('Internal error'));
    
    // Act
    try {
      await service.fetchData();
      fail('Should have thrown');
    } catch (error) {
      // Assert
      expect(error.message).not.toContain('at '); // No stack trace
      expect(error.message).not.toContain('.ts:'); // No file paths
      expect(error.message).not.toContain('Error:'); // No raw error
    }
  });
  
  it('should provide helpful error messages', async () => {
    // Arrange
    const service = new MyService();
    mockApi.get.mockRejectedValue(new Error('API error'));
    
    // Act
    try {
      await service.fetchData();
      fail('Should have thrown');
    } catch (error) {
      // Assert
      expect(error.message).toContain('Unable to fetch data');
      expect(error.message).toContain('try again');
      expect(error.message).not.toContain('uuid:'); // No internal IDs
    }
  });
});
```

### Pattern 4: Testing Error Propagation

**Objective:** Verify errors propagate with context.

```typescript
describe('Error Propagation', () => {
  it('should propagate error with traceId', async () => {
    // Arrange
    const mockRequestContext = {
      getTraceId: jest.fn().mockReturnValue('trace-123')
    };
    const service = new MyService(mockRequestContext);
    mockApi.get.mockRejectedValue(new Error('API error'));
    
    // Act
    try {
      await service.fetchData();
      fail('Should have thrown');
    } catch (error) {
      // Assert
      expect(error).toHaveProperty('traceId', 'trace-123');
    }
  });
  
  it('should propagate error with original context', async () => {
    // Arrange
    const service = new MyService();
    const originalError = new Error('Original error');
    originalError.context = { userId: '123' };
    mockApi.get.mockRejectedValue(originalError);
    
    // Act
    try {
      await service.fetchData();
      fail('Should have thrown');
    } catch (error) {
      // Assert
      expect(error.context).toEqual({ userId: '123' });
    }
  });
});
```

### Pattern 5: Testing Silent Failure Prevention

**Objective:** Verify no empty catch blocks or swallowed promises.

```typescript
describe('Silent Failure Prevention', () => {
  it('should not have empty catch blocks', async () => {
    // This is more of a static analysis test
    // Use error-pattern-detector.util.ts or check-error-handling.py
    
    const code = await fs.readFile('src/service.ts', 'utf-8');
    const detections = detectEmptyCatchBlocks(code, 'src/service.ts');
    
    expect(detections).toHaveLength(0);
  });
  
  it('should not swallow promises', async () => {
    // Arrange
    const mockLogger = {
      error: jest.fn()
    };
    const service = new MyService(mockLogger);
    mockApi.get.mockRejectedValue(new Error('API error'));
    
    // Act
    await service.backgroundSync(); // Fire-and-forget operation
    
    // Assert - Even fire-and-forget should log errors
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
```

---

## Integration Testing Patterns

### Pattern 6: Testing Error Handling Across Services

**Objective:** Verify error handling in service-to-service communication.

```typescript
describe('Cross-Service Error Handling', () => {
  it('should handle downstream service errors gracefully', async () => {
    // Arrange
    const mockLogger = {
      error: jest.fn()
    };
    const service = new MyService(mockLogger);
    mockDownstreamService.process.mockRejectedValue(new Error('Downstream error'));
    
    // Act
    const result = await service.processWithFallback(data);
    
    // Assert
    expect(result).toBeDefined(); // Fallback worked
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Downstream error'),
      expect.objectContaining({
        context: 'MyService',
        operation: 'processWithFallback',
        errorCode: 'DOWNSTREAM_FAILED',
        traceId: expect.any(String)
      })
    );
  });
});
```

### Pattern 7: Testing Error Handling with Database Operations

**Objective:** Verify database errors are handled properly.

```typescript
describe('Database Error Handling', () => {
  it('should log and throw error on database failure', async () => {
    // Arrange
    const mockLogger = {
      error: jest.fn()
    };
    const service = new MyService(mockLogger);
    mockPrisma.user.findMany.mockRejectedValue(new Error('Database connection failed'));
    
    // Act & Assert
    await expect(service.getUsers()).rejects.toThrow(InternalServerErrorException);
    
    // Verify logging
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Database connection failed'),
      expect.objectContaining({
        context: 'MyService',
        operation: 'getUsers',
        errorCode: 'DB_QUERY_FAILED',
        traceId: expect.any(String)
      })
    );
  });
});
```

---

## E2E Testing Patterns

### Pattern 8: Testing Error Responses

**Objective:** Verify API error responses are correct.

```typescript
describe('API Error Responses', () => {
  it('should return 400 for validation errors', async () => {
    // Arrange
    const invalidData = { email: 'not-an-email' };
    
    // Act
    const response = await request(app)
      .post('/api/users')
      .send(invalidData);
    
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid email');
    expect(response.body.message).not.toContain('Error:'); // No raw error
  });
  
  it('should return 422 for business rule errors', async () => {
    // Arrange
    const invalidAmount = { amount: -100 };
    
    // Act
    const response = await request(app)
      .post('/api/payments')
      .send(invalidAmount);
    
    // Assert
    expect(response.status).toBe(422);
    expect(response.body.message).toContain('Amount must be positive');
  });
  
  it('should return 500 for system errors', async () => {
    // Arrange
    mockDatabase.query.mockRejectedValue(new Error('Database error'));
    
    // Act
    const response = await request(app)
      .get('/api/users');
    
    // Assert
    expect(response.status).toBe(500);
    expect(response.body.message).toContain('An unexpected error occurred');
    expect(response.body.message).not.toContain('Database error'); // No internal details
  });
});
```

---

## Common Testing Patterns

### Testing Async Error Handling

```typescript
it('should handle async errors properly', async () => {
  // Arrange
  const service = new MyService();
  mockApi.get.mockRejectedValue(new Error('Async error'));
  
  // Act & Assert
  await expect(service.fetchData()).rejects.toThrow();
  
  // Verify logging
  expect(logger.error).toHaveBeenCalled();
});
```

### Testing Error Handling with Timeouts

```typescript
it('should handle timeout errors', async () => {
  // Arrange
  const service = new MyService();
  mockApi.get.mockImplementation(() => new Promise((resolve) => {
    setTimeout(() => resolve({ data: 'data' }), 10000); // 10 second delay
  }));
  
  // Act & Assert
  await expect(service.fetchDataWithTimeout(1000)).rejects.toThrow('Timeout');
  
  // Verify logging
  expect(logger.error).toHaveBeenCalledWith(
    expect.stringContaining('Timeout'),
    expect.objectContaining({
      errorCode: 'TIMEOUT'
    })
  );
});
```

### Testing Error Handling with Retries

```typescript
it('should retry on transient errors', async () => {
  // Arrange
  const service = new MyService();
  mockApi.get
    .mockRejectedValueOnce(new Error('Transient error'))
    .mockRejectedValueOnce(new Error('Transient error'))
    .mockResolvedValueOnce({ data: 'success' });
  
  // Act
  const result = await service.fetchDataWithRetry(3);
  
  // Assert
  expect(result).toEqual({ data: 'success' });
  expect(mockApi.get).toHaveBeenCalledTimes(3);
  expect(logger.warn).toHaveBeenCalledTimes(2); // Log retries
});
```

---

## Testing Checklist

### For Every Error-Prone Operation

- [ ] Test happy path (operation succeeds)
- [ ] Test error path (operation fails)
- [ ] Verify error is logged with context
- [ ] Verify error is categorized correctly
- [ ] Verify user-facing message is safe
- [ ] Verify error propagates with traceId
- [ ] Verify no silent failures

### For Every Service

- [ ] Test all external I/O operations
- [ ] Test all async/await operations
- [ ] Test all user input handling
- [ ] Test all data parsing operations
- [ ] Test all cross-service interactions
- [ ] Test all authentication/authorization flows
- [ ] Test all caching operations
- [ ] Test all event processing
- [ ] Test all concurrency operations

---

## Debugging Error Handling Issues

### Issue: Errors Not Logged

**Symptoms:**
- Errors occur but no logs appear
- Silent failures

**Diagnosis:**
```typescript
// Check if logger is called
expect(logger.error).toHaveBeenCalled();

// Check if error is caught
try {
  await operation();
  fail('Should have thrown');
} catch (error) {
  // Error was caught
}
```

**Fix:**
```typescript
// Add logging in catch block
catch (error) {
  logger.error('Operation failed', {
    context: 'ServiceName',
    operation: 'operation',
    errorCode: 'OP_FAILED',
    rootCause: error.message,
    traceId: this.requestContext.getTraceId()
  });
  throw error;
}
```

### Issue: Wrong Error Category

**Symptoms:**
- Validation errors return 500
- Business rule errors return 400

**Diagnosis:**
```typescript
// Check error type
expect(error).toBeInstanceOf(BadRequestException);

// Check HTTP status
expect(response.status).toBe(400);
```

**Fix:**
```typescript
// Add error categorization
if (error instanceof ValidationError) {
  throw new BadRequestException(error.message);
} else if (error instanceof BusinessRuleError) {
  throw new UnprocessableEntityException(error.message);
} else {
  throw new InternalServerErrorException('System error');
}
```

### Issue: Unsafe Error Messages

**Symptoms:**
- Stack traces in error messages
- Internal IDs exposed
- File paths leaked

**Diagnosis:**
```typescript
// Check message content
expect(error.message).not.toContain('at ');
expect(error.message).not.toContain('.ts:');
expect(error.message).not.toContain('uuid:');
```

**Fix:**
```typescript
// Use user-friendly messages
throw new BadRequestException(
  'Unable to process request. Please check your input and try again.'
);
```

---

## Best Practices

### DO:
- ✅ Test all error paths
- ✅ Verify error logging with context
- ✅ Test error categorization
- ✅ Verify user-facing messages are safe
- ✅ Test error propagation with traceId
- ✅ Use mocks to simulate errors
- ✅ Test retry logic
- ✅ Test timeout handling
- ✅ Test fallback strategies

### DON'T:
- ❌ Skip error path tests
- ❌ Test only happy paths
- ❌ Ignore silent failures
- ❌ Assume errors are logged
- ❌ Test with real external services
- ❌ Expose sensitive information in tests
- ❌ Use console.log in tests

---

## Example: Complete Error Handling Test Suite

```typescript
describe('WorkOrderService Error Handling', () => {
  let service: WorkOrderService;
  let mockLogger: any;
  let mockPrisma: any;
  let mockRequestContext: any;
  
  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
      warn: jest.fn()
    };
    mockPrisma = {
      workOrder: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    };
    mockRequestContext = {
      getTraceId: jest.fn().mockReturnValue('trace-123'),
      getTenantId: jest.fn().mockReturnValue('tenant-456')
    };
    
    service = new WorkOrderService(mockLogger, mockPrisma, mockRequestContext);
  });
  
  describe('getWorkOrders', () => {
    it('should log and throw error on database failure', async () => {
      // Arrange
      mockPrisma.workOrder.findMany.mockRejectedValue(new Error('Database error'));
      
      // Act & Assert
      await expect(service.getWorkOrders()).rejects.toThrow(InternalServerErrorException);
      
      // Verify logging
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to fetch work orders',
        expect.objectContaining({
          context: 'WorkOrderService',
          operation: 'getWorkOrders',
          errorCode: 'FETCH_FAILED',
          rootCause: 'Database error',
          traceId: 'trace-123',
          tenantId: 'tenant-456'
        })
      );
    });
    
    it('should return user-friendly error message', async () => {
      // Arrange
      mockPrisma.workOrder.findMany.mockRejectedValue(new Error('Database error'));
      
      // Act
      try {
        await service.getWorkOrders();
        fail('Should have thrown');
      } catch (error) {
        // Assert
        expect(error.message).toContain('Unable to fetch work orders');
        expect(error.message).not.toContain('Database error');
        expect(error.message).not.toContain('at ');
      }
    });
  });
  
  describe('createWorkOrder', () => {
    it('should throw BadRequestException for validation errors', async () => {
      // Arrange
      const invalidData = { title: '' }; // Empty title
      
      // Act & Assert
      await expect(service.createWorkOrder(invalidData))
        .rejects
        .toThrow(BadRequestException);
    });
    
    it('should log validation errors', async () => {
      // Arrange
      const invalidData = { title: '' };
      
      // Act
      try {
        await service.createWorkOrder(invalidData);
      } catch (error) {
        // Assert
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Validation failed'),
          expect.objectContaining({
            errorCode: 'VALIDATION_FAILED'
          })
        );
      }
    });
  });
});
```

---

**Last Updated:** 2025-12-05  
**Maintained By:** Platform Core Team  
**Review Frequency:** Quarterly or when error handling requirements change





