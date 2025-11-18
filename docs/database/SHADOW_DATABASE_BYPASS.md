# Shadow Database Bypass for Migration Creation

**Date:** 2025-11-18  
**Issue:** Shadow database validation failing because it doesn't have all existing tables  
**Solution:** Manually create migration file or use alternative approach

---

## Problem

When trying to create a migration, Prisma validates against a shadow database that doesn't have all the existing tables (like `Invoice`, `Payment`, etc.). This causes:

```
Error: P3006
Migration failed to apply cleanly to the shadow database.
Error code: P1014
The underlying table for model `public.invoices` does not exist.
```

---

## Solution Options

### Option 1: Manually Create Migration File (Recommended)

1. Create the migration directory:
```bash
mkdir -p backend/prisma/migrations/$(Get-Date -Format "yyyyMMddHHmmss")_add_invoice_templates_schedules_reminders
```

2. Create the migration SQL file manually based on the schema models.

3. Mark migration as applied:
```bash
npx prisma migrate resolve --applied <migration_name>
```

### Option 2: Use `prisma migrate deploy` (Production)

This bypasses shadow database validation:
```bash
npx prisma migrate deploy
```

**Note:** This applies pending migrations without validation. Use with caution.

### Option 3: Temporarily Disable Shadow Database

Add to `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // Optional - can be omitted
}
```

Then set `SHADOW_DATABASE_URL` to point to your actual database (not recommended for production).

---

## Recommended Approach

For this situation, **manually create the migration file** because:
1. We know exactly what tables need to be created
2. The schema is already defined
3. We can review the SQL before applying
4. It avoids shadow database issues

---

**Last Updated:** 2025-11-18

