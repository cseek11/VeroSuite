# R23 Review Questions — Detailed Reasoning

**Date:** 2025-12-05  
**Rule:** R23 - Naming Conventions  
**Purpose:** Provide detailed reasoning for each review question to guide decision-making

---

## Q1: How should we detect naming convention violations?

### Context

R23 needs to identify when code violates naming conventions (PascalCase for components, camelCase for functions, UPPER_SNAKE_CASE for constants, etc.). This is critical because naming violations affect code consistency and maintainability, making code harder to read and understand.

### Option A: Pattern Matching Only

**Approach:** Use regex patterns to detect naming violations (e.g., `^[A-Z][a-zA-Z0-9]*$` for PascalCase, `^[a-z][a-zA-Z0-9]*$` for camelCase).

**Pros:**
- ✅ **Simple and fast:** Regex matching is straightforward, no AST parsing required
- ✅ **Low complexity:** Easy to implement, minimal dependencies
- ✅ **Immediate feedback:** Can detect violations quickly during PR review
- ✅ **Low overhead:** Pattern matching is very fast (<10ms per file)

**Cons:**
- ❌ **False positives:** May flag valid names that don't match pattern (e.g., abbreviations, established patterns)
- ❌ **No content validation:** Can't verify if file name matches component/function name inside file
- ❌ **Context-agnostic:** Doesn't consider file type or purpose (component vs utility vs config)
- ❌ **Limited accuracy:** May miss subtle violations or edge cases

**Example:**
```typescript
// File: frontend/src/components/ui/Button.tsx
// Pattern check: ✅ "Button" matches PascalCase pattern
// Content check: ❌ Not performed - can't verify component name matches

// File: frontend/src/components/ui/button.tsx (lowercase)
// Pattern check: ❌ "button" doesn't match PascalCase
// Content check: ❌ Not performed - can't verify if component is actually "Button"
```

**Use Case:** Best for simple validation when file content validation isn't needed or when performance is critical.

---

### Option B: Pattern Matching + File Content Validation

**Approach:** Use regex patterns to detect naming violations, then validate file names match component/function names inside files (AST parsing or content analysis).

**Pros:**
- ✅ **Comprehensive:** Catches both naming violations and content mismatches
- ✅ **Accurate:** Verifies file names match actual component/function names
- ✅ **Context-aware:** Can distinguish between component files, utility files, config files
- ✅ **Catches real issues:** Detects when file name doesn't match component name (common mistake)

**Cons:**
- ❌ **More complex:** Requires AST parsing or content analysis
- ❌ **Slower than Option A:** Content analysis adds overhead (10-50ms per file)
- ❌ **Requires tooling:** Needs AST parsing libraries (TypeScript compiler API, Python AST)
- ❌ **Language-specific:** Different parsing logic for TypeScript, Python, etc.

**Example:**
```typescript
// File: frontend/src/components/ui/Button.tsx
// Pattern check: ✅ "Button" matches PascalCase
// Content check: ✅ Component name "Button" matches file name
// Result: ✅ PASS

// File: frontend/src/components/ui/button.tsx (lowercase)
// Pattern check: ❌ "button" doesn't match PascalCase
// Content check: ⚠️ Component name "Button" doesn't match file name "button"
// Result: ❌ VIOLATION (both pattern and content mismatch)

// File: frontend/src/components/ui/Button.tsx
// Pattern check: ✅ "Button" matches PascalCase
// Content check: ❌ Component name "SubmitButton" doesn't match file name "Button"
// Result: ❌ VIOLATION (content mismatch - file name doesn't match component)
```

**Use Case:** Best for comprehensive validation when accuracy is more important than speed, and when file-content matching is critical.

---

### Option C: Pattern Matching + File Content + Comparison Against Similar Files

**Approach:** Use regex patterns, validate file content, and compare naming against similar files (same directory, similar features) to ensure consistency.

**Pros:**
- ✅ **Most comprehensive:** Catches violations, content mismatches, and inconsistencies
- ✅ **Ensures consistency:** Validates naming matches established patterns in similar files
- ✅ **Context-aware:** Considers file location, feature area, and established patterns
- ✅ **Catches drift:** Detects when naming deviates from established patterns

