# Migration Fix Instructions

**Date:** 2025-11-18  
**Issue:** P3006 - Migration failed to apply to shadow database  
**Root Cause:** Manually created migration directory without proper Prisma migration workflow

---

## Problem

The migration directory `add_invoice_templates_schedules_reminders` was created manually without following Prisma's migration workflow. This caused:
1. Missing timestamp prefix in directory name
2. Shadow database not having base schema (tenants table)
3. Migration order/tracking issues

---

## Solution

**Delete the manually created migration and let Prisma generate it properly.**

### Step 1: Remove Manual Migration

The manually created migration directory has been removed:
```bash
# Already done - directory removed
backend/prisma/migrations/add_invoice_templates_schedules_reminders/
```

### Step 2: Generate Migration Using Prisma

Run Prisma migrate dev to create the migration properly:

```bash
cd backend
npx prisma migrate dev --name add_invoice_templates_schedules_reminders
```

This will:
1. ✅ Create migration directory with proper timestamp (e.g., `20251118090439_add_invoice_templates_schedules_reminders`)
2. ✅ Generate migration.sql based on schema.prisma changes
3. ✅ Apply migration to development database
4. ✅ Update shadow database correctly
5. ✅ Regenerate Prisma Client

---

## Why This Approach?

**Prisma's Migration Workflow:**
- Prisma tracks migration order using timestamps
- Shadow database is created/updated based on migration history
- Manual migrations can break the migration chain
- Prisma needs to generate migrations to maintain consistency

**Benefits of Using `prisma migrate dev`:**
- ✅ Proper timestamp ordering
- ✅ Shadow database synchronization
- ✅ Migration history tracking
- ✅ Automatic Prisma Client regeneration
- ✅ Validation of schema changes

---

## Alternative: If You Need to Keep Manual SQL

If you have custom SQL that Prisma can't generate automatically:

1. **First, let Prisma create the migration:**
   ```bash
   cd backend
   npx prisma migrate dev --name add_invoice_templates_schedules_reminders --create-only
   ```

2. **Then edit the generated migration.sql:**
   - Location: `backend/prisma/migrations/[timestamp]_add_invoice_templates_schedules_reminders/migration.sql`
   - Add your custom SQL
   - Keep Prisma-generated SQL for schema changes

3. **Apply the migration:**
   ```bash
   npx prisma migrate dev
   ```

---

## Verification

After running the migration, verify:

```bash
# Check migration was created
ls backend/prisma/migrations/

# Verify database tables
npx prisma studio
# Or
psql -U your_user -d your_database -c "\dt public.invoice_*"
```

---

## Current Migration Status

**Existing Migrations:**
- ✅ `20250823161445_enhanced_crm_schema` - Base schema (tenants, users, accounts, etc.)
- ✅ `add_user_employee_fields` - User/employee fields

**Pending Migration:**
- ⏳ `add_invoice_templates_schedules_reminders` - Needs to be generated via Prisma

---

## Next Steps

1. ✅ Manual migration directory removed
2. ⏳ Run `npx prisma migrate dev --name add_invoice_templates_schedules_reminders`
3. ⏳ Verify migration applied successfully
4. ⏳ Test the new tables in Prisma Studio or database

---

**Last Updated:** 2025-11-18

