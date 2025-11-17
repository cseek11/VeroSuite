## Region Dashboard Enterprise Refactor Plan

### Phase 1 – Stabilize Core State & Grid Behavior

- **1.1 Consolidate region state into `useRegionStore` as single source of truth**  
- Refine `frontend/src/stores/regionStore.ts` so all CRUD, optimistic updates, conflict handling, and queues live in the store only.  
- Update `frontend/src/hooks/useRegionLayout.ts` to become a thin adapter over the store (no local region arrays, no separate pending update maps).  
- In `frontend/src/routes/dashboard/RegionDashboard.tsx`, remove all direct calls to `enhancedApi.dashboardLayouts.*` for regions and route them through `useRegionLayout`/`useRegionStore`.

- **1.2 Fix undo/redo to operate on real region state**  
- Redesign `frontend/src/hooks/useUndoRedo.ts` to work with snapshots derived from the store (e.g. arrays of `VersionedRegion` IDs and DTOs).  
- Add `undoLayout(layoutId)` / `redoLayout(layoutId)` actions in `regionStore`, which apply a prior snapshot to `regions` and enqueue the corresponding backend updates in a single batch operation.  
- Wire `RegionDashboard`’s `handleUndo` / `handleRedo` to call these store-level actions (and stop calling `reloadRegions()` unless a hard refresh is needed).

- **1.3 Make drag/resize deterministic and backend-safe**  
- Keep `frontend/src/components/dashboard/regions/RegionGrid.tsx` authoritative for drag/resize behavior; ensure it always:  
  - Clamps `x/w` and `y/h` to validated bounds (0–11 columns, `grid_col + col_span <= 12`, row >= 0).  
  - Uses the shared `detectOverlap` helper from `frontend/src/lib/validation/region.schemas.ts` against the latest layout from `useRegionStore`.  
- Ensure callbacks from `RegionGrid` (`onMove`, `onResize`) call a single store method that does: local optimistic update → queued API update → rollback on error.

- **1.4 Harden `addRegion` placement and conflict handling**  
- In `regionStore.addRegion`, remove dynamic `import` and use the already-imported `detectOverlap` helper synchronously.  
- Implement a simple, bounded first-fit search over `(row, col)` that respects spans and uses `detectOverlap`, with a clear max row (e.g. 0–49).  
- If no valid position is found, surface a specific toast (“No space left for a new region in this layout”) instead of falling back to `(0, 0)`.

- **1.5 Align front-end and back-end validation models**  
- Ensure `frontend/src/lib/validation/region.schemas.ts` and backend DTOs (`backend/src/dashboard/dto/dashboard-region.dto.ts`) both use `grid_col` in `0–11` and `grid_col + col_span <= 12`.  
- Review `RegionCreateSchema`, `RegionUpdateSchema`, and backend `RegionValidationService.validateGridBounds` to guarantee the same constraints and messages.  
- Update developer docs to clearly document grid semantics (0-indexed columns, 12-column width, row/span limits).

---

### Phase 2 – Data Layer, Transactions, and Consistency

- **2.1 Introduce a clear Region Repository layer on the backend**  
- Create `backend/src/dashboard/repositories/region.repository.ts` implementing CRUD and query helpers (list by layout, check overlaps, soft-delete) using Prisma/Supabase.  
- Refactor `backend/src/dashboard/dashboard.service.ts` to depend on this repository instead of scattered ORM calls, while keeping `RegionValidationService` as the policy/validation layer.

- **2.2 Solidify optimistic locking and conflict resolution**  
- Standardize on a `version` field for regions (already present) and enforce optimistic locking in `dashboard.service.updateRegion`.  
- On version mismatch, throw a structured conflict error `{ code: 'VERSION_CONFLICT', latestRegion: … }`.  
- In `enhanced-api.ts` and `regionStore.updateRegion`, detect this code and push a conflict entry into `regionStore.conflicts`, to be surfaced via `ConflictResolutionDialog`.

- **2.3 Event sourcing / audit trail for regions**  
- Finish and/or refine the dashboard events table and event service: `backend/src/dashboard/services/event-store.service.ts` (or similar path).  
- For `createRegion`, `updateRegion`, and `deleteRegion` in `dashboard.service.ts`, emit `DashboardEvent` records with enough metadata (user, tenant, IP, payload diff).  
- Implement a projection step that keeps the main `dashboard_regions` table consistent with events, and expose a `GET /api/dashboard/layouts/:id/events` endpoint for audit/history.

