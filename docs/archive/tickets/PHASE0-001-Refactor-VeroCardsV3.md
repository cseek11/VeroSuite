# 🎫 PHASE0-001: Refactor VeroCardsV3.tsx

**Status:** 🔴 In Progress  
**Priority:** Critical  
**Phase:** Phase 0 - Foundation & Refactoring (Week 1)  
**Effort:** 5 days  
**Assignee:** Development Team

---

## 📋 Overview

Refactor `VeroCardsV3.tsx` (currently 871 lines) into smaller, maintainable components. This is the foundation for all future card interaction features.

## 🎯 Goals

- Split 871-line file into components <300 lines each
- Improve maintainability and testability
- Reduce complexity and improve initialization logic
- Create clean foundation for Phase 1 features

---

## 📊 Current State

**File:** `frontend/src/routes/dashboard/VeroCardsV3.tsx`
- **Lines:** 871
- **Target:** <300 lines per file
- **Components to Extract:**
  1. `DashboardCanvas.tsx` (rendering only)
  2. `CardContainer.tsx` (card wrapper)
  3. `CardControls.tsx` (FAB buttons)

---

## ✅ Acceptance Criteria

### Must Have
- [ ] VeroCardsV3.tsx reduced to <300 lines
- [ ] DashboardCanvas.tsx created (<300 lines)
- [ ] CardContainer.tsx created (<300 lines)
- [ ] CardControls.tsx created (<300 lines)
- [ ] All existing functionality preserved
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] All tests passing

### Should Have
- [ ] Improved initialization logic
- [ ] Better separation of concerns
- [ ] Improved code readability
- [ ] Component documentation

### Nice to Have
- [ ] Performance improvements
- [ ] Additional unit tests
- [ ] Storybook stories for new components

---

## 🔧 Technical Requirements

### File Structure

```
frontend/src/routes/dashboard/
├── VeroCardsV3.tsx              # Main component (<300 lines)
├── components/
│   ├── DashboardCanvas.tsx     # Canvas rendering (<300 lines)
│   ├── CardContainer.tsx        # Card wrapper (<300 lines)
│   ├── CardControls.tsx         # FAB buttons (<300 lines)
│   └── index.ts                 # Export all components
```

### Component Responsibilities

#### VeroCardsV3.tsx (Main)
- Hook orchestration
- State management coordination
- High-level component composition
- Event handler coordination

#### DashboardCanvas.tsx
- Canvas rendering
- Card positioning
- Grid management
- Virtual scrolling integration

#### CardContainer.tsx
- Individual card rendering
- Card state management
- Card event handling
- Card lifecycle

#### CardControls.tsx
- FAB button rendering
- Control actions (add, arrange, template, etc.)
- Modal triggers
- Status indicators

---

## 📝 Implementation Steps

### Step 1: Extract DashboardCanvas
1. Identify canvas rendering logic (lines ~725-745)
2. Extract to `components/DashboardCanvas.tsx`
3. Define props interface
4. Update imports in VeroCardsV3.tsx
5. Test canvas rendering

### Step 2: Extract CardContainer
1. Identify card rendering logic
2. Extract to `components/CardContainer.tsx`
3. Define props interface
4. Update imports
5. Test card rendering

### Step 3: Extract CardControls
1. Identify FAB/control logic (lines ~659-686)
2. Extract to `components/CardControls.tsx`
3. Define props interface
4. Update imports
5. Test controls

### Step 4: Refactor Main Component
1. Remove extracted code from VeroCardsV3.tsx
2. Update imports
3. Compose new components
4. Test full integration
5. Verify all functionality

### Step 5: Improve Initialization
1. Review initialization logic
2. Remove timing hacks (setTimeout)
3. Implement proper initialization sequence
4. Test initialization flow

---

## 🧪 Testing Requirements

### Unit Tests
- [ ] DashboardCanvas renders correctly
- [ ] CardContainer renders cards correctly
- [ ] CardControls renders controls correctly
- [ ] VeroCardsV3 composes components correctly

### Integration Tests
- [ ] Full dashboard renders
- [ ] Cards can be added
- [ ] Cards can be moved
- [ ] Cards can be resized
- [ ] Controls work correctly

### Manual Testing
- [ ] Dashboard loads without errors
- [ ] All cards display correctly
- [ ] All interactions work
- [ ] Performance is acceptable

---

## 📚 Dependencies

### Prerequisites
- Existing VeroCardsV3.tsx file
- All existing hooks and utilities
- Test infrastructure

### Blockers
- None

### Related Tickets
- PHASE0-002: Testing Infrastructure & State Management
- PHASE0-003: Performance Budgets & Mobile Design

---

## 🚀 Success Metrics

### Code Quality
- ✅ All files <300 lines
- ✅ No TypeScript errors
- ✅ Test coverage maintained or improved
- ✅ Code complexity reduced

### Functionality
- ✅ All existing features work
- ✅ No performance regression
- ✅ No visual regressions

### Maintainability
- ✅ Easier to understand code structure
- ✅ Easier to add new features
- ✅ Easier to test components

---

## 📝 Notes

- Keep existing functionality intact
- Test thoroughly after each extraction
- Document component interfaces
- Update README if needed

---

## ✅ Definition of Done

- [ ] All files <300 lines
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Merged to main branch

---

**Created:** November 9, 2025  
**Last Updated:** November 9, 2025  
**Status:** 🔴 In Progress






