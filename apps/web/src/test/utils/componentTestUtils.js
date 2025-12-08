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
exports.waitForElementToBeHidden = exports.waitForElementToBeVisible = exports.isElementVisible = exports.getAllTextContent = exports.mockMatchMedia = exports.mockResizeObserver = exports.mockIntersectionObserver = exports.restoreWindowLocation = exports.mockWindowLocation = exports.createMockClickEvent = exports.createMockFormEvent = exports.createMockChangeEvent = exports.createMockEvent = exports.waitForAsyncUpdate = exports.waitForComponentUpdate = exports.simulateUserInteraction = exports.createMockFormData = exports.renderWithAllProviders = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var vitest_1 = require("vitest");
var testHelpers_1 = require("./testHelpers");
/**
 * Render component with all providers (QueryClient, Router, etc.)
 */
var renderWithAllProviders = function (ui, options) {
    var queryClient = (options === null || options === void 0 ? void 0 : options.queryClient) || (0, testHelpers_1.createMockQueryClient)();
    var AllProviders = function (_a) {
        var children = _a.children;
        return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }) }));
    };
    return (0, react_1.render)(ui, __assign({ wrapper: AllProviders }, options === null || options === void 0 ? void 0 : options.renderOptions));
};
exports.renderWithAllProviders = renderWithAllProviders;
/**
 * Create mock form data
 */
var createMockFormData = function (overrides) {
    var formData = new FormData();
    Object.entries(overrides || {}).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });
    return formData;
};
exports.createMockFormData = createMockFormData;
/**
 * Simulate user interaction helpers
 */
exports.simulateUserInteraction = {
    /**
     * Type text into an input field
     */
    type: function (element, text) { return __awaiter(void 0, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            input = element;
            input.focus();
            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            return [2 /*return*/];
        });
    }); },
    /**
     * Click an element
     */
    click: function (element) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return [2 /*return*/];
        });
    }); },
    /**
     * Select an option from a select element
     */
    select: function (element, value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return [2 /*return*/];
        });
    }); },
    /**
     * Check/uncheck a checkbox
     */
    toggleCheckbox: function (element, checked) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            element.checked = checked;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return [2 /*return*/];
        });
    }); },
    /**
     * Submit a form
     */
    submitForm: function (form) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            return [2 /*return*/];
        });
    }); },
    /**
     * Press a key
     */
    pressKey: function (element, key, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            element.dispatchEvent(new KeyboardEvent('keydown', __assign({ key: key, bubbles: true }, options)));
            element.dispatchEvent(new KeyboardEvent('keyup', __assign({ key: key, bubbles: true }, options)));
            return [2 /*return*/];
        });
    }); },
};
/**
 * Wait for component update
 */
var waitForComponentUpdate = function () {
    return new Promise(function (resolve) {
        setTimeout(resolve, 0);
    });
};
exports.waitForComponentUpdate = waitForComponentUpdate;
/**
 * Wait for async state update
 */
var waitForAsyncUpdate = function (timeout) {
    if (timeout === void 0) { timeout = 1000; }
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};
exports.waitForAsyncUpdate = waitForAsyncUpdate;
/**
 * Create mock event
 */
var createMockEvent = function (type, options) {
    return new Event(type, __assign({ bubbles: true, cancelable: true }, options));
};
exports.createMockEvent = createMockEvent;
/**
 * Create mock change event
 */
var createMockChangeEvent = function (target) {
    return {
        target: target,
        currentTarget: target,
        preventDefault: vitest_1.vi.fn(),
        stopPropagation: vitest_1.vi.fn(),
    };
};
exports.createMockChangeEvent = createMockChangeEvent;
/**
 * Create mock form event
 */
var createMockFormEvent = function (target) {
    return {
        target: target || {},
        currentTarget: target || {},
        preventDefault: vitest_1.vi.fn(),
        stopPropagation: vitest_1.vi.fn(),
    };
};
exports.createMockFormEvent = createMockFormEvent;
/**
 * Create mock click event
 */
