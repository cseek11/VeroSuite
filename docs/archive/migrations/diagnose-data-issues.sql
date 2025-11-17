-- Detailed Diagnosis of Data Integrity Issues
-- Run this to see exactly what's wrong with each region

SELECT 
  id,
  layout_id,
  tenant_id,
  grid_col,
  col_span,
  grid_row,
  row_span,
  grid_col + col_span as total_cols,
  CASE 
    WHEN grid_col IS NULL THEN 'grid_col is NULL'
    WHEN col_span IS NULL THEN 'col_span is NULL'
    WHEN row_span IS NULL THEN 'row_span is NULL'
    WHEN grid_col + col_span > 12 THEN CONCAT('Exceeds bounds: col(', grid_col, ') + span(', col_span, ') = ', grid_col + col_span, ' > 12')
    WHEN grid_col < 0 THEN CONCAT('Negative column: ', grid_col)
    WHEN col_span < 1 THEN CONCAT('Invalid col_span: ', col_span)
    WHEN row_span < 1 THEN CONCAT('Invalid row_span: ', row_span)
    ELSE 'Unknown issue'
  END as issue_description,
  created_at,
  updated_at
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
  )
ORDER BY layout_id, grid_row, grid_col;




