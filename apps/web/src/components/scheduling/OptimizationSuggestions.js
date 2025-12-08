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
exports.default = OptimizationSuggestions;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
function OptimizationSuggestions(_a) {
    var _this = this;
    var _b = _a.startDate, startDate = _b === void 0 ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : _b, // Last 7 days
    _c = _a.endDate, // Last 7 days
    endDate = _c === void 0 ? new Date() : _c;
    var dateRangeStart = (0, react_1.useState)(startDate.toISOString().split('T')[0])[0];
    var dateRangeEnd = (0, react_1.useState)(endDate.toISOString().split('T')[0])[0];
    // Fetch data and generate suggestions
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['optimization-suggestions', dateRangeStart, dateRangeEnd],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var jobs, technicians, suggestionsList, technicianUtilization, sortedUtilization, highUtilization, lowUtilization, overallUtilization, jobsByHour, peakHours, offPeakHours, unassignedJobs;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        if (!dateRangeStart || !dateRangeEnd)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(dateRangeStart, dateRangeEnd)];
                    case 1:
                        jobs = _o.sent();
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 2:
                        technicians = _o.sent();
                        suggestionsList = [];
                        technicianUtilization = technicians.map(function (tech) {
                            var techJobs = jobs.filter(function (j) { return j.technician_id === (tech.id || tech.user_id); });
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
                                jobCount: techJobs.length
                            };
                        });
                        sortedUtilization = __spreadArray([], technicianUtilization, true).sort(function (a, b) { return b.utilizationRate - a.utilizationRate; });
                        highUtilization = sortedUtilization.filter(function (t) { return t.utilizationRate > 85; });
                        lowUtilization = sortedUtilization.filter(function (t) { return t.utilizationRate < 50; });
                        if (highUtilization.length > 0 && lowUtilization.length > 0) {
                            suggestionsList.push({
                                type: 'workload_balancing',
                                priority: 'high',
                                title: 'Workload Imbalance Detected',
                                description: "Some technicians are overloaded while others are underutilized. Consider redistributing jobs to balance workload.",
                                impact: "Redistributing ".concat((_b = (_a = highUtilization[0]) === null || _a === void 0 ? void 0 : _a.jobCount) !== null && _b !== void 0 ? _b : 0, " jobs from ").concat((_d = (_c = highUtilization[0]) === null || _c === void 0 ? void 0 : _c.technicianName) !== null && _d !== void 0 ? _d : 'technician', " could improve overall efficiency."),
                                actionItems: [
                                    "Move jobs from ".concat((_f = (_e = highUtilization[0]) === null || _e === void 0 ? void 0 : _e.technicianName) !== null && _f !== void 0 ? _f : 'technician', " (").concat((_h = (_g = highUtilization[0]) === null || _g === void 0 ? void 0 : _g.utilizationRate.toFixed(1)) !== null && _h !== void 0 ? _h : '0', "% utilization)"),
                                    "Assign jobs to ".concat((_k = (_j = lowUtilization[0]) === null || _j === void 0 ? void 0 : _j.technicianName) !== null && _k !== void 0 ? _k : 'technician', " (").concat((_m = (_l = lowUtilization[0]) === null || _l === void 0 ? void 0 : _l.utilizationRate.toFixed(1)) !== null && _m !== void 0 ? _m : '0', "% utilization)"),
                                    'Review job priorities and technician skills before reassigning'
                                ],
                                affectedTechnicians: __spreadArray(__spreadArray([], highUtilization.map(function (t) { return t.technicianName; }), true), lowUtilization.map(function (t) { return t.technicianName; }), true)
                            });
                        }
                        overallUtilization = technicianUtilization.reduce(function (sum, t) { return sum + t.utilizationRate; }, 0) / technicianUtilization.length;
                        if (overallUtilization < 60) {
                            suggestionsList.push({
                                type: 'utilization_improvement',
                                priority: 'medium',
                                title: 'Low Overall Utilization',
                                description: "Average technician utilization is ".concat(overallUtilization.toFixed(1), "%, indicating potential capacity for additional jobs."),
                                impact: 'Increasing utilization could allow for more jobs to be scheduled without hiring additional technicians.',
                                actionItems: [
                                    'Review upcoming scheduled jobs and customer requests',
                                    'Consider offering additional time slots to customers',
                                    'Evaluate if current scheduling practices are maximizing capacity'
                                ]
                            });
                        }
                        jobsByHour = {};
                        jobs.forEach(function (job) {
                            if (job.scheduled_start_time) {
                                var hour = parseInt(job.scheduled_start_time.split(':')[0]);
                                jobsByHour[hour] = (jobsByHour[hour] || 0) + 1;
                            }
                        });
                        peakHours = Object.entries(jobsByHour)
                            .sort(function (a, b) { return b[1] - a[1]; })
                            .slice(0, 3)
                            .map(function (_a) {
                            var hour = _a[0];
                            return parseInt(hour);
                        });
                        offPeakHours = Object.entries(jobsByHour)
                            .filter(function (_a) {
                            var hour = _a[0];
                            return !peakHours.includes(parseInt(hour));
                        })
                            .sort(function (a, b) { return a[1] - b[1]; })
                            .slice(0, 3)
                            .map(function (_a) {
                            var hour = _a[0];
                            return parseInt(hour);
                        });
                        if (peakHours.length > 0 && offPeakHours.length > 0) {
                            suggestionsList.push({
                                type: 'time_slot_optimization',
                                priority: 'medium',
                                title: 'Peak Hour Concentration',
                                description: "Most jobs are scheduled during peak hours (".concat(peakHours.map(function (h) { return "".concat(h, ":00"); }).join(', '), "), while off-peak hours have fewer jobs."),
                                impact: 'Distributing jobs more evenly could reduce scheduling conflicts and improve technician availability.',
                                actionItems: [
                                    "Consider offering incentives for off-peak scheduling (".concat(offPeakHours.map(function (h) { return "".concat(h, ":00"); }).join(', '), ")"),
                                    'Review customer preferences and availability',
                                    'Adjust pricing or promotions to encourage off-peak bookings'
                                ]
                            });
                        }
                        unassignedJobs = jobs.filter(function (j) { return !j.technician_id && j.status === 'scheduled'; });
                        if (unassignedJobs.length > 0) {
                            suggestionsList.push({
                                type: 'conflict_resolution',
                                priority: 'high',
                                title: 'Unassigned Scheduled Jobs',
                                description: "".concat(unassignedJobs.length, " job(s) are scheduled but not yet assigned to technicians."),
                                impact: 'Unassigned jobs may lead to missed appointments or last-minute scrambling.',
                                actionItems: [
                                    "Assign ".concat(unassignedJobs.length, " unassigned job(s) to available technicians"),
                                    'Review technician availability and skills',
                                    'Consider using bulk assignment tools for efficiency'
                                ],
                                affectedJobs: unassignedJobs.map(function (j) { return j.id; }).slice(0, 5)
                            });
                        }
                        return [2 /*return*/, suggestionsList.sort(function (a, b) {
                                var priorityOrder = { high: 3, medium: 2, low: 1 };
                                return priorityOrder[b.priority] - priorityOrder[a.priority];
                            })];
                }
            });
        }); },
        staleTime: 10 * 60 * 1000, // 10 minutes
    }), suggestions = _d.data, isLoading = _d.isLoading, refetch = _d.refetch;
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    var getSuggestionIcon = function (type) {
        switch (type) {
            case 'workload_balancing': return lucide_react_1.Users;
            case 'time_slot_optimization': return lucide_react_1.Clock;
            case 'conflict_resolution': return lucide_react_1.AlertTriangle;
            case 'utilization_improvement': return lucide_react_1.TrendingUp;
            default: return lucide_react_1.Lightbulb;
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Analyzing scheduling patterns..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Optimization Suggestions" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "AI-powered recommendations to improve scheduling efficiency" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return refetch(); }, icon: lucide_react_1.RefreshCw, children: "Refresh Analysis" })] }), !suggestions || suggestions.length === 0 ? ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-16 h-16 text-green-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold text-gray-900 mb-2", children: "No Optimization Needed" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "Your scheduling appears to be well-optimized. Continue monitoring for future improvements." })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: suggestions.map(function (suggestion, index) {
                    var Icon = getSuggestionIcon(suggestion.type);
                    return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-l-4 ".concat(getPriorityColor(suggestion.priority).split(' ')[2]), children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg ".concat(getPriorityColor(suggestion.priority)), children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-6 h-6" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: suggestion.title }), (0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 rounded text-xs font-medium capitalize ".concat(getPriorityColor(suggestion.priority)), children: [suggestion.priority, " priority"] })] }) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-700 mb-3", children: suggestion.description }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium text-blue-900 mb-1", children: "Impact:" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-blue-800", children: suggestion.impact })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium text-gray-700", children: "Recommended Actions:" }), (0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside space-y-1", children: suggestion.actionItems.map(function (item, itemIndex) { return ((0, jsx_runtime_1.jsx)("li", { className: "text-sm text-gray-600", children: item }, itemIndex)); }) })] }), suggestion.affectedTechnicians && suggestion.affectedTechnicians.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 pt-3 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-xs text-gray-500", children: ["Affected: ", suggestion.affectedTechnicians.join(', ')] }) }))] })] }) }) }, index));
                }) }))] }));
}
