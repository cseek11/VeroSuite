## Endpoint Catalog

- Startup command: `node apps/api/dist/apps/api/src/main.js` (captured in `docs/migration/nest-start-latest.log` on 2025-12-06).
- Mapped routes extracted to `docs/migration/api-mapped.txt` (271 endpoints across v1 and v2).

### Current Endpoints (baseline)

Source: `docs/migration/api-mapped.txt`
- Accounts: v1 (`/api/accounts` CRUD, search) and v2 variants
- Auth: login, refresh, me (v1/v2)
- Billing: invoices/payments/recurring/stripe webhook
- CRM: accounts/notes (v1/v2)
- Company: settings/logo
- Compliance: rules/checks/PR score/trends
- Dashboard: layouts/regions/cards/templates (v1/v2)
- Jobs & Work-orders: scheduling, recurring, technician/customer filters (v1/v2)
- KPIs & KPI templates: CRUD, analytics (v1/v2)
- Layouts: CRUD/upload/download/search
- Routing: optimize (v1)
- Sessions: list/get/complete
- Service-types: CRUD
- Technicians: CRUD, availability, dashboards (v1/v2)
- Uploads: presign
- Users: CRUD, sync/import/export, sessions, metrics, deactivate (v1/v2)
- Health/metrics: `/api/health`, `/api/metrics`

### Next Steps

- Add request/response DTO summaries per endpoint family, noting guards/version (v1 vs v2).
- Keep `api-mapped.txt` refreshed after future changes; planned breaking changes can be tracked against this baseline.

