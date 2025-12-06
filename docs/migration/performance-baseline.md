## Performance Baseline (Phase 0.5)

Environment: local dev, API on localhost:3001, DB: Supabase (dev), cache: default, feature flags: default.

### Measurements captured (2025-12-06)
- Work Orders (smoke, 1 VU, rps 3, 45s, scenario: create→get→update): p95 http_req_duration ~425 ms, http_req_failed 0%, error_rate 0%.
- Work Orders (full staged load, peak 15 VUs, rps capped 15): p95 ~387 ms, but error_rate ~71% (many non-2xx on create/update), so not a clean pass.
- Auth/Login + Accounts Create (smoke, 1 VU, rps 3, 30s, script: auth-accounts-smoke.js): p95 ~242 ms, http_req_failed 0%, error_rate 0%.
- Jobs (smoke, 1 VU, rps 1, 30s, script: jobs-smoke.js, using account `f3a934d2-e6df-4fe6-a2de-f3ec245d5ffc` and location `3448f60e-6c50-4157-bf97-fff5954964b8`): p95 ~755 ms, http_req_failed 0%, error_rate 0%; flow covers work-order create → job create → job get.
- KPI fetch (smoke, 1 VU, rps 3, 30s, script: kpi-smoke.js): p95 ~2.86 s, http_req_failed 0%, error_rate 0%.
- Invoice create (smoke, 1 VU, rps 1, 30s, script: invoice-smoke.js, account `0035054e-3035-4e15-a69c-1af08556f920`, service_type `15d3f358-4418-4c90-8302-388c0afd3572`): p95 ~714 ms, http_req_failed 0%, error_rate 0%.

### Still needed
- Auth/login p95 (low-rate smoke).
- Accounts create p95 (reuse single account to avoid duplicates).
- Jobs create/complete p95.
- Invoices create/pay p95.
- Dashboard KPI fetch p95.
- Build times: `npm run build:backend`, `npm run build:frontend` on CI-equivalent hardware.
- Test suite durations: `npm --prefix apps/api run test`, `npm --prefix apps/api run test:coverage` (+ frontend if applicable).

### Plan to collect remaining p95
Run low-impact smokes (1 VU, rps 3–5, ~45s, with 429 retry/backoff) per endpoint:
- Auth/login: POST /auth/login
- Accounts create (or reuse existing) : POST /accounts
- Jobs: POST create, then status update/complete if available
- Invoices: POST create, then pay endpoint if available
- Dashboard KPI: GET dashboard/KPI endpoint

Capture each k6 summary (p95, http_req_failed, error_rate) and record above. For builds/tests, run the listed commands and note wall-clock durations and artifact sizes.

### API Latency (p95)
- Run: `npm --prefix apps/api run test:performance` or `k6 run test/performance/load-testing.js` against staging.
- Capture p95 for key endpoints: auth/login, accounts create, jobs create/complete, invoices create/pay, dashboard KPI fetch.
- Note environment: DB (Supabase) connectivity, cache state, feature flags.

### Build Times
- Run: `npm run build:backend` and `npm run build:frontend` on CI-equivalent hardware.
- Record wall-clock duration and artifact sizes.

### Test Suite Durations
- Run: `npm --prefix apps/api run test` and `npm --prefix apps/api run test:coverage`; record runtimes.
- Include frontend test runtimes if applicable.

### Next Steps
- Execute the commands above and update this file with measured numbers; use them as regression thresholds for later phases.