- **2.4 Introduce saga-style orchestration for multi-step operations**  
- Implement a small `SagaOrchestrator` utility in `backend/src/common/sagas/saga-orchestrator.ts`.  
- Convert complex flows like “import layout”, “reset layout to defaults”, and “clone layout with regions” in `dashboard.service.ts` to sagas with compensating actions.  
- Ensure all these operations run inside database transactions where possible (`prisma.$transaction` / Supabase equivalent), with clear rollback behavior and audit logging.

- **2.5 Idempotency for critical write operations**  
- Implement an `IdempotencyService` in `backend/src/common/services/idempotency.service.ts` backed by Redis or the DB.  
- Require `Idempotency-Key` headers for region-creating endpoints (bulk import, clone, etc.) and route them through this service.  
- Document how front-end calls should set idempotency keys for retryable operations.

---

### Phase 3 – Security, Multi-Tenancy, and Validation

- **3.1 Complete and enforce RLS/tenant isolation for dashboard tables**  
- Ensure `dashboard_regions`, `dashboard_layouts`, and related ACL tables have robust RLS policies (using `backend/prisma/migrations/create_dashboard_regions.sql` and `enhance_dashboard_regions_rls_security.sql`).  
- Confirm `TenantContextMiddleware` (or Supabase equivalent) sets `current_tenant_id` and `current_user_id` for each request.  
- Update `RegionValidationService.validateNoOverlap` and any raw queries to rely on RLS plus explicit `tenant_id` filters for defense in depth.

- **3.2 Harden input validation (backend and frontend)**  
- Consolidate backend validation using DTOs and (where appropriate) a Zod-based middleware for complex shapes (configs).  
- Ensure `backend/src/dashboard/services/region-validation.service.ts` and `frontend/src/lib/validation/region.schemas.ts` agree on color formats, config constraints, and prohibited patterns (XSS checks).  
- Remove any remaining ad-hoc validation logic in components and funnel everything through the shared schemas/utilities.

- **3.3 XSS and config sanitization**  
- Verify there is no remaining `dangerouslySetInnerHTML` without sanitization in any region components (`RegionContent`, headers, tooltips, etc.).  
- Introduce a sanitized HTML helper using DOMPurify (or existing sanitation utilities) and enforce its use wherever HTML is rendered from config.  
- Expand `validateConfigForXSS` (already in `RegionValidationService`) to cover widget config patterns consistently.

- **3.4 Authentication & RBAC alignment**  
- Review the existing auth stack (JWT, session, API tokens) and map dashboard endpoints into a permission model (`dashboard_layout:read`, `dashboard_region:write`, etc.).  
- Add decorators or guards on dashboard controllers (`dashboard.controller.ts`) to enforce RBAC with centralized `AuthorizationService`.  
- Ensure the front-end uses permissions only for UI affordances (show/hide actions) and not as a security barrier.

- **3.5 Content Security Policy and headers**  
- Add a CSP middleware in `backend/src/app.module.ts` or a dedicated `security.module.ts` to emit CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.  
- Document CSP implications for widgets and external resources in `SECURITY_SETUP_GUIDE.md` and the dashboard developer guide.

---

### Phase 4 – Performance, Caching, and Scalability

- **4.1 Grid performance and virtualization**  
- Replace or augment `RegionGrid` with a `VirtualizedRegionGrid` for large layouts (e.g. > 50 regions) using `react-window`/`react-virtualized` or the existing virtualized prototype.  
- Use feature flags to roll out virtualization gradually (see Phase 7).  
- Ensure virtualization logic respects the same overlap and bounds rules and plays nicely with drag/resize.

- **4.2 Multi-layer caching**  
- Finalize and standardize `CacheService` in `backend/src/common/services/cache.service.ts` for layouts, regions, and KPI data (L1 memory, L2 Redis).  
- Ensure `dashboard.service.ts` uses this service for `getLayoutWithRegions` and invalidates caches on writes (including saga steps).  
- Add appropriate `Cache-Control`/ETag/Last-Modified headers on read endpoints to improve client-side caching.

- **4.3 WebSocket scaling for collaboration**  
- Ensure the `dashboard-presence` gateway uses Redis Pub/Sub for fan-out across instances.  
- Implement room-based namespaces (`layout:<layoutId>`) and broadcast changes through Redis so all pods stay in sync.  
- Add connection limits and backpressure handling to prevent overuse in high-traffic tenants.

- **4.4 Rate limiting and abuse protection**  
- Finish integrating `RateLimitMiddleware` globally via `CommonModule` and ensure it has tiered limits (free/pro/enterprise) and per-endpoint categories (normal vs expensive).  
- Surface rate limit info in response headers and ensure front-end handles 429 errors gracefully (e.g. with retry suggestions / backoff messaging).

