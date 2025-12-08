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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InvoiceForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var CustomerSearchSelector_1 = __importDefault(require("@/components/ui/CustomerSearchSelector"));
var logger_1 = require("@/utils/logger");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var Dialog_1 = require("@/components/ui/Dialog");
// Zod validation schema
var invoiceItemSchema = zod_2.z.object({
    service_type_id: zod_2.z.string().uuid('Please select a valid service type'),
    description: zod_2.z.string().min(1, 'Description is required'),
    quantity: zod_2.z.number().min(1, 'Quantity must be greater than 0'),
    unit_price: zod_2.z.number().min(0, 'Unit price cannot be negative'),
    total_price: zod_2.z.number().min(0).default(0),
});
var invoiceFormSchema = zod_2.z.object({
    account_id: zod_2.z.string().uuid('Please select a valid customer'),
    invoice_number: zod_2.z.string().optional(),
    issue_date: zod_2.z.string().min(1, 'Issue date is required'),
    due_date: zod_2.z.string().min(1, 'Due date is required'),
    notes: zod_2.z.string().optional(),
    items: zod_2.z.array(invoiceItemSchema).min(1, 'At least one service item is required'),
}).refine(function (data) {
    if (data.due_date && data.issue_date) {
        return new Date(data.due_date) >= new Date(data.issue_date);
    }
    return true;
}, {
    message: 'Due date must be after issue date',
    path: ['due_date'],
});
// InvoiceItem type removed - not used, can be inferred from invoiceItemSchema when needed
// Helper functions for customer display
var getCustomerTypeColor = function (type) {
    var colors = {
        'residential': 'bg-blue-100 text-blue-800',
        'commercial': 'bg-green-100 text-green-800',
        'industrial': 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
};
var formatAddress = function (customer) {
    if (!customer)
        return 'No address provided';
    var parts = [
        customer.address,
        customer.city,
        customer.state,
        customer.zip_code
    ].filter(Boolean);
    return parts.join(', ') || 'No address provided';
};
// UUID validation helper - more lenient to accept mock UUIDs (currently unused but kept for future use)
// const isValidUUID = (uuid: string) => {
//   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//   return uuidRegex.test(uuid);
// };
function InvoiceForm(_a) {
    var _this = this;
    var invoice = _a.invoice, isOpen = _a.isOpen, onClose = _a.onClose, onSuccess = _a.onSuccess, initialData = _a.initialData;
    var _b = (0, react_1.useState)(null), selectedCustomer = _b[0], setSelectedCustomer = _b[1];
    var _c = (0, react_1.useState)(''), submitError = _c[0], setSubmitError = _c[1];
    var _d = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(invoiceFormSchema),
        defaultValues: {
            account_id: '',
            invoice_number: '',
            issue_date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: '',
            items: [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }],
        },
    }), control = _d.control, handleSubmit = _d.handleSubmit, errors = _d.formState.errors, reset = _d.reset, watch = _d.watch, setValue = _d.setValue;
    var _e = (0, react_hook_form_1.useFieldArray)({
        control: control,
        name: 'items',
    }), fields = _e.fields, append = _e.append, remove = _e.remove;
    var watchedItems = watch('items');
    // Fetch service types from API
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['service-types'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, fetch('/api/v1/service-types', {
                                headers: {
                                    'Authorization': "Bearer ".concat(localStorage.getItem('token')),
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        logger_1.logger.debug('Fetched service types from API', { count: (data === null || data === void 0 ? void 0 : data.length) || 0 }, 'InvoiceForm');
                        return [2 /*return*/, data];
                    case 3:
                        logger_1.logger.warn('API call failed, using fallback service types', {}, 'InvoiceForm');
                        throw new Error('API call failed');
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        logger_1.logger.warn('Using fallback service types due to error', error_1, 'InvoiceForm');
                        // Use real service types from database
                        return [2 /*return*/, [
                                {
                                    id: 'f6c77dd2-b035-48f6-97e6-b28394412fc3',
                                    service_name: 'General Pest Control',
                                    base_price: 89.99,
                                    service_code: 'GPC',
                                    description: 'Comprehensive pest control service for common household pests'
                                },
                                {
                                    id: '39b3a214-0232-48b0-9195-ba1981ef72ce',
                                    service_name: 'Termite Treatment',
                                    base_price: 899.99,
                                    service_code: 'TT',
                                    description: 'Complete termite treatment including soil treatment and baiting systems'
                                },
                                {
                                    id: 'db4816a0-8d66-4e1e-873c-ceb66e12e8de',
                                    service_name: 'Rodent Control',
                                    base_price: 129.99,
                                    service_code: 'RC',
                                    description: 'Mouse and rat control including inspection, trapping, and exclusion'
                                },
                                {
                                    id: 'ee54b8ef-f5a4-4931-bda8-144af503996e',
                                    service_name: 'Ant Control',
                                    base_price: 89.99,
                                    service_code: 'AC',
                                    description: 'Targeted ant control treatment for various ant species'
                                },
                                {
                                    id: '3dc698e5-ad5b-4a32-9b85-9bc48fc0ad92',
                                    service_name: 'Spider Control',
                                    base_price: 99.99,
                                    service_code: 'SC',
                                    description: 'Specialized spider control treatment for indoor and outdoor infestations'
                                }
                            ]];
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        enabled: isOpen,
    }).data, serviceTypes = _f === void 0 ? [] : _f;
    // Create/Update invoice mutation
    var submitMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (invoice) {
                    logger_1.logger.debug('Updating existing invoice', { invoiceId: invoice.id }, 'InvoiceForm');
                    return [2 /*return*/, enhanced_api_1.billing.updateInvoice(invoice.id, data)];
                }
                else {
                    logger_1.logger.debug('Creating new invoice', {}, 'InvoiceForm');
                    return [2 /*return*/, enhanced_api_1.billing.createInvoice(data)];
                }
                return [2 /*return*/];
            });
        }); },
        onSuccess: function (result) {
            logger_1.logger.debug('Invoice mutation successful', { invoiceId: result === null || result === void 0 ? void 0 : result.id }, 'InvoiceForm');
            onSuccess();
        },
        onError: function (error) {
            logger_1.logger.error('Invoice mutation failed', error, 'InvoiceForm');
            setSubmitError(error instanceof Error ? error.message : 'Failed to save invoice');
        }
    });
    // Initialize form data when editing
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d;
        if (invoice && isOpen) {
            var invoiceItems = ((_a = invoice.InvoiceItem) === null || _a === void 0 ? void 0 : _a.map(function (item) { return ({
                service_type_id: item.service_type_id || '',
                description: item.description || '',
                quantity: Number(item.quantity) || 1,
                unit_price: Number(item.unit_price) || 0,
                total_price: Number(item.quantity || 1) * Number(item.unit_price || 0),
            }); })) || [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }];
            var issueDate = (invoice.issue_date ? new Date(invoice.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
            var dueDate = (invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
            reset({
                account_id: invoice.account_id || '',
                invoice_number: invoice.invoice_number || '',
                issue_date: issueDate,
                due_date: dueDate,
                notes: invoice.notes || '',
                items: invoiceItems,
            });
            // Set customer from invoice if available
            if (invoice.accounts) {
                setSelectedCustomer(invoice.accounts);
            }
        }
        else if (!invoice && isOpen) {
            // Use initialData if provided, otherwise use defaults
            if (initialData) {
                var initialItems = initialData.items && initialData.items.length > 0
                    ? initialData.items.map(function (item) { return ({
                        service_type_id: item.service_type_id || '',
                        description: item.description || '',
                        quantity: item.quantity || 1,
                        unit_price: item.unit_price || 0,
                        total_price: (item.quantity || 1) * (item.unit_price || 0),
                    }); })
                    : [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }];
                var initIssueDate = ((_b = initialData.issue_date) !== null && _b !== void 0 ? _b : new Date().toISOString().split('T')[0]);
                var initDueDate = ((_c = initialData.due_date) !== null && _c !== void 0 ? _c : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                reset({
                    account_id: initialData.account_id || '',
                    invoice_number: '',
                    issue_date: initIssueDate,
                    due_date: initDueDate,
                    notes: (_d = initialData.notes) !== null && _d !== void 0 ? _d : '',
                    items: initialItems,
                });
                // Set customer if account_id is provided
                if (initialData.account_id) {
                    // Customer will be set when CustomerSearchSelector loads
                }
            }
            else {
                // Clear customer when creating new invoice
                setSelectedCustomer(null);
                var defaultIssueDate = new Date().toISOString().split('T')[0];
                var defaultDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                reset({
                    account_id: '',
                    invoice_number: '',
                    issue_date: defaultIssueDate,
                    due_date: defaultDueDate,
                    notes: '',
                    items: [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }],
                });
            }
        }
    }, [invoice, isOpen, reset, initialData]);
    var addItem = function () {
        append({ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 });
    };
    var removeItem = function (index) {
        if (fields.length > 1) {
            remove(index);
        }
    };
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var apiData, verosuitAuth, authData, apiDataWithTotals, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setSubmitError('');
                    apiData = __assign(__assign(__assign(__assign(__assign({ account_id: data.account_id, issue_date: data.issue_date, due_date: data.due_date }, (data.invoice_number && { invoice_number: data.invoice_number })), (data.notes && { notes: data.notes })), ((initialData === null || initialData === void 0 ? void 0 : initialData.work_order_id) && { work_order_id: initialData.work_order_id })), ((initialData === null || initialData === void 0 ? void 0 : initialData.job_id) && { job_id: initialData.job_id })), { items: data.items.map(function (item) { return ({
                            service_type_id: item.service_type_id,
                            description: item.description,
                            quantity: Number(item.quantity),
                            unit_price: Number(item.unit_price)
                        }); }) });
                    logger_1.logger.debug('Submitting invoice', {
                        itemsCount: apiData.items.length,
                        accountId: apiData.account_id
                    }, 'InvoiceForm');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    verosuitAuth = localStorage.getItem('verofield_auth');
                    if (!verosuitAuth) {
                        logger_1.logger.error('No authentication data found', new Error('verofield_auth missing'), 'InvoiceForm');
                        setSubmitError('Authentication required. Please log in again.');
                        return [2 /*return*/];
                    }
                    try {
                        authData = JSON.parse(verosuitAuth);
                        if (!authData.token) {
                            logger_1.logger.error('No token in authentication data', new Error('Token missing'), 'InvoiceForm');
                            setSubmitError('Authentication token missing. Please log in again.');
                            return [2 /*return*/];
                        }
                    }
                    catch (error) {
                        logger_1.logger.error('Failed to parse authentication data', error, 'InvoiceForm');
                        setSubmitError('Invalid authentication data. Please log in again.');
                        return [2 /*return*/];
                    }
                    apiDataWithTotals = __assign(__assign({}, apiData), { items: apiData.items.map(function (item) {
                            var _a;
                            return (__assign(__assign({}, item), { total_price: (_a = item.total_price) !== null && _a !== void 0 ? _a : (item.quantity * item.unit_price) }));
                        }) });
                    return [4 /*yield*/, submitMutation.mutateAsync(apiDataWithTotals)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    logger_1.logger.error('Invoice submission failed', error_2, 'InvoiceForm');
                    // Check if it's a network error
                    if (error_2 instanceof Error && ((_a = error_2.message) === null || _a === void 0 ? void 0 : _a.includes('fetch'))) {
                        logger_1.logger.error('Network error - backend server may not be running', error_2, 'InvoiceForm');
                    }
                    // Log validation details
                    if (error_2 instanceof Error && ((_b = error_2.message) === null || _b === void 0 ? void 0 : _b.includes('Bad Request'))) {
                        logger_1.logger.warn('Validation failed', {
                            message: 'Check: service_type_id (UUID), account_id (UUID), quantity (>=1), unit_price (>=0)'
                        }, 'InvoiceForm');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var calculateTotals = function () {
        var subtotal = watchedItems.reduce(function (sum, item) { return sum + (item.total_price || 0); }, 0);
        var tax = 0; // Tax calculation can be added here
        var total = subtotal + tax;
        return { subtotal: subtotal, tax: tax, total: total };
    };
    var _g = calculateTotals(), subtotal = _g.subtotal, tax = _g.tax, total = _g.total;
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: function (open) { return !open && onClose(); }, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-5xl max-h-[92vh] overflow-hidden flex flex-col p-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-b border-white/20 p-6", children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { className: "text-2xl font-bold text-slate-800 mb-1", children: invoice ? 'Edit Invoice' : 'Create New Invoice' }), selectedCustomer && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-2 mt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-slate-700 text-lg", children: selectedCustomer.name }), (0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 rounded-full text-xs font-medium shadow-sm ".concat(getCustomerTypeColor(selectedCustomer.account_type)), children: selectedCustomer.account_type })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-sm text-slate-600", children: [selectedCustomer.email && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center bg-white/60 px-2 py-1 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-3 h-3 mr-1.5 text-slate-500" }), selectedCustomer.email] })), selectedCustomer.phone && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center bg-white/60 px-2 py-1 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-3 h-3 mr-1.5 text-slate-500" }), selectedCustomer.phone] })), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center bg-white/60 px-2 py-1 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-3 h-3 mr-1.5 text-slate-500" }), formatAddress(selectedCustomer)] })] })] }))] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-white", children: (0, jsx_runtime_1.jsx)("form", { id: "invoice-form", onSubmit: handleSubmit(onSubmit), className: "h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [submitError && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: submitError }) })), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-5 rounded-t-2xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-slate-800", children: "Invoice Information" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "account_id", control: control, render: function (_a) {
                                                                var _b;
                                                                var field = _a.field;
                                                                return ((0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { label: "Customer", value: field.value, onChange: function (customerId, customer) {
                                                                        field.onChange(customerId);
                                                                        setSelectedCustomer(customer);
                                                                    }, placeholder: "Search customers by name, email, or phone...", error: (_b = errors.account_id) === null || _b === void 0 ? void 0 : _b.message, required: true }));
                                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "invoice_number", control: control, render: function (_a) {
                                                                var _b;
                                                                var field = _a.field;
                                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Invoice Number", placeholder: "Auto-generated if left blank", error: ((_b = errors.invoice_number) === null || _b === void 0 ? void 0 : _b.message) || undefined })));
                                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "issue_date", control: control, render: function (_a) {
                                                                var _b;
                                                                var field = _a.field;
                                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "date", label: "Issue Date *", error: ((_b = errors.issue_date) === null || _b === void 0 ? void 0 : _b.message) || undefined })));
                                                            } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "due_date", control: control, render: function (_a) {
                                                                var _b;
                                                                var field = _a.field;
                                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "date", label: "Due Date *", error: ((_b = errors.due_date) === null || _b === void 0 ? void 0 : _b.message) || undefined })));
                                                            } }), (0, jsx_runtime_1.jsx)("div", { className: "md:col-span-2", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "notes", control: control, render: function (_a) {
                                                                    var _b;
                                                                    var field = _a.field;
                                                                    return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({}, field, { label: "Notes", placeholder: "Additional notes or terms...", rows: 1, error: ((_b = errors.notes) === null || _b === void 0 ? void 0 : _b.message) || undefined })));
                                                                } }) })] })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-5 rounded-t-2xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-slate-800", children: "Services" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "primary", onClick: addItem, icon: lucide_react_1.Plus, children: "Add Item" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: fields.map(function (field, index) {
                                                        var item = watchedItems[index];
                                                        var totalPrice = ((item === null || item === void 0 ? void 0 : item.quantity) || 0) * ((item === null || item === void 0 ? void 0 : item.unit_price) || 0);
                                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-6 gap-3 items-end", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "items.".concat(index, ".service_type_id"), control: control, render: function (_a) {
                                                                                    var _b, _c, _d;
                                                                                    var itemField = _a.field;
                                                                                    return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: itemField.value || '', onChange: function (value) {
                                                                                            var _a;
                                                                                            itemField.onChange(value);
                                                                                            var serviceType = serviceTypes.find(function (st) { return st.id === value; });
                                                                                            if (serviceType) {
                                                                                                setValue("items.".concat(index, ".unit_price"), serviceType.base_price);
                                                                                                var qty = ((_a = watchedItems[index]) === null || _a === void 0 ? void 0 : _a.quantity) || 1;
                                                                                                setValue("items.".concat(index, ".total_price"), qty * serviceType.base_price);
                                                                                            }
                                                                                        }, label: "Service Type *", placeholder: "Select service type", options: __spreadArray([
                                                                                            { value: '', label: 'Select service type' }
                                                                                        ], serviceTypes.map(function (serviceType) { return ({
                                                                                            value: serviceType.id,
                                                                                            label: serviceType.service_name,
                                                                                        }); }), true), error: ((_d = (_c = (_b = errors.items) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.service_type_id) === null || _d === void 0 ? void 0 : _d.message) || undefined }));
                                                                                } }) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "items.".concat(index, ".quantity"), control: control, render: function (_a) {
                                                                                var _b, _c, _d, _e;
                                                                                var itemField = _a.field;
                                                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, itemField, { type: "number", min: "1", label: "Qty", value: ((_b = itemField.value) === null || _b === void 0 ? void 0 : _b.toString()) || '', onChange: function (e) {
                                                                                        var _a;
                                                                                        var qty = parseInt(e.target.value) || 1;
                                                                                        itemField.onChange(qty);
                                                                                        var unitPrice = ((_a = watchedItems[index]) === null || _a === void 0 ? void 0 : _a.unit_price) || 0;
                                                                                        setValue("items.".concat(index, ".total_price"), qty * unitPrice);
                                                                                    }, error: ((_e = (_d = (_c = errors.items) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.quantity) === null || _e === void 0 ? void 0 : _e.message) || undefined })));
                                                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "items.".concat(index, ".unit_price"), control: control, render: function (_a) {
                                                                                var _b, _c, _d, _e;
                                                                                var itemField = _a.field;
                                                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, itemField, { type: "number", min: "0", step: "0.01", label: "Price ($)", value: ((_b = itemField.value) === null || _b === void 0 ? void 0 : _b.toString()) || '', onChange: function (e) {
                                                                                        var _a;
                                                                                        var price = parseFloat(e.target.value) || 0;
                                                                                        itemField.onChange(price);
                                                                                        var qty = ((_a = watchedItems[index]) === null || _a === void 0 ? void 0 : _a.quantity) || 1;
                                                                                        setValue("items.".concat(index, ".total_price"), qty * price);
                                                                                    }, error: ((_e = (_d = (_c = errors.items) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.unit_price) === null || _e === void 0 ? void 0 : _e.message) || undefined })));
                                                                            } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Total" }), (0, jsx_runtime_1.jsxs)("div", { className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-slate-50 font-medium cursor-default", children: ["$", totalPrice.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: fields.length > 1 && ((0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "ghost", onClick: function () { return removeItem(index); }, className: "p-2 text-red-400 hover:text-red-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-3", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "items.".concat(index, ".description"), control: control, render: function (_a) {
                                                                            var _b, _c, _d;
                                                                            var itemField = _a.field;
                                                                            return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({}, itemField, { label: "Description *", placeholder: "Service description...", rows: 1, error: ((_d = (_c = (_b = errors.items) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.description) === null || _d === void 0 ? void 0 : _d.message) || undefined })));
                                                                        } }) })] }, field.id));
                                                    }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 border-t border-slate-200 pt-4", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-sm ml-auto bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 shadow-sm border border-slate-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-slate-600", children: [(0, jsx_runtime_1.jsx)("span", { children: "Subtotal:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium text-slate-800", children: ["$", subtotal.toFixed(2)] })] }), tax > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-slate-600", children: [(0, jsx_runtime_1.jsx)("span", { children: "Tax:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium text-slate-800", children: ["$", tax.toFixed(2)] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-lg font-bold border-t border-slate-200 pt-2 mt-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-800", children: "Total:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600", children: ["$", total.toFixed(2)] })] })] }) }) })] })] })] }) }) }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { className: "border-t border-white/20 bg-gradient-to-r from-slate-50 to-white backdrop-blur-xl p-6 flex-shrink-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-slate-600", children: "Invoice Total:" }), (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600", children: ["$", total.toFixed(2)] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }), (0, jsx_runtime_1.jsxs)("button", { type: "submit", form: "invoice-form", className: "px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2", disabled: submitMutation.isPending, children: [submitMutation.isPending ? ((0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" })), invoice ? 'Update Invoice' : 'Create Invoice'] })] })] }) })] }) }));
}
