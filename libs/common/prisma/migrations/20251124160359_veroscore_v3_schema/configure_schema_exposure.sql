-- ============================================================================
-- VeroScore V3 - Configure Schema Exposure for Secure Direct Access
-- ============================================================================
-- This script configures Supabase PostgREST to expose the veroscore schema
-- for direct table access while maintaining RLS enforcement (MOST SECURE).
--
-- Created: 2025-11-24
-- Usage: Run this SQL in Supabase SQL Editor to enable schema exposure
-- ============================================================================

-- ============================================================================
-- STEP 1: Configure PostgREST to Expose veroscore Schema
-- ============================================================================
-- This is the CRITICAL step - PostgREST needs to know about the schema
-- ============================================================================

-- Check current configuration
SELECT setconfig
FROM pg_db_role_setting
WHERE setrole = (SELECT oid FROM pg_roles WHERE rolname = 'authenticator');

-- Set pgrst.db_schemas to include veroscore
-- This tells PostgREST which schemas are accessible via the API
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';

-- Notify PostgREST to reload configuration
-- This is REQUIRED for changes to take effect
NOTIFY pgrst, 'reload config';

-- ============================================================================
-- STEP 2: Grant Schema Permissions
-- ============================================================================
-- Grant necessary permissions to Supabase roles for schema access
-- ============================================================================

-- Grant schema usage
GRANT USAGE ON SCHEMA veroscore TO anon, authenticated, service_role;

-- Grant table permissions (RLS will still enforce row-level security)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- Grant function permissions (for cleanup functions)
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- Grant sequence permissions (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA veroscore 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA veroscore 
    GRANT EXECUTE ON ROUTINES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA veroscore 
    GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;

-- ============================================================================
-- STEP 3: Verify RLS is Enabled (Security Check)
-- ============================================================================
-- Ensure RLS is enabled on all tables (MOST SECURE)
-- ============================================================================

-- Verify RLS is enabled (should return rows for all tables)
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.nspname = t.schemaname AND n.oid = c.relnamespace
WHERE schemaname = 'veroscore'
ORDER BY tablename;

-- All tables should show rls_enabled = true
-- If any show false, RLS is not enabled - this is a security risk!

-- ============================================================================
-- STEP 4: Verify Configuration
-- ============================================================================
-- Test that configuration is correct
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

-- Check schema permissions
SELECT 
    nspname as schema_name,
    nspacl as permissions
FROM pg_namespace
WHERE nspname = 'veroscore';

-- Should show permissions for anon, authenticated, service_role

-- ============================================================================
-- VERIFICATION COMPLETE
-- ============================================================================
-- After running this script:
-- 1. Wait 10-30 seconds for PostgREST to reload
-- 2. Test with: python .cursor/scripts/test_supabase_schema_access.py
-- 3. If successful, you can remove RPC functions using drop_rpc_functions.sql
-- ============================================================================



