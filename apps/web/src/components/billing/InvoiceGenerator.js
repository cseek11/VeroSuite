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
exports.default = InvoiceGenerator;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * InvoiceGenerator Component
 *
 * Generates invoices automatically from work orders.
 * Allows users to select work orders and create invoices with pre-populated data.
 *
 * Features:
 * - Work order selection
 * - Auto-populate invoice data from work order
 * - Integration with InvoiceForm for final editing
 * - Support for multiple work orders
 */
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var CustomerSearchSelector_1 = __importDefault(require("@/components/ui/CustomerSearchSelector"));
var InvoiceForm_1 = __importDefault(require("./InvoiceForm"));
function InvoiceGenerator(_a) {
    var _this = this;
    var onSuccess = _a.onSuccess;
    var _b = (0, react_1.useState)(null), selectedCustomer = _b[0], setSelectedCustomer = _b[1];
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)(new Set()), selectedWorkOrders = _d[0], setSelectedWorkOrders = _d[1];
    var _e = (0, react_1.useState)(false), showInvoiceForm = _e[0], setShowInvoiceForm = _e[1];
    var _f = (0, react_1.useState)(null), workOrderToInvoice = _f[0], setWorkOrderToInvoice = _f[1];
    // Fetch work orders for selected customer
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['work-orders', selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id],
        queryFn: function () {
            if (!(selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id)) {
                return Promise.resolve([]);
            }
            return enhanced_api_1.workOrders.getByCustomerId(selectedCustomer.id);
        },
        enabled: !!(selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id),
    }), _h = _g.data, workOrdersList = _h === void 0 ? [] : _h, isLoading = _g.isLoading, error = _g.error, refetch = _g.refetch;
    // Handle query errors
    if (error) {
        logger_1.logger.error('Failed to fetch work orders', error, 'InvoiceGenerator');
        toast_1.toast.error('Failed to load work orders. Please try again.');
    }
    // Filter work orders by search term and status
    var filteredWorkOrders = (0, react_1.useMemo)(function () {
        if (!workOrdersList || !Array.isArray(workOrdersList))
            return [];
        var filtered = workOrdersList.filter(function (wo) {
            // Only show completed work orders that don't have invoices yet
            // Note: In a real implementation, you'd check if work order already has an invoice
            return wo.status === 'completed';
        });
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (wo) {
                var _a;
                return ((_a = wo.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                    wo.id.toLowerCase().includes(searchLower_1);
            });
        }
        return filtered;
    }, [workOrdersList, searchTerm]);
    var handleSelectWorkOrder = function (workOrderId) {
        var newSelection = new Set(selectedWorkOrders);
        if (newSelection.has(workOrderId)) {
            newSelection.delete(workOrderId);
        }
        else {
            newSelection.add(workOrderId);
        }
        setSelectedWorkOrders(newSelection);
    };
    var handleGenerateInvoice = function (workOrderId) { return __awaiter(_this, void 0, void 0, function () {
        var workOrder;
        return __generator(this, function (_a) {
            workOrder = Array.isArray(workOrdersList) ? workOrdersList.find(function (wo) { return wo.id === workOrderId; }) : undefined;
            if (!workOrder) {
                logger_1.logger.error('Work order not found', { workOrderId: workOrderId }, 'InvoiceGenerator');
                toast_1.toast.error('Work order not found');
                return [2 /*return*/];
            }
            if (!selectedCustomer) {
                logger_1.logger.error('No customer selected', {}, 'InvoiceGenerator');
                toast_1.toast.error('Please select a customer first');
                return [2 /*return*/];
            }
            // Set work order for invoice form
            setWorkOrderToInvoice(workOrder);
            setShowInvoiceForm(true);
            logger_1.logger.debug('Opening invoice form for work order', { workOrderId: workOrderId, customerId: selectedCustomer.id }, 'InvoiceGenerator');
            return [2 /*return*/];
        });
    }); };
    var handleBulkGenerate = function () {
        if (selectedWorkOrders.size === 0) {
            toast_1.toast.error('Please select at least one work order');
            return;
        }
        if (selectedWorkOrders.size === 1) {
            var workOrderId = Array.from(selectedWorkOrders)[0];
            if (workOrderId) {
                handleGenerateInvoice(workOrderId);
            }
            return;
        }
        // For multiple work orders, we'll create separate invoices
        // In a real implementation, you might want to create a combined invoice
        toast_1.toast.info('Multiple work orders selected. Creating invoices one by one...');
        var workOrderIds = Array.from(selectedWorkOrders);
        workOrderIds.forEach(function (id, index) {
            setTimeout(function () {
                handleGenerateInvoice(id);
            }, index * 500); // Stagger the invoice creation
        });
    };
    var formatDate = function (dateString) {
        if (!dateString)
            return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    var getStatusColor = function (status) {
        var colors = {
            completed: 'bg-green-100 text-green-800',
            in_progress: 'bg-blue-100 text-blue-800',
            assigned: 'bg-yellow-100 text-yellow-800',
            pending: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    var handleInvoiceFormSuccess = function () {
        setShowInvoiceForm(false);
        setWorkOrderToInvoice(null);
        setSelectedWorkOrders(new Set());
        refetch();
        if (onSuccess) {
            onSuccess();
        }
        toast_1.toast.success('Invoice created successfully');
    };
    if (showInvoiceForm && workOrderToInvoice && selectedCustomer) {
        // Pre-populate invoice data from work order
        var issueDate = new Date().toISOString().split('T')[0];
        var dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        var invoiceData = __assign(__assign(__assign({ account_id: selectedCustomer.id, work_order_id: workOrderToInvoice.id }, (issueDate ? { issue_date: issueDate } : {})), (dueDate ? { due_date: dueDate } : {})), { notes: "Invoice generated from work order: ".concat(workOrderToInvoice.id).concat(workOrderToInvoice.description ? "\n".concat(workOrderToInvoice.description) : ''), items: [
                {
                    service_type_id: '', // Will need to be selected or mapped from work order
                    description: workOrderToInvoice.description || 'Service from work order',
                    quantity: 1,
                    unit_price: 0, // Will need to be calculated or entered
                },
            ] });
        return ((0, jsx_runtime_1.jsx)(InvoiceForm_1.default, { invoice: null, isOpen: true, onClose: function () {
                setShowInvoiceForm(false);
                setWorkOrderToInvoice(null);
            }, onSuccess: handleInvoiceFormSuccess, initialData: invoiceData }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 mr-2 text-purple-600" }), "Generate Invoice from Work Orders"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-2", children: "Select work orders and generate invoices automatically" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium mb-2", children: "Select Customer" }), (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, __assign({}, ((selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id) ? { value: selectedCustomer.id } : {}), { onChange: function (_customerId, customer) {
                                    setSelectedCustomer(customer);
                                    setSelectedWorkOrders(new Set());
                                    setSearchTerm('');
                                }, placeholder: "Search for customer..." }))] }), selectedCustomer && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search work orders...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }) })), selectedCustomer && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading work orders..." })] })), error && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-red-50 border-red-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-800 font-medium", children: "Failed to load work orders" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-red-600 mt-1", children: "Please try again or contact support if the problem persists." })] })] }) }) })), !isLoading && !error && filteredWorkOrders.length === 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gray-50 border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 font-medium", children: "No completed work orders found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-2", children: "Only completed work orders can be used to generate invoices." })] }) })), !isLoading && !error && filteredWorkOrders.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-medium", children: [filteredWorkOrders.length, " work order", filteredWorkOrders.length !== 1 ? 's' : '', " found"] }), selectedWorkOrders.size > 0 && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", icon: lucide_react_1.Plus, onClick: handleBulkGenerate, children: ["Generate Invoice", selectedWorkOrders.size > 1 ? 's' : '', " (", selectedWorkOrders.size, ")"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredWorkOrders.map(function (workOrder) {
                                            var isSelected = selectedWorkOrders.has(workOrder.id);
                                            return ((0, jsx_runtime_1.jsx)("div", { className: "border-2 transition-colors cursor-pointer rounded-xl ".concat(isSelected
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-300'), onClick: function () { return handleSelectWorkOrder(workOrder.id); }, children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-0 shadow-none", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 rounded border-2 flex items-center justify-center ".concat(isSelected
                                                                                        ? 'border-purple-600 bg-purple-600'
                                                                                        : 'border-gray-300'), children: isSelected && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-white" })) }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "font-semibold", children: ["Work Order #", workOrder.id.slice(0, 8)] }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded text-xs font-medium ".concat(getStatusColor(workOrder.status)), children: workOrder.status })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-700 mb-3", children: workOrder.description || 'No description' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-4 text-sm text-gray-600", children: [workOrder.scheduled_date && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 mr-1" }), "Scheduled: ", formatDate(workOrder.scheduled_date)] })), workOrder.completion_date && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 mr-1" }), "Completed: ", formatDate(workOrder.completion_date)] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "ml-4", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.FileText, onClick: function () {
                                                                            handleGenerateInvoice(workOrder.id);
                                                                        }, children: "Generate Invoice" }) })] }) }) }) }, workOrder.id));
                                        }) })] }))] })), !selectedCustomer && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gray-50 border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 font-medium", children: "Select a customer to view work orders" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-2", children: "Choose a customer from the dropdown above to see their completed work orders." })] }) }))] }) }) }));
}
