# Database Migration: Invoice Templates, Schedules, and Reminder History

**Date:** 2025-11-18  
**Migration Name:** `add_invoice_templates_schedules_reminders`  
**Status:** Ready to Apply

---

## Overview

This migration adds three new tables to support the billing automation system:
1. **invoice_templates** - Reusable invoice templates with items and tags
2. **invoice_schedules** - Automated invoice scheduling (recurring and one-time)
3. **invoice_reminder_history** - Tracking of reminder communications sent

---

## Tables Created

### 1. invoice_templates

Stores reusable invoice templates that can be applied to create invoices quickly.

**Columns:**
- `id` (UUID, Primary Key) - Auto-generated UUID
- `tenant_id` (UUID, Foreign Key → tenants.id) - Tenant isolation
- `name` (VARCHAR(255)) - Template name
- `description` (TEXT, nullable) - Template description
- `items` (JSONB) - Invoice items array (default: `[]`)
- `tags` (TEXT[]) - Categorization tags (default: `[]`)
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp
- `created_by` (UUID, Foreign Key → users.id) - Creator user ID
- `updated_by` (UUID, Foreign Key → users.id) - Last updater user ID

**Indexes:**
- `invoice_templates_tenant_id_idx` - For tenant-scoped queries
- `invoice_templates_name_idx` - For name-based searches

**Foreign Keys:**
- `tenant_id` → `tenants.id` (CASCADE delete)
- `created_by` → `users.id` (RESTRICT delete)
- `updated_by` → `users.id` (RESTRICT delete)

---

### 2. invoice_schedules

Stores scheduled invoices that can be automatically generated on a recurring or one-time basis.

**Columns:**
- `id` (UUID, Primary Key) - Auto-generated UUID
- `tenant_id` (UUID, Foreign Key → tenants.id) - Tenant isolation
- `account_id` (UUID, Foreign Key → accounts.id) - Customer account
- `template_id` (UUID, nullable) - Optional template reference
- `schedule_type` (VARCHAR(20)) - 'recurring' or 'one-time'
- `frequency` (VARCHAR(20), nullable) - 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
- `start_date` (DATE) - Schedule start date
- `end_date` (DATE, nullable) - Schedule end date (for recurring)
- `next_run_date` (TIMESTAMPTZ) - Next scheduled execution date
- `is_active` (BOOLEAN) - Whether schedule is active (default: true)
- `amount` (DECIMAL(10,2), nullable) - Fixed amount (if not using template)
- `description` (TEXT, nullable) - Schedule description
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp
- `created_by` (UUID, Foreign Key → users.id) - Creator user ID
- `updated_by` (UUID, Foreign Key → users.id) - Last updater user ID

**Indexes:**
- `invoice_schedules_tenant_id_idx` - For tenant-scoped queries
- `invoice_schedules_account_id_idx` - For account-based queries
- `invoice_schedules_is_active_idx` - For filtering active schedules
- `invoice_schedules_next_run_date_idx` - For finding schedules to execute

**Foreign Keys:**
- `tenant_id` → `tenants.id` (CASCADE delete)
- `(tenant_id, account_id)` → `accounts(tenant_id, id)` (CASCADE delete, composite key)
- `created_by` → `users.id` (RESTRICT delete)
- `updated_by` → `users.id` (RESTRICT delete)

**Note:** `template_id` is nullable and does not have a foreign key constraint by default. If you want to enforce referential integrity, uncomment the foreign key constraint in the migration SQL.

---

### 3. invoice_reminder_history

Tracks all reminder communications sent for invoices (email, SMS, letter).

**Columns:**
- `id` (UUID, Primary Key) - Auto-generated UUID
- `tenant_id` (UUID, Foreign Key → tenants.id) - Tenant isolation
- `invoice_id` (UUID, Foreign Key → invoices.id) - Related invoice
- `reminder_type` (VARCHAR(20)) - 'email', 'sms', or 'letter'
- `status` (VARCHAR(20)) - 'sent', 'failed', or 'pending' (default: 'sent')
- `message` (TEXT, nullable) - Reminder message content
- `sent_at` (TIMESTAMPTZ) - When reminder was sent (default: CURRENT_TIMESTAMP)
- `created_by` (UUID, Foreign Key → users.id) - Creator user ID

**Indexes:**
- `invoice_reminder_history_tenant_id_idx` - For tenant-scoped queries
- `invoice_reminder_history_invoice_id_idx` - For invoice-based queries
- `invoice_reminder_history_sent_at_idx` (DESC) - For chronological sorting
- `invoice_reminder_history_reminder_type_idx` - For filtering by type

**Foreign Keys:**
- `tenant_id` → `tenants.id` (CASCADE delete)
- `invoice_id` → `invoices.id` (CASCADE delete)
- `created_by` → `users.id` (RESTRICT delete)

---

## Migration SQL

The complete migration SQL is located at:
```
backend/prisma/migrations/add_invoice_templates_schedules_reminders/migration.sql
```

