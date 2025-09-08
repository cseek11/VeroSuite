-- ============================================================================
-- FIX MATERIALIZED VIEW PERMISSIONS
-- ============================================================================
-- This script fixes the permissions for the search_optimized_accounts materialized view
-- ============================================================================

-- Step 1: Check if the materialized view exists
SELECT 
    schemaname,
    matviewname,
    matviewowner,
    definition
FROM pg_matviews 
WHERE schemaname = 'public' 
  AND matviewname = 'search_optimized_accounts';

-- Step 2: Grant permissions to the service_role for the materialized view
GRANT SELECT ON search_optimized_accounts TO service_role;
GRANT SELECT ON search_optimized_accounts TO authenticated;
GRANT SELECT ON search_optimized_accounts TO anon;

-- Step 3: Grant permissions to refresh the materialized view (if needed)
-- Note: Only the owner can refresh materialized views by default
-- If the materialized view is owned by a different user, we may need to:
-- 1. Change ownership to postgres or service_role
-- 2. Or grant refresh permissions

-- Check current ownership
SELECT 
    schemaname,
    matviewname,
    matviewowner
FROM pg_matviews 
WHERE schemaname = 'public' 
  AND matviewname = 'search_optimized_accounts';

-- Step 4: If the materialized view is causing issues, we can:
-- Option A: Drop and recreate it with proper permissions
-- Option B: Grant refresh permissions to the service_role
-- Option C: Change ownership to postgres

-- Option A: Drop and recreate (uncomment if needed)
-- DROP MATERIALIZED VIEW IF EXISTS search_optimized_accounts;

-- Option B: Grant refresh permissions (uncomment if needed)
-- GRANT REFRESH ON MATERIALIZED VIEW search_optimized_accounts TO service_role;

-- Option C: Change ownership to postgres (recommended)
ALTER MATERIALIZED VIEW search_optimized_accounts OWNER TO postgres;

-- Step 5: Grant additional permissions that might be needed
-- For materialized views, we need to grant permissions differently
-- First, let's try the standard approach:
GRANT ALL ON search_optimized_accounts TO service_role;
GRANT ALL ON search_optimized_accounts TO authenticated;
GRANT ALL ON search_optimized_accounts TO anon;

-- Step 5: Verify permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'search_optimized_accounts'
  AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Materialized views are read-only by default
-- 2. Only the owner can refresh materialized views
-- 3. The error suggests the materialized view is trying to refresh after insert
-- 4. We need to either fix permissions or disable auto-refresh
-- ============================================================================