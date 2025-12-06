---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - backend
  - microservices
priority: critical
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: CRITICAL - Transaction Safety & Data Integrity Rules

## Overview

This rule file enforces transaction safety and data integrity for all database operations, preventing orphaned records, partial updates, and data corruption. Extends `.cursor/rules/security.md` with transaction and data integrity requirements.

**⚠️ MANDATORY:** All multi-step database operations must be wrapped in transactions, foreign key constraints must be verified, and data integrity must be tested.

---

## I. Transaction Requirements

### Rule 1: Multi-Step Operation Transactions

**MANDATORY:** All multi-step database operations MUST be wrapped in transactions:

**Operations Requiring Transactions:**
- Creating related records (parent + children)
- Updating multiple related records
- Deleting records with dependencies
- Moving data between tables
- Any operation affecting multiple tables
- Any operation that must be atomic (all succeed or all fail)

**Example:**
```typescript
// ❌ WRONG: No transaction
async createWorkOrderWithItems(data: CreateWorkOrderDto) {
  const workOrder = await prisma.workOrder.create({ data });
  await prisma.workOrderItem.createMany({ data: items });
  // If second operation fails, workOrder is orphaned
}

// ✅ CORRECT: Wrapped in transaction
async createWorkOrderWithItems(data: CreateWorkOrderDto) {
  return await prisma.$transaction(async (tx) => {
    const workOrder = await tx.workOrder.create({ data });
    await tx.workOrderItem.createMany({
      data: items.map(item => ({ ...item, work_order_id: workOrder.id }))
    });
    return workOrder;
  });
}
```

### Rule 2: Transaction Error Handling

**MANDATORY:** Transactions MUST have proper error handling:

```typescript
async createWorkOrderWithItems(data: CreateWorkOrderDto) {
  try {
    return await prisma.$transaction(async (tx) => {
      const workOrder = await tx.workOrder.create({ data });
      await tx.workOrderItem.createMany({ data: items });
      return workOrder;
    });
  } catch (error) {
    logger.error('Transaction failed', {
      context: 'WorkOrderService',
      operation: 'createWorkOrderWithItems',
      errorCode: 'TRANSACTION_FAILED',
      rootCause: error.message
    });
    throw error; // Transaction automatically rolls back
  }
}
```

**Reference:** See `.cursor/rules/error-resilience.md` for error handling requirements.

---

## II. Foreign Key & Constraint Verification

### Rule 3: Foreign Key Constraint Verification

**MANDATORY:** Verify foreign key constraints exist for all relationships:

**Check Prisma Schema:**
```prisma
model WorkOrder {
  id          String   @id @default(uuid())
  customer_id String
  customer    Customer @relation(fields: [customer_id], references: [id])
  // ✅ Foreign key constraint exists
}

model WorkOrderItem {
  id           String    @id @default(uuid())
  work_order_id String
  work_order   WorkOrder @relation(fields: [work_order_id], references: [id], onDelete: Cascade)
  // ✅ Foreign key with cascade delete
}
```

**MANDATORY:** Before creating relationships, verify:
1. Foreign key field exists in both models
2. `@relation` decorator is present
3. `references` points to correct field
4. `onDelete` and `onUpdate` rules are defined

### Rule 4: ON DELETE/ON UPDATE Rules

**MANDATORY:** Define appropriate ON DELETE/ON UPDATE rules:

**Options:**
- `Cascade` - Delete/update related records
- `Restrict` - Prevent delete/update if related records exist
- `SetNull` - Set foreign key to null
- `NoAction` - Database default (may cause errors)

**Example:**
```prisma
model WorkOrder {
  id          String   @id @default(uuid())
  customer_id String
  customer    Customer @relation(
    fields: [customer_id],
    references: [id],
    onDelete: Restrict,  // Prevent deleting customer with work orders
    onUpdate: Cascade      // Update customer_id if customer.id changes
  )
}

model WorkOrderItem {
  id           String    @id @default(uuid())
  work_order_id String
  work_order   WorkOrder @relation(
    fields: [work_order_id],
    references: [id],
    onDelete: Cascade  // Delete items when work order is deleted
  )
}
```

