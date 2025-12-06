# PostgREST Reload Issue - Troubleshooting

**Date:** 2025-12-05  
**Status:** ⚠️ Configuration Set But Not Active

---

## ✅ Configuration Verified

**PostgREST Config:** ✅ **CORRECT**
```json
{
  "rolname": "authenticator",
  "setconfig": [
    "pgrst.db_schemas=public, veroscore"  // ✅ Set correctly
  ]
}
```

**But Tests Still Failing:** ❌ PostgREST hasn't reloaded or needs restart

---

## 🔧 Troubleshooting Steps

### Step 1: Wait Longer

**PostgREST reload can take:**
- 30-60 seconds (normal)
- Up to 2 minutes (if busy)
- May require project restart

**Action:** Wait 1-2 minutes and test again

### Step 2: Force Reload

**File:** `force_postgrest_reload.sql`

Run this to:
- Send NOTIFY again
- Verify PostgREST is listening
- Check configuration is still set

### Step 3: Restart Supabase Project

**If available in Dashboard:**
1. Go to: Settings → API
2. Look for: "Restart API" or "Reload Configuration"
3. Click to restart PostgREST

**OR:**
- Restart entire Supabase project
- This forces PostgREST to reload

### Step 4: Check PostgREST Logs

**In Supabase Dashboard:**
1. Go to: Logs → PostgREST
2. Look for:
   - "Reloading configuration"
   - "Schema cache updated"
   - Any errors about veroscore schema

### Step 5: Verify Tables Exist

```sql
-- Check tables exist in veroscore schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'veroscore'
ORDER BY table_name;

-- Should return: sessions, changes_queue, pr_scores, etc.
```

---

## 🔍 Alternative: Python Client Issue

**Possibility:** Supabase Python client may not support schema-qualified table names

**Test:** Try accessing with explicit schema (if supported):

```python
# This might not work, but worth trying
result = supabase.schema("veroscore").table("sessions").select("*").execute()
```

**If not supported:** We may need to keep RPC functions as workaround

---

## ⚠️ Current Status

**Configuration:** ✅ Set correctly  
**PostgREST Reload:** ⏳ Waiting or needs restart  
**Direct Access:** ❌ Not working yet  
**RPC Functions:** ✅ Still working as fallback

---

## 🎯 Next Steps

1. **Wait 1-2 minutes** and test again
2. **Try restarting** Supabase project
3. **Check PostgREST logs** for errors
4. **If still failing:** May need to keep RPC functions (less secure but functional)

---

**Last Updated:** 2025-12-05  
**Status:** ⏳ Waiting for PostgREST to reload or investigating Python client limitations



