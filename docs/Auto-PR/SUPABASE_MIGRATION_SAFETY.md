# Supabase Migration Safety Guide

**Created:** 2025-12-05  
**Last Updated:** 2025-12-05  
**Status:** ⚠️ **REVIEW REQUIRED BEFORE RUNNING**

---

## ⚠️ Safety Assessment

The migration file is **mostly safe** but has **2 potential issues** that need attention:

### ✅ Safe Parts

1. **Schema Creation** - Uses `IF NOT EXISTS` ✅
2. **Extensions** - Uses `IF NOT EXISTS` ✅
3. **Tables** - Uses `IF NOT EXISTS` ✅
4. **Indexes** - Uses `IF NOT EXISTS` ✅
5. **Functions** - Uses `CREATE OR REPLACE` ✅
6. **Triggers** - Drops before creating ✅
7. **Views** - Uses `CREATE OR REPLACE` ✅

### ⚠️ Potential Issues

#### Issue 1: pg_cron Extension (Lines 313-346)

**Problem:**
- `pg_cron` extension is **only available on Supabase Pro/Enterprise plans**
- **Free tier does NOT have pg_cron**
- The `DO $$` block will fail if `pg_cron` is not available

**Impact:**
- Migration will fail at the cron scheduling section
- All tables/functions created before this point will remain
- Need to manually skip or comment out this section

**Solution:**
- Wrap in error handling, OR
- Comment out for Free tier, OR
- Check if extension exists first

#### Issue 2: RLS Policy Syntax (Lines 365-388)

**Problem:**
- Uses `current_setting('request.jwt.claims', true)::json->>'role'` 
- Also uses `current_setting('app.service_role', true)` which may not work in Supabase
- Supabase typically uses `auth.role()` or `auth.uid()` functions

**Impact:**
- Policies may not work correctly
- Service role access might be blocked
- Need to use Supabase-specific auth functions

**Solution:**
- Use `auth.role() = 'service_role'` for service role check
- Use `auth.uid()` for user identification
- Or use `auth.jwt() ->> 'role'` for JWT claims

---

## 🔧 Recommended Fixes

### Fix 1: Make pg_cron Optional

Replace lines 313-346 with:

```sql
-- Schedule cleanup jobs (if pg_cron available)
DO $$
BEGIN
    -- Check if pg_cron extension exists
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Only schedule if not already scheduled
        IF NOT EXISTS (
            SELECT 1 FROM cron.job WHERE jobname = 'veroscore-auto-timeout-sessions'
        ) THEN
            PERFORM cron.schedule(
                'veroscore-auto-timeout-sessions',
                '*/15 * * * *',
                $$SELECT veroscore_auto_timeout_sessions()$$
            );
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM cron.job WHERE jobname = 'veroscore-cleanup-idempotency'
        ) THEN
            PERFORM cron.schedule(
                'veroscore-cleanup-idempotency',
                '0 */6 * * *',
                $$SELECT veroscore_cleanup_expired_idempotency()$$
            );
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM cron.job WHERE jobname = 'veroscore-archive-metrics'
        ) THEN
            PERFORM cron.schedule(
                'veroscore-archive-metrics',
                '0 2 * * *',
                $$SELECT veroscore_archive_old_metrics()$$
            );
        END IF;
    ELSE
        -- pg_cron not available (Free tier) - log warning
        RAISE NOTICE 'pg_cron extension not available. Scheduled jobs will not be created.';
        RAISE NOTICE 'You can manually run cleanup functions or upgrade to Pro tier.';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Gracefully handle any errors
        RAISE NOTICE 'Could not schedule cron jobs: %', SQLERRM;
END $$;
```

### Fix 2: Update RLS Policies for Supabase

Replace lines 364-388 with:

```sql
-- Policy: Users can only see their own sessions
-- Note: This assumes author field matches Supabase user identifier
CREATE POLICY "Users can view own sessions"
    ON veroscore.sessions FOR SELECT
    USING (
        author = auth.uid()::text 
        OR author = (auth.jwt() ->> 'email')
    );

-- Policy: Service role can do everything (for backend processes)
CREATE POLICY "Service role full access sessions"
    ON veroscore.sessions FOR ALL
    USING (
        auth.role() = 'service_role'
        OR auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Team members can view all PR scores (transparency)
CREATE POLICY "Team members can view all PR scores"
    ON veroscore.pr_scores FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy: Service role full access to PR scores
CREATE POLICY "Service role full access pr_scores"
    ON veroscore.pr_scores FOR ALL
    USING (
        auth.role() = 'service_role'
        OR auth.jwt() ->> 'role' = 'service_role'
    );
```

---

## ✅ Safe Migration Steps

### Step 1: Pre-Migration Check

Run this in Supabase SQL Editor first:

```sql
-- Check if pg_cron is available
SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
) AS pg_cron_available;

-- Check current Supabase plan (if possible)
-- Note: This may not be directly queryable
```

### Step 2: Run Migration in Parts (Recommended)

**Option A: Run Full Migration (if pg_cron available)**

1. Copy entire migration file
2. Paste into Supabase SQL Editor
3. Run - should complete successfully

**Option B: Run in Parts (if pg_cron NOT available)**

1. **Part 1:** Lines 1-312 (everything except cron scheduling)
   - Run this first
   - Creates all tables, functions, views, RLS

2. **Part 2:** Lines 313-346 (cron scheduling)
   - **SKIP** if on Free tier
   - Or use the fixed version above with error handling

3. **Part 3:** Lines 347-548 (rest of migration)
   - Should already be included in Part 1

### Step 3: Verify

```sql
-- Check schema exists
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name = 'veroscore';

-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'veroscore'
ORDER BY table_name;

-- Check functions created
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'veroscore'
ORDER BY routine_name;

-- Check views created
SELECT viewname FROM pg_views 
WHERE schemaname = 'veroscore'
ORDER BY viewname;
```

---

## 🚨 Error Handling

If migration fails:

1. **Check Error Message:**
   - If it's about `pg_cron`, skip that section
   - If it's about RLS policies, update syntax
   - If it's about permissions, check user role

2. **Partial Migration:**
   - Check what was created before failure
   - Fix the issue
   - Re-run from failure point (or drop and re-run)

3. **Rollback (if needed):**
   ```sql
   -- Drop schema and all contents
   DROP SCHEMA IF EXISTS veroscore CASCADE;
   ```

---

## 📝 Recommended Action

**Before running in Supabase:**

1. ✅ **Review the fixes above**
2. ✅ **Apply Fix 1** (pg_cron error handling)
3. ✅ **Apply Fix 2** (RLS policy syntax)
4. ✅ **Test in Supabase SQL Editor**
5. ✅ **Verify all objects created**

---

## 🔗 Related Documents

- `PHASE1_SETUP_GUIDE.md` - Setup instructions
- `DATABASE_ARCHITECTURE_DECISION.md` - Architecture decision
- Supabase Documentation: [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- Supabase Documentation: [pg_cron](https://supabase.com/docs/guides/database/extensions/pg_cron)

---

**Last Updated:** 2025-12-05  
**Status:** ⚠️ Review Required



