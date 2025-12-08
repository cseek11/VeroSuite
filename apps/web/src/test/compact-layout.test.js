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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var test_utils_1 = require("../test/setup/test-utils");
var vitest_1 = require("vitest");
var CustomersPage_1 = __importDefault(require("../components/CustomersPage"));
// Mock the API and other dependencies
vitest_1.vi.mock('@tanstack/react-query', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual('@tanstack/react-query')];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { QueryClient: actual.QueryClient, QueryClientProvider: actual.QueryClientProvider, useQuery: function () { return ({
                            data: [
                                {
                                    id: '1',
                                    name: 'Test Customer 1',
                                    email: 'test1@example.com',
                                    phone: '555-1234',
                                    city: 'Pittsburgh',
                                    state: 'PA',
                                    account_type: 'commercial',
                                    ar_balance: 0
                                },
                                {
                                    id: '2',
                                    name: 'Test Customer 2',
                                    email: 'test2@example.com',
                                    phone: '555-5678',
                                    city: 'Monroeville',
                                    state: 'PA',
                                    account_type: 'residential',
                                    ar_balance: 150.50
                                }
                            ],
                            isLoading: false,
                            error: null,
                            refetch: vitest_1.vi.fn()
                        }); }, useMutation: function () { return ({
                            mutate: vitest_1.vi.fn(),
                            isPending: false
                        }); }, useQueryClient: function () { return ({
                            invalidateQueries: vitest_1.vi.fn()
                        }); } })];
        }
    });
}); });
vitest_1.vi.mock('@/lib/api', function () { return ({
    crmApi: {
        accounts: vitest_1.vi.fn(),
        updateAccount: vitest_1.vi.fn()
    }
}); });
vitest_1.vi.mock('@/stores/auth', function () { return ({
    useAuthStore: function () { return ({
        user: { id: '1', first_name: 'Test', last_name: 'User', email: 'test@example.com' },
        clear: vitest_1.vi.fn()
    }); }
}); });
vitest_1.vi.mock('react-router-dom', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual('react-router-dom')];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { BrowserRouter: actual.BrowserRouter, useNavigate: function () { return vitest_1.vi.fn(); }, useLocation: function () { return ({ pathname: '/customers' }); } })];
        }
    });
}); });
// Mock Leaflet
vitest_1.vi.mock('react-leaflet', function () { return ({
    MapContainer: function (_a) {
        var children = _a.children;
        return (0, jsx_runtime_1.jsx)("div", { "data-testid": "map", children: children });
    },
    TileLayer: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "tile-layer" }); },
    Marker: function (_a) {
        var children = _a.children;
        return (0, jsx_runtime_1.jsx)("div", { "data-testid": "marker", children: children });
    },
    Popup: function (_a) {
        var children = _a.children;
        return (0, jsx_runtime_1.jsx)("div", { "data-testid": "popup", children: children });
    }
}); });
(0, vitest_1.describe)('CustomersPage Compact Layout', function () {
    (0, vitest_1.it)('should render in standard layout by default', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}));
        // Should show list view button initially (default is list view)
        var listViewButton = test_utils_1.screen.getByTitle('List View');
        (0, vitest_1.expect)(listViewButton).toBeInTheDocument();
    });
    (0, vitest_1.it)('should toggle to compact layout when button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gridViewButton, listViewButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}));
                    gridViewButton = test_utils_1.screen.getByTitle('Grid View');
                    test_utils_1.fireEvent.click(gridViewButton);
                    // Wait for the layout to change - grid view button should be active
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            var activeGridViewButton = test_utils_1.screen.getByTitle('Grid View');
                            (0, vitest_1.expect)(activeGridViewButton).toHaveClass('bg-indigo-100');
                        })];
                case 1:
                    // Wait for the layout to change - grid view button should be active
                    _a.sent();
                    listViewButton = test_utils_1.screen.getByTitle('List View');
                    (0, vitest_1.expect)(listViewButton).not.toHaveClass('bg-indigo-100');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should display customer cards in both layouts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gridViewButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}));
                    // Should show customer names in standard layout
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 1')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 2')).toBeInTheDocument();
                    gridViewButton = test_utils_1.screen.getByTitle('Grid View');
                    test_utils_1.fireEvent.click(gridViewButton);
                    // Wait for the layout to change
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            var activeGridViewButton = test_utils_1.screen.getByTitle('Grid View');
                            (0, vitest_1.expect)(activeGridViewButton).toHaveClass('bg-indigo-100');
                        })];
                case 1:
                    // Wait for the layout to change
                    _a.sent();
                    // Should still show customer names in compact layout
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 1')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 2')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should maintain all customer information in compact layout', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gridViewButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}));
                    gridViewButton = test_utils_1.screen.getByTitle('Grid View');
                    test_utils_1.fireEvent.click(gridViewButton);
                    // Wait for the layout to change
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            var activeGridViewButton = test_utils_1.screen.getByTitle('Grid View');
                            (0, vitest_1.expect)(activeGridViewButton).toHaveClass('bg-indigo-100');
                        })];
                case 1:
                    // Wait for the layout to change
                    _a.sent();
                    // Should show all customer details
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('test1@example.com')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('test2@example.com')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('555-1234')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('555-5678')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Pittsburgh, PA')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Monroeville, PA')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should show action buttons in both layouts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var historyButtons, editButtons, gridViewButton, historyButtonsAfter, editButtonsAfter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}));
                    // Wait for customers to load
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 1')).toBeInTheDocument();
                        })];
                case 1:
                    // Wait for customers to load
                    _a.sent();
                    historyButtons = test_utils_1.screen.queryAllByText(/history/i);
                    editButtons = test_utils_1.screen.queryAllByText(/edit/i);
                    (0, vitest_1.expect)(historyButtons.length + editButtons.length).toBeGreaterThan(0);
                    gridViewButton = test_utils_1.screen.getByTitle('Grid View');
                    test_utils_1.fireEvent.click(gridViewButton);
                    // Wait for the layout to change
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            var activeGridViewButton = test_utils_1.screen.getByTitle('Grid View');
                            (0, vitest_1.expect)(activeGridViewButton).toHaveClass('bg-indigo-100');
                        })];
                case 2:
                    // Wait for the layout to change
                    _a.sent();
                    historyButtonsAfter = test_utils_1.screen.queryAllByText(/history/i);
                    editButtonsAfter = test_utils_1.screen.queryAllByText(/edit/i);
                    (0, vitest_1.expect)(historyButtonsAfter.length + editButtonsAfter.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should maintain search functionality in both layouts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var searchInput, gridViewButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}));
                    searchInput = test_utils_1.screen.getByPlaceholderText(/search customers/i);
                    (0, vitest_1.expect)(searchInput).toBeInTheDocument();
                    gridViewButton = test_utils_1.screen.getByTitle('Grid View');
                    test_utils_1.fireEvent.click(gridViewButton);
                    // Wait for the layout to change
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            var activeGridViewButton = test_utils_1.screen.getByTitle('Grid View');
                            (0, vitest_1.expect)(activeGridViewButton).toHaveClass('bg-indigo-100');
                        })];
                case 1:
                    // Wait for the layout to change
                    _a.sent();
                    // Search input should still be present (placeholder includes more text)
                    (0, vitest_1.expect)(test_utils_1.screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
});
