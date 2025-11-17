-- ============================================================================
-- SUPABASE 2025 API KEY SYSTEM: Fix Permissions
-- ============================================================================
-- This script fixes the permissions for the new Supabase 2025 API key system
-- ============================================================================

-- Step 1: Grant permissions to the service_role (for secret keys)
-- The secret key uses the service_role internally

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA auth TO service_role;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO service_role;

-- Step 2: Grant permissions to the anon role (for publishable keys)
-- The publishable key uses the anon role internally

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA auth TO anon;

-- Grant table permissions (read-only for anon)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;

-- Step 3: Grant permissions to the authenticated role (for authenticated users)
-- This is used when users are logged in with the publishable key

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

-- Step 4: Verify the permissions
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Step 5: Check role permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE grantee IN ('service_role', 'anon', 'authenticated')
  AND table_schema = 'public'
ORDER BY grantee, table_name, privilege_type;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. service_role: Used by secret keys, has full access (bypasses RLS)
-- 2. anon: Used by publishable keys for unauthenticated access, read-only
-- 3. authenticated: Used by publishable keys for authenticated users, full access
-- 4. RLS policies will still apply to anon and authenticated roles
-- ============================================================================
