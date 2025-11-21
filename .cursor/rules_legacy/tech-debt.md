---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - all
priority: normal-high
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: NORMAL-HIGH - Project Health & Tech Debt Logging

## Overview

This rule file enforces technical debt logging, TODO/FIXME cleanup, and remediation planning. Ensures unfinished work is identified, tracked, and addressed.

**⚠️ MANDATORY:** All technical debt must be logged in `docs/tech-debt.md`, TODOs/FIXMEs must be cleaned up when completing work, and remediation plans must be generated.

---

## I. Technical Debt Logging

### Rule 1: Log Technical Debt

**MANDATORY:** Log technical debt in `docs/tech-debt.md`:

**Debt Categories:**
- **Code Quality** - Code smells, technical issues
- **Performance** - Performance bottlenecks
- **Security** - Security vulnerabilities
- **Documentation** - Missing or outdated documentation
- **Testing** - Missing or incomplete tests
- **Architecture** - Architectural issues
- **Dependencies** - Outdated or problematic dependencies

**Example Entry:**
```markdown
## [Date] - WorkOrderService Performance Issue

**Category:** Performance
**Priority:** High
**Location:** `apps/api/src/work-orders/work-orders.service.ts`
**Description:** N+1 query issue in getWorkOrdersWithCustomers method
**Impact:** Slow response times for work order lists
**Remediation Plan:**
1. Use Prisma include to fetch customers in single query
2. Add database index on customer_id
3. Add caching for frequently accessed customers
**Estimated Effort:** 2 hours
**Status:** Open
```

### Rule 2: Update Tech Debt Log

**MANDATORY:** Update tech debt log with current date when adding entries:

```markdown
## 2025-11-16 - [Issue Description]

**Category:** [Category]
**Priority:** [High/Medium/Low]
...
```

**MANDATORY:** Use current system date (check device date) - NEVER hardcode dates.

**Reference:** See `.cursor/rules/core.md` for date handling requirements.

---

## II. TODO/FIXME Cleanup

### Rule 3: Identify Unfinished Work

**MANDATORY:** Identify unfinished work (TODOs, FIXMEs):

```typescript
// Search for TODOs and FIXMEs
grep -r "TODO\|FIXME" .
codebase_search("What unfinished work exists?")
```

**MANDATORY:** Document all TODOs and FIXMEs found.

### Rule 4: Cleanup TODOs/FIXMEs

**MANDATORY:** Clean up TODOs/FIXMEs when completing work:

```typescript
// ❌ WRONG: Leave TODO after completing work
function getWorkOrders() {
  // TODO: Add pagination
  return prisma.workOrder.findMany();
}

// ✅ CORRECT: Remove TODO after implementing
function getWorkOrders(page: number = 1, limit: number = 10) {
  return prisma.workOrder.findMany({
    skip: (page - 1) * limit,
    take: limit
  });
}
```

**MANDATORY:** When completing work that addresses a TODO/FIXME:
1. Remove the TODO/FIXME comment
2. Update tech debt log (mark as resolved)
3. Document the solution

---

## III. Remediation Planning

### Rule 5: Generate Remediation Plan

**MANDATORY:** Generate remediation plan for tech debt:

**Remediation Plan Structure:**
1. **Problem Statement** - What is the issue?
2. **Root Cause** - Why does this issue exist?
3. **Impact** - What is the impact of this issue?
4. **Solution** - How will this be fixed?
5. **Steps** - Step-by-step remediation steps
6. **Estimated Effort** - Time estimate
7. **Priority** - High/Medium/Low
8. **Dependencies** - What needs to be done first?

**Example:**
```markdown
## Remediation Plan: WorkOrderService N+1 Query

**Problem:** N+1 query issue causes slow work order list loading
**Root Cause:** Customer data fetched in loop instead of single query
**Impact:** 2-3 second load times for work order lists
**Solution:** Use Prisma include to fetch customers in single query

**Steps:**
1. Update getWorkOrdersWithCustomers to use include
2. Add database index on customer_id
3. Add caching layer for customer data
4. Update tests to verify performance improvement

**Estimated Effort:** 2 hours
**Priority:** High
**Dependencies:** None
```

### Rule 6: Prioritize Tech Debt

**MANDATORY:** Prioritize tech debt by:

- **Impact** - How much does it affect users/system?
- **Effort** - How much work to fix?
- **Risk** - What risk if not fixed?
- **Dependencies** - What depends on fixing this?

**Priority Levels:**
- **High** - Critical impact, low effort, or high risk
- **Medium** - Moderate impact or effort
- **Low** - Low impact, high effort, or low risk

---

## IV. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Existing tech debt in `docs/tech-debt.md`
- TODOs and FIXMEs in code
- Unfinished work
- Related technical debt

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Tech debt identified
- TODOs/FIXMEs documented
- Remediation plan created
- Priority assigned

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Tech debt logged (if applicable)
- TODOs/FIXMEs addressed
- Remediation plan created
- Current date used

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- Tech debt log updated
- TODOs/FIXMEs cleaned up
- Remediation plan documented
- Current date used in log

---

## Violations

**HARD STOP violations:**
- Not logging technical debt
- Leaving TODOs/FIXMEs after completing work
- Missing remediation plans for high-priority debt
- Using hardcoded dates in tech debt log

**Must fix before proceeding:**
- Missing tech debt documentation
- Incomplete remediation plans
- Unresolved TODOs/FIXMEs
- Outdated tech debt log

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** NORMAL-HIGH - Must be followed for every implementation

