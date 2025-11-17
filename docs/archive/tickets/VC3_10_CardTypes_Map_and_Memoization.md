# VC3-10: Replace cardTypes array lookup with Map and memoization

## Summary
Replace repeated `cardTypes.find(...)` calls with an O(1) `Map` and memoize it to reduce per-card lookup cost.

## Scope
- Create a `useMemo` that builds `Map<string, CardType>`.
- Update all usages to read from the map.

## Tasks
- Define `CardType` interface if needed.
- Replace lookups in render paths.

## Acceptance Criteria
- No functional changes; measurable drop in render CPU profiles.
- TypeScript types remain strict.
- Lints pass.
