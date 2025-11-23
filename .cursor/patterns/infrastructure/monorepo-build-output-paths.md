# Monorepo Build Output Path Handling Pattern

**Pattern ID:** `infrastructure/monorepo-build-output-paths`  
**Domain:** Infrastructure  
**Complexity:** Simple  
**Source PR:** Phase 2 Backend Migration  
**Created:** 2025-11-22  
**Status:** ✅ Approved

---

## WHEN

Use this pattern when:
- Building NestJS applications in a monorepo structure
- TypeScript compiler preserves directory structure in output
- Start scripts need to match actual build output paths

**Problem:** Build output path doesn't match start script path, causing "Cannot find module" errors.

---

## DO

1. **Check actual build output location:**
   ```bash
   # After building, check where files are output
   ls -R dist/
   ```

2. **Update start scripts to match build output:**
   ```json
   {
     "scripts": {
       "start": "node dist/apps/api/src/main.js",
       "start:prod": "node dist/apps/api/src/main.js"
     }
   }
   ```

3. **Verify build output structure:**
   ```
   dist/
     apps/
       api/
         src/
           main.js  ← Entry point
   ```

---

## WHY

**Principle:** Start scripts must match actual build output paths.

**Root Cause:** TypeScript compiler preserves monorepo directory structure when compiling from workspace root.

**Benefits:**
- ✅ Start scripts work correctly
- ✅ No "Cannot find module" errors
- ✅ Consistent with monorepo structure

**Anti-Pattern (Don't Do This):**
```json
{
  "scripts": {
    "start": "node dist/main.js" // ❌ Wrong path in monorepo
  }
}
```

---

## EXAMPLE

**File:** `apps/api/package.json`  
**Lines:** 8, 11  
**Context:** Start script paths updated to match monorepo build output

**Before:**
```json
{
  "scripts": {
    "start": "node dist/main"
  }
}
```

**After:**
```json
{
  "scripts": {
    "start": "node dist/apps/api/src/main.js"
  }
}
```

---

## METADATA

- **domain:** infrastructure
- **complexity:** simple
- **source_pr:** Phase 2 Backend Migration
- **created_at:** 2025-11-22
- **author:** AI Agent
- **related_patterns:**
  - `infrastructure/monorepo-structure`
  - `backend/build-configuration`

---

## TESTING

Always verify:
1. Build completes successfully
2. Build output exists at expected path
3. Start script can find entry point
4. Server starts without "Cannot find module" errors

**Verification:**
```bash
npm run build
test -f dist/apps/api/src/main.js && echo "✅ Build output exists"
npm start  # Should start without errors
```

---

**Last Updated:** 2025-11-22



