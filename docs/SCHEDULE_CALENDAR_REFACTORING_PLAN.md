# ScheduleCalendar Component Refactoring Plan
## Breaking Down a Large Component into Maintainable Pieces

**Date:** January 10, 2025  
**Current State:** ScheduleCalendar.tsx is 800+ lines  
**Target State:** Modular components, each < 300 lines  
**Priority:** High (Technical Debt)

---

## Current Issues

### Size & Complexity
- **800+ lines** in a single component
- Multiple responsibilities (data fetching, rendering, state management, conflict detection)
- Difficult to test individual features
- Hard to maintain and extend
- Performance concerns (large re-renders)

### Code Organization
- View rendering logic mixed with business logic
- Utility functions embedded in component
- Dialog components inline
- No clear separation of concerns

---

## Refactoring Strategy

### 1. Extract View Components

**Current:** All views rendered in ScheduleCalendar  
**Target:** Separate components for each view

```
views/
├── CalendarMonthView.tsx (~150 lines)
│   - Month grid rendering
│   - Day cell rendering
│   - Event positioning
│
├── CalendarWeekView.tsx (~200 lines)
│   - Week grid rendering
│   - Time slot columns
│   - Event positioning
│
└── CalendarDayView.tsx (~150 lines)
    - Day timeline rendering
    - Hour slots
    - Event positioning
```

**Benefits:**
- Each view can be tested independently
- Easier to optimize individual views
- Clearer code organization
- Can lazy-load views if needed

---

### 2. Extract Calendar Event Component

**Current:** Event rendering logic duplicated in each view  
**Target:** Single reusable component

```
components/
└── CalendarEvent.tsx (~100 lines)
    - Event card rendering
    - Conflict badges
    - Drag-and-drop handlers
    - Click handlers
    - Styling logic
```

**Props:**
```typescript
interface CalendarEventProps {
  event: CalendarEvent;
  onDragStart: (e: DragEvent, job: Job) => void;
  onClick: (job: Job) => void;
  getJobColor: (status: string, priority: string, hasConflict?: boolean) => string;
  getConflictBorderColor: (severity?: string) => string;
}
```

**Benefits:**
- Single source of truth for event rendering
- Consistent styling across views
- Easier to update event appearance
- Reusable in other contexts

---

### 3. Extract Custom Hooks

**Current:** All logic in component  
**Target:** Focused custom hooks

```
hooks/
├── useCalendarConflicts.ts (~80 lines)
│   - Conflict checking logic
│   - Conflict state management
│   - Alert generation
│
├── useCalendarAlerts.ts (~60 lines)
│   - Alert state management
│   - Alert filtering/sorting
│   - Alert dismissal
│
├── useCalendarJobs.ts (~100 lines)
│   - Job fetching
│   - Job filtering
│   - Job mutations
│   - Calendar event conversion
│
└── useCalendarDateRange.ts (~50 lines)
    - Date range calculations
    - View-specific date logic
    - Date navigation helpers
```

**Example Hook:**
```typescript
// useCalendarConflicts.ts
export const useCalendarConflicts = (jobs: Job[]) => {
  const [conflicts, setConflicts] = useState<Map<string, Conflict>>(new Map());
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Conflict checking logic
  }, [jobs]);

  return { conflicts, alerts };
};
```

**Benefits:**
- Reusable logic
- Easier to test
- Better separation of concerns
- Can be shared with other components

---

### 4. Extract Utilities

**Current:** Utility functions in component  
**Target:** Pure utility modules

```
utils/
├── calendarUtils.ts (~80 lines)
│   - getDateRangeStart()
│   - getDateRangeEnd()
│   - getDaysInRange()
│   - formatDateRange()
│
├── jobColorUtils.ts (~60 lines)
│   - getJobColor()
│   - getConflictBorderColor()
│   - getPriorityColor()
│   - getStatusColor()
│
└── conflictUtils.ts (~50 lines)
    - checkJobConflicts()
    - getConflictSeverity()
    - formatConflictMessage()
```

**Benefits:**
- Pure functions (easier to test)
- No side effects
- Reusable across components
- Better tree-shaking

---

### 5. Extract Dialog Components

**Current:** Inline dialog JSX  
**Target:** Separate dialog components

```
components/
├── JobDetailsDialog.tsx (~120 lines)
│   - Job information display
│   - Read-only view
│   - Action buttons
│
├── JobEditDialog.tsx (~150 lines)
│   - Job editing form
│   - Validation
│   - Save/cancel handlers
│
└── JobCreateDialog.tsx (~150 lines)
    - Job creation form
    - Customer selection
    - Service selection
    - Date/time picker
```

**Benefits:**
- Cleaner main component
- Reusable dialogs
- Easier to test
- Better UX (can be used elsewhere)

---

### 6. Extract Type Definitions

**Current:** Types defined in component  
**Target:** Centralized type definitions

```
types/
├── calendar.types.ts
│   - CalendarEvent
│   - CalendarView
│   - DateRange
│
└── job.types.ts
    - Job
    - JobStatus
    - JobPriority
    - Conflict
    - Alert
```

**Benefits:**
- Single source of truth
- Easier to maintain
- Better IDE support
- Type sharing across components

---

## Target Component Structure

### Before (Current)
```
ScheduleCalendar.tsx (800+ lines)
├── All state management
├── All data fetching
├── All view rendering
├── All dialog rendering
├── All utility functions
└── All type definitions
```

