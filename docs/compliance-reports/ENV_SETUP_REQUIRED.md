# Environment Variables Setup Required

**Date:** 2025-11-22  
**Issue:** API server requires environment variables to start

## Problem

The API server failed to start with error:
```
Error: JWT_SECRET environment variable is required
```

## Root Cause

The API requires environment variables to be configured in `apps/api/.env`:
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `JWT_SECRET`
- `DATABASE_URL`

## Solution

✅ **Created setup guide:** `apps/api/README_ENV_SETUP.md`  
✅ **Copied env.example:** `apps/api/env.example` (from `backend/env.example`)  
✅ **Fixed error message:** Updated path reference from `backend/env.example` to `apps/api/env.example`

## Required Actions

**To start the API, you must:**

1. **Create `.env` file:**
   ```bash
   cd apps/api
   cp env.example .env
   ```

2. **Edit `.env` file:**
   - Replace placeholder values with your actual:
     - Supabase URL and keys
     - JWT secret (generate with: `openssl rand -hex 64`)
     - Database connection string

3. **Start the API:**
   ```bash
   npm run start:dev
   ```

## Security

⚠️ **Important:**
- `.env` files are in `.gitignore` (already configured)
- **Never commit `.env` files**
- Use different secrets for dev/staging/production
- See `apps/api/README_ENV_SETUP.md` for complete guide

## Files Changed

- ✅ `apps/api/env.example` - Copied from `backend/env.example`
- ✅ `apps/api/README_ENV_SETUP.md` - Complete setup guide
- ✅ `apps/api/src/common/utils/env-validation.ts` - Fixed path reference

---

**Last Updated:** 2025-11-22








