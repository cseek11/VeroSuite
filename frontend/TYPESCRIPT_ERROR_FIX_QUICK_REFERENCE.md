# TypeScript Error Fix - Quick Reference Guide

**Created:** 2025-11-22  
**Purpose:** Quick reference for common TypeScript error fixes and verification commands

---

## Common Fix Patterns

### 1. Unused Variables/Imports

**Error:** `'variable' is declared but its value is never read`

**Fix Pattern 1: Remove if truly unused**
```typescript
// BEFORE:
import { unusedFunction } from './utils';
const unusedVar = 42;

// AFTER:
// Remove unused import and variable
```

**Fix Pattern 2: Prefix with `_` if required by API**
```typescript
// BEFORE:
const handleClick = (event: React.MouseEvent) => {
  // event not used
};

// AFTER:
const handleClick = (_event: React.MouseEvent) => {
  // _event indicates intentionally unused
};
```

**Fix Pattern 3: Use in function body (if needed)**
```typescript
// BEFORE:
const processData = (data: DataType) => {
  return transform(data);
};

// AFTER (if variable should be used):
const processData = (data: DataType) => {
  // Actually use the variable if it's needed
  logger.debug('Processing data', { data });
  return transform(data);
};

// NOTE: Prefer removing unused variables or prefixing with _ over adding unnecessary code
```

---

### 2. Implicit Any Types

**Error:** `Parameter 'x' implicitly has an 'any' type`

**Fix Pattern 1: Add explicit type**
```typescript
// BEFORE:
const filter = (item) => item.id === id;

// AFTER:
const filter = (item: Item) => item.id === id;
```

**Fix Pattern 2: Type from context**
```typescript
// BEFORE:
items.map((item) => item.name);

// AFTER:
items.map((item: Item) => item.name);
```

**Fix Pattern 3: Generic types**
```typescript
// BEFORE:
const process = (data) => { ... };

// AFTER:
const process = <T>(data: T): T => { ... };
```

---

### 3. Property Access Errors

**Error:** `Object is possibly 'null' or 'undefined'`

**Fix Pattern 1: Optional chaining**
```typescript
// BEFORE:
const name = customer.name;

// AFTER:
const name = customer?.name;
```

**Fix Pattern 2: Nullish coalescing**
```typescript
// BEFORE:
const name = customer.name;

// AFTER:
const name = customer?.name ?? 'Unknown';
```

**Fix Pattern 3: Type guard**
```typescript
// BEFORE:
if (data.items.length > 0) { ... }

// AFTER:
if (data?.items?.length > 0) { ... }
```

**Fix Pattern 4: Non-null assertion (use sparingly)**
```typescript
// BEFORE:
const name = customer.name;

// AFTER:
const name = customer!.name; // Only if you're certain it's not null
```

---

### 4. Type Mismatches

**Error:** `Type 'X' is not assignable to type 'Y'`

**Fix Pattern 1: Fix source type (preferred)**
```typescript
// BEFORE:
const customers: Account[] = data; // data is Customer[]

// AFTER:
const customers: Customer[] = data;
```

**Fix Pattern 2: Type assertion (when necessary)**
```typescript
// BEFORE:
const customers: Account[] = data;

// AFTER:
const customers: Account[] = data as Account[];
```

**Fix Pattern 3: Type narrowing**
```typescript
// BEFORE:
function process(data: string | number) {
  return data.toUpperCase(); // Error
}

// AFTER:
function process(data: string | number) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return String(data);
}
```

---

### 5. Optional Property Errors

**Error:** `Property 'x' does not exist on type 'Y'`

**Fix Pattern 1: Add optional marker**
```typescript
// BEFORE:
interface Props {
  title: string;
  subtitle: string;
}

// AFTER:
interface Props {
  title: string;
  subtitle?: string; // Optional
}
```

**Fix Pattern 2: Default value**
```typescript
// BEFORE:
const Component = ({ title, subtitle }: Props) => {
  return <div>{subtitle}</div>; // Error if subtitle missing
};

// AFTER:
const Component = ({ title, subtitle = 'Default' }: Props) => {
  return <div>{subtitle}</div>;
};
```

