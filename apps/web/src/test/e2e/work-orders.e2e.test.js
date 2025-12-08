"use strict";
/**
 * Work Orders E2E Tests
 *
 * End-to-end tests for work order creation and management including:
 * - Create work order with customer search
 * - Create work order with technician assignment
 * - View technician list on work order form
 * - Search and select customer
 * - Form submission workflow
 * - Error scenarios
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
test_1.test.describe('Work Orders E2E', function () {
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Mock authentication - adjust based on your auth setup
                return [4 /*yield*/, page.goto('/')];
                case 1:
                    // Mock authentication - adjust based on your auth setup
                    _c.sent();
                    // Wait for page to load
                    return [4 /*yield*/, page.waitForLoadState('networkidle')];
                case 2:
                    // Wait for page to load
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test_1.test.describe('Work Order Creation', function () {
        (0, test_1.test)('should create work order with customer search', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch, customerOption, descriptionInput, submitButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Navigate to work orders page
                    return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        // Navigate to work orders page
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Wait for form to appear
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Wait for form to appear
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, customerSearch.fill('Test Customer')];
                    case 5:
                        _c.sent();
                        // Wait for dropdown to appear
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-search-selector"]', { timeout: 3000 }).catch(function () {
                                // If test ID not available, wait for dropdown
                                page.waitForSelector('text=Test Customer', { timeout: 3000 });
                            })];
                    case 6:
                        // Wait for dropdown to appear
                        _c.sent();
                        customerOption = page.getByText(/test customer/i).first();
                        return [4 /*yield*/, customerOption.click()];
                    case 7:
                        _c.sent();
                        descriptionInput = page.getByLabel(/description/i);
                        return [4 /*yield*/, descriptionInput.fill('E2E test work order description')];
                    case 8:
                        _c.sent();
                        submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
                        return [4 /*yield*/, submitButton.click()];
                    case 9:
                        _c.sent();
                        // Wait for success message or redirect
                        return [4 /*yield*/, page.waitForURL(/work-orders/, { timeout: 10000 })];
                    case 10:
                        // Wait for success message or redirect
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should create work order with technician assignment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch, customerOption, technicianSelect, descriptionInput, submitButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Wait for form
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, customerSearch.fill('Test Customer')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 6:
                        _c.sent(); // Wait for search results
                        customerOption = page.getByText(/test customer/i).first();
                        return [4 /*yield*/, customerOption.click()];
                    case 7:
                        _c.sent();
                        technicianSelect = page.getByLabel(/assigned technician/i);
                        return [4 /*yield*/, technicianSelect.waitFor({ state: 'visible', timeout: 5000 })];
                    case 8:
                        _c.sent();
                        // Select technician
                        return [4 /*yield*/, technicianSelect.selectOption({ index: 1 })];
                    case 9:
                        // Select technician
                        _c.sent(); // Select first available technician
                        descriptionInput = page.getByLabel(/description/i);
                        return [4 /*yield*/, descriptionInput.fill('E2E test work order with technician')];
                    case 10:
                        _c.sent();
                        submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
                        return [4 /*yield*/, submitButton.click()];
                    case 11:
                        _c.sent();
                        // Verify success
                        return [4 /*yield*/, page.waitForURL(/work-orders/, { timeout: 10000 })];
                    case 12:
                        // Verify success
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should display technician list on work order form', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, technicianSelect, selectText, options;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Wait for form
                        _c.sent();
                        technicianSelect = page.getByLabel(/assigned technician/i);
                        return [4 /*yield*/, technicianSelect.waitFor({ state: 'visible', timeout: 5000 })];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, technicianSelect.textContent()];
                    case 6:
                        selectText = _c.sent();
                        (0, test_1.expect)(selectText).not.toContain('Loading technicians');
                        // Open dropdown
                        return [4 /*yield*/, technicianSelect.click()];
                    case 7:
                        // Open dropdown
                        _c.sent();
                        return [4 /*yield*/, technicianSelect.locator('option').count()];
                    case 8:
                        options = _c.sent();
                        (0, test_1.expect)(options).toBeGreaterThan(1); // More than just the "Select technician" option
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should search and select customer', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch, searchResults, selectedCustomer;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Wait for form
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, customerSearch.fill('John')];
                    case 5:
                        _c.sent();
                        // Wait for search results dropdown
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 6:
                        // Wait for search results dropdown
                        _c.sent();
                        searchResults = page.locator('text=/john/i');
                        return [4 /*yield*/, (0, test_1.expect)(searchResults.first()).toBeVisible({ timeout: 3000 })];
                    case 7:
                        _c.sent();
                        // Select customer
                        return [4 /*yield*/, searchResults.first().click()];
                    case 8:
                        // Select customer
                        _c.sent();
                        selectedCustomer = page.locator('text=/selected customer|john/i');
                        return [4 /*yield*/, (0, test_1.expect)(selectedCustomer.first()).toBeVisible({ timeout: 2000 })];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Form Validation', function () {
        (0, test_1.test)('should show validation error when customer is not selected', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, submitButton, isDisabled;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Wait for form
                        _c.sent();
                        submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
                        return [4 /*yield*/, submitButton.isDisabled()];
                    case 5:
                        isDisabled = _c.sent();
                        if (!!isDisabled) return [3 /*break*/, 8];
                        return [4 /*yield*/, submitButton.click()];
                    case 6:
                        _c.sent();
                        // Should show validation error
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('text=/customer|required/i')).toBeVisible({ timeout: 2000 })];
                    case 7:
                        // Should show validation error
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        // Button is disabled, which is also valid
                        (0, test_1.expect)(isDisabled).toBe(true);
                        _c.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should show validation error when description is missing', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch, customerOption, submitButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Wait for form
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, customerSearch.fill('Test Customer')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 6:
                        _c.sent();
                        customerOption = page.getByText(/test customer/i).first();
                        return [4 /*yield*/, customerOption.click()];
                    case 7:
                        _c.sent();
                        submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
                        return [4 /*yield*/, submitButton.isDisabled()];
                    case 8:
                        if (!!(_c.sent())) return [3 /*break*/, 11];
                        return [4 /*yield*/, submitButton.click()];
                    case 9:
                        _c.sent();
                        // Should show validation error
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('text=/description.*required/i')).toBeVisible({ timeout: 2000 })];
                    case 10:
                        // Should show validation error
                        _c.sent();
                        _c.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Error Scenarios', function () {
        (0, test_1.test)('should handle API error when loading technicians', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Intercept and fail the technicians API call
                    return [4 /*yield*/, page.route('**/api/v1/technicians**', function (route) {
                            route.fulfill({
                                status: 500,
                                body: JSON.stringify({ error: 'Internal Server Error' }),
                            });
                        })];
                    case 1:
                        // Intercept and fail the technicians API call
                        _c.sent();
                        return [4 /*yield*/, page.goto('/work-orders')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 3:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 4:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 5:
                        // Wait for form
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, (0, test_1.expect)(customerSearch).toBeVisible()];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should handle API error when submitting form', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch, customerOption, descriptionInput, submitButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Intercept and fail the work order creation API call
                    return [4 /*yield*/, page.route('**/api/v1/work-orders**', function (route) {
                            if (route.request().method() === 'POST') {
                                route.fulfill({
                                    status: 500,
                                    body: JSON.stringify({ error: 'Failed to create work order' }),
                                });
                            }
                            else {
                                route.continue();
                            }
                        })];
                    case 1:
                        // Intercept and fail the work order creation API call
                        _c.sent();
                        return [4 /*yield*/, page.goto('/work-orders')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 3:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 4:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 5:
                        // Wait for form
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, customerSearch.fill('Test Customer')];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 7:
                        _c.sent();
                        customerOption = page.getByText(/test customer/i).first();
                        return [4 /*yield*/, customerOption.click()];
                    case 8:
                        _c.sent();
                        descriptionInput = page.getByLabel(/description/i);
                        return [4 /*yield*/, descriptionInput.fill('Test description')];
                    case 9:
                        _c.sent();
                        submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
                        return [4 /*yield*/, submitButton.click()];
                    case 10:
                        _c.sent();
                        // Should show error message
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('text=/error|failed/i')).toBeVisible({ timeout: 5000 })];
                    case 11:
                        // Should show error message
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Form Workflow', function () {
        (0, test_1.test)('should complete full work order creation workflow', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch, customerOption, serviceTypeSelect, prioritySelect, descriptionInput, technicianSelect, durationInput, priceInput, submitButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Step 2: Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Step 2: Wait for form
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, customerSearch.fill('Test Customer')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 6:
                        _c.sent();
                        customerOption = page.getByText(/test customer/i).first();
                        return [4 /*yield*/, customerOption.click()];
                    case 7:
                        _c.sent();
                        serviceTypeSelect = page.getByLabel(/service type/i);
                        return [4 /*yield*/, serviceTypeSelect.selectOption('General Pest Control')];
                    case 8:
                        _c.sent();
                        prioritySelect = page.getByLabel(/priority/i);
                        return [4 /*yield*/, prioritySelect.selectOption('high')];
                    case 9:
                        _c.sent();
                        descriptionInput = page.getByLabel(/description/i);
                        return [4 /*yield*/, descriptionInput.fill('Complete E2E test work order')];
                    case 10:
                        _c.sent();
                        technicianSelect = page.getByLabel(/assigned technician/i);
                        return [4 /*yield*/, technicianSelect.waitFor({ state: 'visible', timeout: 5000 })];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, technicianSelect.selectOption({ index: 1 })];
                    case 12:
                        _c.sent();
                        durationInput = page.getByLabel(/estimated duration/i);
                        return [4 /*yield*/, durationInput.fill('120')];
                    case 13:
                        _c.sent();
                        priceInput = page.getByLabel(/service price/i);
                        return [4 /*yield*/, priceInput.fill('150.00')];
                    case 14:
                        _c.sent();
                        submitButton = page.getByRole('button', { name: /create.*work.*order|save/i });
                        return [4 /*yield*/, submitButton.click()];
                    case 15:
                        _c.sent();
                        // Step 11: Verify success (redirect or success message)
                        return [4 /*yield*/, page.waitForURL(/work-orders/, { timeout: 10000 })];
                    case 16:
                        // Step 11: Verify success (redirect or success message)
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should cancel work order creation', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var createButton, customerSearch, cancelButton;
            var page = _b.page;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goto('/work-orders')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.waitForLoadState('networkidle')];
                    case 2:
                        _c.sent();
                        createButton = page.getByRole('button', { name: /create|new.*work.*order/i });
                        return [4 /*yield*/, createButton.click()];
                    case 3:
                        _c.sent();
                        // Wait for form
                        return [4 /*yield*/, page.waitForSelector('form', { timeout: 5000 })];
                    case 4:
                        // Wait for form
                        _c.sent();
                        customerSearch = page.getByPlaceholder(/search customers/i);
                        return [4 /*yield*/, customerSearch.fill('Test Customer')];
                    case 5:
                        _c.sent();
                        cancelButton = page.getByRole('button', { name: /cancel/i });
                        return [4 /*yield*/, cancelButton.click()];
                    case 6:
                        _c.sent();
                        // Should return to work orders list
                        return [4 /*yield*/, page.waitForURL(/work-orders/, { timeout: 5000 })];
                    case 7:
                        // Should return to work orders list
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
