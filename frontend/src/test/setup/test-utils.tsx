import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock QueryClient and QueryClientProvider
const MockQueryClient = class {
  constructor() {}
};

const MockQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="query-client-provider">{children}</div>;
};

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockQueryClientProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </MockQueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
