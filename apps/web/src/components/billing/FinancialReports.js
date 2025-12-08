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
exports.default = FinancialReports;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var CRMComponents_1 = require("@/components/ui/CRMComponents");
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var jspdf_1 = __importDefault(require("jspdf"));
function FinancialReports(_a) {
    var _this = this;
    var _b, _c;
    var onReportGenerated = _a.onReportGenerated;
    var _d = (0, react_1.useState)('financial-summary'), reportType = _d[0], setReportType = _d[1];
    var _e = (0, react_1.useState)(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]), startDate = _e[0], setStartDate = _e[1];
    var _f = (0, react_1.useState)(new Date().toISOString().split('T')[0]), endDate = _f[0], setEndDate = _f[1];
    var _g = (0, react_1.useState)(false), isGenerating = _g[0], setIsGenerating = _g[1];
    // Fetch data for reports
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'ar-summary'],
        queryFn: function () { return enhanced_api_1.billing.getARSummary(); },
        enabled: reportType === 'ar-summary' || reportType === 'financial-summary',
    }), arSummary = _h.data, arLoading = _h.isLoading;
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'revenue-analytics', startDate, endDate],
        queryFn: function () { return enhanced_api_1.billing.getRevenueAnalytics(startDate, endDate); },
        enabled: (reportType === 'revenue-analytics' || reportType === 'financial-summary') &&
            !!startDate &&
            !!endDate,
    }), revenueData = _j.data, revenueLoading = _j.isLoading;
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-analytics', startDate, endDate],
        queryFn: function () { return enhanced_api_1.billing.getPaymentAnalytics(startDate, endDate); },
        enabled: (reportType === 'payment-analytics' || reportType === 'financial-summary') &&
            !!startDate &&
            !!endDate,
    }), paymentAnalytics = _k.data, paymentLoading = _k.isLoading;
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'overdue-invoices'],
        queryFn: function () { return enhanced_api_1.billing.getOverdueInvoices(); },
        enabled: reportType === 'overdue-invoices' || reportType === 'financial-summary',
    }), overdueInvoices = _l.data, overdueLoading = _l.isLoading;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };
    // Helper function for date formatting (currently unused but kept for future use)
    // const formatDate = (date: string) => {
    //   return new Date(date).toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //   });
    // };
    var generatePDF = function (content, filename) { return __awaiter(_this, void 0, void 0, function () {
        var pdf, pageWidth, pageHeight, margin, maxWidth, lines, y, lineHeight, _i, lines_1, line, errorMessage;
        return __generator(this, function (_a) {
            try {
                pdf = new jspdf_1.default();
                pageWidth = pdf.internal.pageSize.getWidth();
                pageHeight = pdf.internal.pageSize.getHeight();
                margin = 20;
                maxWidth = pageWidth - 2 * margin;
                lines = pdf.splitTextToSize(content, maxWidth);
                y = margin;
                lineHeight = 7;
                pdf.setFontSize(16);
                pdf.text('Financial Report', margin, y);
                y += lineHeight * 2;
                pdf.setFontSize(10);
                pdf.text("Generated: ".concat(new Date().toLocaleString()), margin, y);
                y += lineHeight * 2;
                pdf.setFontSize(12);
                for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    line = lines_1[_i];
                    if (y > pageHeight - margin) {
                        pdf.addPage();
                        y = margin;
                    }
                    pdf.text(line, margin, y);
                    y += lineHeight;
                }
                pdf.save(filename);
                toast_1.toast.success('PDF report generated successfully');
                logger_1.logger.debug('PDF report generated', { filename: filename }, 'FinancialReports');
            }
            catch (error) {
                errorMessage = error instanceof Error ? error.message : 'Unknown error';
                logger_1.logger.error("Failed to generate PDF report \"".concat(filename, "\". ").concat(errorMessage, ". Please check browser permissions and try again."), error, 'FinancialReports');
                toast_1.toast.error("Failed to generate PDF report. ".concat(errorMessage, ". Please try again or use CSV export as an alternative."));
            }
            return [2 /*return*/];
        });
    }); };
    var generateCSV = function (data, filename) {
        try {
            if (!data || data.length === 0) {
                var errorMsg = "Cannot export CSV: No data available for ".concat(reportType, " report. Please ensure data is loaded before exporting.");
                logger_1.logger.warn(errorMsg, { reportType: reportType, filename: filename }, 'FinancialReports');
                toast_1.toast.error('No data to export. Please ensure the report has data before exporting.');
                return;
            }
            var headers_1 = Object.keys(data[0]);
            var csvRows = __spreadArray([
                headers_1.join(',')
            ], data.map(function (row) {
                return headers_1
                    .map(function (header) {
                    var value = row[header];
                    return typeof value === 'string' && value.includes(',')
                        ? "\"".concat(value, "\"")
                        : value;
                })
                    .join(',');
            }), true);
            var csvContent = csvRows.join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast_1.toast.success('CSV report exported successfully');
            logger_1.logger.debug('CSV report exported', { filename: filename, rowCount: data.length }, 'FinancialReports');
        }
        catch (error) {
            var errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error("Failed to export CSV report \"".concat(filename, "\" for ").concat(reportType, ". ").concat(errorMessage, ". Please check browser download permissions and try again."), error, 'FinancialReports');
            toast_1.toast.error("Failed to export CSV report. ".concat(errorMessage, ". Please try again or contact support if the issue persists."));
        }
    };
    var handleExport = function (format) { return __awaiter(_this, void 0, void 0, function () {
        var content_1, filename, csvData, errorMsg, errorMsg, errorMsg, errorMsg, error_1, csvContent, blob, url, a, error_2, errorMessage;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setIsGenerating(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, 9, 10]);
                    content_1 = '';
                    filename = '';
                    csvData = [];
                    switch (reportType) {
                        case 'ar-summary':
                            if (!arSummary) {
                                errorMsg = 'Cannot export AR summary: Data not loaded. Please wait for data to load or refresh the page.';
                                logger_1.logger.warn(errorMsg, { reportType: reportType, format: format }, 'FinancialReports');
                                toast_1.toast.error('AR summary data not available. Please wait for data to load or refresh the page.');
                                setIsGenerating(false);
                                return [2 /*return*/];
                            }
                            content_1 = "Accounts Receivable Summary\n\n";
                            content_1 += "Total AR: ".concat(formatCurrency(arSummary.totalAR || 0), "\n");
                            content_1 += "Total Customers: ".concat(arSummary.totalCustomers || 0, "\n");
                            content_1 += "Total Invoices: ".concat(arSummary.totalInvoices || 0, "\n\n");
                            content_1 += "Aging Buckets:\n";
                            if (arSummary.agingBuckets) {
                                Object.entries(arSummary.agingBuckets).forEach(function (_a) {
                                    var bucket = _a[0], amount = _a[1];
                                    content_1 += "".concat(bucket, ": ").concat(formatCurrency(Number(amount || 0)), "\n");
                                });
                            }
                            filename = "ar-summary-".concat(new Date().toISOString().split('T')[0], ".").concat(format);
                            break;
                        case 'revenue-analytics':
                            if (!revenueData) {
                                errorMsg = "Cannot export revenue analytics: Data not loaded for period ".concat(startDate, " to ").concat(endDate, ". Please wait for data to load or adjust the date range.");
                                logger_1.logger.warn(errorMsg, { reportType: reportType, format: format, startDate: startDate, endDate: endDate }, 'FinancialReports');
                                toast_1.toast.error('Revenue analytics data not available. Please wait for data to load or adjust the date range.');
                                setIsGenerating(false);
                                return [2 /*return*/];
                            }
                            content_1 = "Revenue Analytics Report\n\n";
                            content_1 += "Period: ".concat(startDate, " to ").concat(endDate, "\n\n");
                            content_1 += "Total Revenue: ".concat(formatCurrency(revenueData.totalRevenue || 0), "\n");
                            content_1 += "Growth Rate: ".concat(((_a = revenueData.growthRate) === null || _a === void 0 ? void 0 : _a.toFixed(1)) || 0, "%\n\n");
                            content_1 += "Monthly Revenue:\n";
                            if (revenueData.monthlyRevenue) {
                                revenueData.monthlyRevenue.forEach(function (item) {
                                    content_1 += "".concat(item.month, ": ").concat(formatCurrency(Number(item.revenue || 0)), "\n");
                                });
                            }
                            filename = "revenue-analytics-".concat(startDate, "-to-").concat(endDate, ".").concat(format);
                            csvData = (revenueData.monthlyRevenue || []).map(function (item) { return ({
                                month: item.month,
                                revenue: formatCurrency(Number(item.revenue || 0)),
                            }); });
                            break;
                        case 'payment-analytics':
                            if (!paymentAnalytics) {
                                errorMsg = "Cannot export payment analytics: Data not loaded for period ".concat(startDate, " to ").concat(endDate, ". Please wait for data to load or adjust the date range.");
                                logger_1.logger.warn(errorMsg, { reportType: reportType, format: format, startDate: startDate, endDate: endDate }, 'FinancialReports');
                                toast_1.toast.error('Payment analytics data not available. Please wait for data to load or adjust the date range.');
                                setIsGenerating(false);
                                return [2 /*return*/];
                            }
                            content_1 = "Payment Analytics Report\n\n";
                            content_1 += "Period: ".concat(startDate, " to ").concat(endDate, "\n\n");
                            if (paymentAnalytics.summary) {
                                content_1 += "Total Payments: ".concat(paymentAnalytics.summary.totalPayments || 0, "\n");
                                content_1 += "Total Amount: ".concat(formatCurrency(paymentAnalytics.summary.totalAmount || 0), "\n");
                                content_1 += "Success Rate: ".concat(((_b = paymentAnalytics.summary.successRate) === null || _b === void 0 ? void 0 : _b.toFixed(1)) || 0, "%\n\n");
                            }
                            filename = "payment-analytics-".concat(startDate, "-to-").concat(endDate, ".").concat(format);
                            break;
                        case 'overdue-invoices':
                            if (!overdueInvoices || overdueInvoices.length === 0) {
                                errorMsg = 'Cannot export overdue invoices: No overdue invoices found. This may indicate all invoices are current.';
                                logger_1.logger.info(errorMsg, { reportType: reportType, format: format }, 'FinancialReports');
                                toast_1.toast.info('No overdue invoices to export. All invoices appear to be current.');
                                setIsGenerating(false);
                                return [2 /*return*/];
                            }
                            content_1 = "Overdue Invoices Report\n\n";
                            content_1 += "Total Overdue: ".concat(overdueInvoices.length, " invoices\n\n");
                            overdueInvoices.forEach(function (invoice) {
                                content_1 += "".concat(invoice.invoice_number || 'N/A', ": ").concat(formatCurrency(Number(invoice.balanceDue || 0)), " - ").concat(invoice.daysPastDue || 0, " days overdue\n");
                            });
                            filename = "overdue-invoices-".concat(new Date().toISOString().split('T')[0], ".").concat(format);
                            csvData = overdueInvoices.map(function (invoice) { return ({
                                invoice_number: invoice.invoice_number,
                                customer: invoice.customerName || 'N/A',
                                balance_due: formatCurrency(Number(invoice.balanceDue || 0)),
                                days_past_due: invoice.daysPastDue || 0,
                                due_date: invoice.due_date || 'N/A',
                            }); });
                            break;
                        case 'financial-summary':
                            content_1 = "Financial Summary Report\n\n";
                            content_1 += "Generated: ".concat(new Date().toLocaleString(), "\n");
                            content_1 += "Period: ".concat(startDate, " to ").concat(endDate, "\n\n");
                            content_1 += "=== Accounts Receivable ===\n";
                            if (arSummary) {
                                content_1 += "Total AR: ".concat(formatCurrency(arSummary.totalAR || 0), "\n");
                                content_1 += "Total Customers: ".concat(arSummary.totalCustomers || 0, "\n");
                            }
                            content_1 += "\n=== Revenue ===\n";
                            if (revenueData) {
                                content_1 += "Total Revenue: ".concat(formatCurrency(revenueData.totalRevenue || 0), "\n");
                                content_1 += "Growth Rate: ".concat(((_c = revenueData.growthRate) === null || _c === void 0 ? void 0 : _c.toFixed(1)) || 0, "%\n");
                            }
                            content_1 += "\n=== Overdue Invoices ===\n";
                            if (overdueInvoices) {
                                content_1 += "Total Overdue: ".concat(overdueInvoices.length, " invoices\n");
                            }
                            filename = "financial-summary-".concat(startDate, "-to-").concat(endDate, ".").concat(format);
                            break;
                    }
                    if (!(format === 'pdf')) return [3 /*break*/, 6];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, generatePDF(content_1, filename)];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _d.sent();
                    logger_1.logger.error('PDF generation failed', error_1, 'FinancialReports');
                    throw error_1;
                case 5: return [3 /*break*/, 7];
                case 6:
                    if (format === 'csv') {
                        if (csvData.length > 0) {
                            generateCSV(csvData, filename);
                        }
                        else {
                            csvContent = content_1.split('\n').join('\n');
                            blob = new Blob([csvContent], { type: 'text/csv' });
                            url = URL.createObjectURL(blob);
                            a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            toast_1.toast.success('CSV report exported successfully');
                        }
                    }
                    else {
                        // Excel format - export as CSV (browser limitation)
                        generateCSV(csvData.length > 0 ? csvData : [{ content: content_1 }], filename.replace('.excel', '.csv'));
                    }
                    _d.label = 7;
                case 7:
                    if (onReportGenerated) {
                        onReportGenerated(reportType, format);
                    }
                    return [3 /*break*/, 10];
                case 8:
                    error_2 = _d.sent();
                    errorMessage = error_2 instanceof Error ? error_2.message : 'Unknown error';
                    logger_1.logger.error("Failed to generate ".concat(reportType, " report as ").concat(format.toUpperCase(), ". ").concat(errorMessage, ". Please check your browser settings and try again. If the issue persists, try a different export format."), error_2, 'FinancialReports');
                    toast_1.toast.error("Failed to generate ".concat(format.toUpperCase(), " report. ").concat(errorMessage, ". Please try again or use a different export format."));
                    throw error_2;
                case 9:
                    setIsGenerating(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var isLoading = arLoading || revenueLoading || paymentLoading || overdueLoading || isGenerating;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 mr-2 text-purple-600" }), "Financial Reports"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-1", children: "Generate and export financial reports" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700 mb-2 block", children: "Report Type" }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.Select, { value: reportType, onValueChange: function (value) { return setReportType(value); }, children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectValue, { placeholder: "Select report type" }) }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "financial-summary", children: "Financial Summary" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "ar-summary", children: "AR Summary" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "revenue-analytics", children: "Revenue Analytics" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "payment-analytics", children: "Payment Analytics" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "overdue-invoices", children: "Overdue Invoices" })] })] })] }), (reportType === 'revenue-analytics' ||
                                    reportType === 'payment-analytics' ||
                                    reportType === 'financial-summary') && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700 mb-2 block", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700 mb-2 block", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); } })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Download, onClick: function () { return handleExport('pdf'); }, disabled: isLoading, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Generating..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 mr-2" }), "Export PDF"] })) }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: function () { return handleExport('csv'); }, disabled: isLoading, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: function () { return handleExport('excel'); }, disabled: isLoading, children: "Export Excel" })] })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Report Preview" }), isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-6 h-6 animate-spin text-purple-600 mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Loading report data..." })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [reportType === 'ar-summary' && arSummary && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["Total AR: ", formatCurrency(arSummary.totalAR || 0)] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: [arSummary.totalCustomers || 0, " customers, ", arSummary.totalInvoices || 0, ' ', "invoices"] })] })), reportType === 'revenue-analytics' && revenueData && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["Total Revenue: ", formatCurrency(revenueData.totalRevenue || 0)] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Growth Rate: ", ((_b = revenueData.growthRate) === null || _b === void 0 ? void 0 : _b.toFixed(1)) || 0, "%"] })] })), reportType === 'overdue-invoices' && overdueInvoices && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: [overdueInvoices.length, " overdue invoices"] }) })), reportType === 'financial-summary' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [arSummary && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["AR: ", formatCurrency(arSummary.totalAR || 0)] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: [arSummary.totalCustomers || 0, " customers"] })] })), revenueData && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["Revenue: ", formatCurrency(revenueData.totalRevenue || 0)] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Growth: ", ((_c = revenueData.growthRate) === null || _c === void 0 ? void 0 : _c.toFixed(1)) || 0, "%"] })] })), overdueInvoices && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["Overdue: ", overdueInvoices.length, " invoices"] }) }))] }))] }))] }) })] }));
}
