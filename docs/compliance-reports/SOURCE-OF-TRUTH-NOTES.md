# Source of Truth Documentation

**Date:** 2025-12-05  
**Purpose:** Clarify authoritative sources for rule numbers and definitions  
**Status:** Active

---

## ⚠️ CRITICAL: Rule Numbering Source of Truth

**The rule files (`.cursor/rules/*.mdc`) are the authoritative source of truth for rule numbers and definitions.**

### Authoritative Sources (In Order)

1. **`.cursor/rules/*.mdc` files** - Primary source
   - Actual rule definitions and numbers
   - Step 5 audit procedures
   - Enforcement levels

2. **`docs/compliance-reports/rule-compliance-matrix.md`** - Reference matrix
   - Complete mapping of all 25 rules
   - Enforcement levels and MAD tiers
   - OPA policy mappings
   - Step 5 status

3. **Original plan document** (`docs/developer/# VeroField Rules 2.md`) - Historical reference
   - High-level implementation plan
   - Phase structure and timeline
   - ⚠️ Rule numbering may differ from actual implementation

---

## Why This Matters

**The original plan document listed different rule numbers for Tier 3 rules (R18-R25), but the actual implementation uses different numbers.**

### Example Discrepancy

**Original Plan Document:**
- R18: UX Consistency
- R19: File Organization
- R20: Import Patterns
- R24: Performance Budgets

**Actual Implementation (Source of Truth):**
- R18: Performance Budgets
- R19: Accessibility Requirements
- R20: UX Consistency
- R21: File Organization
- R24: Cross-Platform Compatibility

**Impact:** Low - Core structure and design principles are intact, only numbering differs.

---

## How to Verify Rule Numbers

### Step 1: Check Rule Files
```bash
# Find rule definition
grep -r "R##:" .cursor/rules/*.mdc

# Example: Find R21
grep -r "R21:" .cursor/rules/04-architecture.mdc
```

### Step 2: Check Compliance Matrix
```bash
# View complete matrix
cat docs/compliance-reports/rule-compliance-matrix.md
```

### Step 3: Verify Against Implementation
```bash
# Check OPA policy
grep -r "R21" services/opa/policies/architecture.rego

# Check test files
grep -r "R21" services/opa/tests/architecture_r21_test.rego
```

---

## Documentation Updated with This Note

The following documents have been updated with source-of-truth warnings:

1. ✅ `docs/developer/# VeroField Rules 2.md` - Original plan document
2. ✅ `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md` - Main handoff prompt
3. ✅ `docs/compliance-reports/rule-compliance-matrix.md` - Compliance matrix
4. ✅ `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R22.md` - R22 handoff
5. ✅ `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R23.md` - R23 handoff
6. ✅ `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT.md` - Generic handoff
7. ✅ `docs/compliance-reports/AGENT-HANDOFF-PROMPT-R22.md` - R22 prompt

---

## For Future Agents

**When implementing rules:**

1. ✅ **ALWAYS** verify rule numbers against `.cursor/rules/*.mdc` files
2. ✅ **ALWAYS** check `docs/compliance-reports/rule-compliance-matrix.md` for mapping
3. ⚠️ **DO NOT** rely solely on original plan document for rule numbers
4. ✅ **USE** original plan document for phase structure and design principles

**When creating handoff documents:**

1. ✅ **INCLUDE** source-of-truth warning at the top
2. ✅ **REFERENCE** `docs/compliance-reports/rule-compliance-matrix.md`
3. ✅ **VERIFY** rule numbers against actual rule files

---

## Current Implementation Status

**As of 2025-12-05:**

- ✅ **22/25 rules complete (88%)**
- ✅ **R01-R22:** Complete with Step 5 procedures
- ⏸️ **R23-R25:** Pending implementation

**See `docs/compliance-reports/rule-compliance-matrix.md` for complete status.**

---

**Last Updated:** 2025-12-05  
**Maintained By:** Rules Champion Team  
**Review Frequency:** When rule numbers change or new rules added





