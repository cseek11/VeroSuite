# API Start Script Fix

**Date:** 2025-11-22  
**Issue:** API server failed to start - incorrect path in start script

## Problem

```
Error: Cannot find module 'C:\Users\ashse\Documents\VeroField\Training\VeroSuite\apps\api\dist\main'
```

**Root Cause:** The build output is in `dist/apps/api/src/main.js` (preserving monorepo structure), but the start script was looking for `dist/main.js`.

## Solution

✅ **Updated start script paths:**
- Changed from: `node dist/main`
- Changed to: `node dist/apps/api/src/main.js`

**Files Updated:**
- `apps/api/package.json` - Updated `start` and `start:prod` scripts

## Build Output Structure

The NestJS build preserves the monorepo directory structure:
```
dist/
  apps/
    api/
      src/
        main.js  ← Entry point
```

This is because TypeScript compiles from the workspace root, preserving the full path.

## Verification

✅ **Start script updated**  
✅ **Path matches build output**  
✅ **Ready to test**

## To Start API

```bash
cd apps/api
npm run db:generate  # Generate Prisma client first
npm run build       # Build application
npm start           # Start server (uses dist/apps/api/src/main.js)
```

Or use development mode:
```bash
npm run start:dev   # Watches for changes, auto-rebuilds
```

---

**Last Updated:** 2025-11-22






