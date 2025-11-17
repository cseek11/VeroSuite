# Database Migration Instructions

## Overview
This document explains how to apply database migrations for the VeroField backend.

## Migration Files Location
All SQL migration files are located in: `backend/prisma/migrations/`

## Migration Status
See `backend/prisma/migrations/MIGRATION_STATUS.md` for current status of all migrations.

## Critical Migrations for Production Readiness

### Phase 1: Critical Performance Indexes ✅ APPLIED
**File:** `20251114000000_add_critical_region_indexes.sql`  
**Status:** ✅ **SUCCESSFULLY APPLIED** (2025-11-14)  
**Priority:** P1 - MUST RUN BEFORE PRODUCTION  
**Purpose:** Fixes N+1 query problem and adds critical performance indexes

**Indexes Added:**
1. `idx_regions_layout_deleted` - Layout + deleted_at composite index
2. `idx_regions_grid_bounds` - Spatial index for overlap detection
3. `idx_regions_tenant_layout` - Tenant + layout composite index  
4. `idx_regions_overlap_detection` - Optimized overlap detection with tenant isolation

**Expected Impact:**
- `findByLayoutId`: 10-50x faster
- `findOverlappingRegions`: 100x faster  
- Bulk imports: 300x faster (5 min → 1 sec for 100 regions)

## Running Migrations

### Option 1: Using the Migration Runner Script (Recommended)
```bash
cd backend
npx ts-node scripts/run-migration.ts prisma/migrations/20251114000000_add_critical_region_indexes.sql
```

### Option 2: Using Supabase SQL Editor (Most Reliable)
1. Log into your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the contents of `20251114000000_add_critical_region_indexes.sql`
4. Paste into the SQL editor
5. Click "Run" to execute
6. Verify success in the Results pane

### Option 3: Using psql Command Line
```bash
# Set your database connection string
export DATABASE_URL="postgresql://user:password@host:port/database"

# Run the migration
psql $DATABASE_URL -f prisma/migrations/20251114000000_add_critical_region_indexes.sql
```

## Verifying Migrations

### Check if Indexes Exist
Run this query in Supabase SQL Editor or psql:

```sql
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
);
```

Expected: 4 rows returned (one for each index)

### Check Index Usage (After Running for a While)
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename = 'dashboard_regions'
AND indexname LIKE 'idx_regions_%'
ORDER BY idx_scan DESC;
```

## Rollback Instructions

### To Remove These Indexes (NOT RECOMMENDED)
Only do this if you need to rollback for troubleshooting:

```sql
DROP INDEX IF EXISTS idx_regions_layout_deleted;
DROP INDEX IF EXISTS idx_regions_grid_bounds;
DROP INDEX IF EXISTS idx_regions_tenant_layout;
DROP INDEX IF EXISTS idx_regions_overlap_detection;
```

## Migration Order

If running multiple migrations, execute them in this order:

1. `create_dashboard_regions.sql` (should already be run)
2. `create_dashboard_events_table.sql` (should already be run)
3. `create_dashboard_templates.sql` (should already be run)
4. **`20251114000000_add_critical_region_indexes.sql`** ← Run this for Phase 1
5. `phase4_performance_indexes.sql` (optional - contains additional indexes)

## Troubleshooting

### Error: "relation 'dashboard_regions' does not exist"
**Solution:** Run the base migrations first:
```bash
npx ts-node scripts/run-migration.ts prisma/migrations/create_dashboard_regions.sql
```

### Error: "permission denied"
**Solution:** Ensure you're using the Supabase service role key, not the anon key:
```bash
export SUPABASE_SERVICE_KEY="your-service-key-here"
```

### Error: "index already exists"
**Solution:** This is fine! The migration uses `IF NOT EXISTS` so it's idempotent. The indexes are already present.

## Post-Migration Verification

After running migrations, verify performance improvements:

### 1. Test Overlap Detection Query
```sql
EXPLAIN ANALYZE
SELECT * FROM dashboard_regions
WHERE layout_id = 'some-layout-id'
  AND tenant_id = 'some-tenant-id'
  AND deleted_at IS NULL
  AND grid_row < 5
  AND grid_col < 5;
```

Expected: Should show "Index Scan" using `idx_regions_overlap_detection`

### 2. Test Layout Query
```sql
EXPLAIN ANALYZE
SELECT * FROM dashboard_regions
WHERE layout_id = 'some-layout-id'
  AND deleted_at IS NULL
ORDER BY display_order;
```

Expected: Should show "Index Scan" using `idx_regions_layout_deleted`

### 3. Check Query Performance
- Before indexes: ~500-1000ms for 100 regions
- After indexes: ~5-10ms for 100 regions

## Production Deployment Checklist

- [x] Backup database before running migrations ✅
- [x] Test migrations in staging environment first ✅
- [x] Run migrations during maintenance window (low traffic) ✅
- [x] Verify indexes were created successfully ✅
- [ ] Monitor query performance after deployment (ongoing)
- [ ] Check for any slow query alerts (ongoing)
- [ ] Verify application still functions correctly (in progress)

**Last Migration Applied:** 2025-11-14 - All Phase 1 indexes successfully created

## Support

If you encounter issues running migrations:
1. Check the Supabase dashboard logs
2. Review the error message carefully
3. Try running via SQL Editor instead of script
4. Contact DevOps team if database permissions are needed

