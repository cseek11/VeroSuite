---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - all
priority: high
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: HIGH - File Ownership Rules

## Overview

This rule file enforces domain file ownership in monorepo with multiple modules/domains. Prevents unauthorized modifications to out-of-scope modules and maintains clear ownership boundaries.

**⚠️ MANDATORY:** The AI MUST respect domain file ownership, avoid modifying out-of-scope modules, and add ownership tags/maintainers.

---

## I. Domain File Ownership

### Rule 1: Respect Domain File Ownership

**MANDATORY:** Respect domain file ownership:

**Domain Structure:**
- `apps/api/src/work-orders/` - Work Orders domain
- `apps/api/src/customers/` - Customers domain
- `apps/api/src/jobs/` - Jobs domain
- `apps/api/src/accounts/` - Accounts domain
- `apps/crm-ai/src/` - AI CodeGen domain
- `apps/ai-soc/src/` - AI SOC domain

**MANDATORY:** Do NOT modify files outside your assigned domain without permission.

### Rule 2: Ownership Tags

**MANDATORY:** Add ownership tags to files:

```typescript
/**
 * @owner work-orders-team
 * @domain work-orders
 * @maintainer @john-doe
 * 
 * Work Order Service
 * Handles work order creation, updates, and status management
 */
export class WorkOrdersService {
  // ...
}
```

**Ownership Tag Format:**
- `@owner` - Team/domain owner
- `@domain` - Domain identifier
- `@maintainer` - Primary maintainer

---

## II. Boundary Warnings

### Rule 3: Warn Before Crossing Boundaries

**MANDATORY:** Add warnings before crossing module boundaries:

```
⚠️ CROSS-MODULE BOUNDARY DETECTED

Current Domain: work-orders
Target Domain: customers
Files to Modify:
- apps/api/src/customers/customers.service.ts

Reason: [Why crossing boundary is necessary]

⚠️ REQUIRES EXPLICIT PERMISSION

Please respond with:
- "Yes, proceed with cross-module change" - To approve
- "No, find alternative solution" - To reject
```

### Rule 4: Document Cross-Module Dependencies

**MANDATORY:** Document cross-module dependencies:

```typescript
/**
 * @owner work-orders-team
 * @domain work-orders
 * @cross-module-dependency customers
 * 
 * Depends on:
 * - customers.service.ts (Customer validation)
 * 
 * Used by:
 * - jobs.service.ts (Job creation)
 */
export class WorkOrdersService {
  constructor(
    private customersService: CustomersService // Cross-module dependency
  ) {}
}
```

---

## III. Out-of-Scope Module Protection

### Rule 5: Avoid Modifying Out-of-Scope Modules

**MANDATORY:** Avoid modifying out-of-scope modules without permission:

**Out-of-Scope Scenarios:**
- Modifying files in different domain
- Modifying shared libraries without coordination
- Modifying infrastructure code
- Modifying other microservices

**MANDATORY:** If modification is needed:
1. Identify why modification is necessary
2. Request explicit permission
3. Document cross-module dependency
4. Coordinate with domain owner

---

## IV. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, identify:

- File ownership
- Domain boundaries
- Cross-module dependencies
- Ownership tags

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Files are in correct domain
- No unauthorized cross-module changes
- Ownership tags present
- Boundaries respected

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Domain ownership respected
- No out-of-scope modifications
- Ownership tags added
- Boundaries not crossed (without permission)

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- Files in correct domain
- Ownership tags present
- No unauthorized cross-module changes
- Boundaries respected

---

## Violations

**HARD STOP violations:**
- Modifying out-of-scope modules without permission
- Crossing module boundaries without permission
- Missing ownership tags
- Breaking domain boundaries

**Must fix before proceeding:**
- Unauthorized cross-module changes
- Missing ownership documentation
- Incomplete boundary documentation

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** HIGH - Must be followed for every file modification

