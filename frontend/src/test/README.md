# Testing Guide

This directory contains testing utilities, setup files, and documentation for the VeroField frontend.

## Structure

```
src/test/
├── setup.ts              # Vitest setup and global mocks
├── utils/
│   ├── testHelpers.tsx    # Test utilities and factories
│   └── stateManagementEvaluation.md  # State management decision doc
├── __tests__/             # Component tests
├── e2e/                   # End-to-end tests
└── README.md              # This file
```

## Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run specific test file
npm test -- CardContainer.test.tsx
```

### Writing Tests

#### Component Test Example

```typescript
import { renderWithProviders, createMockCard } from '@/test/utils/testHelpers';
import { CardContainer } from '@/routes/dashboard/components/CardContainer';

describe('CardContainer', () => {
  it('renders card content', () => {
    const card = createMockCard({ type: 'customers' });
    const { getByText } = renderWithProviders(
      <CardContainer
        card={card}
        isSelected={false}
        isDragging={false}
        // ... other props
      />
    );
    
    expect(getByText('Customers')).toBeInTheDocument();
  });
});
```

#### Hook Test Example

```typescript
import { renderHook } from '@testing-library/react';
import { useDashboardState } from '@/routes/dashboard/hooks/useDashboardState';

describe('useDashboardState', () => {
  it('initializes with empty selected cards', () => {
    const { result } = renderHook(() => useDashboardState());
    
    expect(result.current.selectedCards.size).toBe(0);
  });
});
```

## Test Utilities

### `renderWithProviders`

Wraps components with all necessary providers (QueryClient, Router, etc.)

```typescript
import { renderWithProviders } from '@/test/utils/testHelpers';

const { getByText } = renderWithProviders(<MyComponent />);
```

### Factories

#### `createMockCard`

Creates a mock card object for testing.

```typescript
const card = createMockCard({
  type: 'customers',
  x: 100,
  y: 100,
  width: 400,
  height: 300,
});
```

#### `createMockLayout`

Creates a mock dashboard layout.

```typescript
const layout = createMockLayout([
  createMockCard({ id: 'card-1' }),
  createMockCard({ id: 'card-2' }),
]);
```

#### `createMockDashboardState`

Creates a mock dashboard state object.

```typescript
const dashboardState = createMockDashboardState({
  selectedCards: new Set(['card-1']),
  searchTerm: 'test',
});
```

#### `createMockServerPersistence`

Creates a mock server persistence object.

```typescript
const serverPersistence = createMockServerPersistence();
```

#### `createMockDragPayload`

Creates a mock drag payload for testing drag-and-drop.

```typescript
const payload = createMockDragPayload({
  sourceCardId: 'card-1',
  data: { id: 'customer-123' },
  action: 'create-appointment',
});
```

## Coverage Targets

### Phase 0 (Current)
- **Target:** 50% coverage for new code
- **Focus:** Critical paths and new components

### Phase 1-2
- **Target:** 70% coverage for all interactions
- **Focus:** All card interactions and workflows

### Phase 3-4
- **Target:** 80% coverage for MVP
- **Focus:** Complete feature coverage

### Phase 5+
- **Target:** 90%+ coverage for production
- **Focus:** Edge cases and error handling

## Test Types

### Unit Tests
- Test individual components and hooks
- Mock dependencies
- Fast execution
- Location: `src/**/__tests__/**/*.test.tsx`

### Integration Tests
- Test component interactions
- Test hooks with real dependencies
- Test card interaction workflows
- Location: `src/test/integration/**/*.test.tsx`

### E2E Tests
- Test complete user workflows
- Use Playwright
- Test in real browser
- Location: `src/test/e2e/**/*.e2e.test.ts`

## Best Practices

1. **Test behavior, not implementation:**
   - Test what the user sees and does
   - Avoid testing internal state

2. **Use factories:**
   - Use test factories for mock data
   - Keep tests DRY

3. **Mock external dependencies:**
   - Mock API calls
   - Mock localStorage
   - Mock browser APIs

4. **Test accessibility:**
   - Test keyboard navigation
   - Test screen reader compatibility
   - Test ARIA attributes

5. **Keep tests fast:**
   - Use `vi.fn()` for mocks
   - Avoid real API calls
   - Use `waitForAsync()` for async operations

## Common Patterns

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('loads data asynchronously', async () => {
  const { getByText } = renderWithProviders(<AsyncComponent />);
  
  await waitFor(() => {
    expect(getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('handles user click', async () => {
  const user = userEvent.setup();
  renderWithProviders(<Button onClick={handleClick} />);
  
  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

it('updates state correctly', () => {
  const { result } = renderHook(() => useMyHook());
  
  act(() => {
    result.current.updateState('new value');
  });
  
  expect(result.current.state).toBe('new value');
});
```

## Troubleshooting

### Tests timing out
- Increase `testTimeout` in `vitest.config.ts`
- Check for infinite loops
- Ensure async operations complete

### Mocks not working
- Check `setup.ts` for global mocks
- Ensure mocks are reset between tests
- Check import paths

### Coverage not generating
- Run `npm run test:coverage`
- Check `vitest.config.ts` coverage settings
- Ensure files aren't excluded

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)

---

**Last Updated:** November 9, 2025






