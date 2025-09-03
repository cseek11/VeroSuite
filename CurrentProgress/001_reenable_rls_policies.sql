-- ============================================================================
-- CRITICAL SECURITY FIX: Re-enable Row Level Security Policies
-- ============================================================================
-- This script re-enables RLS and creates comprehensive tenant isolation policies
-- 
-- Priority: P0 - MUST BE APPLIED IMMEDIATELY
-- Risk: Without RLS, users can access data from other tenants
-- 
-- Usage: Run this in your Supabase SQL Editor as the service role
-- 
-- Author: VeroSuite Security Audit
-- Date: January 2, 2025
-- ============================================================================

-- Ensure we're connected as service role
SELECT current_user, current_setting('role');

-- Enable Row Level Security on all tenant-scoped tables
-- This is the critical security fix for multi-tenant isolation
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "locations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "work_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for ACCOUNTS table
-- This ensures users can only see accounts from their tenant
DROP POLICY IF EXISTS "tenant_accounts_policy" ON "accounts";
CREATE POLICY "tenant_accounts_policy" ON "accounts"
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.tenant_id')::uuid)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- Create comprehensive RLS policies for LOCATIONS table  
DROP POLICY IF EXISTS "tenant_locations_policy" ON "locations";
CREATE POLICY "tenant_locations_policy" ON "locations"
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.tenant_id')::uuid)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- Create comprehensive RLS policies for WORK_ORDERS table
DROP POLICY IF EXISTS "tenant_work_orders_policy" ON "work_orders";
CREATE POLICY "tenant_work_orders_policy" ON "work_orders"
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.tenant_id')::uuid)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- Create comprehensive RLS policies for JOBS table
DROP POLICY IF EXISTS "tenant_jobs_policy" ON "jobs";
CREATE POLICY "tenant_jobs_policy" ON "jobs"
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.tenant_id')::uuid)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- Create comprehensive RLS policies for AUDIT_LOGS table
DROP POLICY IF EXISTS "tenant_audit_logs_policy" ON "audit_logs";
CREATE POLICY "tenant_audit_logs_policy" ON "audit_logs"
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.tenant_id')::uuid)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- Special admin policy for cross-tenant access (if needed)
-- Only enable this if you need admin users to see all tenants
-- CREATE POLICY "admin_all_access" ON "accounts"
--     FOR ALL TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM auth.users 
--             WHERE auth.users.id = auth.uid() 
--             AND auth.users.raw_user_meta_data->>'roles' ? 'super_admin'
--         )
--     );

-- Revoke excessive permissions that were granted during development
REVOKE ALL ON "accounts" FROM anon;
REVOKE ALL ON "locations" FROM anon;
REVOKE ALL ON "work_orders" FROM anon;
REVOKE ALL ON "jobs" FROM anon;
REVOKE ALL ON "audit_logs" FROM anon;

-- Grant appropriate permissions to authenticated users
-- These will be filtered by RLS policies
GRANT SELECT, INSERT, UPDATE, DELETE ON "accounts" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "locations" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "work_orders" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "jobs" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "audit_logs" TO authenticated;

-- Verify RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN '✅ RLS ENABLED'
        ELSE '❌ RLS DISABLED'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('accounts', 'locations', 'work_orders', 'jobs', 'audit_logs')
ORDER BY tablename;

-- Verify policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN policyname IS NOT NULL THEN '✅ POLICY EXISTS'
        ELSE '❌ NO POLICY'
    END as status
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('accounts', 'locations', 'work_orders', 'jobs', 'audit_logs')
ORDER BY tablename, policyname;

-- Test tenant isolation (run this with different tenant contexts)
-- This should return different results based on app.tenant_id setting
SELECT 
    'accounts' as table_name,
    COUNT(*) as accessible_rows,
    current_setting('app.tenant_id', true) as current_tenant
FROM accounts
UNION ALL
SELECT 
    'locations' as table_name,
    COUNT(*) as accessible_rows,
    current_setting('app.tenant_id', true) as current_tenant
FROM locations
UNION ALL
SELECT 
    'work_orders' as table_name,
    COUNT(*) as accessible_rows,
    current_setting('app.tenant_id', true) as current_tenant
FROM work_orders
UNION ALL
SELECT 
    'jobs' as table_name,
    COUNT(*) as accessible_rows,
    current_setting('app.tenant_id', true) as current_tenant
FROM jobs;

-- ============================================================================
-- POST-DEPLOYMENT VERIFICATION CHECKLIST
-- ============================================================================
-- 
-- □ 1. Verify RLS is enabled on all tenant tables
-- □ 2. Verify policies are created for all tables
-- □ 3. Test with different tenant contexts
-- □ 4. Verify application still works with tenant middleware
-- □ 5. Run tenant isolation tests
-- □ 6. Monitor for any access denied errors in application logs
-- 
-- CRITICAL: Test thoroughly in staging before applying to production!
-- ============================================================================

COMMIT;
