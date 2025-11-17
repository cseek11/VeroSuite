# Migration: Add stripe_customer_id to accounts table

**Date:** 2025-11-16  
**Status:** ✅ Ready to Apply  
**Priority:** Medium

## Overview

This migration adds the `stripe_customer_id` field to the `accounts` table to store Stripe customer IDs for reuse in recurring payments.

## Migration File

**File:** `backend/prisma/migrations/20250127000000_add_stripe_customer_id.sql`

## What This Migration Does

1. Adds `stripe_customer_id` column (VARCHAR(255), nullable) to `accounts` table
2. Creates index on `stripe_customer_id` for faster lookups
3. Adds column comment for documentation

## How to Apply

### Option 1: Supabase SQL Editor (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Open the file: `backend/prisma/migrations/20250127000000_add_stripe_customer_id.sql`
3. Copy all contents
4. Paste into SQL Editor
5. Click "Run"
6. Verify success

### Option 2: Using psql

```bash
cd backend
psql $DATABASE_URL -f prisma/migrations/20250127000000_add_stripe_customer_id.sql
```

### Option 3: Using Prisma (if schema is synced)

```bash
cd backend
npx prisma db push
```

## Verify Migration

After applying, run this query:

```sql
-- Check column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'accounts'
AND column_name = 'stripe_customer_id';

-- Should return:
-- column_name: stripe_customer_id
-- data_type: character varying
-- is_nullable: YES

-- Check index exists
SELECT indexname
FROM pg_indexes
WHERE tablename = 'accounts'
AND indexname = 'idx_accounts_stripe_customer_id';

-- Should return: idx_accounts_stripe_customer_id
```

## Rollback (if needed)

```sql
-- Remove index
DROP INDEX IF EXISTS idx_accounts_stripe_customer_id;

-- Remove column
ALTER TABLE accounts DROP COLUMN IF EXISTS stripe_customer_id;
```

## Impact

- **Breaking Changes:** None (column is nullable)
- **Data Loss:** None
- **Performance:** Minimal (index adds small overhead)
- **Dependencies:** None

## Related Changes

- Backend: `backend/src/billing/billing.service.ts` - Updated to store/reuse Stripe customer IDs
- Schema: `backend/prisma/schema.prisma` - Added `stripe_customer_id` field

## Notes

- Column is nullable to support existing accounts
- Index only includes non-null values for efficiency
- Stripe customer IDs are typically 18-24 characters (e.g., `cus_1234567890abcdef`)

