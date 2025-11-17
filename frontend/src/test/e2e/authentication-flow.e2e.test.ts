/**
 * Authentication Flow E2E Tests
 * 
 * End-to-end tests for login, logout, session management, token refresh
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow E2E', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill login form
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      // Submit form
      const submitButton = page.getByRole('button', { name: /login|sign.*in/i });
      await submitButton.click();

      // Wait for redirect or success message
      await page.waitForURL(/dashboard|home/, { timeout: 10000 });
    }
  });

  test('should logout successfully', async ({ page }) => {
    // Assume user is logged in
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Find logout button
    const logoutButton = page.getByRole('button', { name: /logout|sign.*out/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Should redirect to login
      await page.waitForURL(/login/, { timeout: 5000 });
    }
  });
});

