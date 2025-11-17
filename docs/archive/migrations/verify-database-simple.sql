-- Simple Database Verification Script for Dashboard Regions
-- Run each section separately or all at once

-- ============================================================================
-- 1. Check if tables exist
-- ============================================================================
SELECT 
  'dashboard_regions' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_regions') 
    THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END as status;

SELECT 
  'dashboard_region_acls' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_region_acls') 
    THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END as status;

SELECT 
  'dashboard_events' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_events') 
    THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END as status;

-- ============================================================================
-- 2. Check if version column exists (CRITICAL for optimistic locking)
-- ============================================================================
SELECT 
  'version column' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'dashboard_regions' AND column_name = 'version'
    )
    THEN '✓ EXISTS (optimistic locking enabled)'
    ELSE '✗ MISSING - run enhance_dashboard_regions_rls_security.sql'
  END as status;

-- ============================================================================
-- 3. Check if RLS is enabled
-- ============================================================================
SELECT 
  'RLS on dashboard_regions' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'dashboard_regions' 
      AND rowsecurity = true
    )
    THEN '✓ ENABLED'
    ELSE '✗ DISABLED - run create_dashboard_regions.sql'
  END as status;

-- ============================================================================
-- 4. Check if RLS policies exist
-- ============================================================================
SELECT 
  policyname as policy_name,
  '✓ EXISTS' as status
FROM pg_policies
WHERE tablename = 'dashboard_regions'
ORDER BY policyname;

-- If no rows returned, policies are missing

-- ============================================================================
-- 5. Check if critical indexes exist
-- ============================================================================
SELECT 
  indexname as index_name,
  '✓ EXISTS' as status
FROM pg_indexes
WHERE tablename = 'dashboard_regions'
  AND (
    indexname LIKE '%layout_id%' 
    OR indexname LIKE '%tenant_id%' 
    OR indexname LIKE '%grid_position%' 
    OR indexname LIKE '%version%'
  )
ORDER BY indexname;

-- ============================================================================
-- 6. Check for data integrity issues
-- ============================================================================
-- Regions with invalid grid positions
SELECT 
  COUNT(*) as invalid_count,
  'Regions with grid_col + col_span > 12 or negative values' as issue
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1);

-- Regions with missing tenant_id
SELECT 
  COUNT(*) as invalid_count,
  'Regions with NULL tenant_id' as issue
FROM dashboard_regions
WHERE tenant_id IS NULL;

-- Regions with missing layout_id
SELECT 
  COUNT(*) as invalid_count,
  'Regions with NULL layout_id' as issue
FROM dashboard_regions
WHERE layout_id IS NULL;

-- ============================================================================
-- 7. Quick summary query
-- ============================================================================
SELECT 
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('dashboard_regions', 'dashboard_region_acls', 'dashboard_events')) as tables_exist,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'dashboard_regions' AND column_name = 'version') as version_column_exists,
  (SELECT COUNT(*) FROM pg_tables WHERE tablename = 'dashboard_regions' AND rowsecurity = true) as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'dashboard_regions') as rls_policies_count,
  (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'dashboard_regions' AND (indexname LIKE '%layout_id%' OR indexname LIKE '%tenant_id%' OR indexname LIKE '%grid_position%' OR indexname LIKE '%version%')) as critical_indexes_count,
  (SELECT COUNT(*) FROM dashboard_regions WHERE deleted_at IS NULL AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1)) as data_integrity_issues;




