# Frontend Test Expansion Plan - Phased Approach to 80% Coverage

**Date:** 2025-11-15  
**Current Coverage:** ~10% statements (estimated)  
**Target Coverage:** 80% statements, 80% branches, 80% functions, 80% lines  
**Strategy:** Phased approach prioritizing critical business logic and user-facing components

---

## Overview

This plan outlines a systematic approach to expand frontend test coverage from ~10% to 80% by prioritizing critical user-facing components, hooks, and integration scenarios. The plan follows established test patterns and uses Vitest for component/unit tests and Playwright for E2E tests.

### Key Principles

1. **Prioritize User-Facing Components** - Components users interact with directly
2. **Follow Existing Patterns** - Use established test utilities and mock patterns
3. **Incremental Milestones** - Set achievable targets (25%, 50%, 75%, 80%)
4. **Quality over Quantity** - Focus on meaningful tests, not just coverage numbers
5. **Exclude Low-Value Files** - Module files, simple DTOs, index files, config files

---

## Phase 1: Configuration Updates (COMPLETED)

### Step 1.1: Update Coverage Configuration

**File:** `frontend/vitest.config.ts`

**Changes:**
- Exclude module files (DI configuration only)
- Exclude simple DTOs (validation-only files)
- Exclude config files and entry points
- Keep existing exclusions (test files, dist, build)

**Updated `exclude`:**
```typescript
exclude: [
  'node_modules/',
  'src/test/',
  'test/',
  '**/*.d.ts',
  '**/*.config.*',
  '**/dist/',
  '**/build/',
  '**/*.test.*',
  '**/*.spec.*',
  '**/__tests__/',
  '**/__mocks__/',
  '**/*.module.ts',           // Exclude module files (DI only)
  '**/dto/**/*.dto.ts',       // Exclude simple DTOs (test selectively)
  'src/main.tsx',             // Entry point
  'src/vite-env.d.ts',        // Vite types
  'src/env.d.ts',             // Environment types
]
```

---

## Phase 2: Critical Missing Tests (COMPLETED)

**Goal:** Address critical gaps identified in MISSING_TESTS_ANALYSIS.md  
**Status:** ✅ Completed

### Module 2.1: CustomerSearchSelector Component

**File:** `frontend/src/components/ui/__tests__/CustomerSearchSelector.test.tsx` ✅

**Coverage:**
- Customer fetching on mount
- Local search filtering (name, email, phone, address)
- Case-insensitive search
- Result limiting (20 results, 10 when empty)
- Dropdown display and interaction
- Customer selection callback
- Loading states
- Error handling
- Empty state handling

**Tests Created:** 18 tests

### Module 2.2: WorkOrderForm Component

**File:** `frontend/src/components/work-orders/__tests__/WorkOrderForm.test.tsx` ✅

**Coverage:**
- Technician loading (`enhancedApi.technicians.list()`)
- Technician dropdown display
- Customer search integration
- Form submission with selected customer/technician
- Form validation
- Loading states
- Error handling
- Empty technician list handling

**Tests Created:** 22 tests

### Module 2.3: API Client Integration Tests

**File:** `frontend/test/integration/api-clients.test.ts` ✅

**Coverage:**
- `enhancedApi.technicians.list()` - successful response, error handling, tenant isolation
- `secureApiClient.getAllAccounts()` - successful response, error handling, tenant isolation
- `enhancedApi.accounts.search()` - search functionality, query building
- Authentication token handling
- Request/response transformation
- Error handling and retry logic

**Tests Created:** 15 tests

### Module 2.4: Work Order E2E Tests

**File:** `frontend/src/test/e2e/work-orders.e2e.test.ts` ✅

**Coverage:**
- Create work order with customer search
- Create work order with technician assignment
- View technician list on work order form
- Search and select customer
- Form submission workflow
- Error scenarios

**Tests Created:** 10 tests

---

## Phase 3: Component Test Expansion (Target: 80%+ Coverage)

**Goal:** Achieve 80%+ coverage for all UI and business components  
**Estimated Impact:** +30-40% overall coverage

### Module 3.1: UI Components (Target: 80%+ Coverage)

**Location:** `frontend/src/components/ui/__tests__/`

**Components to Test:**

