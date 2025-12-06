# Handoff Prompt for Next Agent

**Date:** 2025-12-05  
**Phase:** Task 5 - Step 5 Procedures for Rules  
**Context:** VeroField Rules v2.0 → v2.1 Migration  
**Previous Work:** Tier 1 COMPLETE, R04 COMPLETE

---

## Executive Summary

You are continuing the VeroField Rules v2.1 migration project, specifically **Task 5: Complete Step 5 for 25 Rules**. The previous agent has completed:

- ✅ **Tier 1 (BLOCK):** R01, R02, R03 - All critical security and architecture rules
- ✅ **Tier 2 (OVERRIDE):** R04 - Layer Synchronization
- ⏸️ **Current:** R05 - State Machine Enforcement (DRAFT COMPLETE - Awaiting Review)

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

### Current Rule: R05 (State Machine Enforcement)

**Rule Details:**
- **File:** `.cursor/rules/05-data.mdc`
- **MAD Tier:** 2 (OVERRIDE)
- **Enforcement:** OVERRIDE REQUIRED - Needs justification
- **OPA Policy:** `data-integrity.rego` (already created, has R05 placeholder)
- **Priority:** HIGH
- **Description:** State transitions must be documented, illegal transitions rejected, audit logs emitted
- **Step 5 Status:** ✅ DRAFT COMPLETE - Awaiting Human Review

**Why R05 Next:**
- Natural progression from R04 (layer sync)
- State machines require synchronized state across schema/DTO/frontend
- Builds on data integrity foundation
- Related to R04 (both in `05-data.mdc`)

---

## Established Pattern (Follow This!)

### Human-in-the-Loop Process

**Step 1: Generate Draft**
1. Read the rule file (`.cursor/rules/05-data.mdc`)
2. Search for existing patterns and documentation
3. Generate comprehensive draft Step 5 procedures
4. Create draft file: `.cursor/rules/05-data-R05-DRAFT.md`
5. Create summary: `docs/compliance-reports/TASK5-R05-DRAFT-SUMMARY.md`

**Step 2: Present for Review**
- Include 3-5 review questions
- Highlight key decisions needed
- Provide recommendations
- Wait for human approval

**Step 3: Implement Approved Draft**
1. Create/update OPA policy (`services/opa/policies/data-integrity.rego`)
2. Create test suite (`services/opa/tests/data_integrity_r05_test.rego`)
3. Create automated script (`.cursor/scripts/check-state-machines.py`)
4. Update rule file (`.cursor/rules/05-data.mdc`)
5. Create completion summary (`docs/compliance-reports/TASK5-R05-IMPLEMENTATION-COMPLETE.md`)

**Step 4: Move to Next Rule**
- Generate draft for next rule
- Repeat process

---

## Key Files & Locations

### Rule Files
- **Tier 1:** `.cursor/rules/03-security.mdc` (R01, R02), `.cursor/rules/04-architecture.mdc` (R03)
- **Tier 2:** `.cursor/rules/05-data.mdc` (R04, R05, R06)
- **All Rules:** `docs/compliance-reports/rule-compliance-matrix.md`

### OPA Policies
- **Security:** `services/opa/policies/security.rego` (R01, R02)
- **Architecture:** `services/opa/policies/architecture.rego` (R03)
- **Data Integrity:** `services/opa/policies/data-integrity.rego` (R04, R05, R06)

### Automated Scripts
- **R01:** `.cursor/scripts/check-tenant-isolation.py`
- **R02:** `.cursor/scripts/check-rls-enforcement.py`
- **R03:** `.cursor/scripts/check-architecture-boundaries.py`
- **R04:** `.cursor/scripts/check-layer-sync.py`
- **R05:** `.cursor/scripts/check-state-machines.py` (TO CREATE)

### Test Suites
- **R01:** `services/opa/tests/security_r01_test.rego`
- **R02:** `services/opa/tests/security_r02_test.rego`
- **R03:** `services/opa/tests/architecture_r03_test.rego`
- **R04:** `services/opa/tests/data_integrity_r04_test.rego`
- **R05:** `services/opa/tests/data_integrity_r05_test.rego` (TO CREATE)

