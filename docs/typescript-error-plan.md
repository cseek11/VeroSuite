# TypeScript Diagnostics Snapshot (frontend)

- Command used: `cd frontend && npm run typecheck`
- Log file: `frontend/tmp/ts-errors.log`
- Total TS errors: 1404

## Error Summary

- Top codes by count: TS6133 (296), TS2339 (217), TS2322 (172), TS18048 (103), TS7006 (100), TS2345 (94), TS2375 (56), TS2532 (43), TS2379 (36), TS2366 (36), TS2769 (22), TS2304 (21), TS2367 (20), TS18046 (18), TS6196 (15).
- Top offending files (by error volume): `src/components/scheduling/ConflictDetector.tsx` (71), `src/lib/enhanced-api.ts` (48), `src/components/scheduling/ScheduleCalendar.tsx` (46), `src/components/billing/ReportExport.tsx` (31), `src/components/kpi/KpiTemplateLibrary.tsx` (30), `src/routes/dashboard/components/DashboardContent.tsx` (26), `src/components/customer/CustomerOverview.tsx` (25), `src/components/users/UserDetail.tsx` (25), `src/components/customer/CustomerBilling.tsx` (23), `src/components/customer/CustomerInfoPanel.tsx` (22), `src/routes/dashboard/RegionDashboard.tsx` (22), `src/routes/Charts.tsx` (20), `src/components/scheduler/JobScheduler.tsx` (19), `src/components/scheduling/TechnicianScheduler.tsx` (18), `src/components/dashboard/regions/RegionGrid.tsx` (15).

## Phased Remediation Plan

- Phase 1 — Hygiene and config: Sweep unused/implicit issues (TS6133, TS7006, TS6196), update generics and narrowings to clear TS18046/TS18048. Low-risk, high-volume reductions.
- Phase 2 — Shared libs first: Fix type surfaces in `src/lib/enhanced-api.ts`, `src/lib/search-integration.ts`, `src/lib/enhanced-intent-service.ts` to reduce cascades in consumers; align API response types and guard nullables.
- Phase 3 — Scheduling cluster: Address `src/components/scheduling/*` (ConflictDetector, ScheduleCalendar, ResourceTimeline, TechnicianScheduler) for TS2339/TS2322/TS2366/TS2379 mismatches; standardize event/resource typings.
- Phase 4 — Billing & reports: Triage `ReportExport.tsx` and `CustomerBilling.tsx`; tighten Stripe/report typings and date/null handling.
- Phase 5 — Dashboard/customer UI: Clean `DashboardContent.tsx`, `RegionDashboard.tsx`, `CustomerOverview.tsx/Popup.tsx`, `CustomerInfoPanel.tsx`, `UserDetail.tsx` for prop/type alignment.
- Phase 6 — Remaining leaf components: Handle residual TS2339/TS2345/TS2769 cases in lower-fanout screens; finish with a final lint/type sweep.

## Rerun Instructions

- After each phase: `cd frontend && npm run typecheck` and review `frontend/tmp/ts-errors.log` (append or rotate as needed).
- Final expectation: zero TS errors on `npm run typecheck`.

