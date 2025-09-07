-- ============================================================================
-- TEST BACKEND ROLE PERMISSIONS
-- ============================================================================
-- This script tests the backend_accounts role to ensure it has proper permissions
-- 
-- Usage: Run this in your Supabase SQL Editor as the service role
-- 
-- Author: VeroSuite Security Audit
-- Date: January 2, 2025
-- ============================================================================

-- Test 1: Check if role exists and has BYPASSRLS
SELECT 
    rolname, 
    rolbypassrls,
    rolsuper,
    rolcreaterole,
    rolcreatedb
FROM pg_roles 
WHERE rolname = 'backend_accounts';

-- Test 2: Check table permissions
SELECT 
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE grantee = 'backend_accounts'
ORDER BY table_name, privilege_type;

-- Test 3: Check if we can query accounts table (this should work with BYPASSRLS)
-- Note: This will only work if you're connected as the backend_accounts role
-- or if you have a secret key assigned to this role

-- Test 4: Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('accounts', 'customer_profiles', 'customer_contacts', 'customer_segments')
ORDER BY tablename, policyname;

-- ============================================================================
-- EXPECTED RESULTS
-- ============================================================================
-- 1. backend_accounts role should exist with rolbypassrls = true
-- 2. Should have SELECT, INSERT, UPDATE, DELETE on accounts table
-- 3. Should have SELECT on related customer tables
-- 4. Should have policies that allow access to backend_accounts role
-- ============================================================================
