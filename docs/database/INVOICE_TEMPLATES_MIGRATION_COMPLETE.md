# Invoice Templates, Schedules, and Reminders Migration

**Date:** 2025-11-18  
**Status:** Migration file created, ready to apply

---

## Summary

Successfully added three new models to the Prisma schema and created the migration file:

1. **InvoiceTemplate** - Template for invoice generation
2. **InvoiceSchedule** - Scheduled invoice generation (recurring/one-time)
3. **InvoiceReminderHistory** - History of invoice reminder communications

---

## What Was Done

### 1. Schema Updates

Added three new models to `backend/prisma/schema.prisma`:

- `InvoiceTemplate` (lines 970-989)
- `InvoiceSchedule` (lines 991-1019)
- `InvoiceReminderHistory` (lines 1021-1040)

### 2. Relations Added

**Tenant Model:**
- `InvoiceTemplate[]`
- `InvoiceSchedule[]`
- `InvoiceReminderHistory[]`

**User Model:**
- `InvoiceTemplate_InvoiceTemplate_created_byTousers[]`
- `InvoiceTemplate_InvoiceTemplate_updated_byTousers[]`
- `InvoiceSchedule_InvoiceSchedule_created_byTousers[]`
- `InvoiceSchedule_InvoiceSchedule_updated_byTousers[]`
- `InvoiceReminderHistory[]`

**Account Model:**
- `InvoiceSchedule[]`

**Invoice Model:**
- `InvoiceReminderHistory[]`

### 3. Migration File Created

**Location:** `backend/prisma/migrations/20251118180000_add_invoice_templates_schedules_reminders/migration.sql`

**Contents:**
- Creates `invoice_templates` table
- Creates `invoice_schedules` table
- Creates `invoice_reminder_history` table
- Creates all indexes
- Creates all foreign key constraints

---

## Next Steps

### Apply the Migration

When the database connection is available, run:

```bash
cd backend

# Option 1: Mark as applied (if tables already exist)
npx prisma migrate resolve --applied 20251118180000_add_invoice_templates_schedules_reminders

# Option 2: Apply the migration
npx prisma migrate deploy
```

### Generate Prisma Client

After migration is applied:

```bash
npx prisma generate
```

This will update the Prisma Client with the new models.

---

## Migration Details

### InvoiceTemplate Table
- **Primary Key:** `id` (UUID)
- **Indexes:** `tenant_id`, `name`
- **Foreign Keys:** `tenant_id` → `tenants.id`, `created_by` → `users.id`, `updated_by` → `users.id`

### InvoiceSchedule Table
- **Primary Key:** `id` (UUID)
- **Indexes:** `tenant_id`, `account_id`, `is_active`, `next_run_date`
- **Foreign Keys:** `tenant_id` → `tenants.id`, `account_id` → `accounts.id`, `created_by` → `users.id`, `updated_by` → `users.id`

### InvoiceReminderHistory Table
- **Primary Key:** `id` (UUID)
- **Indexes:** `tenant_id`, `invoice_id`, `sent_at` (DESC), `reminder_type`
- **Foreign Keys:** `tenant_id` → `tenants.id`, `invoice_id` → `Invoice.id`, `created_by` → `users.id`

---

## Notes

- All tables include `tenant_id` for tenant isolation
- All foreign keys use `ON DELETE CASCADE` for tenant relations
- All tables include audit fields (`created_at`, `updated_at`, `created_by`, `updated_by`)
- The migration was created manually to bypass shadow database validation issues

---

**Last Updated:** 2025-11-18

