---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - backend
  - mobile
  - microservices
priority: critical
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: CRITICAL - UI/Backend Sync Rules

## Overview

This rule file enforces layer coherence across all system layers, ensuring changes propagate correctly from database schema through backend DTOs, frontend types, validation schemas, API documentation, and tests.

**⚠️ MANDATORY:** When touching any layer, all related layers must be updated synchronously to maintain system coherence.

---

## I. Layer Definition & Hierarchy

### Rule 1: Layer Hierarchy

**MANDATORY:** Understand the layer hierarchy and dependencies:

```
Database Schema (libs/common/prisma/schema.prisma)
    ↓
Backend DTOs (apps/api/src/[module]/dto/)
    ↓
Backend Validation (class-validator decorators)
    ↓
API Documentation (OpenAPI/Swagger)
    ↓
Frontend Types (frontend/src/types/)
    ↓
Frontend Validation (Zod schemas)
    ↓
Mobile Types (VeroFieldMobile/src/types/ - may still be VeroSuiteMobile/ until renamed)
    ↓
Tests (all layers)
```

**MANDATORY:** Changes must flow down the hierarchy, and all layers must be updated.

### Rule 2: Layer Identification

**MANDATORY:** Identify all layers affected by changes:

1. **Database Schema** - Prisma schema in `libs/common/prisma/schema.prisma`
2. **Backend DTOs** - NestJS DTOs in `apps/api/src/[module]/dto/`
3. **Backend Validation** - class-validator decorators in DTOs
4. **API Documentation** - OpenAPI/Swagger (auto-generated from DTOs)
5. **Frontend Types** - TypeScript interfaces in `frontend/src/types/`
6. **Frontend Validation** - Zod schemas in `frontend/src/lib/` or components
7. **Mobile Types** - TypeScript interfaces in `VeroFieldMobile/src/types/` (may still be in `VeroSuiteMobile/` until renamed)
8. **Event Schemas** - Kafka/event types in `libs/common/src/types/`
9. **Tests** - Unit, integration, E2E tests

---

## II. Database Schema Changes

### Rule 3: DB Schema → Backend DTOs → Frontend Types → Tests

**MANDATORY:** When modifying database schema:

**Update Sequence:**
1. **Update Prisma Schema** - Modify `libs/common/prisma/schema.prisma`
2. **Generate Prisma Client** - Run `npx prisma generate`
3. **Update Backend DTOs** - Update DTOs to match schema
4. **Update Backend Validation** - Update class-validator decorators
5. **Update Frontend Types** - Update TypeScript interfaces
6. **Update Frontend Validation** - Update Zod schemas
7. **Update Mobile Types** - Update React Native types (if applicable)
8. **Update Tests** - Update all affected tests

**Example:**
```typescript
// 1. Update Prisma Schema
model WorkOrder {
  id          String   @id @default(uuid())
  customer_id String
  priority    WorkOrderPriority? // NEW FIELD
}

// 2. Generate Prisma Client
// npx prisma generate

// 3. Update Backend DTO
export class CreateWorkOrderDto {
  @IsUUID()
  customer_id!: string;

  @IsOptional()
  @IsEnum(WorkOrderPriority) // NEW FIELD
  priority?: WorkOrderPriority; // NEW FIELD
}

// 4. Update Frontend Type
interface WorkOrder {
  id: string;
  customer_id: string;
  priority?: WorkOrderPriority; // NEW FIELD
}

// 5. Update Frontend Zod Schema
const workOrderSchema = z.object({
  customer_id: z.string().uuid(),
  priority: z.nativeEnum(WorkOrderPriority).optional() // NEW FIELD
});

// 6. Update Tests
describe('WorkOrder', () => {
  it('should create work order with priority', async () => {
    const data = {
      customer_id: 'uuid-123',
      priority: WorkOrderPriority.HIGH // NEW FIELD
    };
    // ... test implementation
  });
});
```

**Reference:** See `.cursor/rules/contracts.md` for contract consistency requirements.

---

## III. API Changes

### Rule 4: API → OpenAPI Spec → Client → Tests

**MANDATORY:** When modifying API endpoints:

**Update Sequence:**
1. **Update Controller** - Modify endpoint in `apps/api/src/[module]/[module].controller.ts`
2. **Update DTOs** - Update request/response DTOs
3. **Update OpenAPI Spec** - Swagger auto-generates, but verify annotations
4. **Update Frontend API Client** - Update API client functions in `frontend/src/lib/`
5. **Update Frontend Types** - Update types used by API client
6. **Update Mobile API Client** - Update React Native API client (if applicable)
7. **Update Tests** - Update API tests, integration tests, E2E tests

