-- Fix regions with grid_col = 12 (invalid, should be 0-11)
-- This is a specific fix for the "column 12 + span 1 exceeds 12 columns" error

-- Identify regions with grid_col >= 12
SELECT 
  id,
  layout_id,
  grid_col,
  col_span,
  grid_row,
  row_span,
  'grid_col >= 12 (invalid)' as issue
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND grid_col >= 12;

-- Fix: Move regions with grid_col >= 12 to column 0 and adjust span if needed
UPDATE dashboard_regions
SET 
  grid_col = 0,
  col_span = LEAST(col_span, 12), -- Ensure span doesn't exceed 12
  updated_at = NOW()
WHERE deleted_at IS NULL 
  AND grid_col >= 12;

-- Verify fix
SELECT 
  COUNT(*) as remaining_issues,
  'Regions with grid_col >= 12' as status
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND grid_col >= 12;

-- Should return 0




