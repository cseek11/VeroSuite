-- Comprehensive Dashboard Data Audit Script
-- Phase 0.2: Data audit and integrity checks
-- Run this to profile dashboard_regions, dashboard_layouts, ACLs, and events

-- ============================================================================
-- 1. REGION DATA INTEGRITY CHECKS
-- ============================================================================

-- Check for invalid grid bounds
SELECT 
  'Invalid Grid Bounds' as check_type,
  COUNT(*) as issue_count,
  json_agg(
    json_build_object(
      'id', id,
      'layout_id', layout_id,
      'grid_col', grid_col,
      'col_span', col_span,
      'total_cols', grid_col + col_span,
      'issue', CASE 
        WHEN grid_col + col_span > 12 THEN 'Exceeds 12 columns'
        WHEN grid_col >= 12 THEN 'Column >= 12 (invalid for 0-indexed)'
        WHEN grid_col < 0 THEN 'Negative column'
        WHEN col_span < 1 THEN 'Invalid col_span'
        WHEN row_span < 1 THEN 'Invalid row_span'
        ELSE 'Unknown'
      END
    )
  ) as affected_regions
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND (
    grid_col IS NULL 
    OR col_span IS NULL 
    OR row_span IS NULL
    OR grid_col + col_span > 12 
    OR grid_col >= 12
    OR grid_col < 0 
    OR col_span < 1 
    OR row_span < 1
  )
GROUP BY check_type;

-- Check for overlapping regions within same layout
WITH region_overlaps AS (
  SELECT 
    r1.id as region1_id,
    r1.layout_id,
    r1.grid_row as r1_row,
    r1.grid_col as r1_col,
    r1.row_span as r1_row_span,
    r1.col_span as r1_col_span,
    r2.id as region2_id,
    r2.grid_row as r2_row,
    r2.grid_col as r2_col,
    r2.row_span as r2_row_span,
    r2.col_span as r2_col_span
  FROM dashboard_regions r1
  JOIN dashboard_regions r2 ON 
    r1.layout_id = r2.layout_id 
    AND r1.id != r2.id
    AND r1.deleted_at IS NULL
    AND r2.deleted_at IS NULL
  WHERE 
    -- Check if rectangles overlap
    r1.grid_col < (r2.grid_col + r2.col_span) AND
    (r1.grid_col + r1.col_span) > r2.grid_col AND
    r1.grid_row < (r2.grid_row + r2.row_span) AND
    (r1.grid_row + r1.row_span) > r2.grid_row
)
SELECT 
  'Overlapping Regions' as check_type,
  COUNT(DISTINCT region1_id) as issue_count,
  json_agg(
    DISTINCT json_build_object(
      'layout_id', layout_id,
      'region1', json_build_object('id', region1_id, 'position', json_build_object('row', r1_row, 'col', r1_col, 'row_span', r1_row_span, 'col_span', r1_col_span)),
      'region2', json_build_object('id', region2_id, 'position', json_build_object('row', r2_row, 'col', r2_col, 'row_span', r2_row_span, 'col_span', r2_col_span))
    )
  ) as overlaps
FROM region_overlaps
GROUP BY check_type;

-- Check for NULL or invalid required fields
SELECT 
  'Missing Required Fields' as check_type,
  COUNT(*) as issue_count,
  json_agg(
    json_build_object(
      'id', id,
      'layout_id', layout_id,
      'tenant_id', tenant_id,
      'user_id', user_id,
      'region_type', region_type,
      'missing_fields', ARRAY[
        CASE WHEN layout_id IS NULL THEN 'layout_id' END,
        CASE WHEN tenant_id IS NULL THEN 'tenant_id' END,
        CASE WHEN user_id IS NULL THEN 'user_id' END,
        CASE WHEN region_type IS NULL THEN 'region_type' END
      ]
    )
  ) as affected_regions
FROM dashboard_regions
WHERE deleted_at IS NULL
  AND (
    layout_id IS NULL
    OR tenant_id IS NULL
    OR user_id IS NULL
    OR region_type IS NULL
  )
GROUP BY check_type;

-- ============================================================================
-- 2. LAYOUT DATA INTEGRITY CHECKS
-- ============================================================================

-- Check for orphaned layouts (no regions)
SELECT 
  'Orphaned Layouts' as check_type,
  COUNT(*) as issue_count,
  json_agg(
    json_build_object(
      'id', l.id,
      'name', l.name,
      'tenant_id', l.tenant_id,
      'user_id', l.user_id,
      'created_at', l.created_at
    )
  ) as orphaned_layouts
FROM dashboard_layouts l
LEFT JOIN dashboard_regions r ON l.id = r.layout_id AND r.deleted_at IS NULL
WHERE l.deleted_at IS NULL
  AND r.id IS NULL
