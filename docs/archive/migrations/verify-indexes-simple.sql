-- Simple SQL script to verify critical region indexes
-- Run this directly in your database console (Supabase SQL Editor, pgAdmin, etc.)
--
-- Expected result: 4 rows showing all indexes
-- If fewer than 4 rows returned, indexes are missing

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'dashboard_regions'
AND indexname IN (
  'idx_regions_layout_deleted',
  'idx_regions_grid_bounds',
  'idx_regions_tenant_layout',
  'idx_regions_overlap_detection'
)
ORDER BY indexname;

-- Additional verification: Count all indexes on the table
SELECT 
  COUNT(*) as index_count,
  'Total indexes on dashboard_regions table' as description
FROM pg_indexes
WHERE tablename = 'dashboard_regions';

-- Show query plan for overlap detection (should use Index Scan)
EXPLAIN ANALYZE
SELECT * FROM dashboard_regions
WHERE layout_id = 'test-layout-id'
  AND deleted_at IS NULL
  AND grid_row < 10
  AND grid_col < 12
LIMIT 10;