1. **CustomerSearchSelector** ✅ (Phase 2.1)
2. **Dialog.tsx** - Modal rendering, open/close, backdrop click, escape key
3. **Dropdown.tsx** - Dropdown toggle, option selection, keyboard navigation
4. **Form.tsx** - Form submission, validation, error display
5. **Input.tsx** (expand existing) - Additional edge cases, validation states
6. **Select.tsx** - Option selection, search, multi-select, disabled states
7. **Button.tsx** (expand existing) - Loading states, disabled states, variants, sizes
8. **Checkbox.tsx** - Check/uncheck, indeterminate state, disabled state
9. **Radio.tsx** - Radio group selection, keyboard navigation, disabled state
10. **Textarea.tsx** - Text input, character count, validation, resize

**Estimated Tests:** 80-100 tests  
**Estimated Time:** 4-5 days

### Module 3.2: Work Order Components (Target: 80%+ Coverage)

**Location:** `frontend/src/components/work-orders/__tests__/`

**Components to Test:**

1. **WorkOrderForm** ✅ (Phase 2.2)
2. **WorkOrderDetail.tsx** - Data display, edit mode, status updates, related data
3. **WorkOrderList.tsx** - List rendering, filtering, sorting, pagination, selection
4. **WorkOrderCard.tsx** - Card display, click handlers, status badges, priority indicators

**Estimated Tests:** 30-40 tests  
**Estimated Time:** 2-3 days

### Module 3.3: Customer Components (Target: 80%+ Coverage)

**Location:** `frontend/src/components/customers/__tests__/` and `frontend/src/components/customer/__tests__/`

**Components to Test:**

1. **CustomerForm.tsx** (expand existing) - Additional validation, edge cases, all fields
2. **CustomerList.tsx** - List rendering, search, filtering, pagination, sorting
3. **CustomerDetail.tsx** - Data display, tabs, edit mode, related data
4. **CustomerCard.tsx** - Card display, interactions, status indicators
5. **CustomerInfoPanel.tsx** - Panel rendering, data display, edit functionality

**Estimated Tests:** 40-50 tests  
**Estimated Time:** 3-4 days

### Module 3.4: Technician Components (Target: 80%+ Coverage)

**Location:** `frontend/src/components/technicians/__tests__/`

**Components to Test:**

1. **TechnicianForm.tsx** - Form submission, validation, skill management, availability
2. **TechnicianList.tsx** - List rendering, filtering, availability display, status
3. **TechnicianCard.tsx** - Card display, availability status, skills display
4. **TechnicianScheduler.tsx** - Scheduling interface, availability calendar, conflicts

**Estimated Tests:** 30-40 tests  
**Estimated Time:** 2-3 days

---

## Phase 4: Hook Tests (Target: 80%+ Coverage)

**Goal:** Achieve 80%+ coverage for all custom hooks  
**Estimated Impact:** +15-20% overall coverage

### Module 4.1: Custom Hooks Testing

**Location:** `frontend/src/hooks/__tests__/`

**Hooks to Test:**

1. **useAuth.ts** (expand existing) - Additional scenarios, token refresh, logout
2. **useOptimizedSearch.ts** - Search functionality, caching, debouncing, error handling
3. **useRealtimeCollaboration.ts** - WebSocket connection, message handling, reconnection
4. **useJobs.ts** - Job fetching, filtering, mutations, status updates
5. **useWebSocket.ts** - Connection management, message handling, error recovery
6. **useRegionLayout.ts** (expand existing) - Additional layout scenarios, persistence
7. **useDashboardState.ts** - State management, card selection, persistence
8. **useServerPersistence.ts** - API calls, error handling, loading states, retry logic

**Estimated Tests:** 50-60 tests  
**Estimated Time:** 3-4 days

---

## Phase 5: Integration Tests (Target: 70%+ Coverage)

**Goal:** Achieve 70%+ coverage for integration scenarios  
**Estimated Impact:** +10-15% overall coverage

### Module 5.1: API Integration Tests

**Location:** `frontend/test/integration/`

**Test Files:**

1. **api-clients.test.ts** ✅ (Phase 2.3)
2. **work-orders-integration.test.ts** - Full work order creation flow with customer/technician
3. **customer-search-integration.test.ts** - Customer search flow, API → component
4. **technician-list-integration.test.ts** - Technician listing flow, API → component
5. **auth-integration.test.ts** - Authentication flow, token management, session handling

**Estimated Tests:** 40-50 tests  
**Estimated Time:** 3-4 days

### Module 5.2: Component Integration Tests

