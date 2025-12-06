# R21: File Organization — Draft Summary

**Date:** 2025-12-05  
**Rule:** R21 - File Organization  
**Tier:** 3 (WARNING-level enforcement)  
**Status:** DRAFT - Awaiting Review  
**Estimated Time:** 2 hours

---

## Overview

R21 ensures that files are organized correctly according to the monorepo structure, enforcing file location compliance, detecting deprecated paths, preventing unauthorized top-level directories, and ensuring proper file naming and directory structure.

**Key Focus Areas:**
- Monorepo path compliance (files in `apps/`, `libs/`, `frontend/`)
- Deprecated path detection (`backend/src/`, `backend/prisma/`, root-level `src/`)
- Top-level directory compliance (no new top-level dirs without approval)
- File naming conventions (PascalCase, camelCase, kebab-case)
- Directory structure compliance (feature-based or layer-based organization)
- Import path compliance (correct monorepo paths, no deprecated paths)

---

## Relationship to R03

**R03 Covers:**
- Architecture boundaries (BLOCK-level enforcement)
- Service boundaries (no cross-service imports)
- Architectural scope limits (no new microservices, no new databases)
- Critical violations that block PRs

**R21 Covers:**
- File organization (WARNING-level enforcement)
- File location compliance (monorepo paths, deprecated paths)
- Directory structure compliance (naming, organization, depth)
- File naming conventions
- Import path compliance (monorepo paths, deprecated paths)

**Rationale:** R03 enforces critical architectural boundaries (BLOCK). R21 ensures file organization compliance (WARNING), catching organizational issues that don't break functionality but affect maintainability and consistency. R21 complements R03 by focusing on file-level organization rather than architectural boundaries.

---

## Draft Structure

### Audit Checklist Categories (8 categories, 40+ items)

1. **Monorepo Path Compliance** (7 items: 5 MANDATORY, 2 RECOMMENDED)
   - Files in correct paths (`apps/`, `libs/`, `frontend/`)
   - Backend files in `apps/api/src/`, database schema in `libs/common/prisma/`
   - Shared code in `libs/common/src/`, frontend files in `frontend/src/`

2. **Deprecated Path Detection** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - No files in deprecated paths (`backend/src/`, `backend/prisma/`, root-level `src/`)
   - No references to deprecated paths in imports or documentation

3. **Top-Level Directory Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - No new top-level directories without approval
   - New directories within approved monorepo structure
   - Directory naming conventions

4. **File Naming Conventions** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - PascalCase for components, camelCase for utilities, kebab-case for configs
   - Correct file extensions, file names match content

5. **Directory Structure Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - Feature-based or layer-based organization
   - Reasonable nesting depth (3-4 levels)
   - Consistency with similar features

6. **Import Path Compliance** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - Correct monorepo paths (`@verofield/common/*`)
   - No deprecated paths (`@verosuite/*`, old relative paths)
   - No cross-service imports

7. **File Type Organization** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - Components in correct locations (`ui/` for reusable, feature folders for feature-specific)
   - Services in correct locations (`apps/[service]/src/` or `libs/common/src/`)
   - Types in correct locations (`frontend/src/types/` or `libs/common/src/types/`)

8. **Missing Files Detection** (3 items: 2 MANDATORY, 1 RECOMMENDED)
   - Required files exist (`.gitkeep`, `index.ts`)
   - Test files co-located or in test directories

**Total:** 40+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Key Decisions Required

### Q1: How should we detect deprecated paths?

**Option A:** Pattern matching only (detect `backend/src/`, `backend/prisma/`, root-level `src/`)
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May miss subtle violations, doesn't check git history for moved files

**Option B:** Pattern matching + git history check
- **Pros:** Catches files moved to deprecated paths, validates file history
- **Cons:** Requires git access, more complex

**Option C:** Pattern matching + git history + import path checking
- **Pros:** Comprehensive, catches deprecated paths in code and imports
- **Cons:** Most complex, requires git access and AST parsing

**Recommendation:** Option C (Pattern matching + git history + import path checking)
- Use pattern matching to detect files in deprecated paths
- Check git history to detect files moved to deprecated paths
- Check import paths for references to deprecated paths
- Benefits: Comprehensive detection, catches both obvious and subtle violations, validates imports

---

### Q2: How should we detect new top-level directories?

**Option A:** Git diff only (detect new directories in PR)
- **Pros:** Simple, catches new directories in current PR
- **Cons:** May miss directories created in previous commits, doesn't validate against approved list

**Option B:** Git diff + approved directory list validation
- **Pros:** Validates against approved monorepo structure, catches unauthorized directories
- **Cons:** Requires maintaining approved directory list

**Option C:** Git diff + approved directory list + architecture documentation check
- **Pros:** Comprehensive, validates against approved structure and documentation
- **Cons:** Most complex, requires parsing architecture documentation

**Recommendation:** Option B (Git diff + approved directory list validation)
- Use git diff to detect new top-level directories in PR
- Validate against approved directory list (`apps/`, `libs/`, `frontend/`, `docs/`, `services/`, etc.)
- Warn if new directory not in approved list
- Benefits: Simple, effective, catches unauthorized directories

---

### Q3: How should we validate file naming conventions?

**Option A:** Pattern matching only (detect naming violations)
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May have false positives, doesn't validate against file content

**Option B:** Pattern matching + file content validation
- **Pros:** Validates file names match content (component files match component name)
- **Cons:** Requires AST parsing or content analysis

**Option C:** Pattern matching + file content + comparison against similar files
- **Pros:** Comprehensive, validates against content and similar files
- **Cons:** Most complex, requires AST parsing and comparison logic

