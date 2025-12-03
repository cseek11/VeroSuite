# Schema Exposure Fix - Secure Configuration

**Date:** 2025-11-24  
**Status:** ✅ **SOLUTION IDENTIFIED** - Database-Level Configuration Required

---

## 🔍 Root Cause Identified

**Problem:**
- Adding schema to "Exposed Schemas" in Dashboard may not be enough
- PostgREST requires **database-level configuration** via `pgrst.db_schemas`
- Permissions must be granted at the schema level
- PostgREST must be notified to reload configuration

**Why It Was Failing:**
- Dashboard setting may not update `pgrst.db_schemas` automatically
- PostgREST needs explicit notification to reload
- Schema permissions may not be granted

---

## ✅ Secure Solution

### Step 1: Run Configuration SQL

**File:** `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/configure_schema_exposure.sql`

**What It Does:**
1. ✅ Sets `pgrst.db_schemas = 'public, veroscore'` on `authenticator` role
2. ✅ Grants schema permissions to Supabase roles
3. ✅ Notifies PostgREST to reload configuration
4. ✅ Verifies RLS is enabled (security check)
5. ✅ Verifies configuration is correct

**Security:**
- ✅ **RLS Still Enforced** - Database-level security maintained
- ✅ **No Elevated Privileges** - Normal database role
- ✅ **Most Secure Approach** - Direct access with RLS

### Step 2: Wait for PostgREST Reload

**Time Required:** 10-30 seconds

PostgREST needs time to:
- Reload configuration
- Update schema cache
- Apply new permissions

### Step 3: Test Direct Access

```bash
python .cursor/scripts/test_supabase_schema_access.py
```

**Expected Result:**
- ✅ Direct table access works
- ✅ All tests pass
- ✅ RLS policies enforced

### Step 4: Remove RPC Functions (Optional)

Once direct access is confirmed working:

**File:** `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/drop_rpc_functions.sql`

**Why Remove:**
- RPC functions are no longer needed
- Direct access is more secure (RLS enforced)
- Cleaner codebase

---

## 🔒 Security Verification

### RLS Enforcement Check

After running the configuration script, verify RLS is enabled:

```sql
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.nspname = t.schemaname
WHERE schemaname = 'veroscore';
```

**All tables should show `rls_enabled = true`**

### Configuration Verification

```sql
-- Check exposed schemas
SELECT setconfig
FROM pg_db_role_setting
WHERE setrole = (SELECT oid FROM pg_roles WHERE rolname = 'authenticator');
```

**Should include `veroscore` in the list**

---

## 📋 Complete Setup Checklist

- [ ] Run `configure_schema_exposure.sql` in Supabase SQL Editor
- [ ] Wait 10-30 seconds for PostgREST reload
- [ ] Verify RLS is enabled on all tables
- [ ] Verify configuration (exposed schemas check)
- [ ] Run test: `python .cursor/scripts/test_supabase_schema_access.py`
- [ ] Confirm all tests pass
- [ ] (Optional) Remove RPC functions using `drop_rpc_functions.sql`

---

## 🎯 Why This is Most Secure

1. ✅ **RLS Enforced** - Database-level security cannot be bypassed
2. ✅ **No Elevated Privileges** - Client uses normal database role
3. ✅ **Defense in Depth** - Multiple security layers
4. ✅ **Compliance** - Meets all Cursor security rules (R01, R02)
5. ✅ **Auditable** - Policies are declarative and visible

**This is the MOST SECURE approach!**

---

## ⚠️ Important Notes

### If Configuration Still Fails

1. **Check PostgREST Logs:**
   - Supabase Dashboard → Logs → PostgREST
   - Look for schema-related errors

2. **Verify Database Connection:**
   - Ensure you're connected to the correct database
   - Check that `veroscore` schema exists

3. **Manual Reload:**
   - May need to restart Supabase project
   - Or wait longer for configuration to propagate

### Alternative: Keep RPC Functions

If configuration still doesn't work:
- Keep RPC functions deployed
- Code will use RPC functions automatically
- Less secure but functional
- Can revisit later

---

## ✅ Expected Outcome

After running `configure_schema_exposure.sql`:

1. ✅ PostgREST knows about `veroscore` schema
2. ✅ Permissions are granted correctly
3. ✅ Direct table access works
4. ✅ RLS policies are enforced
5. ✅ Most secure approach is active

**This is the secure solution you want!**

---

**Last Updated:** 2025-11-30  
**Status:** ✅ **SOLUTION READY** - Run configuration SQL to enable secure direct access



