# Rule Clarity Audit Report

**Date:** 2025-12-05  
**Purpose:** Identify all similar patterns where rules are not clear or lack enforcement  
**Status:** ⚠️ **MULTIPLE ISSUES FOUND**

---

## Executive Summary

After auditing all rule files and documentation, **6 patterns** were found with similar clarity issues:

0. **Bug Logging** - ✅ **FIXED** (See Issue 0 below)
1. **Engineering Decisions Documentation** - When is it mandatory?
2. **Tech Debt Logging** - When is "if applicable" actually applicable?
3. **Layer Synchronization** - Missing Step 5 enforcement
4. **State Machine Documentation** - When must they be created/updated?
5. **Contract Documentation** - When must contracts be updated?

---

## Issue 0: Bug Logging (✅ FIXED)

### Current State

**Status:** ✅ **RESOLVED** - Rules updated on 2025-12-05

**Original Problem:**
- Rules mentioned `BUG_LOG.md` but didn't clearly state when bugs must be logged
- Only mentioned low-score PRs (REWARD_SCORE ≤ 0)
- No enforcement in Step 5 (Post-Implementation Audit)
- Bugs were documented in `error-patterns.md` but not logged in `BUG_LOG.md`

**Impact:**
- 8 bugs documented in `error-patterns.md` but not logged in `BUG_LOG.md`
- 3 bugs from compliance reports not logged
- 3 anti-patterns not logged

**Fix Applied:**
- Added explicit "BUG FIX DOCUMENTATION REQUIREMENTS" section to `.cursor/rules/00-master.mdc`
- Added mandatory checks to Step 5 in `.cursor/rules/01-enforcement.mdc`
- Clarified file purposes and relationships
- Updated `docs/error-pattern-guide.md` with dual-requirement

**New Requirements:**
- ALL bug fixes require BOTH `error-patterns.md` (detailed) AND `BUG_LOG.md` (concise)
- Step 5 now verifies both entries exist
- Missing entries = compliance violation (HARD STOP)

**Related Documentation:**
- `docs/compliance-reports/BUG_LOGGING_RULE_INVESTIGATION.md` - Investigation report
- `docs/compliance-reports/RULE_UPDATES_BUG_LOGGING.md` - Rule updates summary
- `docs/compliance-reports/BUG_AND_ANTI_PATTERN_CONSOLIDATION_REPORT.md` - Consolidation report

**Lessons Learned:**
- Rules must explicitly state mandatory requirements
- Enforcement checks must be in Step 5
- File purposes and relationships must be clearly defined
- Ambiguous conditionals ("if applicable") cause compliance gaps

---

## Issue 1: Engineering Decisions Documentation

### Current State

**Rules Mention:**
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST search `docs/engineering-decisions.md` for relevant decisions"
- `.cursor/rules/agent-instructions.mdc` Step 1: Same requirement

**What's Missing:**
- ❌ No clear rule stating WHEN decisions MUST be documented
- ❌ No enforcement in Step 5 (Post-Implementation Audit)
- ❌ Ambiguous about what constitutes a "significant" decision

**Documentation Says:**
- `docs/engineering-decisions.md`: "Every significant architectural or design decision should be documented here"
- But "significant" is not defined

**Compliance Reports Show:**
- Multiple compliance reports flag missing engineering decision documentation
- Examples: Migration decisions, architectural changes, pattern decisions

### Recommended Fix

**Add to `.cursor/rules/00-master.mdc`:**

```markdown
## ENGINEERING DECISIONS DOCUMENTATION REQUIREMENTS

**MANDATORY:** When making a significant decision, you MUST document it in `docs/engineering-decisions.md`.

### When Documentation is Required

1. **Architectural Changes:**
   - New microservices or service boundaries
   - Database schema changes affecting multiple modules
   - Major refactoring (>50 files)
   - Technology stack changes

2. **Design Pattern Decisions:**
   - Choosing between multiple implementation approaches
   - Establishing new patterns for the codebase
   - Breaking existing patterns

3. **Trade-off Decisions:**
   - Performance vs maintainability
   - Security vs usability
   - Speed vs correctness

4. **Migration Decisions:**
   - Code structure migrations
   - Technology migrations
   - Process migrations

### Entry Requirements
- Use the template from `docs/engineering-decisions.md`
- Include: Decision, Context, Trade-offs, Alternatives, Rationale, Impact, Lessons Learned
- Cross-reference related decisions

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify decision is documented (if applicable)
- Missing documentation = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify engineering decision documented in `docs/engineering-decisions.md` (if significant decision made) ⭐ **NEW**
```

---

## Issue 2: Tech Debt Logging

### Current State

**Rules Mention:**
- `.cursor/rules/12-tech-debt.mdc`: "All meaningful debt must be logged in `docs/tech-debt.md`"
- `.cursor/rules/01-enforcement.mdc` Step 3: "MUST verify tech debt logged (if applicable)"
- `.cursor/rules/10-quality.mdc`: "If you knowingly introduce or touch tech debt: Log/update it in `docs/tech-debt.md`"

