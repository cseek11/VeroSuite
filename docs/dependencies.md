---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - all
priority: critical
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: CRITICAL - Dependency Governance & Safety Rules

## Overview

This rule file enforces dependency governance to prevent bugs, security issues, and bloat from unmanaged dependencies. Ensures no duplicate libraries, proper license compliance, security verification, and dead dependency elimination.

**⚠️ MANDATORY:** All dependency additions must be verified for existing usage, duplicates, licenses, and security risks before installation.

---

## I. Pre-Installation Requirements

### Rule 1: Search for Existing Libraries

**MANDATORY:** Before installing ANY new dependency, you MUST search the codebase:

```typescript
// Execute these searches in parallel:
1. grep -r "from ['\"]library-name" . --exclude-dir=node_modules
2. grep -r "require\(['\"]library-name" . --exclude-dir=node_modules
3. codebase_search("How is [functionality] implemented?")
4. read_file("package.json") // Root package.json
5. read_file("frontend/package.json") // Frontend package.json
6. read_file("backend/package.json") // Backend package.json
7. read_file("VeroFieldMobile/package.json") // Mobile package.json (may still be VeroSuiteMobile/ until renamed)
8. glob_file_search("**/package.json") // All package.json files
```

**STOP if library already exists - use existing library instead.**

### Rule 2: Check Project-Wide Usage

**MANDATORY:** Check ALL package.json files in monorepo:

1. **Root package.json** - Shared dependencies
2. **frontend/package.json** - Frontend-specific dependencies
3. **backend/package.json** - Backend-specific dependencies
4. **apps/[service]/package.json** - Microservice dependencies
5. **libs/common/package.json** - Shared library dependencies
6. **VeroFieldMobile/package.json** (may still be VeroSuiteMobile/) - Mobile dependencies

**MANDATORY:** Verify if dependency should be:
- **Shared** (root or libs/common) - Used by multiple services
- **Service-specific** (apps/[service]) - Only used by one service
- **Platform-specific** (frontend/backend/mobile) - Platform-only

---

## II. Duplicate Detection & Consolidation

### Rule 3: Detect Duplicate Libraries

**MANDATORY:** Identify and eliminate duplicate libraries with overlapping functionality:

**Common Duplicates to Check:**
- **Date Libraries:** `dayjs` vs `date-fns` vs `moment` vs `luxon`
- **HTTP Clients:** `axios` vs `fetch` vs `node-fetch`
- **Validation:** `zod` vs `yup` vs `joi` vs `class-validator`
- **State Management:** `zustand` vs `redux` vs `mobx`
- **UI Libraries:** Multiple component libraries
- **Utility Libraries:** `lodash` vs native methods vs `ramda`

**MANDATORY:** Choose ONE library per functionality and consolidate.

### Rule 4: Consolidate Overlapping Libraries

**MANDATORY:** When duplicates are found:

1. **Identify Primary Library** - Choose the one most widely used
2. **Update All Imports** - Replace duplicate library imports
3. **Remove Duplicate** - Remove from package.json
4. **Update Lock Files** - Run `npm install` to update lock files
5. **Test Changes** - Verify functionality still works
6. **Document Decision** - Update `docs/engineering-decisions.md`

**Example:**
```typescript
// ❌ DUPLICATE DETECTED:
// frontend/package.json: "dayjs": "^1.11.0"
// backend/package.json: "date-fns": "^2.30.0"
// Both used for date manipulation

// ✅ CONSOLIDATION:
// 1. Choose dayjs (more widely used in frontend)
// 2. Update backend to use dayjs
// 3. Remove date-fns from backend/package.json
// 4. Update all backend imports:
//    - FROM: import { format } from 'date-fns';
//    - TO: import dayjs from 'dayjs';
// 5. Test backend date operations
// 6. Document in docs/engineering-decisions.md
```

### Rule 5: Update Import Paths

**MANDATORY:** When removing duplicate libraries, update ALL import paths:

```typescript
// Search for all imports of removed library
grep -r "from ['\"]removed-library" .
grep -r "require\(['\"]removed-library" .

// Update all imports to use consolidated library
// Test all affected files
// Verify no broken imports remain
```

---

## III. License & Security Verification

### Rule 6: License Compatibility Check

**MANDATORY:** Before adding dependency, verify license compatibility:

1. **Check License Type** - MIT, Apache, GPL, etc.
2. **Verify Compatibility** - Ensure compatible with project license
3. **Check License File** - Read LICENSE file in dependency
4. **Document License** - Add to LICENSE-ATTRIBUTIONS.md if required

**Prohibited Licenses:**
- GPL v3 (unless project is GPL)
- AGPL (unless project is AGPL)
- Any license incompatible with project license

**MANDATORY:** If license is unclear, ask for clarification before installing.

### Rule 7: Security Risk Verification

**MANDATORY:** Before adding dependency, verify security:

```bash
# Run npm audit on the dependency
npm audit [package-name]

# Check for known vulnerabilities
npm audit --audit-level=moderate

# Check dependency's security history
# Review npm security advisories
```

**MANDATORY:** Do NOT install dependencies with:
- **Critical vulnerabilities** - Must fix or find alternative
- **High vulnerabilities** - Should fix or find alternative
- **Moderate vulnerabilities** - Review and fix if possible

