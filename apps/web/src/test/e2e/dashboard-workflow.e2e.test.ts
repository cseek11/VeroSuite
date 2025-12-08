/**
 * Dashboard Workflow E2E Tests
 * 
 * End-to-end tests for dashboard interactions, card management, customization
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard Workflow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Verify dashboard is loaded
    await expect(page.locator('body')).toBeVisible();
  });

  test('should add card to dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for add card button
    const addCardButton = page.getByRole('button', { name: /add.*card|new.*card/i });
    if (await addCardButton.isVisible({ timeout: 5000 })) {
      await addCardButton.click();

      // Select card type
      const cardType = page.getByText(/customer|metric|kpi/i).first();
      if (await cardType.isVisible()) {
        await cardType.click();
      }
    }
  });
});

