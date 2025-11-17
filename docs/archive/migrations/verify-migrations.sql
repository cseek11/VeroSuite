-- Final Verification Script for Region Dashboard Migrations
-- Run this in Supabase SQL Editor to verify everything is set up correctly

-- ============================================================================
-- 1. Verify all tables exist
-- ============================================================================
SELECT 
  'Tables Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ All tables present'
    ELSE '❌ Missing tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'dashboard_%';

-- ============================================================================
-- 2. Verify version column exists (CRITICAL for optimistic locking)
-- ============================================================================
SELECT 
  'Version Column Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'dashboard_regions' 
      AND column_name = 'version'
    ) THEN '✅ Version column exists'
    ELSE '❌ Version column MISSING - Run enhance_dashboard_regions_rls_security.sql'
  END as status;

-- ============================================================================
-- 3. Verify RLS is enabled on all dashboard tables
-- ============================================================================
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'dashboard_%'
ORDER BY tablename;

-- ============================================================================
-- 4. Verify RLS policies exist for dashboard_regions
-- ============================================================================
SELECT 
  'RLS Policies Check' as check_type,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ All policies present'
    ELSE '❌ Missing policies'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'dashboard_regions';

-- List the policies
SELECT 
  policyname,
  CASE 
    WHEN cmd = 'SELECT' THEN 'View'
    WHEN cmd = 'INSERT' THEN 'Insert'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
    ELSE cmd
  END as operation
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'dashboard_regions'
ORDER BY policyname;

-- ============================================================================
-- 5. Verify indexes exist for performance
-- ============================================================================
SELECT 
  'Indexes Check' as check_type,
  COUNT(*) as index_count
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'dashboard_regions';

-- List key indexes
SELECT 
  indexname,
  CASE 
    WHEN indexname LIKE '%version%' THEN '✅ Version index'
    WHEN indexname LIKE '%tenant%' THEN '✅ Tenant index'
    WHEN indexname LIKE '%layout%' THEN '✅ Layout index'
    ELSE 'Other index'
  END as index_type
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'dashboard_regions'
ORDER BY indexname;

-- ============================================================================
-- 6. Verify dashboard_events table has RLS policies
-- ============================================================================
SELECT 
  'Events Table Policies' as check_type,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ All policies present'
    ELSE '❌ Missing policies'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'dashboard_events';

-- ============================================================================
-- 7. Summary
-- ============================================================================
SELECT 
  '✅ Migration Verification Complete' as summary,
  'All tables, columns, policies, and indexes should be present.' as notes;




