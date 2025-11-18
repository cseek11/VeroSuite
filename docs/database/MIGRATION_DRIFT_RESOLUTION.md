# Migration Drift Resolution Guide

**Date:** 2025-11-18  
**Issue:** Prisma detected schema drift - database has tables/indexes not in migration history  
**Status:** ⚠️ **CRITICAL - DO NOT RESET DATABASE**

---

## ⚠️ CRITICAL WARNING

**DO NOT proceed with the database reset!** It will:
- ❌ **DELETE ALL DATA** in the database
- ❌ **DROP ALL TABLES** (auth, public schemas)
- ❌ **PERMANENTLY LOSE** all existing data

---

## What's Happening

Prisma detected that your **actual database schema** doesn't match your **migration history**. This means:

1. **Database has tables** that aren't in your migration files
2. **Database has indexes/foreign keys** that aren't tracked
3. **Migration history is incomplete** or out of sync

This commonly happens when:
- Database was created/modified outside Prisma migrations
- Migrations were deleted or lost
- Database was restored from a backup
- Manual SQL changes were made

---

## Safe Resolution Options

### Option 1: Create Baseline Migration (Recommended)

Create a migration that matches your current database state without changing anything:

```bash
cd backend

# 1. Introspect current database
npx prisma db pull

# 2. This updates schema.prisma to match database
# 3. Create a baseline migration
npx prisma migrate dev --name baseline_existing_schema --create-only

# 4. Mark it as applied (since database already has these changes)
npx prisma migrate resolve --applied baseline_existing_schema
```

**Pros:**
- ✅ No data loss
- ✅ Migration history matches database
- ✅ Can continue with new migrations

**Cons:**
- ⚠️ Large migration file (but that's okay for baseline)

---

### Option 2: Mark Existing Migrations as Applied

If your database already has the changes from existing migrations:

```bash
cd backend

# Mark each migration as already applied
npx prisma migrate resolve --applied 20250823161445_enhanced_crm_schema
npx prisma migrate resolve --applied add_user_employee_fields

# Then create new migration for invoice templates
npx prisma migrate dev --name add_invoice_templates_schedules_reminders
```

**Pros:**
- ✅ Quick fix
- ✅ No data loss
- ✅ Can continue with new migrations

**Cons:**
- ⚠️ Assumes database matches migration state

---

### Option 3: Introspect and Create New Schema

Pull the current database schema and create a fresh migration:

```bash
cd backend

# 1. Backup your current schema.prisma
cp prisma/schema.prisma prisma/schema.prisma.backup

# 2. Pull current database schema
npx prisma db pull

# 3. Review changes in schema.prisma
# 4. Create migration for ONLY new changes (invoice templates)
npx prisma migrate dev --name add_invoice_templates_schedules_reminders
```

**Pros:**
- ✅ Schema matches database exactly
- ✅ No data loss
- ✅ Clean state

**Cons:**
- ⚠️ Need to review schema changes carefully

---

### Option 4: Create Migration for Missing Pieces Only

Create a migration that adds ONLY what's missing (invoice templates, schedules, reminders):

```bash
cd backend

# 1. Ensure schema.prisma has InvoiceTemplate, InvoiceSchedule, InvoiceReminderHistory models
# 2. Create migration for ONLY these new tables
npx prisma migrate dev --name add_invoice_templates_schedules_reminders --create-only

# 3. Review the generated migration.sql
# 4. Apply it
npx prisma migrate deploy
```

**Pros:**
- ✅ Only adds new tables
- ✅ No changes to existing tables
- ✅ Minimal risk

**Cons:**
- ⚠️ Migration history still won't match existing tables

---

## Recommended Approach

**For Development Database:**

1. **Use Option 1 (Baseline Migration)** - Safest and most complete
2. Then create new migration for invoice templates

**For Production Database:**

1. **Use Option 4 (Add Missing Only)** - Minimal changes
2. Or use `prisma migrate deploy` to apply only new migrations

---

## Step-by-Step: Option 1 (Baseline Migration)

```bash
cd backend

# Step 1: Pull current database schema
npx prisma db pull

# Step 2: Review schema.prisma changes
# (Check what Prisma detected)

# Step 3: Create baseline migration
npx prisma migrate dev --name baseline_existing_schema --create-only

# Step 4: Review the generated migration
# It should have CREATE TABLE IF NOT EXISTS statements

# Step 5: Mark as applied (since database already has these)
npx prisma migrate resolve --applied baseline_existing_schema

# Step 6: Now create migration for invoice templates
npx prisma migrate dev --name add_invoice_templates_schedules_reminders
```

---

## What the Drift Shows

The drift detection shows your database has:

**Auth Schema Tables (Supabase):**
- `users`, `sessions`, `refresh_tokens`, `mfa_factors`, etc.
- These are from Supabase Auth - **DO NOT migrate these**

**Public Schema Tables:**
- All your application tables (tenants, accounts, invoices, etc.)
- Many indexes and foreign keys
- These need to be in migration history

**Key Issue:**
- Migration `20250823161445_enhanced_crm_schema` doesn't include all the tables/indexes that exist
- Database was likely modified outside of Prisma migrations

---

## Important Notes

1. **Supabase Auth Tables:** The `auth` schema tables are managed by Supabase - don't include them in migrations
2. **Existing Data:** Your database has real data - protect it!
3. **Migration History:** The goal is to sync migration history with actual database state
4. **Future Migrations:** After fixing this, always use `prisma migrate dev` for changes

---

## Verification

After resolving drift:

```bash
# Check migration status
npx prisma migrate status

# Should show: "Database schema is up to date!"
```

---

## If You Accidentally Reset

If you already reset the database:

1. **Restore from backup** (if available)
2. Or **re-run all migrations** in order
3. Or **restore data** from exports

---

## Next Steps

1. ⚠️ **DO NOT** answer "y" to the reset prompt
2. ✅ Choose one of the resolution options above
3. ✅ Follow the step-by-step guide
4. ✅ Verify migration status after resolution

---

**Last Updated:** 2025-11-18  
**Status:** Awaiting User Decision

