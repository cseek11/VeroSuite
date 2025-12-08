import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, Browser, Page } from 'playwright';

describe('Customer Management E2E Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForSelector('[data-testid="app-container"]');
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Customer List View', () => {
    it('should display customer list', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Check if customer list is displayed
      const customerList = await page.locator('[data-testid="customer-list"]');
      expect(await customerList.isVisible()).toBe(true);
    });

    it('should filter customers by search', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-search"]');

      // Enter search term
      const searchInput = page.locator('[data-testid="customer-search"]');
      await searchInput.fill('John');

      // Wait for filtered results
      await page.waitForTimeout(500);

      // Check if results are filtered
      const customerRows = page.locator('[data-testid="customer-row"]');
      const count = await customerRows.count();
      expect(count).toBeGreaterThan(0);
    });

    it('should sort customers by name', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Click on name column header to sort
      await page.click('[data-testid="sort-name"]');

      // Wait for sorting to complete
      await page.waitForTimeout(500);

      // Check if customers are sorted
      const customerNames = await page.locator('[data-testid="customer-name"]').allTextContents();
      const sortedNames = [...customerNames].sort();
      expect(customerNames).toEqual(sortedNames);
    });
  });

  describe('Customer Creation', () => {
    it('should create a new customer', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Click add customer button
      await page.click('[data-testid="add-customer-btn"]');
      await page.waitForSelector('[data-testid="customer-form"]');

      // Fill out the form
      await page.fill('[data-testid="first-name-input"]', 'Test');
      await page.fill('[data-testid="last-name-input"]', 'Customer');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="phone-input"]', '555-123-4567');
      await page.fill('[data-testid="address-input"]', '123 Test St');
      await page.fill('[data-testid="city-input"]', 'Test City');
      await page.fill('[data-testid="state-input"]', 'CA');
      await page.fill('[data-testid="zip-input"]', '12345');

      // Submit the form
      await page.click('[data-testid="save-customer-btn"]');

      // Wait for success message
      await page.waitForSelector('[data-testid="success-message"]');

      // Verify customer was created
      const successMessage = await page.locator('[data-testid="success-message"]').textContent();
      expect(successMessage).toContain('Customer created successfully');
    });

    it('should show validation errors for invalid data', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Click add customer button
      await page.click('[data-testid="add-customer-btn"]');
      await page.waitForSelector('[data-testid="customer-form"]');

      // Try to submit empty form
      await page.click('[data-testid="save-customer-btn"]');

      // Check for validation errors
      await page.waitForSelector('[data-testid="validation-error"]');
      const errors = await page.locator('[data-testid="validation-error"]').allTextContents();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Customer Editing', () => {
    it('should edit an existing customer', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Click on first customer edit button
      await page.click('[data-testid="edit-customer-btn"]:first-child');
      await page.waitForSelector('[data-testid="customer-form"]');

      // Update the first name
      await page.fill('[data-testid="first-name-input"]', 'Updated');

      // Submit the form
      await page.click('[data-testid="save-customer-btn"]');

      // Wait for success message
      await page.waitForSelector('[data-testid="success-message"]');

      // Verify customer was updated
      const successMessage = await page.locator('[data-testid="success-message"]').textContent();
      expect(successMessage).toContain('Customer updated successfully');
    });
  });

  describe('Customer Deletion', () => {
    it('should delete a customer with confirmation', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Get initial customer count
      const initialCount = await page.locator('[data-testid="customer-row"]').count();

      // Click on first customer delete button
      await page.click('[data-testid="delete-customer-btn"]:first-child');

      // Confirm deletion in modal
      await page.waitForSelector('[data-testid="confirm-delete-btn"]');
      await page.click('[data-testid="confirm-delete-btn"]');

      // Wait for success message
      await page.waitForSelector('[data-testid="success-message"]');

      // Verify customer was deleted
      const finalCount = await page.locator('[data-testid="customer-row"]').count();
      expect(finalCount).toBe(initialCount - 1);
    });

    it('should cancel deletion when cancel is clicked', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Get initial customer count
      const initialCount = await page.locator('[data-testid="customer-row"]').count();

      // Click on first customer delete button
      await page.click('[data-testid="delete-customer-btn"]:first-child');

      // Cancel deletion in modal
      await page.waitForSelector('[data-testid="cancel-delete-btn"]');
      await page.click('[data-testid="cancel-delete-btn"]');

      // Verify customer count remains the same
      const finalCount = await page.locator('[data-testid="customer-row"]').count();
      expect(finalCount).toBe(initialCount);
    });
  });

  describe('Customer Details View', () => {
    it('should display customer details', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Click on first customer to view details
      await page.click('[data-testid="customer-row"]:first-child');
      await page.waitForSelector('[data-testid="customer-details"]');

      // Check if customer details are displayed
      const customerDetails = await page.locator('[data-testid="customer-details"]');
      expect(await customerDetails.isVisible()).toBe(true);

      // Check if customer information is displayed
      expect(await page.locator('[data-testid="customer-name"]').isVisible()).toBe(true);
      expect(await page.locator('[data-testid="customer-email"]').isVisible()).toBe(true);
      expect(await page.locator('[data-testid="customer-phone"]').isVisible()).toBe(true);
    });

    it('should display customer service history', async () => {
      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Click on first customer to view details
      await page.click('[data-testid="customer-row"]:first-child');
      await page.waitForSelector('[data-testid="customer-details"]');

      // Click on service history tab
      await page.click('[data-testid="service-history-tab"]');
      await page.waitForSelector('[data-testid="service-history"]');

      // Check if service history is displayed
      const serviceHistory = await page.locator('[data-testid="service-history"]');
      expect(await serviceHistory.isVisible()).toBe(true);
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to customers page
      await page.click('[data-testid="nav-customers"]');
      await page.waitForSelector('[data-testid="customer-list"]');

      // Check if mobile layout is applied
      const customerList = await page.locator('[data-testid="customer-list"]');
      expect(await customerList.isVisible()).toBe(true);

      // Check if mobile navigation is visible
      const mobileNav = await page.locator('[data-testid="mobile-nav"]');
      expect(await mobileNav.isVisible()).toBe(true);
    });
  });
});


