# Database Design

This document outlines the logical schema, key relationships, indices, and RLS policies for VeroField.

## Core Entities

- tenants (id, name, domain, status, created_at, updated_at)
- users (id, tenant_id, email, password_hash, first_name, last_name, roles[], status, created_at, updated_at)
- accounts (id, tenant_id, name, account_type, phone, email, billing_address, ar_balance, status, created_at, updated_at)
- locations (id, tenant_id, account_id, name, address fields, lat/lng, service_area_id, created_at, updated_at)
- work_orders (id, tenant_id, account_id, location_id, service_type, duration, price, recurrence, special_instructions, status, created_at, updated_at)
- jobs (id, tenant_id, work_order_id, account_id, location_id, technician_id, status, priority, scheduled_date, start/end times, actual times, completion data, created_at, updated_at)
- tenant_branding (id, tenant_id unique, theme_json, logo_url, version, status, timestamps)
- audit_logs (id, tenant_id, user_id, action, resource_type, resource_id, before_state, after_state, request_id, ip_address, user_agent, timestamp)

## Relationships

- users.tenant_id → tenants.id (many-to-one)
- accounts.tenant_id → tenants.id (many-to-one)
- locations.(tenant_id, account_id) → accounts.(tenant_id, id)
- work_orders.(tenant_id, account_id, location_id) → accounts/locations
- jobs.(tenant_id, work_order_id, account_id, location_id) → work_orders/accounts/locations
- tenant_branding.tenant_id → tenants.id (one-to-one)
- audit_logs.tenant_id → tenants.id

All foreign keys are scoped by tenant_id to maintain strict tenant boundaries.

## Indexing

Recommended composite indexes:
- jobs: (tenant_id, technician_id, scheduled_date)
- jobs: (tenant_id, status, scheduled_date)
- jobs: (tenant_id, account_id)
- audit_logs: (tenant_id, timestamp DESC)
- accounts: (tenant_id, name)
- locations: (tenant_id, account_id)

## RLS Policies

Enable RLS and apply tenant isolation to tenant-scoped tables:

```sql
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_accounts ON accounts
USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_locations ON locations
USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_work_orders ON work_orders
USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_jobs ON jobs
USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

## Example: Per-request Tenant Context

```sql
-- Within a request/transaction:
SET LOCAL app.tenant_id = '3b8b6c08-8e3c-4ea0-9b6f-2d4d1d1a2f90';
SET LOCAL ROLE verofield_app;

-- All subsequent queries are tenant-scoped via RLS
SELECT id, name FROM accounts ORDER BY name;
```

## Example Queries

- Today’s jobs for a technician
```sql
SELECT j.id, j.status, j.priority, j.scheduled_date,
       j.scheduled_start_time, j.scheduled_end_time,
       a.name AS account_name, l.name AS location_name
FROM jobs j
JOIN accounts a ON a.id = j.account_id AND a.tenant_id = j.tenant_id
JOIN locations l ON l.id = j.location_id AND l.tenant_id = j.tenant_id
WHERE j.technician_id = $1
  AND j.scheduled_date = CURRENT_DATE
ORDER BY j.priority DESC, j.scheduled_start_time ASC;
```

- Account summary with upcoming jobs
```sql
SELECT a.id, a.name, a.account_type, a.ar_balance,
       COUNT(DISTINCT l.id) AS total_locations,
       COUNT(DISTINCT j.id) FILTER (WHERE j.status IN ('scheduled','in_progress')) AS active_jobs
FROM accounts a
LEFT JOIN locations l ON l.account_id = a.id AND l.tenant_id = a.tenant_id
LEFT JOIN jobs j ON j.account_id = a.id AND j.tenant_id = a.tenant_id
WHERE a.id = $1
GROUP BY a.id;
```

## Data Integrity

- Use composite unique constraints including `tenant_id` where appropriate
- Enforce foreign keys referencing both `tenant_id` and resource `id`
- Ensure status values are constrained (ENUM or CHECK)

## Migration Notes

- Prefer Prisma migrations (or SQL migrations) that add RLS enablement and policies alongside table creation
- Always validate RLS coverage after adding a new tenant-scoped table
