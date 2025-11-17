# VC3-03: Extract StatusBar from VeroCardsV3

## Summary
Extract the bottom status area (card counts, search info, virtualization indicator, layout selector, WebSocket stats, selection info) into a `StatusBar` component.

## Scope
- Create `frontend/src/routes/dashboard/components/StatusBar.tsx`.
- Move status rendering and keep props minimal and stable.

## Tasks
- Define props for counts and indicators.
- Move existing JSX and wiring into the component.
- Replace inline section in `VeroCardsV3` with `StatusBar`.

## Acceptance Criteria
- Status bar displays identical information and updates correctly.
- No additional re-renders of parent beyond necessary.
- TypeScript and lints pass.
