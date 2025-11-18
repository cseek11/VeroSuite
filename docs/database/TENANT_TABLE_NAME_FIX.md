# Tenant Table Name Fix

**Date:** 2025-11-18  
**Issue:** Migration failed because base migration created `tenant` but schema expects `tenants`

---

## Problem

The base migration `20250823161445_enhanced_crm_schema` created a table named `"tenant"` (singular), but the Prisma schema uses `@@map("tenants")` which means the actual table name should be `"tenants"` (plural).

This caused the shadow database to fail when trying to apply new migrations that reference `"tenants"`.

---

## Solution Applied

Updated the base migration to use `"tenants"` (plural) to match the schema:

**Changes Made:**
1. ✅ `CREATE TABLE "tenant"` → `CREATE TABLE "tenants"`
2. ✅ `CONSTRAINT "tenant_pkey"` → `CONSTRAINT "tenants_pkey"`
3. ✅ `CREATE UNIQUE INDEX "tenant_domain_key" ON "tenant"` → `CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"`
4. ✅ All foreign key references `REFERENCES "tenant"("id")` → `REFERENCES "tenants"("id")`

---

## Important Notes

⚠️ **If you have an existing database with the `tenant` table:**

If your actual database already has a `tenant` table (singular), you have two options:

### Option 1: Rename the table in your database (Recommended for Development)

```sql
ALTER TABLE "tenant" RENAME TO "tenants";
ALTER TABLE "tenant_branding" RENAME CONSTRAINT "tenant_branding_tenant_id_fkey" TO "tenant_branding_tenant_id_fkey";
-- Update any other references if needed
```

### Option 2: Update the schema to match existing database

Change the Prisma schema to use `@@map("tenant")` instead of `@@map("tenants")`:

```prisma
model Tenant {
  // ... fields ...
  @@map("tenant")  // Change from "tenants" to "tenant"
  @@schema("public")
}
```

Then regenerate Prisma Client:
```bash
npx prisma generate
```

---

## Next Steps

1. ✅ Base migration updated to use `"tenants"`
2. ⏳ Run `npx prisma migrate dev --name add_invoice_templates_schedules_reminders`
3. ⏳ If you have an existing database, apply the table rename (Option 1) or update schema (Option 2)

---

## Verification

After fixing, verify the table name:

```sql
-- Check table name
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('tenant', 'tenants');
```

The result should show `tenants` (plural).

---

**Last Updated:** 2025-11-18

