# VC3-05: Introduce DashboardCard with Header and Content subcomponents

## Summary
Split per-card rendering into `DashboardCard` (positioning, selection, drag/resize) with `DashboardCardHeader` and `DashboardCardContent` to minimize list re-renders and improve readability.

## Scope
- Create components under `frontend/src/routes/dashboard/components/`.
- Wrap with `React.memo` and custom equality checks.
- Convert cardTypes lookup to be handled by content component.

## Tasks
- Extract wrapper with stable props (`id,x,y,w,h,type,locked,groupId,selected`).
- Move header actions (lock/delete) to `DashboardCardHeader`.
- Switch card content by type in `DashboardCardContent`; lazy-load heavy ones.

## Acceptance Criteria
- Visual parity with current cards.
- Noticeable reduction in re-renders during drag/resize.
- No TypeScript/linter issues.
