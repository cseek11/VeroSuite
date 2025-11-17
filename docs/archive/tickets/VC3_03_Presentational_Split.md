# VC3-03: Finish Presentational Split - Extract Dashboard Components

## Summary
Extract presentational components (DashboardGroups, DashboardCards, DashboardModals, DashboardEmptyState) from the monolithic VeroCardsV3.tsx into separate, reusable components. This improves maintainability, testability, and follows the single responsibility principle.

## Scope
- Extract presentational components from VeroCardsV3.tsx
- Create dedicated component files with proper TypeScript interfaces
- Maintain all existing functionality and styling
- Improve component organization and reusability

## Components to Extract

### 1. DashboardGroups Component
**File**: `frontend/src/routes/dashboard/components/DashboardGroups.tsx`
- Extract group rendering logic (lines 1135-1147 in VeroCardsV2.tsx)
- Props: groups, selectedGroupId, onUpdateGroup, onDeleteGroup, etc.
- Handle group selection, deletion, and drag operations

### 2. DashboardCards Component  
**File**: `frontend/src/routes/dashboard/components/DashboardCards.tsx`
- Extract card rendering logic (lines 1149-1167 in VeroCardsV2.tsx)
- Props: cards, renderCard, virtualScrolling, etc.
- Handle virtual scrolling and card rendering

### 3. DashboardModals Component
**File**: `frontend/src/routes/dashboard/components/DashboardModals.tsx`
- Extract all modal components (lines 1205-1583 in VeroCardsV2.tsx)
- Props: modal states, handlers, and configurations
- Include: Keyboard shortcuts, KPI builder, template library, confirmation modals

### 4. DashboardEmptyState Component
**File**: `frontend/src/routes/dashboard/components/DashboardEmptyState.tsx`
- Extract empty state rendering (lines 1169-1188 in VeroCardsV2.tsx)
- Props: onAddCard callback
- Handle empty dashboard state with call-to-action

## Tasks

### Phase 1: Create Component Files
1. Create `DashboardGroups.tsx` with group rendering logic
2. Create `DashboardCards.tsx` with card rendering logic  
3. Create `DashboardModals.tsx` with all modal components
4. Create `DashboardEmptyState.tsx` with empty state logic

### Phase 2: Define Interfaces
1. Create proper TypeScript interfaces for each component
2. Define props interfaces with proper typing
3. Remove `any` types where possible
4. Add JSDoc comments for complex props

### Phase 3: Update VeroCardsV3
1. Import new components in VeroCardsV3.tsx
2. Replace inline JSX with component calls
3. Pass appropriate props to each component
4. Remove extracted code from main file

### Phase 4: Create Index File
1. Create `frontend/src/routes/dashboard/components/index.ts`
2. Export all dashboard components
3. Enable clean imports in VeroCardsV3.tsx

## Component Interfaces

```typescript
// DashboardGroups.tsx
interface DashboardGroupsProps {
  groups: Record<string, Group>;
  selectedGroupId: string | null;
  onUpdateGroup: (groupId: string, updates: Partial<Group>) => void;
  onDeleteGroup: (groupId: string) => void;
  onUngroupCards: (groupId: string) => void;
  onGroupDragStart: (groupId: string, e: React.MouseEvent) => void;
  onRequestDelete: (groupId: string) => void;
  onSelectGroup: (groupId: string | null) => void;
}

// DashboardCards.tsx  
interface DashboardCardsProps {
  cards: Card[];
  renderCard: (card: Card, index: number) => React.ReactNode;
  virtualScrolling: VirtualScrollingState;
  containerHeight: number;
}

// DashboardModals.tsx
interface DashboardModalsProps {
  showKeyboardHelp: boolean;
  showKPIBuilder: boolean;
  showTemplateLibrary: boolean;
  modalStates: ModalStates;
  onCloseModals: (modalName: string) => void;
  // ... other modal props
}

// DashboardEmptyState.tsx
interface DashboardEmptyStateProps {
  onAddCard: () => void;
}
```

## Acceptance Criteria
- All presentational logic extracted into separate components
- VeroCardsV3.tsx significantly reduced in size (< 800 lines)
- Each component has proper TypeScript interfaces
- All existing functionality preserved
- Components are reusable and testable
- No `any` types in component props
- Clean imports via index.ts

## Notes
- Maintain all existing styling and behavior
- Keep purple theme and Tailwind classes
- Preserve all event handlers and state management
- Components should be pure presentational where possible
- Pass callbacks down from parent component

## Dependencies
- VC3-02 (Make V3 Canonical) should be completed first

## Testing
- Verify all components render correctly
- Test group operations (create, update, delete, drag)
- Test card rendering and virtual scrolling
- Test all modal interactions
- Test empty state functionality
- Ensure no visual or behavioral changes