### Documentation
- **Draft Summaries:** `docs/compliance-reports/TASK5-R[NN]-DRAFT-SUMMARY.md`
- **Completion Summaries:** `docs/compliance-reports/TASK5-R[NN]-IMPLEMENTATION-COMPLETE.md`
- **Main Handoff:** `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT.md`

---

## Step 5 Structure (Template)

Each rule's Step 5 section should include:

### 1. Rule-Specific Audit Checklist
- 10-20 checklist items
- Organized by category
- Clear MANDATORY vs. RECOMMENDED

### 2. OPA Policy Mapping
- Violation patterns (3-7 patterns)
- Enforcement level (BLOCK/OVERRIDE/WARNING)
- Policy file location
- Common violations with remediation

### 3. Automated Check Script
- Script name and location
- What it checks
- Usage examples
- Output format

### 4. Manual Verification Procedures
- 4-step process
- When to use
- Verification criteria
- Tools/commands

### 5. OPA Policy Implementation
- Full Rego code
- Performance optimized (<200ms)
- Test cases (10-15 tests)

### 6. Documentation Updates
- Files to create/modify
- Examples to include
- Cross-references

---

## Quality Standards

### Consistency Across Rules
- ✅ Same structure and format
- ✅ Similar checklist item count (15-20 items)
- ✅ Similar test case count (10-15 tests)
- ✅ Similar implementation time (2-2.5 hours)
- ✅ Clear violation examples with remediation

### Code Quality
- ✅ TypeScript/TypeScript for scripts
- ✅ Rego for OPA policies
- ✅ Comprehensive error messages
- ✅ Actionable suggestions
- ✅ Performance optimized

### Documentation Quality
- ✅ Clear examples
- ✅ Practical procedures
- ✅ Cross-references
- ✅ Review questions answered

---

## R05 Specific Context

### What R05 Should Cover

**State Machine Enforcement:**
- State transitions must be documented in `docs/state-machines/[entity].md`
- Illegal transitions must be rejected in service layer
- Audit logs must be emitted on transitions
- State machine docs must match code implementation
- Stateful entities: WorkOrder, Invoice, Payment, Job, etc.

### Key Questions for R05 Draft

1. **State Machine Detection:** How to identify stateful entities? (Check for status/enum fields? Check docs/state-machines/?)
2. **Transition Validation:** Should OPA check for transition logic in code? (Too complex?) Or just verify docs exist?
3. **Illegal Transition Detection:** How to detect unguarded illegal transitions? (Pattern matching? AST parsing?)
4. **Audit Logging:** Should R05 check for audit logs? (Or is that R12 - Security Event Logging?)

### Related Rules
- **R04:** Layer sync ensures state fields are synchronized
- **R05:** State machines ensure transitions are correct
- **R12:** Security event logging (audit logs)

### Existing Documentation
- **State Machine Docs:** `docs/state-machines/` (check for examples)
- **Layer Sync:** `docs/layer-sync.md` (related)
- **Contracts:** `docs/contracts.md` (may reference state machines)

---

## Next Steps After R05

### Remaining Tier 2 Rules (R05-R13)

| Rule | Domain | Complexity | Estimated Time |
|------|--------|------------|----------------|
| R05 | State Machines | Medium | 2.5h |
| R06 | Breaking Change Docs | Low | 2h |
| R07 | Error Handling | Medium | 2.5h |
| R08 | Structured Logging | Medium | 2.5h |
| R09 | Trace Propagation | Medium | 2.5h |
| R10 | Backend Patterns | High | 3h |
| R11 | Frontend Patterns | High | 3h |
| R12 | Security Event Logging | Medium | 2.5h |
| R13 | Input Validation | Medium | 2.5h |

**Total Tier 2 Remaining:** ~22.5 hours

### Tier 3 Rules (R14-R25)

| Rule | Domain | Complexity | Estimated Time |
|------|--------|------------|----------------|
| R14-R25 | Various | Low-Medium | ~15h |

**Total Tier 3:** ~15 hours