**MANDATORY:** Choose appropriate rule based on business logic.

---

## III. Orphaned Record Prevention

### Rule 5: Orphaned Record Detection

**MANDATORY:** Check for orphaned records in operations:

**Common Orphan Scenarios:**
- Parent deleted, children remain
- Foreign key set to invalid value
- Cascade delete not working
- Manual deletion bypassing constraints

**Example Check:**
```typescript
async deleteCustomer(customerId: string) {
  // Check for related records
  const workOrders = await prisma.workOrder.count({
    where: { customer_id: customerId }
  });

  if (workOrders > 0) {
    throw new Error(
      `Cannot delete customer: ${workOrders} work orders exist. ` +
      `Delete work orders first or use cascade delete.`
    );
  }

  return await prisma.customer.delete({
    where: { id: customerId }
  });
}
```

### Rule 6: Partial Update Prevention

**MANDATORY:** Prevent partial updates that leave data inconsistent:

```typescript
// ❌ WRONG: Partial update
async updateWorkOrder(id: string, data: UpdateWorkOrderDto) {
  if (data.status) {
    await prisma.workOrder.update({ where: { id }, data: { status: data.status } });
  }
  if (data.priority) {
    await prisma.workOrder.update({ where: { id }, data: { priority: data.priority } });
  }
  // If second update fails, data is partially updated
}

// ✅ CORRECT: Atomic update
async updateWorkOrder(id: string, data: UpdateWorkOrderDto) {
  return await prisma.workOrder.update({
    where: { id },
    data: {
      status: data.status,
      priority: data.priority,
      // All fields updated atomically
    }
  });
}
```

---

## IV. Migration Requirements

### Rule 7: Migration Script Detection

**MANDATORY:** Detect when schema changes require migration scripts:

**Changes Requiring Migrations:**
- Adding/removing fields
- Changing field types
- Adding/removing indexes
- Adding/removing foreign keys
- Adding/removing tables
- Changing constraints

**MANDATORY:** When Prisma schema changes:
1. Generate migration: `npx prisma migrate dev --name [migration-name]`
2. Review migration SQL
3. Test migration on development database
4. Verify data integrity after migration
5. Create rollback script if needed

### Rule 8: Prisma Schema & Type Updates

**MANDATORY:** After schema changes:

1. **Update Prisma Schema** - Modify `libs/common/prisma/schema.prisma`
2. **Generate Types** - Run `npx prisma generate`
3. **Create Migration** - Run `npx prisma migrate dev`
4. **Update DTOs** - Update backend DTOs to match schema
5. **Update Frontend Types** - Update frontend types to match schema
6. **Update Tests** - Update tests with new schema

**Example:**
```bash
# 1. Update schema.prisma
# 2. Generate Prisma client
npx prisma generate

# 3. Create migration
npx prisma migrate dev --name add_priority_field

# 4. Verify migration
# 5. Update DTOs and types
# 6. Update tests
```

**Reference:** See `.cursor/rules/contracts.md` for contract synchronization.

---

## V. Data Integrity Testing

### Rule 9: Data Integrity Test Requirements

**MANDATORY:** Create data integrity tests for all database operations:

```typescript
describe('WorkOrder Data Integrity', () => {
  it('should create work order with items atomically', async () => {
    const data = {
      customer_id: 'customer-123',
      items: [
        { description: 'Item 1', quantity: 1 },
        { description: 'Item 2', quantity: 2 }
      ]
    };

    const workOrder = await service.createWorkOrderWithItems(data);

    // Verify work order created
    expect(workOrder.id).toBeDefined();

    // Verify items created with correct foreign key
    const items = await prisma.workOrderItem.findMany({
      where: { work_order_id: workOrder.id }
    });
    expect(items).toHaveLength(2);
    expect(items[0].work_order_id).toBe(workOrder.id);
  });

  it('should rollback transaction on error', async () => {
    const data = {
      customer_id: 'invalid-customer-id', // Will cause foreign key error
      items: [{ description: 'Item 1', quantity: 1 }]
    };

    await expect(
      service.createWorkOrderWithItems(data)
    ).rejects.toThrow();

    // Verify no partial data created
    const workOrders = await prisma.workOrder.findMany({
      where: { customer_id: 'invalid-customer-id' }
    });
    expect(workOrders).toHaveLength(0);
  });

  it('should prevent orphaned records', async () => {
    const customer = await prisma.customer.create({ data: customerData });
    const workOrder = await prisma.workOrder.create({
      data: { customer_id: customer.id, ...workOrderData }
    });

    // Attempt to delete customer (should fail if onDelete: Restrict)
    await expect(
      prisma.customer.delete({ where: { id: customer.id } })
    ).rejects.toThrow();

    // Verify work order still exists
    const existing = await prisma.workOrder.findUnique({
      where: { id: workOrder.id }
    });
    expect(existing).toBeDefined();
  });
});
```

