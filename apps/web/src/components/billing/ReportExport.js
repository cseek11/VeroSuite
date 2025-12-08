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
exports.default = ReportExport;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var CRMComponents_1 = require("@/components/ui/CRMComponents");
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var jspdf_1 = __importDefault(require("jspdf"));
function ReportExport(_a) {
    var _this = this;
    var _b = _a.defaultReportType, defaultReportType = _b === void 0 ? 'pl' : _b, onExportComplete = _a.onExportComplete;
    var _c = (0, react_1.useState)(defaultReportType), reportType = _c[0], setReportType = _c[1];
    var getStartOfYear = function () {
        var date = new Date(new Date().getFullYear(), 0, 1);
        var iso = date.toISOString().split('T')[0];
        return iso || '';
    };
    var getToday = function () {
        var iso = new Date().toISOString().split('T')[0];
        return iso || '';
    };
    var _d = (0, react_1.useState)(getStartOfYear()), startDate = _d[0], setStartDate = _d[1];
    var _e = (0, react_1.useState)(getToday()), endDate = _e[0], setEndDate = _e[1];
    var _f = (0, react_1.useState)(getToday()), asOfDate = _f[0], setAsOfDate = _f[1];
    var _g = (0, react_1.useState)(false), isExporting = _g[0], setIsExporting = _g[1];
    // Fetch P&L report data
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'pl-report', startDate !== null && startDate !== void 0 ? startDate : '', endDate !== null && endDate !== void 0 ? endDate : ''],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // TODO: Implement getPLReport in billing API
                    // For now, return empty data structure
                    logger_1.logger.warn('P&L report API not implemented', {}, 'ReportExport');
                    return [2 /*return*/, {
                            totalRevenue: 0,
                            totalExpenses: 0,
                            netIncome: 0,
                            monthlyBreakdown: []
                        }];
                }
                catch (error) {
                    logger_1.logger.error('Failed to fetch P&L report data', error, 'ReportExport');
                    toast_1.toast.error('Failed to load P&L report data. Please try again.');
                    throw error;
                }
                return [2 /*return*/];
            });
        }); },
        enabled: reportType === 'pl' && !!startDate && !!endDate,
    }), plData = _h.data, plLoading = _h.isLoading, plError = _h.error;
    // Fetch AR aging report data
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'ar-aging-report', asOfDate !== null && asOfDate !== void 0 ? asOfDate : ''],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // TODO: Implement getARAgingReport in billing API
                    // For now, return empty data structure
                    logger_1.logger.warn('AR aging report API not implemented', {}, 'ReportExport');
                    return [2 /*return*/, {
                            totalAR: 0,
                            agingBuckets: {
                                '0-30': 0,
                                '31-60': 0,
                                '61-90': 0,
                                '90+': 0
                            },
                            invoiceDetails: [],
                            customerBreakdown: []
                        }];
                }
                catch (error) {
                    logger_1.logger.error('Failed to fetch AR aging report data', error, 'ReportExport');
                    toast_1.toast.error('Failed to load AR aging report data. Please try again.');
                    throw error;
                }
                return [2 /*return*/];
            });
        }); },
        enabled: reportType === 'ar-aging' && !!asOfDate,
    }), arAgingData = _j.data, arAgingLoading = _j.isLoading, arAgingError = _j.error;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };
    var formatDate = function (date) {
        if (!date)
            return 'Invalid Date';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    var handleExportCSV = function () { return __awaiter(_this, void 0, void 0, function () {
        var csvContent, filename, errorMsg, headers, rows, errorMsg, headers, rows, blob, url, a, errorMessage;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            setIsExporting(true);
            try {
                csvContent = '';
                filename = '';
                if (reportType === 'pl') {
                    if (!plData) {
                        errorMsg = "Cannot export P&L report: No data available for period ".concat(startDate, " to ").concat(endDate, ". Please wait for data to load or adjust the date range.");
                        logger_1.logger.warn(errorMsg, { startDate: startDate, endDate: endDate }, 'ReportExport');
                        toast_1.toast.error('P&L report data not available. Please wait for data to load or adjust the date range.');
                        setIsExporting(false);
                        return [2 /*return*/];
                    }
                    headers = ['Month', 'Revenue', 'Expenses', 'Net Income'];
                    rows = ((_a = plData.monthlyBreakdown) === null || _a === void 0 ? void 0 : _a.map(function (month) { return [
                        month.month,
                        formatCurrency(month.revenue || 0),
                        formatCurrency(month.expenses || 0),
                        formatCurrency(month.netIncome || 0),
                    ]; })) || [];
                    csvContent = __spreadArray([
                        'Profit & Loss Report',
                        "Generated: ".concat(new Date().toLocaleDateString()),
                        "Period: ".concat(formatDate(startDate), " - ").concat(formatDate(endDate)),
                        '',
                        "Total Revenue: ".concat(formatCurrency(plData.totalRevenue || 0)),
                        "Total Expenses: ".concat(formatCurrency(plData.totalExpenses || 0)),
                        "Net Income: ".concat(formatCurrency(plData.netIncome || 0)),
                        '',
                        headers.join(',')
                    ], rows.map(function (row) { return row.map(function (cell) { return "\"".concat(String(cell).replace(/"/g, '""'), "\""); }).join(','); }), true).join('\n');
                    filename = "P&L-Report-".concat(startDate, "-").concat(endDate, ".csv");
                }
                else if (reportType === 'ar-aging') {
                    if (!arAgingData) {
                        errorMsg = "Cannot export AR aging report: No data available as of ".concat(asOfDate, ". Please wait for data to load.");
                        logger_1.logger.warn(errorMsg, { asOfDate: asOfDate }, 'ReportExport');
                        toast_1.toast.error('AR aging report data not available. Please wait for data to load.');
                        setIsExporting(false);
                        return [2 /*return*/];
                    }
                    headers = ['Invoice Number', 'Customer Name', 'Amount', 'Balance Due', 'Due Date', 'Days Past Due', 'Aging Bucket'];
                    rows = ((_b = arAgingData.invoiceDetails) === null || _b === void 0 ? void 0 : _b.map(function (invoice) {
                        var _a;
                        return [
                            invoice.invoiceNumber,
                            invoice.customerName,
                            formatCurrency(invoice.amount || 0),
                            formatCurrency(invoice.balanceDue || 0),
                            invoice.dueDate,
                            ((_a = invoice.daysPastDue) === null || _a === void 0 ? void 0 : _a.toString()) || '0',
                            invoice.agingBucket,
                        ];
                    })) || [];
                    csvContent = __spreadArray([
                        'AR Aging Report',
                        "Generated: ".concat(new Date().toLocaleDateString()),
                        "As of: ".concat(formatDate(asOfDate)),
                        '',
                        "Total AR: ".concat(formatCurrency(arAgingData.totalAR || 0)),
                        "Aging Buckets:",
                        "0-30 days: ".concat(formatCurrency(((_c = arAgingData.agingBuckets) === null || _c === void 0 ? void 0 : _c['0-30']) || 0)),
                        "31-60 days: ".concat(formatCurrency(((_d = arAgingData.agingBuckets) === null || _d === void 0 ? void 0 : _d['31-60']) || 0)),
                        "61-90 days: ".concat(formatCurrency(((_e = arAgingData.agingBuckets) === null || _e === void 0 ? void 0 : _e['61-90']) || 0)),
                        "90+ days: ".concat(formatCurrency(((_f = arAgingData.agingBuckets) === null || _f === void 0 ? void 0 : _f['90+']) || 0)),
                        '',
                        headers.join(',')
                    ], rows.map(function (row) { return row.map(function (cell) { return "\"".concat(String(cell).replace(/"/g, '""'), "\""); }).join(','); }), true).join('\n');
                    filename = "AR-Aging-Report-".concat(asOfDate, ".csv");
                }
                blob = new Blob([csvContent], { type: 'text/csv' });
                url = URL.createObjectURL(blob);
                a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                logger_1.logger.debug('Report exported to CSV', { reportType: reportType, filename: filename }, 'ReportExport');
                toast_1.toast.success("".concat(reportType === 'pl' ? 'P&L' : 'AR Aging', " report exported successfully"));
                onExportComplete === null || onExportComplete === void 0 ? void 0 : onExportComplete(reportType, 'csv');
            }
            catch (error) {
                errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                logger_1.logger.error("Failed to export ".concat(reportType === 'pl' ? 'P&L' : 'AR Aging', " report to CSV: ").concat(errorMessage), error, 'ReportExport');
                toast_1.toast.error("Failed to export report. ".concat(errorMessage, ". Please try again."));
            }
            finally {
                setIsExporting(false);
            }
            return [2 /*return*/];
        });
    }); };
    var handleExportPDF = function () { return __awaiter(_this, void 0, void 0, function () {
        var doc_1, pageWidth, margin_1, yPos_1, errorMsg, errorMsg, errorMessage;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            setIsExporting(true);
            try {
                doc_1 = new jspdf_1.default();
                pageWidth = doc_1.internal.pageSize.getWidth();
                margin_1 = 20;
                yPos_1 = margin_1;
                if (reportType === 'pl') {
                    if (!plData) {
                        errorMsg = "Cannot export P&L report: No data available for period ".concat(startDate, " to ").concat(endDate, ". Please wait for data to load or adjust the date range.");
                        logger_1.logger.warn(errorMsg, { startDate: startDate, endDate: endDate }, 'ReportExport');
                        toast_1.toast.error('P&L report data not available. Please wait for data to load or adjust the date range.');
                        setIsExporting(false);
                        return [2 /*return*/];
                    }
                    // Title
                    doc_1.setFontSize(18);
                    doc_1.text('Profit & Loss Report', pageWidth / 2, yPos_1, { align: 'center' });
                    yPos_1 += 10;
                    // Period
                    doc_1.setFontSize(12);
                    doc_1.text("Period: ".concat(formatDate(startDate), " - ").concat(formatDate(endDate)), margin_1, yPos_1);
                    yPos_1 += 8;
                    doc_1.text("Generated: ".concat(new Date().toLocaleDateString()), margin_1, yPos_1);
                    yPos_1 += 15;
                    // Summary
                    doc_1.setFontSize(14);
                    doc_1.text('Summary', margin_1, yPos_1);
                    yPos_1 += 8;
                    doc_1.setFontSize(11);
                    doc_1.text("Total Revenue: ".concat(formatCurrency(plData.totalRevenue || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 7;
                    doc_1.text("Total Expenses: ".concat(formatCurrency(plData.totalExpenses || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 7;
                    doc_1.setFontSize(12);
                    doc_1.text("Net Income: ".concat(formatCurrency(plData.netIncome || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 15;
                    // Monthly Breakdown
                    if (plData.monthlyBreakdown && plData.monthlyBreakdown.length > 0) {
                        doc_1.setFontSize(14);
                        doc_1.text('Monthly Breakdown', margin_1, yPos_1);
                        yPos_1 += 8;
                        doc_1.setFontSize(10);
                        plData.monthlyBreakdown.forEach(function (month) {
                            if (yPos_1 > doc_1.internal.pageSize.getHeight() - 30) {
                                doc_1.addPage();
                                yPos_1 = margin_1;
                            }
                            doc_1.text("".concat(month.month, ": ").concat(formatCurrency(month.revenue || 0)), margin_1 + 5, yPos_1);
                            yPos_1 += 6;
                        });
                    }
                    doc_1.save("P&L-Report-".concat(startDate, "-").concat(endDate, ".pdf"));
                }
                else if (reportType === 'ar-aging') {
                    if (!arAgingData) {
                        errorMsg = "Cannot export AR aging report: No data available as of ".concat(asOfDate, ". Please wait for data to load.");
                        logger_1.logger.warn(errorMsg, { asOfDate: asOfDate }, 'ReportExport');
                        toast_1.toast.error('AR aging report data not available. Please wait for data to load.');
                        setIsExporting(false);
                        return [2 /*return*/];
                    }
                    // Title
                    doc_1.setFontSize(18);
                    doc_1.text('AR Aging Report', pageWidth / 2, yPos_1, { align: 'center' });
                    yPos_1 += 10;
                    // As of date
                    doc_1.setFontSize(12);
                    doc_1.text("As of: ".concat(formatDate(asOfDate)), margin_1, yPos_1);
                    yPos_1 += 8;
                    doc_1.text("Generated: ".concat(new Date().toLocaleDateString()), margin_1, yPos_1);
                    yPos_1 += 15;
                    // Summary
                    doc_1.setFontSize(14);
                    doc_1.text('Summary', margin_1, yPos_1);
                    yPos_1 += 8;
                    doc_1.setFontSize(11);
                    doc_1.text("Total AR: ".concat(formatCurrency(arAgingData.totalAR || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 10;
                    // Aging Buckets
                    doc_1.setFontSize(12);
                    doc_1.text('Aging Buckets', margin_1, yPos_1);
                    yPos_1 += 8;
                    doc_1.setFontSize(10);
                    doc_1.text("0-30 days: ".concat(formatCurrency(((_a = arAgingData.agingBuckets) === null || _a === void 0 ? void 0 : _a['0-30']) || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 6;
                    doc_1.text("31-60 days: ".concat(formatCurrency(((_b = arAgingData.agingBuckets) === null || _b === void 0 ? void 0 : _b['31-60']) || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 6;
                    doc_1.text("61-90 days: ".concat(formatCurrency(((_c = arAgingData.agingBuckets) === null || _c === void 0 ? void 0 : _c['61-90']) || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 6;
                    doc_1.text("90+ days: ".concat(formatCurrency(((_d = arAgingData.agingBuckets) === null || _d === void 0 ? void 0 : _d['90+']) || 0)), margin_1 + 5, yPos_1);
                    yPos_1 += 10;
                    // Customer Breakdown (first page only, truncated)
                    if (arAgingData.customerBreakdown && arAgingData.customerBreakdown.length > 0) {
                        doc_1.setFontSize(12);
                        doc_1.text('Top Customers', margin_1, yPos_1);
                        yPos_1 += 8;
                        doc_1.setFontSize(10);
                        arAgingData.customerBreakdown.slice(0, 10).forEach(function (customer) {
                            if (yPos_1 > doc_1.internal.pageSize.getHeight() - 30) {
                                doc_1.addPage();
                                yPos_1 = margin_1;
                            }
                            doc_1.text("".concat(customer.customerName, ": ").concat(formatCurrency(customer.totalAR || 0)), margin_1 + 5, yPos_1);
                            yPos_1 += 6;
                        });
                    }
                    doc_1.save("AR-Aging-Report-".concat(asOfDate, ".pdf"));
                }
                logger_1.logger.debug('Report exported to PDF', { reportType: reportType }, 'ReportExport');
                toast_1.toast.success("".concat(reportType === 'pl' ? 'P&L' : 'AR Aging', " report exported successfully"));
                onExportComplete === null || onExportComplete === void 0 ? void 0 : onExportComplete(reportType, 'pdf');
            }
            catch (error) {
                errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                logger_1.logger.error("Failed to export ".concat(reportType === 'pl' ? 'P&L' : 'AR Aging', " report to PDF: ").concat(errorMessage), error, 'ReportExport');
                toast_1.toast.error("Failed to export report. ".concat(errorMessage, ". Please try again."));
            }
            finally {
                setIsExporting(false);
            }
            return [2 /*return*/];
        });
    }); };
    var isLoading = reportType === 'pl' ? plLoading : arAgingLoading;
    var error = reportType === 'pl' ? plError : arAgingError;
    var hasData = reportType === 'pl' ? !!plData : !!arAgingData;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Report Export" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Export financial reports in CSV or PDF format" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium text-gray-700 mb-2 block", children: "Report Type" }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.Select, { value: reportType, onValueChange: function (value) { return setReportType(value); }, children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectTrigger, { className: "w-full", children: (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "pl", children: "Profit & Loss (P&L)" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "ar-aging", children: "AR Aging Report" })] })] })] }), reportType === 'pl' ? ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium text-gray-700 mb-2 block", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium text-gray-700 mb-2 block", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); } })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium text-gray-700 mb-2 block", children: "As of Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: asOfDate, onChange: function (e) { return setAsOfDate(e.target.value); } })] })), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-900", children: "Failed to load report data. Please try again." })] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Download, onClick: handleExportCSV, disabled: isLoading || isExporting || !hasData, children: isExporting ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Exporting..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 mr-2" }), "Export CSV"] })) }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleExportPDF, disabled: isLoading || isExporting || !hasData, children: isExporting ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Exporting..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 mr-2" }), "Export PDF"] })) })] })] }) }) }), isLoading && ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading report data..." })] }) }) }))] }));
}
