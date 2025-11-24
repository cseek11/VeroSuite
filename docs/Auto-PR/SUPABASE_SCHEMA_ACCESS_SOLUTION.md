# Supabase Schema Access Solution

**Created:** 2025-11-24  
**Last Updated:** 2025-11-24  
**Issue:** Supabase Python client looks for tables in `public` schema, but VeroScore tables are in `veroscore` schema

---

## 🔍 Problem Identified

**Error:**
```
Could not find the table 'public.sessions' in the schema cache
```

**Root Cause:**
- Supabase Python client (`supabase-py`) defaults to `public` schema
- VeroScore V3 tables are in `veroscore` schema
- Client doesn't automatically search other schemas

---

## ✅ Solution Options

### Option 1: Configure Supabase API to Expose veroscore Schema (RECOMMENDED)

**Best for:** Production use, clean API access

**Steps:**
1. Go to Supabase Dashboard → Settings → API
2. Find "Exposed Schemas" or "Schema Search Path"
3. Add `veroscore` to the list of exposed schemas
4. Save configuration
5. Supabase client will now find tables in `veroscore` schema

**After Configuration:**
```python
# This will work after schema is exposed
result = supabase.table("sessions").select("*").execute()
```

---

### Option 2: Use RPC Functions (WORKAROUND)

**Best for:** Immediate solution, no dashboard changes needed

**Implementation:**
Create RPC functions in Supabase that wrap schema-qualified queries:

```sql
-- Create helper RPC function
CREATE OR REPLACE FUNCTION veroscore.get_sessions()
RETURNS TABLE (
    id UUID,
    session_id TEXT,
    author TEXT,
    -- ... other columns
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM veroscore.sessions;
END;
$$;
```

**Usage:**
```python
# Use RPC function instead of direct table access
result = supabase.rpc("get_sessions").execute()
```

**Pros:**
- Works immediately
- No dashboard configuration needed
- Can add custom logic

**Cons:**
- Requires creating RPC functions for each operation
- More complex than direct table access

---

### Option 3: Use PostgREST Client Directly (ADVANCED)

**Best for:** Full control over schema access

**Implementation:**
```python
from postgrest import PostgrestClient

# Create PostgREST client with schema header
client = PostgrestClient(
    base_url=f"{supabase_url}/rest/v1",
    headers={
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Accept-Profile": "veroscore"  # Specify schema
    }
)

# Query with schema
result = client.from_("sessions").select("*").execute()
```

**Note:** This may require additional PostgREST configuration.

---

### Option 4: Move Tables to Public Schema (NOT RECOMMENDED)

**Why Not:**
- Breaks namespace isolation
- Conflicts with existing `public` schema tables
- Goes against architecture decision

---

## 🎯 Recommended Approach

### Immediate: Use RPC Functions

Create RPC wrapper functions for common operations:

```sql
-- Helper function to insert session
CREATE OR REPLACE FUNCTION veroscore.insert_session(
    p_session_id TEXT,
    p_author TEXT,
    p_branch_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO veroscore.sessions (session_id, author, branch_name, status)
    VALUES (p_session_id, p_author, p_branch_name, 'active')
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

-- Helper function to get session
CREATE OR REPLACE FUNCTION veroscore.get_session(p_session_id TEXT)
RETURNS TABLE (
    id UUID,
    session_id TEXT,
    author TEXT,
    -- ... all columns
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM veroscore.sessions
    WHERE veroscore.sessions.session_id = p_session_id;
END;
$$;
```

### Long-term: Configure Supabase API

1. Expose `veroscore` schema in Supabase Dashboard
2. Update code to use direct table access
3. Remove RPC wrapper functions (optional)

---

## 🔧 Implementation Steps

### Step 1: Create RPC Functions

Run this SQL in Supabase SQL Editor:

```sql
-- Insert session RPC
CREATE OR REPLACE FUNCTION veroscore.insert_session(
    p_session_id TEXT,
    p_author TEXT,
    p_branch_name TEXT DEFAULT NULL,
    p_status TEXT DEFAULT 'active'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO veroscore.sessions (
        session_id, author, branch_name, status,
        total_files, total_lines_added, total_lines_removed,
        prs, config, metadata
    )
    VALUES (
        p_session_id, p_author, p_branch_name, p_status,
        0, 0, 0, '[]'::JSONB, '{}'::JSONB, '{}'::JSONB
    )
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

-- Get session RPC
CREATE OR REPLACE FUNCTION veroscore.get_session(p_session_id TEXT)
RETURNS SETOF veroscore.sessions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM veroscore.sessions
    WHERE veroscore.sessions.session_id = p_session_id;
END;
$$;

-- Insert changes queue RPC
CREATE OR REPLACE FUNCTION veroscore.insert_changes(
    p_session_id TEXT,
    p_changes JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    INSERT INTO veroscore.changes_queue (
        session_id, file_path, change_type, old_path,
        lines_added, lines_removed, commit_hash, processed, metadata
    )
    SELECT
        p_session_id,
        (change->>'path')::TEXT,
        (change->>'change_type')::TEXT,
        (change->>'old_path')::TEXT,
        COALESCE((change->>'lines_added')::INTEGER, 0),
        COALESCE((change->>'lines_removed')::INTEGER, 0),
        (change->>'commit_hash')::TEXT,
        FALSE,
        COALESCE((change->>'metadata')::JSONB, '{}'::JSONB)
    FROM jsonb_array_elements(p_changes) AS change;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;
```

### Step 2: Update SessionManager

Update `SessionManager` to use RPC functions instead of direct table access.

---

## 📝 Alternative: Check Supabase Dashboard Configuration

**Supabase may support schema configuration:**

1. **Go to:** Supabase Dashboard → Settings → API
2. **Look for:** "Exposed Schemas" or "Schema Search Path"
3. **Add:** `veroscore` to the list
4. **Save** and test again

**If this option exists, it's the cleanest solution.**

---

## ⚠️ Current Status

**Test Results:**
- ❌ Direct table access fails (looking in `public` schema)
- ⏳ RPC functions not yet created
- ⏳ Schema exposure not yet configured

**Action Required:**
1. Choose solution approach (RPC functions or schema exposure)
2. Implement chosen solution
3. Update SessionManager code
4. Re-run tests

---

**Last Updated:** 2025-11-24  
**Status:** ⚠️ Solution Required - Schema Access Issue Identified

