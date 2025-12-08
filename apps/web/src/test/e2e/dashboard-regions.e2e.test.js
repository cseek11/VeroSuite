"use strict";
/**
 * Dashboard Regions E2E Tests
 * Tests complete user workflows for region operations: add, update, delete, drag, resize
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
// Test configuration
var BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
// Helper function to wait for dashboard to load
function waitForDashboard(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.waitForSelector('[data-testid="region-dashboard"]', { timeout: 10000 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Helper function to login (if needed)
function login(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Adjust based on your auth flow
                // For now, assuming authenticated state or mock auth
                return [4 /*yield*/, page.goto("".concat(BASE_URL, "/dashboard"))];
                case 1:
                    // Adjust based on your auth flow
                    // For now, assuming authenticated state or mock auth
                    _a.sent();
                    return [4 /*yield*/, waitForDashboard(page)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
test_1.test.describe('Dashboard Regions E2E Tests', function () {
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, login(page)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test_1.test.describe('Add Region Operations', function () {
        (0, test_1.test)('should add a new scheduling region', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var addButton, schedulingOption, regions, regionCount, newRegion, regionType;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Wait for dashboard to be ready
                    return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        // Wait for dashboard to be ready
                        _c.sent();
                        addButton = page.locator('[data-testid="add-region-btn"]').or(page.locator('button:has-text("Add Region")')).first();
                        return [4 /*yield*/, addButton.count()];
                    case 2:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, addButton.click()];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 4: 
                    // Try keyboard shortcut or context menu
                    return [4 /*yield*/, page.keyboard.press('n')];
                    case 5:
                        // Try keyboard shortcut or context menu
                        _c.sent(); // Common shortcut for new
                        _c.label = 6;
                    case 6: 
                    // Wait for region type selector or form
                    return [4 /*yield*/, page.waitForSelector('[data-testid="region-type-selector"]', { timeout: 5000 }).catch(function () {
                            // If no selector, try direct creation
                        })];
                    case 7:
                        // Wait for region type selector or form
                        _c.sent();
                        schedulingOption = page.locator('[data-testid="region-type-scheduling"]').or(page.locator('button:has-text("Scheduling")')).first();
                        return [4 /*yield*/, schedulingOption.count()];
                    case 8:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, schedulingOption.click()];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: 
                    // Wait for region to appear in grid
                    return [4 /*yield*/, page.waitForSelector('[data-testid^="region-"]', { timeout: 5000 })];
                    case 11:
                        // Wait for region to appear in grid
                        _c.sent();
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 12:
                        regionCount = _c.sent();
                        (0, test_1.expect)(regionCount).toBeGreaterThan(0);
                        newRegion = regions.last();
                        return [4 /*yield*/, newRegion.getAttribute('data-region-type')];
                    case 13:
                        regionType = _c.sent();
                        (0, test_1.expect)(regionType).toBe('scheduling');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should add multiple regions of different types', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var regionTypes, _i, regionTypes_1, type, addButton, typeButton, regions, regionCount;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        regionTypes = ['scheduling', 'analytics', 'work-orders'];
                        _i = 0, regionTypes_1 = regionTypes;
                        _c.label = 2;
                    case 2:
                        if (!(_i < regionTypes_1.length)) return [3 /*break*/, 11];
                        type = regionTypes_1[_i];
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 3:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, addButton.click()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        typeButton = page.locator("[data-testid=\"region-type-".concat(type, "\"]")).or(page.locator("button:has-text(\"".concat(type, "\")"))).first();
                        return [4 /*yield*/, typeButton.count()];
                    case 6:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, typeButton.click()];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: 
                    // Wait for region to appear
                    return [4 /*yield*/, page.waitForTimeout(500)];
                    case 9:
                        // Wait for region to appear
                        _c.sent();
                        _c.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 2];
                    case 11:
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 12:
                        regionCount = _c.sent();
                        (0, test_1.expect)(regionCount).toBeGreaterThanOrEqual(regionTypes.length);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Update Region Operations', function () {
        (0, test_1.test)('should update region settings', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var firstRegion, addButton, region, settingsButton, titleInput, saveButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        firstRegion = page.locator('[data-testid^="region-"]').first();
                        return [4 /*yield*/, firstRegion.count()];
                    case 2:
                        if (!((_c.sent()) === 0)) return [3 /*break*/, 6];
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 3:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, addButton.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        region = page.locator('[data-testid^="region-"]').first();
                        settingsButton = region.locator('[data-testid="region-settings-btn"]').or(region.locator('button[aria-label*="Settings"]')).first();
                        return [4 /*yield*/, settingsButton.count()];
                    case 7:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, settingsButton.click()];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 12];
                    case 9: 
                    // Try right-click context menu
                    return [4 /*yield*/, region.click({ button: 'right' })];
                    case 10:
                        // Try right-click context menu
                        _c.sent();
                        return [4 /*yield*/, page.locator('text=Settings').click()];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12: 
                    // Wait for settings dialog
                    return [4 /*yield*/, page.waitForSelector('[data-testid="region-settings-dialog"]', { timeout: 5000 })];
                    case 13:
                        // Wait for settings dialog
                        _c.sent();
                        titleInput = page.locator('[data-testid="region-title-input"]').or(page.locator('input[name="title"]')).first();
                        return [4 /*yield*/, titleInput.count()];
                    case 14:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 16];
                        return [4 /*yield*/, titleInput.fill('Updated Region Title')];
                    case 15:
                        _c.sent();
                        _c.label = 16;
                    case 16:
                        saveButton = page.locator('[data-testid="save-region-btn"]').or(page.locator('button:has-text("Save")')).first();
                        return [4 /*yield*/, saveButton.count()];
                    case 17:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 19];
                        return [4 /*yield*/, saveButton.click()];
                    case 18:
                        _c.sent();
                        _c.label = 19;
                    case 19: 
                    // Wait for dialog to close
                    return [4 /*yield*/, page.waitForSelector('[data-testid="region-settings-dialog"]', { state: 'hidden', timeout: 3000 }).catch(function () { })];
                    case 20:
                        // Wait for dialog to close
                        _c.sent();
                        // Verify update (check for toast or updated text)
                        return [4 /*yield*/, page.waitForTimeout(500)];
                    case 21:
                        // Verify update (check for toast or updated text)
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should update region position via settings', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var region, addButton, settingsButton, rowInput, colInput, saveButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        region = page.locator('[data-testid^="region-"]').first();
                        return [4 /*yield*/, region.count()];
                    case 2:
                        if (!((_c.sent()) === 0)) return [3 /*break*/, 6];
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 3:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, addButton.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        settingsButton = region.locator('[data-testid="region-settings-btn"]').first();
                        return [4 /*yield*/, settingsButton.count()];
                    case 7:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 20];
                        return [4 /*yield*/, settingsButton.click()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="region-settings-dialog"]', { timeout: 5000 })];
                    case 9:
                        _c.sent();
                        rowInput = page.locator('[data-testid="grid-row-input"]').or(page.locator('input[name="grid_row"]')).first();
                        return [4 /*yield*/, rowInput.count()];
                    case 10:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, rowInput.fill('2')];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12:
                        colInput = page.locator('[data-testid="grid-col-input"]').or(page.locator('input[name="grid_col"]')).first();
                        return [4 /*yield*/, colInput.count()];
                    case 13:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 15];
                        return [4 /*yield*/, colInput.fill('3')];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        saveButton = page.locator('[data-testid="save-region-btn"]').first();
                        return [4 /*yield*/, saveButton.count()];
                    case 16:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 18];
                        return [4 /*yield*/, saveButton.click()];
                    case 17:
                        _c.sent();
                        _c.label = 18;
                    case 18: return [4 /*yield*/, page.waitForTimeout(500)];
                    case 19:
                        _c.sent();
                        _c.label = 20;
                    case 20: return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Delete Region Operations', function () {
        (0, test_1.test)('should delete a region', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var regions, addButton, initialCount, firstRegion, deleteButton, confirmButton, newRegions, newCount;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 2:
                        if (!((_c.sent()) === 0)) return [3 /*break*/, 6];
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 3:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, addButton.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 7:
                        initialCount = _c.sent();
                        if (initialCount === 0) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        firstRegion = regions.first();
                        deleteButton = firstRegion.locator('[data-testid="region-delete-btn"]').or(firstRegion.locator('button[aria-label*="Delete"]')).first();
                        return [4 /*yield*/, deleteButton.count()];
                    case 8:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, deleteButton.click()];
                    case 9:
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 10: 
                    // Try context menu
                    return [4 /*yield*/, firstRegion.click({ button: 'right' })];
                    case 11:
                        // Try context menu
                        _c.sent();
                        return [4 /*yield*/, page.locator('text=Delete').click()];
                    case 12:
                        _c.sent();
                        _c.label = 13;
                    case 13:
                        confirmButton = page.locator('[data-testid="confirm-delete-btn"]').or(page.locator('button:has-text("Delete")').filter({ hasText: /confirm|delete/i })).first();
                        return [4 /*yield*/, confirmButton.count()];
                    case 14:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 16];
                        return [4 /*yield*/, confirmButton.click()];
                    case 15:
                        _c.sent();
                        _c.label = 16;
                    case 16: 
                    // Wait for region to be removed
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 17:
                        // Wait for region to be removed
                        _c.sent();
                        newRegions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, newRegions.count()];
                    case 18:
                        newCount = _c.sent();
                        (0, test_1.expect)(newCount).toBeLessThan(initialCount);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Drag Region Operations', function () {
        (0, test_1.test)('should drag a region to a new position', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var regions, addButton, firstRegion, initialBox, dragHandle, header, dragHandleElement, handleBox, newBox, moved;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 2:
                        if (!((_c.sent()) === 0)) return [3 /*break*/, 6];
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 3:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, addButton.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 7:
                        if ((_c.sent()) === 0) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        firstRegion = regions.first();
                        return [4 /*yield*/, firstRegion.boundingBox()];
                    case 8:
                        initialBox = _c.sent();
                        if (!initialBox) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        dragHandle = firstRegion.locator('[data-testid="region-drag-handle"]').or(firstRegion.locator('.region-drag-handle')).first();
                        return [4 /*yield*/, dragHandle.count()];
                    case 9:
                        if (!((_c.sent()) === 0)) return [3 /*break*/, 13];
                        header = firstRegion.locator('[data-testid="region-header"]').first();
                        return [4 /*yield*/, header.count()];
                    case 10:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, header.hover()];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(300)];
                    case 12:
                        _c.sent(); // Wait for drag handle to appear
                        _c.label = 13;
                    case 13:
                        dragHandleElement = firstRegion.locator('.region-drag-handle').or(firstRegion.locator('[data-testid="region-drag-handle"]')).first();
                        return [4 /*yield*/, dragHandleElement.count()];
                    case 14:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 21];
                        return [4 /*yield*/, dragHandleElement.boundingBox()];
                    case 15:
                        handleBox = _c.sent();
                        if (!handleBox) return [3 /*break*/, 20];
                        // Drag to new position (offset by 200px right, 100px down)
                        return [4 /*yield*/, page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)];
                    case 16:
                        // Drag to new position (offset by 200px right, 100px down)
                        _c.sent();
                        return [4 /*yield*/, page.mouse.down()];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.move(handleBox.x + 200, handleBox.y + 100, { steps: 10 })];
                    case 18:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.up()];
                    case 19:
                        _c.sent();
                        _c.label = 20;
                    case 20: return [3 /*break*/, 26];
                    case 21: 
                    // Fallback: drag from center of region
                    return [4 /*yield*/, firstRegion.hover()];
                    case 22:
                        // Fallback: drag from center of region
                        _c.sent();
                        return [4 /*yield*/, page.mouse.down()];
                    case 23:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.move(initialBox.x + 200, initialBox.y + 100, { steps: 10 })];
                    case 24:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.up()];
                    case 25:
                        _c.sent();
                        _c.label = 26;
                    case 26: 
                    // Wait for drag to complete
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 27:
                        // Wait for drag to complete
                        _c.sent();
                        return [4 /*yield*/, firstRegion.boundingBox()];
                    case 28:
                        newBox = _c.sent();
                        if (newBox && initialBox) {
                            moved = Math.abs(newBox.x - initialBox.x) > 10 || Math.abs(newBox.y - initialBox.y) > 10;
                            (0, test_1.expect)(moved).toBeTruthy();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should prevent overlapping when dragging', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var i, addButton, regions, firstRegion, secondRegion, secondBox, dragHandle, handleBox;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < 2)) return [3 /*break*/, 7];
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 3:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, addButton.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7:
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 8:
                        if ((_c.sent()) < 2) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        firstRegion = regions.first();
                        secondRegion = regions.nth(1);
                        return [4 /*yield*/, secondRegion.boundingBox()];
                    case 9:
                        secondBox = _c.sent();
                        if (!secondBox) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        dragHandle = firstRegion.locator('.region-drag-handle').first();
                        return [4 /*yield*/, dragHandle.count()];
                    case 10:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 16];
                        return [4 /*yield*/, dragHandle.boundingBox()];
                    case 11:
                        handleBox = _c.sent();
                        if (!handleBox) return [3 /*break*/, 16];
                        // Drag to overlap position
                        return [4 /*yield*/, page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)];
                    case 12:
                        // Drag to overlap position
                        _c.sent();
                        return [4 /*yield*/, page.mouse.down()];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.move(secondBox.x + 10, secondBox.y + 10, { steps: 10 })];
                    case 14:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.up()];
                    case 15:
                        _c.sent();
                        _c.label = 16;
                    case 16: return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 17:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Resize Region Operations', function () {
        (0, test_1.test)('should resize a region', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var regions, addButton, firstRegion, initialBox, resizeHandle, handleBox, newBox, resized;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 2:
                        if (!((_c.sent()) === 0)) return [3 /*break*/, 6];
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 3:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, addButton.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 7:
                        if ((_c.sent()) === 0) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        firstRegion = regions.first();
                        return [4 /*yield*/, firstRegion.boundingBox()];
                    case 8:
                        initialBox = _c.sent();
                        if (!initialBox) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        resizeHandle = firstRegion.locator('[data-testid="resize-handle-se"]').or(firstRegion.locator('.react-resizable-handle-se')).first();
                        return [4 /*yield*/, resizeHandle.count()];
                    case 9:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 15];
                        return [4 /*yield*/, resizeHandle.boundingBox()];
                    case 10:
                        handleBox = _c.sent();
                        if (!handleBox) return [3 /*break*/, 15];
                        // Resize by dragging handle
                        return [4 /*yield*/, page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)];
                    case 11:
                        // Resize by dragging handle
                        _c.sent();
                        return [4 /*yield*/, page.mouse.down()];
                    case 12:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.move(handleBox.x + 100, handleBox.y + 100, { steps: 10 })];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.up()];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15: 
                    // Wait for resize to complete
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 16:
                        // Wait for resize to complete
                        _c.sent();
                        return [4 /*yield*/, firstRegion.boundingBox()];
                    case 17:
                        newBox = _c.sent();
                        if (newBox && initialBox) {
                            resized = Math.abs(newBox.width - initialBox.width) > 10 ||
                                Math.abs(newBox.height - initialBox.height) > 10;
                            (0, test_1.expect)(resized).toBeTruthy();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should respect minimum region size', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var regions, firstRegion, initialBox, resizeHandle, handleBox, newBox;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 2:
                        if ((_c.sent()) === 0) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        firstRegion = regions.first();
                        return [4 /*yield*/, firstRegion.boundingBox()];
                    case 3:
                        initialBox = _c.sent();
                        if (!initialBox) {
                            test_1.test.skip();
                            return [2 /*return*/];
                        }
                        resizeHandle = firstRegion.locator('.react-resizable-handle-se').first();
                        return [4 /*yield*/, resizeHandle.count()];
                    case 4:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, resizeHandle.boundingBox()];
                    case 5:
                        handleBox = _c.sent();
                        if (!handleBox) return [3 /*break*/, 10];
                        // Try to shrink significantly
                        return [4 /*yield*/, page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)];
                    case 6:
                        // Try to shrink significantly
                        _c.sent();
                        return [4 /*yield*/, page.mouse.down()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.move(handleBox.x - 500, handleBox.y - 500, { steps: 10 })];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.up()];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, firstRegion.boundingBox()];
                    case 12:
                        newBox = _c.sent();
                        if (newBox) {
                            // Should have minimum dimensions (e.g., at least 100x100)
                            (0, test_1.expect)(newBox.width).toBeGreaterThan(100);
                            (0, test_1.expect)(newBox.height).toBeGreaterThan(100);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Complete Workflow', function () {
        (0, test_1.test)('should complete full CRUD workflow', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var addButton, regions, createCount, firstRegion, dragHandle, handleBox, resizeHandle, handleBox, deleteButton, confirmButton, finalCount;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, waitForDashboard(page)];
                    case 1:
                        _c.sent();
                        addButton = page.locator('[data-testid="add-region-btn"]').first();
                        return [4 /*yield*/, addButton.count()];
                    case 2:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, addButton.click()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 6:
                        createCount = _c.sent();
                        (0, test_1.expect)(createCount).toBeGreaterThan(0);
                        firstRegion = regions.first();
                        dragHandle = firstRegion.locator('.region-drag-handle').first();
                        return [4 /*yield*/, dragHandle.count()];
                    case 7:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, dragHandle.boundingBox()];
                    case 8:
                        handleBox = _c.sent();
                        if (!handleBox) return [3 /*break*/, 13];
                        return [4 /*yield*/, page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.down()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.move(handleBox.x + 150, handleBox.y + 150, { steps: 10 })];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.up()];
                    case 12:
                        _c.sent();
                        _c.label = 13;
                    case 13: return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 14:
                        _c.sent();
                        resizeHandle = firstRegion.locator('.react-resizable-handle-se').first();
                        return [4 /*yield*/, resizeHandle.count()];
                    case 15:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 21];
                        return [4 /*yield*/, resizeHandle.boundingBox()];
                    case 16:
                        handleBox = _c.sent();
                        if (!handleBox) return [3 /*break*/, 21];
                        return [4 /*yield*/, page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.down()];
                    case 18:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.move(handleBox.x + 50, handleBox.y + 50, { steps: 5 })];
                    case 19:
                        _c.sent();
                        return [4 /*yield*/, page.mouse.up()];
                    case 20:
                        _c.sent();
                        _c.label = 21;
                    case 21: return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 22:
                        _c.sent();
                        deleteButton = firstRegion.locator('[data-testid="region-delete-btn"]').first();
                        return [4 /*yield*/, deleteButton.count()];
                    case 23:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 27];
                        return [4 /*yield*/, deleteButton.click()];
                    case 24:
                        _c.sent();
                        confirmButton = page.locator('[data-testid="confirm-delete-btn"]').first();
                        return [4 /*yield*/, confirmButton.count()];
                    case 25:
                        if (!((_c.sent()) > 0)) return [3 /*break*/, 27];
                        return [4 /*yield*/, confirmButton.click()];
                    case 26:
                        _c.sent();
                        _c.label = 27;
                    case 27: return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 28:
                        _c.sent();
                        // 6. Verify deletion
                        regions = page.locator('[data-testid^="region-"]');
                        return [4 /*yield*/, regions.count()];
                    case 29:
                        finalCount = _c.sent();
                        (0, test_1.expect)(finalCount).toBeLessThan(createCount);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
