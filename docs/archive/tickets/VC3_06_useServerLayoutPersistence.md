# VC3-06: Build useServerLayoutPersistence hook and migrate effects

## Summary
Encapsulate layout loading, card listing, upserts, deletions, and KPI hydration bootstrap into `useServerLayoutPersistence` to reduce complexity in `VeroCardsV3`.

## Scope
- Create `frontend/src/routes/dashboard/hooks/useServerLayoutPersistence.ts`.
- Move mount-time effect and related calls into this hook.

## Tasks
- Expose API: `currentLayoutId`, `loadLayout()`, `upsertCard()`, `deleteCard()`, `listCards()`.
- Include retry logic used for KPI Builder/Template operations.
- Ensure tenant/auth patterns unchanged.

## Acceptance Criteria
- `VeroCardsV3` reduces effect count and line count.
- Server interactions work as before.
- Zero regressions; lints pass.
