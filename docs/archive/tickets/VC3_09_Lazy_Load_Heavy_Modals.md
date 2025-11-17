# VC3-09: Lazy-load heavy modals (KPIBuilder, KpiTemplateLibraryModal, DrillDownModal)

## Summary
Reduce initial bundle and route render cost by lazy-loading heavy modal components using `React.lazy` and `Suspense`.

## Scope
- Introduce lazy module: `frontend/src/routes/dashboard/lazy/index.ts`.
- Replace direct imports in `VeroCardsV3` with lazy imports.

## Tasks
- Create lazy wrappers and a shared `Suspense` fallback.
- Verify modals open with negligible delay.

## Acceptance Criteria
- Initial render is faster; code-split chunks generated.
- Modals still function as before.
- No new linter or type errors.
