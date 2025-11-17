# VC3-08: Enforce virtualization for large sets and add memoization

## Summary
Ensure virtualization is always enabled above a card-count threshold and reduce render churn via memoization and stable handlers.

## Scope
- Keep virtualization auto-enabled when card count > threshold.
- Memoize expensive lookups and handlers.

## Tasks
- Remove dev-only toggle for production builds; keep threshold configurable.
- Memoize `renderCard` path; convert `cardTypes` to Map.
- Add `React.memo` + equality checks for card components.

## Acceptance Criteria
- Smooth performance with 200+ cards.
- No functional changes; only perf improvements.
- Lints and types pass.