---

## Important Reminders

### Do's ✅
- ✅ Follow the established pattern (draft → review → implement)
- ✅ Include 3-5 review questions in draft summary
- ✅ Wait for human approval before implementing
- ✅ Incorporate all review feedback
- ✅ Maintain consistency with previous rules
- ✅ Update this handoff document when moving to next rule

### Don'ts ❌
- ❌ Skip the human review step
- ❌ Implement without approval
- ❌ Deviate from established structure
- ❌ Create inconsistent patterns
- ❌ Skip documentation updates

---

## Communication Protocol

### When to Update Handoff
- After completing a rule (update status)
- Before moving to next rule (update "Next Rule" section)
- When encountering blockers (document in handoff)

### When to Ask for Help
- Rule requirements unclear
- Pattern conflicts with existing code
- Implementation complexity exceeds estimate
- Review feedback requires clarification

---

## Success Metrics

### Progress Tracking
- **Rules Complete:** 4/25 (16%)
- **Time Spent:** 9.16 / 31.5 hours (29%)
- **Tier 1:** 100% complete ✅
- **Tier 2:** 10% complete (1/10)
- **Tier 3:** 0% complete

### Quality Metrics
- **Consistency:** All rules follow same pattern ✅
- **Completeness:** All deliverables included ✅
- **Review Feedback:** All incorporated ✅
- **Documentation:** Comprehensive ✅

---

## Quick Start Guide

### To Continue with R05:

1. **Read Rule File:**
   ```bash
   read_file(".cursor/rules/05-data.mdc")
   ```

2. **Search for Context:**
   ```bash
   codebase_search("How are state machines implemented?")
   glob_file_search("**/state-machines/*.md")
   ```

3. **Generate Draft:**
   - Create `.cursor/rules/05-data-R05-DRAFT.md`
   - Create `docs/compliance-reports/TASK5-R05-DRAFT-SUMMARY.md`
   - Include 3-5 review questions

4. **Present for Review:**
   - Wait for human approval
   - Incorporate feedback

5. **Implement:**
   - Update `services/opa/policies/data-integrity.rego`
   - Create test suite
   - Create automated script
   - Update rule file
   - Create completion summary

6. **Update Handoff:**
   - Mark R05 as complete
   - Update "Next Rule" to R06
   - Update progress metrics

---

## Files Created This Session

### R10 Implementation (Current Session)
- `services/opa/policies/quality.rego` (NEW - R10 section with 5 deny rules + 1 warn rule)
- `.cursor/scripts/check-test-coverage.py` (NEW - 600+ lines, 6 detection functions)
- `services/opa/tests/quality_r10_test.rego` (NEW - 12 comprehensive test cases)
- `docs/testing/test-coverage-testing-guide.md` (NEW - 4 test type patterns + coverage metrics)
- `.cursor/rules/10-quality.mdc` (UPDATED - Added R10 Step 5 section with 26-item checklist)
- `docs/compliance-reports/TASK5-R10-IMPLEMENTATION-COMPLETE.md` (NEW - Completion document)

### R09 Implementation (Previous Session)
- `services/opa/policies/observability.rego` (UPDATED - Added R09 section with 5 deny rules + 1 warn rule)
- `.cursor/scripts/check-trace-propagation.py` (NEW - 500+ lines, 6 detection functions)
- `services/opa/tests/observability_r09_test.rego` (NEW - 15 comprehensive test cases)
- `docs/testing/trace-propagation-testing-guide.md` (NEW - 9 testing patterns + integration examples)
- `.cursor/rules/07-observability.mdc` (UPDATED - Added R09 Step 5 section with 32-item checklist)
- `docs/compliance-reports/TASK5-R09-IMPLEMENTATION-COMPLETE.md` (NEW - Completion document)

### R08 Implementation (Previous Session)
- `services/opa/policies/observability.rego` (NEW - OPA policy)
- `services/opa/tests/observability_r08_test.rego` (NEW - 15 test cases)
- `.cursor/scripts/check-structured-logging.py` (NEW - Automated check script)
- `docs/testing/structured-logging-testing-guide.md` (NEW - Comprehensive testing guide)
- `.cursor/rules/07-observability.mdc` (UPDATED - R08 Step 5 added)
- `docs/compliance-reports/TASK5-R08-IMPLEMENTATION-COMPLETE.md` (NEW)

