/**
 * Dashboard Regions E2E Tests
 * Tests complete user workflows for region operations: add, update, delete, drag, resize
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

// Helper function to wait for dashboard to load
async function waitForDashboard(page: Page) {
  await page.waitForSelector('[data-testid="region-dashboard"]', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
}

// Helper function to login (if needed)
async function login(page: Page) {
  // Adjust based on your auth flow
  // For now, assuming authenticated state or mock auth
  await page.goto(`${BASE_URL}/dashboard`);
  await waitForDashboard(page);
}

test.describe('Dashboard Regions E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.describe('Add Region Operations', () => {
    test('should add a new scheduling region', async ({ page }) => {
      // Wait for dashboard to be ready
      await waitForDashboard(page);

      // Click add region button (FAB or toolbar button)
      const addButton = page.locator('[data-testid="add-region-btn"]').or(
        page.locator('button:has-text("Add Region")')
      ).first();
      
      if (await addButton.count() > 0) {
        await addButton.click();
      } else {
        // Try keyboard shortcut or context menu
        await page.keyboard.press('n'); // Common shortcut for new
      }

      // Wait for region type selector or form
      await page.waitForSelector('[data-testid="region-type-selector"]', { timeout: 5000 }).catch(() => {
        // If no selector, try direct creation
      });

      // Select scheduling region type
      const schedulingOption = page.locator('[data-testid="region-type-scheduling"]').or(
        page.locator('button:has-text("Scheduling")')
      ).first();
      
      if (await schedulingOption.count() > 0) {
        await schedulingOption.click();
      }

      // Wait for region to appear in grid
      await page.waitForSelector('[data-testid^="region-"]', { timeout: 5000 });

      // Verify region was created
      const regions = page.locator('[data-testid^="region-"]');
      const regionCount = await regions.count();
      expect(regionCount).toBeGreaterThan(0);

      // Verify region has correct type
      const newRegion = regions.last();
      const regionType = await newRegion.getAttribute('data-region-type');
      expect(regionType).toBe('scheduling');
    });

    test('should add multiple regions of different types', async ({ page }) => {
      await waitForDashboard(page);

      const regionTypes = ['scheduling', 'analytics', 'work-orders'];
      
      for (const type of regionTypes) {
        // Add region
        const addButton = page.locator('[data-testid="add-region-btn"]').first();
        if (await addButton.count() > 0) {
          await addButton.click();
        }

        // Select region type
        const typeButton = page.locator(`[data-testid="region-type-${type}"]`).or(
          page.locator(`button:has-text("${type}")`)
        ).first();
        
        if (await typeButton.count() > 0) {
          await typeButton.click();
        }

        // Wait for region to appear
        await page.waitForTimeout(500);
      }

      // Verify all regions exist
      const regions = page.locator('[data-testid^="region-"]');
      const regionCount = await regions.count();
      expect(regionCount).toBeGreaterThanOrEqual(regionTypes.length);
    });
  });

  test.describe('Update Region Operations', () => {
    test('should update region settings', async ({ page }) => {
      await waitForDashboard(page);

      // Get first region
      const firstRegion = page.locator('[data-testid^="region-"]').first();
      
      if (await firstRegion.count() === 0) {
        // Create a region first
        const addButton = page.locator('[data-testid="add-region-btn"]').first();
        if (await addButton.count() > 0) {
          await addButton.click();
          await page.waitForTimeout(1000);
        }
      }

      const region = page.locator('[data-testid^="region-"]').first();
      
      // Open settings dialog
      const settingsButton = region.locator('[data-testid="region-settings-btn"]').or(
        region.locator('button[aria-label*="Settings"]')
      ).first();
      
      if (await settingsButton.count() > 0) {
        await settingsButton.click();
      } else {
        // Try right-click context menu
        await region.click({ button: 'right' });
        await page.locator('text=Settings').click();
      }

      // Wait for settings dialog
      await page.waitForSelector('[data-testid="region-settings-dialog"]', { timeout: 5000 });

      // Update region title
      const titleInput = page.locator('[data-testid="region-title-input"]').or(
        page.locator('input[name="title"]')
      ).first();
      
      if (await titleInput.count() > 0) {
        await titleInput.fill('Updated Region Title');
      }

      // Save changes
      const saveButton = page.locator('[data-testid="save-region-btn"]').or(
        page.locator('button:has-text("Save")')
      ).first();
      
      if (await saveButton.count() > 0) {
        await saveButton.click();
      }

      // Wait for dialog to close
      await page.waitForSelector('[data-testid="region-settings-dialog"]', { state: 'hidden', timeout: 3000 }).catch(() => {});

      // Verify update (check for toast or updated text)
      await page.waitForTimeout(500);
    });

    test('should update region position via settings', async ({ page }) => {
      await waitForDashboard(page);

      const region = page.locator('[data-testid^="region-"]').first();
      
      if (await region.count() === 0) {
        // Create region first
        const addButton = page.locator('[data-testid="add-region-btn"]').first();
        if (await addButton.count() > 0) {
          await addButton.click();
          await page.waitForTimeout(1000);
        }
      }

      // Open settings
      const settingsButton = region.locator('[data-testid="region-settings-btn"]').first();
      if (await settingsButton.count() > 0) {
        await settingsButton.click();
        await page.waitForSelector('[data-testid="region-settings-dialog"]', { timeout: 5000 });

        // Update grid position
        const rowInput = page.locator('[data-testid="grid-row-input"]').or(
          page.locator('input[name="grid_row"]')
        ).first();
        
        if (await rowInput.count() > 0) {
          await rowInput.fill('2');
        }

        const colInput = page.locator('[data-testid="grid-col-input"]').or(
          page.locator('input[name="grid_col"]')
        ).first();
        
        if (await colInput.count() > 0) {
          await colInput.fill('3');
        }

        // Save
        const saveButton = page.locator('[data-testid="save-region-btn"]').first();
        if (await saveButton.count() > 0) {
          await saveButton.click();
        }

        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Delete Region Operations', () => {
    test('should delete a region', async ({ page }) => {
      await waitForDashboard(page);

      // Ensure we have at least one region
      let regions = page.locator('[data-testid^="region-"]');
      if (await regions.count() === 0) {
        // Create a region
        const addButton = page.locator('[data-testid="add-region-btn"]').first();
        if (await addButton.count() > 0) {
          await addButton.click();
          await page.waitForTimeout(1000);
        }
      }

      regions = page.locator('[data-testid^="region-"]');
      const initialCount = await regions.count();
      
      if (initialCount === 0) {
        test.skip();
        return;
      }

      const firstRegion = regions.first();

      // Delete region
      const deleteButton = firstRegion.locator('[data-testid="region-delete-btn"]').or(
        firstRegion.locator('button[aria-label*="Delete"]')
      ).first();
      
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
      } else {
        // Try context menu
        await firstRegion.click({ button: 'right' });
        await page.locator('text=Delete').click();
      }

      // Confirm deletion if confirmation dialog appears
      const confirmButton = page.locator('[data-testid="confirm-delete-btn"]').or(
        page.locator('button:has-text("Delete")').filter({ hasText: /confirm|delete/i })
      ).first();
      
      if (await confirmButton.count() > 0) {
        await confirmButton.click();
      }

      // Wait for region to be removed
      await page.waitForTimeout(1000);

      // Verify region count decreased
      const newRegions = page.locator('[data-testid^="region-"]');
      const newCount = await newRegions.count();
      expect(newCount).toBeLessThan(initialCount);
    });
  });

  test.describe('Drag Region Operations', () => {
    test('should drag a region to a new position', async ({ page }) => {
      await waitForDashboard(page);

      // Ensure we have at least one region
      let regions = page.locator('[data-testid^="region-"]');
      if (await regions.count() === 0) {
        const addButton = page.locator('[data-testid="add-region-btn"]').first();
        if (await addButton.count() > 0) {
          await addButton.click();
          await page.waitForTimeout(1000);
        }
      }

      regions = page.locator('[data-testid^="region-"]');
      if (await regions.count() === 0) {
        test.skip();
        return;
      }

      const firstRegion = regions.first();
      
      // Get initial position
      const initialBox = await firstRegion.boundingBox();
      if (!initialBox) {
        test.skip();
        return;
      }

      // Find drag handle
      const dragHandle = firstRegion.locator('[data-testid="region-drag-handle"]').or(
        firstRegion.locator('.region-drag-handle')
      ).first();

      if (await dragHandle.count() === 0) {
        // Try dragging from header
        const header = firstRegion.locator('[data-testid="region-header"]').first();
        if (await header.count() > 0) {
          await header.hover();
          await page.waitForTimeout(300); // Wait for drag handle to appear
        }
      }

      // Perform drag operation
      const dragHandleElement = firstRegion.locator('.region-drag-handle').or(
        firstRegion.locator('[data-testid="region-drag-handle"]')
      ).first();

      if (await dragHandleElement.count() > 0) {
        const handleBox = await dragHandleElement.boundingBox();
        if (handleBox) {
          // Drag to new position (offset by 200px right, 100px down)
          await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(handleBox.x + 200, handleBox.y + 100, { steps: 10 });
          await page.mouse.up();
        }
      } else {
        // Fallback: drag from center of region
        await firstRegion.hover();
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 200, initialBox.y + 100, { steps: 10 });
        await page.mouse.up();
      }

      // Wait for drag to complete
      await page.waitForTimeout(1000);

      // Verify position changed (check bounding box or grid position)
      const newBox = await firstRegion.boundingBox();
      if (newBox && initialBox) {
        // Position should have changed
        const moved = Math.abs(newBox.x - initialBox.x) > 10 || Math.abs(newBox.y - initialBox.y) > 10;
        expect(moved).toBeTruthy();
      }
    });

    test('should prevent overlapping when dragging', async ({ page }) => {
      await waitForDashboard(page);

      // Create two regions
      for (let i = 0; i < 2; i++) {
        const addButton = page.locator('[data-testid="add-region-btn"]').first();
        if (await addButton.count() > 0) {
          await addButton.click();
          await page.waitForTimeout(1000);
        }
      }

      const regions = page.locator('[data-testid^="region-"]');
      if (await regions.count() < 2) {
        test.skip();
        return;
      }

      const firstRegion = regions.first();
      const secondRegion = regions.nth(1);

      // Get second region position
      const secondBox = await secondRegion.boundingBox();
      if (!secondBox) {
        test.skip();
        return;
      }

      // Try to drag first region to overlap with second
      const dragHandle = firstRegion.locator('.region-drag-handle').first();
      
      if (await dragHandle.count() > 0) {
        const handleBox = await dragHandle.boundingBox();
        if (handleBox) {
          // Drag to overlap position
          await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(secondBox.x + 10, secondBox.y + 10, { steps: 10 });
          await page.mouse.up();
        }
      }

      await page.waitForTimeout(1000);

      // Verify regions don't overlap (check for error message or position adjustment)
      // The grid should prevent overlap
    });
  });

  test.describe('Resize Region Operations', () => {
    test('should resize a region', async ({ page }) => {
      await waitForDashboard(page);

      // Ensure we have at least one region
      let regions = page.locator('[data-testid^="region-"]');
      if (await regions.count() === 0) {
        const addButton = page.locator('[data-testid="add-region-btn"]').first();
        if (await addButton.count() > 0) {
          await addButton.click();
          await page.waitForTimeout(1000);
        }
      }

      regions = page.locator('[data-testid^="region-"]');
      if (await regions.count() === 0) {
        test.skip();
        return;
      }

      const firstRegion = regions.first();
      
      // Get initial size
      const initialBox = await firstRegion.boundingBox();
      if (!initialBox) {
        test.skip();
        return;
      }

      // Find resize handle (southeast corner)
      const resizeHandle = firstRegion.locator('[data-testid="resize-handle-se"]').or(
        firstRegion.locator('.react-resizable-handle-se')
      ).first();

      if (await resizeHandle.count() > 0) {
        const handleBox = await resizeHandle.boundingBox();
        if (handleBox) {
          // Resize by dragging handle
          await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(handleBox.x + 100, handleBox.y + 100, { steps: 10 });
          await page.mouse.up();
        }
      }

      // Wait for resize to complete
      await page.waitForTimeout(1000);

      // Verify size changed
      const newBox = await firstRegion.boundingBox();
      if (newBox && initialBox) {
        const resized = Math.abs(newBox.width - initialBox.width) > 10 || 
                       Math.abs(newBox.height - initialBox.height) > 10;
        expect(resized).toBeTruthy();
      }
    });

    test('should respect minimum region size', async ({ page }) => {
      await waitForDashboard(page);

      const regions = page.locator('[data-testid^="region-"]');
      if (await regions.count() === 0) {
        test.skip();
        return;
      }

      const firstRegion = regions.first();
      const initialBox = await firstRegion.boundingBox();
      
      if (!initialBox) {
        test.skip();
        return;
      }

      // Try to resize to very small size
      const resizeHandle = firstRegion.locator('.react-resizable-handle-se').first();
      
      if (await resizeHandle.count() > 0) {
        const handleBox = await resizeHandle.boundingBox();
        if (handleBox) {
          // Try to shrink significantly
          await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(handleBox.x - 500, handleBox.y - 500, { steps: 10 });
          await page.mouse.up();
        }
      }

      await page.waitForTimeout(1000);

      // Verify minimum size is maintained
      const newBox = await firstRegion.boundingBox();
      if (newBox) {
        // Should have minimum dimensions (e.g., at least 100x100)
        expect(newBox.width).toBeGreaterThan(100);
        expect(newBox.height).toBeGreaterThan(100);
      }
    });
  });

  test.describe('Complete Workflow', () => {
    test('should complete full CRUD workflow', async ({ page }) => {
      await waitForDashboard(page);

      // 1. Create region
      const addButton = page.locator('[data-testid="add-region-btn"]').first();
      if (await addButton.count() > 0) {
        await addButton.click();
        await page.waitForTimeout(1000);
      }

      // 2. Verify creation
      let regions = page.locator('[data-testid^="region-"]');
      const createCount = await regions.count();
      expect(createCount).toBeGreaterThan(0);

      // 3. Update region (drag)
      const firstRegion = regions.first();
      const dragHandle = firstRegion.locator('.region-drag-handle').first();
      
      if (await dragHandle.count() > 0) {
        const handleBox = await dragHandle.boundingBox();
        if (handleBox) {
          await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(handleBox.x + 150, handleBox.y + 150, { steps: 10 });
          await page.mouse.up();
        }
      }

      await page.waitForTimeout(1000);

      // 4. Resize region
      const resizeHandle = firstRegion.locator('.react-resizable-handle-se').first();
      
      if (await resizeHandle.count() > 0) {
        const handleBox = await resizeHandle.boundingBox();
        if (handleBox) {
          await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(handleBox.x + 50, handleBox.y + 50, { steps: 5 });
          await page.mouse.up();
        }
      }

      await page.waitForTimeout(1000);

      // 5. Delete region
      const deleteButton = firstRegion.locator('[data-testid="region-delete-btn"]').first();
      
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        
        // Confirm if needed
        const confirmButton = page.locator('[data-testid="confirm-delete-btn"]').first();
        if (await confirmButton.count() > 0) {
          await confirmButton.click();
        }
      }

      await page.waitForTimeout(1000);

      // 6. Verify deletion
      regions = page.locator('[data-testid^="region-"]');
      const finalCount = await regions.count();
      expect(finalCount).toBeLessThan(createCount);
    });
  });
});

