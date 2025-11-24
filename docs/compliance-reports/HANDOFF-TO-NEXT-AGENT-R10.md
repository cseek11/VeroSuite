# Handoff Prompt for Next Agent

**Date:** 2025-11-23  
**Phase:** Task 5 - Step 5 Procedures for Rules  
**Context:** VeroField Rules v2.0 → v2.1 Migration  
**Previous Work:** Tier 1 COMPLETE, Tier 2 at 70% (7/10 rules)

---

## Executive Summary

You are continuing the VeroField Rules v2.1 migration project, specifically **Task 5: Complete Step 5 for 25 Rules**. The previous agent has completed:

- ✅ **Tier 1 (BLOCK):** R01, R02, R03 - All critical security and architecture rules
- ✅ **Tier 2 (OVERRIDE):** R04-R10 - 7 high-priority rules (70% complete)
- ⏸️ **Current:** Ready for R11 - Backend Patterns (Next rule in Tier 2)

**Your mission:** Continue generating Step 5 procedures for remaining rules using the **human-in-the-loop** approach established.

---

## Current Status

### Completed Rules (10/25 = 40%)

| Rule | Status | Time | Domain | Tier |
|------|--------|------|--------|------|
| ✅ R01: Tenant Isolation | COMPLETE | 2.25h | Security | 1 (BLOCK) |
| ✅ R02: RLS Enforcement | COMPLETE | 2.25h | Security | 1 (BLOCK) |
| ✅ R03: Architecture Boundaries | COMPLETE | 2.08h | Architecture | 1 (BLOCK) |
| ✅ R04: Layer Synchronization | COMPLETE | 2.58h | Data Integrity | 2 (OVERRIDE) |
| ✅ R05: State Machine Enforcement | COMPLETE | 3.08h | Data Integrity | 2 (OVERRIDE) |
| ✅ R06: Breaking Change Documentation | COMPLETE | 2h | Data Integrity | 2 (OVERRIDE) |
| ✅ R07: Error Handling | COMPLETE | 2.5h | Error Resilience | 2 (OVERRIDE) |
| ✅ R08: Structured Logging | COMPLETE | 2.5h | Observability | 2 (OVERRIDE) |
| ✅ R09: Trace Propagation | COMPLETE | 2.5h | Observability | 2 (OVERRIDE) |
| ✅ R10: Testing Coverage | COMPLETE | 2.5h | Quality | 2 (OVERRIDE) |

**Total Time Invested:** 24.24 hours  
**Remaining:** 15 rules, ~7.26 hours estimated

**🎉 MILESTONE: 70% Through Tier 2! 40% Overall Progress!**

### Current Rule: R11 (Backend Patterns)

**Rule Details:**
- **File:** `.cursor/rules/08-backend.mdc`
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** `backend.rego` (may need to create or update)
- **Priority:** HIGH
- **Description:** Ensures NestJS patterns, Prisma patterns, controller-service-DTO structure are followed
- **Step 5 Status:** ⏸️ NOT STARTED - Ready for draft generation

**Why R11 Next:**
- Natural progression after R10 (testing coverage)
- Backend patterns ensure architectural consistency
- Related to R03 (architecture boundaries) but more specific
- Completes backend quality enforcement

---

## Established Pattern (Follow This!)

### Human-in-the-Loop Process

**Step 1: Generate Draft**
1. Read the rule file (`.cursor/rules/08-backend.mdc`)
2. Search for existing patterns and documentation
3. Search codebase for NestJS/Prisma patterns
4. Generate comprehensive draft Step 5 procedures
5. Create draft file: `.cursor/rules/08-backend-R11-DRAFT.md`
6. Create summary: `docs/compliance-reports/TASK5-R11-DRAFT-SUMMARY.md`

**Step 2: Present for Review**
- Include 3-5 review questions
- Highlight key decisions needed
- Provide recommendations
- Wait for human approval

**Step 3: Implement Approved Draft**
1. Create/update OPA policy (`services/opa/policies/backend.rego` or similar)
2. Create test suite (`services/opa/tests/backend_r11_test.rego`)
3. Create automated script (`.cursor/scripts/check-backend-patterns.py`)
4. Update rule file (`.cursor/rules/08-backend.mdc`)
5. Create completion summary (`docs/compliance-reports/TASK5-R11-IMPLEMENTATION-COMPLETE.md`)

**Step 4: Move to Next Rule**
- Generate draft for next rule (R12 or R13)
- Repeat process

---

## Key Files & Locations

