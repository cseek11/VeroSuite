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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Jobs;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var useJobs_1 = require("@/hooks/useJobs");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var lucide_react_1 = require("lucide-react");
function Jobs() {
    var _this = this;
    var qc = (0, react_query_1.useQueryClient)();
    var _a = (0, react_1.useState)(undefined), searchTechId = _a[0], setSearchTechId = _a[1];
    var uploadedUrlRef = (0, react_1.useRef)(null);
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['jobs', 'today', searchTechId],
        queryFn: function () { return useJobs_1.jobsApi.getTodayJobs(searchTechId); },
    }), data = _b.data, isLoading = _b.isLoading, isError = _b.isError, error = _b.error;
    var assignMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var job_id = _b.job_id, technician_id = _b.technician_id, scheduled_date = _b.scheduled_date;
            return __generator(this, function (_c) {
                return [2 /*return*/, useJobs_1.jobsApi.updateJob(job_id, __assign({ technician_id: technician_id }, (scheduled_date ? { scheduled_date: scheduled_date } : {})))];
            });
        }); },
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['jobs', 'today'] }); },
    });
    var startMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                return [2 /*return*/, useJobs_1.jobsApi.updateJob(id, { status: 'in_progress', actual_start_time: new Date().toISOString() })];
            });
        }); },
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['jobs', 'today'] }); },
    });
    var completeMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var id = _b.id, payload = _b.payload;
            return __generator(this, function (_c) {
                return [2 /*return*/, useJobs_1.jobsApi.updateJob(id, {
                        status: 'completed',
                        actual_end_time: new Date().toISOString(),
                        notes: payload === null || payload === void 0 ? void 0 : payload.notes,
                    })];
            });
        }); },
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['jobs', 'today'] }); },
    });
    var getStatusIcon = function (status) {
        switch (status) {
            case 'completed':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-green-500" });
            case 'in_progress':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-5 w-5 text-blue-500" });
            case 'unassigned':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-5 w-5 text-yellow-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Square, { className: "h-5 w-5 text-gray-500" });
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'unassigned':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-3", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1", children: "Today's Jobs" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm", children: "Manage and track today's scheduled pest control jobs." })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-3 items-start md:items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-indigo-600" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTechId || '', onChange: function (e) { return setSearchTechId(e.target.value || undefined); }, placeholder: "Filter by Technician ID", className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return qc.invalidateQueries({ queryKey: ['jobs', 'today'] }); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-4 w-4" }), "Refresh"] })] }) }), isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-8", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading jobs..." }) })), isError && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3 mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to load jobs' }) })), !isLoading && Array.isArray(data) && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: data.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-12 w-12 text-slate-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-slate-900 mb-2", children: "No Jobs Scheduled" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: "There are no jobs scheduled for today." })] })) : (data.map(function (job) {
                    var _a, _b, _c, _d, _e;
                    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [getStatusIcon(job.status), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900", children: ((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 rounded-full text-xs font-medium ".concat(getStatusColor(job.status)), children: job.status.replace('_', ' ') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: ((_b = job.location) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown Location' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: (_c = job.scheduled_date) === null || _c === void 0 ? void 0 : _c.slice(0, 10) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [(_d = job.time_window) === null || _d === void 0 ? void 0 : _d.start, "-", (_e = job.time_window) === null || _e === void 0 ? void 0 : _e.end] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 text-xs text-slate-500", children: ["Priority: ", job.priority || 'Normal'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-2", children: [job.status === 'unassigned' && ((0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                var _a;
                                                return assignMutation.mutate({
                                                    job_id: job.id,
                                                    technician_id: 'tech1',
                                                    scheduled_date: ((_a = job.scheduled_date) === null || _a === void 0 ? void 0 : _a.slice(0, 10)) || new Date().toISOString().slice(0, 10),
                                                    time_window_start: '09:00:00',
                                                    time_window_end: '11:00:00'
                                                });
                                            }, disabled: assignMutation.isPending, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs", children: assignMutation.isPending ? 'Assigning...' : 'Assign' })), job.status !== 'completed' && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return startMutation.mutate({
                                                id: job.id,
                                                gps: { lat: 40.44, lng: -79.99 }
                                            }); }, disabled: startMutation.isPending, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-xs", children: startMutation.isPending ? 'Starting...' : 'Start' })), job.status === 'in_progress' && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return completeMutation.mutate({
                                                id: job.id,
                                                payload: {
                                                    notes: 'Completed',
                                                    photos: uploadedUrlRef.current ? [uploadedUrlRef.current] : [],
                                                    chemicals_used: []
                                                }
                                            }); }, disabled: completeMutation.isPending, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs", children: completeMutation.isPending ? 'Completing...' : 'Complete' }))] })] }) }, job.id));
                })) }))] }));
}
