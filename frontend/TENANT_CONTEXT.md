# Tenant Context and Row Level Security (RLS)

This document describes how VeroField enforces multi-tenant data isolation using PostgreSQL Row Level Security (RLS) combined with a per-request database session variable.

## Overview

- Each tenant-scoped table includes a `tenant_id` column (UUID).
- RLS policies on these tables ensure that queries can only see rows where `tenant_id` matches the current request's tenant context.
- The tenant context is established for each request by setting a PostgreSQL session variable (e.g., `app.tenant_id`) using `SET LOCAL`.
- The application uses a restricted database role for runtime queries.

## Core SQL

```sql
-- Enable RLS on tenant tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
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

-- Limited runtime role
CREATE ROLE verosuite_app;
GRANT USAGE ON SCHEMA public TO verosuite_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO verosuite_app;
```

## Request Lifecycle

1. User authenticates and receives a JWT that includes `tenant_id` and `roles`.
2. On each request, authentication middleware validates the JWT and attaches the user context (including `tenantId`) to `req`.
3. Tenant middleware sets the PostgreSQL `app.tenant_id` session variable using `SET LOCAL`, and sets the runtime role to `verosuite_app`.
4. All ORM/SQL queries executed in the request automatically inherit the tenant context via RLS.

## Example Middleware (pseudo TypeScript)

```ts
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private database: DatabaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.tenantId) return next();

    try {
      // Set tenant for current request/transaction
      await this.database.query(
        `SET LOCAL app.tenant_id = $1`,
        [req.user.tenantId]
      );

      // Apply restricted role
      await this.database.query(`SET LOCAL ROLE verosuite_app`);
    } catch (err) {
      console.error('Failed to set tenant context', err);
      return next(new UnauthorizedException('Unable to establish tenant context'));
    }

    next();
  }
}
```

Notes:
- Use `SET LOCAL` within a transaction/request scope to avoid leakage across requests.
- With Prisma (or similar ORMs), prefer a per-request transaction and execute `SET LOCAL` at transaction start.

## Best Practices

- Always include `tenant_id` in primary/foreign keys or composite uniques when appropriate to avoid cross-tenant collisions.
- Add indexes on `(tenant_id, <other-columns>)` for frequent lookups.
- Never bypass RLS using superuser roles in application requests.
- Log the tenant_id in audit logs for traceability.
- Add e2e tests confirming that cross-tenant access returns empty results or 404.

## Troubleshooting

- If queries return zero rows unexpectedly, verify that `app.tenant_id` is set for the current session/transaction.
- Ensure RLS is enabled on all tenant tables.
- Validate that your ORM isn't creating a new connection/transaction after `SET LOCAL` without re-applying the setting.
- Confirm that the runtime DB user/role has no BYPASSRLS privilege.