- **4.5 Query optimization and indexes**  
- Run `EXPLAIN` on the main dashboard queries (list layouts, list regions, presence, events) and add missing indexes (e.g. `(layout_id, deleted_at)`, spatial `(grid_row, grid_col, row_span, col_span)`) via new Prisma migrations.  
- Document query performance baselines and targets in `DATABASE.md`.

---

### Phase 5 – UX, UI Design, and Mobile Experience

- **5.1 Fix current UX glitches and polish existing interactions**  
- Ensure `RegionContainer`’s `React.memo` comparison is fast and correct (no heavy `JSON.stringify`, prefer shallow comparisons plus a stable config hash if needed).  
- Finalize resize-handle styling in `region-grid.css` so handles stay anchored and don’t tilt (limit transforms and hover scaling).  
- Clarify and fix scroll behavior: choose a single scroll container (e.g. grid-level scroll) and adjust `useZoomPan` + CSS accordingly so scrollbars remain visible when adding/moving regions.

- **5.2 Redesign Region Settings dialog for clarity**  
- Restructure `frontend/src/components/dashboard/regions/RegionSettingsDialog.tsx` into tabbed sections (General, Appearance, Behavior, Advanced) with live preview using `RegionContainer`.  
- Use a robust color picker with RGB/HEX normalization and consistent `normalizeColor` usage, ensuring backend validation always accepts values produced by the picker.  
- Add explicit “Unsaved changes” indicators, reset-to-default behavior, and clear Save/Cancel semantics.

- **5.3 Search, filter, and layered UI**  
- Enhance `FloatingNavBar` and any search components to provide fuzzy search, basic filters (type, locked/collapsed), and a clear indication when filters are active.  
- Ensure search/filter results integrate with `useRegionStore` selectors (not local arrays) to avoid desync.  
- Add keyboard focus and ARIA attributes so search, filters, and quick actions are accessible.

- **5.4 Mobile-first dashboard variant**  
- Implement a dedicated `MobileDashboard` route/component that presents regions as cards/list instead of a dense grid, with touch-friendly interactions.  
- Add basic gestures (swipe between sections, pull-to-refresh) using native touch events or a small gesture library, integrated with the same store and APIs.  
- Ensure layout and interactions meet minimum tap target sizes and accommodate safe areas on modern devices.

- **5.5 Onboarding, empty states, and templates**  
- Add an onboarding flow and an `EmptyDashboard` component that is shown when a user has no regions, with quick actions and role-based templates.  
- Implement a template loader that can create a recommended layout for common roles (Technician, Manager, Executive) by calling existing `addRegion` flows.  
- Document how to add new templates and how they are versioned.

- **5.6 Keyboard navigation and accessibility**  
- Implement keyboard navigation context and shortcuts (e.g., `Ctrl+K` for command palette, `Ctrl+Z` undo, arrow keys to move focus between regions).  
- Make regions focusable, with visible focus rings and screen-reader labels summarizing type, size, and status.  
- Audit the dashboard against WCAG 2.1 AA for focus order, contrast, ARIA landmarks, and announceable toasts.

---

### Phase 6 – Observability, Error Handling, and Resilience

- **6.1 Structured logging and correlation IDs**  
- Standardize logging on the existing structured logger (`StructuredLoggerService` / Winston-like implementation) across backend modules.  
- Add a request-scoped logger middleware that injects `requestId`, `userId`, and `tenantId` into all logs for a request.  
- Ensure dashboard services (including Region/Layouts) log key events with consistent `service`, `operation`, and `errorCode` fields.

- **6.2 Metrics and tracing**  
- Enhance `MetricsService` to expose Prometheus metrics for HTTP requests, DB queries, cache hits, WebSocket connections, and region operations.  
- Add a `/metrics` endpoint and create a Grafana dashboard JSON with panels for core dashboard health (load time, error rate, region counts, cache hit rate, etc.).  
- Integrate OpenTelemetry tracing (or equivalent) for critical flows: layout load, batch region update, and collaboration events.

- **6.3 Error boundaries & client-side resilience**  
- Expand `RegionErrorBoundary` to support limited error-loop detection and recovery options (reset region, remove region, reload layout).  
- Ensure `enhanced-api.ts` and `api-utils.ts` never retry 400-level validation errors, classify error codes, and surface clear messages per category (overlap, bounds, permission, rate-limit).  
- Add a global error boundary for the dashboard route that can show a friendly fallback and diagnostics if the grid fails catastrophically.