**Fix Pattern 3: Conditional rendering**
```typescript
// BEFORE:
return <div>{props.subtitle}</div>;

// AFTER:
return <div>{props.subtitle && <span>{props.subtitle}</span>}</div>;
```

---

### 6. Syntax Errors

**Error:** `JSX expressions must have one parent element`

**Fix Pattern 1: Remove extra fragment**
```typescript
// BEFORE:
return (
  <>
    <Component />
  </>
);

// AFTER:
return <Component />;
```

**Fix Pattern 2: Fix missing/extra parentheses**
```typescript
// BEFORE (extra parentheses):
return (
  (<Component />)
);

// AFTER:
return <Component />;

// BEFORE (missing closing):
return (
  <div>
    <Component />

// AFTER:
return (
  <div>
    <Component />
  </div>
);
```

**Fix Pattern 3: Fix duplicate imports**
```typescript
// BEFORE:
import { Component } from './Component';
import { Component } from './Component'; // Duplicate

// AFTER:
import { Component } from './Component';
```

---

### 7. Export Conflicts

**Error:** `Duplicate identifier 'X'`

**Fix Pattern 1: Merge interfaces**
```typescript
// BEFORE:
export interface PaymentMethod { id: string; }
export interface PaymentMethod { type: string; } // Duplicate

// AFTER:
export interface PaymentMethod {
  id: string;
  type: string;
}
```

**Fix Pattern 2: Namespace exports**
```typescript
// BEFORE:
export const Utils = { ... };
export const Utils = { ... }; // Duplicate

// AFTER:
export namespace Utils {
  export const helper1 = ...;
  export const helper2 = ...;
}
```

**Fix Pattern 3: Remove duplicate**
```typescript
// BEFORE:
export { Component } from './Component';
export { Component } from './Component'; // Duplicate

// AFTER:
export { Component } from './Component';
```

---

## Verification Commands

### Type Checking

**Full type check:**
```bash
npm run typecheck
```

**Type check with output to file:**
```bash
npm run typecheck > errors.txt 2>&1
```

**Count errors:**
```bash
npm run typecheck 2>&1 | grep "error TS" | wc -l
```

**List error files:**
```bash
npm run typecheck 2>&1 | grep "error TS" | cut -d'(' -f2 | cut -d')' -f1 | sort | uniq
```

---

### ESLint Auto-Fix

**Run auto-fix on all files:**
```bash
npx eslint --fix --config eslint-fix.config.mjs "src/**/*.{ts,tsx}"
```

**Run auto-fix on specific file:**
```bash
npx eslint --fix --config eslint-fix.config.mjs "src/components/MyComponent.tsx"
```

**Check what would be fixed (dry run):**
```bash
npx eslint --fix-dry-run --config .eslintrc-fix.json "src/**/*.{ts,tsx}"
```

---

### Build Verification

**Build project:**
```bash
npm run build
```

**Build with verbose output:**
```bash
npm run build -- --verbose
```

**Check build output:**
```bash
ls -la dist/
```

---

### Test Verification

**Run all tests:**
```bash
npm run test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run E2E tests:**
```bash
npm run test:e2e
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

---

### Error Analysis

**Analyze errors by category:**
```bash
npm run typecheck 2>&1 | grep "implicitly has an 'any' type" | wc -l
npm run typecheck 2>&1 | grep "is possibly 'null'" | wc -l
npm run typecheck 2>&1 | grep "is not assignable" | wc -l
```

**Find files with most errors:**
```bash
npm run typecheck 2>&1 | grep "error TS" | cut -d'(' -f2 | cut -d')' -f1 | sort | uniq -c | sort -rn | head -20
```

**Use analysis script:**
```bash
ts-node scripts/analyze-ts-errors.ts errors.txt
```

---

## Progress Checklist

### Phase 1: Critical Blockers (Days 1-2)
- [ ] Setup tooling complete
- [ ] Unused variables fixed (~750 errors)
- [ ] Syntax errors fixed (~75 errors)
- [ ] Export conflicts fixed (~130 errors)
- [ ] Verification: `npm run typecheck` shows ~955 fewer errors

