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

# PRIORITY: CRITICAL - Data Contract Consistency Rules

## Overview

This rule file enforces contract consistency across all system boundaries, preventing schema drift that breaks microservices and frontend-backend integration. Extends `.cursor/rules/predictive-prevention.md` (Rules 8-11) with comprehensive contract enforcement.

**⚠️ MANDATORY:** All schema-related changes must maintain contract consistency across frontend DTOs, backend DTOs, API schemas, database schemas, validation schemas, and event schemas.

---

## I. Contract Definition & Discovery

### Rule 1: Contract Search Before Schema Changes

**MANDATORY:** Before modifying ANY schema-related file, you MUST search for all contract definitions in parallel:

```typescript
// Execute these searches in parallel:
1. codebase_search("What is the contract definition for [entity]?")
2. codebase_search("Where are DTOs defined for [entity]?")
3. glob_file_search("**/*[entity]*.dto.ts")
4. glob_file_search("**/*[entity]*.ts") // Frontend types
5. grep -r "interface.*[Entity]|type.*[Entity]" frontend/src/
6. grep -r "class.*[Entity]Dto" apps/api/src/
7. read_file("libs/common/prisma/schema.prisma") // Database schema
8. read_file("docs/contracts/[entity].md") // Contract documentation
```

**STOP if contract definitions are unclear - ask for clarification.**

### Rule 2: Contract Boundary Identification

**MANDATORY:** Identify all contract boundaries affected by schema changes:

1. **Frontend DTOs** - TypeScript interfaces/types in `frontend/src/types/`
2. **Backend DTOs** - NestJS DTOs in `apps/api/src/[module]/dto/`
3. **API Schemas** - OpenAPI/Swagger definitions
4. **Database Schema** - Prisma schema in `libs/common/prisma/schema.prisma`
5. **Validation Schemas** - Zod schemas in frontend, class-validator in backend
6. **Kafka/Queue Events** - Event schemas in `libs/common/src/types/`
7. **Mobile Types** - React Native types in `VeroFieldMobile/src/types/` (may still be in `VeroSuiteMobile/` until renamed)

**MANDATORY:** Document all affected contracts before making changes.

---

## II. Contract Drift Detection

### Rule 3: Contract Shape Verification

**MANDATORY:** Verify contract shapes are identical across all boundaries:

**Frontend ↔ Backend:**
```typescript
// Frontend type (frontend/src/types/work-order.ts)
interface WorkOrder {
  id: string;
  customer_id: string;
  status: WorkOrderStatus;
  scheduled_date: string;
}

// Backend DTO (apps/api/src/work-orders/dto/work-order.dto.ts)
export class WorkOrderDto {
  id!: string;
  customer_id!: string;
  status!: WorkOrderStatus;
  scheduled_date!: string;
}

// MUST verify: Field names, types, optionality match exactly
```

**Backend ↔ Database:**
```typescript
// Backend DTO
export class CreateWorkOrderDto {
  customer_id!: string;
  status!: WorkOrderStatus;
  scheduled_date!: Date;
}

// Database Schema (Prisma)
model WorkOrder {
  id            String   @id @default(uuid())
  customer_id   String
  status        WorkOrderStatus
  scheduled_date DateTime
}

// MUST verify: Field names, types, constraints match
```

**API ↔ Validation:**
```typescript
// Zod schema (frontend)
const workOrderSchema = z.object({
  customer_id: z.string().uuid(),
  status: z.nativeEnum(WorkOrderStatus),
  scheduled_date: z.string().datetime()
});

// class-validator (backend)
export class CreateWorkOrderDto {
  @IsUUID()
  customer_id!: string;

  @IsEnum(WorkOrderStatus)
  status!: WorkOrderStatus;

  @IsDateString()
  scheduled_date!: string;
}

// MUST verify: Validation rules match
```

### Rule 4: Contract Drift Detection Process

**MANDATORY:** When changes affect contracts, detect drift by:

