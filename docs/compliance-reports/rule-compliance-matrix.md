# VeroField Rules 2.1 - Rule Compliance Matrix

**Created:** 2025-12-05  
**Version:** 1.0.0  
**Status:** Baseline Established  
**Purpose:** Source of truth for all 25 rules (R01-R25), enforcement levels, and OPA policy mapping

**⚠️ AUTHORITATIVE SOURCE:** This matrix reflects the actual rule numbers and definitions as implemented in `.cursor/rules/*.mdc` files. Rule numbering may differ from the original plan document (`docs/developer/# VeroField Rules 2.md`). This matrix is the authoritative reference for rule numbers and mappings.

---

## Overview

This matrix documents all 25 rules from the 15 .mdc files in `.cursor/rules/`, their enforcement levels, MAD tiers, and future OPA policy mappings.

**Total Rules:** 25 (R01-R25)  
**Rule Files:** 15 .mdc files  
**Enforcement Levels:** BLOCK, OVERRIDE, WARNING  
**MAD Tiers:** 1 (BLOCK), 2 (OVERRIDE), 3 (WARNING)

---

## Rule Summary by Tier

### Tier 1 MAD (BLOCK) - 3 Rules
Critical rules that block merge if violated.

| ID | Rule Name | File | OPA Policy |
|----|-----------|------|------------|
| R01 | Tenant Isolation | 03-security.mdc | security.rego |
| R02 | RLS Enforcement | 03-security.mdc | security.rego |
| R03 | Architecture Boundaries | 04-architecture.mdc | architecture.rego |

### Tier 2 MAD (OVERRIDE) - 10 Rules
Important rules requiring override justification.

| ID | Rule Name | File | OPA Policy |
|----|-----------|------|------------|
| R04 | Layer Synchronization | 05-data.mdc | data-integrity.rego |
| R05 | State Machine Enforcement | 05-data.mdc | data-integrity.rego |
| R06 | Breaking Change Documentation | 05-data.mdc | data-integrity.rego |
| R07 | Error Handling | 06-error-resilience.mdc | error-handling.rego |
| R08 | Structured Logging | 07-observability.mdc | observability.rego |
| R09 | Trace Propagation | 07-observability.mdc | observability.rego |
| R10 | Testing Coverage | 10-quality.mdc | quality.rego |
| R11 | Backend Patterns | 08-backend.mdc | backend.rego |
| R12 | Security Event Logging | 03-security.mdc | security.rego |
| R13 | Input Validation | 03-security.mdc | security.rego |

### Tier 3 MAD (WARNING) - 12 Rules
Best practice rules that warn but don't block.

| ID | Rule Name | File | OPA Policy |
|----|-----------|------|------------|
| R14 | Tech Debt Logging | 12-tech-debt.mdc | tech-debt.rego |
| R15 | TODO/FIXME Handling | 12-tech-debt.mdc | tech-debt.rego |
| R16 | Testing Requirements | 10-quality.mdc | testing.rego |
| R17 | Coverage Requirements | 10-quality.mdc | testing.rego |
| R18 | Performance Budgets | 10-quality.mdc | testing.rego |
| R19 | Accessibility Requirements | 13-ux-consistency.mdc | ux-consistency.rego |
| R20 | UX Consistency | 13-ux-consistency.mdc | ux-consistency.rego |
| R21 | File Organization | 04-architecture.mdc | architecture.rego |
| R22 | Refactor Integrity | 04-architecture.mdc | architecture.rego |
| R23 | Naming Conventions | 02-core.mdc | documentation.rego |
| R24 | Cross-Platform Compatibility | 09-frontend.mdc | frontend.rego |
| R25 | CI/CD Workflow Triggers | 11-operations.mdc | operations.rego |

---

## Detailed Rule Matrix

### R01: Tenant Isolation
- **File:** 03-security.mdc
- **MAD Tier:** 1 (BLOCK)
- **Enforcement:** HARD STOP - CI blocks merge
- **OPA Policy:** security.rego
- **Priority:** CRITICAL
- **Description:** All database queries must include tenant_id filter
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Database query without tenant_id
  - Cross-tenant data access
  - Bypassing RLS policies

