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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var recharts_1 = require("recharts");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var ErrorMessage_1 = require("@/components/ui/ErrorMessage");
var useAutoPRSessions_1 = require("@/hooks/useAutoPRSessions");
var AutoPRSessionManager = function () {
    var _a = (0, useAutoPRSessions_1.useAutoPRSessions)(), sessions = _a.sessions, loading = _a.loading, error = _a.error, completeSession = _a.completeSession;
    var _b = (0, react_1.useState)({
        totalSessions: 0,
        activeSessions: 0,
        avgSessionDuration: 0,
        avgPRsPerSession: 0,
        completionRate: 0,
    }), stats = _b[0], setStats = _b[1];
    var _c = (0, react_1.useState)('dashboard'), view = _c[0], setView = _c[1];
    var _d = (0, react_1.useState)(null), selectedSessionForBreakdown = _d[0], setSelectedSessionForBreakdown = _d[1];
    var calculateStats = (0, react_1.useCallback)(function (data) {
        var active = Object.keys(data.active_sessions).length;
        var completed = data.completed_sessions.length;
        var total = active + completed;
        var avgDuration = completed > 0
            ? data.completed_sessions.reduce(function (sum, s) { return sum + (s.duration_minutes || 0); }, 0) / completed
            : 0;
        var avgPRs = completed > 0
            ? data.completed_sessions.reduce(function (sum, s) { return sum + s.prs.length; }, 0) / completed
            : 0;
        var completionRate = total > 0 ? (completed / total) * 100 : 0;
        setStats({
            totalSessions: total,
            activeSessions: active,
            avgSessionDuration: avgDuration,
            avgPRsPerSession: avgPRs,
            completionRate: completionRate,
        });
    }, []);
    // Calculate stats when sessions change
    (0, react_1.useEffect)(function () {
        calculateStats(sessions);
    }, [sessions, calculateStats]);
    var getSessionStatus = function (session) {
        if (!session.last_activity)
            return 'idle';
        var lastActivity = new Date(session.last_activity);
        var minutesSinceActivity = (Date.now() - lastActivity.getTime()) / 60000;
        if (minutesSinceActivity > 30)
            return 'idle';
        if (minutesSinceActivity > 15)
            return 'warning';
        return 'active';
    };
    var formatDuration = function (start, end) {
        var startDate = new Date(start);
        var endDate = end ? new Date(end) : new Date();
        var minutes = Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
        if (minutes < 60)
            return "".concat(minutes, "m");
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        return "".concat(hours, "h ").concat(mins, "m");
    };
    var handleCompleteSession = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, completeSession(sessionId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var DashboardView = function () { return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-l-4 border-l-blue-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Total Sessions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-gray-900", children: stats.totalSessions })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "text-blue-500", size: 32 })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-l-4 border-l-green-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Active Sessions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-gray-900", children: stats.activeSessions })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.PlayCircle, { className: "text-green-500", size: 32 })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-l-4 border-l-purple-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Avg Duration" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-3xl font-bold text-gray-900", children: [stats.avgSessionDuration.toFixed(0), "m"] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "text-purple-500", size: 32 })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-l-4 border-l-orange-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Completion Rate" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-3xl font-bold text-gray-900", children: [stats.completionRate.toFixed(0), "%"] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "text-orange-500", size: 32 })] }) })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-semibold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.PlayCircle, { size: 24, className: "text-green-500" }), "Active Sessions"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "divide-y divide-gray-200", children: [Object.entries(sessions.active_sessions).map(function (_a) {
                                var _b, _c;
                                var id = _a[0], session = _a[1];
                                var status = getSessionStatus(session);
                                var statusColors = {
                                    active: 'bg-green-100 text-green-800',
                                    warning: 'bg-yellow-100 text-yellow-800',
                                    idle: 'bg-gray-100 text-gray-800',
                                };
                                return ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 hover:bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-900", children: id }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded text-xs font-medium ".concat(statusColors[status]), children: status }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600", children: ["by ", session.author || 'Unknown'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GitPullRequest, { size: 16 }), ((_b = session.prs) === null || _b === void 0 ? void 0 : _b.length) || 0, " PRs: ", ((_c = session.prs) === null || _c === void 0 ? void 0 : _c.join(', ')) || 'None'] }), (0, jsx_runtime_1.jsxs)("span", { children: [session.total_files_changed || 0, " files"] }), (0, jsx_runtime_1.jsxs)("span", { children: [session.test_files_added || 0, " tests"] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 16 }), formatDuration(session.started)] })] })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: function () { return handleCompleteSession(id); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 16 }), "Complete"] })] }) }, id));
                            }), Object.keys(sessions.active_sessions).length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-8 text-center text-gray-500", children: "No active sessions" }))] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-semibold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 24, className: "text-green-500" }), "Recently Completed"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "divide-y divide-gray-200", children: [sessions.completed_sessions.slice(0, 5).map(function (session) {
                                var _a;
                                return ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 hover:bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-900", children: session.session_id }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600", children: ["by ", session.author || 'Unknown'] }), session.final_score !== undefined && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800", children: ["Score: ", session.final_score] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GitPullRequest, { size: 16 }), ((_a = session.prs) === null || _a === void 0 ? void 0 : _a.length) || 0, " PRs"] }), (0, jsx_runtime_1.jsxs)("span", { children: [session.total_files_changed || 0, " files"] }), (0, jsx_runtime_1.jsxs)("span", { children: [session.test_files_added || 0, " tests"] }), session.completed && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 16 }), formatDuration(session.started, session.completed)] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "ml-4", children: (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: function () {
                                                        setSelectedSessionForBreakdown(session);
                                                        setView('breakdown');
                                                    }, variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { size: 16 }), "View Breakdown"] }) })] }) }, session.session_id));
                            }), sessions.completed_sessions.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-8 text-center text-gray-500", children: "No completed sessions" }))] })] })] })); };
    var BreakdownView = function (_a) {
        var session = _a.session;
        // Prepare breakdown data for charts
        var breakdownData = session.breakdown
            ? [
                { name: 'Tests', value: session.breakdown.tests || 0, color: '#10b981' },
                { name: 'Bug Fix', value: session.breakdown.bug_fix || 0, color: '#3b82f6' },
                { name: 'Docs', value: session.breakdown.docs || 0, color: '#8b5cf6' },
                { name: 'Performance', value: session.breakdown.performance || 0, color: '#f59e0b' },
                { name: 'Security', value: session.breakdown.security || 0, color: '#ef4444' },
                { name: 'Penalties', value: (session.breakdown.penalties || 0) * -1, color: '#dc2626' },
            ].filter(function (item) { return item.value !== 0; })
            : [];
        // Prepare file scores data
        var fileScoresData = session.file_scores
            ? Object.entries(session.file_scores)
                .map(function (_a) {
                var file = _a[0], fileScore = _a[1];
                return ({
                    file: file.length > 40 ? file.substring(0, 40) + '...' : file,
                    fullFile: file,
                    score: fileScore.score,
                    breakdown: fileScore.breakdown,
                    notes: fileScore.notes,
                });
            })
                .sort(function (a, b) { return b.score - a.score; })
                .slice(0, 10) // Top 10 files
            : [];
        // Score distribution chart data
        var scoreDistribution = fileScoresData.map(function (item, index) { return ({
            name: "File ".concat(index + 1),
            score: item.score,
            file: item.file,
        }); });
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () {
                        setSelectedSessionForBreakdown(null);
                        setView('dashboard');
                    }, variant: "outline", className: "mb-4", children: "\u2190 Back to Dashboard" }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900", children: "Session Breakdown" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 mt-1", children: ["Session ID: ", session.session_id] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-blue-600", children: session.final_score !== undefined ? session.final_score.toFixed(1) : 'N/A' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Final Score" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Author" }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: session.author })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "PRs" }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: session.prs.length })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Files Changed" }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: session.total_files_changed })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Duration" }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: session.duration_minutes ? "".concat(session.duration_minutes, "m") : 'N/A' })] })] })] }) }), breakdownData.length > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-5 h-5" }), "Score Breakdown"] }), (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: breakdownData, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "name" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "value", fill: "#3b82f6", children: breakdownData.map(function (entry, index) { return ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: entry.color }, "cell-".concat(index))); }) })] }) })] }) })), fileScoresData.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5" }), "Top Files by Score"] }), (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: scoreDistribution, layout: "vertical", children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { type: "number" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { dataKey: "file", type: "category", width: 200 }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "score", fill: "#8b5cf6" })] }) })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "File-Level Breakdown" }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "File" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Score" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Breakdown" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Notes" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: fileScoresData.map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-sm text-gray-900 font-mono", children: item.fullFile }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-sm", children: (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold ".concat(item.score > 0 ? 'text-green-600' : item.score < 0 ? 'text-red-600' : 'text-gray-600'), children: [item.score > 0 ? '+' : '', item.score.toFixed(1)] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [item.breakdown.tests !== undefined && item.breakdown.tests > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-green-100 text-green-800 rounded text-xs", children: ["Tests: +", item.breakdown.tests] })), item.breakdown.bug_fix !== undefined && item.breakdown.bug_fix > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs", children: ["Bug Fix: +", item.breakdown.bug_fix] })), item.breakdown.docs !== undefined && item.breakdown.docs > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs", children: ["Docs: +", item.breakdown.docs] })), item.breakdown.penalties !== undefined && item.breakdown.penalties > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-red-100 text-red-800 rounded text-xs", children: ["Penalties: -", item.breakdown.penalties] }))] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-sm text-gray-600", children: item.notes || '-' })] }, index)); }) })] }) })] }) })] })), breakdownData.length === 0 && fileScoresData.length === 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-12 h-12 mx-auto mb-2 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No detailed breakdown data available for this session." }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mt-2", children: "Breakdown data will appear here once the session is scored by the reward score system." })] }) }))] }));
    };
    var AnalyticsView = function () {
        var sessionsByAuthor = __spreadArray([], sessions.completed_sessions, true).reduce(function (acc, session) {
            var _a, _b, _c;
            var author = session === null || session === void 0 ? void 0 : session.author;
            if (!author)
                return acc;
            if (!acc[author]) {
                acc[author] = { count: 0, totalScore: 0, totalPRs: 0 };
            }
            acc[author].count++;
            acc[author].totalScore += (_a = session === null || session === void 0 ? void 0 : session.final_score) !== null && _a !== void 0 ? _a : 0;
            acc[author].totalPRs += (_c = (_b = session === null || session === void 0 ? void 0 : session.prs) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
            return acc;
        }, {});
        return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Author Performance" }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Author" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Sessions" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Total PRs" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Avg Score" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "PRs/Session" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-gray-200", children: Object.entries(sessionsByAuthor).map(function (_a) {
                                        var author = _a[0], data = _a[1];
                                        return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: author }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-600", children: data.count }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-600", children: data.totalPRs }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-600", children: (data.totalScore / data.count).toFixed(2) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-600", children: (data.totalPRs / data.count).toFixed(1) })] }, author));
                                    }) })] }) })] }) }));
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-screen", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {}) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, { message: error }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gray-100", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between h-16", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GitPullRequest, { size: 28, className: "text-blue-600" }), "Auto-PR Session Manager"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            setView('dashboard');
                                            setSelectedSessionForBreakdown(null);
                                        }, className: "px-4 py-2 rounded ".concat(view === 'dashboard'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'), children: "Dashboard" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            setView('analytics');
                                            setSelectedSessionForBreakdown(null);
                                        }, className: "px-4 py-2 rounded ".concat(view === 'analytics'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'), children: "Analytics" })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: selectedSessionForBreakdown ? ((0, jsx_runtime_1.jsx)(BreakdownView, { session: selectedSessionForBreakdown })) : view === 'dashboard' ? ((0, jsx_runtime_1.jsx)(DashboardView, {})) : ((0, jsx_runtime_1.jsx)(AnalyticsView, {})) })] }));
};
exports.default = AutoPRSessionManager;
