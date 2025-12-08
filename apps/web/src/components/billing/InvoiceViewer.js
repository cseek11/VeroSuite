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
exports.default = InvoiceViewer;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var jspdf_1 = __importDefault(require("jspdf"));
var html2canvas_1 = __importDefault(require("html2canvas"));
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
function InvoiceViewer(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var invoice = _a.invoice, isOpen = _a.isOpen, onClose = _a.onClose, onPayNow = _a.onPayNow;
    var printableRef = (0, react_1.useRef)(null);
    // Fetch company settings for dynamic display
    var companySettings = (0, react_query_1.useQuery)({
        queryKey: ['company', 'settings'],
        queryFn: enhanced_api_1.company.getSettings,
    }).data;
    // Fetch payment history for this invoice
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payments', invoice.id],
        queryFn: function () { return enhanced_api_1.billing.getPayments(invoice.id); },
        enabled: isOpen && !!invoice.id,
    }), _m = _l.data, payments = _m === void 0 ? [] : _m, paymentsLoading = _l.isLoading;
    var handleDownloadPDF = function (invoice) { return __awaiter(_this, void 0, void 0, function () {
        var button, canvas, imgData, pdf, imgWidth, pageHeight, imgHeight, heightLeft, position, error_1, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    if (!printableRef.current) {
                        throw new Error('Printable content not found');
                    }
                    button = document.querySelector('[data-pdf-button]');
                    if (button) {
                        button.disabled = true;
                        button.innerHTML = '<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating PDF...';
                    }
                    return [4 /*yield*/, (0, html2canvas_1.default)(printableRef.current, {
                            scale: 2,
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: '#ffffff',
                            width: printableRef.current.scrollWidth,
                            height: printableRef.current.scrollHeight,
                        })];
                case 1:
                    canvas = _a.sent();
                    imgData = canvas.toDataURL('image/png');
                    pdf = new jspdf_1.default({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                    });
                    imgWidth = 210;
                    pageHeight = 297;
                    imgHeight = (canvas.height * imgWidth) / canvas.width;
                    heightLeft = imgHeight;
                    position = 0;
                    // Add first page
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    // Add additional pages if needed
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                    // Download the PDF
                    pdf.save("Invoice-".concat(invoice.invoice_number, ".pdf"));
                    logger_1.logger.debug('PDF generated successfully', { invoiceNumber: invoice.invoice_number }, 'InvoiceViewer');
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to generate PDF', error_1, 'InvoiceViewer');
                    toast_1.toast.error('Failed to generate PDF. Please try again.');
                    return [3 /*break*/, 4];
                case 3:
                    button = document.querySelector('[data-pdf-button]');
                    if (button) {
                        button.disabled = false;
                        button.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Download PDF';
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    var getStatusIcon = function (status) {
        switch (status) {
            case 'paid':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-600" });
            case 'overdue':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600" });
            case 'sent':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5 text-yellow-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5 text-gray-600" });
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'sent':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    var isPayable = invoice.status === 'sent' || invoice.status === 'overdue';
    var isOverdue = invoice.status === 'overdue' ||
        (invoice.status === 'sent' && new Date(invoice.due_date) < new Date());
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 flex-1", children: [(companySettings === null || companySettings === void 0 ? void 0 : companySettings.invoice_logo_url) ? ((0, jsx_runtime_1.jsx)("img", { src: companySettings.invoice_logo_url, alt: "Company Logo", className: "w-auto h-16 max-w-[180px] object-contain", onError: function (e) {
                                        var target = e.target;
                                        target.style.display = 'none';
                                        var fallback = target.nextElementSibling;
                                        if (fallback)
                                            fallback.style.display = 'block';
                                    } })) : ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "text-white font-bold text-xs", children: ((_b = companySettings === null || companySettings === void 0 ? void 0 : companySettings.company_name) === null || _b === void 0 ? void 0 : _b.substring(0, 2).toUpperCase()) || "VC" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-slate-800", children: !(companySettings === null || companySettings === void 0 ? void 0 : companySettings.invoice_logo_url) && "Invoice ".concat(invoice.invoice_number) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-2 mt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-slate-700 text-lg", children: (_c = invoice.accounts) === null || _c === void 0 ? void 0 : _c.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [getStatusIcon(invoice.status), (0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 rounded-full text-xs font-medium shadow-sm ".concat(getStatusColor(invoice.status)), children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) })] })] }), ((_d = invoice.accounts) === null || _d === void 0 ? void 0 : _d.address) && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center text-sm text-slate-600", children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center bg-white/60 px-2 py-1 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-3 h-3 mr-1.5 text-slate-500" }), [invoice.accounts.address, invoice.accounts.city, invoice.accounts.state, invoice.accounts.zip_code]
                                                                .filter(Boolean).join(', ')] }) }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)("button", { "data-pdf-button": true, onClick: function () { return handleDownloadPDF(invoice); }, className: "flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Download PDF" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-y-auto max-h-[calc(90vh-200px)]", children: (0, jsx_runtime_1.jsxs)("div", { ref: printableRef, className: "p-6 bg-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-8 pb-6 border-b-2 border-purple-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(companySettings === null || companySettings === void 0 ? void 0 : companySettings.invoice_logo_url) ? ((0, jsx_runtime_1.jsx)("img", { src: companySettings.invoice_logo_url, alt: "Company Logo", className: "w-auto h-20 max-w-[200px] object-contain", onError: function (e) {
                                                        var target = e.target;
                                                        target.style.display = 'none';
                                                        var fallback = target.nextElementSibling;
                                                        if (fallback)
                                                            fallback.style.display = 'block';
                                                    } })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl", children: ((_e = companySettings === null || companySettings === void 0 ? void 0 : companySettings.company_name) === null || _e === void 0 ? void 0 : _e.substring(0, 2).toUpperCase()) || "VC" })), (0, jsx_runtime_1.jsxs)("div", { children: [!(companySettings === null || companySettings === void 0 ? void 0 : companySettings.invoice_logo_url) && ((0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-purple-800 mb-2", children: (companySettings === null || companySettings === void 0 ? void 0 : companySettings.company_name) || 'VeroField Pest Control' })), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600", children: "Professional Pest Control Services" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-slate-500 mt-2", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(companySettings === null || companySettings === void 0 ? void 0 : companySettings.phone) && "\uD83D\uDCDE ".concat(companySettings.phone), (companySettings === null || companySettings === void 0 ? void 0 : companySettings.phone) && (companySettings === null || companySettings === void 0 ? void 0 : companySettings.email) && ' | ', (companySettings === null || companySettings === void 0 ? void 0 : companySettings.email) && "\u2709\uFE0F ".concat(companySettings.email)] }), ((companySettings === null || companySettings === void 0 ? void 0 : companySettings.address) || (companySettings === null || companySettings === void 0 ? void 0 : companySettings.city) || (companySettings === null || companySettings === void 0 ? void 0 : companySettings.state) || (companySettings === null || companySettings === void 0 ? void 0 : companySettings.zip_code)) && ((0, jsx_runtime_1.jsxs)("p", { children: ["\uD83D\uDCCD ", [companySettings === null || companySettings === void 0 ? void 0 : companySettings.address, companySettings === null || companySettings === void 0 ? void 0 : companySettings.city, companySettings === null || companySettings === void 0 ? void 0 : companySettings.state, companySettings === null || companySettings === void 0 ? void 0 : companySettings.zip_code].filter(Boolean).join(', ')] }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-slate-800", children: ["Invoice ", invoice.invoice_number] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-2 mt-2", children: [getStatusIcon(invoice.status), (0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 rounded-full text-xs font-medium ".concat(getStatusColor(invoice.status)), children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) })] })] })] }) }), isOverdue && ((0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Payment Overdue" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm mt-1", children: ["This invoice was due on ", new Date(invoice.due_date).toLocaleDateString(), ". Please make payment as soon as possible to avoid late fees."] })] }), onPayNow && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: onPayNow, icon: lucide_react_1.CreditCard, children: "Pay Now" }))] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4 text-purple-800", children: (companySettings === null || companySettings === void 0 ? void 0 : companySettings.company_name) || 'VeroField Pest Control' }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4 mr-2" }), "Professional Pest Control Services"] }), (companySettings === null || companySettings === void 0 ? void 0 : companySettings.phone) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4 mr-2" }), companySettings.phone] })), (companySettings === null || companySettings === void 0 ? void 0 : companySettings.email) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4 mr-2" }), companySettings.email] })), ((companySettings === null || companySettings === void 0 ? void 0 : companySettings.address) || (companySettings === null || companySettings === void 0 ? void 0 : companySettings.city) || (companySettings === null || companySettings === void 0 ? void 0 : companySettings.state) || (companySettings === null || companySettings === void 0 ? void 0 : companySettings.zip_code)) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 mr-2" }), [companySettings === null || companySettings === void 0 ? void 0 : companySettings.address, companySettings === null || companySettings === void 0 ? void 0 : companySettings.city, companySettings === null || companySettings === void 0 ? void 0 : companySettings.state, companySettings === null || companySettings === void 0 ? void 0 : companySettings.zip_code].filter(Boolean).join(', ')] }))] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Bill To" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: (_f = invoice.accounts) === null || _f === void 0 ? void 0 : _f.name }), ((_g = invoice.accounts) === null || _g === void 0 ? void 0 : _g.address) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("div", { children: [invoice.accounts.address, invoice.accounts.city, invoice.accounts.state, invoice.accounts.zip_code]
                                                                        .filter(Boolean).join(', ') })] })), ((_h = invoice.accounts) === null || _h === void 0 ? void 0 : _h.email) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4 mr-2" }), invoice.accounts.email] })), ((_j = invoice.accounts) === null || _j === void 0 ? void 0 : _j.phone) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4 mr-2" }), invoice.accounts.phone] }))] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-blue-50 p-4 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-blue-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-blue-600 font-medium", children: "Issue Date" }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-800 font-semibold", children: new Date(invoice.issue_date).toLocaleDateString() })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-orange-50 p-4 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-orange-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-orange-600 font-medium", children: "Due Date" }), (0, jsx_runtime_1.jsx)("div", { className: "text-orange-800 font-semibold", children: new Date(invoice.due_date).toLocaleDateString() })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-green-50 p-4 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-5 h-5 text-green-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-green-600 font-medium", children: "Total Amount" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-green-800 font-bold text-lg", children: ["$", Number(invoice.total_amount).toFixed(2)] })] })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Services" }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-2 font-medium text-gray-700", children: "Description" }), (0, jsx_runtime_1.jsx)("th", { className: "text-center py-3 px-2 font-medium text-gray-700", children: "Qty" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-2 font-medium text-gray-700", children: "Unit Price" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-2 font-medium text-gray-700", children: "Total" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: (_k = invoice.InvoiceItem) === null || _k === void 0 ? void 0 : _k.map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-2", children: (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: item.description }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-2 text-center", children: item.quantity }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-2 text-right", children: ["$", Number(item.unit_price).toFixed(2)] }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-2 text-right font-medium", children: ["$", Number(item.total_price).toFixed(2)] })] }, index)); }) }), (0, jsx_runtime_1.jsxs)("tfoot", { children: [(0, jsx_runtime_1.jsxs)("tr", { className: "border-t-2 border-gray-300", children: [(0, jsx_runtime_1.jsx)("td", { colSpan: 3, className: "py-3 px-2 text-right font-semibold", children: "Subtotal:" }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-2 text-right font-semibold", children: ["$", Number(invoice.subtotal).toFixed(2)] })] }), Number(invoice.tax_amount) > 0 && ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { colSpan: 3, className: "py-2 px-2 text-right", children: "Tax:" }), (0, jsx_runtime_1.jsxs)("td", { className: "py-2 px-2 text-right", children: ["$", Number(invoice.tax_amount).toFixed(2)] })] })), (0, jsx_runtime_1.jsxs)("tr", { className: "border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("td", { colSpan: 3, className: "py-3 px-2 text-right font-bold text-lg", children: "Total:" }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-2 text-right font-bold text-lg text-purple-800", children: ["$", Number(invoice.total_amount).toFixed(2)] })] })] })] }) })] }) }), invoice.notes && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "mt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-3", children: "Notes" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-700", children: invoice.notes })] }) })), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "mt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-5 h-5 mr-2 text-purple-600" }), "Payment History"] }), payments.length > 0 && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: [payments.length, " payment", payments.length !== 1 ? 's' : ''] }))] }), paymentsLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5 text-gray-400 animate-spin mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Loading payment history..." })] })) : payments.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "No payments recorded for this invoice" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: payments.map(function (payment) {
                                                var _a;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg bg-green-100 text-green-700", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["$", Number(payment.amount).toFixed(2)] }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700", children: "Completed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 mt-1", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-3 h-3 mr-1" }), new Date(payment.payment_date).toLocaleDateString()] }), payment.payment_methods && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-3 h-3 mr-1" }), ((_a = payment.payment_methods.payment_type) === null || _a === void 0 ? void 0 : _a.replace('_', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); })) || 'Payment'] })), payment.reference_number && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500 font-mono", children: [payment.reference_number.substring(0, 8), "..."] }))] })] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4 text-gray-400" })] }, payment.id));
                                            }) })), payments.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-6 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-1", children: "Total Paid" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-bold text-green-700", children: ["$", payments
                                                                        .reduce(function (sum, p) { return sum + Number(p.amount); }, 0)
                                                                        .toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-1", children: "Balance Due" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-bold text-orange-700", children: ["$", (Number(invoice.total_amount) - payments
                                                                        .reduce(function (sum, p) { return sum + Number(p.amount); }, 0))
                                                                        .toFixed(2)] })] })] }) }))] }) })] }) }), isPayable && ((0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-200 p-6 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "font-semibold", children: ["Amount Due: $", Number(invoice.total_amount).toFixed(2)] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Due ", new Date(invoice.due_date).toLocaleDateString()] })] }), onPayNow && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "lg", onClick: onPayNow, icon: lucide_react_1.CreditCard, className: "shadow-lg", children: "Pay Now" }))] }) }))] }) }));
}