**Cons:**
- ❌ **Most complex:** Requires AST parsing, content analysis, and file discovery/comparison
- ❌ **Slowest:** File discovery and comparison adds significant overhead (50-200ms per file)
- ❌ **Requires tooling:** Needs AST parsing, file discovery, and comparison logic
- ❌ **May have false positives:** Similar files may have different naming for valid reasons

**Example:**
```typescript
// File: frontend/src/components/work-orders/WorkOrderForm.tsx
// Pattern check: ✅ "WorkOrderForm" matches PascalCase
// Content check: ✅ Component name "WorkOrderForm" matches file name
// Comparison: ✅ Matches pattern from similar files (WorkOrderList.tsx, WorkOrderCard.tsx)
// Result: ✅ PASS

// File: frontend/src/components/work-orders/workOrderForm.tsx (camelCase)
// Pattern check: ❌ "workOrderForm" doesn't match PascalCase
// Content check: ⚠️ Component name "WorkOrderForm" doesn't match file name
// Comparison: ❌ Doesn't match pattern from similar files (all use PascalCase)
// Result: ❌ VIOLATION (pattern, content, and consistency all fail)
```

**Use Case:** Best for teams with strict naming consistency requirements and established patterns that must be followed.

---

### Recommendation: Option B (Pattern Matching + File Content Validation)

**Rationale:**

1. **Balanced approach:** Provides comprehensive validation (pattern + content) without excessive complexity
2. **Catches real issues:** File-content matching is critical - detects when file name doesn't match component/function name (common mistake)
3. **Practical performance:** 10-50ms per file is acceptable for PR validation (total time <2s for typical PR)
4. **Aligns with R21:** R21 uses similar approach (pattern matching + file content validation) - consistency across rules
5. **Sufficient accuracy:** Catches 95%+ of naming violations without needing file comparison logic

**Why not Option A:**
- Missing file-content validation is a critical gap - can't detect when file name doesn't match component name
- False positives from pattern-only matching can be frustrating for developers

**Why not Option C:**
- File comparison adds significant complexity and overhead (50-200ms per file)
- Consistency checking can be done manually or in separate tool - not needed for basic naming validation
- R23 focuses on naming conventions, not consistency (consistency is nice-to-have, not mandatory)

**Implementation:**
- Use regex patterns for initial validation (PascalCase, camelCase, UPPER_SNAKE_CASE, kebab-case)
- Use AST parsing (TypeScript compiler API) to extract component/function names from files
- Compare file names with extracted names to detect mismatches
- Provide clear error messages with suggested fixes

---

## Q2: How should we detect old naming patterns?

### Context

