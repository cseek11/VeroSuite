-- ============================================================================
-- VeroScore V3 - Verify and Fix Permissions
-- ============================================================================
-- Run this to verify permissions are correct and fix any issues
-- ============================================================================

-- ============================================================================
-- STEP 1: Verify Schema Permissions (You Already Have This)
-- ============================================================================
SELECT 
    nspname as schema_name,
    nspacl as permissions
FROM pg_namespace
WHERE nspname = 'veroscore';

-- Expected: Should show U (USAGE) for anon, authenticated, service_role
-- Your output shows: ✅ anon=U, authenticated=U, service_role=U (CORRECT!)

-- ============================================================================
-- STEP 2: Verify Table Permissions (CRITICAL - May Be Missing)
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    has_table_privilege('anon', schemaname||'.'||tablename, 'SELECT') as anon_select,
    has_table_privilege('authenticated', schemaname||'.'||tablename, 'SELECT') as auth_select,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'SELECT') as service_select,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'INSERT') as service_insert,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'UPDATE') as service_update,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'DELETE') as service_delete
FROM pg_tables
WHERE schemaname = 'veroscore'
ORDER BY tablename;

-- All should be TRUE for service_role
-- If any are FALSE, run the GRANT statements below

-- ============================================================================
-- STEP 3: Grant Table Permissions (If Missing)
-- ============================================================================
-- Only run if Step 2 shows FALSE values

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- Grant on sequences (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- Grant on functions (for cleanup functions)
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- ============================================================================
-- STEP 4: Verify PostgREST Configuration (CRITICAL)
-- ============================================================================
-- This is the KEY setting that tells PostgREST about veroscore schema

-- Check current setting
SELECT 
    rolname,
    setconfig
FROM pg_roles r
LEFT JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator';

-- Expected: Should show veroscore in setconfig
-- If NULL or doesn't include veroscore, run the ALTER ROLE command below

-- ============================================================================
-- STEP 5: Configure PostgREST (If Not Set)
-- ============================================================================
-- This is REQUIRED for PostgREST to see the veroscore schema

-- Set pgrst.db_schemas (this tells PostgREST which schemas to expose)
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';

-- Notify PostgREST to reload (REQUIRED!)
NOTIFY pgrst, 'reload config';

-- ============================================================================
-- STEP 6: Verify RLS is Enabled (Security Check)
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
-- If any show false, that's a security issue!

-- ============================================================================
-- STEP 7: Final Verification
-- ============================================================================

-- Check that veroscore is in exposed schemas
SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator'
  AND setconfig::text LIKE '%veroscore%';

-- Should return 1 row with veroscore in setconfig

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- After running this script:
-- 1. Wait 10-30 seconds for PostgREST to reload
-- 2. Test: python .cursor/scripts/test_supabase_schema_access.py
-- 3. If successful, you can remove RPC functions
-- ============================================================================