### Rule 10: Before/After Behavior Tests

**MANDATORY:** Test data integrity before and after operations:

```typescript
describe('Data Integrity - Before/After', () => {
  it('should maintain referential integrity after update', async () => {
    // BEFORE: Verify initial state
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: 'work-order-123' },
      include: { items: true }
    });
    expect(workOrder.items).toHaveLength(3);

    // OPERATION: Update work order
    await service.updateWorkOrder('work-order-123', {
      status: 'COMPLETED'
    });

    // AFTER: Verify integrity maintained
    const updated = await prisma.workOrder.findUnique({
      where: { id: 'work-order-123' },
      include: { items: true }
    });
    expect(updated.status).toBe('COMPLETED');
    expect(updated.items).toHaveLength(3); // Items still exist
    expect(updated.items.every(item => item.work_order_id === 'work-order-123')).toBe(true);
  });
});
```

---

## VI. Tenant Isolation (Extended from Security)

### Rule 11: Tenant Isolation in Transactions

**MANDATORY:** All transactions MUST maintain tenant isolation:

```typescript
async createWorkOrderWithItems(tenantId: string, data: CreateWorkOrderDto) {
  return await prisma.$transaction(async (tx) => {
    // ✅ Include tenantId in all operations
    const workOrder = await tx.workOrder.create({
      data: {
        ...data,
        tenant_id: tenantId // MUST include tenantId
      }
    });

    await tx.workOrderItem.createMany({
      data: items.map(item => ({
        ...item,
        work_order_id: workOrder.id,
        tenant_id: tenantId // MUST include tenantId
      }))
    });

    return workOrder;
  });
}
```

**Reference:** See `.cursor/rules/security.md` for tenant isolation requirements.

### Rule 12: Tenant Isolation Verification

**MANDATORY:** Verify tenant isolation in all queries within transactions:

```typescript
async getWorkOrderWithItems(tenantId: string, workOrderId: string) {
  return await prisma.$transaction(async (tx) => {
    // ✅ Verify tenant isolation
    const workOrder = await tx.workOrder.findFirst({
      where: {
        id: workOrderId,
        tenant_id: tenantId // MUST filter by tenantId
      },
      include: {
        items: {
          where: {
            tenant_id: tenantId // MUST filter items by tenantId
          }
        }
      }
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    return workOrder;
  });
}
```

---

## VII. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Existing transaction patterns
- Foreign key constraints in Prisma schema
- ON DELETE/ON UPDATE rules
- Migration history

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Transaction patterns match existing code
- Foreign key constraints are appropriate
- ON DELETE/ON UPDATE rules are correct
- Tenant isolation is maintained

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Multi-step operations use transactions
- Foreign key constraints exist
- ON DELETE/ON UPDATE rules defined
- Tenant isolation maintained
- Migration scripts created (if needed)

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- All transactions properly implemented
- Foreign key constraints verified
- Data integrity tests pass
- No orphaned records created
- Tenant isolation maintained
- Migration scripts tested

---

## Violations

**HARD STOP violations:**
- Multi-step operations without transactions
- Missing foreign key constraints
- Missing ON DELETE/ON UPDATE rules
- Missing tenant isolation in transactions
- Schema changes without migrations

**Must fix before proceeding:**
- Orphaned records
- Partial updates
- Missing data integrity tests
- Untested migrations
- Missing Prisma type generation

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every database operation