**MANDATORY:** If vulnerabilities exist, either:
1. **Wait for fix** - Use dependency after vulnerability is patched
2. **Find alternative** - Use different library without vulnerabilities
3. **Document risk** - If must use, document in SECURITY.md

### Rule 8: Dependency Security Scanning

**MANDATORY:** Run security scans after adding dependencies:

```bash
# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# If vulnerabilities cannot be fixed automatically
npm audit fix --force  # Use with caution
```

**MANDATORY:** Verify no new vulnerabilities introduced after installation.

---

## IV. Dead Dependency Detection

### Rule 9: Detect Unused Dependencies

**MANDATORY:** Detect and remove unused dependencies:

```bash
# Check for unused dependencies
# Use tools like depcheck or npm-check
npx depcheck

# Verify dependencies are actually used
grep -r "from ['\"]dependency-name" .
grep -r "require\(['\"]dependency-name" .
```

**MANDATORY:** Remove dependencies that are:
- **Not imported anywhere** - No imports found
- **Only in test files** - Move to devDependencies
- **Shadowed by other dependencies** - Dependency provided by another package

### Rule 10: Detect Shadowed Dependencies

**MANDATORY:** Detect dependencies shadowed by other packages:

```bash
# Check for shadowed dependencies
npm ls [package-name]

# Verify if dependency is provided by another package
# Example: @types/node might be provided by TypeScript
```

**MANDATORY:** Remove shadowed dependencies to reduce bundle size.

---

## V. Dependency Management Rules

### Rule 11: Monorepo Dependency Strategy

**MANDATORY:** Follow monorepo dependency strategy:

1. **Shared Dependencies** → Root `package.json` or `libs/common/package.json`
2. **Service-Specific** → `apps/[service]/package.json`
3. **Platform-Specific** → `frontend/package.json`, `backend/package.json`, etc.
4. **Dev Dependencies** → Service-specific or root (if shared)

**MANDATORY:** Do NOT duplicate dependencies across services if they can be shared.

**Reference:** See `.cursor/rules/monorepo.md` for monorepo structure.

### Rule 12: Version Pinning Strategy

**MANDATORY:** Use appropriate version pinning:

1. **Exact Versions** - For critical dependencies (security, stability)
2. **Caret (^)** - For minor updates (default)
3. **Tilde (~)** - For patch updates only
4. **Latest** - NEVER use `latest` in production

**Example:**
```json
{
  "dependencies": {
    "react": "^18.2.0",        // Allow minor updates
    "typescript": "~5.2.0",   // Allow patch updates only
    "critical-lib": "1.2.3"   // Exact version (critical)
  }
}
```

### Rule 13: Lock File Management

**MANDATORY:** Respect lock files:

- **NEVER modify lock files manually** - Only via `npm install`
- **Commit lock files** - Always commit `package-lock.json` or `pnpm-lock.yaml`
- **Use same package manager** - Don't mix npm, yarn, pnpm
- **Update lock files** - After dependency changes

**Reference:** See `.cursor/rules/tooling.md` for lock file protection.

---

## VI. Dependency Testing

### Rule 14: Test Dependency Changes

**MANDATORY:** Test after dependency changes:

1. **Run Tests** - Ensure all tests pass
2. **Check Build** - Verify build succeeds
3. **Test Functionality** - Verify features using dependency work
4. **Check Bundle Size** - Verify bundle size impact (frontend)
5. **Check Startup Time** - Verify startup time impact (backend)

### Rule 15: Dependency Regression Tests

**MANDATORY:** Add tests detecting unused/shadowed dependencies:

```typescript
// Example: Test that detects unused dependencies
describe('Dependency Usage', () => {
  it('should use all dependencies in package.json', () => {
    const packageJson = require('../package.json');
    const dependencies = Object.keys(packageJson.dependencies);
    
    dependencies.forEach(dep => {
      // Check if dependency is imported
      const importPattern = new RegExp(`from ['"]${dep}|require\\(['"]${dep}`);
      const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
        ignore: ['node_modules/**', 'dist/**']
      });
      
      const hasImport = files.some(file => {
        const content = fs.readFileSync(file, 'utf-8');
        return importPattern.test(content);
      });
      
      expect(hasImport).toBe(true);
    });
  });
});
```

---

## VII. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Existing libraries providing same functionality
- All package.json files in monorepo
- Duplicate libraries
- License information

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Library choice matches existing patterns
- Dependency location (shared vs service-specific)
- No duplicates exist
- License is compatible

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Library doesn't already exist
- No duplicates will be created
- License is compatible
- Security risks are acceptable
- Dependency location is correct

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- No duplicate dependencies added
- All imports updated (if consolidating)
- Security scan passes
- Lock files updated
- Tests pass
- No dead dependencies remain

---

## Violations

**HARD STOP violations:**
- Installing dependency without searching for existing library
- Creating duplicate libraries
- Installing dependency with critical vulnerabilities
- Installing dependency with incompatible license
- Modifying lock files manually

**Must fix before proceeding:**
- Unused dependencies
- Shadowed dependencies
- Missing security scans
- Missing license verification
- Incorrect dependency location

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every dependency addition

