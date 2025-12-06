---
title: Database Migrations Guide
category: Deployment
status: active
last_reviewed: 2025-12-05
owner: backend_team
related:
  - docs/reference/database-schema.md
  - docs/guides/deployment/production.md
---

# Database Migrations Guide

## Overview

This guide covers managing database migrations for VeroField, including creating, applying, and rolling back migrations.

## Migration Tools

### Prisma Migrations
Primary tool for schema changes:
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Manual SQL Migrations
For complex changes or RLS policies:
- Create SQL files in `backend/prisma/migrations/`
- Apply via Supabase SQL Editor or psql

## Migration Process

### 1. Development
```bash
cd backend
# Make schema changes in schema.prisma
npx prisma migrate dev --name add_new_table
# Migration created and applied automatically
```

### 2. Review
- Review generated migration SQL
- Test migration on development database
- Verify RLS policies if adding tenant-scoped tables

### 3. Production
```bash
# Apply migrations to production
npx prisma migrate deploy
```

## Adding Tenant-Scoped Tables

### Required Steps
1. Add table to `schema.prisma` with `tenant_id` column
2. Create migration
3. Enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
4. Create tenant isolation policy
5. Add indexes on `(tenant_id, ...)`

### Example Migration
```sql
-- Create table
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  -- other columns
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation_new_table ON new_table
USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Add index
CREATE INDEX idx_new_table_tenant_id ON new_table(tenant_id);
```

## RLS Policy Migration

### Standard Tenant Isolation Policy
```sql
CREATE POLICY tenant_isolation_<table_name> ON <table_name>
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### Additional Policies
- SELECT: Allow reading own tenant's data
- INSERT: Ensure tenant_id matches context
- UPDATE: Allow updating own tenant's data
- DELETE: Allow deleting own tenant's data

## Migration Best Practices

### Before Migration
- [ ] Backup production database
- [ ] Test migration on staging
- [ ] Review SQL for correctness
- [ ] Verify RLS policies
- [ ] Check for breaking changes

### During Migration
- [ ] Apply during maintenance window (if needed)
- [ ] Monitor for errors
- [ ] Verify data integrity
- [ ] Check application functionality

### After Migration
- [ ] Verify RLS policies active
- [ ] Test tenant isolation
- [ ] Monitor performance
- [ ] Update documentation

## Rollback Strategy

### Prisma Rollback
```bash
# Rollback last migration (development)
npx prisma migrate resolve --rolled-back migration_name
```

### Manual Rollback
1. Create rollback SQL script
2. Test on development database
3. Apply to production if needed
4. Restore from backup if necessary

## Common Migration Scenarios

### Adding a Column
```prisma
model TableName {
  // existing fields
  newField String?
}
```
```bash
npx prisma migrate dev --name add_new_field
```

### Adding Tenant-Scoped Table
1. Add to schema with `tenant_id`
2. Create migration
3. Add RLS policy
4. Add indexes

### Modifying Column Type
- Use `ALTER TABLE` in migration
- Handle data conversion if needed
- Test thoroughly before production

## Related Documentation

- [Database Schema Reference](../../reference/database-schema.md) - Complete schema
- [Tenant Context Reference](../../reference/tenant-context.md) - RLS details
- [Production Deployment](production.md) - Deployment process

---

**Last Updated:** 2025-12-05  
**Maintained By:** Backend Team  
**Review Frequency:** On migration changes





