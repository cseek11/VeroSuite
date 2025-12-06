## Prisma Commands

- `cd libs/common && npx prisma db pull --schema=prisma/schema.prisma` ➜ **Succeeded** (2025-12-06) after reconnect; 114 models introspected. Prisma warned about RLS tables and preserved `@@map` metadata from prior schema.
- `cd libs/common && npx prisma validate --schema=prisma/schema.prisma` ➜ **Passed** (schema valid).

## Bounded Context Mapping (from `prisma/schema.prisma`)

- **Tenant & Identity:** `Tenant`, `User`, `sessions`, `identities`, `mfa_*`, `oauth_*`, `sso_*`, `saml_*`, `users` (Supabase), `refresh_tokens`, `one_time_tokens`.
- **Accounts/Customers:** `Account`, `CustomerProfile`, `CustomerContact`, `CustomerSegment`, `CustomerNote`, `CustomerDocument`, `CustomerPhoto`, `CustomerAnalytics`.
- **Services & Scheduling:** `ServiceCategory`, `ServiceType`, `ServicePricing`, `ServiceHistory`, `ServiceAgreement`, `WorkOrder`, `Job`, `Location`, `ServiceArea`, `Recurring_job_templates/instances`, `TechnicianAvailability`, `TechnicianSchedules`, `TimeOffRequests`.
- **Technicians:** `TechnicianProfile`, `TechnicianSkill`, `TechnicianCertification`, `TechnicianPayroll`, `TechnicianDocument`, `TechnicianPerformance`.
- **Billing & Payments:** `Invoice`, `InvoiceItem`, `Payment`, `PaymentMethod`, `ContractsSubscription`, `Billing service integration tables (stripe)` implied via services.
- **Compliance & Auditing:** `ComplianceRequirement`, `ComplianceRecord`, `ComplianceTracking`, `ComplianceCheck`, `ComplianceTrend`, `ComplianceAuditLog`, `AuditLog`, `AlertHistory`, `WriteQueue`.
- **Dashboard & KPIs:** `DashboardLayout`, `DashboardRegion`, `DashboardLayoutVersion`, `DashboardRegionAcl`, `DashboardWidgetRegistry`, `DashboardMigrationLog`, `DashboardRegionPresence`, `DashboardLayoutAudit`, `dashboard_cards/events/templates`, `KpiTemplate`, `KpiTemplateField`, `UserKpi`, `KpiTemplateUsage`, `kpi_configs`, `kpi_data`.
- **Search/Knowledge:** `knowledge_articles`, `knowledge_categories`, `popular_searches`, `search_*` analytics and correction tables.
- **Scoring (VeroScore):** `VeroScoreSession`, `VeroScoreChangesQueue`, `VeroScorePrScore`, `VeroScoreDetectionResult`, `VeroScoreIdempotencyKey`, `VeroScoreSystemMetric`, `VeroScoreAuditLog`.

## Shared Tables / Cross-Context Links (from schema inspection)

- Almost all domain models include `tenant_id` FKs, enforcing multi-tenancy across contexts.
- Identity/auth tables (`users`, `sessions`, `identities`, `oauth_*`, `sso_*`, `mfa_*`) link to tenant/user records and are consumed by multiple contexts (authz, dashboard personalization, billing).
- Dashboard and KPI tables reference users/tenants and often tie to jobs/work-orders for metrics; consider eventing rather than direct FK reads where possible.
- Billing/invoice tables likely reference accounts/work-orders; move cross-context reads behind domain services or async events.

## Event vs Direct FK Candidates

- Replace direct reads from scheduling/work-order into dashboard/KPI with domain events (job completed, work-order created) to populate reporting tables.
- Move authentication guard dependencies (sessions/users) behind an auth gateway to reduce direct FK coupling for service modules.
- Billing integrations should consume job/work-order events for line items instead of direct joins.

## Schema Drift

- Latest pull completed; compare generated schema to prior commit to spot drift. RLS and check-constraint warnings noted—Prisma may not fully model these, so manual review needed for affected tables (see prisma warnings).

