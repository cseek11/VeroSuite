"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var playwright_1 = require("playwright");
(0, vitest_1.describe)('Customer Management E2E Tests', function () {
    var browser;
    var page;
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch({ headless: false })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    // Navigate to the application
                    return [4 /*yield*/, page.goto('http://localhost:5173')];
                case 3:
                    // Navigate to the application
                    _a.sent();
                    // Wait for the app to load
                    return [4 /*yield*/, page.waitForSelector('[data-testid="app-container"]')];
                case 4:
                    // Wait for the app to load
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('Customer List View', function () {
        (0, vitest_1.it)('should display customer list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerList, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-list"]')];
                    case 3:
                        customerList = _b.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, customerList.isVisible()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter customers by search', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput, customerRows, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-search"]')];
                    case 2:
                        _a.sent();
                        searchInput = page.locator('[data-testid="customer-search"]');
                        return [4 /*yield*/, searchInput.fill('John')];
                    case 3:
                        _a.sent();
                        // Wait for filtered results
                        return [4 /*yield*/, page.waitForTimeout(500)];
                    case 4:
                        // Wait for filtered results
                        _a.sent();
                        customerRows = page.locator('[data-testid="customer-row"]');
                        return [4 /*yield*/, customerRows.count()];
                    case 5:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should sort customers by name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerNames, sortedNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _a.sent();
                        // Click on name column header to sort
                        return [4 /*yield*/, page.click('[data-testid="sort-name"]')];
                    case 3:
                        // Click on name column header to sort
                        _a.sent();
                        // Wait for sorting to complete
                        return [4 /*yield*/, page.waitForTimeout(500)];
                    case 4:
                        // Wait for sorting to complete
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-name"]').allTextContents()];
                    case 5:
                        customerNames = _a.sent();
                        sortedNames = __spreadArray([], customerNames, true).sort();
                        (0, vitest_1.expect)(customerNames).toEqual(sortedNames);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Customer Creation', function () {
        (0, vitest_1.it)('should create a new customer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var successMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _a.sent();
                        // Click add customer button
                        return [4 /*yield*/, page.click('[data-testid="add-customer-btn"]')];
                    case 3:
                        // Click add customer button
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-form"]')];
                    case 4:
                        _a.sent();
                        // Fill out the form
                        return [4 /*yield*/, page.fill('[data-testid="first-name-input"]', 'Test')];
                    case 5:
                        // Fill out the form
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="last-name-input"]', 'Customer')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="email-input"]', 'test@example.com')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="phone-input"]', '555-123-4567')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="address-input"]', '123 Test St')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="city-input"]', 'Test City')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="state-input"]', 'CA')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="zip-input"]', '12345')];
                    case 12:
                        _a.sent();
                        // Submit the form
                        return [4 /*yield*/, page.click('[data-testid="save-customer-btn"]')];
                    case 13:
                        // Submit the form
                        _a.sent();
                        // Wait for success message
                        return [4 /*yield*/, page.waitForSelector('[data-testid="success-message"]')];
                    case 14:
                        // Wait for success message
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="success-message"]').textContent()];
                    case 15:
                        successMessage = _a.sent();
                        (0, vitest_1.expect)(successMessage).toContain('Customer created successfully');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show validation errors for invalid data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _a.sent();
                        // Click add customer button
                        return [4 /*yield*/, page.click('[data-testid="add-customer-btn"]')];
                    case 3:
                        // Click add customer button
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-form"]')];
                    case 4:
                        _a.sent();
                        // Try to submit empty form
                        return [4 /*yield*/, page.click('[data-testid="save-customer-btn"]')];
                    case 5:
                        // Try to submit empty form
                        _a.sent();
                        // Check for validation errors
                        return [4 /*yield*/, page.waitForSelector('[data-testid="validation-error"]')];
                    case 6:
                        // Check for validation errors
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="validation-error"]').allTextContents()];
                    case 7:
                        errors = _a.sent();
                        (0, vitest_1.expect)(errors.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Customer Editing', function () {
        (0, vitest_1.it)('should edit an existing customer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var successMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _a.sent();
                        // Click on first customer edit button
                        return [4 /*yield*/, page.click('[data-testid="edit-customer-btn"]:first-child')];
                    case 3:
                        // Click on first customer edit button
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-form"]')];
                    case 4:
                        _a.sent();
                        // Update the first name
                        return [4 /*yield*/, page.fill('[data-testid="first-name-input"]', 'Updated')];
                    case 5:
                        // Update the first name
                        _a.sent();
                        // Submit the form
                        return [4 /*yield*/, page.click('[data-testid="save-customer-btn"]')];
                    case 6:
                        // Submit the form
                        _a.sent();
                        // Wait for success message
                        return [4 /*yield*/, page.waitForSelector('[data-testid="success-message"]')];
                    case 7:
                        // Wait for success message
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="success-message"]').textContent()];
                    case 8:
                        successMessage = _a.sent();
                        (0, vitest_1.expect)(successMessage).toContain('Customer updated successfully');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Customer Deletion', function () {
        (0, vitest_1.it)('should delete a customer with confirmation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var initialCount, finalCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-row"]').count()];
                    case 3:
                        initialCount = _a.sent();
                        // Click on first customer delete button
                        return [4 /*yield*/, page.click('[data-testid="delete-customer-btn"]:first-child')];
                    case 4:
                        // Click on first customer delete button
                        _a.sent();
                        // Confirm deletion in modal
                        return [4 /*yield*/, page.waitForSelector('[data-testid="confirm-delete-btn"]')];
                    case 5:
                        // Confirm deletion in modal
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="confirm-delete-btn"]')];
                    case 6:
                        _a.sent();
                        // Wait for success message
                        return [4 /*yield*/, page.waitForSelector('[data-testid="success-message"]')];
                    case 7:
                        // Wait for success message
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-row"]').count()];
                    case 8:
                        finalCount = _a.sent();
                        (0, vitest_1.expect)(finalCount).toBe(initialCount - 1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should cancel deletion when cancel is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var initialCount, finalCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-row"]').count()];
                    case 3:
                        initialCount = _a.sent();
                        // Click on first customer delete button
                        return [4 /*yield*/, page.click('[data-testid="delete-customer-btn"]:first-child')];
                    case 4:
                        // Click on first customer delete button
                        _a.sent();
                        // Cancel deletion in modal
                        return [4 /*yield*/, page.waitForSelector('[data-testid="cancel-delete-btn"]')];
                    case 5:
                        // Cancel deletion in modal
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="cancel-delete-btn"]')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-row"]').count()];
                    case 7:
                        finalCount = _a.sent();
                        (0, vitest_1.expect)(finalCount).toBe(initialCount);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Customer Details View', function () {
        (0, vitest_1.it)('should display customer details', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerDetails, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _e.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _e.sent();
                        // Click on first customer to view details
                        return [4 /*yield*/, page.click('[data-testid="customer-row"]:first-child')];
                    case 3:
                        // Click on first customer to view details
                        _e.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-details"]')];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-details"]')];
                    case 5:
                        customerDetails = _e.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, customerDetails.isVisible()];
                    case 6:
                        _a.apply(void 0, [_e.sent()]).toBe(true);
                        // Check if customer information is displayed
                        _b = vitest_1.expect;
                        return [4 /*yield*/, page.locator('[data-testid="customer-name"]').isVisible()];
                    case 7:
                        // Check if customer information is displayed
                        _b.apply(void 0, [_e.sent()]).toBe(true);
                        _c = vitest_1.expect;
                        return [4 /*yield*/, page.locator('[data-testid="customer-email"]').isVisible()];
                    case 8:
                        _c.apply(void 0, [_e.sent()]).toBe(true);
                        _d = vitest_1.expect;
                        return [4 /*yield*/, page.locator('[data-testid="customer-phone"]').isVisible()];
                    case 9:
                        _d.apply(void 0, [_e.sent()]).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display customer service history', function () { return __awaiter(void 0, void 0, void 0, function () {
            var serviceHistory, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Navigate to customers page
                    return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 1:
                        // Navigate to customers page
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _b.sent();
                        // Click on first customer to view details
                        return [4 /*yield*/, page.click('[data-testid="customer-row"]:first-child')];
                    case 3:
                        // Click on first customer to view details
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-details"]')];
                    case 4:
                        _b.sent();
                        // Click on service history tab
                        return [4 /*yield*/, page.click('[data-testid="service-history-tab"]')];
                    case 5:
                        // Click on service history tab
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="service-history"]')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, page.locator('[data-testid="service-history"]')];
                    case 7:
                        serviceHistory = _b.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, serviceHistory.isVisible()];
                    case 8:
                        _a.apply(void 0, [_b.sent()]).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Responsive Design', function () {
        (0, vitest_1.it)('should work on mobile viewport', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerList, _a, mobileNav, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Set mobile viewport
                    return [4 /*yield*/, page.setViewportSize({ width: 375, height: 667 })];
                    case 1:
                        // Set mobile viewport
                        _c.sent();
                        // Navigate to customers page
                        return [4 /*yield*/, page.click('[data-testid="nav-customers"]')];
                    case 2:
                        // Navigate to customers page
                        _c.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.locator('[data-testid="customer-list"]')];
                    case 4:
                        customerList = _c.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, customerList.isVisible()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true);
                        return [4 /*yield*/, page.locator('[data-testid="mobile-nav"]')];
                    case 6:
                        mobileNav = _c.sent();
                        _b = vitest_1.expect;
                        return [4 /*yield*/, mobileNav.isVisible()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
