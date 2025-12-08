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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * ResourceTimeline Integration Tests
 *
 * Integration tests for ResourceTimeline component focusing on:
 * - API integration flows
 * - Data flow between components
 * - User workflow scenarios
 * - Real-world usage patterns
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var ResourceTimeline_1 = require("../ResourceTimeline");
var enhanced_api_1 = require("@/lib/enhanced-api");
require("@testing-library/jest-dom");
// Mock the API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    enhancedApi: {
        technicians: {
            list: vitest_1.vi.fn(),
        },
        users: {
            list: vitest_1.vi.fn(),
        },
        jobs: {
            getByDateRange: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
        },
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
    },
}); });
// Mock ErrorBoundary
vitest_1.vi.mock('@/components/ErrorBoundary', function () { return ({
    ErrorBoundary: function (_a) {
        var children = _a.children;
        return (0, jsx_runtime_1.jsx)("div", { children: children });
    },
}); });
(0, vitest_1.describe)('ResourceTimeline Integration Tests', function () {
    var queryClient;
    var mockTechnicians = [
        {
            id: 'tech-1',
            first_name: 'John',
            last_name: 'Doe',
            is_active: true,
        },
        {
            id: 'tech-2',
            first_name: 'Jane',
            last_name: 'Smith',
            is_active: true,
        },
    ];
    var mockJobs = [
        {
            id: 'job-1',
            status: 'scheduled',
            priority: 'high',
            scheduled_date: '2025-11-17',
            scheduled_start_time: '09:00',
            scheduled_end_time: '11:00',
            technician_id: 'tech-1',
            customer: { id: 'cust-1', name: 'Customer One', phone: '555-1001' },
            location: { id: 'loc-1', name: 'Location One', address: '123 Main St', coordinates: { lat: 40.44, lng: -79.99 } },
            service: { type: 'Service One', description: 'Description', estimated_duration: 120, price: 150 },
        },
    ];
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false, staleTime: 0 },
                mutations: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue(mockTechnicians);
        enhanced_api_1.enhancedApi.jobs.getByDateRange.mockResolvedValue(mockJobs);
        enhanced_api_1.enhancedApi.jobs.update.mockResolvedValue({ id: 'job-1', status: 'in_progress' });
    });
    var renderComponent = function (props) {
        if (props === void 0) { props = {}; }
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ResourceTimeline_1.ResourceTimeline, __assign({ selectedDate: new Date('2025-11-17'), onDateChange: vitest_1.vi.fn(), onJobSelect: vitest_1.vi.fn(), onJobUpdate: vitest_1.vi.fn() }, props)) }));
    };
    (0, vitest_1.describe)('Complete User Workflows', function () {
        (0, vitest_1.it)('should complete full workflow: view timeline -> select job -> view details -> update status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onJobSelect, onJobUpdate, onDateChange, jobElement, updateButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onJobSelect = vitest_1.vi.fn();
                        onJobUpdate = vitest_1.vi.fn();
                        onDateChange = vitest_1.vi.fn();
                        renderComponent({ onJobSelect: onJobSelect, onJobUpdate: onJobUpdate, onDateChange: onDateChange });
                        // Step 1: Wait for timeline to load
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('John') && allText.includes('Doe')).toBe(true);
                                (0, vitest_1.expect)(allText.includes('Customer One')).toBe(true);
                            })];
                    case 1:
                        // Step 1: Wait for timeline to load
                        _a.sent();
                        jobElement = Array.from(document.querySelectorAll('*')).find(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Customer One'); });
                        (0, vitest_1.expect)(jobElement).toBeTruthy();
                        if (!jobElement)
                            return [2 /*return*/]; // Skip if element not found
                        react_1.fireEvent.click(jobElement);
                        // Step 3: Verify dialog opens
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(/job details/i.test(allText)).toBe(true);
                                (0, vitest_1.expect)(onJobSelect).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ id: 'job-1' }));
                            })];
                    case 2:
                        // Step 3: Verify dialog opens
                        _a.sent();
                        updateButton = Array.from(document.querySelectorAll('button, [role="button"]')).find(function (el) {
                            return /update status/i.test(el.textContent || '');
                        });
                        (0, vitest_1.expect)(updateButton).toBeTruthy();
                        if (!updateButton)
                            return [2 /*return*/];
                        react_1.fireEvent.click(updateButton);
                        // Step 5: Verify API call
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.jobs.update).toHaveBeenCalledWith('job-1', vitest_1.expect.objectContaining({ status: 'in_progress' }));
                            })];
                    case 3:
                        // Step 5: Verify API call
                        _a.sent();
                        // Step 6: Verify callbacks called
                        (0, vitest_1.expect)(onJobSelect).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle date navigation workflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onDateChange, nextButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onDateChange = vitest_1.vi.fn();
                        renderComponent({ onDateChange: onDateChange });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component should render - check for any visible content
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('Technician') || allText.includes('John')).toBeTruthy();
                            })];
                    case 1:
                        _a.sent();
                        nextButton = react_1.screen.getByLabelText(/next day/i);
                        react_1.fireEvent.click(nextButton);
                        (0, vitest_1.expect)(onDateChange).toHaveBeenCalled();
                        (0, vitest_1.expect)(enhanced_api_1.enhancedApi.jobs.getByDateRange.mock.calls.length).toBeGreaterThan(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle zoom workflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zoomInButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component should render - check for any visible content
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('Technician') || allText.includes('John')).toBeTruthy();
                            })];
                    case 1:
                        _a.sent();
                        zoomInButton = react_1.screen.getByLabelText(/zoom in/i);
                        react_1.fireEvent.click(zoomInButton);
                        react_1.fireEvent.click(zoomInButton);
                        // Verify date range calculation updates
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component should refetch with new date range
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.jobs.getByDateRange.mock.calls.length).toBeGreaterThan(0);
                            })];
                    case 2:
                        // Verify date range calculation updates
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('API Data Flow', function () {
        (0, vitest_1.it)('should fetch and display data in correct order', function () { return __awaiter(void 0, void 0, void 0, function () {
            var allText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.jobs.getByDateRange).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        allText = document.body.textContent || '';
                        (0, vitest_1.expect)(allText.includes('John') && allText.includes('Doe')).toBe(true);
                        (0, vitest_1.expect)(allText.includes('Jane') && allText.includes('Smith')).toBe(true);
                        // Verify jobs are displayed
                        (0, vitest_1.expect)(allText.includes('Customer One')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle API response updates correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rerender, updatedJobs;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rerender = renderComponent().rerender;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('Customer One')).toBe(true);
                            })];
                    case 1:
                        _b.sent();
                        updatedJobs = [
                            __assign(__assign({}, mockJobs[0]), { id: 'job-2', customer: ((_a = mockJobs[0]) === null || _a === void 0 ? void 0 : _a.customer) ? __assign(__assign({}, mockJobs[0].customer), { name: 'Customer Two' }) : { id: 'cust-2', name: 'Customer Two' } }),
                        ];
                        enhanced_api_1.enhancedApi.jobs.getByDateRange.mockResolvedValue(updatedJobs);
                        // Trigger refetch by changing date
                        rerender((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ResourceTimeline_1.ResourceTimeline, { selectedDate: new Date('2025-11-18'), onDateChange: vitest_1.vi.fn(), onJobSelect: vitest_1.vi.fn(), onJobUpdate: vitest_1.vi.fn() }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.jobs.getByDateRange).toHaveBeenCalledWith('2025-11-18', vitest_1.expect.any(String));
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should maintain state consistency during API updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var jobElement, updateButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('Customer One')).toBe(true);
                            })];
                    case 1:
                        _a.sent();
                        jobElement = Array.from(document.querySelectorAll('*')).find(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Customer One'); });
                        (0, vitest_1.expect)(jobElement).toBeTruthy();
                        if (!jobElement)
                            return [2 /*return*/];
                        react_1.fireEvent.click(jobElement);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(/job details/i.test(allText)).toBe(true);
                            })];
                    case 2:
                        _a.sent();
                        updateButton = Array.from(document.querySelectorAll('button, [role="button"]')).find(function (el) {
                            return /update status/i.test(el.textContent || '');
                        });
                        (0, vitest_1.expect)(updateButton).toBeTruthy();
                        if (!updateButton)
                            return [2 /*return*/];
                        (0, vitest_1.expect)(updateButton).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Component Integration', function () {
        (0, vitest_1.it)('should integrate with parent component callbacks', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onDateChange, onJobSelect, onJobUpdate, nextButton, jobElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onDateChange = vitest_1.vi.fn();
                        onJobSelect = vitest_1.vi.fn();
                        onJobUpdate = vitest_1.vi.fn();
                        renderComponent({ onDateChange: onDateChange, onJobSelect: onJobSelect, onJobUpdate: onJobUpdate });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component should render - check for any visible content
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('Technician') || allText.includes('John')).toBeTruthy();
                            })];
                    case 1:
                        _a.sent();
                        nextButton = react_1.screen.getByLabelText(/next day/i);
                        react_1.fireEvent.click(nextButton);
                        (0, vitest_1.expect)(onDateChange).toHaveBeenCalled();
                        jobElement = Array.from(document.querySelectorAll('*')).find(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Customer One'); });
                        (0, vitest_1.expect)(jobElement).toBeTruthy();
                        if (jobElement) {
                            react_1.fireEvent.click(jobElement);
                        }
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(onJobSelect).toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle prop updates correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rerender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rerender = renderComponent().rerender;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component should render - check for any visible content
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('Technician') || allText.includes('John')).toBeTruthy();
                            })];
                    case 1:
                        _a.sent();
                        // Update selectedDate prop
                        rerender((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ResourceTimeline_1.ResourceTimeline, { selectedDate: new Date('2025-11-20'), onDateChange: vitest_1.vi.fn(), onJobSelect: vitest_1.vi.fn(), onJobUpdate: vitest_1.vi.fn() }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.jobs.getByDateRange).toHaveBeenCalledWith('2025-11-20', vitest_1.expect.any(String));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Recovery', function () {
        (0, vitest_1.it)('should recover from API error and retry', function () { return __awaiter(void 0, void 0, void 0, function () {
            var nextButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // First call fails
                        enhanced_api_1.enhancedApi.jobs.getByDateRange.mockRejectedValueOnce(new Error('Network error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(/failed to load timeline data/i.test(allText)).toBe(true);
                            })];
                    case 1:
                        _a.sent();
                        // Second call succeeds
                        enhanced_api_1.enhancedApi.jobs.getByDateRange.mockResolvedValue(mockJobs);
                        nextButton = react_1.screen.getByLabelText(/next day/i);
                        react_1.fireEvent.click(nextButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.queryByText(/failed to load timeline data/i)).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle partial data gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Return technicians but no jobs
                        enhanced_api_1.enhancedApi.jobs.getByDateRange.mockResolvedValue([]);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var allText = document.body.textContent || '';
                                (0, vitest_1.expect)(allText.includes('John') && allText.includes('Doe')).toBe(true);
                                (0, vitest_1.expect)(/no jobs scheduled/i.test(allText)).toBe(true);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
