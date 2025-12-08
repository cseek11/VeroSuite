/**
 * Screen Reader E2E Tests
 * 
 * End-to-end tests for ARIA labels, screen reader compatibility, semantic HTML
 */

import { test, expect } from '@playwright/test';

test.describe('Screen Reader E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper ARIA labels on form inputs', async ({ page }) => {
    await page.goto('/work-orders');
    await page.waitForLoadState('networkidle');

    const createButton = page.getByRole('button', { name: /create|new/i });
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForLoadState('networkidle');

      // Check for ARIA labels
      const descriptionInput = page.getByLabel(/description/i);
      if (await descriptionInput.isVisible()) {
        const ariaLabel = await descriptionInput.getAttribute('aria-label');
        expect(ariaLabel || await descriptionInput.getAttribute('aria-labelledby')).toBeTruthy();
      }
    }
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/work-orders');
    await page.waitForLoadState('networkidle');

    // Check for semantic elements
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });
});

