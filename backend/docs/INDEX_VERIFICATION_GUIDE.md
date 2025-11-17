# Database Index Verification Guide

**Status:** ⚠️ REQUIRES MANUAL VERIFICATION  
**Priority:** P0 - Critical  
**Estimated Time:** 10 minutes

---

## Why This Matters

The audit found that indexes are documented as "applied" but never independently verified. Without these indexes:
- Region queries will be 10-50x slower
- Overlap detection will be 100x slower
- Bulk imports will timeout (5 minutes instead of 1 second)

**We need proof the indexes actually exist in the database.**

---

## Option 1: Quick Verification (Recommended)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Verification Query

Copy and paste this query:

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
)
ORDER BY indexname;
```

### Step 3: Check Results

**✅ SUCCESS:** You should see **4 rows** returned:
```
indexname                        | indexdef
---------------------------------|------------------------------------
idx_regions_grid_bounds          | CREATE INDEX idx_regions_grid_bounds ON ...
idx_regions_layout_deleted       | CREATE INDEX idx_regions_layout_deleted ON ...
idx_regions_overlap_detection    | CREATE INDEX idx_regions_overlap_detection ON ...
idx_regions_tenant_layout        | CREATE INDEX idx_regions_tenant_layout ON ...
```

**❌ FAILURE:** If you see fewer than 4 rows, continue to "How to Apply Missing Indexes"

### Step 4: Verify Performance

Run this query to ensure the database is using the indexes:

```sql
EXPLAIN ANALYZE
SELECT * FROM dashboard_regions
WHERE layout_id = 'test-layout-id'
  AND deleted_at IS NULL
  AND grid_row < 10
  AND grid_col < 12
LIMIT 10;
```

**Look for:** `Index Scan using idx_regions_grid_bounds` or similar  
**❌ Red flag:** `Seq Scan on dashboard_regions` means indexes aren't being used

---

## Option 2: Programmatic Verification

If you have database access configured:

```bash
cd backend
npx ts-node scripts/verify-indexes.ts
```

This script will:
- Connect to your database
- Check for all 4 indexes
- Report which are missing
- Show performance impact

---

## How to Apply Missing Indexes

### If indexes are missing:

#### Method 1: Using Prisma Migrate

```bash
cd backend
npm run db:migrate
```

This will apply all pending migrations including the index migration.

#### Method 2: Manual SQL Execution

Open Supabase SQL Editor and run the entire contents of:
```
backend/prisma/migrations/20251114000000_add_critical_region_indexes.sql
```

Or copy this:

```sql
-- Layout + deleted queries index
CREATE INDEX IF NOT EXISTS idx_regions_layout_deleted 
  ON dashboard_regions(layout_id, deleted_at)
  WHERE deleted_at IS NULL;

-- Spatial index for overlap detection
CREATE INDEX IF NOT EXISTS idx_regions_grid_bounds 
  ON dashboard_regions(layout_id, grid_row, grid_col, row_span, col_span)
  WHERE deleted_at IS NULL;

-- Tenant + layout index
CREATE INDEX IF NOT EXISTS idx_regions_tenant_layout
  ON dashboard_regions(tenant_id, layout_id)
  WHERE deleted_at IS NULL;

-- Composite overlap detection index
CREATE INDEX IF NOT EXISTS idx_regions_overlap_detection
  ON dashboard_regions(layout_id, tenant_id, grid_row, grid_col, row_span, col_span)
  WHERE deleted_at IS NULL;

-- Update statistics
ANALYZE dashboard_regions;
```

---

## Document Your Results

After verification, update `backend/prisma/migrations/MIGRATION_STATUS.md`:

### If indexes exist ✅

Add this section:

```markdown
## Verification Completed

**Date:** [TODAY'S DATE]  
**Verified By:** [YOUR NAME]  
**Method:** Supabase SQL Editor

**Results:**
- ✅ idx_regions_layout_deleted - CONFIRMED
- ✅ idx_regions_grid_bounds - CONFIRMED  
- ✅ idx_regions_tenant_layout - CONFIRMED
- ✅ idx_regions_overlap_detection - CONFIRMED

**Query Performance Test:**
- Query execution time: [X] ms
- Query plan: Index Scan (confirmed)
- Status: PRODUCTION READY ✅
```

### If indexes were missing ❌

Add this section:

```markdown
## Verification & Remediation

**Date:** [TODAY'S DATE]  
**Verified By:** [YOUR NAME]

**Initial Status:** ❌ Indexes were NOT applied (despite documentation)  
**Action Taken:** Applied indexes manually via Supabase SQL Editor  
**Final Status:** ✅ All 4 indexes confirmed present

**Results:**
- ✅ idx_regions_layout_deleted - APPLIED & CONFIRMED
- ✅ idx_regions_grid_bounds - APPLIED & CONFIRMED
- ✅ idx_regions_tenant_layout - APPLIED & CONFIRMED
- ✅ idx_regions_overlap_detection - APPLIED & CONFIRMED

**Query Performance Test:**
- Before: [X] ms (Seq Scan)
- After: [X] ms (Index Scan)  
- Improvement: [X]x faster ✅
```

---

## Troubleshooting

### Problem: "permission denied for table pg_indexes"

**Solution:** You need admin access. Either:
1. Use the Supabase dashboard (SQL Editor) - it has proper permissions
2. Ask your DBA to run the verification query
3. Use a service role key instead of anon key

### Problem: "relation dashboard_regions does not exist"

**Solution:** The table hasn't been created yet. Run:
```bash
cd backend
npm run db:push
```

### Problem: Indexes exist but query still slow

**Possible causes:**
1. Statistics out of date - run `ANALYZE dashboard_regions;`
2. Too few rows for index to be useful (< 100 rows)
3. Query not matching index columns

---

## Next Steps After Verification

Once you've verified and documented:

1. ✅ Update `MIGRATION_STATUS.md` with verification results
2. ✅ Commit the documentation update
3. ✅ Move to Fix #3: CRM Workflow Tests
4. ✅ Continue with remaining Phase 1 fixes

---

**Questions?** Check the audit report: `docs/developer/EXECUTION_AUDIT_REPORT_NOVEMBER_2025.md`


