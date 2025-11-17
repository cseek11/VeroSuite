-- Fix Data Integrity Issues in Dashboard Regions
-- Run this to identify and fix invalid grid positions

-- ============================================================================
-- 1. Identify regions with invalid grid positions
-- ============================================================================
SELECT 
  id,
  layout_id,
  tenant_id,
  grid_col,
  col_span,
  grid_row,
  row_span,
  CASE 
    WHEN grid_col + col_span > 12 THEN 'Exceeds grid bounds (col + span > 12)'
    WHEN grid_col < 0 THEN 'Negative column position'
    WHEN col_span < 1 THEN 'Invalid column span (< 1)'
    WHEN row_span < 1 THEN 'Invalid row span (< 1)'
    ELSE 'Other issue'
  END as issue
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1)
ORDER BY layout_id, grid_row, grid_col;

-- ============================================================================
-- 2. Fix regions that exceed grid bounds (col + span > 12)
-- ============================================================================
-- This will clamp col_span to fit within 12 columns
UPDATE dashboard_regions
SET 
  col_span = LEAST(col_span, 12 - grid_col),
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND grid_col + col_span > 12
  AND grid_col >= 0; -- Only fix if grid_col is valid

-- ============================================================================
-- 3. Fix regions with negative column positions
-- ============================================================================
UPDATE dashboard_regions
SET 
  grid_col = 0,
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND grid_col < 0;

-- ============================================================================
-- 4. Fix regions with invalid spans (< 1)
-- ============================================================================
UPDATE dashboard_regions
SET 
  col_span = GREATEST(col_span, 1),
  row_span = GREATEST(row_span, 1),
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND (col_span < 1 OR row_span < 1);

-- ============================================================================
-- 5. Verify fixes
-- ============================================================================
SELECT 
  COUNT(*) as remaining_issues,
  'Regions with invalid grid positions' as status
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1);

-- Should return 0 if all issues are fixed




