# Phase 2 - Supabase Schema Access Setup Required

**Date:** 2025-12-05  
**Status:** ⚠️ **ACTION REQUIRED** - RPC Functions Need to be Deployed

---

## 🔍 Issue Identified

**Problem:**
- Supabase Python client defaults to `public` schema
- VeroScore V3 tables are in `veroscore` schema
- Direct table access fails: `Could not find the table 'public.sessions' in the schema cache`

**Solution Implemented:**
- Created `SupabaseSchemaHelper` class that automatically detects schema access method
- Updated `SessionManager` to use schema helper
- Created RPC functions SQL file for Supabase deployment

---

## ✅ Code Changes Complete

### Files Updated:
1. ✅ `.cursor/scripts/veroscore_v3/supabase_schema_helper.py` - Schema access helper
2. ✅ `.cursor/scripts/veroscore_v3/session_manager.py` - Updated to use schema helper
3. ✅ `.cursor/scripts/veroscore_v3/threshold_checker.py` - Updated for RPC support
4. ✅ `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/rpc_functions.sql` - RPC functions

### Features:
- ✅ Automatic schema detection (direct access vs RPC)
- ✅ Fallback to RPC functions when direct access fails
- ✅ All session operations support both methods
- ✅ All changes queue operations support both methods

---

## ⚠️ Action Required: Deploy RPC Functions

### Step 1: Deploy RPC Functions to Supabase

**File:** `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/rpc_functions.sql`

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `rpc_functions.sql`
3. Paste into SQL Editor
4. Click "Run" to execute
5. Verify functions are created (check `veroscore` schema)

**Expected Functions:**
- `veroscore.insert_session`
- `veroscore.get_session`
- `veroscore.find_active_session`
- `veroscore.update_session_stats`
- `veroscore.insert_changes`
- `veroscore.get_pending_changes_count`

### Step 2: Alternative - Expose veroscore Schema (RECOMMENDED)

**If Supabase Dashboard supports schema exposure:**

1. Go to: Supabase Dashboard → Settings → API
2. Look for: "Exposed Schemas" or "Schema Search Path"
3. Add: `veroscore` to the list
4. Save configuration
5. Re-run tests

**Benefits:**
- Direct table access works
- No RPC functions needed
- Cleaner code path

---

## 🧪 Testing After Deployment

### Test 1: Verify RPC Functions

```sql
-- Test in Supabase SQL Editor
SELECT veroscore.insert_session(
    'test-session-123',
    'test-author',
    'test-branch',
    'active'
);
```

### Test 2: Run Python Test

```bash
# Set environment variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SECRET_KEY=your-secret-key

# Run test
python .cursor/scripts/test_supabase_schema_access.py
```

**Expected Result:**
- ✅ Schema helper detects RPC mode
- ✅ RPC functions are called successfully
- ✅ All tests pass

---

## 📋 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Code Implementation | ✅ Complete | Schema helper and SessionManager updated |
| RPC Functions SQL | ✅ Created | Ready to deploy |
| RPC Functions Deployed | ⏳ Pending | **ACTION REQUIRED** |
| Schema Exposure | ⏳ Pending | Check Supabase Dashboard |
| Tests Passing | ⏳ Pending | Waiting for RPC deployment |

---

## 🎯 Next Steps

1. **Deploy RPC Functions** (Required)
   - Run `rpc_functions.sql` in Supabase SQL Editor
   - Verify functions are created

2. **OR Configure Schema Exposure** (Recommended if available)
   - Add `veroscore` to exposed schemas in Supabase Dashboard
   - Re-run tests

3. **Re-run Tests**
   ```bash
   python .cursor/scripts/test_supabase_schema_access.py
   ```

4. **Verify Integration**
   - Test file watcher with real changes
   - Verify sessions are created in Supabase
   - Verify changes are queued correctly

---

## 📝 Implementation Notes

### Schema Helper Behavior

The `SupabaseSchemaHelper` class:
1. **First Use:** Tries direct table access
2. **If Fails:** Switches to RPC mode automatically
3. **Caches Decision:** Remembers mode for session lifetime
4. **Logs Actions:** All schema access attempts are logged

### RPC Function Naming

RPC functions are created in `veroscore` schema:
- `veroscore.insert_session` → Called as `insert_session` (Supabase auto-resolves schema)
- `veroscore.get_session` → Called as `get_session`
- etc.

**Note:** Supabase may require schema prefix in RPC calls. Test and adjust if needed.

---

## ✅ Phase 2 Status

**Implementation:** ✅ **COMPLETE**  
**Code Updates:** ✅ **COMPLETE**  
**RPC Functions:** ⏳ **PENDING DEPLOYMENT**  
**Tests:** ⏳ **PENDING** (waiting for RPC deployment)

**Overall:** ⚠️ **READY FOR DEPLOYMENT** - RPC functions need to be deployed to Supabase

---

**Last Updated:** 2025-12-05  
**Next Action:** Deploy RPC functions to Supabase or configure schema exposure



