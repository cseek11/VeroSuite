# Safe Data Integrity Fix Guide

## Current Status
Your database has **4 regions with invalid grid positions**. These are causing the validation errors you're seeing.

## Step 1: Identify the Problem Regions

Run this query first to see which regions have issues:

```sql
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
```

## Step 2: Review the Results

Check the output to see:
- Which regions have issues
- What type of issue each has
- Whether you want to fix them automatically or manually

## Step 3: Fix the Issues

### Option A: Automatic Fix (Recommended)

Run the fix script:

```sql
\i backend/fix-data-integrity-issues.sql
```

This will:
- Clamp `col_span` to fit within 12 columns
- Set negative `grid_col` values to 0
- Ensure `col_span` and `row_span` are at least 1

### Option B: Manual Fix

If you prefer to fix them manually, use the UPDATE statements from `backend/fix-data-integrity-issues.sql` one at a time.

## Step 4: Verify the Fix

After running the fixes, verify:

```sql
SELECT 
  COUNT(*) as remaining_issues
FROM dashboard_regions
WHERE deleted_at IS NULL 
  AND (grid_col + col_span > 12 OR grid_col < 0 OR col_span < 1 OR row_span < 1);
```

Should return `0`.

## Step 5: Test the Dashboard

After fixing the data integrity issues:
1. Restart your backend server
2. Refresh your frontend
3. Try dragging/resizing regions
4. The validation errors should be significantly reduced

## Why This Happened

These invalid positions likely occurred because:
1. Regions were created before validation was fully implemented
2. Manual database edits bypassed validation
3. A bug in an earlier version allowed invalid positions

The fixes we've implemented (both frontend and backend validation) will prevent this from happening again.