1. **Compare Field Names** - Verify exact match across boundaries
2. **Compare Types** - Verify type compatibility (string vs Date, etc.)
3. **Compare Optionality** - Verify required vs optional fields match
4. **Compare Validation** - Verify validation rules are equivalent
5. **Compare Enums** - Verify enum values match exactly

**Example Drift Detection:**
```typescript
// ❌ DRIFT DETECTED:
// Frontend: scheduled_date: string
// Backend: scheduled_date: Date
// Database: scheduled_date: DateTime
// Issue: Type mismatch - frontend uses string, backend uses Date

// ✅ FIXED:
// All layers use consistent type representation
// Frontend: scheduled_date: string (ISO 8601)
// Backend: scheduled_date: string (ISO 8601) - converted to Date internally
// Database: scheduled_date: DateTime
```

---

## III. Contract Update Requirements

### Rule 5: Synchronous Contract Updates

**MANDATORY:** When updating any contract, update ALL affected contracts:

**Update Sequence:**
1. **Database Schema** → Update Prisma schema first
2. **Backend DTOs** → Update DTOs to match database
3. **Validation Schemas** → Update class-validator decorators
4. **Frontend Types** → Update TypeScript interfaces
5. **Frontend Validation** → Update Zod schemas
6. **API Documentation** → Update OpenAPI/Swagger
7. **Event Schemas** → Update Kafka event types
8. **Tests** → Update all contract tests

**Example:**
```typescript
// Adding new field: priority
// 1. Update Prisma schema
model WorkOrder {
  priority WorkOrderPriority? // New field
}

// 2. Update Backend DTO
export class CreateWorkOrderDto {
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority; // New field
}

// 3. Update Frontend Type
interface WorkOrder {
  priority?: WorkOrderPriority; // New field
}

// 4. Update Zod Schema
const workOrderSchema = z.object({
  priority: z.nativeEnum(WorkOrderPriority).optional() // New field
});

// 5. Update OpenAPI (auto-generated from DTOs)
// 6. Update Event Schema (if applicable)
// 7. Update Tests
```

### Rule 6: Auto-Update Validators

**MANDATORY:** When contract changes, automatically update:

1. **Zod Schemas** - Frontend validation must match backend
2. **class-validator Decorators** - Backend validation must match DTOs
3. **Type Definitions** - TypeScript types must match DTOs
4. **Mock Generators** - Test mocks must match contracts

**Example:**
```typescript
// When adding field to DTO, update all validators:
// Backend DTO
export class CreateWorkOrderDto {
  @IsUUID()
  customer_id!: string;
  
  @IsEnum(WorkOrderPriority) // NEW
  priority!: WorkOrderPriority; // NEW
}

// Frontend Zod Schema (MUST update)
const workOrderSchema = z.object({
  customer_id: z.string().uuid(),
  priority: z.nativeEnum(WorkOrderPriority) // MUST add
});

// Frontend Type (MUST update)
interface WorkOrder {
  customer_id: string;
  priority: WorkOrderPriority; // MUST add
}
```

---

## IV. Schema Versioning & Backward Compatibility

### Rule 7: Breaking Change Detection

**MANDATORY:** Detect breaking changes and version appropriately:

**Breaking Changes:**
- Removing required fields
- Changing field types (string → number)
- Removing enum values
- Changing field names
- Making optional fields required

**Non-Breaking Changes:**
- Adding optional fields
- Adding new enum values
- Adding new endpoints
- Adding new optional query parameters

### Rule 8: Schema Versioning Requirements

**MANDATORY:** For breaking changes, you MUST:

1. **Version the API** - Use API versioning (e.g., `/api/v1/`, `/api/v2/`)
2. **Maintain Deprecated Endpoints** - Keep old endpoints for N versions
3. **Document Deprecation** - Add deprecation warnings to old endpoints
4. **Provide Migration Path** - Document how to migrate to new version
5. **Update All Consumers** - Update frontend, mobile, other services

