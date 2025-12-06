# Verification and Testing Standards

**Priority:** HIGH  
**Last Updated:** 2025-12-04  
**Scope:** All code changes

---

## Testing Requirements by Type

### 1. Unit Tests (MANDATORY for new features)

**When Required:**
- New functions, utilities, or helper methods
- New React components
- New API endpoints
- Bug fixes (regression tests)

**Requirements:**
- Test happy paths
- Test error paths
- Test edge cases
- Test boundary conditions
- Minimum 80% code coverage for new code

**Location:**
- Co-located with source: `__tests__/` directories
- Example: `frontend/src/components/billing/__tests__/InvoiceGenerator.test.tsx`

---

### 2. Integration Tests (RECOMMENDED for new features)

**When Required:**
- New API endpoints that interact with database
- New services that integrate multiple modules
- Cross-service communication
- Database operations with transactions

**Requirements:**
- Test component interactions
- Test API → Database flows
- Test service-to-service communication
- Use test databases (never production)

**Location:**
- Service-specific test directories
- Example: `apps/api/src/billing/__tests__/integration/`

---

### 3. End-to-End (E2E) Tests (RECOMMENDED for critical workflows)

**When Required:**
- **Critical user workflows** that span multiple components/services
- **High-value business processes** (e.g., invoice generation, payment processing)
- **Multi-step user journeys** (e.g., customer onboarding, work order completion)
- **Cross-layer functionality** (frontend → backend → database)

**When NOT Required:**
- Simple CRUD operations (unit tests sufficient)
- Internal utilities or helpers
- Low-risk features
- Prototype/MVP features (add later)

**Requirements:**
- Use Playwright for E2E tests
- Test complete user journeys from start to finish
- Test error recovery in workflows
- Test with realistic data
- Keep tests fast (< 30 seconds per test)
- Use test databases and mock external services

**Location:**
- `frontend/e2e/` directory (create if needed)
- Example: `frontend/e2e/invoice-generation.spec.ts`

**Example Critical Workflows for E2E:**
- ✅ Invoice generation from work order → invoice creation → payment
- ✅ Customer onboarding → account creation → first work order
- ✅ Payment processing → Stripe integration → invoice update
- ✅ Work order completion → invoice generation → notification
- ❌ Simple form submission (unit test sufficient)
- ❌ Individual component rendering (unit test sufficient)

---

## Testing Standards

### Test Quality Requirements

1. **Deterministic:** Tests must be repeatable and not flaky
2. **Fast:** Unit tests < 1s, integration < 5s, E2E < 30s
3. **Isolated:** Tests don't depend on each other
4. **Clear:** Test names describe what they test
5. **Maintainable:** Tests are easy to update when code changes

### Test Organization

```
frontend/
├── src/
│   └── components/
│       └── billing/
│           └── __tests__/          # Unit tests (co-located)
│               └── InvoiceGenerator.test.tsx
└── e2e/                             # E2E tests (separate directory)
    └── workflows/
        └── invoice-generation.spec.ts
```

### Test Naming Conventions

- Unit tests: `ComponentName.test.tsx` or `functionName.test.ts`
- Integration tests: `feature.integration.test.ts`
- E2E tests: `workflow-name.spec.ts`

---

## Mandatory Test Requirements

### For Bug Fixes
- ✅ **MUST** create regression test that reproduces the bug
- ✅ **MUST** verify test passes after fix
- ✅ **MUST** document error pattern in `docs/error-patterns.md`

### For New Features
- ✅ **MUST** include unit tests for new functionality
- ✅ **MUST** test error paths
- ✅ **SHOULD** include integration tests for API/database interactions
- ⚠️ **RECOMMENDED** include E2E tests for critical workflows

### For Refactoring
- ✅ **MUST** ensure all existing tests pass
- ✅ **MUST** add behavior-diff tests before refactoring
- ✅ **MUST** maintain test coverage

---

## E2E Test Guidelines

### When to Write E2E Tests

**Write E2E tests for:**
1. **Critical business workflows** that generate revenue or affect customer experience
2. **Multi-step processes** that span 3+ components/services
3. **Payment/Financial flows** (invoice → payment → confirmation)
4. **Customer-facing onboarding** (signup → setup → first action)
5. **Complex state machines** (work order → completion → invoice)

**Don't write E2E tests for:**
1. Simple CRUD operations
2. Individual component rendering
3. Internal utilities
4. Low-risk features
5. Prototypes/MVPs (add later when stable)

### E2E Test Structure

```typescript
// frontend/e2e/workflows/invoice-generation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Invoice Generation Workflow', () => {
  test('should generate invoice from completed work order', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // 2. Navigate to work orders
    await page.goto('/work-orders');
    await expect(page.locator('text=Work Orders')).toBeVisible();

    // 3. Select completed work order
    await page.click('[data-testid="work-order-completed-1"]');

    // 4. Generate invoice
    await page.click('button:has-text("Generate Invoice")');
    await expect(page.locator('text=Invoice Form')).toBeVisible();

    // 5. Verify invoice created
    await page.fill('[name="issue_date"]', '2025-12-04');
    await page.click('button:has-text("Create Invoice")');
    await expect(page.locator('text=Invoice created successfully')).toBeVisible();
  });
});
```

### E2E Test Best Practices

1. **Use data-testid:** Prefer `data-testid` over CSS selectors
2. **Wait for elements:** Always wait for elements before interacting
3. **Clean up:** Reset test data after each test
4. **Isolate tests:** Each test should be independent
5. **Mock external services:** Mock Stripe, email, etc. in E2E tests
6. **Use fixtures:** Share common setup (login, test data) via fixtures

---

## Test Execution

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### CI/CD Integration

- Unit and integration tests run on every PR
- E2E tests run on main branch and before releases
- Test failures block merges

---

## Compliance Checklist

When adding new features, verify:

- [ ] Unit tests created for new functionality
- [ ] Error paths tested
- [ ] Integration tests added (if API/database involved)
- [ ] E2E tests considered for critical workflows
- [ ] All tests passing
- [ ] Test coverage maintained (>80% for new code)
- [ ] Regression tests added (if bug fix)

---

## Related Rules

- `.cursor/rules/enforcement.md` - Mandatory workflow and verification
- `.cursor/rules/error-resilience.md` - Error handling requirements
- `.cursor/rules/predictive-prevention.md` - Regression test requirements
- `.cursor/rules/core.md` - Core testing standards

---

**Last Updated:** 2025-12-04