**Location:** `frontend/test/integration/components/`

**Test Files:**

1. **work-order-creation-flow.test.tsx** - WorkOrderForm + CustomerSearchSelector + TechnicianList
2. **customer-management-flow.test.tsx** - CustomerList + CustomerForm + CustomerDetail
3. **dashboard-interactions.test.tsx** - Dashboard components working together

**Estimated Tests:** 20-30 tests  
**Estimated Time:** 2-3 days

---

## Phase 6: E2E Test Expansion (Target: All Critical Flows)

**Goal:** Cover all critical user flows with E2E tests  
**Estimated Impact:** Confidence in end-to-end functionality

### Module 6.1: Critical User Flows

**Location:** `frontend/src/test/e2e/`

**Test Files:**

1. **work-orders.e2e.test.ts** ✅ (Phase 2.4)
2. **customer-management.e2e.test.ts** (expand existing) - Additional scenarios
3. **technician-management.e2e.test.ts** - Technician CRUD operations, availability management
4. **dashboard-workflow.e2e.test.ts** - Dashboard interactions, card management, customization
5. **authentication-flow.e2e.test.ts** - Login, logout, session management, token refresh

**Estimated Tests:** 30-40 tests  
**Estimated Time:** 3-4 days

### Module 6.2: Accessibility E2E Tests

**Location:** `frontend/src/test/e2e/accessibility/`

**Test Files:**

1. **keyboard-navigation.e2e.test.ts** - Tab navigation, keyboard shortcuts, focus management
2. **screen-reader.e2e.test.ts** - ARIA labels, screen reader compatibility, semantic HTML
3. **color-contrast.e2e.test.ts** - WCAG contrast requirements, color accessibility

**Estimated Tests:** 15-20 tests  
**Estimated Time:** 2-3 days

### Module 6.3: Performance E2E Tests

**Location:** `frontend/src/test/e2e/performance/`

**Test Files:**

1. **page-load-performance.e2e.test.ts** - Initial load times, Lighthouse metrics, bundle size
2. **component-render-performance.e2e.test.ts** - Component render times, re-render optimization
3. **api-response-performance.e2e.test.ts** - API response times, caching effectiveness

**Estimated Tests:** 10-15 tests  
**Estimated Time:** 2-3 days

---

## Test Patterns & Utilities

### Existing Test Utilities

1. **`src/test/utils/testHelpers.tsx`** ✅ - Component rendering helpers, mock factories
2. **`src/test/utils/apiMocks.ts`** ✅ - API mocking utilities
3. **`src/test/utils/componentTestUtils.tsx`** ✅ - Component test utilities
4. **`src/test/setup.ts`** ✅ - Global mocks (browser APIs, etc.)
5. **`src/test/setup/enterprise-testing-setup.tsx`** ✅ - Extended test utilities

### Test Pattern Template

```typescript
/**
 * [Component Name] Component Tests
 * Tests for [description]
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ComponentName } from '../ComponentName';
import { renderWithAllProviders, createMockData } from '@/test/utils/testHelpers';

describe('ComponentName', () => {
  let mockOnAction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAction = vi.fn();
  });

  describe('Rendering', () => {
    it('should render component', () => {
      renderWithAllProviders(<ComponentName onAction={mockOnAction} />);
      expect(screen.getByTestId('component')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle user interaction', async () => {
      renderWithAllProviders(<ComponentName onAction={mockOnAction} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnAction).toHaveBeenCalled();
      });
    });
  });
});
```

### Testing Best Practices

1. **Follow AAA Pattern** - Arrange, Act, Assert
2. **Test One Thing** - Each test verifies a single behavior
3. **Use Descriptive Names** - Clear test descriptions
4. **Mock External Dependencies** - Use existing mocks from `src/test/utils/apiMocks.ts`
5. **Test Error Cases** - Don't just test happy paths
6. **Test Edge Cases** - Boundary conditions, null values, etc.
7. **Maintain Test Isolation** - Each test should be independent
8. **Use Test Fixtures** - Reusable test data from mock factories

---

## Milestone Targets

### Milestone 1: 25% Coverage
**Target Date:** Week 1-2  
**Focus:** Complete Phase 2 (Critical Missing Tests) ✅
- CustomerSearchSelector: ✅ 80%+
- WorkOrderForm: ✅ 80%+
- API Integration: ✅ 70%+
- E2E Tests: ✅ Critical flows

