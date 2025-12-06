## Team Skills Audit

- No formal scores provided; assume current averages: DDD **3/10**, CQRS **3/10**, event-driven **2/10**.
- Training plan (since <5): 2x workshops on DDD boundaries and aggregates; brown-bag on CQRS/event sourcing; pair sessions on event choreography vs orchestration.

## Branch Strategy

- Keep existing workflow; introduce migration branches per phase: `migration/phase-0`, `migration/phase-1`, etc.
- Feature work merges into phase branch via PR; rebase frequently on `main` but do not change default repo workflow.
- Tag checkpoints per phase milestone; cherry-pick hotfixes from `main` into migration branch when needed.

## Communication Cadence

- Daily 15-min standup focused on migration blockers.
- Twice-weekly architecture sync for coupling/RLS decisions.
- Weekly steering review on risks, performance/coverage baselines, and endpoint/schema status.
- Async updates in #migration channel after each phase checkpoint with links to docs in `docs/migration`.

