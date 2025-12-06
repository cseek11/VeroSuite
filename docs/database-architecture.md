---
title: Database Architecture
category: Architecture
status: active
last_reviewed: 2025-12-05
owner: backend_team
related:
  - docs/reference/database-schema.md
  - docs/reference/tenant-context.md
  - docs/architecture/security.md
---

# Database Architecture

## Overview

VeroField uses PostgreSQL with Row Level Security (RLS) for multi-tenant data isolation. The database is managed through Prisma ORM with migrations.

## Database Design

### Core Entities

- **tenants** - Tenant organizations
- **users** - System users (scoped by tenant)
- **accounts** - Customer accounts (scoped by tenant)
- **locations** - Service locations (scoped by tenant)
- **work_orders** - Service work orders (scoped by tenant)
- **jobs** - Scheduled jobs (scoped by tenant)
- **invoices** - Billing invoices (scoped by tenant)
- **payments** - Payment records (scoped by tenant)
- **audit_logs** - Audit trail (scoped by tenant)

## Multi-Tenant Design

### Tenant Isolation
- All tenant-scoped tables include `tenant_id` column
- Row Level Security (RLS) policies enforce isolation
- Per-request tenant context via session variables

### RLS Policies
```sql
CREATE POLICY tenant_isolation_accounts ON accounts
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

## Indexing Strategy

### Composite Indexes
- `(tenant_id, technician_id, scheduled_date)` for jobs
- `(tenant_id, status, scheduled_date)` for job queries
- `(tenant_id, account_id)` for account lookups
- `(tenant_id, timestamp DESC)` for audit logs

## Relationships

All foreign keys are scoped by `tenant_id` to maintain strict tenant boundaries:
- `accounts.tenant_id → tenants.id`
- `locations.(tenant_id, account_id) → accounts.(tenant_id, id)`
- `jobs.(tenant_id, work_order_id) → work_orders.(tenant_id, id)`

## Data Integrity

- Composite unique constraints including `tenant_id`
- Foreign keys referencing both `tenant_id` and resource `id`
- Status values constrained (ENUM or CHECK)
- Cascade rules for data consistency

## Migration Management

- Prisma migrations for schema changes
- RLS policies included in migrations
- Seed data for development
- Migration rollback support

## Performance Considerations

- Indexed queries for common access patterns
- Materialized views for complex reports
- Connection pooling
- Query optimization

## Related Documentation

- [Database Schema Reference](../reference/database-schema.md) - Complete schema
- [Tenant Context](../reference/tenant-context.md) - Multi-tenant details
- [Security Architecture](security.md) - Security model
- [Database Migrations Guide](../guides/deployment/database-migrations.md) - Migration process

---

**Last Updated:** 2025-12-05  
**Maintained By:** Backend Team  
**Review Frequency:** On schema changes