### R02: RLS Enforcement
- **File:** 03-security.mdc
- **MAD Tier:** 1 (BLOCK)
- **Enforcement:** HARD STOP - CI blocks merge
- **OPA Policy:** security.rego
- **Priority:** CRITICAL
- **Description:** Row Level Security policies must be enabled and enforced
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Disabling RLS policies
  - Bypassing tenant context
  - Using superuser roles in app

### R03: Architecture Boundaries
- **File:** 04-architecture.mdc
- **MAD Tier:** 1 (BLOCK)
- **Enforcement:** HARD STOP - Requires human approval
- **OPA Policy:** architecture.rego
- **Priority:** CRITICAL
- **Description:** Cannot create new microservices or top-level directories without approval
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Creating new app in apps/
  - Creating new top-level directory
  - Cross-service relative imports
  - New database schema file

### R04: Layer Synchronization
- **File:** 05-data.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** data-integrity.rego
- **Priority:** HIGH
- **Description:** Schema, DTOs, types, and contracts must stay synchronized
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Schema change without DTO update
  - DTO change without type update
  - Missing migration
  - Contract mismatch

### R05: State Machine Enforcement
- **File:** 05-data.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** data-integrity.rego
- **Priority:** HIGH
- **Description:** State transitions must follow documented state machines
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Illegal state transition
  - Missing state machine doc
  - No transition validation
  - Missing audit log

### R06: Breaking Change Documentation
- **File:** 05-data.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs migration guide
- **OPA Policy:** data-integrity.rego
- **Priority:** HIGH
- **Description:** Breaking changes require migration guide
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - API contract change
  - Schema breaking change
  - Event schema change
  - No migration guide

### R07: Error Handling
- **File:** 06-error-resilience.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** error-handling.rego
- **Priority:** HIGH
- **Description:** No silent failures, all errors must be logged and handled
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Empty catch block
  - Swallowed promise
  - Missing await
  - No error logging

### R08: Structured Logging
- **File:** 07-observability.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** observability.rego
- **Priority:** HIGH
- **Description:** All logs must be structured with required fields
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - console.log usage
  - Unstructured logging
  - Missing traceId
  - Missing tenantId

### R09: Trace Propagation
- **File:** 07-observability.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** observability.rego
- **Priority:** HIGH
- **Description:** TraceId must propagate through all layers
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Missing traceId in logs
  - No trace propagation
  - Missing context
  - Lost trace chain

### R10: Testing Coverage
- **File:** 10-quality.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** quality.rego
- **Priority:** HIGH
- **Description:** All code changes must have appropriate test coverage (unit/regression/integration/E2E)
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - New feature without unit tests
  - Bug fix without regression tests
  - Missing integration tests for DB/API changes
  - Missing E2E tests for critical workflows

### R11: Backend Patterns
- **File:** 08-backend.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** backend.rego
- **Priority:** HIGH
- **Description:** NestJS and Prisma patterns must be followed
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Wrong file structure
  - Missing DTOs
  - No validation
  - Wrong imports

### R12: Security Event Logging
- **File:** 03-security.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** security.rego
- **Priority:** HIGH
- **Description:** Security events must be logged with audit trail
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Auth event not logged
  - Permission change not logged
  - No audit trail
  - Missing security context

### R13: Input Validation
- **File:** 03-security.mdc
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** security.rego
- **Priority:** HIGH
- **Description:** All user input must be validated on backend
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - No input validation
  - Missing sanitization
  - No XSS prevention
  - Trust client input

### R14: Tech Debt Logging
- **File:** 12-tech-debt.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** tech-debt.rego
- **Priority:** MEDIUM
- **Description:** Tech debt must be logged in docs/tech-debt.md
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Unlogged tech debt
  - Missing remediation plan
  - No effort estimate
  - Hardcoded date in log

### R15: TODO/FIXME Handling
- **File:** 12-tech-debt.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** tech-debt.rego
- **Priority:** MEDIUM
- **Description:** TODO/FIXME must be addressed or logged
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Resolved TODO not removed
  - New TODO without context
  - FIXME without issue
  - Stale TODO

### R16: Testing Requirements
- **File:** 10-quality.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** testing.rego
- **Priority:** MEDIUM
- **Description:** New code requires tests (unit/integration/E2E)
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - New code without tests
  - Missing test coverage
  - No error path tests
  - Untested edge cases

