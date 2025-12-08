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
exports.default = ReportCard;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Report Card Component
 *
 * Dashboard card for generating reports by dragging customers onto it.
 * Supports drag-and-drop interactions with Customer Search Card.
 */
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var components_1 = require("@/routes/dashboard/components");
// Note: useAuthStore not currently used
var logger_1 = require("@/utils/logger");
// Available report types for customer reports
var customerReportTypes = [
    { id: 'customer-summary', name: 'Customer Summary', description: 'Complete customer information and history' },
    { id: 'customer-jobs', name: 'Job History', description: 'All jobs and services for this customer' },
    { id: 'customer-invoices', name: 'Invoice History', description: 'All invoices and payments' },
    { id: 'customer-ltv', name: 'Lifetime Value', description: 'Customer lifetime value analysis' },
];
function ReportCard(_a) {
    var _this = this;
    var _b = _a.cardId, cardId = _b === void 0 ? 'report-card' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    // Note: user not currently used
    var _d = (0, react_1.useState)(null), selectedReportType = _d[0], setSelectedReportType = _d[1];
    var _e = (0, react_1.useState)([]), generatedReports = _e[0], setGeneratedReports = _e[1];
    var _f = (0, react_1.useState)(false), isGenerating = _f[0], setIsGenerating = _f[1];
    // Handle report generation
    var handleGenerateReport = (0, react_1.useCallback)(function (customer, reportType) { return __awaiter(_this, void 0, void 0, function () {
        var reportId, newReport, reportUrl_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsGenerating(true);
                    reportId = "report-".concat(Date.now());
                    newReport = {
                        id: reportId,
                        type: reportType,
                        customerId: customer.id,
                        customerName: customer.name,
                        status: 'generating',
                        createdAt: new Date(),
                    };
                    setGeneratedReports(function (prev) { return __spreadArray([newReport], prev, true); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Simulate report generation (replace with actual API call)
                    // TODO: Replace with actual report generation API
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 2:
                    // Simulate report generation (replace with actual API call)
                    // TODO: Replace with actual report generation API
                    _a.sent();
                    reportUrl_1 = "/reports/view/".concat(reportId, "?customerId=").concat(customer.id, "&type=").concat(reportType);
                    setGeneratedReports(function (prev) {
                        return prev.map(function (r) {
                            return r.id === reportId
                                ? __assign(__assign({}, r), { status: 'completed', downloadUrl: reportUrl_1 }) : r;
                        });
                    });
                    logger_1.logger.info('Report generated successfully', {
                        reportId: reportId,
                        customerId: customer.id,
                        reportType: reportType
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to generate report', { error: error_1, customerId: customer.id });
                    // Update report status to error
                    setGeneratedReports(function (prev) {
                        return prev.map(function (r) {
                            return r.id === reportId
                                ? __assign(__assign({}, r), { status: 'error' }) : r;
                        });
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsGenerating(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    // Report generation handler for drag-and-drop
    var generateReportHandler = (0, react_1.useCallback)(function (payload) { return __awaiter(_this, void 0, void 0, function () {
        var customer, reportType_1, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (payload.sourceDataType !== 'customer' || !((_a = payload.data) === null || _a === void 0 ? void 0 : _a.entity)) {
                        return [2 /*return*/, {
                                success: false,
                                error: 'Invalid data type. Expected customer data.'
                            }];
                    }
                    customer = payload.data.entity;
                    reportType_1 = selectedReportType || 'customer-summary';
                    logger_1.logger.debug('Generating report from customer drag', {
                        customerId: customer.id,
                        customerName: customer.name,
                        reportType: reportType_1
                    });
                    return [4 /*yield*/, handleGenerateReport(customer, reportType_1)];
                case 1:
                    _c.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: "Generating ".concat(((_b = customerReportTypes.find(function (t) { return t.id === reportType_1; })) === null || _b === void 0 ? void 0 : _b.name) || reportType_1, " report for ").concat(customer.name),
                            data: { customerId: customer.id, reportType: reportType_1 }
                        }];
                case 2:
                    error_2 = _c.sent();
                    logger_1.logger.error('Error generating report from customer', error_2);
                    return [2 /*return*/, {
                            success: false,
                            error: error_2 instanceof Error ? error_2.message : 'Failed to generate report'
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [selectedReportType, handleGenerateReport]);
    // Drop zone configuration
    var dropZoneConfig = {
        cardId: cardId,
        cardType: 'report',
        accepts: {
            dataTypes: ['customer']
        },
        actions: {
            'generate-customer-report': {
                id: 'generate-customer-report',
                label: 'Generate Customer Report',
                icon: '📊',
                description: 'Generate a report for this customer',
                handler: generateReportHandler,
                requiresConfirmation: false
            }
        },
        dropZoneStyle: {
            highlightColor: '#3b82f6',
            borderStyle: 'dashed',
            borderWidth: 2,
            backgroundColor: 'rgba(59, 130, 246, 0.05)'
        }
    };
    var handleDownloadReport = function (e, report) {
        e.preventDefault();
        e.stopPropagation();
        if (!report.downloadUrl) {
            logger_1.logger.warn('Report download URL not available', { reportId: report.id });
            return;
        }
        try {
            // Create a temporary anchor element to trigger download
            var link = document.createElement('a');
            link.href = report.downloadUrl;
            link.download = "".concat(report.type, "-").concat(report.customerName || report.id, ".pdf");
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            logger_1.logger.info('Report download initiated', {
                reportId: report.id,
                reportType: report.type,
                customerId: report.customerId
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to download report', { error: error, reportId: report.id });
            // Fallback: open in new tab
            window.open(report.downloadUrl, '_blank');
        }
    };
    var handleViewReport = function (e, report) {
        e.preventDefault();
        e.stopPropagation();
        if (!report.downloadUrl) {
            logger_1.logger.warn('Report view URL not available', { reportId: report.id });
            return;
        }
        try {
            // Open report in new tab for viewing
            var viewUrl = report.downloadUrl.replace('/download', '/view') || report.downloadUrl;
            window.open(viewUrl, '_blank', 'noopener,noreferrer');
            logger_1.logger.info('Report view opened', {
                reportId: report.id,
                reportType: report.type,
                customerId: report.customerId
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to open report view', { error: error, reportId: report.id });
            // Fallback: open download URL
            window.open(report.downloadUrl, '_blank');
        }
    };
    var handleDeleteReport = function (reportId) {
        setGeneratedReports(function (prev) { return prev.filter(function (r) { return r.id !== reportId; }); });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col ".concat(className), "data-card-id": cardId, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5 text-blue-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Reports" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Drag customers here to generate reports" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 overflow-auto", children: (0, jsx_runtime_1.jsxs)(components_1.DropZone, { cardId: cardId, dropZoneConfig: dropZoneConfig, onDrop: function (payload, result) {
                        var _a;
                        if (result.success) {
                            logger_1.logger.info('Report generation initiated', {
                                customerId: (_a = payload.data) === null || _a === void 0 ? void 0 : _a.id,
                                reportType: selectedReportType
                            });
                        }
                    }, className: "min-h-[200px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-12 h-12 text-gray-400 mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 font-medium mb-1", children: "Drop customer here" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "to generate a report" })] }), selectedReportType && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Report Type" }), (0, jsx_runtime_1.jsx)("select", { value: selectedReportType, onChange: function (e) { return setSelectedReportType(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: customerReportTypes.map(function (type) { return ((0, jsx_runtime_1.jsx)("option", { value: type.id, children: type.name }, type.id)); }) })] })), generatedReports.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Generated Reports" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: generatedReports.map(function (report) {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 text-gray-400 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: ((_a = customerReportTypes.find(function (t) { return t.id === report.type; })) === null || _a === void 0 ? void 0 : _a.name) || report.type }), report.status === 'generating' && ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 text-blue-500 animate-spin" })), report.status === 'completed' && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" })), report.status === 'error' && ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-500" }))] }), report.customerName && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate", children: report.customerName })), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: report.createdAt.toLocaleTimeString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 ml-2", children: [report.status === 'completed' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) { return handleViewReport(e, report); }, className: "p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors", title: "View report", type: "button", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) { return handleDownloadReport(e, report); }, className: "p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors", title: "Download report", type: "button", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }) })] })), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDeleteReport(report.id);
                                                            }, className: "p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors", title: "Delete report", type: "button", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] })] }, report.id));
                                    }) })] })), generatedReports.length === 0 && !isGenerating && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 text-center text-gray-500 text-sm", children: [(0, jsx_runtime_1.jsx)("p", { children: "No reports generated yet." }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1", children: "Drag a customer from Customer Search Card to get started." })] }))] }) })] }));
}
