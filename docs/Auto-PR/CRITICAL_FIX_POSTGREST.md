# CRITICAL FIX: PostgREST Configuration

**Date:** 2025-11-24  
**Status:** ⚠️ **CRITICAL** - PostgREST Not Configured

---

## 🔍 Problem Identified

**Your Schema Permissions:** ✅ **CORRECT** (you showed me the output)
- Schema permissions are granted: `anon=U, authenticated=U, service_role=U`

**But PostgREST Still Failing:** ❌ **PostgREST Not Configured**
- Error: `Could not find the table 'public.sessions' in the schema cache`
- PostgREST is still only looking in `public` schema
- **Missing:** `pgrst.db_schemas` setting on `authenticator` role

---

## ✅ The Fix

**File:** `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/fix_postgrest_config.sql`

**What It Does:**
1. Sets `pgrst.db_schemas = 'public, veroscore'` on `authenticator` role
2. Notifies PostgREST to reload configuration
3. Verifies the setting is applied

**This is the MISSING PIECE!**

---

## 🚀 Steps to Fix

### Step 1: Run the Fix SQL

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `fix_postgrest_config.sql`
3. Paste and run
4. **Wait 10-30 seconds** for PostgREST to reload

### Step 2: Verify Configuration

Run this query to verify:

```sql
SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator'
  AND setconfig::text LIKE '%veroscore%';
```

**Expected:** Should return 1 row with `veroscore` in `setconfig`

### Step 3: Test

```bash
python .cursor/scripts/test_supabase_schema_access.py
```

**Expected:** ✅ All tests pass

---

## 🔒 Why This is Secure

After this fix:
- ✅ **RLS Still Enforced** - Database-level security maintained
- ✅ **Direct Table Access** - No RPC functions needed
- ✅ **Most Secure Approach** - RLS policies enforced automatically

---

## 📋 What Was Missing

**Schema Permissions:** ✅ Already correct (you verified this)
**Table Permissions:** ✅ Should be correct (from migration)
**PostgREST Configuration:** ❌ **THIS WAS MISSING**

PostgREST needs to be explicitly told which schemas to expose via:
```sql
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';
NOTIFY pgrst, 'reload config';
```

**This is the critical step!**

---

## ✅ After Fix

Once PostgREST is configured:
1. ✅ Direct table access will work
2. ✅ RLS policies will be enforced
3. ✅ Most secure approach active
4. ✅ Can remove RPC functions (optional)

---

**Last Updated:** 2025-11-24  
**Status:** ⚠️ **RUN FIX SCRIPT** - PostgREST configuration is the missing piece