### R17: Coverage Requirements
- **File:** 10-quality.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** testing.rego
- **Priority:** MEDIUM
- **Description:** Maintain minimum test coverage thresholds
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Coverage below threshold
  - Decreasing coverage
  - Untested critical paths
  - Missing integration tests

### R18: Performance Budgets
- **File:** 10-quality.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** testing.rego
- **Priority:** MEDIUM
- **Description:** Code must meet performance budgets (API response times, frontend metrics)
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Slow queries
  - Large bundle size
  - High memory usage
  - Slow API response

### R19: Accessibility Requirements
- **File:** 13-ux-consistency.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** ux-consistency.rego
- **Priority:** MEDIUM
- **Description:** UI components must meet WCAG accessibility standards
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Missing ARIA labels
  - Keyboard navigation issues
  - Color contrast violations
  - Missing alt text

### R20: UX Consistency
- **File:** 13-ux-consistency.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** ux-consistency.rego
- **Priority:** MEDIUM
- **Description:** UI must follow design system and UX patterns
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Custom component instead of design system
  - Inconsistent spacing
  - Wrong typography
  - Accessibility issues

### R21: File Organization
- **File:** 04-architecture.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** architecture.rego
- **Priority:** MEDIUM
- **Description:** Files must be in correct monorepo locations
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Wrong directory
  - Deprecated path usage
  - File in wrong layer
  - Missing .gitkeep

### R22: Refactor Integrity
- **File:** 04-architecture.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** architecture.rego
- **Priority:** MEDIUM
- **Description:** Refactoring must include behavior-diffing tests, regression tests, and risk surface documentation
- **Step 5 Status:** ✅ Complete
- **Triggers:**
  - Refactor without behavior-diffing tests
  - Refactor without regression tests
  - Refactor without risk surface documentation
  - Refactoring unstable code
  - Breaking changes in refactor

### R23: Naming Conventions
- **File:** 02-core.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** documentation.rego
- **Priority:** MEDIUM
- **Description:** Follow naming conventions (PascalCase, camelCase, etc.)
- **Step 5 Status:** ✅ Complete
- **Test Results:** 15/15 passing
- **Completion Date:** 2025-12-05
- **Implementation:** [R23-IMPLEMENTATION-COMPLETE.md](R23-IMPLEMENTATION-COMPLETE.md)
- **Triggers:**
  - Wrong case usage
  - Inconsistent naming
  - Old naming (VeroSuite)
  - Unclear names

### R24: Cross-Platform Compatibility
- **File:** 09-frontend.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** frontend.rego
- **Priority:** MEDIUM
- **Description:** Ensure cross-platform compatibility for code shared between web and mobile
- **Step 5 Status:** ✅ Complete
- **Test Results:** 15/15 passing
- **Completion Date:** 2025-12-05
- **Implementation:** [R24-IMPLEMENTATION-COMPLETE.md](R24-IMPLEMENTATION-COMPLETE.md)
- **Triggers:**
  - Platform-specific API without platform check
  - Node.js API in frontend/mobile code
  - React Native API in web code
  - Duplicated business logic (shared library violation)
  - Hardcoded path separators
  - Case-sensitive path references

### R25: CI/CD Workflow Triggers
- **File:** 11-operations.mdc
- **MAD Tier:** 3 (WARNING)
- **Enforcement:** WARNING - Logged but doesn't block
- **OPA Policy:** operations.rego
- **Priority:** MEDIUM
- **Description:** Workflows must have proper triggers configured
- **Step 5 Status:** ✅ Complete
- **Implementation:** [R25-IMPLEMENTATION-COMPLETE.md](R25-IMPLEMENTATION-COMPLETE.md)
- **Triggers:**
  - Missing trigger types
  - Wrong workflow name
  - Inconsistent artifacts
  - Missing conditions

---

## OPA Policy Consolidation Plan

### Consolidated Policies (Target: ≤15 policies)

1. **security.rego** (Tier 1 + Tier 2)
   - R01: Tenant Isolation
   - R02: RLS Enforcement
   - R12: Security Event Logging
   - R13: Input Validation

2. **architecture.rego** (Tier 1)
   - R03: Architecture Boundaries

3. **data-integrity.rego** (Tier 2)
   - R04: Layer Synchronization
   - R05: State Machine Enforcement
   - R06: Breaking Change Documentation