GROUP BY check_type;

-- Check for layouts with invalid default flags
SELECT 
  'Invalid Default Layout Flags' as check_type,
  COUNT(*) as issue_count,
  json_agg(
    json_build_object(
      'id', id,
      'tenant_id', tenant_id,
      'user_id', user_id,
      'is_default', is_default,
      'name', name
    )
  ) as affected_layouts
FROM dashboard_layouts
WHERE deleted_at IS NULL
  AND (
    -- Multiple default layouts for same user
    id IN (
      SELECT id FROM (
        SELECT id, tenant_id, user_id, 
               COUNT(*) OVER (PARTITION BY tenant_id, user_id) as default_count
        FROM dashboard_layouts
        WHERE deleted_at IS NULL AND is_default = true
      ) sub
      WHERE default_count > 1
    )
  )
GROUP BY check_type;

-- ============================================================================
-- 3. ACL DATA INTEGRITY CHECKS
-- ============================================================================

-- Check for orphaned ACLs (region doesn't exist)
SELECT 
  'Orphaned ACLs' as check_type,
  COUNT(*) as issue_count,
  json_agg(
    json_build_object(
      'acl_id', a.id,
      'region_id', a.region_id,
      'target_type', a.target_type,
      'target_id', a.target_id
    )
  ) as orphaned_acls
FROM dashboard_region_acls a
LEFT JOIN dashboard_regions r ON a.region_id = r.id AND r.deleted_at IS NULL
WHERE r.id IS NULL
GROUP BY check_type;

-- ============================================================================
-- 4. EVENT DATA INTEGRITY CHECKS
-- ============================================================================

-- Check for events referencing non-existent layouts
SELECT 
  'Orphaned Events' as check_type,
  COUNT(*) as issue_count,
  json_agg(
    json_build_object(
      'event_id', e.id,
      'layout_id', e.layout_id,
      'event_type', e.event_type,
      'created_at', e.created_at
    )
  ) as orphaned_events
FROM dashboard_events e
LEFT JOIN dashboard_layouts l ON e.layout_id = l.id AND l.deleted_at IS NULL
WHERE l.id IS NULL
GROUP BY check_type;

-- ============================================================================
-- 5. CONFIG DATA VALIDATION
-- ============================================================================

-- Check for potentially malicious config content
SELECT 
  'Suspicious Config Content' as check_type,
  COUNT(*) as issue_count,
  json_agg(
    json_build_object(
      'id', id,
      'layout_id', layout_id,
      'region_type', region_type,
      'config_keys', jsonb_object_keys(config),
      'has_script_tags', config::text ILIKE '%<script%',
      'has_javascript', config::text ILIKE '%javascript:%'
    )
  ) as suspicious_regions
FROM dashboard_regions
WHERE deleted_at IS NULL
  AND (
    config::text ILIKE '%<script%'
    OR config::text ILIKE '%javascript:%'
    OR config::text ILIKE '%onerror=%'
    OR config::text ILIKE '%onclick=%'
  )
GROUP BY check_type;

-- ============================================================================
-- 6. SUMMARY STATISTICS
-- ============================================================================

SELECT 
  'Summary Statistics' as check_type,
  json_build_object(
    'total_layouts', (SELECT COUNT(*) FROM dashboard_layouts WHERE deleted_at IS NULL),
    'total_regions', (SELECT COUNT(*) FROM dashboard_regions WHERE deleted_at IS NULL),
    'total_acls', (SELECT COUNT(*) FROM dashboard_region_acls),
    'total_events', (SELECT COUNT(*) FROM dashboard_events),
    'regions_by_type', (
      SELECT json_object_agg(region_type, count)
      FROM (
        SELECT region_type, COUNT(*) as count
        FROM dashboard_regions
        WHERE deleted_at IS NULL
        GROUP BY region_type
      ) sub
    ),
    'layouts_by_tenant', (
      SELECT json_object_agg(tenant_id::text, count)
      FROM (
        SELECT tenant_id, COUNT(*) as count
        FROM dashboard_layouts
        WHERE deleted_at IS NULL
        GROUP BY tenant_id
      ) sub
    ),
    'avg_regions_per_layout', (
      SELECT COALESCE(AVG(region_count), 0)
      FROM (
        SELECT layout_id, COUNT(*) as region_count
        FROM dashboard_regions
        WHERE deleted_at IS NULL
        GROUP BY layout_id
      ) sub
    ),
    'max_regions_per_layout', (
      SELECT MAX(region_count)
      FROM (
        SELECT layout_id, COUNT(*) as region_count
        FROM dashboard_regions
        WHERE deleted_at IS NULL
        GROUP BY layout_id
      ) sub
    )
  ) as statistics;



