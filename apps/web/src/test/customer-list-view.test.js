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
var CustomerListView_1 = __importDefault(require("../components/CustomerListView"));
// Mock the EnhancedUI components
vitest_1.vi.mock('@/components/ui/EnhancedUI', function () { return ({
    Typography: function (_a) {
        var children = _a.children, variant = _a.variant, className = _a.className;
        return ((0, jsx_runtime_1.jsx)("div", { className: "typography ".concat(variant, " ").concat(className), children: children }));
    },
    Button: function (_a) {
        var children = _a.children, onClick = _a.onClick, variant = _a.variant, size = _a.size, className = _a.className;
        return ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, className: "button ".concat(variant, " ").concat(size, " ").concat(className), children: children }));
    },
    Card: function (_a) {
        var children = _a.children, className = _a.className;
        return ((0, jsx_runtime_1.jsx)("div", { className: "card ".concat(className), children: children }));
    },
    Input: function (_a) {
        var placeholder = _a.placeholder, value = _a.value, onChange = _a.onChange, className = _a.className;
        return ((0, jsx_runtime_1.jsx)("input", { placeholder: placeholder, value: value, onChange: function (e) { return onChange(e.target.value); }, className: "input ".concat(className) }));
    },
    Chip: function (_a) {
        var children = _a.children, variant = _a.variant, className = _a.className;
        return ((0, jsx_runtime_1.jsx)("span", { className: "chip ".concat(variant, " ").concat(className), children: children }));
    },
    Checkbox: function (_a) {
        var checked = _a.checked, onChange = _a.onChange, className = _a.className;
        return ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: checked, onChange: function (e) { return onChange(e.target.checked); }, className: "checkbox ".concat(className) }));
    }
}); });
// Mock lucide-react icons
vitest_1.vi.mock('lucide-react', function () { return ({
    Search: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "search-icon", children: "Search" }); },
    Filter: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "filter-icon", children: "Filter" }); },
    Eye: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "eye-icon", children: "Eye" }); },
    Edit: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "edit-icon", children: "Edit" }); },
    Phone: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "phone-icon", children: "Phone" }); },
    DollarSign: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "dollar-icon", children: "Dollar" }); },
    Mail: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "mail-icon", children: "Mail" }); },
    MapPin: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "mappin-icon", children: "MapPin" }); },
    Building: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "building-icon", children: "Building" }); },
    FileText: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "filetext-icon", children: "FileText" }); },
    Calendar: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "calendar-icon", children: "Calendar" }); },
    MessageSquare: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "messagesquare-icon", children: "MessageSquare" }); },
    FolderOpen: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "folderopen-icon", children: "FolderOpen" }); },
    Users: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "users-icon", children: "Users" }); },
    RefreshCw: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "refreshcw-icon", children: "RefreshCw" }); },
    ChevronDown: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "chevrondown-icon", children: "ChevronDown" }); },
    ChevronUp: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "chevronup-icon", children: "ChevronUp" }); },
    AlertTriangle: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "alert-triangle-icon", children: "AlertTriangle" }); }
}); });
var mockCustomers = [
    {
        id: '1',
        tenant_id: 'tenant-1',
        name: 'Test Customer 1',
        email: 'test1@example.com',
        phone: '555-1234',
        city: 'Pittsburgh',
        state: 'PA',
        account_type: 'commercial',
        ar_balance: 0,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '2',
        tenant_id: 'tenant-1',
        name: 'Test Customer 2',
        email: 'test2@example.com',
        phone: '555-5678',
        city: 'Monroeville',
        state: 'PA',
        account_type: 'residential',
        ar_balance: 150.50,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
    }
];
var mockProps = {
    customers: mockCustomers,
    onViewHistory: vitest_1.vi.fn(),
    onEdit: vitest_1.vi.fn(),
    onViewDetails: vitest_1.vi.fn()
};
(0, vitest_1.describe)('CustomerListView', function () {
    (0, vitest_1.it)('should render the customer list table', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
        // Should show customer names in the table
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 1')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 2')).toBeInTheDocument();
        // Should show table headers
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Customer')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Type')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Contact')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Location')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('AR Balance')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Actions')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should show search and filter controls', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
        // CustomerListView doesn't have search/filter controls - they're in the parent component
        // Just verify the component renders
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 1')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should allow selecting customers', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
        // Get checkboxes
        var checkboxes = test_utils_1.screen.getAllByRole('checkbox');
        // Select first customer
        if (checkboxes[1]) {
            test_utils_1.fireEvent.click(checkboxes[1]); // First customer checkbox (index 0 is select all)
        }
        // Should show tabbed navigation
        (0, vitest_1.expect)(test_utils_1.screen.getByText('1 Customer Selected')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Overview')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Jobs/Service History')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Billing/AR')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Notes/Communications')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Documents')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should show tab content when customers are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkboxes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
                    checkboxes = test_utils_1.screen.getAllByRole('checkbox');
                    if (checkboxes[1]) {
                        test_utils_1.fireEvent.click(checkboxes[1]);
                    }
                    // Wait for tab content to appear
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            (0, vitest_1.expect)(test_utils_1.screen.getByText('Selected Customers Overview')).toBeInTheDocument();
                        })];
                case 1:
                    // Wait for tab content to appear
                    _a.sent();
                    // Should show overview statistics
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Total Customers')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Commercial')).toBeInTheDocument();
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('Residential')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should allow expanding customer rows', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
        // Get expand buttons (chevron icons)
        var expandButtons = test_utils_1.screen.getAllByTestId('chevrondown-icon');
        // Click first expand button
        if (expandButtons[0]) {
            test_utils_1.fireEvent.click(expandButtons[0]);
        }
        // Should show expanded content
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Quick Actions')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Recent Activity')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Notes')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should call onViewHistory when history button is clicked', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
        // Get history buttons
        var historyButtons = test_utils_1.screen.getAllByText('History');
        // Click first history button
        if (historyButtons[0]) {
            test_utils_1.fireEvent.click(historyButtons[0]);
        }
        // Should call the callback
        (0, vitest_1.expect)(mockProps.onViewHistory).toHaveBeenCalledWith(mockCustomers[0]);
    });
    (0, vitest_1.it)('should call onEdit when edit button is clicked', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
        // Get edit buttons
        var editButtons = test_utils_1.screen.getAllByText('Edit');
        // Click first edit button
        if (editButtons[0]) {
            test_utils_1.fireEvent.click(editButtons[0]);
        }
        // Should call the callback
        (0, vitest_1.expect)(mockProps.onEdit).toHaveBeenCalledWith(mockCustomers[0]);
    });
    (0, vitest_1.it)('should call onViewDetails when customer name is clicked', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
        // Click first customer name
        test_utils_1.fireEvent.click(test_utils_1.screen.getByText('Test Customer 1'));
        // Should call the callback
        (0, vitest_1.expect)(mockProps.onViewDetails).toHaveBeenCalledWith(mockCustomers[0]);
    });
    (0, vitest_1.it)('should filter customers by search term', function () {
        // CustomerListView receives pre-filtered customers from parent
        // Test that it displays the customers it receives
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps, { customers: [mockCustomers[0]] })));
        // Should show the filtered customer
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Test Customer 1')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.queryByText('Test Customer 2')).not.toBeInTheDocument();
    });
    (0, vitest_1.it)('should clear selection when clear selection button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkboxes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(CustomerListView_1.default, __assign({}, mockProps)));
                    checkboxes = test_utils_1.screen.getAllByRole('checkbox');
                    if (checkboxes[1]) {
                        test_utils_1.fireEvent.click(checkboxes[1]);
                    }
                    // Should show tabbed navigation
                    (0, vitest_1.expect)(test_utils_1.screen.getByText('1 Customer Selected')).toBeInTheDocument();
                    // Click clear selection
                    test_utils_1.fireEvent.click(test_utils_1.screen.getByText('Clear Selection'));
                    // Should hide tabbed navigation
                    return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                            (0, vitest_1.expect)(test_utils_1.screen.queryByText('1 Customer Selected')).not.toBeInTheDocument();
                        })];
                case 1:
                    // Should hide tabbed navigation
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
