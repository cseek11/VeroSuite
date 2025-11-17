# VC3-11: Remove render-path logs and add dev-only debug flag

## Summary
Eliminate console logging inside render paths and guard diagnostic logs behind a dev flag to reduce noise and render overhead.

## Scope
- Remove `console.log` calls from `renderCard`, `renderVirtualCard`, and JSX.
- Add a `const DEBUG = process.env.NODE_ENV !== 'production' && window.__VERO_DEBUG__` guard.

## Tasks
- Replace inline logs with `if (DEBUG) console.log(...)` in effects or actions only.
- Ensure no logs fire during hot render loops.

## Acceptance Criteria
- No console spam during normal usage.
- Debugging can be enabled via `window.__VERO_DEBUG__ = true` in dev.
- No behavior or visual changes.