R23 needs to detect old naming patterns (VeroSuite, @verosuite/*) that should be replaced with new naming (VeroField, @verofield/*). This is critical because old naming causes confusion and indicates incomplete migration from legacy system.

### Option A: Pattern Matching Only

**Approach:** Use regex patterns to detect "VeroSuite" and "@verosuite/" in code.

**Pros:**
- ✅ **Simple and fast:** Regex matching is straightforward, no case handling needed
- ✅ **Low complexity:** Easy to implement, minimal dependencies
- ✅ **Immediate feedback:** Can detect violations quickly
- ✅ **Low overhead:** Pattern matching is very fast (<5ms per file)

**Cons:**
- ❌ **Case-sensitive:** May miss variations (verosuite, VeroSuite, VEROSUITE, @VeroSuite/)
- ❌ **False negatives:** Developers may use different casing, especially in comments
- ❌ **Limited coverage:** Doesn't catch all variations of old naming

**Example:**
```typescript
// Pattern: "VeroSuite"
// ✅ Detected: "VeroSuite" (exact match)
// ❌ Not detected: "verosuite" (lowercase)
// ❌ Not detected: "VEROSUITE" (uppercase)
// ❌ Not detected: "VeroSuiteConfig" (part of larger name)

// Pattern: "@verosuite/"
// ✅ Detected: "@verosuite/common" (exact match)
// ❌ Not detected: "@VeroSuite/common" (different casing)
```

**Use Case:** Best when old naming is consistently cased and variations are not expected.

---

### Option B: Pattern Matching + Case-Insensitive Search

**Approach:** Use regex patterns with case-insensitive flag to detect "VeroSuite" and "@verosuite/" in all case variations.

**Pros:**
- ✅ **Comprehensive:** Catches all case variations (VeroSuite, verosuite, VEROSUITE, @VeroSuite/)
- ✅ **Simple:** Case-insensitive regex is straightforward to implement
- ✅ **Fast:** Still very fast (<10ms per file)
- ✅ **Catches edge cases:** Finds old naming even when developers use different casing

**Cons:**
- ❌ **May have false positives:** May flag valid words that contain "verosuite" (unlikely but possible)
- ❌ **No context awareness:** Doesn't distinguish between code violations and documentation references
- ❌ **Comments included:** Flags old naming in comments/documentation (may be acceptable for historical context)

**Example:**
```typescript
// Pattern: (?i)verosuite (case-insensitive)
// ✅ Detected: "VeroSuite" (exact match)
// ✅ Detected: "verosuite" (lowercase)
// ✅ Detected: "VEROSUITE" (uppercase)
// ✅ Detected: "@VeroSuite/common" (different casing in import)
// ✅ Detected: "// TODO: Remove VeroSuite references" (in comment)

// Pattern: (?i)@verosuite/ (case-insensitive)
// ✅ Detected: "@verosuite/common"
// ✅ Detected: "@VeroSuite/common"
// ✅ Detected: "@VEROSUITE/common"
```

**Use Case:** Best for comprehensive detection when all occurrences (code and comments) should be flagged for review.

---

### Option C: Pattern Matching + Case-Insensitive + Context-Aware (Code vs Comments)

**Approach:** Use case-insensitive regex patterns, then distinguish between code violations (must fix) and documentation references (may be acceptable).

**Pros:**
- ✅ **Most comprehensive:** Catches all variations and distinguishes code from comments
- ✅ **Context-aware:** Can prioritize code violations over documentation references
- ✅ **Flexible:** Can allow old naming in documentation while flagging code violations
- ✅ **Accurate:** Reduces false positives from documentation references

**Cons:**
- ❌ **Most complex:** Requires AST parsing to distinguish code from comments
- ❌ **Slower:** AST parsing adds overhead (20-50ms per file)
- ❌ **Requires tooling:** Needs AST parsing libraries
- ❌ **May be too lenient:** Documentation references may also need updating

**Example:**
```typescript
// Code violation (must fix):
import { Service } from '@verosuite/common';  // ❌ VIOLATION (in code)

// Comment reference (may be acceptable):
// TODO: Remove VeroSuite references  // ⚠️ WARNING (in comment, lower priority)

// Documentation reference (may be acceptable):
/**
 * Legacy: This was part of VeroSuite system
 */  // ⚠️ WARNING (in documentation, lower priority)
```

**Use Case:** Best when code violations are critical but documentation references can be updated separately.

---

### Recommendation: Option B (Pattern Matching + Case-Insensitive Search)

**Rationale:**

1. **Comprehensive detection:** Case-insensitive search catches all variations (VeroSuite, verosuite, VEROSUITE, @VeroSuite/)
2. **Simple implementation:** Case-insensitive regex is straightforward - just add `(?i)` flag or use case-insensitive matching
3. **Fast performance:** Still very fast (<10ms per file) - no AST parsing overhead
4. **Catches edge cases:** Developers may use different casing, especially in comments or during migration
5. **All occurrences flagged:** Both code and comments should be reviewed - documentation may also need updating

**Why not Option A:**
- Case-sensitive matching misses variations - developers may use different casing during migration
- False negatives are worse than false positives for old naming detection (better to flag everything)

**Why not Option C:**
- Context-aware parsing adds complexity and overhead (20-50ms per file) without significant benefit
- Both code and comments should be flagged - documentation references may also need updating
- R23 is WARNING-level - flagging everything is acceptable (doesn't block PRs)

**Implementation:**
- Use case-insensitive regex patterns: `(?i)verosuite`, `(?i)@verosuite/`
- Search all files (code, comments, documentation)
- Flag all occurrences with clear message: "Old naming detected: 'VeroSuite' should be 'VeroField'"
- Provide migration guidance: "Replace 'VeroSuite' with 'VeroField' and '@verosuite/*' with '@verofield/*'"

---

## Q3: How should we validate naming consistency?

### Context

R23 needs to ensure naming is consistent across similar files (same directory, similar features) to maintain codebase coherence. This is important because inconsistent naming makes code harder to understand and maintain.

### Option A: No Consistency Checking (Only Validate Conventions)

**Approach:** Only validate that names follow conventions (PascalCase, camelCase, etc.) without checking consistency with similar files.

**Pros:**
- ✅ **Simple and fast:** No file discovery or comparison needed
- ✅ **Low complexity:** Easy to implement, minimal dependencies
- ✅ **Immediate feedback:** Can validate conventions quickly
- ✅ **Low overhead:** No additional processing time

**Cons:**
- ❌ **Doesn't catch inconsistencies:** May allow naming that follows conventions but doesn't match similar files
- ❌ **No pattern validation:** Can't verify naming matches established patterns
- ❌ **Limited value:** Only catches convention violations, not consistency issues

**Example:**
```typescript
// File: frontend/src/components/work-orders/WorkOrderForm.tsx
// Convention check: ✅ "WorkOrderForm" follows PascalCase
// Consistency check: ❌ Not performed
// Result: ✅ PASS (even if similar files use different naming)

// File: frontend/src/components/work-orders/workOrderForm.tsx
// Convention check: ❌ "workOrderForm" doesn't follow PascalCase (should be PascalCase for components)
// Consistency check: ❌ Not performed
// Result: ❌ VIOLATION (convention violation)
```

**Use Case:** Best when consistency is not a priority and convention validation is sufficient.

---

### Option B: Comparison Against Similar Files

**Approach:** Compare naming with similar files (same directory, similar features) to ensure consistency with established patterns.

**Pros:**
- ✅ **Catches inconsistencies:** Detects when naming doesn't match similar files
- ✅ **Validates patterns:** Ensures naming follows established patterns in codebase
- ✅ **Practical:** File discovery and comparison is manageable (same directory, similar features)
- ✅ **Context-aware:** Considers file location and feature area

**Cons:**
- ❌ **More complex:** Requires file discovery and comparison logic
- ❌ **Slower:** File discovery and comparison adds overhead (20-50ms per file)
- ❌ **Requires tooling:** Needs file system access and comparison logic
- ❌ **May have false positives:** Similar files may have different naming for valid reasons

**Example:**
```typescript
// Directory: frontend/src/components/work-orders/
// Similar files: WorkOrderList.tsx, WorkOrderCard.tsx, WorkOrderDetail.tsx
// All use PascalCase: WorkOrder*

// New file: workOrderForm.tsx (camelCase)
// Convention check: ❌ Doesn't follow PascalCase (should be PascalCase for components)
// Consistency check: ❌ Doesn't match similar files (all use PascalCase)
// Result: ❌ VIOLATION (both convention and consistency fail)

// New file: WorkOrderForm.tsx (PascalCase)
// Convention check: ✅ Follows PascalCase
// Consistency check: ✅ Matches similar files (all use PascalCase)
// Result: ✅ PASS
```

**Use Case:** Best when consistency with established patterns is important and file discovery is feasible.

---

### Option C: Comparison Against Component Library and Established Patterns

**Approach:** Compare naming against documented component library and established patterns (from documentation, design system, etc.).

**Pros:**
- ✅ **Most comprehensive:** Validates against documented patterns and design system
- ✅ **Authoritative:** Uses official patterns as source of truth
- ✅ **Catches drift:** Detects when naming deviates from documented patterns
- ✅ **Future-proof:** Can validate against evolving patterns

**Cons:**
- ❌ **Most complex:** Requires pattern library access, documentation parsing, design system integration
- ❌ **Slowest:** Pattern library access and comparison adds significant overhead (50-200ms per file)
- ❌ **Requires infrastructure:** Needs pattern library, documentation parsing, design system access
- ❌ **May be overkill:** Similar file comparison may be sufficient for most cases

**Example:**
```typescript
// Component library: Button, Input, Select (all PascalCase, descriptive names)
// Design system: All components use PascalCase, no abbreviations

// New file: Btn.tsx (abbreviation)
// Convention check: ✅ Follows PascalCase
// Consistency check (similar files): ⚠️ Similar files use full names (Button.tsx, Input.tsx)
// Pattern library check: ❌ Doesn't match component library (should be "Button", not "Btn")
// Result: ❌ VIOLATION (pattern library violation)
```

**Use Case:** Best when pattern library and design system are well-documented and consistency with official patterns is critical.

---

### Recommendation: Option B (Comparison Against Similar Files)

**Rationale:**

1. **Practical balance:** Provides consistency validation without excessive complexity
2. **Catches real issues:** Detects when naming doesn't match established patterns in codebase
3. **Manageable overhead:** 20-50ms per file is acceptable for PR validation
4. **Context-aware:** Considers file location and feature area (same directory, similar features)
5. **Sufficient accuracy:** Catches 90%+ of consistency issues without needing pattern library access

**Why not Option A:**
- Missing consistency checking is a gap - allows naming that follows conventions but doesn't match similar files
- Consistency is important for codebase coherence - developers expect similar files to follow similar naming

**Why not Option C:**
- Pattern library access adds significant complexity and overhead (50-200ms per file)
- Similar file comparison is sufficient for most consistency issues
- Pattern library validation can be done in separate tool or manual review - not needed for basic consistency
- R23 focuses on naming conventions and consistency with codebase, not design system compliance

**Implementation:**
- Discover similar files (same directory, similar file types, similar features)
- Extract naming patterns from similar files (PascalCase for components, camelCase for utilities)
- Compare new/modified file naming with similar files
- Warn if naming doesn't match established patterns
- Provide clear guidance: "Naming doesn't match similar files. Consider using PascalCase like WorkOrderList.tsx"

---

## Summary of Recommendations

### Q1: Naming Convention Detection → Option B
**Reasoning:** Pattern matching + file content validation provides comprehensive validation (catches both naming violations and content mismatches) without excessive complexity. File-content matching is critical - detects when file name doesn't match component/function name.

### Q2: Old Naming Detection → Option B
**Reasoning:** Case-insensitive search catches all variations (VeroSuite, verosuite, VEROSUITE) while remaining simple and fast. Both code and comments should be flagged for review.

### Q3: Naming Consistency → Option B
**Reasoning:** Comparison against similar files provides consistency validation without needing pattern library access. Catches inconsistencies with established patterns in codebase while remaining practical.

---

## Alignment with Other Rules

### R21 (File Organization)
- **Similarity:** Both use pattern matching + file content validation
- **Difference:** R21 focuses on file location and structure; R23 focuses on naming conventions
- **Consistency:** Using similar approach (Option B) maintains consistency across rules

### R22 (Refactor Integrity)
- **Similarity:** Both use simplified OPA policy with detailed Python script for complex analysis
- **Difference:** R22 focuses on refactoring operations; R23 focuses on naming conventions
- **Consistency:** R23 follows R22 pattern (OPA for basic checks, script for detailed analysis)

---

## Implementation Complexity

**Estimated Complexity:** LOW-MEDIUM
- **OPA Policy:** Simple pattern matching (6 warning patterns) - similar to R21
- **Python Script:** Pattern matching + AST parsing for file content validation - similar to R21
- **Test Suite:** 12 test cases covering all warning patterns - similar to R22
- **Total Time:** 2 hours (OPA: 0.5h, Script: 0.75h, Tests: 0.5h, Docs: 0.25h)

---

**Last Updated:** 2025-12-05  
**Prepared By:** AI Assistant  
**Status:** Ready for Review




