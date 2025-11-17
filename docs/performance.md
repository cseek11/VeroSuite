---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - backend
  - mobile
  - microservices
priority: high
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: HIGH - Performance Budget & Efficiency Rules

## Overview

This rule file enforces performance analysis, anti-pattern detection, and budget compliance for all code changes. References existing `PERFORMANCE_BUDGETS.md` for budget thresholds.

**⚠️ MANDATORY:** All code must be analyzed for performance characteristics, anti-patterns must be detected, and performance budgets must be enforced.

---

## I. Performance Analysis Requirements

### Rule 1: Performance Characteristic Analysis

**MANDATORY:** Before implementing code, analyze performance characteristics for:

1. **Loops** - Time complexity, nested loops, iteration count
2. **Large Array Operations** - Array size, operation complexity
3. **Nested Maps/Reduces** - Depth of nesting, data size
4. **Unbounded Recursion** - Recursion depth, base cases
5. **Large JSON Serialization** - JSON size, serialization overhead
6. **Database Query Optimization** - Query complexity, indexes, N+1 queries

**Example Analysis:**
```typescript
// ❌ PERFORMANCE ISSUE: Nested loops O(n²)
const result = users.map(user => 
  orders.filter(order => order.userId === user.id)
);

// ✅ OPTIMIZED: Use Map for O(n) lookup
const orderMap = new Map(orders.map(order => [order.userId, order]));
const result = users.map(user => orderMap.get(user.id) || []);
```

### Rule 2: Performance Budget Reference

**MANDATORY:** Reference `frontend/src/config/PERFORMANCE_BUDGETS.md` for budget thresholds:

**Key Budgets:**
- **Dashboard Load Time:** Target 1.5s, Warning 2s, Error 3s
- **Card Interaction:** Target 50ms, Warning 100ms, Error 200ms
- **List Rendering:** Target 300ms, Warning 500ms, Error 1s
- **API Response Time:** Target 200ms, Warning 500ms, Error 1s
- **Database Queries:** Target 50ms, Warning 100ms, Error 200ms

**MANDATORY:** Check budgets before implementation and ensure code meets targets.

**Reference:** See `frontend/src/config/PERFORMANCE_BUDGETS.md` for complete budget definitions.

---

## II. Anti-Pattern Detection

### Rule 3: N+1 Query Detection

**MANDATORY:** Detect and fix N+1 query patterns:

```typescript
// ❌ N+1 QUERY PATTERN
async getWorkOrdersWithCustomers() {
  const workOrders = await prisma.workOrder.findMany();
  // N queries for N work orders
  return workOrders.map(async order => ({
    ...order,
    customer: await prisma.customer.findUnique({ where: { id: order.customer_id } })
  }));
}

// ✅ FIXED: Single query with include
async getWorkOrdersWithCustomers() {
  return await prisma.workOrder.findMany({
    include: {
      customer: true // Single query with join
    }
  });
}
```

**MANDATORY:** Use `include` or `select` to fetch related data in single query.

### Rule 4: Redundant API Call Detection

**MANDATORY:** Detect and eliminate redundant API calls:

```typescript
// ❌ REDUNDANT CALLS
const customer1 = await fetchCustomer(customerId);
const customer2 = await fetchCustomer(customerId); // Redundant

// ✅ FIXED: Cache or reuse
const customer = await fetchCustomer(customerId);
// Reuse customer object
```

**MANDATORY:** Use caching, memoization, or request deduplication to prevent redundant calls.

### Rule 5: Missing Index Detection

**MANDATORY:** Verify indexes exist for frequently queried fields:

```prisma
// ✅ INDEXED: Fast lookups
model WorkOrder {
  id          String   @id @default(uuid())
  customer_id String
  status      WorkOrderStatus
  created_at  DateTime @default(now())

  @@index([customer_id])        // Index for customer lookups
  @@index([status])             // Index for status filtering
  @@index([customer_id, status]) // Composite index
}
```

**MANDATORY:** Add indexes for:
- Foreign keys (frequently joined)
- Filtered fields (WHERE clauses)
- Sorted fields (ORDER BY)
- Composite queries (multiple WHERE conditions)

### Rule 6: Unnecessary Re-render Detection

**MANDATORY:** Detect and fix unnecessary React re-renders:

```typescript
// ❌ UNNECESSARY RE-RENDERS
function WorkOrderList({ workOrders }) {
  return workOrders.map(order => (
    <WorkOrderItem key={order.id} order={order} />
  ));
}

// ✅ OPTIMIZED: Memoization
const WorkOrderList = React.memo(function WorkOrderList({ workOrders }) {
  return workOrders.map(order => (
    <WorkOrderItem key={order.id} order={order} />
  ));
});

// ✅ OPTIMIZED: useMemo for expensive calculations
function WorkOrderList({ workOrders }) {
  const sortedOrders = useMemo(
    () => workOrders.sort((a, b) => a.created_at - b.created_at),
    [workOrders]
  );
  return sortedOrders.map(order => (
    <WorkOrderItem key={order.id} order={order} />
  ));
}
```

**MANDATORY:** Use `React.memo`, `useMemo`, `useCallback` to prevent unnecessary re-renders.

---

## III. Performance Budget Enforcement

### Rule 7: Database Query Budget

**MANDATORY:** Enforce database query performance budgets:

- **Target:** < 50ms
- **Warning:** 50-100ms
- **Error:** > 100ms