var createMockClickEvent = function (target) {
    return {
        target: target || {},
        currentTarget: target || {},
        preventDefault: vitest_1.vi.fn(),
        stopPropagation: vitest_1.vi.fn(),
    };
};
exports.createMockClickEvent = createMockClickEvent;
/**
 * Mock window.location
 */
var mockWindowLocation = function (url) {
    delete window.location;
    window.location = new URL(url);
};
exports.mockWindowLocation = mockWindowLocation;
/**
 * Restore window.location
 */
var restoreWindowLocation = function (originalLocation) {
    // Note: window.location is read-only, so we can't actually restore it
    // This is a test utility that documents the intent
    // In actual tests, use Object.defineProperty to mock location
    if (typeof window !== 'undefined' && 'location' in window) {
        // Cannot actually restore, but this documents the pattern
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
            configurable: true
        });
    }
};
exports.restoreWindowLocation = restoreWindowLocation;
/**
 * Mock IntersectionObserver
 */
var mockIntersectionObserver = function () {
    var mockIntersectionObserver = vitest_1.vi.fn();
    mockIntersectionObserver.mockReturnValue({
        observe: vitest_1.vi.fn(),
        unobserve: vitest_1.vi.fn(),
        disconnect: vitest_1.vi.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;
    return mockIntersectionObserver;
};
exports.mockIntersectionObserver = mockIntersectionObserver;
/**
 * Mock ResizeObserver
 */
var mockResizeObserver = function () {
    var mockResizeObserver = vitest_1.vi.fn();
    mockResizeObserver.mockReturnValue({
        observe: vitest_1.vi.fn(),
        unobserve: vitest_1.vi.fn(),
        disconnect: vitest_1.vi.fn(),
    });
    window.ResizeObserver = mockResizeObserver;
    return mockResizeObserver;
};
exports.mockResizeObserver = mockResizeObserver;
/**
 * Mock matchMedia
 */
var mockMatchMedia = function (matches) {
    if (matches === void 0) { matches = false; }
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vitest_1.vi.fn().mockImplementation(function (query) { return ({
            matches: matches,
            media: query,
            onchange: null,
            addListener: vitest_1.vi.fn(),
            removeListener: vitest_1.vi.fn(),
            addEventListener: vitest_1.vi.fn(),
            removeEventListener: vitest_1.vi.fn(),
            dispatchEvent: vitest_1.vi.fn(),
        }); }),
    });
};
exports.mockMatchMedia = mockMatchMedia;
/**
 * Get all text content from a container
 */
var getAllTextContent = function (container) {
    return container.textContent || '';
};
exports.getAllTextContent = getAllTextContent;
/**
 * Check if element is visible
 */
var isElementVisible = function (element) {
    var style = window.getComputedStyle(element);
    return (style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0);
};
exports.isElementVisible = isElementVisible;
/**
 * Wait for element to be visible
 */
var waitForElementToBeVisible = function (element_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([element_1], args_1, true), void 0, function (element, timeout) {
        var startTime;
        if (timeout === void 0) { timeout = 5000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(!(0, exports.isElementVisible)(element) && Date.now() - startTime < timeout)) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    if (!(0, exports.isElementVisible)(element)) {
                        throw new Error('Element did not become visible within timeout');
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.waitForElementToBeVisible = waitForElementToBeVisible;
/**
 * Wait for element to be hidden
 */
var waitForElementToBeHidden = function (element_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([element_1], args_1, true), void 0, function (element, timeout) {
        var startTime;
        if (timeout === void 0) { timeout = 5000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    if (!((0, exports.isElementVisible)(element) && Date.now() - startTime < timeout)) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    if ((0, exports.isElementVisible)(element)) {
                        throw new Error('Element did not become hidden within timeout');
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.waitForElementToBeHidden = waitForElementToBeHidden;
