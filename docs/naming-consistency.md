---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - all
priority: critical
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: CRITICAL - Naming Consistency Rules

## Overview

This rule file enforces consistent project naming across all files, ensuring the project name "VeroField" is used consistently instead of the old "VeroSuite" name.

**⚠️ MANDATORY:** All references to "VeroSuite", "verosuite", "Vero Suite", or related naming must be replaced with "VeroField", "verofield", or "Vero Field" as appropriate.

---

## I. Project Name Standard

### Rule 1: Project Name Definition

**MANDATORY:** The project name is **VeroField** (not VeroSuite).

**Correct Naming:**
- **Project Name:** `VeroField`
- **Package Name:** `verofield` (lowercase, no spaces)
- **Display Name:** `Vero Field` (with space, for UI/branding)
- **Import Namespace:** `@verofield/*` (for package imports)
- **Directory Names:** `verofield` or `VeroField` (as appropriate)

**Old Naming (DO NOT USE):**
- ❌ `VeroSuite`
- ❌ `verosuite`
- ❌ `Vero Suite`
- ❌ `@verosuite/*`

---

## II. Replacement Requirements

### Rule 2: Source Code References

**MANDATORY:** Replace all occurrences in source code:

**Text Replacements:**
- `VeroSuite` → `VeroField`
- `verosuite` → `verofield`
- `Vero Suite` → `Vero Field`
- `VEROSUITE` → `VEROFIELD` (environment variables)

**Import Path Replacements:**
- `@verosuite/common/*` → `@verofield/common/*`
- `@verosuite/api/*` → `@verofield/api/*`
- `@verosuite/kpi-gate` → `@verofield/kpi-gate`
- `@verosuite/ai-soc` → `@verofield/ai-soc`

**MANDATORY:** Search for all occurrences before making changes:

```typescript
// Search for all occurrences
grep -r "VeroSuite" . --exclude-dir=node_modules
grep -r "verosuite" . --exclude-dir=node_modules
grep -r "@verosuite" . --exclude-dir=node_modules
grep -r "VEROSUITE" . --exclude-dir=node_modules
```

### Rule 3: Configuration Files

**MANDATORY:** Update all configuration files:

**Files to Update:**
- `package.json` - Package name, description
- `tsconfig.json` - Path mappings
- `nest-cli.json` - Project name
- `.env` files - Environment variable names
- `docker-compose.yml` - Service names
- `Dockerfile` - Image names
- Kubernetes manifests - Resource names
- CI/CD scripts - Project references

**Example:**
```json
// package.json
{
  "name": "verofield",  // ✅ CORRECT
  "description": "VeroField - Complete Pest Control Operations Platform"
}

// ❌ WRONG
{
  "name": "verosuite",  // ❌ OLD NAME
  "description": "VeroSuite - ..."
}
```

### Rule 4: Documentation Files

**MANDATORY:** Update all documentation:

**Documentation to Update:**
- README.md files
- All `.md` files in `docs/`
- Code comments
- JSDoc comments
- API documentation
- Architecture diagrams
- User guides

**MANDATORY:** Use current system date when updating "Last Updated" fields.

**Reference:** See `.cursor/rules/core.md` for date handling requirements.

### Rule 5: Directory and File Names

**MANDATORY:** Update directory and file names containing "VeroSuite":

**Directory Names:**
- `VeroSuiteMobile/` → Keep as is (if directory exists) OR rename to `VeroFieldMobile/`
- Any directories named `verosuite/` → `verofield/`

**File Names:**
- Files containing `VeroSuite` in name → Rename to use `VeroField`
- Example: `VeroSuiteConfig.ts` → `VeroFieldConfig.ts`

**MANDATORY:** When renaming files/directories:
1. Update all imports referencing the file/directory
2. Update all references in documentation
3. Update build configurations
4. Verify no broken imports

---

## III. Import Path Preservation

### Rule 6: Preserve Import Functionality

**MANDATORY:** When updating import paths, ensure functionality is preserved:

**Import Path Updates:**
```typescript
// ❌ OLD: @verosuite/common/*
import { PrismaService } from '@verosuite/common/prisma';
import { KafkaProducerService } from '@verosuite/common/kafka';

// ✅ NEW: @verofield/common/*
import { PrismaService } from '@verofield/common/prisma';
import { KafkaProducerService } from '@verofield/common/kafka';
```

**MANDATORY:** Verify import paths work after changes:
1. Check `tsconfig.json` path mappings
2. Check `package.json` workspace configuration
3. Verify TypeScript compilation succeeds
4. Verify build systems work
5. Test imports in code

