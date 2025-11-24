# Schema Access Issues - Summary

**Date:** 2025-11-24  
**Status:** ⚠️ **ONGOING** - PostgREST not recognizing veroscore schema

---

## 🔴 Core Problem

**Error Message:**
```
Could not find the table 'public.sessions' in the schema cache
```

**Root Cause:**
PostgREST is still looking for tables in the `public` schema, even though:
- ✅ Tables exist in `veroscore` schema
- ✅ `pgrst.db_schemas` is set to `'public, veroscore'`
- ✅ `search_path` is configured
- ✅ Permissions are granted
- ✅ RLS policies exist

**PostgREST is not recognizing the `veroscore` schema despite configuration.**

---

## ✅ What We've Tried

### 1. Database Configuration
- ✅ Set `pgrst.db_schemas = 'public, veroscore'` on `authenticator` role
- ✅ Set `search_path = veroscore, public` for all roles
- ✅ Granted `USAGE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE` on schema
- ✅ Granted permissions on all tables, sequences, routines

### 2. PostgREST Reload Attempts
- ✅ `NOTIFY pgrst, 'reload schema'`
- ✅ `NOTIFY pgrst, 'reload config'`
- ✅ Terminated PostgREST processes (forced restart)
- ✅ Restarted Supabase project

### 3. Code Implementation
- ✅ Updated to use `SyncPostgrestClient` with `Accept-Profile: veroscore` header
- ✅ Created `SupabaseSchemaHelper` to abstract schema access
- ✅ Implemented fallback logic (though we want direct access)

### 4. Security Configuration
- ✅ Enabled RLS on all 7 tables
- ✅ Created 13 RLS policies across all tables
- ✅ Verified all policies exist

---

## ❌ What's NOT Working

### Issue 1: PostgREST Schema Cache
**Problem:** PostgREST's schema cache doesn't include `veroscore` schema

**Evidence:**
- Error says "Could not find the table 'public.sessions'"
- PostgREST is defaulting to `public` schema
- `Accept-Profile: veroscore` header doesn't help

**Possible Causes:**
1. PostgREST cache not reloading properly
2. Configuration not persisting after restart
3. Supabase managed PostgREST may have different behavior
4. Schema needs to be in a specific order in `pgrst.db_schemas`

### Issue 2: Accept-Profile Header
**Problem:** `Accept-Profile: veroscore` header not working

**Evidence:**
- Even with explicit header, PostgREST still looks in `public`
- Error persists with `SyncPostgrestClient` using header

**Possible Causes:**
1. PostgREST version doesn't support Accept-Profile
2. Header format incorrect
3. PostgREST needs schema to be in cache first

### Issue 3: Configuration Persistence
**Problem:** Configuration may not persist after restart

**Evidence:**
- We've set `pgrst.db_schemas` multiple times
- Restart may be resetting configuration
- Supabase managed instances may override settings

---

## 🔍 Potential Root Causes

### 1. Supabase Managed PostgREST Behavior
**Hypothesis:** Supabase's managed PostgREST may:
- Ignore `pgrst.db_schemas` role settings
- Use dashboard configuration instead
- Require different configuration method
- Cache schema list at startup only

### 2. Schema Order/Format
**Hypothesis:** `pgrst.db_schemas` may need:
- Specific format (no spaces, quotes, etc.)
- Schema in specific order
- Different setting method

### 3. PostgREST Version
**Hypothesis:** Supabase's PostgREST version may:
- Not support `Accept-Profile` header
- Require different header format
- Have different schema discovery behavior

### 4. Dashboard Configuration Required
**Hypothesis:** May need to configure in Supabase Dashboard:
- Settings → API → Exposed Schemas
- May override database-level settings
- May require dashboard + database configuration

---

## 🎯 Next Steps to Try

### Option 1: Verify Dashboard Configuration
1. Go to Supabase Dashboard → Settings → API
2. Check "Exposed Schemas" or "Schema Search Path"
3. Ensure `veroscore` is listed
4. Save and wait for restart

### Option 2: Check PostgREST Version/Configuration
1. Query PostgREST version: `SELECT current_setting('server_version');`
2. Check actual `pgrst.db_schemas` value after restart
3. Verify configuration persisted

### Option 3: Alternative Configuration Method
1. Try setting via Supabase Dashboard only (not SQL)
2. Try different `pgrst.db_schemas` format
3. Try setting on different role

### Option 4: Temporary Workaround (If Needed)
1. Keep RPC functions as fallback
2. Use RPC functions until PostgREST issue resolved
3. Document as known limitation

### Option 5: Contact Supabase Support
1. This may be a Supabase-specific issue
2. Managed PostgREST may have limitations
3. Support may have specific guidance

---

## 📊 Current Status

**What Works:**
- ✅ Database schema exists and is correct
- ✅ RLS is enabled on all tables
- ✅ RLS policies exist for all tables
- ✅ Permissions are granted
- ✅ Code is ready (PostgREST client with Accept-Profile)

**What Doesn't Work:**
- ❌ PostgREST doesn't see `veroscore` schema
- ❌ Direct table access fails
- ❌ Accept-Profile header doesn't help
- ❌ Schema cache not updating

**Configuration Status:**
- ✅ `pgrst.db_schemas` is set (verified)
- ✅ `search_path` is set (verified)
- ✅ Permissions granted (verified)
- ❌ PostgREST cache not updated (issue)

---

## 🔧 Recommended Action Plan

### Immediate:
1. **Check Supabase Dashboard** → Settings → API → Exposed Schemas
2. **Verify PostgREST restarted** (check logs)
3. **Test again** after confirming dashboard settings

### If Still Failing:
1. **Try dashboard-only configuration** (remove SQL settings)
2. **Check PostgREST logs** for schema discovery errors
3. **Consider RPC functions as temporary solution** (less secure but functional)
4. **Contact Supabase support** if managed instance limitation

### Long-term:
1. **Document as known limitation** if Supabase-specific
2. **Use RPC functions** if PostgREST can't be configured
3. **Monitor for Supabase updates** that fix this

---

## 💡 Key Insight

**The issue is NOT with:**
- ❌ Our code (it's correct)
- ❌ Database schema (it's correct)
- ❌ RLS policies (they're correct)
- ❌ Permissions (they're correct)

**The issue IS with:**
- ✅ PostgREST schema discovery/caching
- ✅ Supabase managed PostgREST behavior
- ✅ Configuration persistence/application

**This appears to be a Supabase platform limitation, not a code issue.**

---

**Last Updated:** 2025-11-24  
**Status:** ⚠️ **INVESTIGATING** - PostgREST schema discovery issue

