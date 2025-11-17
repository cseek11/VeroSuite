# VC3-01: Rename VeroCardsV2 to VeroCardsV3 and update references

## Summary
Rename the dashboard route component `VeroCardsV2` to `VeroCardsV3` to clearly distinguish it from non-card dashboards while preserving the "VeroCard" naming. Update all imports, routes, and references.

## Scope
- Rename file `frontend/src/routes/VeroCardsV2.tsx` → `frontend/src/routes/VeroCardsV3.tsx`.
- Update all imports and route registrations referencing `VeroCardsV2`.
- No behavioral changes.

## Tasks
- Find all imports of `VeroCardsV2` and replace with `VeroCardsV3`.
- Update route definitions to point to `VeroCardsV3`.
- Ensure build and tests pass.

## Acceptance Criteria
- App builds with zero TypeScript and linter errors.
- Navigating to the route renders the same UI as before.
- No references to `VeroCardsV2` remain.

## Notes
- Keep Tailwind purple theme and existing styles.
- Do not modify .env automatically; inform if route paths require env changes.
