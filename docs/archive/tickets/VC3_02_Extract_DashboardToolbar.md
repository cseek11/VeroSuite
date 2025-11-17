# VC3-02: Extract DashboardToolbar from VeroCardsV3

## Summary
Extract the top action controls (Add Card, Collaborators, Auto-arrange, Templates, Undo/Redo, Search, Layout Manager, Zoom, Virtualization toggle, Reset, Fullscreen) into a `DashboardToolbar` component.

## Scope
- Create `frontend/src/routes/dashboard/components/DashboardToolbar.tsx`.
- Move all toolbar UI and handlers behind props.
- Keep styles consistent with current Tailwind purple theme.

## Tasks
- Identify toolbar JSX block and associated callbacks.
- Define typed props for handlers and state (zoom, canZoomIn/Out, search term, etc.).
- Replace inline toolbar in `VeroCardsV3` with the new component.

## Acceptance Criteria
- Toolbar renders identically and functions without regressions.
- Parent `VeroCardsV3` shrinks in line count and rerenders less.
- No linter or TypeScript errors.
