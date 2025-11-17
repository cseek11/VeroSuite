-- Database Verification Script for Dashboard Regions
-- Run this to check if your database is set up correctly

-- ============================================================================
-- 1. Check if tables exist
-- ============================================================================
SELECT 
  'Tables Check' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_regions') 
    THEN '✓ dashboard_regions table exists'
    ELSE '✗ dashboard_regions table MISSING'
  END as status
UNION ALL
SELECT 
  'Tables Check',
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_region_acls') 
    THEN '✓ dashboard_region_acls table exists'
    ELSE '✗ dashboard_region_acls table MISSING'
  END
UNION ALL
SELECT 
  'Tables Check',
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_events') 
    THEN '✓ dashboard_events table exists'
    ELSE '✗ dashboard_events table MISSING'
  END;

-- ============================================================================
-- 2. Check if required columns exist in dashboard_regions
-- ============================================================================
SELECT 
  'Columns Check' as check_type,
  column_name,
  data_type,
  CASE 
    WHEN column_name IN ('id', 'layout_id', 'tenant_id', 'user_id', 'region_type', 
                         'grid_row', 'grid_col', 'row_span', 'col_span', 'version')
    THEN '✓ Required column'
    ELSE '○ Optional column'
  END as status
FROM information_schema.columns
WHERE table_name = 'dashboard_regions'
ORDER BY 
  CASE WHEN column_name IN ('id', 'layout_id', 'tenant_id', 'user_id', 'region_type', 
                            'grid_row', 'grid_col', 'row_span', 'col_span', 'version') 
       THEN 0 ELSE 1 END,
  column_name;

-- ============================================================================
-- 3. Check if version column exists (critical for optimistic locking)
-- ============================================================================
SELECT 
  'Version Column' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'dashboard_regions' AND column_name = 'version'
    )
    THEN '✓ version column exists (optimistic locking enabled)'
    ELSE '✗ version column MISSING - run enhance_dashboard_regions_rls_security.sql'
  END as status;

-- ============================================================================
-- 4. Check if RLS is enabled
-- ============================================================================
SELECT 
  'RLS Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'dashboard_regions' 
      AND rowsecurity = true
    )
    THEN '✓ RLS is enabled on dashboard_regions'
    ELSE '✗ RLS is DISABLED - run create_dashboard_regions.sql'
  END as status;

-- ============================================================================
-- 5. Check if RLS policies exist
-- ============================================================================
SELECT 
  'RLS Policies' as check_type,
  policyname as policy_name,
  CASE 
    WHEN policyname IS NOT NULL THEN '✓ Policy exists'
    ELSE '✗ Policy MISSING'
  END as status
FROM pg_policies
WHERE tablename = 'dashboard_regions'
ORDER BY policyname;

-- ============================================================================
-- 6. Check if critical indexes exist
-- ============================================================================
SELECT 
  'Indexes Check' as check_type,
  indexname as index_name,
  CASE 
    WHEN indexname LIKE '%layout_id%' OR indexname LIKE '%tenant_id%' 
         OR indexname LIKE '%grid_position%' OR indexname LIKE '%version%'
    THEN '✓ Critical index'
    ELSE '○ Optional index'
  END as status
FROM pg_indexes
WHERE tablename = 'dashboard_regions'
ORDER BY 
  CASE WHEN indexname LIKE '%layout_id%' OR indexname LIKE '%tenant_id%' 
            OR indexname LIKE '%grid_position%' OR indexname LIKE '%version%'
       THEN 0 ELSE 1 END,
  indexname;

-- ============================================================================
-- 7. Check for data integrity issues
-- ============================================================================
-- Check for regions with invalid grid positions
SELECT 
  'Data Integrity' as check_type,
  COUNT(*) as invalid_regions,
  'Regions with grid_col + col_span > 12' as issue
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1);

-- Check for regions with missing tenant_id
SELECT 
  'Data Integrity' as check_type,
  COUNT(*) as invalid_regions,
  'Regions with NULL tenant_id' as issue
FROM dashboard_regions
WHERE tenant_id IS NULL;

-- Check for regions with missing layout_id
SELECT 
  'Data Integrity' as check_type,
  COUNT(*) as invalid_regions,
  'Regions with NULL layout_id' as issue
FROM dashboard_regions
WHERE layout_id IS NULL;

-- ============================================================================
-- 8. Check for potential overlap issues (sample check)
-- ============================================================================
SELECT 
  'Overlap Check' as check_type,
  COUNT(*) as potential_overlaps,
  'Regions that might overlap (same layout, same position)' as issue
FROM dashboard_regions r1
WHERE deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM dashboard_regions r2
    WHERE r2.deleted_at IS NULL
      AND r2.layout_id = r1.layout_id
      AND r2.tenant_id = r1.tenant_id
      AND r2.id != r1.id
      AND r2.grid_row < r1.grid_row + r1.row_span
      AND r2.grid_row + r2.row_span > r1.grid_row
      AND r2.grid_col < r1.grid_col + r1.col_span
      AND r2.grid_col + r2.col_span > r1.grid_col
  )
LIMIT 10;

-- ============================================================================
-- 9. Summary
-- ============================================================================
SELECT 
  'SUMMARY' as check_type,
  'Run all checks above and verify:' as status,
  '1. All tables exist
2. version column exists
3. RLS is enabled
4. RLS policies exist
5. Critical indexes exist
6. No data integrity issues' as notes;