**Expected Coverage:** 25-30% overall

---

### Milestone 2: 50% Coverage
**Target Date:** Week 3-4  
**Focus:** Complete Phase 3 (Component Test Expansion)
- UI Components: 80%+
- Work Order Components: 80%+
- Customer Components: 80%+
- Technician Components: 80%+

**Expected Coverage:** 50-55% overall

---

### Milestone 3: 75% Coverage
**Target Date:** Week 5-6  
**Focus:** Complete Phase 4 (Hook Tests) + Phase 5 (Integration Tests)
- Hook Tests: 80%+
- Integration Tests: 70%+
- Component Integration: 70%+

**Expected Coverage:** 75-80% overall

---

### Milestone 4: 80% Coverage
**Target Date:** Week 7-8  
**Focus:** Complete Phase 6 (E2E Expansion) + Polish
- E2E Tests: All critical flows
- Accessibility Tests: WCAG compliance
- Performance Tests: Benchmarks
- Fill gaps in existing tests

**Expected Coverage:** 80%+ overall

---

## Implementation Strategy

### Week-by-Week Breakdown

**Week 1-2: Critical Tests (COMPLETED)**
- ✅ Phase 1: Test Suite Guide
- ✅ Phase 2: Critical Missing Tests
- ✅ Phase 7: Test Utilities Expansion
- ✅ Phase 8: Test Configuration Updates

**Week 3-4: Component Tests**
- Day 1-3: UI Components tests (Module 3.1)
- Day 4-5: Work Order Components tests (Module 3.2)
- Day 6-7: Customer Components tests (Module 3.3)
- Day 8-9: Technician Components tests (Module 3.4)
- Day 10: Review, fix issues, update coverage

**Week 5-6: Hooks & Integration**
- Day 1-3: Hook tests (Module 4.1)
- Day 4-6: API Integration tests (Module 5.1)
- Day 7-9: Component Integration tests (Module 5.2)
- Day 10: Review and gap analysis

**Week 7-8: E2E & Documentation**
- Day 1-3: E2E test expansion (Module 6.1)
- Day 4-5: Accessibility E2E tests (Module 6.2)
- Day 6-7: Performance E2E tests (Module 6.3)
- Day 8-9: Final review, coverage verification
- Day 10: Documentation updates

---

## Success Metrics

### Coverage Metrics
- **Statements:** 80%+ (currently ~10%)
- **Branches:** 80%+ (currently ~8%)
- **Functions:** 80%+ (currently ~9%)
- **Lines:** 80%+ (currently ~10%)

### Quality Metrics
- All critical user-facing components: 85%+ coverage
- All business logic components: 80%+ coverage
- All supporting components: 70%+ coverage
- All hooks: 80%+ coverage
- All integration scenarios: 70%+ coverage

### Test Quality
- All tests follow AAA pattern
- All tests have descriptive names
- All error paths tested
- All edge cases covered
- All tests are isolated and independent

---

## Risk Mitigation

### Potential Risks

1. **Time Overruns**
   - **Risk:** Testing complex components takes longer than estimated
   - **Mitigation:** Prioritize critical paths, defer edge cases if needed

2. **Test Maintenance**
   - **Risk:** Tests break when code changes
   - **Mitigation:** Use proper mocking, test behavior not implementation

3. **Coverage Gaps**
   - **Risk:** Some code paths difficult to test
   - **Mitigation:** Document untestable code, use coverage exclusions appropriately

4. **Integration Issues**
   - **Risk:** Tests don't reflect real-world usage
   - **Mitigation:** Complement with E2E tests, use realistic mocks

---

## Next Steps

1. **Immediate Actions:**
   - [x] Update `vitest.config.ts` with exclusions
   - [x] Create test directory structure for new modules
   - [x] Set up test utilities/fixtures
   - [x] Review existing test patterns
   - [x] Create critical missing tests (Phase 2)

2. **Start Implementation:**
   - [ ] Begin with Phase 3, Module 3.1 (UI Components)
   - [ ] Follow test pattern template
   - [ ] Run tests after each module completion
   - [ ] Update coverage reports

3. **Track Progress:**
   - [ ] Update this document with completion status
   - [ ] Track coverage metrics weekly
   - [ ] Review and adjust plan as needed

---

**Last Updated:** 2025-11-15  
**Status:** Phase 2 Completed, Phase 3 Ready for Implementation  
**Next Review:** After Milestone 2 completion