### Rule Files
- **Tier 1:** `.cursor/rules/03-security.mdc` (R01, R02), `.cursor/rules/04-architecture.mdc` (R03)
- **Tier 2:** `.cursor/rules/05-data.mdc` (R04, R05, R06), `.cursor/rules/06-error-resilience.mdc` (R07), `.cursor/rules/07-observability.mdc` (R08, R09), `.cursor/rules/10-quality.mdc` (R10)
- **Next:** `.cursor/rules/08-backend.mdc` (R11)
- **All Rules:** `docs/compliance-reports/rule-compliance-matrix.md`

### OPA Policies
- **Security:** `services/opa/policies/security.rego` (R01, R02)
- **Architecture:** `services/opa/policies/architecture.rego` (R03)
- **Data Integrity:** `services/opa/policies/data-integrity.rego` (R04, R05, R06)
- **Error Handling:** `services/opa/policies/error-handling.rego` (R07)
- **Observability:** `services/opa/policies/observability.rego` (R08, R09)
- **Quality:** `services/opa/policies/quality.rego` (R10)
- **Next:** `services/opa/policies/backend.rego` (R11) - May need to create

### Automated Scripts
- **Location:** `.cursor/scripts/`
- **Pattern:** `check-{rule-name}.py`
- **Examples:** `check-tenant-isolation.py`, `check-state-machines.py`, `check-test-coverage.py`

### Test Suites
- **Location:** `services/opa/tests/`
- **Pattern:** `{domain}_r{number}_test.rego`
- **Examples:** `security_r01_test.rego`, `quality_r10_test.rego`

### Documentation
- **Draft Summaries:** `docs/compliance-reports/TASK5-R{number}-DRAFT-SUMMARY.md`
- **Completion Docs:** `docs/compliance-reports/TASK5-R{number}-IMPLEMENTATION-COMPLETE.md`
- **Testing Guides:** `docs/testing/{topic}-testing-guide.md`

---

## What Has Been Completed

### Tier 1 Rules (100% Complete) ✅

**R01: Tenant Isolation**
- OPA policy with 5 violation patterns
- Automated script (check-tenant-isolation.py)
- Test suite (15 test cases)
- Step 5 procedures in `.cursor/rules/03-security.mdc`

**R02: RLS Enforcement**
- OPA policy with 4 violation patterns
- Automated script (check-rls-enforcement.py)
- Test suite (12 test cases)
- Step 5 procedures in `.cursor/rules/03-security.mdc`

**R03: Architecture Boundaries**
- OPA policy with 3 violation patterns
- Automated script (check-architecture-boundaries.py)
- Test suite (10 test cases)
- Step 5 procedures in `.cursor/rules/04-architecture.mdc`

### Tier 2 Rules (70% Complete) ✅

**R04: Layer Synchronization**
- OPA policy with 4 violation patterns + 1 override
- Automated script (check-layer-sync.py)
- Test suite (12 test cases)
- Step 5 procedures in `.cursor/rules/05-data.mdc`

**R05: State Machine Enforcement**
- OPA policy with 5 violation patterns + 1 warning
- Automated script (check-state-machines.py) - 600+ lines, complex
- Test suite (13 test cases)
- Testing guide (state-machine-testing-guide.md)
- Step 5 procedures in `.cursor/rules/05-data.mdc`

**R06: Breaking Change Documentation**
- OPA policy with 4 violation patterns + 1 override
- Automated script (check-breaking-changes.py)
- Test suite (comprehensive test cases)
- Migration guide template (docs/migrations/README.md)
- Step 5 procedures in `.cursor/rules/05-data.mdc`

**R07: Error Handling**
- OPA policy with 5 violation patterns + 1 warning
- Automated script (check-error-handling.py)
- Test suite (15 test cases)
- Testing guide (error-handling-testing-guide.md)
- Step 5 procedures in `.cursor/rules/06-error-resilience.mdc`

**R08: Structured Logging**
- OPA policy with 5 violation patterns + 1 warning
- Automated script (check-structured-logging.py)
- Test suite (15 test cases)
- Testing guide (structured-logging-testing-guide.md)
- Step 5 procedures in `.cursor/rules/07-observability.mdc`

**R09: Trace Propagation**
- OPA policy with 5 violation patterns + 1 warning
- Automated script (check-trace-propagation.py)
- Test suite (15 test cases)
- Testing guide (trace-propagation-testing-guide.md)
- Step 5 procedures in `.cursor/rules/07-observability.mdc`