**Recommendation:** Option B (Pattern matching + file content validation)
- Use pattern matching to detect naming violations (PascalCase, camelCase, kebab-case)
- Validate file names match content (component files contain matching component name)
- Benefits: Catches both naming violations and content mismatches

---

### Q4: How should we detect import path violations?

**Option A:** Pattern matching only (detect deprecated import paths)
- **Pros:** Simple, fast, catches obvious violations (`@verosuite/*`, `../../backend/`)
- **Cons:** May miss subtle violations, doesn't validate monorepo paths

**Option B:** Pattern matching + monorepo path validation
- **Pros:** Validates imports use correct monorepo paths (`@verofield/common/*`)
- **Cons:** Requires AST parsing for import statements

**Option C:** Pattern matching + monorepo path validation + cross-service import detection
- **Pros:** Comprehensive, validates monorepo paths and detects cross-service imports
- **Cons:** Most complex, requires AST parsing and service boundary detection

**Recommendation:** Option C (Pattern matching + monorepo path validation + cross-service import detection)
- Use pattern matching to detect deprecated import paths (`@verosuite/*`, old relative paths)
- Validate imports use correct monorepo paths (`@verofield/common/*`, `@/components/ui/`)
- Detect cross-service imports (`../../other-service/`)
- Benefits: Comprehensive detection, validates monorepo paths, prevents cross-service imports

---

### Q5: How should we validate directory structure?

**Option A:** Depth checking only (detect excessive nesting)
- **Pros:** Simple, fast, catches deep nesting violations
- **Cons:** Doesn't validate organization pattern (feature-based vs layer-based)

**Option B:** Depth checking + organization pattern validation
- **Pros:** Validates organization pattern matches project conventions
- **Cons:** Requires understanding project organization patterns

**Option C:** Depth checking + organization pattern + comparison against similar features
- **Pros:** Comprehensive, validates pattern and consistency
- **Cons:** Most complex, requires comparison logic

**Recommendation:** Option B (Depth checking + organization pattern validation)
- Check directory depth (warn if >4 levels deep)
- Validate organization pattern (feature-based for apps, layer-based for libs)
- Compare against similar features for consistency
- Benefits: Validates both depth and organization pattern

---

## Implementation Approach

### Detection Strategy
1. **Deprecated Path Detection:** Pattern matching (file paths) + git history (moved files) + import path checking (references)
2. **Top-Level Directory Detection:** Git diff (new directories) + approved directory list validation
3. **File Naming Validation:** Pattern matching (naming conventions) + file content validation (name matches content)
4. **Import Path Validation:** Pattern matching (deprecated paths) + monorepo path validation + cross-service import detection
5. **Directory Structure Validation:** Depth checking + organization pattern validation + comparison against similar features

### Validation Strategy
1. **Monorepo Path Validation:** Verify files in correct paths (`apps/`, `libs/`, `frontend/`)
2. **Deprecated Path Validation:** Verify no files in deprecated paths
3. **Top-Level Directory Validation:** Verify no unauthorized top-level directories
4. **File Naming Validation:** Verify naming conventions and content matching
5. **Import Path Validation:** Verify correct monorepo paths and no deprecated paths

### Enforcement Strategy
1. **WARNING-level:** Log violations but don't block PRs
2. **Context-aware:** Only warn for applicable requirements (file organization, directory structure)
3. **Clear messages:** Provide specific guidance on file organization issues
4. **Migration suggestions:** Suggest correct paths for violations

---

## Examples Provided

### ✅ Correct Patterns
- Files in correct monorepo paths (`apps/api/src/`, `libs/common/src/`, `frontend/src/`)
- Correct import paths (`@verofield/common/*`, `@/components/ui/`)
- Proper directory structure (feature-based organization)
- Correct file naming (PascalCase for components, camelCase for utilities)

### ❌ Violation Patterns
- Files in deprecated paths (`backend/src/`, `backend/prisma/`)
- Deprecated import paths (`@verosuite/*`, old relative paths)
- Unauthorized top-level directories
- Incorrect file naming (wrong case, wrong extension)

---

## Review Questions

1. **Q1: Deprecated Path Detection** - Do you agree with Option C (Pattern matching + git history + import path checking)?
2. **Q2: Top-Level Directory Detection** - Do you agree with Option B (Git diff + approved directory list validation)?
3. **Q3: File Naming Validation** - Do you agree with Option B (Pattern matching + file content validation)?
4. **Q4: Import Path Validation** - Do you agree with Option C (Pattern matching + monorepo path validation + cross-service import detection)?
5. **Q5: Directory Structure Validation** - Do you agree with Option B (Depth checking + organization pattern validation)?

---

## Estimated Time

**Implementation:** 2 hours
- OPA policy: 0.5 hours (8-10 warnings)
- Automated script: 0.75 hours (file path validation, git history, import checking)
- Test suite: 0.5 hours (10-12 test cases)
- Rule file update: 0.25 hours (add audit procedures)
- Documentation: 0.25 hours (completion report)

**Complexity:** LOW-MEDIUM
- Simpler than R20 (no design system parsing, no page comparison)
- File path validation is straightforward
- Git history checking adds some complexity
- Import path validation requires AST parsing

---

## Next Steps

1. **Review Draft:** Read `.cursor/rules/04-architecture-R21-DRAFT.md`
2. **Answer Questions:** Provide feedback on 5 review questions
3. **Approve or Request Changes:** Approve draft or request modifications
4. **Implementation:** AI will implement after approval

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Draft Location:** `.cursor/rules/04-architecture-R21-DRAFT.md`