- **6.4 Health checks and circuit breakers**  
- Implement multi-level health checks (`/health`, `/health/live`, `/health/ready`) that verify DB, Redis, key dependencies, and key background jobs.  
- Use a circuit-breaker utility for upstream dependencies like external widget APIs or third-party services used in regions.  
- Wire liveness/readiness probes in deployment manifests (see Phase 8).

---

### Phase 7 – Feature Flags, Progressive Rollout, and PWA

- **7.1 Feature flag system**  
- Introduce a `FeatureFlagService` (backend) and `useFeatureFlag` hook (frontend) backed by a simple feature-flag store (DB + cache or environment-level config).  
- Gate new high-risk features (virtualization, advanced collaboration, mobile beta, event sourcing reads) behind flags and configure per-tenant or per-role rollouts.  
- Add a small admin UI or config file for toggling dashboard-related flags.

- **7.2 PWA and offline support**  
- Add a service worker and manifest for the dashboard, enabling offline caching of static assets and basic read-only layouts.  
- Implement an offline queue for region changes (backed by IndexedDB) and background sync when connectivity returns.  
- Clearly document offline behavior and limitations for the dashboard in developer and user-facing docs.

---

### Phase 8 – Deployment, Scaling, and Operations

- **8.1 Blue-green / canary deployments**  
- Add Kubernetes deployment and service definitions for blue/green deployments of the dashboard API and (if relevant) front-end containers.  
- Implement a small deployment orchestrator (script or CI pipeline step) that can progressively shift traffic and monitor error/latency thresholds.  
- Document rollback procedures and expected SLOs in `DEVELOPMENT_BEST_PRACTICES.md` or a dedicated ops runbook.

- **8.2 Horizontal scaling and autoscaling**  
- Configure HPA for dashboard API based on CPU, memory, and optional custom metrics (request rate, error rate).  
- Confirm WebSocket gateway scales correctly with Redis Pub/Sub and that sticky sessions or equivalent are in place if required.  
- Add runbooks for common scaling incidents (throttling, database pool exhaustion).

---

### Phase 9 – Testing Strategy and Quality Gates

- **9.1 Unit and integration tests**  
- Expand unit tests around `useRegionStore`, validation helpers (`region.schemas.ts`), and layout utilities.  
- Add backend integration tests for the dashboard controller/service covering region CRUD, overlap detection, RLS behavior, event logging, and rate limiting.  
- Ensure KPIs and cache-related changes remain covered with regression tests.

- **9.2 End-to-end and visual regression tests**  
- Add Playwright/Cypress tests for critical dashboard flows: load layout, add/move/resize region, collapse, undo/redo, change settings, filter/search, and reset to defaults.  
- Add a small visual regression suite for key layouts (desktop and mobile) to catch layout shifts and UI regressions.

- **9.3 Load and performance testing**  
- Use Artillery/k6 to simulate realistic dashboard usage across tenants (reads, writes, concurrent edits, WebSocket load).  
- Define performance budgets (e.g. time-to-first-region < 1s, 100 regions drag at 60fps, error rate thresholds) and wire them into CI as performance checks.  
- Track baseline metrics in Grafana, and treat regressions as blockers for production deploys.

---

### Phase 10 – Documentation, ADRs, and Governance

- **10.1 Align and expand the developer guides**  
- Update `docs/developer/REGION_DASHBOARD_DEVELOPER_GUIDE.md` to reflect the final architecture (Zustand store core, repository pattern, event sourcing, feature flags, PWA, etc.).  
- Apply recommended improvements from `docs/developer/Structural_Improvements_Audit.md` (quick reference card, migration guide, troubleshooting, security, performance, accessibility).  
- Add updated diagrams for component hierarchy, data flow, state flow, and WebSocket/event flows.

- **10.2 Architecture Decision Records (ADRs)**  
- Create ADRs under `docs/adr/` (or equivalent) for:  
  - State management & store architecture.  
  - Caching strategy and CacheService design.  
  - Authentication/RBAC model for the dashboard.  
  - WebSocket scaling approach.  
  - Deployment strategy (blue/green & canary) and SLOs.  
  - Error handling, circuit breakers, and resilience patterns.  
- Reference ADRs from the developer guide where relevant.

- **10.3 Operational and incident runbooks**  
- Document runbooks for common dashboard incidents: layout load failures, high region error rate, cache poisoning, RLS misconfigurations, and high WebSocket churn.  
- Define SLIs/SLOs for dashboard availability and performance, and tie them to monitoring/alerts configured in Phase 6.  
- Keep CHANGELOG/version history updated for dashboard-specific changes.