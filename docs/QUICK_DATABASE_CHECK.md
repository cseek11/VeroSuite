# Quick Database Verification Guide

## Quick Check (Single Query)

Run this single query to get a summary:

```sql
SELECT 
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('dashboard_regions', 'dashboard_region_acls', 'dashboard_events')) as tables_exist,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'dashboard_regions' AND column_name = 'version') as version_column_exists,
  (SELECT COUNT(*) FROM pg_tables WHERE tablename = 'dashboard_regions' AND rowsecurity = true) as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'dashboard_regions') as rls_policies_count,
  (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'dashboard_regions' AND (indexname LIKE '%layout_id%' OR indexname LIKE '%tenant_id%' OR indexname LIKE '%grid_position%' OR indexname LIKE '%version%')) as critical_indexes_count,
  (SELECT COUNT(*) FROM dashboard_regions WHERE deleted_at IS NULL AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1)) as data_integrity_issues;
```

**Expected Results:**
- `tables_exist`: Should be `3` (dashboard_regions, dashboard_region_acls, dashboard_events)
- `version_column_exists`: Should be `1` (version column exists)
- `rls_enabled`: Should be `1` (RLS is enabled)
- `rls_policies_count`: Should be at least `3` (view, insert, update policies)
- `critical_indexes_count`: Should be at least `4` (layout_id, tenant_id, grid_position, version indexes)
- `data_integrity_issues`: Should be `0` (no invalid grid positions)

## Detailed Checks

For detailed output, run `backend/verify-database-simple.sql` which runs each check separately.

## Common Issues

### If `version_column_exists` is 0:
```sql
-- Run this migration:
\i backend/prisma/migrations/enhance_dashboard_regions_rls_security.sql
```

### If `rls_enabled` is 0:
```sql
-- Run this migration:
\i backend/prisma/migrations/create_dashboard_regions.sql
```

### If `rls_policies_count` is less than 3:
```sql
-- Run these migrations in order:
\i backend/prisma/migrations/create_dashboard_regions.sql
\i backend/prisma/migrations/enhance_dashboard_regions_rls_security.sql
```

### If `data_integrity_issues` is greater than 0:
```sql
-- Check what's wrong:
SELECT id, grid_col, col_span, grid_row, row_span 
FROM dashboard_regions 
WHERE deleted_at IS NULL 
  AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1);
```




