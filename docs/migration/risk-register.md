| Risk | Mitigation | Rollback (max 2 attempts) | Status | Owner |
| --- | --- | --- | --- | --- |
| DB connectivity to Supabase blocking tests and schema pulls | Provision local/stage DB or tunnel; add health check before test runs | 1) Re-point to last known good DB; 2) Disable DB-dependent suites and revert config if still failing | Open | Backend lead |
| High coupling on shared services (database, supabase, auth guard) | Extract shared-kernel interfaces; add anti-corruption layers | 1) Revert module wiring to previous stable release; 2) Feature-flag new adapters and roll back flag if issues persist | Open | Architecture |
| Missing coverage baseline (tests failing) | Fix DB access; stabilize fixtures; rerun coverage and store report | 1) Revert failing test config; 2) Skip gating on coverage temporarily with approval, then restore | Open | QA lead |
| Endpoint catalog blocked by Nest compile error | Fix Swagger server config; add CI lint to prevent regression | 1) Revert main.ts swagger changes; 2) Disable swagger servers temporarily while capturing routes, then revert | Open | API lead |
| Schema drift undetected (db pull failed) | Restore DB access; run `prisma db pull` and compare | 1) Revert prisma schema changes; 2) Lock deployments until drift is reconciled | Open | Data/Prisma owner |

