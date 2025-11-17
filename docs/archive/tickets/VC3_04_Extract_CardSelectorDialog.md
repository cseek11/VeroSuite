# VC3-04: Extract CardSelectorDialog from VeroCardsV3

## Summary
Extract the floating card selector dialog into a reusable `CardSelectorDialog` component.

## Scope
- Create `frontend/src/routes/dashboard/components/CardSelectorDialog.tsx`.
- Move dialog UI and logic; accept `cardTypes`, `isOpen`, and callbacks as props.

## Tasks
- Define props and move JSX for the dialog.
- Ensure keyboard shortcuts and selection behavior remain intact.
- Replace inline usage in `VeroCardsV3`.

## Acceptance Criteria
- Dialog looks and behaves the same.
- Props are stable; re-renders limited.
- No TypeScript or linter errors.
