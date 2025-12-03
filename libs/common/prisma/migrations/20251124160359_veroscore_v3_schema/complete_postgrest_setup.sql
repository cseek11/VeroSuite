-- ============================================================================
-- VeroScore V3 - Complete PostgREST Setup (Final Fix)
-- ============================================================================
-- This ensures PostgREST is fully configured and reloaded
-- ============================================================================

-- ============================================================================
-- STEP 1: Verify Current Configuration
-- ============================================================================
SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator';

-- Should show: pgrst.db_schemas=public, veroscore

-- ============================================================================
-- STEP 2: Ensure Configuration is Set (Idempotent)
-- ============================================================================
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';

-- ============================================================================
-- STEP 3: Verify Schema Permissions
-- ============================================================================
-- Check schema permissions (should already be set)
SELECT 
    nspname as schema_name,
    nspacl as permissions
FROM pg_namespace
WHERE nspname = 'veroscore';

-- Should show: anon=U, authenticated=U, service_role=U

-- ============================================================================
-- STEP 4: Verify Table Permissions
-- ============================================================================
-- Ensure tables have proper permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- ============================================================================
-- STEP 5: Force PostgREST Reload (Multiple Methods)
-- ============================================================================

-- Method 1: Standard NOTIFY
NOTIFY pgrst, 'reload config';

-- Method 2: Check if PostgREST is listening
SELECT pg_listening_channels();

-- Should show 'pgrst' if PostgREST is running

-- ============================================================================
-- STEP 6: Verify Tables Exist
-- ============================================================================
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema = 'veroscore'
ORDER BY table_name;

-- Should return: sessions, changes_queue, pr_scores, detection_results, etc.

-- ============================================================================
-- STEP 7: Verify RLS is Enabled (Security Check)
-- ============================================================================
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.nspname = t.schemaname AND n.oid = c.relnamespace
WHERE schemaname = 'veroscore'
ORDER BY tablename;

-- All should show rls_enabled = true

-- ============================================================================
-- IMPORTANT: After Running This Script
-- ============================================================================
-- 1. Wait 30-60 seconds for PostgREST to reload
-- 2. If still not working, RESTART your Supabase project
-- 3. Check Supabase Dashboard → Settings → API → Restart API (if available)
-- 4. Test: python .cursor/scripts/test_supabase_schema_access.py
-- ============================================================================



