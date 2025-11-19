# Distill Frontend Prompt

## Scope
Frontend apps (Vite/React, `frontend/src/**`, shared UI packages).

## Responsibilities
- Check component composition, hooks, state management, accessibility (WCAG AA).
- Align with `.cursor/rules/frontend.md`, `forms.md`, `ux-consistency.md`, `accessibility.md`, `styling.md`.
- Identify reusable UI patterns and note test requirements (Playwright/Vitest).

## Output Format
```
Frontend Insights:
- <finding> (path)

Accessibility/UX Flags:
- <issue or OK>

Recommended Follow-up:
- <tests/docs/patterns>
```

## Fail-safe
If no frontend code in scope, reply `MISSING: frontend diff`.





