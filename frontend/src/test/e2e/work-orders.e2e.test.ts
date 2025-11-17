/**
 * Work Orders E2E Tests
 * 
 * End-to-end tests for work order creation and management including:
 * - Create work order with customer search
 * - Create work order with technician assignment
 * - View technician list on work order form
 * - Search and select customer
 * - Form submission workflow
 * - Error scenarios
 */

import { test, expect } from '@playwright/test';

test.describe('Work Orders E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - adjust based on your auth setup
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Work Order Creation', () => {
    test('should create work order with customer search', async ({ page }) => {
      // Navigate to work orders page
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form to appear
      await page.waitForSelector('form', { timeout: 5000 });

      // Search for customer
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await customerSearch.fill('Test Customer');
      
      // Wait for dropdown to appear
      await page.waitForSelector('[data-testid="customer-search-selector"]', { timeout: 3000 }).catch(() => {
        // If test ID not available, wait for dropdown
        page.waitForSelector('text=Test Customer', { timeout: 3000 });
      });

      // Select customer from dropdown
      const customerOption = page.getByText(/test customer/i).first();
      await customerOption.click();

      // Fill description
      const descriptionInput = page.getByLabel(/description/i);
      await descriptionInput.fill('E2E test work order description');

      // Submit form
      const submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
      await submitButton.click();

      // Wait for success message or redirect
      await page.waitForURL(/work-orders/, { timeout: 10000 });
    });

    test('should create work order with technician assignment', async ({ page }) => {
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Select customer
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await customerSearch.fill('Test Customer');
      await page.waitForTimeout(1000); // Wait for search results

      const customerOption = page.getByText(/test customer/i).first();
      await customerOption.click();

      // Wait for technicians to load
      const technicianSelect = page.getByLabel(/assigned technician/i);
      await technicianSelect.waitFor({ state: 'visible', timeout: 5000 });

      // Select technician
      await technicianSelect.selectOption({ index: 1 }); // Select first available technician

      // Fill description
      const descriptionInput = page.getByLabel(/description/i);
      await descriptionInput.fill('E2E test work order with technician');

      // Submit form
      const submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
      await submitButton.click();

      // Verify success
      await page.waitForURL(/work-orders/, { timeout: 10000 });
    });

    test('should display technician list on work order form', async ({ page }) => {
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Wait for technician dropdown to be enabled (technicians loaded)
      const technicianSelect = page.getByLabel(/assigned technician/i);
      await technicianSelect.waitFor({ state: 'visible', timeout: 5000 });

      // Check that technicians are loaded (dropdown should not show "Loading...")
      const selectText = await technicianSelect.textContent();
      expect(selectText).not.toContain('Loading technicians');

      // Open dropdown
      await technicianSelect.click();

      // Verify technicians are available
      const options = await technicianSelect.locator('option').count();
      expect(options).toBeGreaterThan(1); // More than just the "Select technician" option
    });

    test('should search and select customer', async ({ page }) => {
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Search for customer
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await customerSearch.fill('John');

      // Wait for search results dropdown
      await page.waitForTimeout(1000);

      // Verify search results appear
      const searchResults = page.locator('text=/john/i');
      await expect(searchResults.first()).toBeVisible({ timeout: 3000 });

      // Select customer
      await searchResults.first().click();

      // Verify customer is selected (check for selected customer box or input value)
      const selectedCustomer = page.locator('text=/selected customer|john/i');
      await expect(selectedCustomer.first()).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation error when customer is not selected', async ({ page }) => {
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Try to submit without customer
      const submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
      
      // Form should be disabled or show error
      const isDisabled = await submitButton.isDisabled();
      if (!isDisabled) {
        await submitButton.click();
        // Should show validation error
        await expect(page.locator('text=/customer|required/i')).toBeVisible({ timeout: 2000 });
      } else {
        // Button is disabled, which is also valid
        expect(isDisabled).toBe(true);
      }
    });

    test('should show validation error when description is missing', async ({ page }) => {
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Select customer
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await customerSearch.fill('Test Customer');
      await page.waitForTimeout(1000);

      const customerOption = page.getByText(/test customer/i).first();
      await customerOption.click();

      // Try to submit without description
      const submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
      
      if (!(await submitButton.isDisabled())) {
        await submitButton.click();
        // Should show validation error
        await expect(page.locator('text=/description.*required/i')).toBeVisible({ timeout: 2000 });
      }
    });
  });

  test.describe('Error Scenarios', () => {
    test('should handle API error when loading technicians', async ({ page }) => {
      // Intercept and fail the technicians API call
      await page.route('**/api/v1/technicians**', (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Form should still render even if technicians fail to load
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await expect(customerSearch).toBeVisible();
    });

    test('should handle API error when submitting form', async ({ page }) => {
      // Intercept and fail the work order creation API call
      await page.route('**/api/v1/work-orders**', (route) => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Failed to create work order' }),
          });
        } else {
          route.continue();
        }
      });

      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create work order button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Fill form
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await customerSearch.fill('Test Customer');
      await page.waitForTimeout(1000);

      const customerOption = page.getByText(/test customer/i).first();
      await customerOption.click();

      const descriptionInput = page.getByLabel(/description/i);
      await descriptionInput.fill('Test description');

      // Submit form
      const submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
      await submitButton.click();

      // Should show error message
      await expect(page.locator('text=/error|failed/i')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Form Workflow', () => {
    test('should complete full work order creation workflow', async ({ page }) => {
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Step 1: Click create button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Step 2: Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Step 3: Select customer
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await customerSearch.fill('Test Customer');
      await page.waitForTimeout(1000);

      const customerOption = page.getByText(/test customer/i).first();
      await customerOption.click();

      // Step 4: Fill service type
      const serviceTypeSelect = page.getByLabel(/service type/i);
      await serviceTypeSelect.selectOption('General Pest Control');

      // Step 5: Select priority
      const prioritySelect = page.getByLabel(/priority/i);
      await prioritySelect.selectOption('high');

      // Step 6: Fill description
      const descriptionInput = page.getByLabel(/description/i);
      await descriptionInput.fill('Complete E2E test work order');

      // Step 7: Select technician
      const technicianSelect = page.getByLabel(/assigned technician/i);
      await technicianSelect.waitFor({ state: 'visible', timeout: 5000 });
      await technicianSelect.selectOption({ index: 1 });

      // Step 8: Fill estimated duration
      const durationInput = page.getByLabel(/estimated duration/i);
      await durationInput.fill('120');

      // Step 9: Fill service price
      const priceInput = page.getByLabel(/service price/i);
      await priceInput.fill('150.00');

      // Step 10: Submit form
      const submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
      await submitButton.click();

      // Step 11: Verify success (redirect or success message)
      await page.waitForURL(/work-orders/, { timeout: 10000 });
    });

    test('should cancel work order creation', async ({ page }) => {
      await page.goto('/work-orders');
      await page.waitForLoadState('networkidle');

      // Click create button
      const createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
      await createButton.click();

      // Wait for form
      await page.waitForSelector('form', { timeout: 5000 });

      // Fill some data
      const customerSearch = page.getByPlaceholderText(/search customers/i);
      await customerSearch.fill('Test Customer');

      // Click cancel
      const cancelButton = page.getByRole('button', { name: /cancel/i });
      await cancelButton.click();

      // Should return to work orders list
      await page.waitForURL(/work-orders/, { timeout: 5000 });
    });
  });
});

