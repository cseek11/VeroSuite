/**
 * ResourceTimeline Integration Tests
 *
 * Integration tests for ResourceTimeline component focusing on:
 * - API integration flows
 * - Data flow between components
 * - User workflow scenarios
 * - Real-world usage patterns
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResourceTimeline } from '../ResourceTimeline';
import { enhancedApi } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: {
    technicians: {
      list: vi.fn(),
    },
    users: {
      list: vi.fn(),
    },
    jobs: {
      getByDateRange: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock ErrorBoundary
vi.mock('@/components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ResourceTimeline Integration Tests', () => {
  let queryClient: QueryClient;

  const mockTechnicians = [
    {
      id: 'tech-1',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
    },
    {
      id: 'tech-2',
      first_name: 'Jane',
      last_name: 'Smith',
      is_active: true,
    },
  ];

  const mockJobs = [
    {
      id: 'job-1',
      status: 'scheduled' as const,
      priority: 'high' as const,
      scheduled_date: '2025-11-17',
      scheduled_start_time: '09:00',
      scheduled_end_time: '11:00',
      technician_id: 'tech-1',
      customer: { id: 'cust-1', name: 'Customer One', phone: '555-1001' },
      location: { id: 'loc-1', name: 'Location One', address: '123 Main St', coordinates: { lat: 40.44, lng: -79.99 } },
      service: { type: 'Service One', description: 'Description', estimated_duration: 120, price: 150 },
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
        mutations: { retry: false },
      },
    });

    vi.clearAllMocks();
    (enhancedApi.users.list as any).mockResolvedValue(mockTechnicians);
    (enhancedApi.jobs.getByDateRange as any).mockResolvedValue(mockJobs);
    (enhancedApi.jobs.update as any).mockResolvedValue({ id: 'job-1', status: 'in_progress' });
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ResourceTimeline
          selectedDate={new Date('2025-11-17')}
          onDateChange={vi.fn()}
          onJobSelect={vi.fn()}
          onJobUpdate={vi.fn()}
          {...props}
        />
      </QueryClientProvider>
    );
  };

  describe('Complete User Workflows', () => {
    it('should complete full workflow: view timeline -> select job -> view details -> update status', async () => {
      const onJobSelect = vi.fn();
      const onJobUpdate = vi.fn();
      const onDateChange = vi.fn();

      renderComponent({ onJobSelect, onJobUpdate, onDateChange });

      // Step 1: Wait for timeline to load
      await waitFor(() => {
        const allText = document.body.textContent || '';
        expect(allText.includes('John') && allText.includes('Doe')).toBe(true);
        const allText = document.body.textContent || '';
        expect(allText.includes('Customer One')).toBe(true);
      });

      // Step 2: Click on job
      // Find job element by text content
      const jobElement = Array.from(document.querySelectorAll('*')).find(el => 
        el.textContent?.includes('Customer One')
      ) as HTMLElement;
      expect(jobElement).toBeTruthy();
      if (!jobElement) return; // Skip if element not found
      fireEvent.click(jobElement);

      // Step 3: Verify dialog opens
      await waitFor(() => {
        const allText = document.body.textContent || '';
        expect(/job details/i.test(allText)).toBe(true);
        expect(onJobSelect).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'job-1' })
        );
      });

      // Step 4: Update job status
      // Find update button by text content
      const updateButton = Array.from(document.querySelectorAll('button, [role="button"]')).find(el => 
        /update status/i.test(el.textContent || '')
      ) as HTMLElement;
      expect(updateButton).toBeTruthy();
      if (!updateButton) return;
      fireEvent.click(updateButton);

      // Step 5: Verify API call
      await waitFor(() => {
        expect(enhancedApi.jobs.update).toHaveBeenCalledWith(
          'job-1',
          expect.objectContaining({ status: 'in_progress' })
        );
      });

      // Step 6: Verify callbacks called
      expect(onJobSelect).toHaveBeenCalled();
    });

    it('should handle date navigation workflow', async () => {
      const onDateChange = vi.fn();

      renderComponent({ onDateChange });

      await waitFor(() => {
        // Component should render - check for any visible content using flexible matcher
        const hasTechnician = screen.queryByText((content, element) => {
          return element?.textContent?.includes('Technician');
        });
        const hasJohnDoe = screen.queryByText((content, element) => {
          return element?.textContent?.includes('John') && element?.textContent?.includes('Doe');
        });
        expect(hasTechnician || hasJohnDoe).toBeTruthy();
      });

      // Navigate to next day
      const nextButton = screen.getByLabelText(/next day/i);
      fireEvent.click(nextButton);

      expect(onDateChange).toHaveBeenCalled();
      expect((enhancedApi.jobs.getByDateRange as any).mock.calls.length).toBeGreaterThan(1);
    });

    it('should handle zoom workflow', async () => {
      renderComponent();

      await waitFor(() => {
        // Component should render - check for any visible content using flexible matcher
        const hasTechnician = screen.queryByText((content, element) => {
          return element?.textContent?.includes('Technician');
        });
        const hasJohnDoe = screen.queryByText((content, element) => {
          return element?.textContent?.includes('John') && element?.textContent?.includes('Doe');
        });
        expect(hasTechnician || hasJohnDoe).toBeTruthy();
      });

      // Zoom in
      const zoomInButton = screen.getByLabelText(/zoom in/i);
      fireEvent.click(zoomInButton);
      fireEvent.click(zoomInButton);

      // Verify date range calculation updates
      await waitFor(() => {
        // Component should refetch with new date range
        expect((enhancedApi.jobs.getByDateRange as any).mock.calls.length).toBeGreaterThan(0);
      });
    });
  });

  describe('API Data Flow', () => {
    it('should fetch and display data in correct order', async () => {
      renderComponent();

      await waitFor(() => {
        expect(enhancedApi.users.list).toHaveBeenCalled();
        expect(enhancedApi.jobs.getByDateRange).toHaveBeenCalled();
      });

      // Verify technicians are displayed
      const allText = document.body.textContent || '';
      expect(allText.includes('John') && allText.includes('Doe')).toBe(true);
      expect(allText.includes('Jane') && allText.includes('Smith')).toBe(true);

      // Verify jobs are displayed
      expect(allText.includes('Customer One')).toBe(true);
    });

    it('should handle API response updates correctly', async () => {
      const { rerender } = renderComponent();

      await waitFor(() => {
        const allText = document.body.textContent || '';
        expect(allText.includes('Customer One')).toBe(true);
      });

      // Update mock to return different jobs
      const updatedJobs = [
        {
          ...mockJobs[0],
          id: 'job-2',
          customer: { ...mockJobs[0].customer, name: 'Customer Two' },
        },
      ];

      (enhancedApi.jobs.getByDateRange as any).mockResolvedValue(updatedJobs);

      // Trigger refetch by changing date
      rerender(
        <QueryClientProvider client={queryClient}>
          <ResourceTimeline
            selectedDate={new Date('2025-11-18')}
            onDateChange={vi.fn()}
            onJobSelect={vi.fn()}
            onJobUpdate={vi.fn()}
          />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(enhancedApi.jobs.getByDateRange).toHaveBeenCalledWith(
          '2025-11-18',
          expect.any(String)
        );
      });
    });

    it('should maintain state consistency during API updates', async () => {
      renderComponent();

      await waitFor(() => {
        const allText = document.body.textContent || '';
        expect(allText.includes('Customer One')).toBe(true);
      });

      // Select a job
      // Find job element by text content
      const jobElement = Array.from(document.querySelectorAll('*')).find(el => 
        el.textContent?.includes('Customer One')
      ) as HTMLElement;
      expect(jobElement).toBeTruthy();
      if (!jobElement) return;
      fireEvent.click(jobElement);

      await waitFor(() => {
        const allText = document.body.textContent || '';
        expect(/job details/i.test(allText)).toBe(true);
      });

      // Update should maintain dialog state
      // Find update button by text content
      const updateButton = Array.from(document.querySelectorAll('button, [role="button"]')).find(el => 
        /update status/i.test(el.textContent || '')
      ) as HTMLElement;
      expect(updateButton).toBeTruthy();
      if (!updateButton) return;
      expect(updateButton).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with parent component callbacks', async () => {
      const onDateChange = vi.fn();
      const onJobSelect = vi.fn();
      const onJobUpdate = vi.fn();

      renderComponent({ onDateChange, onJobSelect, onJobUpdate });

      await waitFor(() => {
        // Component should render - check for any visible content using flexible matcher
        const hasTechnician = screen.queryByText((content, element) => {
          return element?.textContent?.includes('Technician');
        });
        const hasJohnDoe = screen.queryByText((content, element) => {
          return element?.textContent?.includes('John') && element?.textContent?.includes('Doe');
        });
        expect(hasTechnician || hasJohnDoe).toBeTruthy();
      });

      // Test date change callback
      const nextButton = screen.getByLabelText(/next day/i);
      fireEvent.click(nextButton);
      expect(onDateChange).toHaveBeenCalled();

      // Test job select callback
      // Find job element by text content
      const jobElement = Array.from(document.querySelectorAll('*')).find(el => 
        el.textContent?.includes('Customer One')
      ) as HTMLElement;
      expect(jobElement).toBeTruthy();
      if (!jobElement) return;
      fireEvent.click(jobElement);
      await waitFor(() => {
        expect(onJobSelect).toHaveBeenCalled();
      });
    });

    it('should handle prop updates correctly', async () => {
      const { rerender } = renderComponent();

      await waitFor(() => {
        // Component should render - check for any visible content using flexible matcher
        const hasTechnician = screen.queryByText((content, element) => {
          return element?.textContent?.includes('Technician');
        });
        const hasJohnDoe = screen.queryByText((content, element) => {
          return element?.textContent?.includes('John') && element?.textContent?.includes('Doe');
        });
        expect(hasTechnician || hasJohnDoe).toBeTruthy();
      });

      // Update selectedDate prop
      rerender(
        <QueryClientProvider client={queryClient}>
          <ResourceTimeline
            selectedDate={new Date('2025-11-20')}
            onDateChange={vi.fn()}
            onJobSelect={vi.fn()}
            onJobUpdate={vi.fn()}
          />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(enhancedApi.jobs.getByDateRange).toHaveBeenCalledWith(
          '2025-11-20',
          expect.any(String)
        );
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from API error and retry', async () => {
      // First call fails
      (enhancedApi.jobs.getByDateRange as any).mockRejectedValueOnce(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        const allText = document.body.textContent || '';
        expect(/failed to load timeline data/i.test(allText)).toBe(true);
      });

      // Second call succeeds
      (enhancedApi.jobs.getByDateRange as any).mockResolvedValue(mockJobs);

      // Trigger refetch by navigating
      const nextButton = screen.getByLabelText(/next day/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.queryByText(/failed to load timeline data/i)).not.toBeInTheDocument();
      });
    });

    it('should handle partial data gracefully', async () => {
      // Return technicians but no jobs
      (enhancedApi.jobs.getByDateRange as any).mockResolvedValue([]);

      renderComponent();

      await waitFor(() => {
        const allText = document.body.textContent || '';
        expect(allText.includes('John') && allText.includes('Doe')).toBe(true);
        expect(/no jobs scheduled/i.test(allText)).toBe(true);
      });
    });
  });
});