**What's Missing:**
- ❌ "If applicable" is ambiguous - when is it applicable?
- ❌ "Meaningful debt" is not defined
- ❌ No clear enforcement in Step 5

**Documentation Says:**
- `docs/tech-debt.md` exists but doesn't define when logging is mandatory

### Recommended Fix

**Update `.cursor/rules/12-tech-debt.mdc`:**

```markdown
## TECH DEBT LOGGING

**MANDATORY:** When introducing or touching tech debt, you MUST log it in `docs/tech-debt.md`.

### When Logging is Required

1. **Introducing New Debt:**
   - Knowingly using a workaround instead of proper solution
   - Deferring a fix due to time constraints
   - Using deprecated patterns/APIs
   - Skipping tests due to complexity

2. **Touching Existing Debt:**
   - Modifying code with known tech debt
   - Extending debt-affected areas
   - Working around existing debt

3. **Discovering Debt:**
   - Finding undocumented debt during implementation
   - Identifying debt while refactoring

### "Meaningful Debt" Definition
Debt is "meaningful" if it:
- Affects maintainability or performance
- Has a known remediation plan
- Will require future work to fix
- Impacts multiple developers or modules

### Entry Requirements
- Category (code quality, performance, security, docs, testing, architecture, dependencies)
- Location (file path)
- Impact
- Remediation plan
- Estimated effort
- Status (open/resolved)
- Date (current system date, not hardcoded)

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify debt is logged (if applicable)
- Missing log entry = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify tech debt logged in `docs/tech-debt.md` (if debt introduced or touched) ⭐ **NEW**
```

---

## Issue 3: Layer Synchronization Enforcement

### Current State

**Rules Mention:**
- `.cursor/rules/05-data.mdc`: "LAYER SYNCHRONIZATION RULE" - lists what must be updated
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST check layer synchronization needs"
- `.cursor/rules/01-enforcement.mdc` Step 2: "MUST verify layer synchronization patterns"

**What's Missing:**
- ❌ No explicit check in Step 5 to verify synchronization was completed
- ❌ Rules say "you must" but don't enforce verification

**Documentation Says:**
- `05-data.mdc` lists requirements but doesn't state enforcement

### Recommended Fix

**Update `.cursor/rules/05-data.mdc` ENFORCEMENT PIPELINE INTEGRATION:**

```markdown
## ENFORCEMENT PIPELINE INTEGRATION

**Step 1: Search**
- Search for existing DTOs, types, state machines.
- Search `docs/contracts/` and `docs/state-machines/`.

**Step 3: Compliance Check**
- Confirm DB ⇄ DTO ⇄ types ⇄ events are synced.
- Confirm state transitions are documented and legal.

**Step 5: Post-Implementation Audit** ⭐ **UPDATED**
- **MUST** verify all layer changes are synchronized:
  - If schema changed → verify DTOs, types, validators, tests, contracts updated
  - If DTOs changed → verify frontend types, tests, contracts updated
  - If frontend types changed → verify they match backend DTOs
  - If state machine changed → verify code enforces transitions
- **MUST** verify contracts updated (if applicable)
- **MUST** verify state machine docs updated (if applicable)
- Missing synchronization = compliance violation (HARD STOP)
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify layer synchronization complete (if schema/DTOs/types changed) ⭐ **NEW**
- [ ] **MUST** verify contracts updated (if applicable) ⭐ **NEW**
- [ ] **MUST** verify state machine docs updated (if applicable) ⭐ **NEW**
```

---

## Issue 4: State Machine Documentation

### Current State

**Rules Mention:**
- `.cursor/rules/05-data.mdc`: "For stateful entities (e.g., WorkOrder, Invoice, Payment): Must have a state machine doc"
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST search for state machine documentation (if stateful component)"
- `.cursor/rules/01-enforcement.mdc` Step 2: "MUST verify state machine pattern matches existing implementations (if stateful)"

**What's Missing:**
- ❌ "If stateful" is ambiguous - what makes something stateful?
- ❌ No clear rule stating when state machine docs MUST be created
- ❌ No enforcement in Step 5 to verify docs exist/updated

**Documentation Says:**
- `05-data.mdc` mentions state machines but doesn't define when creation is mandatory

### Recommended Fix

**Update `.cursor/rules/05-data.mdc` STATE MACHINES section:**

```markdown
## STATE MACHINES

**MANDATORY:** For stateful entities, you MUST create and maintain state machine documentation.

### When State Machine Documentation is Required

1. **New Stateful Entity:**
   - Entity with status/state field that changes over time
   - Entity with workflow states (e.g., draft → review → approved)
   - Entity with lifecycle states (e.g., created → active → archived)

2. **Modifying State Transitions:**
   - Adding new states
   - Changing legal transitions
   - Modifying transition logic

3. **Examples of Stateful Entities:**
   - WorkOrder (draft, scheduled, in-progress, completed, cancelled)
   - Invoice (draft, sent, paid, overdue, voided)
   - Payment (pending, processing, completed, failed, refunded)
   - User (invited, active, suspended, deleted)

### Documentation Requirements
- File: `docs/state-machines/<entity>-state-machine.md`
- Include:
  - All valid states
  - Legal transitions
  - Illegal transitions & error behavior
  - Side effects & audit events
  - Code examples

**Code MUST:**
- Enforce legal transitions in the service layer
- Emit audit logs on transitions
- Reject illegal transitions with explicit errors

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify state machine doc exists/updated (if stateful entity)
- Missing documentation = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify state machine documentation exists/updated (if stateful entity created/modified) ⭐ **NEW**
```

