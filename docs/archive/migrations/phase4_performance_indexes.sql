-- Phase 4: Performance Optimization - Database Indexes
-- This migration adds composite indexes for common query patterns
-- Date: 2025-01-16

-- ============================================================================
-- 1. Composite Indexes for Common Query Patterns
-- ============================================================================

-- Index for finding regions by layout with ordering (most common query)
-- This covers: findByLayoutId with ordering by display_order, grid_row, grid_col
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_layout_order 
ON dashboard_regions(layout_id, tenant_id, deleted_at, display_order, grid_row, grid_col)
WHERE deleted_at IS NULL;

-- Index for overlap detection queries (used during add/update validation)
-- Covers: findOverlappingRegions with grid position checks
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_overlap_check
ON dashboard_regions(layout_id, tenant_id, grid_row, grid_col, row_span, col_span)
WHERE deleted_at IS NULL;

-- Index for version-based queries (optimistic locking)
-- Covers: update operations with version checks
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_version
ON dashboard_regions(id, tenant_id, version)
WHERE deleted_at IS NULL;

-- Index for user-specific region queries
-- Covers: finding all regions for a user across layouts
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_user_layouts
ON dashboard_regions(tenant_id, user_id, layout_id, deleted_at)
WHERE deleted_at IS NULL;

-- Index for widget type filtering
-- Covers: filtering regions by widget_type
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_widget_type
ON dashboard_regions(tenant_id, widget_type, deleted_at)
WHERE deleted_at IS NULL AND widget_type IS NOT NULL;

-- ============================================================================
-- 2. Partial Indexes for Soft-Deleted Records (Cleanup Queries)
-- ============================================================================

-- Index for finding soft-deleted records older than X days (for cleanup)
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_deleted_cleanup
ON dashboard_regions(deleted_at, tenant_id)
WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- 3. Statistics Update
-- ============================================================================

-- Update table statistics for query planner
ANALYZE dashboard_regions;

-- ============================================================================
-- 4. Index Usage Monitoring Query
-- ============================================================================

-- Run this query periodically to check index usage:
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   idx_scan as index_scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE tablename = 'dashboard_regions'
-- ORDER BY idx_scan DESC;

-- ============================================================================
-- Notes
-- ============================================================================
-- These indexes are designed to optimize:
-- 1. Layout region loading (most common operation)
-- 2. Overlap detection during add/update
-- 3. Version checking for optimistic locking
-- 4. User-specific queries
-- 5. Widget filtering
-- 6. Soft-delete cleanup operations
--
-- Monitor index usage and remove unused indexes if needed.
-- Consider partitioning by tenant_id if table grows > 10M rows.