### After (Refactored)
```
scheduling/
├── ScheduleCalendar.tsx (~200 lines)
│   ├── Main orchestrator
│   ├── View state management
│   ├── Composes sub-components
│   └── Handles high-level interactions
│
├── views/
│   ├── CalendarMonthView.tsx (~150 lines)
│   ├── CalendarWeekView.tsx (~200 lines)
│   └── CalendarDayView.tsx (~150 lines)
│
├── components/
│   ├── CalendarEvent.tsx (~100 lines)
│   ├── JobDetailsDialog.tsx (~120 lines)
│   ├── JobEditDialog.tsx (~150 lines)
│   └── JobCreateDialog.tsx (~150 lines)
│
├── hooks/
│   ├── useCalendarConflicts.ts (~80 lines)
│   ├── useCalendarAlerts.ts (~60 lines)
│   ├── useCalendarJobs.ts (~100 lines)
│   └── useCalendarDateRange.ts (~50 lines)
│
├── utils/
│   ├── calendarUtils.ts (~80 lines)
│   ├── jobColorUtils.ts (~60 lines)
│   └── conflictUtils.ts (~50 lines)
│
└── types/
    ├── calendar.types.ts
    └── job.types.ts
```

**Total:** ~1,500 lines (same functionality, better organized)  
**Largest component:** ~200 lines (vs 800+ before)

---

## Implementation Steps

### Phase 1: Extract Types & Utilities (Low Risk)
1. Create `types/` directory
2. Move type definitions
3. Create `utils/` directory
4. Extract pure utility functions
5. Update imports

**Time:** 2-3 hours  
**Risk:** Low (no functionality changes)

---

### Phase 2: Extract Hooks (Medium Risk)
1. Create `hooks/` directory
2. Extract `useCalendarJobs` hook
3. Extract `useCalendarConflicts` hook
4. Extract `useCalendarAlerts` hook
5. Extract `useCalendarDateRange` hook
6. Update component to use hooks

**Time:** 4-6 hours  
**Risk:** Medium (state management changes)

---

### Phase 3: Extract View Components (Medium Risk)
1. Create `views/` directory
2. Extract `CalendarMonthView`
3. Extract `CalendarWeekView`
4. Extract `CalendarDayView`
5. Update main component to use views

**Time:** 6-8 hours  
**Risk:** Medium (rendering logic changes)

---

### Phase 4: Extract Event Component (Low Risk)
1. Create `CalendarEvent` component
2. Extract event rendering logic
3. Update all views to use component
4. Test event interactions

**Time:** 3-4 hours  
**Risk:** Low (isolated component)

---

### Phase 5: Extract Dialog Components (Low Risk)
1. Create dialog components
2. Extract `JobDetailsDialog`
3. Extract `JobEditDialog`
4. Extract `JobCreateDialog`
5. Update main component

**Time:** 4-6 hours  
**Risk:** Low (isolated components)

---

## Testing Strategy

### Unit Tests
- Test each utility function independently
- Test each hook in isolation
- Test each view component with mock data
- Test event component interactions

### Integration Tests
- Test main component with all sub-components
- Test data flow between hooks
- Test view switching
- Test dialog interactions

### Visual Regression Tests
- Ensure all views render correctly
- Verify event styling
- Check conflict indicators
- Validate dialog layouts

---

## Success Metrics

### Code Quality
- ✅ Main component < 300 lines
- ✅ Each sub-component < 200 lines
- ✅ No circular dependencies
- ✅ 100% functionality preserved
- ✅ Improved test coverage

### Maintainability
- ✅ Clear component hierarchy
- ✅ Easy to locate code
- ✅ Simple to add new features
- ✅ Better code reusability

### Performance
- ✅ Smaller re-render scope
- ✅ Better code splitting potential
- ✅ Improved tree-shaking
- ✅ Faster development builds

---

## Migration Checklist

- [ ] Create new directory structure
- [ ] Extract types to `types/` directory
- [ ] Extract utilities to `utils/` directory
- [ ] Extract hooks to `hooks/` directory
- [ ] Extract view components to `views/` directory
- [ ] Extract event component
- [ ] Extract dialog components
- [ ] Update main ScheduleCalendar component
- [ ] Update all imports
- [ ] Run tests
- [ ] Visual regression testing
- [ ] Update documentation
- [ ] Code review

---

## Risks & Mitigation

### Risk 1: Breaking Existing Functionality
**Mitigation:**
- Extract incrementally
- Test after each extraction
- Keep old code until verified
- Use feature flags if needed

### Risk 2: Performance Regression
**Mitigation:**
- Profile before and after
- Use React.memo where appropriate
- Optimize re-renders
- Monitor bundle size

### Risk 3: Increased Complexity
**Mitigation:**
- Clear documentation
- Consistent naming
- Type safety
- Code examples

---

## Timeline

**Total Estimated Time:** 20-30 hours  
**Sprint Duration:** 2 weeks (Sprint 1.11)  
**Team Size:** 1-2 developers

**Week 1:**
- Extract types & utilities (Day 1-2)
- Extract hooks (Day 3-4)
- Extract view components (Day 5)

**Week 2:**
- Extract event component (Day 1)
- Extract dialog components (Day 2-3)
- Testing & refinement (Day 4-5)

---

## Conclusion

This refactoring will significantly improve:
- **Maintainability:** Easier to understand and modify
- **Testability:** Components can be tested in isolation
- **Reusability:** Hooks and components can be shared
- **Performance:** Smaller re-render scope
- **Developer Experience:** Easier to work with

**Recommendation:** Schedule this refactoring in Sprint 1.11, before adding more features. This will make future development much easier.

---

**Document Version:** 1.0  
**Last Updated:** January 10, 2025  
**Status:** Ready for Implementation






