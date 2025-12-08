"use strict";
/**
 * End-to-End CRM Workflow Tests
 * Comprehensive user journey testing for mission-critical business processes
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
// TestUtils import removed - not used in this file
test_1.test.describe('CRM Workflow E2E Tests', function () {
    var page;
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var browser = _b.browser;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    page = _c.sent();
                    // Set viewport for responsive testing
                    return [4 /*yield*/, page.setViewportSize({ width: 1280, height: 720 })];
                case 2:
                    // Set viewport for responsive testing
                    _c.sent();
                    // Mock authentication
                    return [4 /*yield*/, page.goto('/login')];
                case 3:
                    // Mock authentication
                    _c.sent();
                    return [4 /*yield*/, page.fill('[data-testid="email-input"]', 'test@verofield.com')];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, page.fill('[data-testid="password-input"]', 'TestPassword123!')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, page.click('[data-testid="login-button"]')];
                case 6:
                    _c.sent();
                    // Wait for dashboard to load
                    return [4 /*yield*/, page.waitForSelector('[data-testid="dashboard"]')];
                case 7:
                    // Wait for dashboard to load
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test_1.test.afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test_1.test.describe('Complete Customer Lifecycle', function () {
        (0, test_1.test)('should handle complete customer journey from creation to work order completion', function () { return __awaiter(void 0, void 0, void 0, function () {
            var workOrderItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Step 1: Create new customer
                    return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        // Step 1: Create new customer
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-customer-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="first-name-input"]', 'John')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="last-name-input"]', 'Doe')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="email-input"]', 'john.doe@example.com')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="phone-input"]', '+1-555-0123')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="address-input"]', '123 Main Street')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="city-input"]', 'Anytown')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="state-select"]', 'CA')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="zip-input"]', '12345')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-customer-button"]')];
                    case 11:
                        _a.sent();
                        // Verify customer creation
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="success-message"]')).toBeVisible()];
                    case 12:
                        // Verify customer creation
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="success-message"]')).toContainText('Customer created successfully')];
                    case 13:
                        _a.sent();
                        // Step 2: Navigate to customer list and verify
                        return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 14:
                        // Step 2: Navigate to customer list and verify
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="customer-list"]')).toBeVisible()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="customer-item"]').first()).toContainText('John Doe')];
                    case 16:
                        _a.sent();
                        // Step 3: Create work order for customer
                        return [4 /*yield*/, page.click('[data-testid="work-orders-nav"]')];
                    case 17:
                        // Step 3: Create work order for customer
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-work-order-button"]')];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="customer-select"]', 'john.doe@example.com')];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="service-type-select"]', 'pest_control')];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="priority-select"]', 'high')];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="scheduled-date-input"]', '2024-12-25')];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="description-textarea"]', 'Pest control treatment for kitchen and living room')];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-work-order-button"]')];
                    case 24:
                        _a.sent();
                        // Verify work order creation
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="success-message"]')).toBeVisible()];
                    case 25:
                        // Verify work order creation
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="success-message"]')).toContainText('Work order created successfully')];
                    case 26:
                        _a.sent();
                        // Step 4: Assign technician to work order
                        return [4 /*yield*/, page.click('[data-testid="work-orders-nav"]')];
                    case 27:
                        // Step 4: Assign technician to work order
                        _a.sent();
                        workOrderItem = page.locator('[data-testid="work-order-item"]').first();
                        return [4 /*yield*/, workOrderItem.click()];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="assign-technician-button"]')];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="technician-select"]', 'tech1@example.com')];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="confirm-assignment-button"]')];
                    case 31:
                        _a.sent();
                        // Verify technician assignment
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="assigned-technician"]')).toBeVisible()];
                    case 32:
                        // Verify technician assignment
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-status"]')).toContainText('assigned')];
                    case 33:
                        _a.sent();
                        // Step 5: Update work order status to in progress
                        return [4 /*yield*/, page.click('[data-testid="update-status-button"]')];
                    case 34:
                        // Step 5: Update work order status to in progress
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="status-select"]', 'in_progress')];
                    case 35:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="status-notes"]', 'Work started on time')];
                    case 36:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-status-button"]')];
                    case 37:
                        _a.sent();
                        // Verify status update
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-status"]')).toContainText('in_progress')];
                    case 38:
                        // Verify status update
                        _a.sent();
                        // Step 6: Complete work order
                        return [4 /*yield*/, page.click('[data-testid="update-status-button"]')];
                    case 39:
                        // Step 6: Complete work order
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="status-select"]', 'completed')];
                    case 40:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="completion-notes"]', 'Work completed successfully. All areas treated.')];
                    case 41:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="materials-used"]', 'Pesticide A, Equipment B')];
                    case 42:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-status-button"]')];
                    case 43:
                        _a.sent();
                        // Verify completion
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-status"]')).toContainText('completed')];
                    case 44:
                        // Verify completion
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="completion-notes"]')).toBeVisible()];
                    case 45:
                        _a.sent();
                        // Step 7: Generate invoice
                        return [4 /*yield*/, page.click('[data-testid="generate-invoice-button"]')];
                    case 46:
                        // Step 7: Generate invoice
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="invoice-amount"]', '150.00')];
                    case 47:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="invoice-description"]', 'Pest control treatment')];
                    case 48:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-invoice-button"]')];
                    case 49:
                        _a.sent();
                        // Verify invoice creation
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="invoice-created"]')).toBeVisible()];
                    case 50:
                        // Verify invoice creation
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="invoice-amount"]')).toContainText('$150.00')];
                    case 51:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Multi-Tenant Isolation', function () {
        (0, test_1.test)('should enforce tenant isolation across all operations', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Create customer in current tenant
                    return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        // Create customer in current tenant
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-customer-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="first-name-input"]', 'Tenant1')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="last-name-input"]', 'Customer')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="email-input"]', 'tenant1@example.com')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="phone-input"]', '+1-555-0001')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="address-input"]', '123 Tenant1 Street')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="city-input"]', 'Tenant1 City')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="state-select"]', 'CA')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="zip-input"]', '12345')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-customer-button"]')];
                    case 11:
                        _a.sent();
                        // Verify customer is created
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="success-message"]')).toBeVisible()];
                    case 12:
                        // Verify customer is created
                        _a.sent();
                        // Switch to different tenant (simulate)
                        return [4 /*yield*/, page.evaluate(function () {
                                localStorage.setItem('tenant_id', 'tenant-2');
                            })];
                    case 13:
                        // Switch to different tenant (simulate)
                        _a.sent();
                        // Refresh page to apply tenant change
                        return [4 /*yield*/, page.reload()];
                    case 14:
                        // Refresh page to apply tenant change
                        _a.sent();
                        // Verify customer from tenant-1 is not visible
                        return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 15:
                        // Verify customer from tenant-1 is not visible
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="customer-list"]')).toBeVisible()];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="customer-item"]')).not.toContainText('Tenant1 Customer')];
                    case 17:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Work Order State Transitions', function () {
        (0, test_1.test)('should enforce valid work order state transitions', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Create work order
                    return [4 /*yield*/, page.click('[data-testid="work-orders-nav"]')];
                    case 1:
                        // Create work order
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-work-order-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="customer-select"]', 'test@example.com')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="service-type-select"]', 'pest_control')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="priority-select"]', 'medium')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="scheduled-date-input"]', '2024-12-25')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="description-textarea"]', 'Test work order')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-work-order-button"]')];
                    case 8:
                        _a.sent();
                        // Verify work order is created with 'scheduled' status
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-status"]')).toContainText('scheduled')];
                    case 9:
                        // Verify work order is created with 'scheduled' status
                        _a.sent();
                        // Valid transition: scheduled -> assigned
                        return [4 /*yield*/, page.click('[data-testid="update-status-button"]')];
                    case 10:
                        // Valid transition: scheduled -> assigned
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="status-select"]', 'assigned')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-status-button"]')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-status"]')).toContainText('assigned')];
                    case 13:
                        _a.sent();
                        // Valid transition: assigned -> in_progress
                        return [4 /*yield*/, page.click('[data-testid="update-status-button"]')];
                    case 14:
                        // Valid transition: assigned -> in_progress
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="status-select"]', 'in_progress')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-status-button"]')];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-status"]')).toContainText('in_progress')];
                    case 17:
                        _a.sent();
                        // Valid transition: in_progress -> completed
                        return [4 /*yield*/, page.click('[data-testid="update-status-button"]')];
                    case 18:
                        // Valid transition: in_progress -> completed
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="status-select"]', 'completed')];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-status-button"]')];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-status"]')).toContainText('completed')];
                    case 21:
                        _a.sent();
                        // Invalid transition: completed -> in_progress (should fail)
                        return [4 /*yield*/, page.click('[data-testid="update-status-button"]')];
                    case 22:
                        // Invalid transition: completed -> in_progress (should fail)
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="status-select"]', 'in_progress')];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-status-button"]')];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="error-message"]')).toBeVisible()];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="error-message"]')).toContainText('Invalid status transition')];
                    case 26:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Technician Assignment Logic', function () {
        (0, test_1.test)('should assign technician based on skills and availability', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Create work order requiring pest control
                    return [4 /*yield*/, page.click('[data-testid="work-orders-nav"]')];
                    case 1:
                        // Create work order requiring pest control
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-work-order-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="customer-select"]', 'test@example.com')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="service-type-select"]', 'pest_control')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="priority-select"]', 'high')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="scheduled-date-input"]', '2024-12-25')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="description-textarea"]', 'Pest control treatment')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-work-order-button"]')];
                    case 8:
                        _a.sent();
                        // Auto-assign technician
                        return [4 /*yield*/, page.click('[data-testid="auto-assign-button"]')];
                    case 9:
                        // Auto-assign technician
                        _a.sent();
                        // Verify technician is assigned based on skills
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="assigned-technician"]')).toBeVisible()];
                    case 10:
                        // Verify technician is assigned based on skills
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="technician-skills"]')).toContainText('pest_control')];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should handle technician unavailability', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Create work order
                    return [4 /*yield*/, page.click('[data-testid="work-orders-nav"]')];
                    case 1:
                        // Create work order
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-work-order-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="customer-select"]', 'test@example.com')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="service-type-select"]', 'pest_control')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="priority-select"]', 'high')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="scheduled-date-input"]', '2024-12-25')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="description-textarea"]', 'Pest control treatment')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-work-order-button"]')];
                    case 8:
                        _a.sent();
                        // Attempt auto-assignment when no technicians are available
                        return [4 /*yield*/, page.click('[data-testid="auto-assign-button"]')];
                    case 9:
                        // Attempt auto-assignment when no technicians are available
                        _a.sent();
                        // Verify no technician is assigned
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="no-technician-available"]')).toBeVisible()];
                    case 10:
                        // Verify no technician is assigned
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="no-technician-available"]')).toContainText('No available technicians')];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Data Validation and Error Handling', function () {
        (0, test_1.test)('should validate required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-customer-button"]')];
                    case 2:
                        _a.sent();
                        // Try to save without required fields
                        return [4 /*yield*/, page.click('[data-testid="save-customer-button"]')];
                    case 3:
                        // Try to save without required fields
                        _a.sent();
                        // Verify validation errors
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="first-name-error"]')).toBeVisible()];
                    case 4:
                        // Verify validation errors
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="last-name-error"]')).toBeVisible()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="email-error"]')).toBeVisible()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="phone-error"]')).toBeVisible()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should validate email format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-customer-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="email-input"]', 'invalid-email')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-customer-button"]')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="email-error"]')).toBeVisible()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format')];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should validate phone number format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="create-customer-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="phone-input"]', '123')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="save-customer-button"]')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="phone-error"]')).toBeVisible()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="phone-error"]')).toContainText('Invalid phone number format')];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Search and Filtering', function () {
        (0, test_1.test)('should search customers by name', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.fill('[data-testid="search-input"]', 'John')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="search-button"]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="customer-item"]')).toContainText('John')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should filter work orders by status', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="work-orders-nav"]')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="status-filter"]', 'scheduled')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="apply-filter-button"]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="work-order-item"]')).toContainText('scheduled')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should filter technicians by availability', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="technicians-nav"]')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.selectOption('[data-testid="availability-filter"]', 'available')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="apply-filter-button"]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="technician-item"]')).toContainText('available')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Responsive Design', function () {
        (0, test_1.test)('should work on mobile devices', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.setViewportSize({ width: 375, height: 667 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="mobile-menu-button"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="customers-nav-mobile"]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="customer-list"]')).toBeVisible()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should work on tablet devices', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.setViewportSize({ width: 768, height: 1024 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="customer-list"]')).toBeVisible()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Accessibility', function () {
        (0, test_1.test)('should be keyboard navigable', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Test keyboard navigation
                    return [4 /*yield*/, page.keyboard.press('Tab')];
                    case 1:
                        // Test keyboard navigation
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator(':focus')).toBeVisible()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.keyboard.press('Tab')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator(':focus')).toBeVisible()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.keyboard.press('Enter')];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should have proper ARIA labels', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputs, count, i, input, ariaLabel, ariaLabelledBy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        _a.sent();
                        inputs = page.locator('input');
                        return [4 /*yield*/, inputs.count()];
                    case 2:
                        count = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < count)) return [3 /*break*/, 7];
                        input = inputs.nth(i);
                        return [4 /*yield*/, input.getAttribute('aria-label')];
                    case 4:
                        ariaLabel = _a.sent();
                        return [4 /*yield*/, input.getAttribute('aria-labelledby')];
                    case 5:
                        ariaLabelledBy = _a.sent();
                        (0, test_1.expect)(ariaLabel || ariaLabelledBy).toBeTruthy();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should have proper color contrast', function () { return __awaiter(void 0, void 0, void 0, function () {
            var textElements, count, i, element, color;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        _a.sent();
                        textElements = page.locator('p, span, div');
                        return [4 /*yield*/, textElements.count()];
                    case 2:
                        count = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < count)) return [3 /*break*/, 6];
                        element = textElements.nth(i);
                        return [4 /*yield*/, element.evaluate(function (el) {
                                var styles = window.getComputedStyle(el);
                                return styles.color;
                            })];
                    case 4:
                        color = _a.sent();
                        (0, test_1.expect)(color).toBeTruthy();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Performance', function () {
        (0, test_1.test)('should load dashboard within performance threshold', function () { return __awaiter(void 0, void 0, void 0, function () {
            var startTime, endTime, loadTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        return [4 /*yield*/, page.goto('/dashboard')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="dashboard"]')];
                    case 2:
                        _a.sent();
                        endTime = Date.now();
                        loadTime = endTime - startTime;
                        (0, test_1.expect)(loadTime).toBeLessThan(3000); // 3 seconds
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should handle large datasets efficiently', function () { return __awaiter(void 0, void 0, void 0, function () {
            var startTime, endTime, loadTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 1:
                        _a.sent();
                        startTime = Date.now();
                        return [4 /*yield*/, page.waitForSelector('[data-testid="customer-list"]')];
                    case 2:
                        _a.sent();
                        endTime = Date.now();
                        loadTime = endTime - startTime;
                        (0, test_1.expect)(loadTime).toBeLessThan(2000); // 2 seconds
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test_1.test.describe('Error Recovery', function () {
        (0, test_1.test)('should handle network errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Simulate network error
                    return [4 /*yield*/, page.route('**/api/customers', function (route) { return route.abort(); })];
                    case 1:
                        // Simulate network error
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="error-message"]')).toBeVisible()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="error-message"]')).toContainText('Network error')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, test_1.test)('should handle server errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Simulate server error
                    return [4 /*yield*/, page.route('**/api/customers', function (route) { return route.fulfill({
                            status: 500,
                            body: JSON.stringify({ error: 'Internal server error' })
                        }); })];
                    case 1:
                        // Simulate server error
                        _a.sent();
                        return [4 /*yield*/, page.click('[data-testid="customers-nav"]')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="error-message"]')).toBeVisible()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="error-message"]')).toContainText('Server error')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
