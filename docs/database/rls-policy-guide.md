# RLS Policy Implementation Guide

**Version:** 1.0.0  
**Last Updated:** 2025-11-23  
**Purpose:** Guide for implementing Row Level Security policies in VeroField

---

## Overview

Row Level Security (RLS) provides database-level tenant isolation, complementing application-level isolation (R01). This guide covers how to implement RLS policies for tenant-scoped tables.

### Why RLS?

- **Defense-in-depth:** Even if application code fails, database enforces isolation
- **Database-level enforcement:** Cannot be bypassed by application bugs
- **Automatic filtering:** PostgreSQL applies policies transparently
- **Performance:** Indexed properly, RLS adds minimal overhead

---

## Quick Start

### 1. Enable RLS on Table

```sql
ALTER TABLE "your_table" ENABLE ROW LEVEL SECURITY;
```

### 2. Create Tenant Isolation Policy

```sql
CREATE POLICY "tenant_isolation_policy" ON "your_table"
    USING (tenant_id::text = current_setting('app.tenant_id', true));
```

### 3. Set Tenant Context in Application

```typescript
// Use withTenant() wrapper
await this.db.withTenant(tenantId, async () => {
    return await this.prisma.yourTable.findMany();
});
```

---

## Complete Migration Example

```sql
-- Create table with tenant_id
CREATE TABLE "customers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index on tenant_id for performance
CREATE INDEX "idx_customers_tenant_id" ON "customers"("tenant_id");

-- Enable RLS
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policy
CREATE POLICY "tenant_isolation_policy" ON "customers"
    USING (tenant_id::text = current_setting('app.tenant_id', true));

-- Add foreign key to tenant table
ALTER TABLE "customers" 
    ADD CONSTRAINT "fk_customers_tenant" 
    FOREIGN KEY ("tenant_id") 
    REFERENCES "tenant"("id") 
    ON DELETE CASCADE;
```

---

## Policy Patterns

### 1. Basic Tenant Isolation (Most Common)

```sql
CREATE POLICY "tenant_isolation_policy" ON "table_name"
    USING (tenant_id::text = current_setting('app.tenant_id', true));
```

**When to use:** All tenant-scoped tables

### 2. Multi-Column Tenant Check

```sql
CREATE POLICY "tenant_isolation_policy" ON "table_name"
    USING (
        tenant_id::text = current_setting('app.tenant_id', true)
        OR owner_tenant_id::text = current_setting('app.tenant_id', true)
    );
```

**When to use:** Tables with multiple tenant references

### 3. Role-Based Policy

```sql
-- Policy for regular users
CREATE POLICY "tenant_users_policy" ON "table_name"
    FOR SELECT
    USING (tenant_id::text = current_setting('app.tenant_id', true));

-- Policy for admins (more permissive)
CREATE POLICY "tenant_admins_policy" ON "table_name"
    FOR ALL
    USING (
        tenant_id::text = current_setting('app.tenant_id', true)
        AND current_setting('app.user_role', true) = 'admin'
    );
```

**When to use:** Different access levels within tenant

### 4. Read-Only vs. Write Policies

```sql
-- Read policy (SELECT)
CREATE POLICY "tenant_read_policy" ON "table_name"
    FOR SELECT
    USING (tenant_id::text = current_setting('app.tenant_id', true));

-- Write policy (INSERT, UPDATE, DELETE)
CREATE POLICY "tenant_write_policy" ON "table_name"
    FOR ALL
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
```

**When to use:** Different rules for read vs. write operations

---

## Application Integration

### Setting Tenant Context

```typescript
// In database.service.ts
async withTenant<T>(tenantId: string, operation: () => Promise<T>): Promise<T> {
    // Set tenant context
    await this.query(`SET LOCAL app.tenant_id = $1`, [tenantId]);
    
    try {
        return await operation();
    } finally {
        // Reset context
        await this.query(`RESET app.tenant_id`);
    }
}
```

### Using in Services

```typescript
// In your service
async findCustomers(tenantId: string): Promise<Customer[]> {
    return await this.db.withTenant(tenantId, async () => {
        // RLS automatically filters by tenant_id
        return await this.prisma.customer.findMany();
    });
}
```

---

## Testing RLS Policies

### 1. Manual Testing

```sql
-- Connect as application role
SET ROLE verofield_app;

-- Set tenant context
SET LOCAL app.tenant_id = 'tenant-a-uuid';

-- Query should only return Tenant A data
SELECT * FROM customers;

-- Attempt to query Tenant B data (should return empty)
SELECT * FROM customers WHERE tenant_id = 'tenant-b-uuid';
```

### 2. Performance Testing

