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
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: CRITICAL - Pattern Learning & Knowledge Accumulation

## Overview

This rule file enforces error pattern memory, engineering knowledge logging, component pattern consistency, and cross-file pattern learning across all development tasks.

**⚠️ MANDATORY:** Every development task must contribute to collective system knowledge and prevent recurring defects.

---

## I. Error Pattern Memory Rule

### Rule 1: Error Pattern Documentation

**MANDATORY:** Every time a bug is fixed or a risky pattern is mitigated, the agent MUST add or update `docs/error-patterns.md`.

**Required Entry Structure:**

```markdown
## [Pattern Name] - [Date]

### Summary
Brief description of the error pattern.

### Root Cause
What caused this error? Technical explanation.

### Triggering Conditions
- Condition 1
- Condition 2
- Condition 3

### Relevant Code/Modules
- `path/to/file1.ts` - Description
- `path/to/file2.ts` - Description

### How It Was Fixed
Step-by-step explanation of the fix.

### How to Prevent It in the Future
- Prevention strategy 1
- Prevention strategy 2
- Code patterns to follow

### Similar Historical Issues
- Link to related pattern entries
- Reference to similar bugs
```

### Rule 2: Proactive Pattern Application

**MANDATORY:** On each task, during Step 1 (Mandatory Search), the agent MUST:

1. Search `docs/error-patterns.md` for similar past issues
2. Apply known patterns proactively
3. Implement preventive measures from patterns
4. Reference patterns in code comments when applicable

**Example:**
```typescript
// Pattern: API_TIMEOUT_HANDLING (see docs/error-patterns.md)
// Prevention: Always use timeout with AbortController for external API calls
async fetchWithTimeout(url: string, timeoutMs: number = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // Handle timeout error (see pattern documentation)
    throw error;
  }
}
```

### Rule 3: Pattern Search Integration

**MANDATORY:** Before implementing error handling, search for:

- Similar error patterns in `docs/error-patterns.md`
- Known fixes for similar issues
- Prevention strategies that worked
- Anti-patterns to avoid

---

## II. Engineering Knowledge Log

### Rule 4: Engineering Decision Documentation

**MANDATORY:** The agent MUST record "lessons learned" in `docs/engineering-decisions.md`.

**Required Entry Structure:**

```markdown
## [Decision Title] - [Date]

### Decision
What decision was made?

### Context
Why was this decision needed? What problem does it solve?

### Trade-offs
- Pros: Benefit 1, Benefit 2
- Cons: Drawback 1, Drawback 2

### Alternatives Considered
- Alternative 1: Why it was rejected
- Alternative 2: Why it was rejected

### Rationale
Why was this approach chosen?

### Impact
- Short-term impact
- Long-term impact
- Affected areas

### Lessons Learned
- What worked well
- What didn't work
- What would be done differently

### Related Decisions
- Link to related decision entries
```

### Rule 5: Decision Categories

**MANDATORY:** Document decisions about:

- Design trade-offs
- Library or architectural shortcomings
- Recurring anti-patterns
- Observed codebase drift
- Stability improvements
- Performance optimizations
- Security considerations
- Anything that strengthens future decisions

### Rule 6: Decision Search Integration

**MANDATORY:** Before making architectural decisions, search `docs/engineering-decisions.md` for:

- Similar past decisions
- Trade-offs that were considered
- Lessons learned from similar situations
- Patterns that worked or didn't work

---

## III. Component Pattern Consistency Checks

### Rule 7: Pattern Consistency Verification

**MANDATORY:** When modifying existing files, the agent MUST ensure consistency with project-wide patterns in:

1. **Logging Format**
   - Structured logging format
   - Log field names
   - Severity levels

2. **Error Shapes**
   - Error class structure
   - Error code format
   - Error message format

3. **Naming Conventions**
   - Function names
   - Variable names
   - File names
   - Component names

4. **Architectural Patterns**
   - Service layer patterns
   - Controller patterns
   - Repository patterns
   - Component patterns

5. **Test Structure**
   - Test file organization
   - Test naming
   - Test patterns

6. **Request/Response Schemas**
   - API response format
   - Error response format
   - Data transfer objects

7. **Directory Layout**
   - File organization
   - Module structure
   - Feature organization

### Rule 8: Drift Detection and Normalization

**MANDATORY:** If drift is detected:

1. **Identify** the inconsistency
2. **Document** the drift in `docs/engineering-decisions.md`
3. **Normalize** the code to match established patterns
4. **Update** related files to maintain consistency

**Example:**
```typescript
// DRIFT DETECTED: Inconsistent error handling
// Pattern: Use OperationError class (see docs/error-patterns.md)
// Fix: Normalize to use OperationError

// BEFORE (drift):
throw new Error('Operation failed');

// AFTER (normalized):
throw new OperationError(
  'Operation failed',
  'ServiceName',
  'operationName',
  'OPERATION_FAILED',
  ['Expected invariant 1', 'Expected invariant 2']
);
```

### Rule 9: Pattern Documentation

**MANDATORY:** When establishing new patterns:

1. Document in `docs/engineering-decisions.md`
2. Add examples to pattern documentation
3. Update related rule files
4. Create reference examples

---

## IV. Cross-File Pattern Learning

### Rule 10: Pattern Extraction

**MANDATORY:** When working across multiple files, the agent MUST:

1. **Identify** common patterns across files
2. **Extract** reusable patterns
3. **Document** patterns in appropriate files
4. **Apply** patterns consistently

**Example:**
```typescript
// Pattern identified across multiple services:
// - PaymentService, OrderService, InventoryService
// All use similar retry logic with exponential backoff

// Extract to common utility:
// libs/common/src/utils/retry.util.ts
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  // Common retry logic
}

// Apply consistently across all services
```

### Rule 11: Anti-Pattern Detection

**MANDATORY:** Detect and document anti-patterns:

- Code that violates established patterns
- Inconsistent implementations
- Duplicate logic that should be shared
- Patterns that cause problems

**MANDATORY:** Document anti-patterns in `docs/error-patterns.md` or `docs/engineering-decisions.md`.

### Rule 12: Pattern Evolution

**MANDATORY:** When patterns evolve:

1. Document the evolution in `docs/engineering-decisions.md`
2. Update pattern documentation
3. Migrate existing code to new patterns (when feasible)
4. Document migration strategy

---

## V. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1:

- Search `docs/error-patterns.md` for similar past issues
- Search `docs/engineering-decisions.md` for relevant decisions
- Identify patterns in similar implementations
- Check for pattern consistency

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2:

- Analyze patterns from search results
- Verify consistency with established patterns
- Identify pattern drift
- Plan pattern application

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3:

- Verify pattern consistency
- Check for pattern drift
- Verify pattern documentation updated (if new patterns)

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5:

- Pattern files updated (if needed)
- No pattern drift introduced
- Consistency maintained
- Engineering decision logs updated (if applicable)

---

## Violations

**HARD STOP violations:**
- Not documenting error patterns in `docs/error-patterns.md`
- Not searching for similar patterns before implementation
- Introducing pattern drift without normalization
- Not documenting significant engineering decisions

**Must fix before proceeding:**
- Inconsistent patterns across files
- Missing pattern documentation
- Anti-patterns not documented
- Pattern evolution not documented

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

