# VC3-07: Build useKpiHydration hook and optional KpiDataContext

## Summary
Isolate KPI template/user KPI mapping, transformation, and the processed IDs set into a dedicated hook (and optional context) to decouple from the route component.

## Scope
- Create `frontend/src/routes/dashboard/hooks/useKpiHydration.ts`.
- Optional: `frontend/src/routes/dashboard/context/KpiDataContext.tsx` for shared state.

## Tasks
- Move effects that map user KPIs to cards and localStorage persistence.
- Provide stable getters/setters for `kpiData` per `cardId`.
- Keep structure compatible with `KpiDisplayCard`.

## Acceptance Criteria
- Behavior unchanged (fallback mapping, persistence, hydration ordering).
- Route component simplified significantly.
- Type safety maintained; lints pass.
