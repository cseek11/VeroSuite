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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var WorkOrderForm_1 = __importDefault(require("../WorkOrderForm"));
var enhanced_api_1 = require("@/lib/enhanced-api");
// Mock enhancedApi
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    enhancedApi: {
        technicians: {
            list: vitest_1.vi.fn(),
        },
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        debug: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
    },
}); });
var createTestQueryClient = function () {
    return new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });
};
var TestWrapper = function (_a) {
    var children = _a.children;
    var queryClient = createTestQueryClient();
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }) }));
};
(0, vitest_1.describe)('WorkOrderForm - Technicians Loading', function () {
    var mockOnSubmit = vitest_1.vi.fn();
    var mockOnCancel = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Technicians API Call', function () {
        (0, vitest_1.it)('should call technicians.list() on mount', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue([
                            { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                        ]);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle successful technicians load', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockTechnicians, technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockTechnicians = [
                            { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                            { id: 'tech-2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
                        ];
                        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue(mockTechnicians);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        (0, vitest_1.expect)(technicianSelect).toBeInTheDocument();
                        (0, vitest_1.expect)(technicianSelect).not.toBeDisabled();
                        // Check that technicians are available in dropdown
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(technicianSelect).not.toHaveTextContent(/loading technicians/i);
                            })];
                    case 2:
                        // Check that technicians are available in dropdown
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle API error gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleError, technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleError = vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { });
                        enhanced_api_1.enhancedApi.technicians.list.mockRejectedValue(new Error('Failed to fetch technicians'));
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(technicianSelect).not.toHaveTextContent(/loading technicians/i);
                            })];
                    case 2:
                        _a.sent();
                        consoleError.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle empty technicians array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue([]);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(technicianSelect).not.toHaveTextContent(/loading technicians/i);
                                (0, vitest_1.expect)(technicianSelect).toHaveTextContent(/select technician/i);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle paginated response format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockPaginatedResponse, technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPaginatedResponse = {
                            data: [
                                { id: 'tech-1', first_name: 'John', last_name: 'Doe' },
                            ],
                            meta: { total: 1, page: 1, limit: 20 },
                        };
                        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue(mockPaginatedResponse);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(technicianSelect).not.toHaveTextContent(/loading technicians/i);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle 404 error (missing version prefix bug)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Cannot GET /api/technicians');
                        enhanced_api_1.enhancedApi.technicians.list.mockRejectedValue(error);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(technicianSelect).not.toHaveTextContent(/loading technicians/i);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Dropdown Population', function () {
        (0, vitest_1.it)('should populate dropdown with technician names', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockTechnicians, technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockTechnicians = [
                            { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                            { id: 'tech-2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
                        ];
                        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue(mockTechnicians);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Should have options for technicians
                                var options = Array.from(technicianSelect.options);
                                (0, vitest_1.expect)(options.length).toBeGreaterThan(1); // More than just "Select technician"
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show loading state while fetching', function () {
            enhanced_api_1.enhancedApi.technicians.list.mockImplementation(function () { return new Promise(function () { }); } // Never resolves
            );
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
            var technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
            (0, vitest_1.expect)(technicianSelect).toBeDisabled();
            (0, vitest_1.expect)(technicianSelect).toHaveTextContent(/loading technicians/i);
        });
    });
});
