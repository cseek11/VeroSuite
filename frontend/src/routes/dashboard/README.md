# Dashboard Refactoring Structure

## New Structure (Consolidated)

```
frontend/src/routes/dashboard/
├── VeroCardsV3.tsx         # Main component (382 lines)
├── components/
│   ├── DashboardUI.tsx     # All UI components (395 lines)
│   └── index.ts            
├── hooks/
│   ├── useDashboard.ts     # All custom hooks (387 lines)
│   └── index.ts            
├── utils/
│   ├── helpers.ts          # All utility functions (396 lines)
│   └── index.ts            
└── types.ts                # All types (69 lines)
```

## File Breakdown

### VeroCardsV3.tsx (382 lines)
- Main component logic
- Integration of all hooks
- Main render with sub-components

### components/DashboardUI.tsx (395 lines)
- DashboardControls
- DashboardCanvas  
- StatusBar
- CardSelector
- KeyboardShortcutsModal

### hooks/useDashboard.ts (387 lines)
- useDashboardState
- useModalManagement
- useServerPersistence
- useKpiManagement
- useVeroCardsRender

### utils/helpers.ts (396 lines)
- Card types and helpers
- KPI handlers
- Render helpers
- Constants

### types.ts (69 lines)
- All TypeScript interfaces and types

Total files: 5 main files + index files
All files under 400 lines as requested