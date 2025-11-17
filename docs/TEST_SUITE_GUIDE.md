# 🧪 VeroField Backend Test Suite Guide

Complete reference for running, understanding, and maintaining the VeroField backend test suite.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Test Commands Reference](#test-commands-reference)
3. [Test Types & Organization](#test-types--organization)
4. [Recommended Tests by Scenario](#recommended-tests-by-scenario)
5. [Running Specific Tests](#running-specific-tests)
6. [Test Configuration](#test-configuration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
```bash
# Ensure dependencies are installed
cd backend
npm install

# Setup test database (if needed)
npm run test:setup
```

### Run All Tests
```bash
npm run test:all
```

### Run Specific Test Type
```bash
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # End-to-end tests only
npm run test:security    # Security tests only
npm run test:performance # Performance tests only
```

---

## 📚 Test Commands Reference

### Core Test Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm test` | Run all tests (default Jest config) | Quick test run |
| `npm run test:watch` | Run tests in watch mode | Development |
| `npm run test:coverage` | Generate coverage report | Code coverage analysis |
| `npm run test:all` | Run all test types sequentially | Full test suite |

### Test Type Commands

| Command | Description | Test Files Location |
|---------|-------------|---------------------|
| `npm run test:unit` | Unit tests only | `src/**/__tests__/**/*.spec.ts` |
| `npm run test:integration` | Integration tests | `test/integration/**/*.test.ts` |
| `npm run test:e2e` | End-to-end API tests | `test/**/*.e2e-spec.ts` |
| `npm run test:component` | Component tests | Component test files |
| `npm run test:workflow` | Workflow tests | Workflow test files |
| `npm run test:security` | Security tests | `test/security/**/*.test.ts` |
| `npm run test:performance` | Performance tests | `test/performance/**/*.test.ts` |

### Quality & Reporting Commands

| Command | Description | Output |
|---------|-------------|--------|
| `npm run test:quality:report` | Generate comprehensive quality report | HTML, text, LCOV coverage |
| `npm run test:security:score` | Run security audit | npm audit report |
| `npm run test:performance:thresholds` | Run performance threshold tests | k6 load test results |

### Load Testing Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run load:test` | Standard load testing | Normal load scenarios |
| `npm run stress:test` | Stress testing | Peak load scenarios |

### Utility Commands

| Command | Description |
|---------|-------------|
| `npm run test:setup` | Setup test environment (generate Prisma client, push schema) |
| `npm run dashboard:generate` | Generate test dashboard HTML |
| `npm run dashboard:open` | Open test dashboard in browser |

---

## 🗂️ Test Types & Organization

### Unit Tests
**Location:** 
- `src/**/__tests__/**/*.spec.ts` (active unit tests)
- `test/unit/**/*.test.ts` (some tests are skipped - see notes below)

**Purpose:** Test individual functions, methods, and classes in isolation.

**Examples:**
- Service methods
- Repository methods
- Utility functions
- DTO validation

**Run:**
```bash
npm run test:unit
```

**Example Files (Active):**
- `src/dashboard/__tests__/dashboard.service.spec.ts` ✅
- `src/dashboard/repositories/__tests__/region.repository.spec.ts` ✅
- `src/common/services/__tests__/idempotency.service.spec.ts` ✅
- `src/dashboard/services/__tests__/saga.service.spec.ts` ✅
- `src/common/middleware/__tests__/rate-limit.middleware.spec.ts` ✅

**Skipped Tests (Need Updates):**
- `test/unit/auth/auth.service.test.ts` - Uses outdated methods, needs refactoring
- `test/unit/customers/customers.service.test.ts` - CustomersService doesn't exist yet
- `src/common/services/__tests__/authorization.service.spec.ts` - Prisma mock type issues

### Integration Tests
**Location:** `test/integration/**/*.test.ts`

**Purpose:** Test interactions between multiple components (services, repositories, database).

**Examples:**
- Service + Repository integration
- Database operations
- Cross-module workflows

**Run:**
```bash
npm run test:integration
```

**Example Files:**
- `test/integration/dashboard-regions.integration.test.ts`
- `test/integration/crm-workflow.test.ts`

### E2E Tests
**Location:** `test/**/*.e2e-spec.ts`

**Purpose:** Test complete API endpoints and workflows from HTTP request to response.

**Examples:**
- Full CRUD operations
- Authentication flows
- Multi-step workflows
- API versioning

**Run:**
```bash
npm run test:e2e
```

**Example Files:**
- `test/auth.e2e-spec.ts`
- `test/dashboard-regions.e2e-spec.ts`
- `test/work-orders.e2e-spec.ts`
- `test/tenant-isolation.e2e-spec.ts`

### Security Tests
**Location:** `test/security/**/*.test.ts`

**Purpose:** Test security vulnerabilities, RLS policies, and access control.

**Examples:**
- OWASP Top 10 vulnerabilities
- RLS policy enforcement
- Authorization checks
- Input validation

**Run:**
```bash
npm run test:security
```

**Example Files:**
- `test/security/owasp-security.test.ts`
- `test/security/rls-policy.test.ts`

### Performance Tests
**Location:** `test/performance/**/*.test.ts`

**Purpose:** Test performance, load handling, and scalability.

**Examples:**
- Response time benchmarks
- Load testing scenarios
- Stress testing
- Performance regression

**Run:**
```bash
npm run test:performance
```

**Example Files:**
- `test/performance/dashboard-regions-performance.test.ts`
- `test/performance/dashboard-regions-load-testing.js`

---

## 🎯 Recommended Tests by Scenario

### Scenario 1: Developing a New Feature

**Recommended Test Sequence:**
```bash
# 1. Run unit tests for the specific module
npm test -- --testPathPattern="your-module"

# 2. Run integration tests
npm run test:integration

# 3. Run E2E tests for the feature
npm run test:e2e -- --testPathPattern="your-feature"

# 4. Check coverage
npm run test:coverage -- --testPathPattern="your-module"
```

### Scenario 2: Before Committing Code

**Recommended Test Sequence:**
```bash
# 1. Run all unit tests (fast)
npm run test:unit

# 2. Run linting
npm run lint

# 3. Run affected E2E tests
npm run test:e2e -- --testPathPattern="affected-area"
```

### Scenario 3: Before Creating a Pull Request

**Recommended Test Sequence:**
```bash
# 1. Full test suite
npm run test:all

# 2. Security audit
npm run test:security:score

# 3. Coverage report
npm run test:quality:report
```

### Scenario 4: Testing API Changes

**Recommended Test Sequence:**
```bash
# 1. Run E2E tests for the API
npm run test:e2e -- --testPathPattern="api-name"

# 2. Test both v1 and v2 endpoints (if applicable)
npm run test:e2e -- --testPathPattern="api-name"

# 3. Run security tests
npm run test:security
```

### Scenario 5: Performance Testing

**Recommended Test Sequence:**
```bash
# 1. Run performance unit tests
npm run test:performance

# 2. Run load tests
npm run load:test

# 3. Run stress tests (if needed)
npm run stress:test
```

### Scenario 6: Security Audit

**Recommended Test Sequence:**
```bash
# 1. Run security tests
npm run test:security

# 2. Run security audit
npm run test:security:score

# 3. Run OWASP tests
npm run test:security -- --testPathPattern="owasp"
```

### Scenario 7: Debugging a Failing Test

**Recommended Approach:**
```bash
# 1. Run specific test file
npm test -- test/path/to/test.spec.ts

# 2. Run in watch mode for iterative debugging
npm run test:watch -- test/path/to/test.spec.ts

# 3. Run with verbose output
npm test -- test/path/to/test.spec.ts --verbose
```

---

## 🎮 Running Specific Tests

### Run Tests by File Pattern

```bash
# Run all tests matching a pattern
npm test -- --testPathPattern="dashboard"

# Run specific test file
npm test -- test/dashboard-regions.e2e-spec.ts

# Run tests matching multiple patterns
npm test -- --testPathPattern="dashboard|work-orders"
```

### Run Tests by Name Pattern

```bash
# Run tests with specific name
npm test -- --testNamePattern="should create"

# Run tests matching multiple names
npm test -- --testNamePattern="create|update"
```

### Run Tests in Watch Mode

```bash
# Watch all tests
npm run test:watch

# Watch specific file
npm run test:watch -- test/dashboard-regions.e2e-spec.ts

# Watch with pattern
npm run test:watch -- --testPathPattern="dashboard"
```

### Run Tests with Coverage

```bash
# Coverage for all tests
npm run test:coverage

# Coverage for specific pattern
npm run test:coverage -- --testPathPattern="dashboard"

# Coverage with HTML report
npm run test:quality:report
```

### Run E2E Tests for Specific Files

```bash
# Single E2E test file
npm run test:e2e -- dashboard-regions.e2e-spec.ts

# Multiple E2E test files
npm run test:e2e -- dashboard-regions.e2e-spec.ts work-orders.e2e-spec.ts

# E2E tests matching pattern
npm run test:e2e -- --testPathPattern="dashboard"
```

### Run Tests with Specific Options

```bash
# Run with increased timeout
npm test -- --testTimeout=10000

# Run with verbose output
npm test -- --verbose

# Run with no coverage
npm test -- --coverage=false

# Run with specific max workers
npm test -- --maxWorkers=2
```

---

## ⚙️ Test Configuration

### Jest Configuration Files

| File | Purpose | Used By |
|------|---------|---------|
| `jest.config.js` | Default Jest config | `npm test` |
| `test/jest-e2e.json` | E2E test config | `npm run test:e2e` |
| `test/enterprise-testing.config.js` | Enterprise test config | `test:unit`, `test:integration`, etc. |

### Environment Variables

Test environment variables are loaded from:
- `test/.env.test` - Test-specific environment variables
- `.env.test` - Fallback test environment

**Key Variables:**
- `DATABASE_URL` - Test database connection
- `JWT_SECRET` - JWT signing secret for tests
- `SUPABASE_URL` - Supabase URL (mocked in tests)
- `SUPABASE_KEY` - Supabase key (mocked in tests)

### Test Setup & Teardown

**Global Setup:** `test/global-setup.ts`
- Creates test database
- Seeds test data
- Sets up test users and tenants

**Global Teardown:** `test/global-teardown.ts`
- Cleans up test data
- Closes database connections

**Test Setup:** `test/setup.ts`
- Mocks external services (Supabase, etc.)
- Configures test environment
- Sets up test utilities

---

## 💡 Best Practices

### Writing Tests

1. **Follow AAA Pattern**
   - Arrange: Set up test data
   - Act: Execute the code being tested
   - Assert: Verify the results

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should return 404 when region does not exist', async () => { ... });
   
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
   - Mock Supabase, external APIs, etc.
   - Use `test/setup.ts` for global mocks

### Test Organization

1. **Group Related Tests**
   ```typescript
   describe('DashboardService', () => {
     describe('createRegion', () => {
       it('should create region successfully', ...);
       it('should validate input', ...);
     });
   });
   ```

2. **Use Shared Test Utilities**
   - `test/utils/test-app.ts` - App setup
   - `test/utils/test-auth.ts` - Auth helpers
   - `test/utils/validate-v2.ts` - V2 API validation

3. **Keep Tests Isolated**
   - Each test should be independent
   - Don't rely on test execution order
   - Clean up test data after each test

### Performance

1. **Use Appropriate Test Types**
   - Unit tests for fast feedback
   - E2E tests for full workflows
   - Performance tests for benchmarks

2. **Parallel Execution**
   - Unit tests run in parallel
   - E2E tests may run sequentially to avoid conflicts

3. **Test Timeouts**
   - Unit tests: 5s default
   - Integration tests: 10s default
   - E2E tests: 30s default

---

## 📊 Understanding Test Output

### Test Output Structure

When you run `npm run test:all`, you'll see output for each test type. **Note:** The command uses `&&` which means it stops on the first failure. If unit tests fail coverage thresholds, subsequent test types won't run.

**To run all test types even if one fails:**
```bash
# Run each test type separately
npm run test:unit
npm run test:integration  
npm run test:security
npm run test:performance
npm run test:e2e
```

#### 1. **Unit Tests Output**
```
Test Suites: X passed/failed, X total
Tests:       X passed, X failed, X skipped, X total
Snapshots:   X total
Time:        X.XXX s
```

**Coverage Report:**
```
File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------------|---------|----------|---------|---------|-------------------
All files                          |   XX%   |   XX%    |   XX%   |   XX%   |
```

**Coverage Thresholds:**
- If coverage is below thresholds (default 80%), Jest will fail
- You can see which files need more coverage in the detailed report

#### 2. **Integration Tests Output**
Similar format to unit tests, but tests cross-module interactions.

#### 3. **E2E Tests Output**
```
PASS test/dashboard-regions.e2e-spec.ts (XX.XXX s)
PASS test/work-orders.e2e-spec.ts (XX.XXX s)

Test Suites: X passed, X total
Tests:       X passed, X total
```

#### 4. **Security Tests Output**
Shows security vulnerability checks and OWASP compliance.

#### 5. **Performance Tests Output**
Shows load test results, response times, and throughput metrics.

### Understanding Coverage Metrics

- **Statements (% Stmts)**: Percentage of code statements executed
- **Branches (% Branch)**: Percentage of conditional branches tested
- **Functions (% Funcs)**: Percentage of functions called
- **Lines (% Lines)**: Percentage of code lines executed

### Common Output Messages

#### ✅ Success Indicators
- `PASS` - Test suite passed
- `Tests: X passed` - All tests passed
- Coverage thresholds met

#### ⚠️ Warning Indicators
- `npm warn` - Non-critical npm warnings (can be ignored)
- `Tests: X skipped` - Tests marked with `.skip()` or `describe.skip()`
- Coverage below threshold (warning, not failure)

#### ❌ Failure Indicators
- `FAIL` - Test suite failed
- `Tests: X failed` - Some tests failed
- Coverage thresholds not met (if configured to fail)
- Error messages with stack traces

### Example: Full Test Run Output

```bash
npm run test:all

# Unit Tests
Test Suites: 2 skipped, 0 of 2 total
Tests:       64 skipped, 64 total
Coverage:    0.25% statements (below 80% threshold)

# Integration Tests
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total

# Security Tests
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total

# Performance Tests
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total

# E2E Tests
Test Suites: 2 passed, 2 total
Tests:       38 passed, 38 total
```

**Interpretation:**
- Some unit tests are skipped (using `describe.skip()` - see notes below)
- Active unit tests are running and passing
- Integration, Security, Performance, and E2E tests all passed
- Coverage is low because many unit tests are skipped or not yet written

**Note on Skipped Unit Tests:**
- `test/unit/auth/auth.service.test.ts` - Skipped: Uses outdated methods, needs refactoring
- `test/unit/customers/customers.service.test.ts` - Skipped: CustomersService doesn't exist yet
- `src/common/services/__tests__/authorization.service.spec.ts` - Skipped: Prisma mock type issues

## 🔧 Troubleshooting

### Common Issues

#### Issue: Vitest Import Error in Jest Tests

**Error:**
```
Vitest cannot be imported in a CommonJS module using require()
```

**Cause:** Compiled `.js` files contain stale Vitest imports from previous setup.

**Solution:**
```bash
# Delete compiled test files
rm test/setup.js test/setup.d.ts test/setup.js.map

# Or update config to use .ts directly (already done)
# The config now uses test/setup.ts instead of test/setup.js
```

#### Issue: All Tests Skipped

**Symptom:**
```
Test Suites: X skipped, 0 of X total
Tests:       X skipped, X total
```

**Cause:** Tests are using `describe.skip()` or `it.skip()`.

**Solution:**
- Remove `.skip()` from test files
- Or check if tests are intentionally skipped for a reason
- Look for `describe.skip('TestName', ...)` in test files

**Example:**
```typescript
// This test is skipped
describe.skip('AuthService', () => { ... });

// Change to:
describe('AuthService', () => { ... });
```

#### Issue: Tests Timing Out

**Solution:**
```bash
# Increase timeout for specific test
npm test -- --testTimeout=30000

# Or update jest config
```

#### Issue: Database Connection Errors

**Solution:**
```bash
# Ensure test database is running
# Check DATABASE_URL in test/.env.test
# Run test setup
npm run test:setup
```

#### Issue: Tests Failing Due to Mock Issues

**Solution:**
- Check `test/setup.ts` for mock configuration
- Verify Supabase mocks are properly set up
- Clear mock stores between tests if needed

#### Issue: E2E Tests Failing

**Solution:**
```bash
# Run with verbose output
npm run test:e2e -- --verbose

# Run specific test file
npm run test:e2e -- dashboard-regions.e2e-spec.ts

# Check test logs for detailed errors
```

#### Issue: Coverage Below Threshold

**Error:**
```
Jest: "global" coverage threshold for statements (80%) not met: 0.25%
```

**Causes:**
1. Tests are skipped (most common) - if tests use `describe.skip()`, they don't run and don't contribute to coverage
2. Not enough test coverage - need to write more tests
3. Coverage collection not configured correctly

**Solutions:**
```bash
# 1. Ensure tests are not skipped
# Remove .skip() from test files (e.g., describe.skip -> describe)

# 2. Run tests with coverage to see detailed report
npm run test:coverage

# 3. Check which files need coverage
npm run test:coverage -- --testPathPattern="your-module"

# 4. Temporarily lower threshold for development (not recommended)
# Update enterprise-testing.config.js coverageThreshold values
```

#### Issue: Coverage Not Generating

**Solution:**
```bash
# Ensure coverage is enabled
npm run test:coverage

# Check coverage directory permissions
# Verify jest config has coverage settings
```

#### Issue: npm Warnings

**Warning:**
```
npm warn Unknown env config "msvs-version"
npm warn Unknown env config "python"
```

**Solution:** These are harmless warnings from npm configuration. They can be safely ignored. They occur when npm finds environment variables that aren't recognized. To remove them, check your `.npmrc` file or environment variables.

### Debugging Tips

1. **Use `console.log` in tests** (removed in production)
2. **Run tests in watch mode** for iterative debugging
3. **Use `--verbose` flag** for detailed output
4. **Check test logs** in `test/` directory
5. **Use debugger** with `--inspect` flag

---

## 📊 Test Coverage Goals

### Target Coverage

- **Unit Tests:** >90% code coverage
- **Integration Tests:** >80% integration coverage
- **E2E Tests:** All critical user flows
- **Security Tests:** 100% OWASP Top 10 coverage

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
npm run dashboard:open

# Coverage for specific module
npm run test:coverage -- --testPathPattern="dashboard"
```

---

## 🔗 Related Documentation

- [Enterprise Testing Framework](../ENTERPRISE_TESTING_FRAMEWORK.md) - High-level testing strategy
- [API Test Issues](./API_TEST_ISSUES.md) - Known issues and fixes
- [Testing Progress](../docs/developer/TESTING_PROGRESS.md) - Test development progress
- [Test Results Summary](../docs/developer/TEST_RESULTS_SUMMARY.md) - Latest test results

---

## 📝 Test File Naming Conventions

- **Unit Tests:** `*.spec.ts` (e.g., `dashboard.service.spec.ts`)
- **Integration Tests:** `*.integration.test.ts` (e.g., `dashboard-regions.integration.test.ts`)
- **E2E Tests:** `*.e2e-spec.ts` (e.g., `dashboard-regions.e2e-spec.ts`)
- **Security Tests:** `*.security.test.ts` (e.g., `owasp-security.test.ts`)
- **Performance Tests:** `*.performance.test.ts` (e.g., `dashboard-regions-performance.test.ts`)

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review test logs and error messages
3. Check [API Test Issues](./API_TEST_ISSUES.md)
4. Review test setup in `test/setup.ts`
5. Ask the development team

---

**Last Updated:** 2025-11-15  
**Maintained By:** VeroField Development Team

