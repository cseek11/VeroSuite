# Migration Timeout Recovery Guide

**Date:** 2025-11-18  
**Issue:** P1002 - Database timeout during migration due to Cloudflare outage  
**Status:** ⚠️ **AWAITING CLOUDFLARE RESOLUTION**

---

## Error Details

```
Error: P1002
The database server at `db.iehzwglvmbtrlhdgofew.supabase.co:5432` was reached but timed out.

Context: Timed out trying to acquire a postgres advisory lock (SELECT pg_advisory_lock(72707369)). 
Elapsed: 10000ms.
```

## Root Cause

- **Cloudflare outage** affecting Supabase database connectivity
- Prisma migration uses advisory locks to prevent concurrent migrations
- Lock acquisition timed out after 10 seconds due to network issues

## Recovery Steps

### Step 1: Verify Cloudflare Status

1. Check Cloudflare status page: https://www.cloudflarestatus.com/
2. Verify Supabase status: https://status.supabase.com/
3. Wait for outage to resolve before proceeding

### Step 2: Check Migration Status

Once connectivity is restored, check current migration status:

```bash
cd backend
npx prisma migrate status
```

**Expected Output:**
- If migration is stuck: Shows pending migrations
- If migration completed: Shows "Database schema is up to date!"

### Step 3: Check for Stuck Advisory Locks

If migration is still stuck, check for advisory locks:

```sql
-- Run in Supabase SQL Editor
SELECT 
  locktype, 
  objid, 
  pid, 
  mode, 
  granted 
FROM pg_locks 
WHERE locktype = 'advisory' 
  AND objid = 72707369;
```

**If lock exists:**
- Check if process is still running
- If process is dead, the lock will be released automatically
- If process is alive, wait for it to complete or terminate it

### Step 4: Retry Migration

#### Option A: Using Prisma Migrate Deploy (Recommended)

This bypasses shadow database validation and applies pending migrations:

```bash
cd backend
npx prisma migrate deploy
```

**Pros:**
- ✅ Bypasses shadow database (faster)
- ✅ Applies only pending migrations
- ✅ Safe for production

**Cons:**
- ⚠️ Doesn't validate against shadow database
- ⚠️ Use with caution in development

#### Option B: Using Prisma Migrate Dev

If you need shadow database validation:

```bash
cd backend
npx prisma migrate dev --name add_invoice_templates_schedules_reminders
```

**Note:** This may fail if shadow database doesn't have all tables. See `docs/database/SHADOW_DATABASE_BYPASS.md` for alternatives.

#### Option C: Using Supabase SQL Editor (Most Reliable)

1. Log into Supabase dashboard
2. Navigate to SQL Editor
3. Copy migration SQL from: `backend/prisma/migrations/[migration_name]/migration.sql`
4. Paste and execute in SQL Editor
5. Mark migration as applied:

```bash
cd backend
npx prisma migrate resolve --applied [migration_name]
```

### Step 5: Verify Migration Success

After retrying, verify migration completed:

```bash
cd backend
npx prisma migrate status
```

**Expected:** "Database schema is up to date!"

Verify tables exist:

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('InvoiceTemplate', 'InvoiceSchedule', 'InvoiceReminderHistory');
```

## Prevention Strategies

### 1. Increase Connection Timeout

Add to `DATABASE_URL`:

```
?connect_timeout=30&pool_timeout=30
```

### 2. Use Supabase SQL Editor for Critical Migrations

For production migrations, use Supabase SQL Editor directly:
- More reliable during network issues
- Can monitor progress
- Easier to retry on failure

### 3. Check Network Status Before Migrations

Before running migrations:
1. Check Cloudflare status
2. Check Supabase status
3. Test database connectivity: `npx prisma db execute --stdin < /dev/null`

### 4. Use Migration Scripts with Retry Logic

Create wrapper scripts that:
- Check connectivity before running
- Retry on timeout with exponential backoff
- Log all attempts

## Current Migration Status

**Pending Migration:**
- `add_invoice_templates_schedules_reminders` - Invoice automation tables

**Migration Files:**
- `backend/prisma/migrations/20251118094644_add_invoice_templates_schedules_reminders/`
- `backend/prisma/migrations/20251118180000_add_invoice_templates_schedules_reminders/`

**Action Required:**
- Wait for Cloudflare outage to resolve
- Retry migration using one of the options above
- Verify migration completion before proceeding with development

## Related Documentation

- `docs/database/MIGRATION_DRIFT_RESOLUTION.md` - Migration drift issues
- `docs/database/SHADOW_DATABASE_BYPASS.md` - Shadow database bypass
- `docs/database/MIGRATION_FIX_INSTRUCTIONS.md` - Migration fix instructions
- `backend/docs/MIGRATION_INSTRUCTIONS.md` - General migration guide

---

**Last Updated:** 2025-11-18  
**Status:** Awaiting Cloudflare Resolution