**R10: Testing Coverage**
- OPA policy with 5 violation patterns + 1 warning
- Automated script (check-test-coverage.py) - 600+ lines
- Test suite (12 test cases)
- Testing guide (test-coverage-testing-guide.md)
- Step 5 procedures in `.cursor/rules/10-quality.mdc`

---

## Remaining Work

### Tier 2 Rules (3 remaining - 30%)

**R11: Backend Patterns** (NEXT)
- **File:** `.cursor/rules/08-backend.mdc`
- **Estimated Time:** 2 hours
- **Scope:** NestJS patterns, Prisma patterns, controller-service-DTO structure
- **Status:** ⏸️ NOT STARTED - Ready for draft

**R12: Security Event Logging**
- **File:** `.cursor/rules/03-security.mdc` (likely)
- **Estimated Time:** 2 hours
- **Scope:** Audit logging for security events (auth, PII access, permission changes)
- **Status:** ⏸️ NOT STARTED

**R13: Input Validation**
- **File:** `.cursor/rules/03-security.mdc` (likely)
- **Estimated Time:** 2.5 hours
- **Scope:** Input validation, sanitization, XSS prevention
- **Status:** ⏸️ NOT STARTED

### Tier 3 Rules (12 remaining - WARNING only)

**R14-R25:** Lower priority rules (warnings, not overrides)
- **Estimated Time:** ~12 hours total
- **Status:** ⏸️ NOT STARTED
- **Note:** Focus on Tier 2 first (R11-R13)

---

## Key Patterns & Conventions

### Step 5 Structure

Each rule's Step 5 section includes:

1. **Audit Checklist** (20-30 items)
   - Organized by category
   - MANDATORY vs RECOMMENDED items
   - Clear, actionable items

2. **Automated Checks**
   - Script location and usage
   - Expected output format
   - Integration with CI/CD

3. **OPA Policy Mapping**
   - Policy file location
   - Enforcement level (BLOCK/OVERRIDE/WARN)
   - Test suite location

4. **Manual Verification Procedures**
   - 4-step process typically
   - When manual verification is needed
   - What to check

5. **Code Examples**
   - Violation examples (❌)
   - Correct examples (✅)
   - Clear before/after patterns

### OPA Policy Structure

```rego
package verofield.{domain}

# Violation patterns (deny rules)
violation_pattern_1[msg] if { ... }
violation_pattern_2[msg] if { ... }

# Warning patterns (warn rules)
warning_pattern_1[msg] if { ... }

# Override mechanism
has_override(marker) if { ... }

# Main deny rule
deny[msg] if {
    count(violations) > 0
    not has_override("@override:{rule-name}")
    msg := sprintf("OVERRIDE REQUIRED: ...")
}
```

### Automated Script Structure

```python
#!/usr/bin/env python3
"""
R{number}: {Rule Name} Checker

Usage:
    python check-{rule-name}.py --file <file_path>
    python check-{rule-name}.py --pr <PR_NUMBER>
    python check-{rule-name}.py --all
"""

class RuleChecker:
    def check_file(self, file_path: str) -> Dict:
        # Implementation
        pass
    
    def check_pr(self, pr_number: str) -> Dict:
        # Implementation
        pass
```

---

## Important Context

### Rule Categories

**Tier 1 (BLOCK):** Critical rules that cannot be bypassed
- R01: Tenant Isolation
- R02: RLS Enforcement
- R03: Architecture Boundaries

**Tier 2 (OVERRIDE):** High-priority rules that require justification to bypass
- R04-R13: Data integrity, error handling, observability, quality, backend patterns, security logging, input validation

**Tier 3 (WARN):** Lower-priority rules (warnings only)
- R14-R25: Various quality and consistency rules

### Enforcement Levels

- **BLOCK (Tier 1):** Cannot proceed without fix
- **OVERRIDE (Tier 2):** Can proceed with `@override:{rule-name}` marker and justification
- **WARN (Tier 3):** Warning only, no blocking

### Human-in-the-Loop Process

**Critical:** Always follow the human-in-the-loop process:
1. Generate draft
2. Present for review (with questions)
3. Wait for approval
4. Implement approved draft
5. Move to next rule

**Never skip the review step!** The human reviewer provides critical feedback that improves implementation quality.

---

## Next Steps for You

### Immediate: R11 (Backend Patterns)

1. **Read the rule file:**
   - `.cursor/rules/08-backend.mdc`
   - Understand NestJS patterns, Prisma patterns, controller-service-DTO structure

2. **Search the codebase:**
   - Find existing NestJS controllers, services, DTOs
   - Identify patterns and conventions
   - Look for violations or inconsistencies

