## Region Dashboard Feature Flag Matrix

**Authoritative as of:** 2025-12-05  
**Scope:** Dashboard enterprise flags relevant to Region Dashboard (frontend + backend).

### Flags in Scope

- `DASHBOARD_NEW_STATE_MANAGEMENT`
- `DASHBOARD_VIRTUALIZATION`
- `DASHBOARD_MOBILE_BETA`
- `DASHBOARD_PWA`
- `DASHBOARD_EVENT_SOURCING`
- `DASHBOARD_SAGA_ORCHESTRATION`
- `DASHBOARD_CONFLICT_RESOLUTION`
- `DASHBOARD_AUDIT_LOGGING`
- `DASHBOARD_API_V2`

---

### Per-Environment Defaults

| Flag | Dev | Staging | Production | Notes |
| --- | --- | --- | --- | --- |
| DASHBOARD_NEW_STATE_MANAGEMENT | true | true | false | New Zustand-based store; keep off in prod until rollout decision. |
| DASHBOARD_VIRTUALIZATION | true | true | false | Virtualized grid for large layouts; enable after performance validation. |
| DASHBOARD_MOBILE_BETA | true | limited tenants | false | Mobile dashboard; gate via tenant targeting on backend. |
| DASHBOARD_PWA | true | true | false | Service worker + offline; requires ops sign-off and caching review. |
| DASHBOARD_EVENT_SOURCING | true | true | true | Write-side event logging for compliance; considered core. |
| DASHBOARD_SAGA_ORCHESTRATION | true | true | false | Bulk/saga flows; enable per-tenant after stability confirmed. |
| DASHBOARD_CONFLICT_RESOLUTION | true | true | true | Optimistic locking/conflict dialogs; core safety feature. |
| DASHBOARD_AUDIT_LOGGING | true | true | true | Audit events to `dashboard_events`; required for compliance. |
| DASHBOARD_API_V2 | true | limited tenants | false | v2 API; migrate selected tenants first, then widen. |

---

### Rollout Criteria

**DASHBOARD_VIRTUALIZATION**
- Backend: Region repository + service tests passing.
- Frontend: Region grid interaction tests show no regressions for drag/resize.
- Performance: Manual or automated run against >100 regions shows within targets from `PERFORMANCE_BUDGETS.md`.
- Observability: Metrics for cache hit rate and render duration wired.

**DASHBOARD_MOBILE_BETA**
- E2E: Core mobile flows (load, navigate, refresh) pass on reference devices.
- Error rate: No elevated API error rate when mobile enabled for pilot tenants.
- UX: Product sign-off on mobile layout and interactions.

**DASHBOARD_PWA**
- Service worker: Verified registration and basic offline behaviour in dev.
- Caching: No stale or poisoned data in dashboard flows after refresh/offline cycles.
- Security: CSP and HTTPS enforced; no mixed-content issues.

**DASHBOARD_API_V2**
- Backend: v2 controller integration tests (CRUD, batch, conflicts) passing.
- Clients: At least one production tenant fully migrated and stable.
- Monitoring: Error and latency for v1 vs v2 tracked in metrics dashboard.

**DASHBOARD_SAGA_ORCHESTRATION**
- Unit: `SagaService` tests passing (success + rollback paths).
- Audit: Saga events visible in `dashboard_events`.
- Operational: No stuck sagas under normal failure conditions.

---

### Operational Guidelines

1. **Flag Changes in Production**
   - All changes go through change management (ticket + approval).
   - Prefer enabling flags per-tenant or per-role before global rollout.

2. **Rollback Strategy**
   - For instability: disable the specific dashboard flag (e.g. `FEATURE_DASHBOARD_VIRTUALIZATION=false`).
   - For systemic issues: enable `EMERGENCY_ROLLBACK` to revert to pre-enterprise dashboard behaviour.

3. **Documentation & Logging**
   - Record flag changes and rationale in release notes.
   - Ensure `feature-flag.service.ts` logs evaluations for high-risk flags in debug mode.



