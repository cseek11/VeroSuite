# VC3-12: Stabilize handlers and add React.memo equality functions

## Summary
Reduce unnecessary renders by stabilizing handler dependencies and adding explicit memo equality checks for card components.

## Scope
- Minimize deps of callbacks; avoid capturing large objects like `layout.cards`/`kpiData`.
- Add `areEqual(prevProps, nextProps)` to memoized card components.

## Tasks
- Factor lookups inside callbacks to avoid object deps.
- Write shallow compare of `id,x,y,w,h,type,locked,groupId,selected,kpiData[id]`.

## Acceptance Criteria
- Drag/resize and bulk operations trigger only affected card renders.
- CPU time per interaction decreases.
- No functional regressions.
