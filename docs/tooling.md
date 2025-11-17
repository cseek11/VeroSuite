---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - all
priority: high
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: HIGH - Tooling Consistency Rules

## Overview

This rule file enforces tooling consistency, preventing Cursor from breaking tooling setup. Ensures lockfile protection, version respect, and lint/format compliance.

**⚠️ MANDATORY:** The AI MUST respect package.json versions, NEVER modify lockfiles without permission, and fix all lint/format violations.

---

## I. Lockfile Protection

### Rule 1: Never Modify Lockfiles

**MANDATORY:** NEVER modify lockfiles without explicit authorization:

**Lockfiles:**
- `package-lock.json` - npm lockfile
- `pnpm-lock.yaml` - pnpm lockfile
- `yarn.lock` - yarn lockfile

**MANDATORY:** Lockfiles are auto-generated and should only be modified by package managers:

```bash
# ✅ CORRECT: Let package manager update lockfile
npm install [package-name]
# package-lock.json automatically updated

# ❌ WRONG: Manual lockfile modification
# Never edit package-lock.json, pnpm-lock.yaml, or yarn.lock directly
```

**MANDATORY:** If lockfile needs updating:
1. Run package manager command (`npm install`, `pnpm install`, `yarn install`)
2. Commit the auto-generated changes
3. Do NOT manually edit lockfile

### Rule 2: Lockfile Permission Request

**MANDATORY:** If lockfile modification is needed, request explicit permission:

```
⚠️ LOCKFILE MODIFICATION REQUEST

Lockfile: package-lock.json
Reason: [Why lockfile needs updating]
Command: npm install [package-name]

⚠️ REQUIRES EXPLICIT PERMISSION

Please respond with:
- "Yes, update lockfile" - To approve
- "No, do not update lockfile" - To reject
```

---

## II. Version Respect

### Rule 3: Respect package.json Versions

**MANDATORY:** Respect versions specified in package.json:

**Version Pinning:**
- **Exact:** `"1.2.3"` - Use exact version
- **Caret:** `"^1.2.3"` - Allow minor updates
- **Tilde:** `"~1.2.3"` - Allow patch updates only

**MANDATORY:** Do NOT change version ranges without justification:

```json
// ✅ CORRECT: Respect existing version
{
  "dependencies": {
    "react": "^18.2.0"  // Keep existing version
  }
}

// ❌ WRONG: Changing version without reason
{
  "dependencies": {
    "react": "^19.0.0"  // Changed without justification
  }
}
```

### Rule 4: Version Update Justification

**MANDATORY:** If version update is needed, provide justification:

```
⚠️ VERSION UPDATE REQUEST

Package: react
Current: ^18.2.0
Proposed: ^19.0.0
Reason: [Why version update is needed]
Breaking Changes: [List breaking changes]
Migration Required: [Yes/No]

⚠️ REQUIRES EXPLICIT PERMISSION
```

---

## III. Lint/Format Enforcement

### Rule 5: TypeScript Compiler Checks

**MANDATORY:** Run TypeScript compiler checks:

```bash
# Run TypeScript compiler
npm run type-check
# or
tsc --noEmit

# MANDATORY: Fix all TypeScript errors before completion
```

**MANDATORY:** All TypeScript errors must be fixed before completing implementation.

### Rule 6: ESLint Compliance

**MANDATORY:** Fix all ESLint violations:

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# MANDATORY: Fix all remaining ESLint errors
```

**MANDATORY:** Generated code must not violate ESLint rules.

### Rule 7: Prettier Format Compliance

**MANDATORY:** Ensure code follows Prettier formatting:

```bash
# Run Prettier
npm run format

# Check formatting
npm run format:check

# MANDATORY: Format all code before completion
```

**MANDATORY:** All code must be formatted according to Prettier configuration.

### Rule 8: Fix Generated Code Violations

**MANDATORY:** Fix all lint/format violations in generated code:

```typescript
// ❌ WRONG: Generated code with lint violations
function getWorkOrder(id: string) {
  const workOrder=await prisma.workOrder.findUnique({where:{id}}); // Missing spaces, no await
  return workOrder;
}

// ✅ CORRECT: Fixed lint violations
async function getWorkOrder(id: string): Promise<WorkOrder | null> {
  const workOrder = await prisma.workOrder.findUnique({
    where: { id }
  });
  return workOrder;
}
```

---

## IV. Tooling Verification

### Rule 9: Pre-Completion Checks

**MANDATORY:** Run all tooling checks before completion:

```bash
# 1. TypeScript check
npm run type-check

# 2. ESLint check
npm run lint

# 3. Prettier check
npm run format:check

# 4. All checks pass
# ✅ Ready for completion
```

**MANDATORY:** All checks must pass before marking implementation complete.

### Rule 10: Tooling Configuration Respect

**MANDATORY:** Respect existing tooling configuration:

**Configuration Files:**
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `package.json` - Scripts and dependencies

**MANDATORY:** Do NOT modify tooling configuration without explicit permission.

---

## V. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Tooling configuration files
- Existing lint/format scripts
- Version constraints

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Tooling patterns match existing setup
- Version constraints respected
- Lint/format rules understood

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Lockfiles not modified
- Versions respected
- Lint/format rules followed

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- TypeScript compiles without errors
- ESLint passes
- Prettier formatting correct
- No tooling violations
- Lockfiles unchanged (unless permitted)

---

## Violations

**HARD STOP violations:**
- Modifying lockfiles without permission
- Changing package.json versions without justification
- TypeScript compilation errors
- ESLint errors not fixed
- Prettier formatting violations

**Must fix before proceeding:**
- Missing tooling checks
- Incomplete lint fixes
- Missing format fixes
- Tooling configuration changes without permission

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** HIGH - Must be followed for every implementation