**MANDATORY:** Log slow queries and optimize:

```typescript
async getWorkOrders(tenantId: string) {
  const startTime = Date.now();
  
  const workOrders = await prisma.workOrder.findMany({
    where: { tenant_id: tenantId }
  });
  
  const duration = Date.now() - startTime;
  
  if (duration > 100) {
    logger.warn('Slow database query', {
      context: 'WorkOrderService',
      operation: 'getWorkOrders',
      duration,
      threshold: 100,
      errorCode: 'SLOW_QUERY'
    });
  }
  
  return workOrders;
}
```

**Reference:** See `.cursor/rules/observability.md` for logging requirements.

### Rule 8: UI Interaction Budget

**MANDATORY:** Enforce UI interaction performance budgets:

- **Target:** < 50ms
- **Warning:** 50-100ms
- **Error:** > 200ms

**MANDATORY:** Measure and log slow interactions:

```typescript
function handleWorkOrderClick(workOrderId: string) {
  const startTime = performance.now();
  
  // Interaction logic
  navigateToWorkOrder(workOrderId);
  
  const duration = performance.now() - startTime;
  
  if (duration > 200) {
    logger.warn('Slow UI interaction', {
      context: 'WorkOrderList',
      operation: 'handleWorkOrderClick',
      duration,
      threshold: 200,
      errorCode: 'SLOW_INTERACTION'
    });
  }
}
```

### Rule 9: Unbounded Operation Prevention

**MANDATORY:** Prevent unbounded in-memory operations:

```typescript
// ❌ UNBOUNDED: No limit on array size
const allWorkOrders = await prisma.workOrder.findMany();

// ✅ BOUNDED: Pagination or limits
const workOrders = await prisma.workOrder.findMany({
  take: 100, // Limit results
  skip: 0,
  orderBy: { created_at: 'desc' }
});

// ✅ BOUNDED: Streaming for large datasets
async function* streamWorkOrders() {
  let skip = 0;
  const take = 100;
  
  while (true) {
    const batch = await prisma.workOrder.findMany({
      take,
      skip,
      orderBy: { created_at: 'desc' }
    });
    
    if (batch.length === 0) break;
    
    yield* batch;
    skip += take;
  }
}
```

**MANDATORY:** Use pagination, limits, or streaming for large datasets.

---

## IV. Performance Testing

### Rule 10: Performance Test Requirements

**MANDATORY:** Add performance tests/benchmarks for critical flows:

```typescript
describe('WorkOrder Performance', () => {
  it('should load work orders within budget', async () => {
    const startTime = Date.now();
    const workOrders = await service.getWorkOrders(tenantId);
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(100); // Budget: 100ms
  });

  it('should render work order list within budget', async () => {
    const startTime = performance.now();
    render(<WorkOrderList workOrders={mockWorkOrders} />);
    const duration = performance.now() - startTime;
    
    expect(duration).toBeLessThan(300); // Budget: 300ms
  });

  it('should handle card interaction within budget', async () => {
    const startTime = performance.now();
    fireEvent.click(screen.getByTestId('work-order-card'));
    const duration = performance.now() - startTime;
    
    expect(duration).toBeLessThan(50); // Budget: 50ms
  });
});
```

### Rule 11: Performance Regression Tests

**MANDATORY:** Create performance regression tests:

```typescript
describe('Performance Regression', () => {
  it('should not regress dashboard load time', async () => {
    const baseline = 1500; // Baseline: 1.5s
    const threshold = baseline * 1.1; // 10% regression threshold
    
    const startTime = Date.now();
    await loadDashboard();
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(threshold);
  });
});
```

---

## V. Performance Monitoring

### Rule 12: Slow Operation Logging

**MANDATORY:** Log operations exceeding performance thresholds:

```typescript
async function processWorkOrder(workOrderId: string) {
  const startTime = Date.now();
  
  try {
    // Operation logic
    const result = await executeOperation(workOrderId);
    
    const duration = Date.now() - startTime;
    
    if (duration > SLOW_OPERATION_THRESHOLD) {
      logger.warn('Slow operation detected', {
        context: 'WorkOrderService',
        operation: 'processWorkOrder',
        duration,
        threshold: SLOW_OPERATION_THRESHOLD,
        workOrderId
      });
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Operation failed', {
      context: 'WorkOrderService',
      operation: 'processWorkOrder',
      duration,
      errorCode: 'OPERATION_FAILED',
      rootCause: error.message
    });
    throw error;
  }
}
```

**Reference:** See `.cursor/rules/observability.md` for structured logging requirements.

---

## VI. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Performance budgets in `PERFORMANCE_BUDGETS.md`
- Existing performance patterns
- Performance test examples
- Known performance issues

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Performance characteristics analyzed
- Anti-patterns identified
- Performance budgets checked
- Optimization opportunities identified

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- No N+1 queries
- No redundant API calls
- Indexes exist for queries
- No unnecessary re-renders
- Performance budgets met

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- Performance tests pass
- No performance regressions
- Slow operations logged
- Performance budgets met
- Anti-patterns eliminated

---

## Violations

**HARD STOP violations:**
- N+1 queries
- Unbounded operations
- Missing indexes for frequent queries
- Performance budgets exceeded by > 50%

**Must fix before proceeding:**
- Redundant API calls
- Unnecessary re-renders
- Missing performance tests
- Slow operations not logged

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** HIGH - Must be followed for every implementation

