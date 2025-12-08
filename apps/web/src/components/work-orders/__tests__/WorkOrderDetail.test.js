"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * WorkOrderDetail Component Tests
 *
 * Tests for the WorkOrderDetail component including:
 * - Data display
 * - Edit mode
 * - Status updates
 * - Related data display
 * - Delete functionality
 * - Job creation
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var WorkOrderDetail_1 = __importDefault(require("../WorkOrderDetail"));
var testHelpers_1 = require("@/test/utils/testHelpers");
var work_orders_1 = require("@/types/work-orders");
// Mock hooks
vitest_1.vi.mock('@/hooks/useWorkOrders', function () { return ({
    useWorkOrder: vitest_1.vi.fn(),
    useUpdateWorkOrder: vitest_1.vi.fn(),
    useDeleteWorkOrder: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('@/hooks/useJobs', function () { return ({
    useCreateJob: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('@/hooks/useDialog', function () {
    var React = require('react');
    return {
        useDialog: vitest_1.vi.fn(function () { return ({
            showAlert: vitest_1.vi.fn().mockResolvedValue(undefined),
            showConfirm: vitest_1.vi.fn().mockResolvedValue(true),
            DialogComponents: function () { return React.createElement('div', { 'data-testid': 'dialog-components' }); }, // Return a component function
        }); }),
    };
});
// Mock WorkOrderStatusManager
vitest_1.vi.mock('../WorkOrderStatusManager', function () {
    var React = require('react');
    return {
        default: function (_a) {
            var workOrder = _a.workOrder, onStatusChange = _a.onStatusChange;
            // Use string literal for status to avoid import issues
            return React.createElement('div', { 'data-testid': 'work-order-status-manager' }, React.createElement('button', {
                onClick: function () { return onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange(workOrder, 'in_progress'); }
            }, 'Update Status'));
        },
    };
});
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
(0, vitest_1.describe)('WorkOrderDetail', function () {
    var mockWorkOrder = (0, testHelpers_1.createMockWorkOrder)({
        id: 'wo-1',
        work_order_number: 'WO-001',
        description: 'Test work order',
        status: work_orders_1.WorkOrderStatus.PENDING,
    });
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, useWorkOrder, useUpdateWorkOrder, useDeleteWorkOrder, useCreateJob;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.clearAllMocks();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/hooks/useWorkOrders')); })];
                case 1:
                    _a = _b.sent(), useWorkOrder = _a.useWorkOrder, useUpdateWorkOrder = _a.useUpdateWorkOrder, useDeleteWorkOrder = _a.useDeleteWorkOrder;
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/hooks/useJobs')); })];
                case 2:
                    useCreateJob = (_b.sent()).useCreateJob;
                    useWorkOrder.mockReturnValue({
                        data: mockWorkOrder,
                        isLoading: false,
                        error: null,
                        refetch: vitest_1.vi.fn(),
                    });
                    useUpdateWorkOrder.mockReturnValue({
                        mutateAsync: vitest_1.vi.fn().mockResolvedValue(mockWorkOrder),
                        isLoading: false,
                    });
                    useDeleteWorkOrder.mockReturnValue({
                        mutateAsync: vitest_1.vi.fn().mockResolvedValue(undefined),
                        isLoading: false,
                    });
                    useCreateJob.mockReturnValue({
                        mutateAsync: vitest_1.vi.fn().mockResolvedValue({ id: 'job-1' }),
                        isLoading: false,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render work order details', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderDetail_1.default, { workOrderId: "wo-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component displays "Work Order #WO-001"
                                (0, vitest_1.expect)(react_1.screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Test work order')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show loading state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var useWorkOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/hooks/useWorkOrders')); })];
                    case 1:
                        useWorkOrder = (_a.sent()).useWorkOrder;
                        useWorkOrder.mockReturnValue({
                            data: null,
                            isLoading: true,
                            error: null,
                            refetch: vitest_1.vi.fn(),
                        });
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderDetail_1.default, { workOrderId: "wo-1" }) }));
                        (0, vitest_1.expect)(react_1.screen.getByText(/loading/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show error state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var useWorkOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/hooks/useWorkOrders')); })];
                    case 1:
                        useWorkOrder = (_a.sent()).useWorkOrder;
                        useWorkOrder.mockReturnValue({
                            data: null,
                            isLoading: false,
                            error: new Error('Failed to load'),
                            refetch: vitest_1.vi.fn(),
                        });
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderDetail_1.default, { workOrderId: "wo-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Multiple error text elements, check for error heading
                                (0, vitest_1.expect)(react_1.screen.getByText(/error loading work order/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Actions', function () {
        (0, vitest_1.it)('should call onEdit when edit button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockOnEdit, editButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockOnEdit = vitest_1.vi.fn();
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderDetail_1.default, { workOrderId: "wo-1", onEdit: mockOnEdit }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component displays "Work Order #WO-001"
                                (0, vitest_1.expect)(react_1.screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        editButton = react_1.screen.getByRole('button', { name: /edit/i });
                        react_1.fireEvent.click(editButton);
                        (0, vitest_1.expect)(mockOnEdit).toHaveBeenCalledWith(mockWorkOrder);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call onDelete when delete is confirmed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockOnDelete, deleteButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockOnDelete = vitest_1.vi.fn();
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderDetail_1.default, { workOrderId: "wo-1", onDelete: mockOnDelete }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component displays "Work Order #WO-001"
                                (0, vitest_1.expect)(react_1.screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        deleteButton = react_1.screen.getByRole('button', { name: /delete/i });
                        react_1.fireEvent.click(deleteButton);
                        // Wait for delete dialog to appear and confirm deletion
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // The delete dialog should show a "Delete Work Order" button
                                var confirmButton = react_1.screen.queryByRole('button', { name: /delete work order/i });
                                (0, vitest_1.expect)(confirmButton).toBeInTheDocument();
                                if (confirmButton) {
                                    react_1.fireEvent.click(confirmButton);
                                }
                            }, { timeout: 2000 })];
                    case 2:
                        // Wait for delete dialog to appear and confirm deletion
                        _a.sent();
                        // Wait for delete mutation to complete and onDelete to be called
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockOnDelete).toHaveBeenCalledWith(mockWorkOrder);
                            }, { timeout: 3000 })];
                    case 3:
                        // Wait for delete mutation to complete and onDelete to be called
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call onStatusChange when status is updated', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockOnStatusChange, statusButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockOnStatusChange = vitest_1.vi.fn();
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderDetail_1.default, { workOrderId: "wo-1", onStatusChange: mockOnStatusChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component displays "Work Order #WO-001"
                                (0, vitest_1.expect)(react_1.screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        statusButton = react_1.screen.getByRole('button', { name: /update status/i });
                        if (!statusButton) return [3 /*break*/, 3];
                        react_1.fireEvent.click(statusButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockOnStatusChange).toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
});
