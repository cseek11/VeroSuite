/**
 * Page Load Performance E2E Tests
 * 
 * End-to-end tests for initial load times, Lighthouse metrics, bundle size
 */

import { test, expect } from '@playwright/test';

test.describe('Page Load Performance E2E', () => {
  test('should load work orders page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/work-orders');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    
    // Performance budget: 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load dashboard within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    
    // Performance budget: 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should measure API response times', async ({ page }) => {
    await page.goto('/work-orders');
    
    // Monitor network requests
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/') && response.status() === 200
    );

    await page.waitForLoadState('networkidle');
    
    const response = await responsePromise;
    const responseTime = response.timing().responseEnd - response.timing().requestStart;
    
    // API should respond within 1 second
    expect(responseTime).toBeLessThan(1000);
  });
});

