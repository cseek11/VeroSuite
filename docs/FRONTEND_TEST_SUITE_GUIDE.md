# VeroField Frontend Test Suite Guide

Complete reference for running, understanding, and maintaining the VeroField frontend test suite.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Commands Reference](#test-commands-reference)
3. [Test Types & Organization](#test-types--organization)
4. [Recommended Tests by Scenario](#recommended-tests-by-scenario)
5. [Running Specific Tests](#running-specific-tests)
6. [Test Configuration](#test-configuration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
```bash
# Ensure dependencies are installed
cd frontend
npm install

# Setup Playwright browsers (if needed)
npm run test:setup
```

### Run All Tests
```bash
npm run test:all
```

### Run Specific Test Type
```bash
npm run test:unit        # Unit tests only (Vitest)
npm run test:component   # Component tests only (Vitest)
npm run test:integration # Integration tests only (Vitest)
npm run test:e2e         # End-to-end tests only (Playwright)
npm run test:accessibility # Accessibility tests (Playwright)
npm run test:performance # Performance tests (Playwright)
npm run test:security    # Security tests (Playwright)
```

---

## Test Commands Reference

### Core Test Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm test` | Run all tests (Vitest default) | Quick test run |
| `npm run test:watch` | Run tests in watch mode | Development |
| `npm run test:coverage` | Generate coverage report | Code coverage analysis |
| `npm run test:all` | Run all test types sequentially | Full test suite |
| `npm run test:ui` | Open Vitest UI | Interactive test runner |

### Test Type Commands

| Command | Description | Test Files Location |
|---------|-------------|---------------------|
| `npm run test:unit` | Unit tests only | `src/**/__tests__/**/*.test.tsx` |
| `npm run test:component` | Component tests | `src/**/__tests__/**/*.test.tsx` |
| `npm run test:integration` | Integration tests | `test/integration/**/*.test.ts` |
| `npm run test:hooks` | Hook tests | `src/hooks/__tests__/**/*.test.ts` |
| `npm run test:e2e` | End-to-end tests | `test/e2e/**/*.e2e.test.ts` |
| `npm run test:accessibility` | Accessibility tests | `test/e2e/accessibility/**/*.test.ts` |
| `npm run test:performance` | Performance tests | `test/e2e/performance/**/*.test.ts` |
| `npm run test:security` | Security tests | `test/e2e/**/*.test.ts` (tagged) |

### Quality & Reporting Commands

| Command | Description | Output |
|---------|-------------|--------|
| `npm run test:coverage` | Generate coverage report | HTML, text, LCOV coverage |
| `npm run test:report` | Show Playwright HTML report | HTML report |
| `npm run test:ci` | CI/CD optimized test run | Verbose output with coverage |

### Utility Commands

| Command | Description |
|---------|-------------|
| `npm run test:setup` | Setup Playwright browsers |
| `npm run test:ui` | Open Vitest UI for interactive testing |

---

## Test Types & Organization

### Unit Tests
**Location:** 
- `src/**/__tests__/**/*.test.tsx` (component tests)
- `src/**/__tests__/**/*.test.ts` (utility/function tests)

**Purpose:** Test individual functions, utilities, and pure logic in isolation.

**Examples:**
- Utility functions
- Helper functions
- Pure logic functions
- Data transformations

**Run:**
```bash
npm run test:unit
```

**Example Files:**
- `src/lib/__tests__/search-service.test.ts` ✅
- `src/lib/__tests__/unified-search-service.test.ts` ✅

### Component Tests
**Location:** `src/**/__tests__/**/*.test.tsx`

**Purpose:** Test React components in isolation with mocked dependencies.

**Examples:**
- Component rendering
- User interactions
- Props handling
- State management
- Event handlers

**Run:**
```bash
npm run test:component
```

**Example Files:**
- `src/components/__tests__/Button.test.tsx` ✅
- `src/components/__tests__/Input.test.tsx` ✅
- `src/components/__tests__/CustomerForm.test.tsx` ✅
- `src/components/ui/__tests__/CustomerSearchSelector.test.tsx` (to be created)

### Integration Tests
**Location:** `test/integration/**/*.test.ts`

**Purpose:** Test interactions between multiple components, hooks, and API clients.

**Examples:**
- Component + API integration
- Multiple components working together
- Full feature workflows
- API client interactions

**Run:**
```bash
npm run test:integration
```

**Example Files:**
- `test/integration/api-clients.test.ts` (to be created)
- `test/integration/work-orders-integration.test.ts` (to be created)
- `test/integration/customer-search-integration.test.ts` (to be created)

### Hook Tests
**Location:** `src/hooks/__tests__/**/*.test.ts`

**Purpose:** Test custom React hooks in isolation.

**Examples:**
- `useAuth` hook
- `useOptimizedSearch` hook
- `useRealtimeCollaboration` hook
- `useJobs` hook

**Run:**
```bash
npm run test:hooks
```

**Example Files:**
- `src/hooks/__tests__/useAuth.test.ts` ✅
- `src/hooks/__tests__/useRegionLayout.test.ts` ✅

### E2E Tests
**Location:** `test/e2e/**/*.e2e.test.ts`

**Purpose:** Test complete user workflows from browser perspective.

**Examples:**
- Full user flows
- Multi-step workflows
- Cross-component interactions
- Real API calls (in test environment)

**Run:**
```bash
npm run test:e2e
```

**Example Files:**
- `test/e2e/customer-management.e2e.test.ts` ✅
- `test/e2e/work-orders.e2e.test.ts` (to be created)
- `test/e2e/technician-management.e2e.test.ts` (to be created)

### Accessibility Tests
**Location:** `test/e2e/accessibility/**/*.test.ts`

**Purpose:** Test accessibility compliance and keyboard navigation.

**Examples:**
- Keyboard navigation
- Screen reader compatibility
- ARIA labels
- Color contrast
- Focus management

**Run:**
```bash
npm run test:accessibility
```

**Example Files:**
- `test/e2e/accessibility/keyboard-navigation.e2e.test.ts` (to be created)
- `test/e2e/accessibility/screen-reader.e2e.test.ts` (to be created)

### Performance Tests
**Location:** `test/e2e/performance/**/*.test.ts`

**Purpose:** Test performance metrics and load times.

**Examples:**
- Page load times
- Component render performance
- API response times
- Lighthouse metrics

**Run:**
```bash
npm run test:performance
```

**Example Files:**
- `test/e2e/performance/page-load-performance.e2e.test.ts` (to be created)
- `test/e2e/performance/component-render-performance.e2e.test.ts` (to be created)

---

## Recommended Tests by Scenario

### Scenario 1: Developing a New Component

**Recommended Test Sequence:**
```bash
# 1. Run component tests in watch mode
npm run test:watch -- --testPathPattern="YourComponent"

# 2. Run component tests with coverage
npm run test:coverage -- --testPathPattern="YourComponent"

# 3. Run integration tests if component uses APIs
npm run test:integration -- --testPathPattern="your-feature"

# 4. Run E2E tests for the feature
npm run test:e2e -- --grep="your-feature"
```

### Scenario 2: Before Committing Code

**Recommended Test Sequence:**
```bash
# 1. Run all unit and component tests (fast)
npm run test:unit
npm run test:component

# 2. Run linting
npm run lint

# 3. Run affected integration tests
npm run test:integration -- --testPathPattern="affected-area"

# 4. Run affected E2E tests
npm run test:e2e -- --grep="affected-area"
```

### Scenario 3: Before Creating a Pull Request

**Recommended Test Sequence:**
```bash
# 1. Full test suite
npm run test:all

# 2. Coverage report
npm run test:coverage

# 3. Accessibility check
npm run test:accessibility
```

### Scenario 4: Testing API Integration

**Recommended Test Sequence:**
```bash
# 1. Run integration tests
npm run test:integration

# 2. Run E2E tests that use APIs
npm run test:e2e -- --grep="api"

# 3. Check API client tests
npm run test:unit -- --testPathPattern="api"
```

### Scenario 5: Performance Testing

**Recommended Test Sequence:**
```bash
# 1. Run performance E2E tests
npm run test:performance

# 2. Check component render times in component tests
npm run test:component -- --testPathPattern="performance"
```

### Scenario 6: Accessibility Audit

**Recommended Test Sequence:**
```bash
# 1. Run accessibility E2E tests
npm run test:accessibility

# 2. Run component tests with accessibility checks
npm run test:component -- --testPathPattern="accessibility"
```

### Scenario 7: Debugging a Failing Test

**Recommended Approach:**
```bash
# 1. Run specific test file
npm test -- src/path/to/test.test.tsx

# 2. Run in watch mode for iterative debugging
npm run test:watch -- src/path/to/test.test.tsx

# 3. Run with verbose output
npm test -- src/path/to/test.test.tsx --reporter=verbose

# 4. Use Vitest UI for interactive debugging
npm run test:ui
```

---

## Running Specific Tests

### Run Tests by File Pattern

```bash
# Run all tests matching a pattern
npm test -- --testPathPattern="CustomerSearch"

# Run specific test file
npm test -- src/components/ui/__tests__/CustomerSearchSelector.test.tsx

# Run tests matching multiple patterns
npm test -- --testPathPattern="Customer|WorkOrder"
```

### Run Tests by Name Pattern

```bash
# Run tests with specific name
npm test -- --testNamePattern="should render"

# Run tests matching multiple names
npm test -- --testNamePattern="should render|should handle"
```

### Run Tests in Watch Mode

```bash
# Watch all tests
npm run test:watch

# Watch specific file
npm run test:watch -- src/components/ui/__tests__/CustomerSearchSelector.test.tsx

# Watch with pattern
npm run test:watch -- --testPathPattern="Customer"
```

### Run Tests with Coverage

```bash
# Coverage for all tests
npm run test:coverage

# Coverage for specific pattern
npm run test:coverage -- --testPathPattern="Customer"

# Coverage with HTML report (opens automatically)
npm run test:coverage
```

### Run E2E Tests for Specific Files

```bash
# Single E2E test file
npm run test:e2e -- work-orders.e2e.test.ts

# Multiple E2E test files
npm run test:e2e -- work-orders.e2e.test.ts customer-management.e2e.test.ts

# E2E tests matching pattern
npm run test:e2e -- --grep="work-order"
```

### Run Tests with Specific Options

```bash
# Run with increased timeout
npm test -- --testTimeout=10000

# Run with verbose output
npm test -- --reporter=verbose

# Run with UI
npm run test:ui

# Run with specific workers
npm test -- --threads=2
```

---

## Test Configuration

### Vitest Configuration Files

| File | Purpose | Used By |
|------|---------|---------|
| `vitest.config.ts` | Default Vitest config | `npm test`, `npm run test:unit` |
| `vitest.e2e.config.ts` | E2E test config (if separate) | E2E tests |

### Playwright Configuration Files

| File | Purpose | Used By |
|------|---------|---------|
| `playwright.config.ts` | Playwright E2E config | `npm run test:e2e` |

### Environment Variables

Test environment variables are loaded from:
- `.env.test` - Test-specific environment variables
- `.env.local` - Local overrides (gitignored)

**Key Variables:**
- `VITE_SUPABASE_URL` - Supabase URL (mocked in tests)
- `VITE_SUPABASE_ANON_KEY` - Supabase key (mocked in tests)
- `VITE_API_URL` - API URL (mocked in tests)

### Test Setup & Teardown

**Test Setup:** `src/test/setup.ts`
- Mocks browser APIs (IntersectionObserver, ResizeObserver, etc.)
- Mocks localStorage and sessionStorage
- Mocks fetch API
- Configures test environment
- Sets up global mocks

**Enterprise Test Setup:** `src/test/setup/enterprise-testing-setup.tsx`
- Extended test utilities
- Custom matchers
- Performance testing utilities
- Accessibility testing utilities
- Security testing utilities

---

## Best Practices

### Writing Tests

1. **Follow AAA Pattern**
   - Arrange: Set up test data and mocks
   - Act: Execute the code being tested
   - Assert: Verify the results

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should display customer search results when typing in search box', async () => { ... });
   
   // Bad
   it('test 1', async () => { ... });
   ```

3. **Test One Thing Per Test**
   - Each test should verify a single behavior
   - Avoid testing multiple scenarios in one test

4. **Use Test Fixtures**
   - Create reusable test data factories
   - Use `beforeEach` for common setup
   - Clean up in `afterEach`

5. **Mock External Dependencies**
   - Mock API calls
   - Mock browser APIs
   - Use `src/test/setup.ts` for global mocks

### Test Organization

1. **Group Related Tests**
   ```typescript
   describe('CustomerSearchSelector', () => {
     describe('search functionality', () => {
       it('should filter customers by name', ...);
       it('should filter customers by email', ...);
     });
     
     describe('selection', () => {
       it('should call onChange when customer is selected', ...);
     });
   });
   ```

2. **Use Shared Test Utilities**
   - `src/test/utils/testHelpers.tsx` - Component rendering helpers
   - `src/test/utils/apiMocks.ts` - API mocking utilities
   - `src/test/utils/componentTestUtils.tsx` - Component test utilities

3. **Keep Tests Isolated**
   - Each test should be independent
   - Don't rely on test execution order
   - Clean up test data after each test

### Performance

1. **Use Appropriate Test Types**
   - Component tests for fast feedback
   - E2E tests for full workflows
   - Performance tests for benchmarks

2. **Parallel Execution**
   - Component tests run in parallel by default
   - E2E tests may run sequentially to avoid conflicts

3. **Test Timeouts**
   - Component tests: 10s default
   - Integration tests: 10s default
   - E2E tests: 30s default (configurable in Playwright)

---

## Understanding Test Output

### Test Output Structure

When you run `npm run test:all`, you'll see output for each test type. **Note:** The command uses `&&` which means it stops on the first failure.

**To run all test types even if one fails:**
```bash
# Run each test type separately
npm run test:unit
npm run test:component
npm run test:integration
npm run test:e2e
```

#### 1. **Component Tests Output (Vitest)**
```
✓ src/components/ui/__tests__/CustomerSearchSelector.test.tsx (15)
  ✓ CustomerSearchSelector (15)
    ✓ should render search input
    ✓ should display customers when typing
    ...

Test Files  1 passed (1)
     Tests  15 passed (15)
      Time  2.34s
```

**Coverage Report:**
```
File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------------|---------|----------|---------|---------|-------------------
All files                          |   XX%   |   XX%    |   XX%   |   XX%   |
```

**Coverage Thresholds:**
- If coverage is below thresholds (default 70%), Vitest will fail
- You can see which files need more coverage in the detailed report

#### 2. **Integration Tests Output**
Similar format to component tests, but tests cross-component interactions.

#### 3. **E2E Tests Output (Playwright)**
```
Running 10 tests using 1 worker

  ✓ test/e2e/work-orders.e2e.test.ts:5:3 › should create work order with customer (2.1s)
  ✓ test/e2e/work-orders.e2e.test.ts:15:3 › should assign technician to work order (1.8s)

  10 passed (15.2s)
```

#### 4. **Accessibility Tests Output**
Shows accessibility compliance checks and violations.

#### 5. **Performance Tests Output**
Shows performance metrics, load times, and Lighthouse scores.

### Understanding Coverage Metrics

- **Statements (% Stmts)**: Percentage of code statements executed
- **Branches (% Branch)**: Percentage of conditional branches tested
- **Functions (% Funcs)**: Percentage of functions called
- **Lines (% Lines)**: Percentage of code lines executed

### Common Output Messages

#### Success Indicators
- `✓` - Test passed
- `Test Files  X passed` - All tests passed
- Coverage thresholds met

#### Warning Indicators
- `⚠` - Warning (non-critical)
- `Tests: X skipped` - Tests marked with `.skip()` or `describe.skip()`
- Coverage below threshold (warning, not failure)

#### Failure Indicators
- `✗` - Test failed
- `Test Files  X failed` - Some tests failed
- Coverage thresholds not met (if configured to fail)
- Error messages with stack traces

---

## Troubleshooting

### Common Issues

#### Issue: Tests Timing Out

**Solution:**
```bash
# Increase timeout for specific test
npm test -- --testTimeout=30000

# Or update vitest.config.ts
test: {
  testTimeout: 30000
}
```

#### Issue: Component Not Rendering in Tests

**Solution:**
- Ensure all providers are wrapped (QueryClient, Router, etc.)
- Use `renderWithProviders` from `src/test/utils/testHelpers.tsx`
- Check that mocks are properly set up

#### Issue: API Calls Not Mocked

**Solution:**
- Check `src/test/setup.ts` for global fetch mocks
- Use `mockApiResponse` from `src/test/utils/apiMocks.ts`
- Ensure API clients are properly mocked in test setup

#### Issue: E2E Tests Failing

**Solution:**
```bash
# Run with verbose output
npm run test:e2e -- --reporter=verbose

# Run specific test file
npm run test:e2e -- work-orders.e2e.test.ts

# Run with UI for debugging
npm run test:e2e -- --ui

# Check if dev server is running
# E2E tests require the app to be running on localhost:5173
```

#### Issue: Coverage Below Threshold

**Error:**
```
Coverage threshold for statements (70%) not met: 45%
```

**Causes:**
1. Not enough test coverage - need to write more tests
2. Coverage collection not configured correctly
3. Files excluded from coverage

**Solutions:**
```bash
# 1. Run tests with coverage to see detailed report
npm run test:coverage

# 2. Check which files need coverage
npm run test:coverage -- --testPathPattern="your-module"

# 3. Temporarily lower threshold for development (not recommended)
# Update vitest.config.ts coverageThreshold values
```

#### Issue: Playwright Browsers Not Installed

**Error:**
```
Executable doesn't exist
```

**Solution:**
```bash
# Install Playwright browsers
npm run test:setup
```

#### Issue: React Query Cache Issues in Tests

**Solution:**
- Use `createTestQueryClient()` from test utilities
- Clear cache between tests in `afterEach`
- Use `QueryClientProvider` with test client in test setup

### Debugging Tips

1. **Use `console.log` in tests** (removed in production)
2. **Run tests in watch mode** for iterative debugging
3. **Use `--reporter=verbose` flag** for detailed output
4. **Use Vitest UI** (`npm run test:ui`) for interactive debugging
5. **Use Playwright UI** (`npm run test:e2e -- --ui`) for E2E debugging
6. **Check test logs** in `test-results/` directory

---

## Test Coverage Goals

### Target Coverage

- **Component Tests:** 80%+ code coverage
- **Hook Tests:** 80%+ code coverage
- **Integration Tests:** 70%+ integration coverage
- **E2E Tests:** All critical user flows covered
- **Accessibility Tests:** WCAG 2.1 AA compliance

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Coverage for specific module
npm run test:coverage -- --testPathPattern="Customer"

# Coverage report opens in browser automatically
```

---

## Related Documentation

- [Frontend Test Expansion Plan](./FRONTEND_TEST_EXPANSION_PLAN.md) - Phased approach to 80% coverage
- [Test Patterns](./TEST_PATTERNS.md) - Component, hook, API, and E2E test patterns
- [Backend Test Suite Guide](../backend/test/TEST_SUITE_GUIDE.md) - Backend testing reference

---

## Test File Naming Conventions

- **Component Tests:** `*.test.tsx` (e.g., `CustomerSearchSelector.test.tsx`)
- **Hook Tests:** `*.test.ts` (e.g., `useAuth.test.ts`)
- **Integration Tests:** `*.test.ts` (e.g., `api-clients.test.ts`)
- **E2E Tests:** `*.e2e.test.ts` (e.g., `work-orders.e2e.test.ts`)
- **Accessibility Tests:** `*.e2e.test.ts` in `test/e2e/accessibility/`
- **Performance Tests:** `*.e2e.test.ts` in `test/e2e/performance/`

---

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review test logs and error messages
3. Check [Test Patterns](./TEST_PATTERNS.md) for examples
4. Review test setup in `src/test/setup.ts`
5. Ask the development team

---

**Last Updated:** 2025-11-15  
**Maintained By:** VeroField Development Team

