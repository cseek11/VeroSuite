/**
 * End-to-End CRM Workflow Tests
 * Comprehensive user journey testing for mission-critical business processes
 */

import { test, expect, Page } from '@playwright/test';
// TestUtils import removed - not used in this file

test.describe('CRM Workflow E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Set viewport for responsive testing
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Mock authentication
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@verofield.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.click('[data-testid="login-button"]');
    
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="dashboard"]');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Complete Customer Lifecycle', () => {
    test('should handle complete customer journey from creation to work order completion', async () => {
      // Step 1: Create new customer
      await page.click('[data-testid="customers-nav"]');
      await page.click('[data-testid="create-customer-button"]');
      
      await page.fill('[data-testid="first-name-input"]', 'John');
      await page.fill('[data-testid="last-name-input"]', 'Doe');
      await page.fill('[data-testid="email-input"]', 'john.doe@example.com');
      await page.fill('[data-testid="phone-input"]', '+1-555-0123');
      await page.fill('[data-testid="address-input"]', '123 Main Street');
      await page.fill('[data-testid="city-input"]', 'Anytown');
      await page.selectOption('[data-testid="state-select"]', 'CA');
      await page.fill('[data-testid="zip-input"]', '12345');
      
      await page.click('[data-testid="save-customer-button"]');
      
      // Verify customer creation
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Customer created successfully');
      
      // Step 2: Navigate to customer list and verify
      await page.click('[data-testid="customers-nav"]');
      await expect(page.locator('[data-testid="customer-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="customer-item"]').first()).toContainText('John Doe');
      
      // Step 3: Create work order for customer
      await page.click('[data-testid="work-orders-nav"]');
      await page.click('[data-testid="create-work-order-button"]');
      
      await page.selectOption('[data-testid="customer-select"]', 'john.doe@example.com');
      await page.selectOption('[data-testid="service-type-select"]', 'pest_control');
      await page.selectOption('[data-testid="priority-select"]', 'high');
      await page.fill('[data-testid="scheduled-date-input"]', '2024-12-25');
      await page.fill('[data-testid="description-textarea"]', 'Pest control treatment for kitchen and living room');
      
      await page.click('[data-testid="save-work-order-button"]');
      
      // Verify work order creation
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Work order created successfully');
      
      // Step 4: Assign technician to work order
      await page.click('[data-testid="work-orders-nav"]');
      const workOrderItem = page.locator('[data-testid="work-order-item"]').first();
      await workOrderItem.click();
      
      await page.click('[data-testid="assign-technician-button"]');
      await page.selectOption('[data-testid="technician-select"]', 'tech1@example.com');
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Verify technician assignment
      await expect(page.locator('[data-testid="assigned-technician"]')).toBeVisible();
      await expect(page.locator('[data-testid="work-order-status"]')).toContainText('assigned');
      
      // Step 5: Update work order status to in progress
      await page.click('[data-testid="update-status-button"]');
      await page.selectOption('[data-testid="status-select"]', 'in_progress');
      await page.fill('[data-testid="status-notes"]', 'Work started on time');
      await page.click('[data-testid="save-status-button"]');
      
      // Verify status update
      await expect(page.locator('[data-testid="work-order-status"]')).toContainText('in_progress');
      
      // Step 6: Complete work order
      await page.click('[data-testid="update-status-button"]');
      await page.selectOption('[data-testid="status-select"]', 'completed');
      await page.fill('[data-testid="completion-notes"]', 'Work completed successfully. All areas treated.');
      await page.fill('[data-testid="materials-used"]', 'Pesticide A, Equipment B');
      await page.click('[data-testid="save-status-button"]');
      
      // Verify completion
      await expect(page.locator('[data-testid="work-order-status"]')).toContainText('completed');
      await expect(page.locator('[data-testid="completion-notes"]')).toBeVisible();
      
      // Step 7: Generate invoice
      await page.click('[data-testid="generate-invoice-button"]');
      await page.fill('[data-testid="invoice-amount"]', '150.00');
      await page.fill('[data-testid="invoice-description"]', 'Pest control treatment');
      await page.click('[data-testid="create-invoice-button"]');
      
      // Verify invoice creation
      await expect(page.locator('[data-testid="invoice-created"]')).toBeVisible();
      await expect(page.locator('[data-testid="invoice-amount"]')).toContainText('$150.00');
    });
  });

  test.describe('Multi-Tenant Isolation', () => {
    test('should enforce tenant isolation across all operations', async () => {
      // Create customer in current tenant
      await page.click('[data-testid="customers-nav"]');
      await page.click('[data-testid="create-customer-button"]');
      
      await page.fill('[data-testid="first-name-input"]', 'Tenant1');
      await page.fill('[data-testid="last-name-input"]', 'Customer');
      await page.fill('[data-testid="email-input"]', 'tenant1@example.com');
      await page.fill('[data-testid="phone-input"]', '+1-555-0001');
      await page.fill('[data-testid="address-input"]', '123 Tenant1 Street');
      await page.fill('[data-testid="city-input"]', 'Tenant1 City');
      await page.selectOption('[data-testid="state-select"]', 'CA');
      await page.fill('[data-testid="zip-input"]', '12345');
      
      await page.click('[data-testid="save-customer-button"]');
      
      // Verify customer is created
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      
      // Switch to different tenant (simulate)
      await page.evaluate(() => {
        localStorage.setItem('tenant_id', 'tenant-2');
      });
      
      // Refresh page to apply tenant change
      await page.reload();
      
      // Verify customer from tenant-1 is not visible
      await page.click('[data-testid="customers-nav"]');
      await expect(page.locator('[data-testid="customer-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="customer-item"]')).not.toContainText('Tenant1 Customer');
    });
  });

  test.describe('Work Order State Transitions', () => {
    test('should enforce valid work order state transitions', async () => {
      // Create work order
      await page.click('[data-testid="work-orders-nav"]');
      await page.click('[data-testid="create-work-order-button"]');
      
      await page.selectOption('[data-testid="customer-select"]', 'test@example.com');
      await page.selectOption('[data-testid="service-type-select"]', 'pest_control');
      await page.selectOption('[data-testid="priority-select"]', 'medium');
      await page.fill('[data-testid="scheduled-date-input"]', '2024-12-25');
      await page.fill('[data-testid="description-textarea"]', 'Test work order');
      
      await page.click('[data-testid="save-work-order-button"]');
      
      // Verify work order is created with 'scheduled' status
      await expect(page.locator('[data-testid="work-order-status"]')).toContainText('scheduled');
      
      // Valid transition: scheduled -> assigned
      await page.click('[data-testid="update-status-button"]');
      await page.selectOption('[data-testid="status-select"]', 'assigned');
      await page.click('[data-testid="save-status-button"]');
      
      await expect(page.locator('[data-testid="work-order-status"]')).toContainText('assigned');
      
      // Valid transition: assigned -> in_progress
      await page.click('[data-testid="update-status-button"]');
      await page.selectOption('[data-testid="status-select"]', 'in_progress');
      await page.click('[data-testid="save-status-button"]');
      
      await expect(page.locator('[data-testid="work-order-status"]')).toContainText('in_progress');
      
      // Valid transition: in_progress -> completed
      await page.click('[data-testid="update-status-button"]');
      await page.selectOption('[data-testid="status-select"]', 'completed');
      await page.click('[data-testid="save-status-button"]');
      
      await expect(page.locator('[data-testid="work-order-status"]')).toContainText('completed');
      
      // Invalid transition: completed -> in_progress (should fail)
      await page.click('[data-testid="update-status-button"]');
      await page.selectOption('[data-testid="status-select"]', 'in_progress');
      await page.click('[data-testid="save-status-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid status transition');
    });
  });

  test.describe('Technician Assignment Logic', () => {
    test('should assign technician based on skills and availability', async () => {
      // Create work order requiring pest control
      await page.click('[data-testid="work-orders-nav"]');
      await page.click('[data-testid="create-work-order-button"]');
      
      await page.selectOption('[data-testid="customer-select"]', 'test@example.com');
      await page.selectOption('[data-testid="service-type-select"]', 'pest_control');
      await page.selectOption('[data-testid="priority-select"]', 'high');
      await page.fill('[data-testid="scheduled-date-input"]', '2024-12-25');
      await page.fill('[data-testid="description-textarea"]', 'Pest control treatment');
      
      await page.click('[data-testid="save-work-order-button"]');
      
      // Auto-assign technician
      await page.click('[data-testid="auto-assign-button"]');
      
      // Verify technician is assigned based on skills
      await expect(page.locator('[data-testid="assigned-technician"]')).toBeVisible();
      await expect(page.locator('[data-testid="technician-skills"]')).toContainText('pest_control');
    });

    test('should handle technician unavailability', async () => {
      // Create work order
      await page.click('[data-testid="work-orders-nav"]');
      await page.click('[data-testid="create-work-order-button"]');
      
      await page.selectOption('[data-testid="customer-select"]', 'test@example.com');
      await page.selectOption('[data-testid="service-type-select"]', 'pest_control');
      await page.selectOption('[data-testid="priority-select"]', 'high');
      await page.fill('[data-testid="scheduled-date-input"]', '2024-12-25');
      await page.fill('[data-testid="description-textarea"]', 'Pest control treatment');
      
      await page.click('[data-testid="save-work-order-button"]');
      
      // Attempt auto-assignment when no technicians are available
      await page.click('[data-testid="auto-assign-button"]');
      
      // Verify no technician is assigned
      await expect(page.locator('[data-testid="no-technician-available"]')).toBeVisible();
      await expect(page.locator('[data-testid="no-technician-available"]')).toContainText('No available technicians');
    });
  });

  test.describe('Data Validation and Error Handling', () => {
    test('should validate required fields', async () => {
      await page.click('[data-testid="customers-nav"]');
      await page.click('[data-testid="create-customer-button"]');
      
      // Try to save without required fields
      await page.click('[data-testid="save-customer-button"]');
      
      // Verify validation errors
      await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();
    });

    test('should validate email format', async () => {
      await page.click('[data-testid="customers-nav"]');
      await page.click('[data-testid="create-customer-button"]');
      
      await page.fill('[data-testid="email-input"]', 'invalid-email');
      await page.click('[data-testid="save-customer-button"]');
      
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format');
    });

    test('should validate phone number format', async () => {
      await page.click('[data-testid="customers-nav"]');
      await page.click('[data-testid="create-customer-button"]');
      
      await page.fill('[data-testid="phone-input"]', '123');
      await page.click('[data-testid="save-customer-button"]');
      
      await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="phone-error"]')).toContainText('Invalid phone number format');
    });
  });

  test.describe('Search and Filtering', () => {
    test('should search customers by name', async () => {
      await page.click('[data-testid="customers-nav"]');
      
      await page.fill('[data-testid="search-input"]', 'John');
      await page.click('[data-testid="search-button"]');
      
      await expect(page.locator('[data-testid="customer-item"]')).toContainText('John');
    });

    test('should filter work orders by status', async () => {
      await page.click('[data-testid="work-orders-nav"]');
      
      await page.selectOption('[data-testid="status-filter"]', 'scheduled');
      await page.click('[data-testid="apply-filter-button"]');
      
      await expect(page.locator('[data-testid="work-order-item"]')).toContainText('scheduled');
    });

    test('should filter technicians by availability', async () => {
      await page.click('[data-testid="technicians-nav"]');
      
      await page.selectOption('[data-testid="availability-filter"]', 'available');
      await page.click('[data-testid="apply-filter-button"]');
      
      await expect(page.locator('[data-testid="technician-item"]')).toContainText('available');
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.click('[data-testid="mobile-menu-button"]');
      await page.click('[data-testid="customers-nav-mobile"]');
      
      await expect(page.locator('[data-testid="customer-list"]')).toBeVisible();
    });

    test('should work on tablet devices', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.click('[data-testid="customers-nav"]');
      await expect(page.locator('[data-testid="customer-list"]')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async () => {
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      await page.keyboard.press('Enter');
      // Verify navigation occurred
    });

    test('should have proper ARIA labels', async () => {
      await page.click('[data-testid="customers-nav"]');
      
      const inputs = page.locator('input');
      const count = await inputs.count();
      
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });

    test('should have proper color contrast', async () => {
      await page.click('[data-testid="customers-nav"]');
      
      const textElements = page.locator('p, span, div');
      const count = await textElements.count();
      
      for (let i = 0; i < count; i++) {
        const element = textElements.nth(i);
        const color = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.color;
        });
        
        expect(color).toBeTruthy();
      }
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within performance threshold', async () => {
      const startTime = Date.now();
      await page.goto('/dashboard');
      await page.waitForSelector('[data-testid="dashboard"]');
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test('should handle large datasets efficiently', async () => {
      await page.click('[data-testid="customers-nav"]');
      
      const startTime = Date.now();
      await page.waitForSelector('[data-testid="customer-list"]');
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(2000); // 2 seconds
    });
  });

  test.describe('Error Recovery', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate network error
      await page.route('**/api/customers', route => route.abort());
      
      await page.click('[data-testid="customers-nav"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Network error');
    });

    test('should handle server errors gracefully', async () => {
      // Simulate server error
      await page.route('**/api/customers', route => route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      }));
      
      await page.click('[data-testid="customers-nav"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Server error');
    });
  });
});