**Example:**
```typescript
// Breaking change: customer_id → customerId (camelCase)
// Version 1 (deprecated)
@Get('v1/work-orders')
async getWorkOrdersV1() {
  // Returns: { customer_id: string }
}

// Version 2 (current)
@Get('v2/work-orders')
async getWorkOrdersV2() {
  // Returns: { customerId: string }
}

// Deprecation notice
@ApiDeprecated('Use v2 endpoint. Will be removed in v3.')
@Get('v1/work-orders')
async getWorkOrdersV1() { ... }
```

### Rule 9: Backward Compatibility Verification

**MANDATORY:** Verify backward compatibility:

1. **Test Old Clients** - Ensure old frontend versions still work
2. **Test New Clients** - Ensure new frontend versions work with new API
3. **Test Migration** - Test migration path from old to new version
4. **Document Breaking Changes** - Update CHANGELOG.md

---

## V. Contract Regression Testing

### Rule 10: Contract Tests for Every API

**MANDATORY:** Create contract regression tests for every API endpoint:

```typescript
describe('WorkOrder API Contract', () => {
  it('should return contract-compliant response', async () => {
    const response = await request(app)
      .get('/api/v1/work-orders/123')
      .expect(200);

    // Verify response shape matches contract
    expect(response.body).toMatchSchema(workOrderContractSchema);
    
    // Verify required fields exist
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('customer_id');
    expect(response.body).toHaveProperty('status');
    
    // Verify field types
    expect(typeof response.body.id).toBe('string');
    expect(typeof response.body.customer_id).toBe('string');
    expect(Object.values(WorkOrderStatus)).toContain(response.body.status);
  });

  it('should accept contract-compliant request', async () => {
    const requestBody = {
      customer_id: 'uuid-123',
      status: WorkOrderStatus.PENDING,
      scheduled_date: '2025-11-16T10:00:00Z'
    };

    const response = await request(app)
      .post('/api/v1/work-orders')
      .send(requestBody)
      .expect(201);

    // Verify request was accepted
    expect(response.body.id).toBeDefined();
  });

  it('should reject non-contract-compliant request', async () => {
    const invalidRequest = {
      customer_id: 'not-a-uuid', // Invalid UUID
      status: 'INVALID_STATUS' // Invalid enum value
    };

    await request(app)
      .post('/api/v1/work-orders')
      .send(invalidRequest)
      .expect(400);
  });
});
```

### Rule 11: Contract Shape Consistency Tests

**MANDATORY:** Test contract shape consistency across layers:

```typescript
describe('Contract Shape Consistency', () => {
  it('should have matching field names across layers', () => {
    // Frontend type
    const frontendFields = Object.keys(WorkOrderType);
    
    // Backend DTO
    const backendFields = Object.keys(new WorkOrderDto());
    
    // Database model
    const dbFields = Object.keys(prisma.workOrder.fields);
    
    // Verify all fields match
    expect(frontendFields.sort()).toEqual(backendFields.sort());
    expect(backendFields.sort()).toEqual(dbFields.sort());
  });

  it('should have matching types across layers', () => {
    // Verify type compatibility
    const frontendType = WorkOrderType.customer_id; // string
    const backendType = WorkOrderDto.prototype.customer_id; // string
    const dbType = prisma.workOrder.fields.customer_id.type; // String
    
    expect(frontendType).toBe('string');
    expect(backendType).toBe('string');
    expect(dbType).toBe('String');
  });
});
```

---

## VI. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- All contract definitions (frontend, backend, database, events)
- Existing contract documentation
- Contract versioning information
- Breaking change history

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Contract patterns match existing implementations
- All affected contracts are identified
- Contract drift risks are assessed

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- All contract definitions found
- Contract shapes are consistent
- Breaking changes are versioned
- All validators will be updated

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- All contracts updated synchronously
- Contract tests pass
- No contract drift introduced
- Backward compatibility maintained (if applicable)
- API documentation updated

---

## Violations

**HARD STOP violations:**
- Modifying schema without searching for contract definitions
- Updating one contract layer without updating others
- Making breaking changes without versioning
- Missing contract regression tests
- Contract drift between layers

**Must fix before proceeding:**
- Incomplete contract updates
- Missing validator updates
- Missing contract tests
- Inconsistent field names/types
- Missing API versioning for breaking changes

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every schema change

