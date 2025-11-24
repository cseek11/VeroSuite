# MODULE_NOT_FOUND Error - Troubleshooting Guide

**Date:** 2025-11-24  
**Issue:** MODULE_NOT_FOUND error when starting API server  
**Status:** Diagnostic Guide

---

## Common Causes & Solutions

### 1. Prisma Client Not Generated

**Symptom:** `Cannot find module '@prisma/client'` or missing Prisma types

**Solution:**
```powershell
cd libs/common/prisma
npx prisma generate
```

**Verify:**
```powershell
node -e "const { RuleDefinition } = require('@prisma/client'); console.log('✓ Available');"
```

---

### 2. Missing Dependencies

**Symptom:** `Cannot find module '...'` for any npm package

**Solution:**
```powershell
# From project root
npm install

# Or from apps/api
cd apps/api
npm install
```

---

### 3. TypeScript Build Cache

**Symptom:** Old types cached, new Prisma models not recognized

**Solution:**
```powershell
# Clear build cache
cd apps/api
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue

# Regenerate Prisma client
cd ../../libs/common/prisma
npx prisma generate

# Rebuild
cd ../../apps/api
npm run build
```

---

### 4. Missing Import in Module

**Symptom:** Service/Controller can't find a dependency

**Check:**
- `apps/api/src/compliance/compliance.module.ts` imports `CommonModule`
- `apps/api/src/compliance/compliance.service.ts` imports `DatabaseService` from `../common/services/database.service`
- `apps/api/src/common/common.module.ts` exports `DatabaseService`

**Verify CommonModule exports:**
```typescript
// apps/api/src/common/common.module.ts should have:
exports: [
  DatabaseService,
  // ... other services
]
```

---

### 5. Prisma Schema Not Synced

**Symptom:** Database has tables but Prisma client doesn't know about them

**Solution:**
```powershell
# Pull schema from database
cd libs/common/prisma
npx prisma db pull

# Generate client
npx prisma generate
```

---

## Quick Diagnostic Steps

### Step 1: Verify Prisma Client
```powershell
cd libs/common/prisma
npx prisma generate
```

### Step 2: Check Node Modules
```powershell
# From project root
if (-not (Test-Path "node_modules")) {
    npm install
}
```

### Step 3: Test Import
```powershell
cd apps/api
node -e "const { RuleDefinition, ComplianceCheck } = require('@prisma/client'); console.log('✓ Models available');"
```

### Step 4: Check TypeScript
```powershell
cd apps/api
npx tsc --noEmit
```

### Step 5: Try Starting Server
```powershell
cd apps/api
npm run start:dev
```

---

## Specific Error Messages

### "Cannot find module '@prisma/client'"
**Fix:** Run `npx prisma generate` in `libs/common/prisma`

### "Cannot find module '../common/services/database.service'"
**Fix:** Verify `apps/api/src/common/services/database.service.ts` exists

### "Cannot find module './dto/rule-definition.dto'"
**Fix:** Verify `apps/api/src/compliance/dto/rule-definition.dto.ts` exists

### "Property 'ruleDefinition' does not exist on type 'PrismaClient'"
**Fix:** Regenerate Prisma client after migration:
```powershell
cd libs/common/prisma
npx prisma generate
```

---

## Complete Reset (If Nothing Works)

```powershell
# 1. Clean build artifacts
cd apps/api
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# 2. Regenerate Prisma client
cd ../../libs/common/prisma
npx prisma generate

# 3. Reinstall dependencies (if needed)
cd ../..
npm install

# 4. Rebuild
cd apps/api
npm run build

# 5. Start server
npm run start:dev
```

---

## Verification Checklist

- [ ] Prisma client generated: `npx prisma generate`
- [ ] Node modules installed: `npm install`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Prisma models available: `RuleDefinition`, `ComplianceCheck` exist
- [ ] CommonModule exports DatabaseService
- [ ] ComplianceModule imports CommonModule
- [ ] All DTO files exist in `apps/api/src/compliance/dto/`

---

## Current Status

✅ **Prisma Client:** Generated and models available  
✅ **Node Modules:** Installed  
✅ **TypeScript:** Compiles (after fixes)  
✅ **Module Structure:** Correct

**If still getting MODULE_NOT_FOUND:**
1. Share the **exact error message** (which module is missing?)
2. Check the **full stack trace** from the error
3. Verify the **file path** in the error matches actual file location

---

**Last Updated:** 2025-11-24  
**Next Step:** Share the exact MODULE_NOT_FOUND error message for targeted fix

