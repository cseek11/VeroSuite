"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.default = SchedulingAnalytics;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
function SchedulingAnalytics(_a) {
    var _this = this;
    var _b, _c;
    var _d = _a.startDate, startDate = _d === void 0 ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : _d, // 30 days ago
    _e = _a.endDate, // 30 days ago
    endDate = _e === void 0 ? new Date() : _e, onDateRangeChange = _a.onDateRangeChange;
    var _f = (0, react_1.useState)((_b = startDate.toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : new Date().toISOString().substring(0, 10)), dateRangeStart = _f[0], setDateRangeStart = _f[1];
    var _g = (0, react_1.useState)((_c = endDate.toISOString().split('T')[0]) !== null && _c !== void 0 ? _c : new Date().toISOString().substring(0, 10)), dateRangeEnd = _g[0], setDateRangeEnd = _g[1];
    // Fetch scheduling analytics
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['scheduling-analytics', dateRangeStart, dateRangeEnd],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var jobs, technicians, totalJobs, completedJobs, scheduledJobs, onTimeJobs, onTimeCompletionRate, jobsWithDuration, totalDuration, averageJobDuration, utilizationData, totalScheduledHours, totalAvailableHours, overallUtilizationRate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(dateRangeStart, dateRangeEnd)];
                    case 1:
                        jobs = _a.sent();
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 2:
                        technicians = _a.sent();
                        totalJobs = jobs.length;
                        completedJobs = jobs.filter(function (j) { return j.status === 'completed'; }).length;
                        scheduledJobs = jobs.filter(function (j) { return j.status === 'scheduled' || j.status === 'in_progress'; }).length;
                        onTimeJobs = jobs.filter(function (j) {
                            if (j.status !== 'completed' || !j.actual_end_time || !j.scheduled_end_time)
                                return false;
                            var actualEnd = new Date(j.actual_end_time);
                            var scheduledEnd = new Date("".concat(j.scheduled_date, "T").concat(j.scheduled_end_time));
                            return actualEnd <= scheduledEnd;
                        }).length;
                        onTimeCompletionRate = completedJobs > 0 ? (onTimeJobs / completedJobs) * 100 : 0;
                        jobsWithDuration = jobs.filter(function (j) {
                            return j.actual_start_time && j.actual_end_time;
                        });
                        totalDuration = jobsWithDuration.reduce(function (sum, j) {
                            var start = new Date(j.actual_start_time);
                            var end = new Date(j.actual_end_time);
                            return sum + (end.getTime() - start.getTime());
                        }, 0);
                        averageJobDuration = jobsWithDuration.length > 0
                            ? totalDuration / jobsWithDuration.length / (1000 * 60) // Convert to minutes
                            : 0;
                        utilizationData = technicians.map(function (tech) {
                            var techJobs = jobs.filter(function (j) { return j.technician_id === (tech.id || tech.user_id); });
                            var techCompletedJobs = techJobs.filter(function (j) { return j.status === 'completed'; });
                            // Calculate scheduled hours
                            var scheduledHours = techJobs.reduce(function (sum, j) {
                                if (!j.scheduled_start_time || !j.scheduled_end_time)
                                    return sum;
                                var start = new Date("".concat(j.scheduled_date, "T").concat(j.scheduled_start_time));
                                var end = new Date("".concat(j.scheduled_date, "T").concat(j.scheduled_end_time));
                                return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours
                            }, 0);
                            // Assume 8 hours per day available (can be enhanced with availability data)
                            var daysInRange = Math.ceil((new Date(dateRangeEnd).getTime() - new Date(dateRangeStart).getTime()) / (1000 * 60 * 60 * 24));
                            var availableHours = daysInRange * 8;
                            var utilizationRate = availableHours > 0 ? (scheduledHours / availableHours) * 100 : 0;
                            return {
                                technicianId: tech.id || tech.user_id,
                                technicianName: "".concat(tech.first_name, " ").concat(tech.last_name),
                                utilizationRate: Math.min(100, utilizationRate),
                                scheduledHours: Math.round(scheduledHours * 10) / 10,
                                availableHours: Math.round(availableHours * 10) / 10,
                                jobsCompleted: techCompletedJobs.length
                            };
                        });
                        totalScheduledHours = utilizationData.reduce(function (sum, u) { return sum + u.scheduledHours; }, 0);
                        totalAvailableHours = utilizationData.reduce(function (sum, u) { return sum + u.availableHours; }, 0);
                        overallUtilizationRate = totalAvailableHours > 0
                            ? (totalScheduledHours / totalAvailableHours) * 100
                            : 0;
                        return [2 /*return*/, {
                                metrics: {
                                    utilizationRate: Math.min(100, overallUtilizationRate),
                                    onTimeCompletionRate: onTimeCompletionRate,
                                    averageJobDuration: Math.round(averageJobDuration),
                                    totalJobs: totalJobs,
                                    completedJobs: completedJobs,
                                    scheduledJobs: scheduledJobs,
                                    technicianCount: technicians.length,
                                    averageJobsPerTechnician: technicians.length > 0 ? totalJobs / technicians.length : 0
                                },
                                utilizationData: utilizationData.sort(function (a, b) { return b.utilizationRate - a.utilizationRate; })
                            }];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000, // 5 minutes
    }), analyticsData = _h.data, isLoading = _h.isLoading;
    var metrics = (analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.metrics) || {
        utilizationRate: 0,
        onTimeCompletionRate: 0,
        averageJobDuration: 0,
        totalJobs: 0,
        completedJobs: 0,
        scheduledJobs: 0,
        technicianCount: 0,
        averageJobsPerTechnician: 0
    };
    var utilizationData = (analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.utilizationData) || [];
    var handleDateRangeChange = function () {
        var start = new Date(dateRangeStart);
        var end = new Date(dateRangeEnd);
        onDateRangeChange === null || onDateRangeChange === void 0 ? void 0 : onDateRangeChange(start, end);
    };
    var getMetricColor = function (value, threshold) {
        if (threshold === void 0) { threshold = 70; }
        return value >= threshold ? 'text-green-600' : value >= threshold * 0.7 ? 'text-yellow-600' : 'text-red-600';
    };
    var getMetricIcon = function (value, threshold) {
        if (threshold === void 0) { threshold = 70; }
        return value >= threshold ? lucide_react_1.TrendingUp : lucide_react_1.TrendingDown;
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading analytics..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Scheduling Analytics" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Performance metrics and utilization insights" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, children: "Export Report" }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4 text-gray-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium", children: "Date Range:" })] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeStart, onChange: function (e) { return setDateRangeStart(e.target.value); }, className: "w-40" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500", children: "to" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeEnd, onChange: function (e) { return setDateRangeEnd(e.target.value); }, className: "w-40" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: handleDateRangeChange, children: "Apply" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600", children: "Utilization Rate" }), react_1.default.createElement(getMetricIcon(metrics.utilizationRate), {
                                            className: "w-5 h-5 ".concat(getMetricColor(metrics.utilizationRate))
                                        })] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-3xl font-bold ".concat(getMetricColor(metrics.utilizationRate)), children: [metrics.utilizationRate.toFixed(1), "%"] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-xs text-gray-500 mt-1", children: [utilizationData.length, " technicians"] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600", children: "On-Time Completion" }), react_1.default.createElement(getMetricIcon(metrics.onTimeCompletionRate), {
                                            className: "w-5 h-5 ".concat(getMetricColor(metrics.onTimeCompletionRate))
                                        })] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-3xl font-bold ".concat(getMetricColor(metrics.onTimeCompletionRate)), children: [metrics.onTimeCompletionRate.toFixed(1), "%"] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-xs text-gray-500 mt-1", children: [metrics.completedJobs, " of ", metrics.totalJobs, " jobs"] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600", children: "Avg Job Duration" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5 text-gray-400" })] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-3xl font-bold text-gray-900", children: [Math.round(metrics.averageJobDuration), " min"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-xs text-gray-500 mt-1", children: "Average across all jobs" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600", children: "Total Jobs" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-gray-400" })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-3xl font-bold text-gray-900", children: metrics.totalJobs }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-xs text-gray-500 mt-1", children: [metrics.scheduledJobs, " scheduled, ", metrics.completedJobs, " completed"] })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-4", children: "Technician Utilization" }), utilizationData.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500", children: "No utilization data available" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: utilizationData.map(function (tech) { return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: tech.technicianName }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-sm text-gray-600", children: [tech.scheduledHours.toFixed(1), "h scheduled / ", tech.availableHours.toFixed(1), "h available", ' • ', tech.jobsCompleted, " jobs completed"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-semibold ".concat(getMetricColor(tech.utilizationRate)), children: [tech.utilizationRate.toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(tech.utilizationRate >= 70 ? 'bg-green-500' :
                                                            tech.utilizationRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'), style: { width: "".concat(Math.min(100, tech.utilizationRate), "%") } }) })] })] }) }, tech.technicianId)); }) }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Job Status Breakdown" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: "Completed" })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: metrics.completedJobs })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-blue-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: "Scheduled" })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: metrics.scheduledJobs })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-gray-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: "Other" })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: metrics.totalJobs - metrics.completedJobs - metrics.scheduledJobs })] })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Workload Distribution" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: "Total Technicians" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: metrics.technicianCount })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: "Average Jobs per Technician" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: metrics.averageJobsPerTechnician.toFixed(1) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: "Total Scheduled Hours" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-semibold", children: [utilizationData.reduce(function (sum, u) { return sum + u.scheduledHours; }, 0).toFixed(1), "h"] })] })] })] }) })] })] }));
}
