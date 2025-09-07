-- ============================================================================
-- CRITICAL SECURITY FIX: Re-enable Row Level Security Policies (CORRECTED)
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

-- Drop existing policies first
DROP POLICY IF EXISTS "tenant_accounts_policy" ON "accounts";
DROP POLICY IF EXISTS "tenant_locations_policy" ON "locations";
DROP POLICY IF EXISTS "tenant_work_orders_policy" ON "work_orders";
DROP POLICY IF EXISTS "tenant_jobs_policy" ON "jobs";
DROP POLICY IF EXISTS "tenant_audit_logs_policy" ON "audit_logs";

-- Create CORRECTED RLS policies for ACCOUNTS table
-- This ensures users can only see accounts from their tenant
CREATE POLICY "tenant_accounts_policy" ON "accounts"
    FOR ALL TO authenticated
    USING (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    )
    WITH CHECK (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    );

-- Create CORRECTED RLS policies for LOCATIONS table  
CREATE POLICY "tenant_locations_policy" ON "locations"
    FOR ALL TO authenticated
    USING (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    )
    WITH CHECK (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    );

-- Create CORRECTED RLS policies for WORK_ORDERS table
CREATE POLICY "tenant_work_orders_policy" ON "work_orders"
    FOR ALL TO authenticated
    USING (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    )
    WITH CHECK (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    );

-- Create CORRECTED RLS policies for JOBS table
CREATE POLICY "tenant_jobs_policy" ON "jobs"
    FOR ALL TO authenticated
    USING (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    )
    WITH CHECK (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    );

-- Create CORRECTED RLS policies for AUDIT_LOGS table
CREATE POLICY "tenant_audit_logs_policy" ON "audit_logs"
    FOR ALL TO authenticated
    USING (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    )
    WITH CHECK (
        current_setting('app.tenant_id', true) IS NOT NULL 
        AND tenant_id = (current_setting('app.tenant_id', true))::uuid
    );

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

-- Test the policies work correctly
-- This should show the current tenant context
SELECT 
    'Current tenant context' as test,
    current_setting('app.tenant_id', true) as tenant_id,
    CASE 
        WHEN current_setting('app.tenant_id', true) IS NOT NULL 
        THEN '✅ Tenant context set'
        ELSE '❌ No tenant context - access should be blocked'
    END as status;


