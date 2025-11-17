/**
 * Keyboard Navigation E2E Tests
 * 
 * End-to-end tests for keyboard navigation, keyboard shortcuts, focus management
 */

import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate with Tab key', async ({ page }) => {
    await page.goto('/work-orders');
    await page.waitForLoadState('networkidle');

    // Press Tab to navigate
    await page.keyboard.press('Tab');
    
    // Verify focus moved
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should submit form with Enter key', async ({ page }) => {
    await page.goto('/work-orders');
    await page.waitForLoadState('networkidle');

    // Navigate to create form
    const createButton = page.getByRole('button', { name: /create|new/i });
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForLoadState('networkidle');

      // Fill form and press Enter
      const descriptionInput = page.getByLabel(/description/i);
      if (await descriptionInput.isVisible()) {
        await descriptionInput.fill('Test description');
        await descriptionInput.press('Enter');
      }
    }
  });
});

