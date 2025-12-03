-- ============================================================================
-- VeroScore V3 - Final PostgREST Fix (No RPC Functions)
-- ============================================================================
-- This ensures PostgREST is fully configured and reloaded correctly
-- ============================================================================

-- ============================================================================
-- STEP 1: Verify and Set PostgREST Configuration
-- ============================================================================
-- Ensure pgrst.db_schemas includes veroscore
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';

-- ============================================================================
-- STEP 2: Reload PostgREST Schema Cache (CRITICAL)
-- ============================================================================
-- Use 'reload schema' instead of 'reload config' - this refreshes the schema cache
NOTIFY pgrst, 'reload schema';

-- Also try the config reload
NOTIFY pgrst, 'reload config';

-- ============================================================================
-- STEP 3: Verify Schema Permissions
-- ============================================================================
-- Ensure all permissions are granted
GRANT USAGE ON SCHEMA veroscore TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- ============================================================================
-- STEP 4: Verify Configuration
-- ============================================================================
SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator'
  AND setconfig::text LIKE '%veroscore%';

-- Should return 1 row with veroscore in setconfig

-- ============================================================================
-- STEP 5: Verify Tables Exist
-- ============================================================================
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema = 'veroscore'
ORDER BY table_name;

-- Should return: sessions, changes_queue, pr_scores, etc.

-- ============================================================================
-- IMPORTANT: After Running This
-- ============================================================================
-- 1. Wait 30-60 seconds for PostgREST to reload schema cache
-- 2. If still not working, RESTART Supabase project
-- 3. Test: python .cursor/scripts/test_supabase_schema_access.py
-- ============================================================================