### R07 Implementation (Previous Session)
- `services/opa/policies/error-handling.rego` (NEW - OPA policy)
- `services/opa/tests/error_handling_r07_test.rego` (NEW - 15 test cases)
- `.cursor/scripts/check-error-handling.py` (NEW - Automated check script)
- `docs/testing/error-handling-testing-guide.md` (NEW - Comprehensive testing guide)
- `.cursor/rules/06-error-resilience.mdc` (UPDATED - R07 Step 5 added)
- `docs/compliance-reports/TASK5-R07-IMPLEMENTATION-COMPLETE.md` (NEW)

### R06 Implementation (Previous Session)
- `services/opa/policies/data-integrity.rego` (UPDATED - R06 section added)
- `services/opa/tests/data_integrity_r06_test.rego` (NEW)
- `.cursor/scripts/check-breaking-changes.py` (NEW)
- `docs/migrations/README.md` (NEW - Migration guide template)
- `.cursor/rules/05-data.mdc` (UPDATED - R06 Step 5 added)
- `docs/compliance-reports/TASK5-R06-IMPLEMENTATION-COMPLETE.md` (NEW)

### R05 Implementation (Previous Session)
- `services/opa/policies/data-integrity.rego` (UPDATED - R05 section added)
- `services/opa/tests/data_integrity_r05_test.rego` (NEW)
- `.cursor/scripts/check-state-machines.py` (NEW)
- `docs/testing/state-machine-testing-guide.md` (NEW)
- `.cursor/rules/05-data.mdc` (UPDATED - R05 Step 5 added)
- `docs/compliance-reports/TASK5-R05-IMPLEMENTATION-COMPLETE.md` (NEW)

### R04 Implementation (Previous Session)
- `services/opa/policies/data-integrity.rego` (NEW)
- `services/opa/tests/data_integrity_r04_test.rego` (NEW)
- `.cursor/scripts/check-layer-sync.py` (NEW)
- `.cursor/rules/05-data.mdc` (UPDATED - R04 Step 5 added)
- `docs/compliance-reports/TASK5-R04-IMPLEMENTATION-COMPLETE.md` (NEW)

### Previous Sessions
- R01-R03: See `docs/compliance-reports/TASK5-R[NN]-IMPLEMENTATION-COMPLETE.md`

---

## Emergency Contacts

**If you encounter issues:**
- Review previous handoff: `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT.md`
- Check rule compliance matrix: `docs/compliance-reports/rule-compliance-matrix.md`
- Review completed rules for patterns: `docs/compliance-reports/TASK5-R[NN]-IMPLEMENTATION-COMPLETE.md`

---

## Final Notes

**Pattern Established:**
- ✅ Human-in-the-loop process works well
- ✅ Consistent structure across rules
- ✅ Review questions help clarify requirements
- ✅ Implementation time estimates are accurate

**Key Learnings:**
- Tier 1 rules (BLOCK) are more straightforward (structural checks)
- Tier 2 rules (OVERRIDE) require more nuanced detection
- Scripts get more complex as rules get more domain-specific
- Examples are critical for developer understanding

**Momentum:**
- Strong foundation established (Tier 1 complete)
- First Tier 2 rule complete (R04)
- Clear pattern established
- Ready to continue efficiently

---

**Status:** R10 IMPLEMENTATION COMPLETE ✅ - 70% THROUGH TIER 2! 🎉  
**Next Agent:** Ready for R11 (Backend Patterns) - Only 3 rules to complete Tier 2!  
**Confidence Level:** HIGH - Pattern established, implementation complete  
**Estimated Time for R11:** 2 hours

---

**Last Updated:** 2025-12-05  
**Updated By:** AI Assistant  
**Session:** R10 Implementation Complete → R11 Ready (Milestone: 70% Tier 2, 40% Overall!)