4. **error-handling.rego** (Tier 2)
   - R07: Error Handling

5. **observability.rego** (Tier 2)
   - R08: Structured Logging
   - R09: Trace Propagation

6. **quality.rego** (Tier 2)
   - R10: Testing Coverage

7. **backend.rego** (Tier 2)
   - R11: Backend Patterns

8. **tech-debt.rego** (Tier 3)
   - R14: Tech Debt Logging
   - R15: TODO/FIXME Handling

9. **testing.rego** (Tier 3)
   - R16: Testing Requirements
   - R17: Coverage Requirements
   - R18: Performance Budgets

10. **ux-consistency.rego** (Tier 3)
    - R19: Accessibility Requirements
    - R20: UX Consistency

11. **architecture.rego** (Tier 3 - extended)
    - R21: File Organization
    - R22: Refactor Integrity

12. **documentation.rego** (Tier 3)
    - R23: Naming Conventions

13. **frontend.rego** (Tier 3)
    - R24: Cross-Platform Compatibility

14. **operations.rego** (Tier 3)
    - R25: CI/CD Workflow Triggers

**Total Policies:** 14 (within ≤15 target)

---

## Step 5 Verification Status

**Current Baseline:** 100.0% (measured 2025-12-05)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete (≥80%) | 25 | 100.0% |
| 🟡 Partial (40-79%) | 1 | 4.0% |
| ❌ Missing (<40%) | 0 | 0.0% |

**Files with Step 5:**
- 01-enforcement.mdc (40.0% - partial)
- 02-core.mdc (R23 - complete)
- 03-security.mdc (R01, R02, R12, R13 - complete)
- 04-architecture.mdc (R03, R21, R22 - complete)
- 05-data.mdc (R04, R05, R06 - complete)
- 06-error-resilience.mdc (R07 - complete)
- 07-observability.mdc (R08, R09 - complete)
- 08-backend.mdc (R11 - complete)
- 09-frontend.mdc (R24 - complete)
- 10-quality.mdc (R10, R16, R17, R18 - complete)
- 11-operations.mdc (R25 - complete)
- 12-tech-debt.mdc (R14, R15 - complete)
- 13-ux-consistency.mdc (R19, R20 - complete)
- agent-instructions.mdc (0.0% - incomplete)

**Files missing Step 5:** 2 files
- 00-master.mdc
- 14-verification.mdc

---

## Implementation Phases

### Phase 1 (Weeks 6-7): Tier 1 MAD Rules
- R01: Tenant Isolation
- R02: RLS Enforcement
- R03: Architecture Boundaries
- **OPA Policies:** security.rego, architecture.rego

### Phase 2 (Weeks 8-11): Tier 2 MAD Rules
- R04-R13: All Tier 2 rules
- **OPA Policies:** data-integrity.rego, error-handling.rego, observability.rego, backend.rego, frontend.rego

### Phase 2 (Weeks 8-11): Tier 3 MAD Rules
- R14-R25: All Tier 3 rules
- **OPA Policies:** tech-debt.rego, testing.rego, ux-consistency.rego, architecture.rego, documentation.rego, frontend.rego, operations.rego

---

## Enforcement Levels Summary

| Level | Count | Percentage | Action |
|-------|-------|------------|--------|
| BLOCK (Tier 1) | 3 | 12% | CI blocks merge |
| OVERRIDE (Tier 2) | 10 | 40% | Requires justification |
| WARNING (Tier 3) | 12 | 48% | Logged, doesn't block |
| **Total** | **25** | **100%** | - |

---

## Next Steps

1. **Phase 0 (Weeks 4-5):** Complete Step 5 sections for all 25 rules (R01-R23 completed; R24, R25 pending)
2. **Phase 1 (Weeks 6-7):** Implement Tier 1 OPA policies
3. **Phase 2 (Weeks 8-11):** Implement Tier 2 & 3 OPA policies
4. **Phase 3 (Weeks 11-13):** Build compliance dashboard
5. **Phase 4 (Weeks 14-16):** Training and production rollout

---

**Last Updated:** 2025-12-05 (Updated: R25 implementation complete - 17/17 tests passing, Step 5 status for R01-R25 complete (100%))  
**Maintained By:** Rules Champion Team  
**Review Frequency:** Weekly during implementation, monthly after rollout

