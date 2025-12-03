# Migration Application Guide

**Date:** 2025-11-24  
**Purpose:** Guide for applying the write_queue migration when database is available

---

## Migration File

**Location:** `libs/common/prisma/migrations/20251124130000_add_write_queue/migration.sql`

**What it creates:**
- `compliance.write_queue` table
- Index on `status, created_at`
- RLS policies

---

## Application Methods

### Method 1: Using Prisma (Recommended)

**From the correct directory:**
```bash
cd libs/common/prisma
npx prisma migrate deploy
```

**Or with schema flag from anywhere:**
```bash
npx prisma migrate deploy --schema=libs/common/prisma/schema.prisma
```

**Note:** If you get timeout errors, try again later or use Method 2.

---

### Method 2: Direct SQL (Alternative)

**Using psql:**
```bash
psql $DATABASE_URL -f scripts/apply-write-queue-direct.sql
```

**Or copy SQL directly:**
1. Open: `scripts/apply-write-queue-direct.sql`
2. Copy the SQL content
3. Run in your PostgreSQL client (pgAdmin, DBeaver, etc.)

**Or using PowerShell script:**
```powershell
.\scripts\apply-write-queue-migration.ps1
```

---

### Method 3: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy SQL from `scripts/apply-write-queue-direct.sql`
4. Paste and run

---

## Verification

After applying the migration, verify it worked:

```sql
-- Check table exists
SELECT COUNT(*) FROM compliance.write_queue;

-- Check table structure
\d compliance.write_queue

-- Check index exists
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'compliance' 
AND tablename = 'write_queue';
```

**Expected result:**
- Table exists with 0 rows
- Index `idx_write_queue_status` exists
- RLS is enabled

---

## Troubleshooting

### Issue: "Database timeout"

**Cause:** Database is busy or connection is slow

**Solutions:**
1. Wait a few minutes and try again
2. Use direct SQL method (Method 2)
3. Check database connection string
4. Verify database is accessible

### Issue: "Table already exists"

**Cause:** Migration was already applied

**Solution:** This is fine - the migration uses `IF NOT EXISTS`, so it's safe to run again.

### Issue: "Permission denied"

**Cause:** Database user doesn't have CREATE TABLE permission

**Solution:** Use a user with appropriate permissions, or contact database administrator.

---

## Next Steps After Migration

1. **Regenerate Prisma Client:**
   ```bash
   cd libs/common/prisma
   npx prisma generate
   ```

2. **Start API Server:**
   ```bash
   cd apps/api
   npm run start:dev
   ```

3. **Verify Queue Processor:**
   - Check logs for: `Queue processor started (database-based)`
   - Queue should process jobs every 5 seconds

---

**Last Updated:** 2025-11-30



