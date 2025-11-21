---
# Cursor Rule Metadata
version: 2.1
project: VeroField
scope:
  - all
priority: critical
last_updated: 2025-11-17
always_apply: true
---

# PRIORITY: CRITICAL - Rule Enforcement & Compliance

## ⚠️ MANDATORY PRE-IMPLEMENTATION CHECKLIST

**BEFORE writing ANY code, you MUST complete this checklist:**

### Step 1: Search & Discovery (MANDATORY)
- [ ] **MUST** search for existing components: `codebase_search("How does [feature] work?")`
- [ ] **MUST** check component library: `read_file("docs/reference/COMPONENT_LIBRARY_CATALOG.md")`
- [ ] **MUST** find 2-3 similar implementations using `grep` and `codebase_search`
- [ ] **MUST** verify file location using `list_dir` and `glob_file_search`
- [ ] **MUST** read relevant documentation files
- [ ] **MUST** search `docs/error-patterns.md` for similar past issues (see `.cursor/rules/pattern-learning.md`)
- [ ] **MUST** search `docs/engineering-decisions.md` for relevant decisions (see `.cursor/rules/pattern-learning.md`)
- [ ] **MUST** identify all error-prone operations (external I/O, async/await, user input, parsing, cross-service, auth, caching, events, concurrency) (see `.cursor/rules/error-resilience.md`)
- [ ] **MUST** search for existing logging patterns in similar code (see `.cursor/rules/observability.md`)
- [ ] **MUST** search for trace propagation implementations (see `.cursor/rules/observability.md`)
- [ ] **MUST** search for state machine documentation (if stateful component) (see `.cursor/rules/state-integrity.md`)
- [ ] **MUST** search for contract definitions (if schema changes) (see `.cursor/rules/contracts.md`)
- [ ] **MUST** check for existing dependencies (if adding new dependency) (see `.cursor/rules/dependencies.md`)
- [ ] **MUST** verify transaction requirements (if multi-step DB operations) (see `.cursor/rules/database-integrity.md`)
- [ ] **MUST** check layer synchronization needs (if touching any layer) (see `.cursor/rules/layer-sync.md`)
- [ ] **MUST** check for old naming (VeroSuite, @verosuite/*) in affected files (see `.cursor/rules/naming-consistency.md`)

**STOP if you haven't completed all searches above.**

### Step 2: Pattern Analysis (MANDATORY)
- [ ] **MUST** identify the pattern to follow from similar implementations
- [ ] **MUST** verify correct file path (check `.cursor/rules/monorepo.md` for structure)
- [ ] **MUST** check if component should be in `ui/` (reusable) or feature-specific
- [ ] **MUST** verify import patterns match existing code
- [ ] **MUST** analyze identified risks from Step 1 (see `.cursor/rules/error-resilience.md`)
- [ ] **MUST** check for known error patterns from `docs/error-patterns.md` (see `.cursor/rules/pattern-learning.md`)
- [ ] **MUST** verify error handling patterns match existing codebase (see `.cursor/rules/error-resilience.md`)
- [ ] **MUST** check trace propagation patterns (see `.cursor/rules/observability.md`)
- [ ] **MUST** evaluate whether similar risks exist and plan guardrails (see `.cursor/rules/predictive-prevention.md`)
- [ ] **MUST** verify state machine pattern matches existing implementations (if stateful) (see `.cursor/rules/state-integrity.md`)
- [ ] **MUST** verify contract patterns match existing implementations (if schema changes) (see `.cursor/rules/contracts.md`)
- [ ] **MUST** verify dependency patterns match existing code (if adding dependency) (see `.cursor/rules/dependencies.md`)
- [ ] **MUST** verify transaction patterns match existing code (if multi-step DB operations) (see `.cursor/rules/database-integrity.md`)
- [ ] **MUST** verify layer synchronization patterns (if touching any layer) (see `.cursor/rules/layer-sync.md`)

**STOP if pattern is unclear - ask for clarification.**

### Step 3: Rule Compliance Check (MANDATORY)
- [ ] **MUST** verify tenant isolation if touching database
- [ ] **MUST** check if using correct file paths (see `.cursor/rules/monorepo.md`)
- [ ] **MUST** verify using shared libraries from `libs/common/` if applicable
- [ ] **MUST** check if feature requires VeroAI patterns (see `.cursor/rules/veroai.md`)
- [ ] **MUST** use current system date (check device date) - NEVER hardcode dates ⭐ **CRITICAL**
- [ ] **MUST** verify structured logging requirements met (see `.cursor/rules/observability.md`)
- [ ] **MUST** verify trace ID propagation present (see `.cursor/rules/observability.md`)
- [ ] **MUST** verify error handling blocks present for all error-prone operations (see `.cursor/rules/error-resilience.md`)
- [ ] **MUST** check for silent failures (empty catch blocks, swallowed promises, missing awaits) (see `.cursor/rules/error-resilience.md`)
- [ ] **MUST** verify security event logging (if applicable) (see `.cursor/rules/observability.md`)
- [ ] **MUST** verify predictive guardrails applied (see `.cursor/rules/predictive-prevention.md`)
- [ ] **MUST** verify state machine integrity (if stateful component) (see `.cursor/rules/state-integrity.md`)
- [ ] **MUST** verify contract consistency (if schema changes) (see `.cursor/rules/contracts.md`)
- [ ] **MUST** verify dependency governance (if adding dependency) (see `.cursor/rules/dependencies.md`)
- [ ] **MUST** verify transaction safety (if multi-step DB operations) (see `.cursor/rules/database-integrity.md`)
- [ ] **MUST** verify layer synchronization (if touching any layer) (see `.cursor/rules/layer-sync.md`)
- [ ] **MUST** verify no architecture changes without permission (see `.cursor/rules/architecture-scope.md`)
- [ ] **MUST** verify no old naming (VeroSuite, @verosuite/*) introduced (see `.cursor/rules/naming-consistency.md`)
- [ ] **MUST** verify performance characteristics analyzed (see `.cursor/rules/performance.md`)
- [ ] **MUST** verify event schemas validated (if producing/consuming events) (see `.cursor/rules/eventing.md`)
- [ ] **MUST** verify cross-platform compatibility (if applicable) (see `.cursor/rules/cross-platform.md`)
- [ ] **MUST** verify accessibility requirements met (if UI component) (see `.cursor/rules/accessibility.md`)
- [ ] **MUST** verify tooling compliance (lint/format, TypeScript) (see `.cursor/rules/tooling.md`)
- [ ] **MUST** verify refactor integrity (if refactoring) (see `.cursor/rules/refactoring.md`)
- [ ] **MUST** verify UX consistency (if UI component) (see `.cursor/rules/ux-consistency.md`)
- [ ] **MUST** verify file ownership respected (see `.cursor/rules/ownership.md`)
- [ ] **MUST** verify tech debt logged (if applicable) (see `.cursor/rules/tech-debt.md`)
- [ ] **MUST** verify file organization compliance (see `.cursor/rules/file-organization.md`)
- [ ] **MUST** verify workflow triggers are properly configured (if modifying workflows) (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** verify all workflows have `on:` section with appropriate triggers (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** verify PR workflows include `types: [opened, synchronize, reopened]` (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** verify workflow_run dependencies reference existing workflows (exact name match, case-sensitive) (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** verify artifact names match between upload/download steps (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** verify artifact names follow kebab-case convention (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** verify conditional execution for score thresholds (if applicable) (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** verify error handling for missing artifacts (see `.cursor/rules/ci-automation.md`)
- [ ] **MUST** run `.cursor/scripts/validate_workflow_triggers.py` before merging workflow changes (see `.cursor/rules/ci-automation.md`)
  - [ ] File is in correct directory per file organization rules
  - [ ] No prohibited files in root directory
  - [ ] Documentation files are in `docs/` subdirectories
  - [ ] Assets are in `branding/assets/` or `docs/assets/`
  - [ ] Test outputs are gitignored or archived
  - [ ] Temporary files are cleaned up

**STOP if any rule violation detected.**

### Step 4: Implementation Plan (MANDATORY)
- [ ] **MUST** create todo list for complex features (>3 steps)
- [ ] **MUST** explain what you found in searches
- [ ] **MUST** describe the pattern you'll follow
- [ ] **MUST** list files you'll create/modify

**STOP if plan is not clear.**

### Step 5: Post-Implementation Audit (MANDATORY) ⭐ **NEW**
- [ ] **MUST** audit ALL files touched for code compliance
- [ ] **MUST** verify file paths are correct (monorepo structure)
- [ ] **MUST** verify imports use correct paths (`@verofield/common/*`)
- [ ] **MUST** verify no old naming (VeroSuite, @verosuite/*) remains (see `.cursor/rules/naming-consistency.md`)
- [ ] **MUST** verify tenant isolation (if database queries)
- [ ] **MUST** verify file organization compliance (see `.cursor/rules/file-organization.md`)
  - [ ] All files are in correct directories
  - [ ] No prohibited files in root
  - [ ] Documentation files properly organized
  - [ ] Assets properly organized
  - [ ] Test outputs gitignored
  - [ ] Temporary files cleaned up
  - [ ] Run `scripts/validate-file-organization.ps1` if available
- [ ] **MUST** verify date compliance (current system date, not hardcoded)
- [ ] **MUST** verify following established patterns
- [ ] **MUST** verify no duplicate components created
- [ ] **MUST** verify TypeScript types are correct (no `any`)
- [ ] **MUST** verify security boundaries maintained
- [ ] **MUST** verify documentation updated with current date
- [ ] **MUST** verify all error paths have tests (see `.cursor/rules/error-resilience.md`)
- [ ] **MUST** verify logging meets structured logging policy (see `.cursor/rules/observability.md`)
- [ ] **MUST** verify no silent failures remain (see `.cursor/rules/error-resilience.md`)
- [ ] **MUST** verify observability hooks present (trace IDs, structured logs) (see `.cursor/rules/observability.md`)
- [ ] **MUST** verify pattern files updated (if needed) (see `.cursor/rules/pattern-learning.md`)
- [ ] **MUST** verify tests pass (regression + preventative) (see `.cursor/rules/predictive-prevention.md`)
- [ ] **MUST** verify no schema drift or naming violations (see `.cursor/rules/predictive-prevention.md`)
- [ ] **MUST** verify predictive guardrails applied (see `.cursor/rules/predictive-prevention.md`)
- [ ] **MUST** verify cross-layer traceability intact (traceId, spanId, requestId propagated) (see `.cursor/rules/observability.md`)
- [ ] **MUST** verify engineering decision logs updated (if applicable) (see `.cursor/rules/pattern-learning.md`)
- [ ] **MUST** audit state machine compliance (if stateful component) (see `.cursor/rules/state-integrity.md`)
- [ ] **MUST** verify workflow triggers validated (if workflows modified) (see `.cursor/rules/ci-automation.md`)
  - [ ] Run `.cursor/scripts/validate_workflow_triggers.py` and verify it passes
  - [ ] Verify all `workflow_run` references exist
  - [ ] Verify artifact names match between workflows
- [ ] **MUST** audit contract consistency (if schema changes) (see `.cursor/rules/contracts.md`)
- [ ] **MUST** audit dependency changes (if adding dependency) (see `.cursor/rules/dependencies.md`)
- [ ] **MUST** audit transaction safety (if multi-step DB operations) (see `.cursor/rules/database-integrity.md`)
- [ ] **MUST** audit layer synchronization (if touching any layer) (see `.cursor/rules/layer-sync.md`)
- [ ] **MUST** verify performance tests pass (if applicable) (see `.cursor/rules/performance.md`)
- [ ] **MUST** verify testing requirements met (see `.cursor/rules/verification.md`)
  - Unit tests for new functionality
  - Integration tests for API/database interactions
  - E2E tests considered for critical workflows (recommended, not mandatory)
- [ ] **MUST** verify event schemas validated (if producing/consuming events) (see `.cursor/rules/eventing.md`)
- [ ] **MUST** verify cross-platform compatibility (if applicable) (see `.cursor/rules/cross-platform.md`)
- [ ] **MUST** verify accessibility checks pass (if UI component) (see `.cursor/rules/accessibility.md`)
- [ ] **MUST** verify tooling compliance (lint/format, TypeScript) (see `.cursor/rules/tooling.md`)
- [ ] **MUST** verify refactor integrity (if refactoring) (see `.cursor/rules/refactoring.md`)
- [ ] **MUST** verify UX consistency (if UI component) (see `.cursor/rules/ux-consistency.md`)
- [ ] **MUST** verify file ownership respected (see `.cursor/rules/ownership.md`)
- [ ] **MUST** verify tech debt logged (if applicable) (see `.cursor/rules/tech-debt.md`)

**STOP if any compliance violation found - fix before proceeding.**

---

## 🚫 HARD STOPS - DO NOT PROCEED IF:

1. **File Path Violations**
   - ❌ Using `backend/src/` instead of `apps/api/src/`
   - ❌ Using `backend/prisma/` instead of `libs/common/prisma/`
   - ❌ Creating files in wrong directory
   - **ACTION:** Read `.cursor/rules/monorepo.md` and correct path

2. **Component Duplication**
   - ❌ Creating component that already exists
   - ❌ Not checking `frontend/src/components/ui/` first
   - **ACTION:** Search for existing component, use it instead

3. **Security Violations**
   - ❌ Database query without `tenantId` filter
   - ❌ Bypassing RLS policies
   - ❌ Not validating tenant context
   - **ACTION:** Read `.cursor/rules/security.md` and fix

4. **Import Violations**
   - ❌ Using relative imports across services
   - ❌ Not using `@verofield/common/*` for shared code
   - ❌ Duplicating code instead of using shared library
   - **ACTION:** Read `.cursor/rules/monorepo.md` and fix imports

5. **Pattern Violations**
   - ❌ Creating custom form pattern instead of using standard
   - ❌ Not using `CustomerSearchSelector` for customer fields
   - ❌ Not following established component patterns
   - **ACTION:** Read `.cursor/rules/forms.md` and `.cursor/rules/frontend.md`

6. **Date Violations** ⭐ **CRITICAL**
   - ❌ Hardcoding dates (e.g., "2025-01-27" instead of checking current date)
   - ❌ Using old dates in "Last Updated" fields
   - ❌ Not updating "Last Updated" when modifying documentation
   - **ACTION:** Always check device/system date before writing dates
   - **FORMAT:** Use ISO 8601: `YYYY-MM-DD` (e.g., `2025-11-15`)
   - **VERIFY:** Date must match current system date, not a hardcoded value

---

## ✅ MANDATORY VERIFICATION STEPS

### ⚠️ CRITICAL: File Audit Requirement

**MANDATORY:** After modifying ANY file, you MUST audit it for code compliance.

**Audit Checklist for Each File Touched:**
1. **File Path Compliance**
   - [ ] File is in correct directory per monorepo structure
   - [ ] No old paths (`backend/src/` or `backend/prisma/`)
   - [ ] Imports use correct paths (`@verofield/common/*` for shared)

2. **Code Quality Compliance**
   - [ ] TypeScript types are correct (no `any`, proper interfaces)
   - [ ] Following established patterns (forms, components, etc.)
   - [ ] No duplicate functionality created
   - [ ] Error handling is consistent

3. **Security Compliance**
   - [ ] Tenant isolation maintained (if database queries)
   - [ ] RLS policies enforced
   - [ ] No secrets in code
   - [ ] Input validation present

4. **Documentation Compliance**
   - [ ] "Last Updated" timestamp uses current system date (not hardcoded)
   - [ ] Date format is ISO 8601: `YYYY-MM-DD`
   - [ ] Relevant documentation files updated

5. **Pattern Compliance**
   - [ ] Using existing components from `ui/` directory
   - [ ] Following form patterns (react-hook-form + zod)
   - [ ] Using `CustomerSearchSelector` for customer fields
   - [ ] Naming conventions followed

6. **Observability Compliance** (see `.cursor/rules/observability.md`)
   - [ ] Structured logging with required fields (message, context, traceId, operation, severity)
   - [ ] Trace IDs propagated across service boundaries
   - [ ] Critical path instrumentation present
   - [ ] Security events logged (if applicable)

7. **Error Resilience Compliance** (see `.cursor/rules/error-resilience.md`)
   - [ ] No silent failures (empty catch blocks, swallowed promises)
   - [ ] Error handling blocks present for error-prone operations
   - [ ] Error messages are human-readable with diagnostic metadata
   - [ ] All external calls wrapped with guards, timeouts, try/catch

8. **Pattern Learning Compliance** (see `.cursor/rules/pattern-learning.md`)
   - [ ] Error patterns documented in `docs/error-patterns.md` (if new pattern)
   - [ ] Engineering decisions documented in `docs/engineering-decisions.md` (if significant)
   - [ ] Pattern consistency maintained

9. **Predictive Prevention Compliance** (see `.cursor/rules/predictive-prevention.md`)
   - [ ] Predictive guardrails applied for known error patterns
   - [ ] Failure modes mapped for critical components
   - [ ] No schema drift introduced
   - [ ] Regression tests created for bug fixes

**If ANY violation found: STOP and fix before proceeding.**

### After Every Code Change:

1. **File Path Verification**
   ```bash
   # Verify file is in correct location
   - Check: Is file in correct directory per monorepo structure?
   - Check: Are imports using correct paths?
   - Check: Are shared libraries imported from @verofield/common/*?
   ```

2. **Component Reuse Verification**
   ```bash
   # Verify no duplication
   - Check: Did I search for existing component first?
   - Check: Am I using existing component from ui/?
   - Check: Am I creating duplicate functionality?
   ```

3. **Security Verification**
   ```bash
   # Verify tenant isolation
   - Check: Does database query include tenantId?
   - Check: Is RLS policy enforced?
   - Check: Is tenant context validated?
   ```

4. **Pattern Compliance Verification**
   ```bash
   # Verify following patterns
   - Check: Am I following established form pattern?
   - Check: Am I using correct import patterns?
   - Check: Am I following naming conventions?
   ```

5. **Documentation & Date Verification** ⭐ **CRITICAL**
   ```bash
   # Verify documentation updated
   - Check: Did I update "Last Updated" timestamp?
   - Check: Did I update relevant .md files?
   - Check: Did I use current system date/time (NOT hardcoded)?
   - Check: Did I verify the date matches the device/system date?
   - Check: Is the date format correct (YYYY-MM-DD)?
   ```
   
   **MANDATORY:** Before writing ANY date:
   1. Check current system/device date
   2. Use that exact date (never hardcode)
   3. Format as ISO 8601: `YYYY-MM-DD`
   4. Verify date matches current date before committing

---

## 🔍 MANDATORY SEARCH PATTERNS

### Before ANY Implementation:

```typescript
// MANDATORY: Execute these searches in parallel
1. codebase_search("How does [FEATURE] work in VeroField?")
2. codebase_search("Where is [COMPONENT] implemented?")
3. glob_file_search("**/*[pattern]*.tsx") // For components
4. glob_file_search("**/*[pattern]*.ts")  // For services
5. grep -r "[pattern]" frontend/src/components/
6. read_file("docs/reference/COMPONENT_LIBRARY_CATALOG.md")
7. read_file("docs/reference/DEVELOPMENT_BEST_PRACTICES.md")
8. read_file("docs/error-patterns.md") // Search for similar past issues
9. read_file("docs/engineering-decisions.md") // Search for relevant decisions
10. codebase_search("How is structured logging implemented?") // Observability patterns
11. codebase_search("How are trace IDs propagated?") // Trace propagation patterns
```

**DO NOT proceed without completing these searches.**

---

## 📋 MANDATORY CODE REVIEW CHECKLIST

**Before submitting ANY code, verify:**

### File Structure
- [ ] File is in correct directory per monorepo structure
- [ ] Imports use correct paths (`@verofield/common/*` for shared)
- [ ] No old paths (`backend/src/` or `backend/prisma/`)

### Date Compliance ⭐ **CRITICAL**
- [ ] Used current system/device date (checked, not hardcoded)
- [ ] Date format is ISO 8601: `YYYY-MM-DD`
- [ ] "Last Updated" timestamp matches current date
- [ ] No hardcoded dates in documentation
- [ ] Verified date is correct before committing

### Component Usage
- [ ] Searched for existing component first
- [ ] Using component from `ui/` if reusable
- [ ] No duplicate functionality created

### Security
- [ ] All database queries include `tenantId`
- [ ] RLS policies enforced
- [ ] Tenant context validated
- [ ] No secrets in code

### Patterns
- [ ] Following established form pattern
- [ ] Using `CustomerSearchSelector` for customer fields
- [ ] Using standard imports
- [ ] Following naming conventions

### TypeScript
- [ ] Proper types defined (no `any`)
- [ ] Interfaces for all props
- [ ] Type safety maintained

### Documentation & Date Compliance ⭐ **CRITICAL**
- [ ] Updated "Last Updated" timestamp
- [ ] Updated relevant .md files
- [ ] **VERIFIED** current system/device date before writing
- [ ] Used current date/time (NOT hardcoded - checked from device)
- [ ] Date format is ISO 8601: `YYYY-MM-DD`
- [ ] Date matches current system date exactly

### Observability & Error Resilience (see `.cursor/rules/observability.md` and `.cursor/rules/error-resilience.md`)
- [ ] Structured logging with required fields
- [ ] Trace IDs propagated correctly
- [ ] Error handling present for all error-prone operations
- [ ] No silent failures
- [ ] Tests verify observability requirements

### Pattern Learning & Prevention (see `.cursor/rules/pattern-learning.md` and `.cursor/rules/predictive-prevention.md`)
- [ ] Error patterns documented (if new)
- [ ] Engineering decisions documented (if significant)
- [ ] Predictive guardrails applied
- [ ] Regression tests created for bug fixes

---

## 🎯 RULE ENFORCEMENT STRATEGIES

### 1. Explicit "MUST" Language
- Use "MUST" for mandatory requirements
- Use "MUST NOT" for prohibited actions
- Use "SHALL" for requirements
- Use "SHOULD" for recommendations

### 2. Stop Conditions
- Define clear conditions where AI must stop
- Require user confirmation before proceeding
- Block implementation if prerequisites not met

### 3. Verification Loops
- Require verification after each major step
- Check compliance before proceeding
- Validate against rules before completion

### 4. Pattern Matching
- Provide exact code patterns to follow
- Show correct vs incorrect examples
- Use templates for common operations

### 5. Reminder System
- Add reminders at key decision points
- Include rule references in code comments
- Show rule violations explicitly

---

## 🔄 MANDATORY WORKFLOW

### For Every Feature Request:

```
1. RECEIVE REQUEST
   ↓
2. EXECUTE MANDATORY SEARCHES (parallel)
   ↓
3. ANALYZE RESULTS
   ↓
4. CHECK RULE COMPLIANCE
   ↓
5. CREATE IMPLEMENTATION PLAN
   ↓
6. VERIFY PLAN COMPLIANCE
   ↓
7. IMPLEMENT CODE
   ↓
8. AUDIT ALL FILES TOUCHED ⭐ **MANDATORY**
   │  - Verify file paths
   │  - Verify imports
   │  - Verify security
   │  - Verify dates
   │  - Verify patterns
   │  - Verify TypeScript
   ↓
9. FIX ANY VIOLATIONS FOUND
   ↓
10. UPDATE DOCUMENTATION
   ↓
11. FINAL VERIFICATION
```

**DO NOT skip any step. File audit is MANDATORY after implementation.**

---

## ⚡ QUICK REFERENCE: Most Violated Rules

### Rule 1: File Paths
**WRONG:** `backend/src/`, `backend/prisma/`  
**RIGHT:** `apps/api/src/`, `libs/common/prisma/`  
**CHECK:** `.cursor/rules/monorepo.md`

### Rule 2: Component Reuse
**WRONG:** Creating new component without searching  
**RIGHT:** Search `ui/` directory first, reuse existing  
**CHECK:** `.cursor/rules/frontend.md`

### Rule 3: Tenant Isolation
**WRONG:** Database query without `tenantId`  
**RIGHT:** Always include `tenantId` in WHERE clause  
**CHECK:** `.cursor/rules/security.md`

### Rule 4: Import Patterns
**WRONG:** `import { X } from '../../common/'`  
**RIGHT:** `import { X } from '@verofield/common/'`  
**CHECK:** `.cursor/rules/monorepo.md`

### Rule 5: Form Patterns
**WRONG:** Custom form implementation  
**RIGHT:** Use react-hook-form + zod + standard components  
**CHECK:** `.cursor/rules/forms.md`

### Rule 6: Date Compliance ⭐ **CRITICAL**
**WRONG:** `**Last Updated:** 2025-01-27` (hardcoded)  
**RIGHT:** Check device date first, then use: `**Last Updated:** 2025-11-15` (current date)  
**CHECK:** `.cursor/rules/core.md` - Date & Time Handling  
**VERIFY:** Date must match current system/device date exactly

---

## 🛡️ ENFORCEMENT MECHANISMS

### 1. Pre-Implementation Gate
- **MUST** complete search phase before coding
- **MUST** show search results to user
- **MUST** explain pattern choice

### 2. Mid-Implementation Checks
- **MUST** verify file path before creating file
- **MUST** verify imports before writing code
- **MUST** check security before database operations

### 3. Post-Implementation Audit (MANDATORY) ⭐ **CRITICAL**
- **MUST** audit ALL files touched for code compliance
- **MUST** verify file paths, imports, security, dates, patterns
- **MUST** check for rule violations in each file
- **MUST** fix violations before proceeding
- **MUST** verify TypeScript types, tenant isolation, documentation dates
- **STOP** if any violation found - cannot proceed until fixed

### 4. Documentation Enforcement
- **MUST** update "Last Updated" timestamp
- **MUST** use current date/time (not hardcoded)
- **MUST** update relevant documentation

---

## 📝 RULE VIOLATION REPORTING

**If you detect a rule violation during file audit:**

1. **STOP** implementation immediately
2. **IDENTIFY** which file and which rule was violated
3. **EXPLAIN** the violation clearly
4. **REFERENCE** the correct rule file
5. **CORRECT** the violation in the affected file
6. **RE-AUDIT** the file after correction
7. **VERIFY** all violations fixed before proceeding

**File Audit Violation Example:**
```
❌ VIOLATION DETECTED in file audit:
   File: docs/planning/VEROAI_DEVELOPMENT_PLAN.md
   Violation: Hardcoded date "2025-01-27" instead of current date
   Rule: .cursor/rules/core.md - Date & Time Handling
   
   STOPPING - Fixing date violation...
   ✅ FIXED: Updated to current date 2025-11-15
   ✅ RE-AUDITED: File now compliant
```

**Example:**
```
❌ VIOLATION DETECTED: Using old file path
   File: backend/src/jobs/jobs.service.ts
   Rule: .cursor/rules/monorepo.md - File Structure Rules
   Correct Path: apps/api/src/jobs/jobs.service.ts
   
   STOPPING - Please confirm correct path before proceeding.
```

---

## 🎓 TRAINING REMINDERS

### Before Every Session:
1. Read `.cursor/rules/core.md` - Core philosophy
2. Read `.cursor/rules/monorepo.md` - Current structure
3. Read relevant domain rules (frontend/backend/veroai)

### During Implementation:
1. Reference rules frequently
2. Verify compliance at each step
3. Ask for clarification if unsure

### After Implementation:
1. Run compliance check
2. Verify all rules followed
3. Update documentation

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

## Related Rule Files

This enforcement pipeline integrates with the following rule files:

- `.cursor/rules/state-integrity.md` - State machine integrity and transitions
- `.cursor/rules/contracts.md` - Data contract consistency
- `.cursor/rules/dependencies.md` - Dependency governance and safety
- `.cursor/rules/database-integrity.md` - Transaction safety and data integrity
- `.cursor/rules/layer-sync.md` - Layer synchronization
- `.cursor/rules/architecture-scope.md` - Architectural decision autonomy limits
- `.cursor/rules/performance.md` - Performance budgets and efficiency
- `.cursor/rules/eventing.md` - Event consistency
- `.cursor/rules/cross-platform.md` - Cross-platform resilience
- `.cursor/rules/accessibility.md` - Accessibility enforcement
- `.cursor/rules/tooling.md` - Tooling consistency
- `.cursor/rules/refactoring.md` - Refactor integrity
- `.cursor/rules/ux-consistency.md` - UX coherence
- `.cursor/rules/ownership.md` - File ownership
- `.cursor/rules/tech-debt.md` - Tech debt logging
- `.cursor/rules/naming-consistency.md` - Project naming consistency

---

## 📚 Related Rule Files

This enforcement pipeline integrates with the following rule files:

- `.cursor/rules/observability.md` - Structured logging, traceability, security event logging
- `.cursor/rules/error-resilience.md` - Error handling, silent failure elimination, risk mapping
- `.cursor/rules/pattern-learning.md` - Error pattern memory, engineering decisions, pattern consistency
- `.cursor/rules/predictive-prevention.md` - Predictive guardrails, failure mode mapping, drift detection

**MANDATORY:** Review these rule files for detailed requirements in each category.

