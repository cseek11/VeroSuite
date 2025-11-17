import { test, expect } from '@playwright/test';

test.describe('Dashboard Regions E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard and authenticate
    await page.goto('/dashboard');
    // Add authentication steps
  });

  test('should create and arrange regions', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="region-grid"]');

    // Click add region button
    await page.click('[data-testid="add-region-button"]');

    // Select region type
    await page.click('text=Scheduling');

    // Verify region appears
    await expect(page.locator('[data-region-type="scheduling"]')).toBeVisible();

    // Drag region to new position
    const region = page.locator('[data-region-type="scheduling"]').first();
    const dragHandle = region.locator('.region-drag-handle');
    
    await dragHandle.dragTo(page.locator('[data-testid="grid-cell"]').nth(5));

    // Verify position changed
    await expect(region).toHaveAttribute('data-grid-row', '1');
  });

  test('should resize a region', async ({ page }) => {
    // Create region first
    await page.click('[data-testid="add-region-button"]');
    await page.click('text=Analytics');

    const region = page.locator('[data-region-type="analytics"]').first();
    
    // Hover to show resize handles
    await region.hover();
    
    // Resize from bottom-right corner
    const resizeHandle = region.locator('.react-resizable-handle-se');
    await resizeHandle.dragTo(page.locator('body'), {
      targetPosition: { x: 200, y: 200 }
    });

    // Verify size changed
    await expect(region).toHaveAttribute('data-col-span', '4');
  });

  test('should show conflict resolution dialog on concurrent edits', async ({ page, context }) => {
    // Open dashboard in two tabs
    const page1 = page;
    const page2 = await context.newPage();
    
    await page1.goto('/dashboard');
    await page2.goto('/dashboard');

    // Edit same region in both tabs
    const regionId = 'test-region-id';
    
    // Tab 1: Update region
    await page1.click(`[data-region-id="${regionId}"] .settings-button`);
    await page1.fill('input[name="title"]', 'Title from Tab 1');
    await page1.click('button:has-text("Save")');

    // Tab 2: Update same region
    await page2.click(`[data-region-id="${regionId}"] .settings-button`);
    await page2.fill('input[name="title"]', 'Title from Tab 2');
    await page2.click('button:has-text("Save")');

    // Verify conflict dialog appears
    await expect(page2.locator('[data-testid="conflict-resolution-dialog"]')).toBeVisible();
  });

  test('should handle mobile swipe navigation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test only');

    await page.goto('/dashboard');
    
    // Swipe left to next region
    await page.touchscreen.tap(200, 400);
    await page.touchscreen.tap(100, 400); // Swipe left

    // Verify region changed
    await expect(page.locator('.mobile-region-slide.active')).toHaveAttribute('data-index', '1');
  });

  test('should validate region position before saving', async ({ page }) => {
    await page.goto('/dashboard');

    // Try to create overlapping regions
    await page.click('[data-testid="add-region-button"]');
    await page.click('text=Scheduling');

    // Try to drag to overlapping position
    const region1 = page.locator('[data-region-type="scheduling"]').first();
    await region1.dragTo(page.locator('[data-testid="grid-cell"]').nth(0));

    // Add second region
    await page.click('[data-testid="add-region-button"]');
    await page.click('text=Analytics');

    const region2 = page.locator('[data-region-type="analytics"]').first();
    
    // Try to drag to overlap with region1
    await region2.dragTo(page.locator('[data-testid="grid-cell"]').nth(0));

    // Verify invalid indicator appears
    await expect(region2.locator('.validity-indicator.invalid')).toBeVisible();
  });
});




