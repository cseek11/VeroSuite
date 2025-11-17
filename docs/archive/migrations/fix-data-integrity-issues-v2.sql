-- Fix Data Integrity Issues in Dashboard Regions (Version 2 - More Robust)
-- This version handles NULL values and edge cases

-- ============================================================================
-- Step 1: Fix NULL values first
-- ============================================================================
UPDATE dashboard_regions
SET 
  grid_col = COALESCE(grid_col, 0),
  grid_row = COALESCE(grid_row, 0),
  col_span = COALESCE(col_span, 1),
  row_span = COALESCE(row_span, 1),
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND (grid_col IS NULL OR grid_row IS NULL OR col_span IS NULL OR row_span IS NULL);

-- ============================================================================
-- Step 2: Fix negative column positions
-- ============================================================================
UPDATE dashboard_regions
SET 
  grid_col = 0,
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND grid_col < 0;

-- ============================================================================
-- Step 3: Fix invalid spans (< 1)
-- ============================================================================
UPDATE dashboard_regions
SET 
  col_span = GREATEST(COALESCE(col_span, 1), 1),
  row_span = GREATEST(COALESCE(row_span, 1), 1),
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND (col_span < 1 OR row_span < 1);

-- ============================================================================
-- Step 4: Fix regions that exceed grid bounds (col + span > 12)
-- ============================================================================
-- Strategy: If col + span > 12, we have two options:
-- Option A: Reduce span to fit
-- Option B: Move column to the left
-- We'll use Option A (reduce span) as it's safer

UPDATE dashboard_regions
SET 
  col_span = LEAST(col_span, 12 - grid_col),
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND grid_col >= 0 
  AND grid_col < 12
  AND col_span > 0
  AND grid_col + col_span > 12;

-- ============================================================================
-- Step 5: Handle edge case where grid_col >= 12 (move to column 0)
-- ============================================================================
UPDATE dashboard_regions
SET 
  grid_col = 0,
  col_span = LEAST(col_span, 12),
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND grid_col >= 12;

-- ============================================================================
-- Step 6: Final safety check - ensure all values are within bounds
-- ============================================================================
UPDATE dashboard_regions
SET 
  grid_col = GREATEST(0, LEAST(grid_col, 11)),
  grid_row = GREATEST(0, grid_row),
  col_span = GREATEST(1, LEAST(col_span, 12)),
  row_span = GREATEST(1, row_span),
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND (
    grid_col < 0 
    OR grid_col >= 12
    OR col_span < 1 
    OR col_span > 12
    OR row_span < 1
  );

-- ============================================================================
-- Step 7: Verify fixes
-- ============================================================================
SELECT 
  COUNT(*) as remaining_issues,
  'Regions with invalid grid positions' as status
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND (
    grid_col IS NULL 
    OR col_span IS NULL 
    OR row_span IS NULL
    OR grid_col + col_span > 12 
    OR grid_col < 0 
    OR col_span < 1 
    OR row_span < 1
  );

-- Should return 0 if all issues are fixed




