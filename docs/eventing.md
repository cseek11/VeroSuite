---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - backend
  - microservices
priority: high
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: HIGH - Message Queue / Event Consistency Rules

## Overview

This rule file enforces event schema validation, idempotency, retry logic, and event consistency across event-driven systems. Prevents double-processing, ensures event payloads conform to schemas, and maintains event system reliability.

**⚠️ MANDATORY:** All events must be validated against schemas, use idempotency keys, and implement proper retry logic with exponential backoff.

---

## I. Event Schema Validation

### Rule 1: Event Schema Registry

**MANDATORY:** Validate event schemas against central event registry:

**Event Registry Location:**
- `libs/common/src/types/events.ts` - Central event type definitions
- `docs/contracts/events.md` - Event contract documentation

**MANDATORY:** Before producing events, verify schema exists in registry:

```typescript
// Event Registry (libs/common/src/types/events.ts)
export interface WorkOrderCreatedEvent {
  eventType: 'work_order.created';
  workOrderId: string;
  customerId: string;
  tenantId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ✅ VALIDATED: Event matches schema
const event: WorkOrderCreatedEvent = {
  eventType: 'work_order.created',
  workOrderId: 'uuid-123',
  customerId: 'uuid-456',
  tenantId: 'tenant-789',
  timestamp: new Date().toISOString()
};

// Validate against schema
validateEventSchema(event, 'WorkOrderCreatedEvent');
```

**Reference:** See `.cursor/rules/contracts.md` for contract consistency requirements.

### Rule 2: Event Payload Validation

**MANDATORY:** Ensure event payloads conform to typed schema:

```typescript
// ✅ CORRECT: Typed event with validation
async produceWorkOrderCreated(workOrder: WorkOrder) {
  const event: WorkOrderCreatedEvent = {
    eventType: 'work_order.created',
    workOrderId: workOrder.id,
    customerId: workOrder.customer_id,
    tenantId: workOrder.tenant_id,
    timestamp: new Date().toISOString()
  };

  // Validate before producing
  const validation = validateEventSchema(event);
  if (!validation.valid) {
    throw new Error(`Invalid event schema: ${validation.errors}`);
  }

  await kafkaProducer.send('work-orders', event);
}

// ❌ WRONG: Untyped event, no validation
async produceWorkOrderCreated(workOrder: WorkOrder) {
  await kafkaProducer.send('work-orders', {
    // No type safety, no validation
    id: workOrder.id,
    customer: workOrder.customer_id
  });
}
```

---

## II. Event Logging

### Rule 3: Event Produced Logging

**MANDATORY:** Log all event production:

```typescript
async produceEvent(event: WorkOrderCreatedEvent) {
  logger.info('Event produced', {
    context: 'EventProducer',
    operation: 'produceEvent',
    traceId: req.traceId,
    eventType: event.eventType,
    eventId: event.workOrderId,
    topic: 'work-orders',
    timestamp: event.timestamp
  });

  await kafkaProducer.send('work-orders', event);
}
```

**Reference:** See `.cursor/rules/observability.md` for structured logging requirements.

### Rule 4: Event Consumed Logging

**MANDATORY:** Log all event consumption:

```typescript
@KafkaListener('work-orders')
async consumeWorkOrderCreated(event: WorkOrderCreatedEvent) {
  logger.info('Event consumed', {
    context: 'EventConsumer',
    operation: 'consumeWorkOrderCreated',
    traceId: event.traceId,
    eventType: event.eventType,
    eventId: event.workOrderId,
    timestamp: event.timestamp
  });

  try {
    await this.handleWorkOrderCreated(event);
  } catch (error) {
    logger.error('Event processing failed', {
      context: 'EventConsumer',
      operation: 'consumeWorkOrderCreated',
      eventType: event.eventType,
      eventId: event.workOrderId,
      errorCode: 'EVENT_PROCESSING_FAILED',
      rootCause: error.message
    });
    throw error;
  }
}
```

### Rule 5: Event Failure Logging

**MANDATORY:** Log all event failures with context:

```typescript
@KafkaListener('work-orders')
async consumeWorkOrderCreated(event: WorkOrderCreatedEvent) {
  try {
    await this.handleWorkOrderCreated(event);
  } catch (error) {
    logger.error('Event processing failed', {
      context: 'EventConsumer',
      operation: 'consumeWorkOrderCreated',
      traceId: event.traceId,
      eventType: event.eventType,
      eventId: event.workOrderId,
      errorCode: 'EVENT_PROCESSING_FAILED',
      rootCause: error.message,
      retryable: this.isRetryableError(error),
      attempt: event.retryCount || 1
    });

    // Re-throw for retry mechanism
    throw error;
  }
}
```

---

## III. Idempotency

### Rule 6: Idempotency Key Requirement

**MANDATORY:** Use idempotency keys for critical events:

```typescript
export interface WorkOrderCreatedEvent {
  eventType: 'work_order.created';
  idempotencyKey: string; // REQUIRED for critical events
  workOrderId: string;
  // ... other fields
}

// ✅ CORRECT: Include idempotency key
async produceWorkOrderCreated(workOrder: WorkOrder) {
  const event: WorkOrderCreatedEvent = {
    eventType: 'work_order.created',
    idempotencyKey: `work-order-${workOrder.id}`,
    workOrderId: workOrder.id,
    // ... other fields
  };

  await kafkaProducer.send('work-orders', event);
}

// Consumer: Check idempotency
@KafkaListener('work-orders')
async consumeWorkOrderCreated(event: WorkOrderCreatedEvent) {
  // Check if already processed
  const processed = await this.idempotencyStore.get(event.idempotencyKey);
  if (processed) {
    logger.info('Event already processed', {
      context: 'EventConsumer',
      eventType: event.eventType,
      idempotencyKey: event.idempotencyKey
    });
    return; // Idempotent: already processed
  }

  // Process event
  await this.handleWorkOrderCreated(event);

  // Mark as processed
  await this.idempotencyStore.set(event.idempotencyKey, true);
}
```

### Rule 7: Prevent Double-Processing

**MANDATORY:** Prevent double-processing without idempotency keys:

```typescript
// ✅ CORRECT: Idempotency check
async processEvent(event: WorkOrderCreatedEvent) {
  // Check if already processed
  const key = `event:${event.eventType}:${event.workOrderId}`;
  const processed = await redis.get(key);
  
  if (processed) {
    logger.warn('Event already processed, skipping', {
      context: 'EventProcessor',
      eventType: event.eventType,
      eventId: event.workOrderId
    });
    return;
  }

  // Process event
  await this.handleEvent(event);

  // Mark as processed (TTL: 24 hours)
  await redis.setex(key, 86400, 'processed');
}
```

---

## IV. Retry Logic

### Rule 8: Exponential Backoff Retry

**MANDATORY:** Ensure retries follow exponential backoff:

```typescript
async consumeWithRetry(
  event: WorkOrderCreatedEvent,
  maxRetries: number = 3
): Promise<void> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      await this.handleWorkOrderCreated(event);
      return; // Success
    } catch (error) {
      attempt++;
      
      if (attempt >= maxRetries) {
        logger.error('Max retries exceeded', {
          context: 'EventConsumer',
          eventType: event.eventType,
          eventId: event.workOrderId,
          attempts: attempt,
          errorCode: 'MAX_RETRIES_EXCEEDED'
        });
        throw error;
      }

      // Exponential backoff: 2^attempt seconds
      const delay = Math.pow(2, attempt) * 1000;
      
      logger.warn('Event processing failed, retrying', {
        context: 'EventConsumer',
        eventType: event.eventType,
        eventId: event.workOrderId,
        attempt,
        maxRetries,
        delay,
        errorCode: error.code
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Rule 9: Retryable vs Non-Retryable Errors

**MANDATORY:** Distinguish retryable from non-retryable errors:

```typescript
function isRetryableError(error: Error): boolean {
  // Retryable: Transient errors
  const retryableErrors = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'TEMPORARY_ERROR'
  ];

  // Non-retryable: Permanent errors
  const nonRetryableErrors = [
    'VALIDATION_ERROR',
    'AUTHORIZATION_ERROR',
    'NOT_FOUND',
    'DUPLICATE_ENTRY'
  ];

  if (nonRetryableErrors.includes(error.code)) {
    return false; // Don't retry
  }

  if (retryableErrors.includes(error.code)) {
    return true; // Retry
  }

  // Default: Retry for unknown errors
  return true;
}

async consumeWithRetry(event: WorkOrderCreatedEvent) {
  try {
    await this.handleWorkOrderCreated(event);
  } catch (error) {
    if (!this.isRetryableError(error)) {
      // Don't retry non-retryable errors
      logger.error('Non-retryable error, skipping retry', {
        context: 'EventConsumer',
        errorCode: error.code
      });
      throw error;
    }

    // Retry retryable errors
    await this.retryWithBackoff(event, error);
  }
}
```

---

## V. Event Contract Consistency

### Rule 10: Event Contract Verification

**MANDATORY:** Verify event contracts match across producer and consumer:

```typescript
// Producer: WorkOrderCreatedEvent
export interface WorkOrderCreatedEvent {
  eventType: 'work_order.created';
  workOrderId: string;
  customerId: string;
  // ... fields
}

// Consumer: Must match producer contract
@KafkaListener('work-orders')
async consumeWorkOrderCreated(event: WorkOrderCreatedEvent) {
  // Event type matches producer
  // Field names match producer
  // Field types match producer
  await this.handleWorkOrderCreated(event);
}
```

**MANDATORY:** Use shared event types from `libs/common/src/types/events.ts`.

**Reference:** See `.cursor/rules/contracts.md` for contract consistency requirements.

---

## VI. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Event schema registry
- Existing event patterns
- Idempotency implementations
- Retry logic patterns

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Event schema matches registry
- Idempotency keys used
- Retry logic follows exponential backoff
- Event contracts match

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Event schemas validated
- Idempotency keys present
- Retry logic implemented
- Event logging present

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- Event schemas validated
- Idempotency working
- Retry logic tested
- Event logging complete
- Event contracts consistent

---

## Violations

**HARD STOP violations:**
- Events without schema validation
- Critical events without idempotency keys
- Missing retry logic
- Events not logged

**Must fix before proceeding:**
- Event contracts don't match
- Retry logic doesn't use exponential backoff
- Missing event failure logging
- Double-processing possible

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** HIGH - Must be followed for every event implementation