---

## Issue 5: Contract Documentation

### Current State

**Rules Mention:**
- `.cursor/rules/05-data.mdc`: "Events: `docs/contracts/events/*.md`"
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST search for contract definitions (if schema changes)"
- `.cursor/rules/01-enforcement.mdc` Step 2: "MUST verify contract patterns match existing implementations (if schema changes)"

**What's Missing:**
- ❌ "If schema changes" is too narrow - contracts needed for more than schema changes
- ❌ No clear rule stating when contracts MUST be created/updated
- ❌ No enforcement in Step 5 to verify contracts updated

**Documentation Says:**
- `05-data.mdc` mentions contracts but doesn't define when creation is mandatory

### Recommended Fix

**Update `.cursor/rules/05-data.mdc`:**

```markdown
## CONTRACT DOCUMENTATION

**MANDATORY:** When creating or modifying APIs, events, or data structures, you MUST document contracts.

### When Contract Documentation is Required

1. **API Contracts:**
   - New API endpoints
   - Modified request/response structures
   - Breaking changes to existing APIs

2. **Event Contracts:**
   - New events published/consumed
   - Modified event schemas
   - Event versioning changes

3. **Data Contracts:**
   - Schema changes affecting external interfaces
   - DTO changes affecting API consumers
   - Type changes affecting frontend/backend contracts

### Documentation Requirements
- API contracts: `docs/contracts/api/*.md` or OpenAPI/Swagger
- Event contracts: `docs/contracts/events/*.md`
- Include:
  - Request/response schemas
  - Field descriptions and types
  - Validation rules
  - Version information
  - Breaking changes

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify contracts documented/updated (if applicable)
- Missing documentation = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify contract documentation exists/updated (if APIs/events/data structures created/modified) ⭐ **NEW**
```

---

## Summary of Issues

| Issue | Severity | Status | Current State | Missing Enforcement |
|-------|----------|--------|---------------|---------------------|
| Bug Logging | High | ✅ FIXED | Rules updated, enforcement added | N/A - Resolved |
| Engineering Decisions | High | ⚠️ OPEN | Mentioned but not mandatory | Step 5 check missing |
| Tech Debt Logging | Medium | ⚠️ OPEN | "If applicable" ambiguous | Step 5 check missing |
| Layer Synchronization | High | ⚠️ OPEN | Rules exist but no verification | Step 5 check missing |
| State Machine Docs | Medium | ⚠️ OPEN | "If stateful" ambiguous | Step 5 check missing |
| Contract Documentation | Medium | ⚠️ OPEN | "If schema changes" too narrow | Step 5 check missing |

---

## Recommended Actions

### Immediate (High Priority)

1. **Add Engineering Decisions Rule:**
   - Define when documentation is mandatory
   - Add Step 5 enforcement check

2. **Clarify Tech Debt Logging:**
   - Define "if applicable" and "meaningful debt"
   - Add Step 5 enforcement check

3. **Add Layer Synchronization Enforcement:**
   - Add explicit Step 5 verification
   - Make it a HARD STOP violation

### Medium Priority

4. **Clarify State Machine Requirements:**
   - Define "stateful entity"
   - Add Step 5 enforcement check

5. **Expand Contract Documentation:**
   - Broaden beyond "schema changes"
   - Add Step 5 enforcement check

---

## Pattern Analysis

### Common Issues Found

1. **Ambiguous Conditionals:**
   - "If applicable" - when is it applicable?
   - "If stateful" - what makes something stateful?
   - "If schema changes" - too narrow scope

2. **Missing Enforcement:**
   - Rules state requirements but don't verify in Step 5
   - No HARD STOP for violations

3. **Unclear Mandatory Status:**
   - Rules say "should" or "must" but don't enforce
   - No distinction between recommended and mandatory

4. **Incomplete Definitions:**
   - Terms like "significant decision" and "meaningful debt" not defined
   - Scope of requirements unclear

---

## Related Documentation

- `docs/compliance-reports/BUG_LOGGING_RULE_INVESTIGATION.md` - Original bug logging investigation
- `docs/compliance-reports/RULE_UPDATES_BUG_LOGGING.md` - Bug logging rule updates
- `.cursor/rules/00-master.mdc` - Master rule file
- `.cursor/rules/01-enforcement.mdc` - Enforcement pipeline
- `.cursor/rules/05-data.mdc` - Data contracts and state machines
- `.cursor/rules/12-tech-debt.mdc` - Tech debt rules

---

**Report Generated:** 2025-12-05  
**Next Steps:** Review recommendations and update rules as approved  
**Status:** ⚠️ **AWAITING APPROVAL FOR RULE UPDATES**

