-- ============================================================================
-- VeroScore V3 - Complete Secure Setup (No RPC Functions)
-- ============================================================================
-- This script configures everything needed for secure direct table access
-- using PostgREST with Accept-Profile header (MOST SECURE - RLS enforced)
-- ============================================================================

-- ============================================================================
-- STEP 1: Configure PostgREST Schema Exposure
-- ============================================================================
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';

-- ============================================================================
-- STEP 2: Set Search Path (Alternative Method)
-- ============================================================================
-- This helps PostgREST find tables in veroscore schema
ALTER ROLE authenticated SET search_path = veroscore, public;
ALTER ROLE anon SET search_path = veroscore, public;
ALTER ROLE service_role SET search_path = veroscore, public;

-- ============================================================================
-- STEP 3: Grant Schema Permissions
-- ============================================================================
GRANT USAGE ON SCHEMA veroscore TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- ============================================================================
-- STEP 4: Reload PostgREST Schema Cache
-- ============================================================================
-- Use 'reload schema' to refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Also notify config reload
NOTIFY pgrst, 'reload config';

-- ============================================================================
-- STEP 5: Force PostgREST Restart (If Available)
-- ============================================================================
-- This terminates PostgREST processes to force a restart
-- Note: This may not work on Supabase managed instances
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE application_name = 'postgrest'
  AND pid != pg_backend_pid();

-- ============================================================================
-- STEP 6: Verify Configuration
-- ============================================================================

-- Check PostgREST config
SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator'
  AND setconfig::text LIKE '%veroscore%';

-- Check search path
SELECT rolname, rolconfig 
FROM pg_roles 
WHERE rolname IN ('authenticated', 'anon', 'service_role')
  AND rolconfig IS NOT NULL;

-- Check schema permissions
SELECT 
    nspname as schema_name,
    nspacl as permissions
FROM pg_namespace
WHERE nspname = 'veroscore';

-- Check RLS is enabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.nspname = t.schemaname AND n.oid = c.relnamespace
WHERE schemaname = 'veroscore'
ORDER BY tablename;

-- ============================================================================
-- IMPORTANT: After Running This
-- ============================================================================
-- 1. Wait 30-60 seconds for PostgREST to reload
-- 2. If still not working, RESTART Supabase project
-- 3. Test: python .cursor/scripts/test_supabase_schema_access.py
-- 
-- The code will use PostgREST client with Accept-Profile header,
-- which is the MOST SECURE approach (RLS enforced, no RPC functions needed)
-- ============================================================================