---

## How to Apply

### Option 1: Using Prisma Migrate (Recommended)

```bash
cd backend
npx prisma migrate dev --name add_invoice_templates_schedules_reminders
```

This will:
1. Create the migration file
2. Apply it to your development database
3. Regenerate Prisma Client

### Option 2: Using Prisma Migrate Deploy (Production)

```bash
cd backend
npx prisma migrate deploy
```

This applies pending migrations to production without creating new ones.

### Option 3: Manual SQL Execution

If you need to apply the migration manually:

```bash
# Connect to your database
psql -U your_user -d your_database

# Run the migration SQL
\i backend/prisma/migrations/add_invoice_templates_schedules_reminders/migration.sql
```

---

## Rollback

To rollback this migration:

```sql
-- Drop foreign keys first
ALTER TABLE "public"."invoice_reminder_history" DROP CONSTRAINT IF EXISTS "invoice_reminder_history_created_by_fkey";
ALTER TABLE "public"."invoice_reminder_history" DROP CONSTRAINT IF EXISTS "invoice_reminder_history_invoice_id_fkey";
ALTER TABLE "public"."invoice_reminder_history" DROP CONSTRAINT IF EXISTS "invoice_reminder_history_tenant_id_fkey";

ALTER TABLE "public"."invoice_schedules" DROP CONSTRAINT IF EXISTS "invoice_schedules_updated_by_fkey";
ALTER TABLE "public"."invoice_schedules" DROP CONSTRAINT IF EXISTS "invoice_schedules_created_by_fkey";
ALTER TABLE "public"."invoice_schedules" DROP CONSTRAINT IF EXISTS "invoice_schedules_account_id_tenant_id_fkey";
ALTER TABLE "public"."invoice_schedules" DROP CONSTRAINT IF EXISTS "invoice_schedules_tenant_id_fkey";

ALTER TABLE "public"."invoice_templates" DROP CONSTRAINT IF EXISTS "invoice_templates_updated_by_fkey";
ALTER TABLE "public"."invoice_templates" DROP CONSTRAINT IF EXISTS "invoice_templates_created_by_fkey";
ALTER TABLE "public"."invoice_templates" DROP CONSTRAINT IF EXISTS "invoice_templates_tenant_id_fkey";

-- Drop indexes
DROP INDEX IF EXISTS "public"."invoice_reminder_history_reminder_type_idx";
DROP INDEX IF EXISTS "public"."invoice_reminder_history_sent_at_idx";
DROP INDEX IF EXISTS "public"."invoice_reminder_history_invoice_id_idx";
DROP INDEX IF EXISTS "public"."invoice_reminder_history_tenant_id_idx";

DROP INDEX IF EXISTS "public"."invoice_schedules_next_run_date_idx";
DROP INDEX IF EXISTS "public"."invoice_schedules_is_active_idx";
DROP INDEX IF EXISTS "public"."invoice_schedules_account_id_idx";
DROP INDEX IF EXISTS "public"."invoice_schedules_tenant_id_idx";

DROP INDEX IF EXISTS "public"."invoice_templates_name_idx";
DROP INDEX IF EXISTS "public"."invoice_templates_tenant_id_idx";

-- Drop tables
DROP TABLE IF EXISTS "public"."invoice_reminder_history";
DROP TABLE IF EXISTS "public"."invoice_schedules";
DROP TABLE IF EXISTS "public"."invoice_templates";
```

---

## Verification

After applying the migration, verify the tables were created:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('invoice_templates', 'invoice_schedules', 'invoice_reminder_history');

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('invoice_templates', 'invoice_schedules', 'invoice_reminder_history');

-- Check foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('invoice_templates', 'invoice_schedules', 'invoice_reminder_history');
```

---

## Dependencies

This migration requires the following tables to exist:
- `tenants` - For tenant isolation
- `users` - For created_by/updated_by references
- `accounts` - For invoice schedule account references
- `invoices` - For reminder history invoice references

---

## Notes

1. **Tenant Isolation:** All tables include `tenant_id` with CASCADE delete to ensure data isolation
2. **Composite Foreign Key:** `invoice_schedules` uses a composite foreign key `(tenant_id, account_id)` to reference `accounts`
3. **Optional Template Reference:** `template_id` in `invoice_schedules` is nullable and does not have a foreign key constraint by default
4. **JSONB for Items:** `invoice_templates.items` uses JSONB for flexible item storage
5. **Array Support:** `invoice_templates.tags` uses PostgreSQL array type
6. **Default Values:** All tables include sensible defaults (timestamps, empty arrays, active status)

---

## Related Documentation

- Prisma Schema: `backend/prisma/schema.prisma`
- API Documentation: `docs/API.md`
- Engineering Decision: `docs/engineering-decisions.md` (Billing Automation API Integration)

---

**Last Updated:** 2025-11-18  
**Migration Status:** Ready to Apply