**Example:**
```typescript
// 1. Update Controller
@Post('work-orders')
@ApiOperation({ summary: 'Create work order' })
async createWorkOrder(
  @Body() dto: CreateWorkOrderDto
): Promise<WorkOrderResponseDto> {
  return this.workOrdersService.create(dto);
}

// 2. Update DTOs (already covered in Rule 3)

// 3. OpenAPI Spec (auto-generated, but verify @ApiOperation, @ApiResponse)

// 4. Update Frontend API Client
export async function createWorkOrder(
  data: CreateWorkOrderDto
): Promise<WorkOrder> {
  const response = await fetch('/api/v1/work-orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// 5. Update Frontend Types (already covered in Rule 3)

// 6. Update Tests
describe('WorkOrder API', () => {
  it('should create work order', async () => {
    const response = await request(app)
      .post('/api/v1/work-orders')
      .send({ customer_id: 'uuid-123', priority: 'HIGH' })
      .expect(201);
    // ... assertions
  });
});
```

---

## IV. Event Changes

### Rule 5: Event → Producer → Consumer → Tests

**MANDATORY:** When modifying event schemas:

**Update Sequence:**
1. **Update Event Schema** - Update types in `libs/common/src/types/`
2. **Update Producer** - Update event producer code
3. **Update Consumer** - Update event consumer code
4. **Update Event Registry** - Update central event registry (if exists)
5. **Update Tests** - Update event producer/consumer tests

**Example:**
```typescript
// 1. Update Event Schema
export interface WorkOrderCreatedEvent {
  eventType: 'work_order.created';
  workOrderId: string;
  customerId: string;
  priority?: WorkOrderPriority; // NEW FIELD
  timestamp: string;
}

// 2. Update Producer
async createWorkOrder(data: CreateWorkOrderDto) {
  const workOrder = await this.prisma.workOrder.create({ data });
  
  await this.kafka.sendEvent('work-orders', {
    eventType: 'work_order.created',
    workOrderId: workOrder.id,
    customerId: workOrder.customer_id,
    priority: workOrder.priority, // NEW FIELD
    timestamp: new Date().toISOString()
  });
  
  return workOrder;
}

// 3. Update Consumer
@KafkaListener('work-orders')
async handleWorkOrderCreated(event: WorkOrderCreatedEvent) {
  // Handle event with new priority field
  if (event.priority === WorkOrderPriority.HIGH) {
    await this.notificationService.sendHighPriorityAlert(event);
  }
}

// 4. Update Tests
describe('WorkOrderCreatedEvent', () => {
  it('should include priority in event', async () => {
    const event = await produceWorkOrderCreatedEvent({
      priority: WorkOrderPriority.HIGH
    });
    expect(event.priority).toBe(WorkOrderPriority.HIGH);
  });
});
```

**Reference:** See `.cursor/rules/eventing.md` for event consistency requirements.

---

## V. Layer Coherence Verification

### Rule 6: Verify All Layers Updated

**MANDATORY:** Before completing changes, verify all layers are updated:

**Verification Checklist:**
- [ ] Database schema updated (if applicable)
- [ ] Prisma client generated
- [ ] Backend DTOs updated
- [ ] Backend validation updated
- [ ] Frontend types updated
- [ ] Frontend validation updated
- [ ] Mobile types updated (if applicable)
- [ ] API documentation updated
- [ ] Event schemas updated (if applicable)
- [ ] All tests updated
- [ ] No TypeScript errors
- [ ] No linting errors

### Rule 7: Layer Coherence Tests

**MANDATORY:** Create tests verifying layer coherence:

```typescript
describe('Layer Coherence', () => {
  it('should have matching field names across layers', () => {
    // Database schema fields
    const dbFields = Object.keys(prisma.workOrder.fields);
    
    // Backend DTO fields
    const dtoFields = Object.keys(new CreateWorkOrderDto());
    
    // Frontend type fields
    const frontendFields = Object.keys({} as WorkOrder);
    
    // Verify coherence
    expect(dbFields.sort()).toEqual(dtoFields.sort());
    expect(dtoFields.sort()).toEqual(frontendFields.sort());
  });

  it('should have matching types across layers', () => {
    // Verify type compatibility
    const dbType = prisma.workOrder.fields.priority.type; // Enum
    const dtoType = CreateWorkOrderDto.prototype.priority; // Enum
    const frontendType = ({} as WorkOrder).priority; // Enum
    
    // All should be same enum type
    expect(typeof dbType).toBe('object');
    expect(typeof dtoType).toBe('object');
    expect(typeof frontendType).toBe('object');
  });
});
```

---

## VI. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- All layers affected by changes
- Existing layer implementations
- Layer synchronization patterns
- Contract definitions across layers

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Layer update sequence is correct
- All affected layers identified
- Layer patterns match existing code
- Contract consistency maintained

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- All layers will be updated
- Layer update sequence planned
- Contract consistency verified
- Tests will be updated

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- All layers updated synchronously
- No layer drift introduced
- Contract consistency maintained
- All tests pass
- No TypeScript errors
- Layer coherence tests pass

---

## Violations

**HARD STOP violations:**
- Updating one layer without updating others
- Breaking layer hierarchy
- Missing layer updates
- Layer drift between layers
- Missing layer coherence tests

**Must fix before proceeding:**
- Incomplete layer updates
- Type mismatches between layers
- Missing validation updates
- Missing test updates
- Contract inconsistencies

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every layer change