### Phase 2: Type Safety Foundation (Days 3-4)
- [ ] Implicit any types fixed (~500 errors)
- [ ] Property access errors fixed (~380 errors)
- [ ] Verification: `npm run typecheck` shows ~880 fewer errors

### Phase 3: Type System Alignment (Days 5-6)
- [ ] Type mismatches fixed (~630 errors)
- [ ] Optional property errors fixed (~50 errors)
- [ ] Verification: `npm run typecheck` shows ~680 fewer errors

### Phase 4: Testing Infrastructure (Day 7)
- [ ] Test file fixes complete (~100 errors)
- [ ] All tests passing
- [ ] Verification: `npm run test` passes

### Phase 5: High-Error File Cleanup (Days 8-9)
- [ ] Critical files fixed (~300 errors)
- [ ] Verification: `npm run typecheck` shows ~300 fewer errors

### Phase 6: Remaining Errors (Day 10)
- [ ] Remaining errors fixed (~200 errors)
- [ ] Final verification: 0 errors
- [ ] Build successful: `npm run build`

### Phase 7: Documentation (Days 11-12)
- [ ] Documentation updated
- [ ] Final cleanup complete
- [ ] Code review approved

---

## Quick Fix Commands

### Fix Unused Variables (Batch)
```bash
# Run ESLint auto-fix
npx eslint --fix --config eslint-fix.config.mjs "src/**/*.{ts,tsx}"

# Verify
npm run typecheck
```

### Fix Syntax Errors
```bash
# Find syntax errors
npm run typecheck 2>&1 | grep "syntax error"

# Fix manually or with ESLint
npx eslint --fix "src/**/*.{ts,tsx}"
```

### Fix Type Errors in Specific File
```bash
# Check file
npm run typecheck 2>&1 | grep "MyComponent.tsx"

# Fix and verify
# (Fix manually, then verify)
npm run typecheck
```

---

## Troubleshooting

### Build Fails After Fixes

**Check for:**
1. Missing imports
2. Broken type references
3. Circular dependencies
4. Syntax errors

**Fix:**
```bash
# Clear cache
rm -rf node_modules/.cache
rm -rf dist

# Reinstall
npm install

# Rebuild
npm run build
```

### Tests Fail After Fixes

**Check for:**
1. Mock type mismatches
2. Test data type issues
3. Component prop changes

**Fix:**
```bash
# Run tests with verbose output
npm run test -- --verbose

# Fix test files
# (Update mocks and test data)
```

### Type Errors Persist

**Check for:**
1. Type definition files
2. Third-party library types
3. Global type declarations

**Fix:**
```bash
# Check type definitions
ls -la src/types/
ls -la src/*.d.ts

# Update type definitions if needed
```

---

## Best Practices

### 1. Always Verify After Fixes
```bash
npm run typecheck
npm run build
npm run test
```

### 2. Commit After Each Phase
```bash
git add .
git commit -m "Phase X: Fix [category] errors"
```

### 3. Test Incrementally
- Fix a few files
- Verify
- Commit
- Continue

### 4. Document Edge Cases
- Note any unusual fixes
- Document workarounds
- Update this guide

### 5. Maintain Code Quality
- Follow existing patterns
- Don't introduce new errors
- Keep code readable

---

## Resources

### TypeScript Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript React Patterns](https://react-typescript-cheatsheet.netlify.app/)

### Project Documentation
- `frontend/TYPESCRIPT_ERROR_FIX_PLAN.md` - Detailed plan
- `frontend/docs/TS_CLEANUP_PROGRESS.md` - Progress tracker
- `frontend/docs/TS_ERROR_FIXES_LOG.md` - Fix log

### Tools
- `scripts/analyze-ts-errors.ts` - Error analysis
- `eslint-fix.config.mjs` - ESLint config
- `scripts/fix-unused-batch.sh` - Batch fixes

---

**Last Updated:** 2025-11-22  
**Quick Reference Version:** 1.0