```sql
-- Check query plan (should use index)
EXPLAIN ANALYZE 
SELECT * FROM customers 
WHERE tenant_id::text = current_setting('app.tenant_id', true);

-- Expected: Index Scan on idx_customers_tenant_id
-- NOT: Seq Scan on customers
```

### 3. Cross-Tenant Access Test

```typescript
// Test in your test suite
it('should not allow cross-tenant access', async () => {
    const tenantACustomer = await createCustomer(tenantA.id);
    
    // Query with Tenant B context
    const result = await db.withTenant(tenantB.id, async () => {
        return await prisma.customer.findUnique({
            where: { id: tenantACustomer.id }
        });
    });
    
    expect(result).toBeNull(); // Should not find Tenant A's customer
});
```

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to Enable RLS

```sql
-- WRONG: Table has tenant_id but no RLS
CREATE TABLE "customers" (
    "id" UUID PRIMARY KEY,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255)
);
-- Missing: ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
```

**Fix:** Always enable RLS on tenant-scoped tables

### ❌ Pitfall 2: Missing Index on tenant_id

```sql
-- WRONG: No index on tenant_id (slow queries)
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy" ON "customers" USING (...);
-- Missing: CREATE INDEX "idx_customers_tenant_id" ON "customers"("tenant_id");
```

**Fix:** Always index tenant_id column

### ❌ Pitfall 3: Using Superuser Role

```typescript
// WRONG: Superuser bypasses RLS
const url = 'postgresql://postgres:password@localhost/verofield';
```

**Fix:** Use non-superuser application role

### ❌ Pitfall 4: SECURITY DEFINER Without Filter

```sql
-- WRONG: SECURITY DEFINER bypasses RLS
CREATE FUNCTION get_all_customers()
RETURNS SETOF customers
SECURITY DEFINER  -- Runs as function owner (bypasses RLS)
AS $$ SELECT * FROM customers; $$ LANGUAGE sql;
```

**Fix:** Use SECURITY INVOKER or add explicit tenant filter

---

## Performance Optimization

### 1. Index tenant_id Column

```sql
CREATE INDEX "idx_table_tenant_id" ON "table_name"("tenant_id");
```

**Impact:** 10-100x faster queries

### 2. Composite Indexes

```sql
-- For queries filtering by tenant_id AND other columns
CREATE INDEX "idx_customers_tenant_status" 
    ON "customers"("tenant_id", "status");
```

**When to use:** Frequent queries with multiple filters

### 3. Partial Indexes

```sql
-- For queries on active records only
CREATE INDEX "idx_customers_tenant_active" 
    ON "customers"("tenant_id") 
    WHERE status = 'active';
```

**When to use:** Queries frequently filter by status

---

## Troubleshooting

### Issue: Query Returns Empty When It Shouldn't

**Cause:** Tenant context not set or incorrect

**Fix:**
```sql
-- Check current tenant context
SELECT current_setting('app.tenant_id', true);

-- Verify it matches expected tenant
```

### Issue: Slow Queries After Enabling RLS

**Cause:** Missing index on tenant_id

**Fix:**
```sql
-- Add index
CREATE INDEX "idx_table_tenant_id" ON "table_name"("tenant_id");

-- Verify index is used
EXPLAIN ANALYZE SELECT * FROM table_name;
```

### Issue: Cross-Tenant Data Visible

**Cause:** RLS not enabled or policy incorrect

**Fix:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'your_table';

-- Verify policy exists
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

---

## Migration Checklist

When adding a new tenant-scoped table:

- [ ] Table includes `tenant_id UUID NOT NULL` column
- [ ] Index created on `tenant_id`: `CREATE INDEX "idx_table_tenant_id" ON "table"("tenant_id");`
- [ ] RLS enabled: `ALTER TABLE "table" ENABLE ROW LEVEL SECURITY;`
- [ ] Policy created: `CREATE POLICY "tenant_isolation_policy" ON "table" USING (...);`
- [ ] Foreign key to tenant table: `FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id")`
- [ ] Application code uses `withTenant()` wrapper
- [ ] Tests verify cross-tenant access blocked
- [ ] Performance tested (query uses index)

---

## References

- **R01:** Tenant Isolation (application-level) - `.cursor/rules/03-security.mdc`
- **R02:** RLS Enforcement (database-level) - `.cursor/rules/03-security.mdc`
- **PostgreSQL RLS Docs:** https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **Automated Checker:** `.cursor/scripts/check-rls-enforcement.py`
- **OPA Policy:** `services/opa/policies/security.rego` (R02 section)

---

**Last Updated:** 2025-11-23  
**Maintained By:** Security Team  
**Review Frequency:** Quarterly or when RLS requirements change





