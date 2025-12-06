## Branch Strategy (Phase 0.5)

- Keep existing repo workflow unchanged.
- Create phase branches: `migration/phase-0`, `migration/phase-1`, etc.
- Feature work merges into the active phase branch via PR; rebase regularly on `main`.
- Tag milestones per phase; cherry-pick urgent hotfixes from `main` into the phase branch.
- No default-branch change; CI targets `main` and the active `migration/phase-*` branch.

