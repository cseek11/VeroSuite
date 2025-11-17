# Frontend Test Patterns

Complete guide to testing patterns for VeroField frontend components, hooks, API integrations, and E2E tests.

## Table of Contents

1. [Component Test Patterns](#component-test-patterns)
2. [Hook Test Patterns](#hook-test-patterns)
3. [API Integration Test Patterns](#api-integration-test-patterns)
4. [E2E Test Patterns](#e2e-test-patterns)
5. [Mock Patterns](#mock-patterns)
6. [Test Utility Usage](#test-utility-usage)

---

## Component Test Patterns

### Basic Component Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ComponentName } from '../ComponentName';
import { renderWithAllProviders } from '@/test/utils/componentTestUtils';

describe('ComponentName', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

### Form Component Test Pattern

```typescript
describe('FormComponent', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should submit form with valid data', async () => {
    renderWithAllProviders(
      <FormComponent onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // Fill form fields
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Test Name' })
      );
    });
  });

  it('should show validation errors', async () => {
    renderWithAllProviders(
      <FormComponent onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // Try to submit without required fields
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
```

### List Component Test Pattern

```typescript
describe('ListComponent', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  it('should render list of items', () => {
    renderWithAllProviders(<ListComponent items={mockItems} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should filter items by search term', async () => {
    renderWithAllProviders(<ListComponent items={mockItems} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Item 1' } });

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    });
  });

  it('should handle empty list', () => {
    renderWithAllProviders(<ListComponent items={[]} />);

    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });
});
```

### Search Component Test Pattern

```typescript
describe('SearchComponent', () => {
  const mockOnSearch = vi.fn();
  const mockResults = [
    { id: '1', name: 'Result 1' },
    { id: '2', name: 'Result 2' },
  ];

  it('should perform search on input change', async () => {
    renderWithAllProviders(
      <SearchComponent onSearch={mockOnSearch} results={mockResults} />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  it('should debounce search input', async () => {
    vi.useFakeTimers();
    
    renderWithAllProviders(
      <SearchComponent onSearch={mockOnSearch} results={mockResults} />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 't' } });
    fireEvent.change(searchInput, { target: { value: 'te' } });
    fireEvent.change(searchInput, { target: { value: 'test' } });

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1));
    });

    vi.useRealTimers();
  });
});
```

---

## Hook Test Patterns

### Basic Hook Test Pattern

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCustomHook } from '../useCustomHook';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCustomHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch data on mount', async () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

### Hook with API Call Pattern

```typescript
describe('useApiHook', () => {
  const mockApiCall = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockApiCall.mockResolvedValue({ data: 'test' });
  });

  it('should call API on mount', async () => {
    const { result } = renderHook(() => useApiHook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalled();
    });
  });

  it('should handle API errors', async () => {
    mockApiCall.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useApiHook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

---

## API Integration Test Patterns

### API Client Test Pattern

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/lib/api-client';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make successful API call', async () => {
    const mockData = { id: '1', name: 'Test' };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await apiClient.get('/endpoint');

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/endpoint'),
      expect.any(Object)
    );
  });

  it('should handle API errors', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Server error' }),
    });

    await expect(apiClient.get('/endpoint')).rejects.toThrow();
  });

  it('should include authentication headers', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await apiClient.get('/endpoint');

    const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = fetchCall[1]?.headers;

    expect(headers['Authorization']).toBeDefined();
  });
});
```

---

## E2E Test Patterns

### Basic E2E Test Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should complete user workflow', async ({ page }) => {
    // Navigate to feature
    await page.goto('/feature');
    await page.waitForLoadState('networkidle');

    // Interact with element
    const button = page.getByRole('button', { name: /action/i });
    await button.click();

    // Wait for result
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

### Form E2E Test Pattern

```typescript
test('should submit form successfully', async ({ page }) => {
  await page.goto('/form');

  // Fill form fields
  await page.getByLabel(/name/i).fill('Test Name');
  await page.getByLabel(/email/i).fill('test@example.com');

  // Submit form
  await page.getByRole('button', { name: /submit/i }).click();

  // Verify success
  await expect(page.getByText(/success/i)).toBeVisible({ timeout: 10000 });
});
```

### API Mocking in E2E Tests

```typescript
test('should handle API response', async ({ page }) => {
  // Mock API response
  await page.route('**/api/v1/endpoint**', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: 'test' }),
    });
  });

  await page.goto('/page');
  
  // Verify mocked data appears
  await expect(page.getByText('test')).toBeVisible();
});
```

---

## Mock Patterns

### Mock API Client

```typescript
import { vi } from 'vitest';
import { mockEnhancedApi, mockSecureApiClient } from '@/test/utils/apiMocks';

// In test file
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: mockEnhancedApi(),
}));

vi.mock('@/lib/secure-api-client', () => ({
  secureApiClient: mockSecureApiClient(),
}));
```

### Mock React Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};
```

### Mock React Router

```typescript
import { BrowserRouter } from 'react-router-dom';

// Already included in renderWithAllProviders
// Or use directly:
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);
```

---

## Test Utility Usage

### renderWithAllProviders

```typescript
import { renderWithAllProviders } from '@/test/utils/componentTestUtils';

// Basic usage
renderWithAllProviders(<Component />);

// With custom query client
const queryClient = createTestQueryClient();
renderWithAllProviders(<Component />, { queryClient });
```

### Mock Factories

```typescript
import {
  createMockAccount,
  createMockTechnician,
  createMockWorkOrder,
} from '@/test/utils/testHelpers';

const mockAccount = createMockAccount({ name: 'Custom Name' });
const mockTechnician = createMockTechnician({ id: 'tech-1' });
const mockWorkOrder = createMockWorkOrder({ status: 'pending' });
```

### API Mocks

```typescript
import {
  mockTechniciansApi,
  mockAccountsApi,
  mockWorkOrdersApi,
} from '@/test/utils/apiMocks';

const techniciansApi = mockTechniciansApi();
techniciansApi.list.mockResolvedValue([...mockTechnicians]);
```

---

## Common Test Scenarios

### Testing Loading States

```typescript
it('should show loading state', () => {
  renderWithAllProviders(<Component isLoading={true} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

### Testing Error States

```typescript
it('should show error message', () => {
  renderWithAllProviders(<Component error="Error message" />);
  expect(screen.getByText('Error message')).toBeInTheDocument();
});
```

### Testing Empty States

```typescript
it('should show empty state', () => {
  renderWithAllProviders(<Component items={[]} />);
  expect(screen.getByText(/no items/i)).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
it('should handle click', async () => {
  const mockOnClick = vi.fn();
  renderWithAllProviders(<Component onClick={mockOnClick} />);

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(mockOnClick).toHaveBeenCalled();
});
```

### Testing Form Validation

```typescript
it('should validate required fields', async () => {
  renderWithAllProviders(<FormComponent />);

  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
});
```

---

## Best Practices

1. **Use renderWithAllProviders** - Ensures all necessary providers are included
2. **Mock External Dependencies** - Use API mocks from `apiMocks.ts`
3. **Use Mock Factories** - Create consistent test data with factories
4. **Test User Interactions** - Focus on what users see and do
5. **Test Error Cases** - Don't just test happy paths
6. **Keep Tests Isolated** - Each test should be independent
7. **Use Descriptive Names** - Test names should clearly describe what they test
8. **Follow AAA Pattern** - Arrange, Act, Assert

---

**Last Updated:** 2025-11-15  
**Maintained By:** VeroField Development Team

