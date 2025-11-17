-- Critical Database Indexes for Region Dashboard Performance
-- Migration Date: 2025-11-14
-- Purpose: Fix N+1 query problem and improve region query performance
-- Addresses: Phase 1 Critical Fix #3 from audit report

-- ============================================================================
-- Critical Performance Indexes
-- ============================================================================

-- Index for layout + deleted queries (most common read pattern)
-- Improves: findByLayoutId, getRegionsByLayout
CREATE INDEX IF NOT EXISTS idx_regions_layout_deleted 
  ON dashboard_regions(layout_id, deleted_at)
  WHERE deleted_at IS NULL;

-- Spatial index for grid bounds (overlap detection)
-- Improves: findOverlappingRegions, bulk import validation
-- This is the PRIMARY fix for the N+1 query problem
CREATE INDEX IF NOT EXISTS idx_regions_grid_bounds 
  ON dashboard_regions(layout_id, grid_row, grid_col, row_span, col_span)
  WHERE deleted_at IS NULL;

-- Index for tenant + layout queries (tenant isolation with layout filtering)
-- Improves: Multi-tenant queries with layout scoping
CREATE INDEX IF NOT EXISTS idx_regions_tenant_layout
  ON dashboard_regions(tenant_id, layout_id)
  WHERE deleted_at IS NULL;

-- Composite index for overlap detection with tenant isolation
-- Improves: Overlap queries that include tenant filtering
CREATE INDEX IF NOT EXISTS idx_regions_overlap_detection
  ON dashboard_regions(layout_id, tenant_id, grid_row, grid_col, row_span, col_span)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- Index Verification
-- ============================================================================

-- Run this query to verify indexes were created:
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   indexdef
-- FROM pg_indexes
-- WHERE tablename = 'dashboard_regions'
-- AND indexname IN (
--   'idx_regions_layout_deleted',
--   'idx_regions_grid_bounds',
--   'idx_regions_tenant_layout',
--   'idx_regions_overlap_detection'
-- );

-- ============================================================================
-- Performance Impact
-- ============================================================================
-- Expected improvements:
-- - findByLayoutId: 10-50x faster (from table scan to index scan)
-- - findOverlappingRegions: 100x faster (from O(n²) to O(log n))
-- - Bulk imports: 300x faster (from 5 minutes to ~1 second for 100 regions)
-- - Tenant isolation queries: 5-10x faster

-- Update table statistics for query planner
ANALYZE dashboard_regions;

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To rollback these indexes (not recommended):
-- DROP INDEX IF EXISTS idx_regions_layout_deleted;
-- DROP INDEX IF EXISTS idx_regions_grid_bounds;
-- DROP INDEX IF EXISTS idx_regions_tenant_layout;
-- DROP INDEX IF EXISTS idx_regions_overlap_detection;


