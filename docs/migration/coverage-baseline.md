## Test Coverage Baseline - Phase 0.5

- Command: `cd apps/api && npm run test:coverage`
- Timestamp: 2025-12-06T12:30:00Z (local run)
- Result: Successful. Coverage artifacts in `apps/api/coverage/` (`coverage-final.json`, `lcov.info`, `clover.xml`).

### Module Coverage (statements)

| Module | Statements % | Covered/Total | Notes |
| --- | --- | --- | --- |
| accounts | 66.32 | 321/484 |  |
| agreements | 88.44 | 130/147 |  |
| audit | 38.46 | 5/13 |  |
| auth | 63.96 | 252/394 |  |
| billing | 37.81 | 417/1103 |  |
| common | 65.94 | 964/1462 |  |
| company | 67.74 | 126/186 |  |
| compliance | 49.22 | 127/258 |  |
| crm | 54.36 | 106/195 |  |
| dashboard | 53.37 | 981/1838 |  |
| health | 64.15 | 34/53 |  |
| jobs | 90.10 | 519/576 |  |
| kpi-templates | 71.01 | 240/338 |  |
| kpis | 54.02 | 242/448 |  |
| layouts | 84.00 | 147/175 |  |
| middleware | 0.00 | 0/21 | No coverage hits |
| routing | 78.64 | 265/337 |  |
| service-types | 86.11 | 62/72 |  |
| services | 96.00 | 24/25 |  |
| sessions | 42.01 | 71/169 |  |
| technician | 80.71 | 410/508 |  |
| test-violations | 0.00 | 0/59 | Intentional violation fixtures |
| uploads | 86.27 | 44/51 |  |
| user | 39.34 | 240/610 |  |
| websocket | 27.68 | 31/112 |  |
| work-orders | 92.94 | 303/326 |  |

### Overall Coverage

- Aggregate coverage available in `apps/api/coverage/lcov-report/index.html`. Use this run as the baseline; future phases must not reduce aggregate or module-level coverage without approval.

### Suite Breakdown

- Test runner: Jest (backend) with coverage.
- Artifacts: `coverage-final.json`, `lcov.info`, `clover.xml`.
- Runtimes per suite and branch/function/line splits were not captured in this run; capture and document in future runs for performance/coverage regression tracking.

### Baseline Rule

- No module may drop below the percentages above in later phases without explicit approval.