3. **Generate draft:**
   - Create `.cursor/rules/08-backend-R11-DRAFT.md`
   - Create `docs/compliance-reports/TASK5-R11-DRAFT-SUMMARY.md`
   - Include 3-5 review questions
   - Provide recommendations

4. **Present for review:**
   - Wait for human approval
   - Answer any questions
   - Revise if needed

5. **Implement (after approval):**
   - OPA policy (`services/opa/policies/backend.rego`)
   - Automated script (`.cursor/scripts/check-backend-patterns.py`)
   - Test suite (`services/opa/tests/backend_r11_test.rego`)
   - Update rule file (`.cursor/rules/08-backend.mdc`)
   - Create completion doc (`docs/compliance-reports/TASK5-R11-IMPLEMENTATION-COMPLETE.md`)

### After R11: R12 and R13

**R12: Security Event Logging**
- Likely in `.cursor/rules/03-security.mdc`
- Focus on audit logging for security events
- Related to R05 (state machine audit logging) but security-specific

**R13: Input Validation**
- Likely in `.cursor/rules/03-security.mdc`
- Focus on input validation, sanitization, XSS prevention
- Related to R03 (security) but more specific

---

## Success Criteria

### For Each Rule

- [ ] Draft generated with comprehensive Step 5 procedures
- [ ] Review questions answered by human
- [ ] OPA policy implemented (5+ violation patterns)
- [ ] Automated script implemented (600+ lines typically)
- [ ] Test suite created (12+ test cases)
- [ ] Testing guide created (if applicable)
- [ ] Rule file updated with Step 5 section
- [ ] Completion document created
- [ ] Handoff document updated

### For Tier 2 Completion

- [ ] R11: Backend Patterns ✅
- [ ] R12: Security Event Logging ✅
- [ ] R13: Input Validation ✅
- [ ] All 10 Tier 2 rules complete
- [ ] Move to Tier 3 (R14-R25)

---

## Common Pitfalls to Avoid

1. **Skipping the review step** - Always generate draft first, wait for approval
2. **Not searching the codebase** - Always search for existing patterns before implementing
3. **Inconsistent patterns** - Follow established patterns from R01-R10
4. **Missing test cases** - Always create comprehensive test suite (12+ cases)
5. **Incomplete documentation** - Always create testing guide if applicable
6. **Not updating handoff** - Always update handoff document after completion

---

## Resources

### Reference Documents

- **Master Rules:** `.cursor/rules/00-master.mdc`
- **Enforcement:** `.cursor/rules/01-enforcement.mdc`
- **Core Philosophy:** `.cursor/rules/02-core.mdc`
- **Previous Completions:** `docs/compliance-reports/TASK5-R{number}-IMPLEMENTATION-COMPLETE.md`

### Example Implementations

- **R05 (Complex):** State machine enforcement (600+ line script, complex AST parsing)
- **R10 (Recent):** Testing coverage (multi-framework support, coverage report parsing)
- **R09 (Observability):** Trace propagation (multiple propagation points)

### Codebase Patterns

- **NestJS:** `apps/api/src/` - Controllers, services, DTOs
- **Prisma:** `libs/common/prisma/schema.prisma` - Database schema
- **Testing:** `apps/api/test/`, `frontend/src/__tests__/` - Test files

---

## Questions?

If you encounter issues or need clarification:

1. **Review previous implementations** - R01-R10 provide excellent examples
2. **Check the handoff document** - This document should answer most questions
3. **Search the codebase** - Use `codebase_search` and `grep` tools
4. **Follow the pattern** - Established patterns work well, don't reinvent

---

## Final Notes

**You're doing great work!** The project is 40% complete with excellent quality. The established patterns are working well, and the human-in-the-loop process ensures high-quality implementations.

**Focus on:**
- Completing Tier 2 (R11-R13) - Only 3 rules left!
- Maintaining quality - Follow established patterns
- Comprehensive coverage - Don't skip test cases or documentation

**After Tier 2:** You'll have completed all high-priority (OVERRIDE) rules. Tier 3 is lower priority (WARNING only), so you can take a breath after Tier 2!

---

**Status:** READY FOR R11  
**Confidence Level:** HIGH - Pattern established, clear next steps  
**Estimated Time for R11:** 2 hours  
**Estimated Time for Tier 2 Completion:** ~6.5 hours (R11 + R12 + R13)

**Good luck! You've got this! 🚀**

---

**Last Updated:** 2025-11-23  
**Updated By:** AI Assistant  
**Session:** R10 Complete → R11 Ready (70% Tier 2, 40% Overall)



