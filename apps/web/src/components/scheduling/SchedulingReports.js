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
exports.default = SchedulingReports;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var useDialog_1 = require("@/hooks/useDialog");
function SchedulingReports(_a) {
    var _this = this;
    var _b = _a.startDate, startDate = _b === void 0 ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : _b, _c = _a.endDate, endDate = _c === void 0 ? new Date() : _c;
    var _d = (0, useDialog_1.useDialog)(), showAlert = _d.showAlert, DialogComponents = _d.DialogComponents;
    var _e = (0, react_1.useState)('utilization'), reportType = _e[0], setReportType = _e[1];
    var _f = (0, react_1.useState)(startDate.toISOString().split('T')[0]), dateRangeStart = _f[0], setDateRangeStart = _f[1];
    var _g = (0, react_1.useState)(endDate.toISOString().split('T')[0]), dateRangeEnd = _g[0], setDateRangeEnd = _g[1];
    // Fetch report data
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['scheduling-reports', reportType, dateRangeStart, dateRangeEnd],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var jobs, technicians, utilizationReport, performanceReport, efficiencyReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dateRangeStart || !dateRangeEnd) {
                            return [2 /*return*/, {
                                    utilization: [],
                                    performance: [],
                                    efficiency: null,
                                }];
                        }
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(dateRangeStart, dateRangeEnd)];
                    case 1:
                        jobs = _a.sent();
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 2:
                        technicians = _a.sent();
                        utilizationReport = technicians.map(function (tech) {
                            var techJobs = jobs.filter(function (j) { return j.technician_id === (tech.id || tech.user_id); });
                            var completedJobs = techJobs.filter(function (j) { return j.status === 'completed'; });
                            var scheduledHours = techJobs.reduce(function (sum, j) {
                                if (!j.scheduled_start_time || !j.scheduled_end_time)
                                    return sum;
                                var start = new Date("".concat(j.scheduled_date, "T").concat(j.scheduled_start_time));
                                var end = new Date("".concat(j.scheduled_date, "T").concat(j.scheduled_end_time));
                                return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                            }, 0);
                            var daysInRange = Math.ceil((new Date(dateRangeEnd).getTime() - new Date(dateRangeStart).getTime()) / (1000 * 60 * 60 * 24));
                            var availableHours = daysInRange * 8;
                            var utilizationRate = availableHours > 0 ? (scheduledHours / availableHours) * 100 : 0;
                            return {
                                technicianId: tech.id || tech.user_id,
                                technicianName: "".concat(tech.first_name, " ").concat(tech.last_name),
                                utilizationRate: Math.min(100, utilizationRate),
                                scheduledHours: Math.round(scheduledHours * 10) / 10,
                                availableHours: Math.round(availableHours * 10) / 10,
                                jobsCompleted: completedJobs.length,
                                jobsScheduled: techJobs.length
                            };
                        });
                        performanceReport = technicians.map(function (tech) {
                            var techJobs = jobs.filter(function (j) { return j.technician_id === (tech.id || tech.user_id); });
                            var completedJobs = techJobs.filter(function (j) { return j.status === 'completed'; });
                            var onTimeJobs = completedJobs.filter(function (j) {
                                if (!j.actual_end_time || !j.scheduled_end_time)
                                    return false;
                                var actualEnd = new Date(j.actual_end_time);
                                var scheduledEnd = new Date("".concat(j.scheduled_date, "T").concat(j.scheduled_end_time));
                                return actualEnd <= scheduledEnd;
                            });
                            var jobsWithDuration = completedJobs.filter(function (j) {
                                return j.actual_start_time && j.actual_end_time;
                            });
                            var totalDuration = jobsWithDuration.reduce(function (sum, j) {
                                var start = new Date(j.actual_start_time);
                                var end = new Date(j.actual_end_time);
                                return sum + (end.getTime() - start.getTime());
                            }, 0);
                            var avgDuration = jobsWithDuration.length > 0
                                ? totalDuration / jobsWithDuration.length / (1000 * 60)
                                : 0;
                            return {
                                technicianId: tech.id || tech.user_id,
                                technicianName: "".concat(tech.first_name, " ").concat(tech.last_name),
                                totalJobs: techJobs.length,
                                completedJobs: completedJobs.length,
                                onTimeJobs: onTimeJobs.length,
                                onTimeRate: completedJobs.length > 0 ? (onTimeJobs.length / completedJobs.length) * 100 : 0,
                                averageDuration: Math.round(avgDuration),
                                completionRate: techJobs.length > 0 ? (completedJobs.length / techJobs.length) * 100 : 0
                            };
                        });
                        efficiencyReport = {
                            totalJobs: jobs.length,
                            completedJobs: jobs.filter(function (j) { return j.status === 'completed'; }).length,
                            scheduledJobs: jobs.filter(function (j) { return j.status === 'scheduled' || j.status === 'in_progress'; }).length,
                            averageJobDuration: (function () {
                                var jobsWithDuration = jobs.filter(function (j) {
                                    return j.actual_start_time && j.actual_end_time;
                                });
                                var totalDuration = jobsWithDuration.reduce(function (sum, j) {
                                    var start = new Date(j.actual_start_time);
                                    var end = new Date(j.actual_end_time);
                                    return sum + (end.getTime() - start.getTime());
                                }, 0);
                                return jobsWithDuration.length > 0
                                    ? totalDuration / jobsWithDuration.length / (1000 * 60)
                                    : 0;
                            })(),
                            overallUtilization: (function () {
                                var totalScheduledHours = utilizationReport.reduce(function (sum, u) { return sum + u.scheduledHours; }, 0);
                                var totalAvailableHours = utilizationReport.reduce(function (sum, u) { return sum + u.availableHours; }, 0);
                                return totalAvailableHours > 0 ? (totalScheduledHours / totalAvailableHours) * 100 : 0;
                            })(),
                            onTimeCompletionRate: (function () {
                                var completedJobs = jobs.filter(function (j) { return j.status === 'completed'; });
                                var onTimeJobs = completedJobs.filter(function (j) {
                                    if (!j.actual_end_time || !j.scheduled_end_time)
                                        return false;
                                    var actualEnd = new Date(j.actual_end_time);
                                    var scheduledEnd = new Date("".concat(j.scheduled_date, "T").concat(j.scheduled_end_time));
                                    return actualEnd <= scheduledEnd;
                                });
                                return completedJobs.length > 0 ? (onTimeJobs.length / completedJobs.length) * 100 : 0;
                            })()
                        };
                        return [2 /*return*/, {
                                utilization: utilizationReport.sort(function (a, b) { return b.utilizationRate - a.utilizationRate; }),
                                performance: performanceReport.sort(function (a, b) { return b.completionRate - a.completionRate; }),
                                efficiency: efficiencyReport
                            }];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000,
    }), reportData = _h.data, isLoading = _h.isLoading;
    var handleExportCSV = function () {
        if (!reportData)
            return;
        var csvContent = '';
        var headers = [];
        var rows = [];
        if (reportType === 'utilization' && reportData.utilization) {
            headers.push('Technician', 'Utilization Rate (%)', 'Scheduled Hours', 'Available Hours', 'Jobs Completed', 'Jobs Scheduled');
            reportData.utilization.forEach(function (row) {
                rows.push([
                    row.technicianName,
                    row.utilizationRate.toFixed(1),
                    row.scheduledHours.toFixed(1),
                    row.availableHours.toFixed(1),
                    row.jobsCompleted,
                    row.jobsScheduled
                ]);
            });
        }
        else if (reportType === 'performance' && reportData.performance) {
            headers.push('Technician', 'Total Jobs', 'Completed Jobs', 'On-Time Jobs', 'On-Time Rate (%)', 'Avg Duration (min)', 'Completion Rate (%)');
            reportData.performance.forEach(function (row) {
                rows.push([
                    row.technicianName,
                    row.totalJobs,
                    row.completedJobs,
                    row.onTimeJobs,
                    row.onTimeRate.toFixed(1),
                    row.averageDuration,
                    row.completionRate.toFixed(1)
                ]);
            });
        }
        else if (reportType === 'efficiency' && reportData.efficiency) {
            headers.push('Metric', 'Value');
            rows.push(['Total Jobs', reportData.efficiency.totalJobs]);
            rows.push(['Completed Jobs', reportData.efficiency.completedJobs]);
            rows.push(['Scheduled Jobs', reportData.efficiency.scheduledJobs]);
            rows.push(['Average Job Duration (min)', Math.round(reportData.efficiency.averageJobDuration)]);
            rows.push(['Overall Utilization (%)', reportData.efficiency.overallUtilization.toFixed(1)]);
            rows.push(['On-Time Completion Rate (%)', reportData.efficiency.onTimeCompletionRate.toFixed(1)]);
        }
        csvContent = headers.join(',') + '\n' + rows.map(function (row) { return row.join(','); }).join('\n');
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "scheduling-".concat(reportType, "-report-").concat(dateRangeStart, "-").concat(dateRangeEnd, ".csv");
        a.click();
        window.URL.revokeObjectURL(url);
    };
    var handleExportPDF = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // TODO: Implement PDF export using a library like jsPDF or pdfmake
                    logger_1.logger.info('PDF export not yet implemented', { reportType: reportType }, 'SchedulingReports');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, showAlert({
                            title: 'Coming Soon',
                            message: 'PDF export coming soon!',
                            type: 'info',
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to show PDF export alert', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1)
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Generating report..." })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Scheduling Reports" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Generate detailed reports on scheduling performance" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: handleExportCSV, icon: lucide_react_1.FileSpreadsheet, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: handleExportPDF, icon: lucide_react_1.FileDown, children: "Export PDF" })] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4 text-gray-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium", children: "Report Type:" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-2", children: ['utilization', 'performance', 'efficiency'].map(function (type) { return ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: reportType === type ? 'primary' : 'outline', size: "sm", onClick: function () { return setReportType(type); }, children: type.charAt(0).toUpperCase() + type.slice(1) }, type)); }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-gray-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium", children: "Date Range:" })] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeStart, onChange: function (e) { return setDateRangeStart(e.target.value); }, className: "w-40" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500", children: "to" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeEnd, onChange: function (e) { return setDateRangeEnd(e.target.value); }, className: "w-40" })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [reportType === 'utilization' && (reportData === null || reportData === void 0 ? void 0 : reportData.utilization) && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-4", children: "Utilization Report" }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left p-2", children: "Technician" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Utilization Rate" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Scheduled Hours" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Available Hours" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Jobs Completed" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Jobs Scheduled" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: reportData.utilization.map(function (row) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("td", { className: "p-2", children: row.technicianName }), (0, jsx_runtime_1.jsxs)("td", { className: "text-right p-2", children: [row.utilizationRate.toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("td", { className: "text-right p-2", children: row.scheduledHours.toFixed(1) }), (0, jsx_runtime_1.jsx)("td", { className: "text-right p-2", children: row.availableHours.toFixed(1) }), (0, jsx_runtime_1.jsx)("td", { className: "text-right p-2", children: row.jobsCompleted }), (0, jsx_runtime_1.jsx)("td", { className: "text-right p-2", children: row.jobsScheduled })] }, row.technicianId)); }) })] }) })] })), reportType === 'performance' && (reportData === null || reportData === void 0 ? void 0 : reportData.performance) && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-4", children: "Performance Report" }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left p-2", children: "Technician" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Total Jobs" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Completed" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "On-Time" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "On-Time Rate" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Avg Duration" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right p-2", children: "Completion Rate" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: reportData.performance.map(function (row) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("td", { className: "p-2", children: row.technicianName }), (0, jsx_runtime_1.jsx)("td", { className: "text-right p-2", children: row.totalJobs }), (0, jsx_runtime_1.jsx)("td", { className: "text-right p-2", children: row.completedJobs }), (0, jsx_runtime_1.jsx)("td", { className: "text-right p-2", children: row.onTimeJobs }), (0, jsx_runtime_1.jsxs)("td", { className: "text-right p-2", children: [row.onTimeRate.toFixed(1), "%"] }), (0, jsx_runtime_1.jsxs)("td", { className: "text-right p-2", children: [row.averageDuration, " min"] }), (0, jsx_runtime_1.jsxs)("td", { className: "text-right p-2", children: [row.completionRate.toFixed(1), "%"] })] }, row.technicianId)); }) })] }) })] })), reportType === 'efficiency' && (reportData === null || reportData === void 0 ? void 0 : reportData.efficiency) && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-4", children: "Efficiency Report" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "Total Jobs" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: reportData.efficiency.totalJobs })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "Completed Jobs" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: reportData.efficiency.completedJobs })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "Scheduled Jobs" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: reportData.efficiency.scheduledJobs })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "Average Job Duration" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-semibold", children: [Math.round(reportData.efficiency.averageJobDuration), " min"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "Overall Utilization" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-semibold", children: [reportData.efficiency.overallUtilization.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "On-Time Completion Rate" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-semibold", children: [reportData.efficiency.onTimeCompletionRate.toFixed(1), "%"] })] })] })] })] }))] }) })] })] }));
}
