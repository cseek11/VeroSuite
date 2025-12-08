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
exports.default = InvoiceCard;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Invoice Card Component
 *
 * Dashboard card for creating invoices by dragging customers or jobs onto it.
 * Supports drag-and-drop interactions with Customer Search Card and Jobs Calendar Card.
 */
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var components_1 = require("@/routes/dashboard/components");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var enhanced_api_1 = require("@/lib/enhanced-api");
function InvoiceCard(_a) {
    var _this = this;
    var _b = _a.cardId, cardId = _b === void 0 ? 'invoice-card' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var user = (0, auth_1.useAuthStore)().user;
    var _d = (0, react_1.useState)([]), generatedInvoices = _d[0], setGeneratedInvoices = _d[1];
    var _e = (0, react_1.useState)(false), isCreating = _e[0], setIsCreating = _e[1];
    // Handle invoice creation
    var handleCreateInvoice = (0, react_1.useCallback)(function (customer, job) { return __awaiter(_this, void 0, void 0, function () {
        var invoiceNumber, invoiceId, newInvoice, issueDate, dueDate, invoiceData, createdInvoice_1, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setIsCreating(true);
                    invoiceNumber = "INV-".concat(Date.now());
                    invoiceId = "invoice-".concat(Date.now());
                    newInvoice = __assign(__assign({ id: invoiceId, invoiceNumber: invoiceNumber, customerId: String(customer.id || ''), customerName: String(customer.name || '') }, ((job === null || job === void 0 ? void 0 : job.id) ? { jobId: String(job.id) } : {})), { status: 'draft', amount: typeof (job === null || job === void 0 ? void 0 : job.total_amount) === 'number' ? job.total_amount : 0, createdAt: new Date() });
                    setGeneratedInvoices(function (prev) { return __spreadArray([newInvoice], prev, true); });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    issueDate = (_a = new Date().toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : new Date().toISOString().substring(0, 10);
                    dueDate = (_b = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
                    invoiceData = __assign(__assign({ account_id: String(customer.id || '') }, ((job === null || job === void 0 ? void 0 : job.id) ? { job_id: String(job.id) } : {})), { issue_date: issueDate, due_date: dueDate, items: Array.isArray(job === null || job === void 0 ? void 0 : job.items) && job.items.length > 0
                            ? job.items.map(function (item) { return ({
                                service_type_id: String(item.service_type_id || ''),
                                description: String(item.description || 'Service'),
                                quantity: typeof item.quantity === 'number' ? item.quantity : 1,
                                unit_price: typeof item.unit_price === 'number' ? item.unit_price : 0
                            }); })
                            : [{
                                    service_type_id: '',
                                    description: String((job === null || job === void 0 ? void 0 : job.description) || 'Service'),
                                    quantity: 1,
                                    unit_price: typeof (job === null || job === void 0 ? void 0 : job.total_amount) === 'number' ? job.total_amount : 0
                                }], notes: job ? "Invoice for job ".concat(job.id) : "Invoice for ".concat(customer.name) });
                    return [4 /*yield*/, enhanced_api_1.billing.createInvoice(invoiceData)];
                case 2:
                    createdInvoice_1 = _c.sent();
                    // Update invoice with real data
                    setGeneratedInvoices(function (prev) {
                        return prev.map(function (inv) {
                            return inv.id === invoiceId
                                ? __assign(__assign({}, inv), { id: createdInvoice_1.id, invoiceNumber: createdInvoice_1.invoice_number, amount: createdInvoice_1.total_amount, status: (createdInvoice_1.status || 'draft'), downloadUrl: "/invoices/".concat(createdInvoice_1.id) }) : inv;
                        });
                    });
                    logger_1.logger.info('Invoice created successfully', {
                        invoiceId: createdInvoice_1.id,
                        customerId: customer.id,
                        jobId: job === null || job === void 0 ? void 0 : job.id
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    logger_1.logger.error('Failed to create invoice', { error: error_1, customerId: customer.id });
                    // Update invoice status to error
                    setGeneratedInvoices(function (prev) {
                        return prev.map(function (inv) {
                            return inv.id === invoiceId
                                ? __assign(__assign({}, inv), { status: 'draft' }) : inv;
                        });
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsCreating(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [user]);
    // Invoice creation handler for drag-and-drop
    var createInvoiceHandler = (0, react_1.useCallback)(function (payload) { return __awaiter(_this, void 0, void 0, function () {
        var customer, job, customer, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    if (!(payload.sourceDataType === 'customer')) return [3 /*break*/, 2];
                    customer = payload.data.entity;
                    logger_1.logger.debug('Creating invoice from customer drag', {
                        customerId: customer.id,
                        customerName: customer.name
                    });
                    return [4 /*yield*/, handleCreateInvoice(customer)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: "Creating invoice for ".concat(customer.name),
                            data: { customerId: customer.id }
                        }];
                case 2:
                    if (!(payload.sourceDataType === 'job')) return [3 /*break*/, 7];
                    job = payload.data.entity;
                    customer = job.account || job.customer || job.accounts;
                    if (!customer) {
                        return [2 /*return*/, {
                                success: false,
                                error: 'Job does not have associated customer information.'
                            }];
                    }
                    logger_1.logger.debug('Creating invoice from job drag', {
                        jobId: job.id,
                        customerId: customer.id
                    });
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, handleCreateInvoice(customer, job)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to create invoice from job drag', {
                        error: error_2 instanceof Error ? error_2.message : String(error_2),
                        jobId: job.id,
                        customerId: customer.id
                    });
                    return [2 /*return*/, {
                            success: false,
                            error: 'Failed to create invoice. Please try again.'
                        }];
                case 6: return [2 /*return*/, {
                        success: true,
                        message: "Creating invoice for job ".concat(job.id),
                        data: { jobId: job.id, customerId: customer.id }
                    }];
                case 7: return [2 /*return*/, {
                        success: false,
                        error: 'Invalid data type. Expected customer or job data.'
                    }];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_3 = _a.sent();
                    logger_1.logger.error('Error creating invoice from drag', error_3);
                    return [2 /*return*/, {
                            success: false,
                            error: error_3 instanceof Error ? error_3.message : 'Failed to create invoice'
                        }];
                case 10: return [2 /*return*/];
            }
        });
    }); }, [handleCreateInvoice]);
    // Drop zone configuration
    var dropZoneConfig = {
        cardId: cardId,
        cardType: 'invoice',
        accepts: {
            dataTypes: ['customer', 'job']
        },
        actions: {
            'create-invoice': {
                id: 'create-invoice',
                label: 'Create Invoice',
                icon: '💰',
                description: 'Create an invoice for this customer or job',
                handler: createInvoiceHandler,
                requiresConfirmation: false
            }
        },
        dropZoneStyle: {
            highlightColor: '#ef4444',
            borderStyle: 'dashed',
            borderWidth: 2,
            backgroundColor: 'rgba(239, 68, 68, 0.05)'
        }
    };
    var handleDownloadInvoice = function (e, invoice) {
        e.preventDefault();
        e.stopPropagation();
        if (!invoice.downloadUrl) {
            logger_1.logger.warn('Invoice download URL not available', { invoiceId: invoice.id });
            return;
        }
        try {
            var link = document.createElement('a');
            link.href = invoice.downloadUrl;
            link.download = "".concat(invoice.invoiceNumber, ".pdf");
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            logger_1.logger.info('Invoice download initiated', {
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to download invoice', { error: error, invoiceId: invoice.id });
            window.open(invoice.downloadUrl, '_blank');
        }
    };
    var handleViewInvoice = function (e, invoice) {
        e.preventDefault();
        e.stopPropagation();
        if (!invoice.downloadUrl) {
            logger_1.logger.warn('Invoice view URL not available', { invoiceId: invoice.id });
            return;
        }
        try {
            var viewUrl = invoice.downloadUrl.replace('/download', '/view') || invoice.downloadUrl;
            window.open(viewUrl, '_blank', 'noopener,noreferrer');
            logger_1.logger.info('Invoice view opened', {
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to open invoice view', { error: error, invoiceId: invoice.id });
            window.open(invoice.downloadUrl, '_blank');
        }
    };
    var handleDeleteInvoice = function (invoiceId) {
        setGeneratedInvoices(function (prev) { return prev.filter(function (inv) { return inv.id !== invoiceId; }); });
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'paid':
                return 'text-green-600 bg-green-50';
            case 'sent':
                return 'text-blue-600 bg-blue-50';
            case 'overdue':
                return 'text-red-600 bg-red-50';
            case 'draft':
                return 'text-gray-600 bg-gray-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'paid':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'sent':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-blue-500" });
            case 'overdue':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 text-gray-500" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col min-h-[400px] ".concat(className), "data-card-id": cardId, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "w-5 h-5 text-red-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Invoices" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Drag customers or jobs here to create invoices" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 overflow-auto", children: (0, jsx_runtime_1.jsxs)(components_1.DropZone, { cardId: cardId, dropZoneConfig: dropZoneConfig, onDrop: function (payload, result) {
                        var _a;
                        if (result.success) {
                            logger_1.logger.info('Invoice creation initiated', {
                                customerId: (_a = payload.data) === null || _a === void 0 ? void 0 : _a.id,
                                dataType: payload.sourceDataType
                            });
                        }
                    }, className: "min-h-[200px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-red-400 hover:bg-red-50 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "w-12 h-12 text-gray-400 mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 font-medium mb-1", children: "Drop customer or job here" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "to create an invoice" })] }), generatedInvoices.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Generated Invoices" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: generatedInvoices.map(function (invoice) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "w-4 h-4 text-gray-400 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: invoice.invoiceNumber }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 px-2 py-0.5 rounded text-xs ".concat(getStatusColor(invoice.status)), children: [getStatusIcon(invoice.status), (0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: invoice.status })] })] }), invoice.customerName && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate", children: invoice.customerName })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-medium text-gray-700", children: ["$", invoice.amount.toFixed(2)] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: invoice.createdAt.toLocaleTimeString() })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 ml-2", children: [invoice.status !== 'draft' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) { return handleViewInvoice(e, invoice); }, className: "p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors", title: "View invoice", type: "button", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) { return handleDownloadInvoice(e, invoice); }, className: "p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors", title: "Download invoice", type: "button", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }) })] })), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteInvoice(invoice.id);
                                                        }, className: "p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors", title: "Delete invoice", type: "button", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] })] }, invoice.id)); }) })] })), generatedInvoices.length === 0 && !isCreating && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 text-center text-gray-500 text-sm", children: [(0, jsx_runtime_1.jsx)("p", { children: "No invoices created yet." }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1", children: "Drag a customer or job from another card to get started." })] }))] }) })] }));
}