### Rule 7: Build System Compatibility

**MANDATORY:** Ensure build systems continue to work:

**Systems to Verify:**
- TypeScript compilation (`tsc`)
- NestJS build (`nest build`)
- React build (`npm run build`)
- Docker builds
- CI/CD pipelines

**MANDATORY:** After renaming:
1. Run `npm run build` to verify builds work
2. Run `npm test` to verify tests work
3. Check Docker builds succeed
4. Verify CI/CD pipelines pass

---

## IV. Environment Variables

### Rule 8: Environment Variable Updates

**MANDATORY:** Update environment variable names:

**Variable Name Updates:**
- `VEROSUITE_*` → `VEROFIELD_*`
- Example: `VEROSUITE_DB_URL` → `VEROFIELD_DB_URL`

**Files to Update:**
- `.env` files
- `.env.example` files
- `.env.local` files
- Docker Compose files
- Kubernetes ConfigMaps/Secrets
- CI/CD environment configurations

**MANDATORY:** Update both variable names AND usage in code:

```typescript
// ❌ OLD
const dbUrl = process.env.VEROSUITE_DB_URL;

// ✅ NEW
const dbUrl = process.env.VEROFIELD_DB_URL;
```

---

## V. Branding and UI

### Rule 9: UI Branding Updates

**MANDATORY:** Update UI branding references:

**UI Elements to Update:**
- Page titles
- Application name in headers
- Footer text
- About pages
- Help documentation
- Error messages
- Loading screens

**Example:**
```typescript
// ❌ OLD
<h1>Welcome to VeroSuite</h1>

// ✅ NEW
<h1>Welcome to VeroField</h1>
```

**MANDATORY:** Preserve branding consistency across all UI components.

---

## VI. Detection and Replacement Process

### Rule 10: Pre-Change Detection

**MANDATORY:** Before making any changes, detect all occurrences:

```bash
# Search for all variations
grep -r "VeroSuite" . --exclude-dir=node_modules
grep -r "verosuite" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "Vero Suite" . --exclude-dir=node_modules
grep -r "@verosuite" . --exclude-dir=node_modules
grep -r "VEROSUITE" . --exclude-dir=node_modules

# Search in specific file types
grep -r "VeroSuite" --include="*.json" .
grep -r "VeroSuite" --include="*.yml" .
grep -r "VeroSuite" --include="*.yaml" .
grep -r "VeroSuite" --include="*.env*" .
```

### Rule 11: Replacement Strategy

**MANDATORY:** Follow this replacement strategy:

1. **Document All Occurrences** - List all files with old naming
2. **Update Configuration First** - Update package.json, tsconfig.json, etc.
3. **Update Import Paths** - Update all import statements
4. **Update Source Code** - Update code references
5. **Update Documentation** - Update all .md files
6. **Update Environment Variables** - Update .env files and usage
7. **Update Build Configs** - Update Docker, CI/CD, etc.
8. **Verify Functionality** - Test builds, imports, functionality
9. **Update Rule Files** - Update cursor rules to use new naming

---

## VII. Verification Requirements

### Rule 12: Post-Change Verification

**MANDATORY:** After making changes, verify:

1. **No Old References Remain:**
   ```bash
   grep -r "VeroSuite" . --exclude-dir=node_modules
   grep -r "@verosuite" . --exclude-dir=node_modules
   # Should return no results (or only in .git, node_modules)
   ```

2. **All Imports Work:**
   - TypeScript compiles without errors
   - No import resolution errors
   - All modules resolve correctly

3. **Build Systems Work:**
   - `npm run build` succeeds
   - Docker builds succeed
   - CI/CD pipelines pass

4. **Tests Pass:**
   - All tests pass
   - No broken test imports
   - No test configuration issues

---

## VIII. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- All occurrences of old naming
- Import paths using old naming
- Configuration files with old naming
- Documentation with old naming

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Replacement strategy planned
- All affected files identified
- Import paths will be preserved
- Build systems will continue working

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- No old naming will be introduced
- New naming is consistent
- Import paths use new naming
- Configuration files use new naming

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- No old naming remains
- All imports work
- Build systems work
- Tests pass
- Documentation updated

---

## Violations

**HARD STOP violations:**
- Using "VeroSuite" instead of "VeroField"
- Using "@verosuite/*" instead of "@verofield/*"
- Breaking import paths during renaming
- Breaking build systems during renaming

**Must fix before proceeding:**
- Inconsistent naming
- Old naming in new code
- Broken imports after renaming
- Missing documentation updates

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

