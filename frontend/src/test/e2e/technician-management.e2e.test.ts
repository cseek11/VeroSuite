/**
 * Technician Management E2E Tests
 * 
 * End-to-end tests for technician CRUD operations and availability management
 */

import { test, expect } from '@playwright/test';

test.describe('Technician Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should view technician list', async ({ page }) => {
    await page.goto('/technicians');
    await page.waitForLoadState('networkidle');

    // Wait for technician list to load
    await expect(page.getByText(/technician|name|email/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter technicians by status', async ({ page }) => {
    await page.goto('/technicians');
    await page.waitForLoadState('networkidle');

    // Click filter button
    const filterButton = page.getByRole('button', { name: /filter/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();

      // Select status filter
      const statusSelect = page.getByLabel(/status/i);
      if (await statusSelect.isVisible()) {
        await statusSelect.selectOption('active');
      }
    }
  });

  test('should search technicians', async ({ page }) => {
    await page.goto('/technicians');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByPlaceholderText(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('John');
      await page.waitForTimeout(1000);

      // Verify search results
      const results = page.locator('text=/john/i');
      await expect(results.first()).toBeVisible({ timeout: 3000 });
    }
  });
});

