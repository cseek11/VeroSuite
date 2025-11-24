# Schema Exposure Troubleshooting

**Date:** 2025-11-24  
**Issue:** Schema exposure configured but direct access still failing

---

## 🔍 Current Status

**Configuration:** ✅ Schema added to exposed schemas  
**Test Result:** ❌ Direct access still failing  
**Error:** `Could not find the table 'public.sessions' in the schema cache`

---

## ⚠️ Important: Keep RPC Functions for Now

**DO NOT remove RPC functions yet** until schema exposure is confirmed working.

The test failure suggests:
1. Schema exposure may need time to propagate
2. Configuration may need verification
3. Supabase API may need to be restarted

---

## 🔧 Troubleshooting Steps

### Step 1: Verify Schema Exposure Configuration

1. **Check Supabase Dashboard:**
   - Go to: Settings → API
   - Look for: "Exposed Schemas" or "Schema Search Path"
   - Verify: `veroscore` is in the list
   - Save if needed

2. **Check API Settings:**
   - Look for: "Extra Search Path" or "Schema Cache"
   - May need to add: `veroscore` to search path
   - May need to: Restart API or clear cache

### Step 2: Wait for Propagation

**Schema exposure changes may take:**
- A few minutes to propagate
- API restart may be required
- Cache may need to clear

**Action:** Wait 5-10 minutes and test again.

### Step 3: Verify in Supabase SQL Editor

```sql
-- Check if schema exists
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'veroscore';

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'veroscore';

-- Should return: sessions, changes_queue, pr_scores, etc.
```

### Step 4: Test Direct Access via SQL

```sql
-- Test if you can query directly
SELECT COUNT(*) FROM veroscore.sessions;

-- If this works, schema exists but API may not see it
```

---

## 📋 Decision Tree

### If Schema Exposure Works (After Troubleshooting)

✅ **Remove RPC Functions:**
- Run: `drop_rpc_functions.sql`
- Code will use direct table access
- Most secure approach

### If Schema Exposure Doesn't Work

⚠️ **Keep RPC Functions:**
- Keep `rpc_functions.sql` deployed
- Code will use RPC functions automatically
- Less secure but functional

---

## 🔄 Current Recommendation

**Status:** ⏳ **WAIT AND VERIFY**

1. **Keep RPC functions deployed** (they're working)
2. **Verify schema exposure configuration** in Supabase Dashboard
3. **Wait 5-10 minutes** for propagation
4. **Re-run test:** `python .cursor/scripts/test_supabase_schema_access.py`
5. **If test passes:** Remove RPC functions
6. **If test still fails:** Keep RPC functions and investigate further

---

## ✅ Code Behavior

**Current State:**
- `SupabaseSchemaHelper` will detect direct access fails
- Automatically falls back to RPC functions
- **System works either way**

**After Schema Exposure Works:**
- `SupabaseSchemaHelper` will detect direct access works
- Uses direct table access (more secure)
- RPC functions can be removed

---

## 🎯 Next Steps

1. **Verify** schema exposure configuration in Supabase Dashboard
2. **Wait** 5-10 minutes for propagation
3. **Re-test** with `test_supabase_schema_access.py`
4. **If working:** Remove RPC functions using `drop_rpc_functions.sql`
5. **If not working:** Keep RPC functions and investigate Supabase configuration

---

**Last Updated:** 2025-11-24  
**Status:** ⏳ Waiting for schema exposure to propagate

