# Task 5: R23 (Naming Conventions) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-05  
**Rule:** R23 - Naming Conventions  
**Priority:** MEDIUM (Tier 3 - WARNING)  
**Estimated Time:** 2 hours

---

## Overview

R23 ensures that all code follows consistent naming conventions (PascalCase for components/types, camelCase for functions, UPPER_SNAKE_CASE for constants, kebab-case for directories/configs) and detects old naming patterns (VeroSuite, @verosuite/*). This is a WARNING-level rule that catches naming issues that don't break functionality but affect code consistency and maintainability.

**Key Focus Areas:**
- Component naming (PascalCase, matches file name)
- Function naming (camelCase, verb-noun pattern)
- Constant naming (UPPER_SNAKE_CASE)
- Type/Interface naming (PascalCase, established suffixes)
- File naming (PascalCase for components, camelCase for utilities, kebab-case for configs)
- Directory naming (lowercase, kebab-case)
- Old naming detection (VeroSuite, @verosuite/*)
- Naming consistency (matches established patterns)

---

## Relationship to Other Rules

**R23 Covers:**
- Naming conventions (WARNING-level enforcement)
- Component, function, constant, type naming
- File and directory naming
- Old naming detection
- Naming consistency

**Related Rules:**
- **R21 (File Organization):** R21 covers file location and structure; R23 covers file naming conventions
- **R04 (Layer Synchronization):** R23 ensures naming consistency across layers
- **R20 (UX Consistency):** R23 ensures component naming follows design system patterns

**Rationale:** R23 ensures naming consistency across the codebase. It complements R21 by focusing on naming conventions rather than file organization, and ensures old naming patterns are detected and corrected.

---

## Draft Structure

### Audit Checklist Categories (8 categories, 30+ items)

1. **Component Naming Compliance** (5 items: 4 MANDATORY, 1 RECOMMENDED)
   - PascalCase naming
   - File name matches component name
   - Descriptive names
   - Established patterns

2. **Function Naming Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - camelCase naming
   - Descriptive names
   - Verb-noun pattern

3. **Constant Naming Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - UPPER_SNAKE_CASE naming
   - Descriptive names
   - Truly constant values

4. **Type/Interface Naming Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - PascalCase naming
   - Descriptive names
   - Established suffixes (Dto, Response, Request)

5. **File Naming Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - PascalCase for components, camelCase for utilities, kebab-case for configs
   - Correct file extensions
   - File names match content

6. **Directory Naming Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - Lowercase or kebab-case
   - Descriptive names
   - Monorepo structure compliance

7. **Old Naming Detection** (5 items: 4 MANDATORY, 1 RECOMMENDED)
   - No VeroSuite, @verosuite/* in new/modified code
   - Correct import paths (@verofield/*)
   - Correct package.json scopes

8. **Naming Consistency** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - Consistency across similar files
   - Established patterns
   - No naming conflicts

**Total:** 30+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Key Decisions Required

### Q1: How should we detect naming convention violations?

**Option A:** Pattern matching only (regex for PascalCase, camelCase, UPPER_SNAKE_CASE)
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May have false positives, doesn't validate against file content

**Option B:** Pattern matching + file content validation
- **Pros:** Validates file names match content (component files contain matching component name)
- **Cons:** Requires AST parsing or content analysis

**Option C:** Pattern matching + file content + comparison against similar files
- **Pros:** Comprehensive, validates against content and similar files
- **Cons:** Most complex, requires AST parsing and comparison logic

**Recommendation:** Option B (Pattern matching + file content validation)
- Use pattern matching to detect naming violations (PascalCase, camelCase, UPPER_SNAKE_CASE, kebab-case)
- Validate file names match content (component files contain matching component name)
- Benefits: Catches both naming violations and content mismatches

---

### Q2: How should we detect old naming patterns?

**Option A:** Pattern matching only (detect "VeroSuite", "@verosuite/")
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May miss case variations, doesn't check context

**Option B:** Pattern matching + case-insensitive search
- **Pros:** Catches case variations (verosuite, VeroSuite, VEROSUITE)
- **Cons:** May have false positives in comments/documentation

**Option C:** Pattern matching + case-insensitive + context-aware (code vs comments)
- **Pros:** Comprehensive, distinguishes code violations from documentation references
- **Cons:** Most complex, requires AST parsing

**Recommendation:** Option B (Pattern matching + case-insensitive search)
- Use pattern matching to detect old naming patterns (VeroSuite, @verosuite/*)
- Use case-insensitive search to catch variations
- Warn for all occurrences (code and comments/documentation should be updated)
- Benefits: Simple, effective, catches all variations

---

### Q3: How should we validate naming consistency?

**Option A:** No consistency checking (only validate conventions)
- **Pros:** Simple, fast
- **Cons:** Doesn't catch inconsistencies with similar files

**Option B:** Comparison against similar files (same directory, similar features)
- **Pros:** Catches inconsistencies with established patterns
- **Cons:** Requires file discovery and comparison logic

**Option C:** Comparison against component library and established patterns
- **Pros:** Comprehensive, validates against documented patterns
- **Cons:** Most complex, requires pattern library access

**Recommendation:** Option B (Comparison against similar files)
- Compare naming with similar files (same directory, similar features)
- Validate against established patterns (component library, similar features)
- Benefits: Catches inconsistencies while remaining practical

---

## OPA Policy Design

### Warning Patterns (6 patterns)

1. **R23-W01:** Component not using PascalCase
2. **R23-W02:** Function not using camelCase
3. **R23-W03:** Constant not using UPPER_SNAKE_CASE
4. **R23-W04:** File name doesn't match component/function name
5. **R23-W05:** Old naming detected (VeroSuite, @verosuite/*)
6. **R23-W06:** Directory not using lowercase/kebab-case

### Enforcement Strategy

1. **WARNING-level:** Log violations but don't block PRs
2. **Context-aware:** Only warn for applicable naming types (components, functions, constants, files, directories)
3. **Clear messages:** Provide specific guidance on naming violations
4. **Migration suggestions:** Suggest correct naming for violations

---

## Automated Check Script

**Script:** `.cursor/scripts/check-naming-conventions.py`

**Checks:**
- Component naming (PascalCase, matches file name)
- Function naming (camelCase, verb-noun pattern)
- Constant naming (UPPER_SNAKE_CASE)
- Type/Interface naming (PascalCase, established suffixes)
- File naming (PascalCase for components, camelCase for utilities, kebab-case for configs)
- Directory naming (lowercase, kebab-case)
- Old naming detection (VeroSuite, @verosuite/*, case-insensitive)
- Naming consistency (comparison against similar files)

---

## Test Cases (12 test cases)

1. ✅ Happy path (component with PascalCase)
2. ✅ Happy path (function with camelCase)
3. ✅ Happy path (constant with UPPER_SNAKE_CASE)
4. ⚠️ Warning (component not PascalCase)
5. ⚠️ Warning (function not camelCase)
6. ⚠️ Warning (constant not UPPER_SNAKE_CASE)
7. ⚠️ Warning (file name doesn't match component name)
8. ⚠️ Warning (old naming: VeroSuite)
9. ⚠️ Warning (old naming: @verosuite/*)
10. ⚠️ Warning (directory not lowercase/kebab-case)
11. Edge case (type with PascalCase)
12. Edge case (config file with kebab-case)

---

## Review Questions

1. **Q1: Naming Convention Detection** - Do you agree with Option B (Pattern matching + file content validation)?
   - **Answer:** ✅ YES - Approved. File-content validation catches real mismatches that pattern-only checking misses. Performance overhead (10-50ms per file) is well-justified.

2. **Q2: Old Naming Detection** - Do you agree with Option B (Pattern matching + case-insensitive search)?
   - **Answer:** ✅ YES - Approved. Case-insensitive search is comprehensive while remaining simple. Both code AND comments should be flagged. False negatives are worse than false positives for old naming detection.

3. **Q3: Naming Consistency** - Do you agree with Option B (Comparison against similar files)?
   - **Answer:** ✅ YES - Approved. Same-directory comparison strikes the right balance between consistency validation and complexity. Dynamic pattern extraction is cleaner than maintaining a separate pattern library.

**📋 Detailed Reasoning:** See `docs/compliance-reports/R23-REVIEW-QUESTIONS-REASONING.md` for comprehensive analysis of each option, pros/cons, examples, and rationale for recommendations.

**✅ All Recommendations Approved - Proceeding to Implementation**

---

**Last Updated:** 2025-12-05  
**Status:** ✅ APPROVED - Ready for Implementation

