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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DispatcherDashboard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var UserManagementForm_1 = require("./UserManagementForm");
var react_leaflet_1 = require("react-leaflet");
var react_leaflet_2 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
var logger_1 = require("@/utils/logger");
// TODO: Implement these APIs in enhanced API
// For now, using placeholder functions
var jobsApi = {
    today: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.warn('TODO: Implement jobs API in enhanced API', {}, 'DispatcherDashboard');
            return [2 /*return*/, []];
        });
    }); }
};
var crmApi = {
    accounts: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.warn('TODO: Implement accounts API in enhanced API', {}, 'DispatcherDashboard');
            return [2 /*return*/, []];
        });
    }); }
};
var routingApi = {
    optimize: function (date) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.warn('TODO: Implement routing API in enhanced API', { date: date }, 'DispatcherDashboard');
            return [2 /*return*/, []];
        });
    }); }
};
function DispatcherDashboard() {
    var _a = (0, react_1.useState)([]), auditLogs = _a[0], setAuditLogs = _a[1];
    var _b = (0, react_1.useState)([]), jobs = _b[0], setJobs = _b[1];
    var _c = (0, react_1.useState)([]), _accounts = _c[0], setAccounts = _c[1];
    var _d = (0, react_1.useState)([]), routes = _d[0], setRoutes = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(''), _assignJobId = _f[0], setAssignJobId = _f[1];
    var _g = (0, react_1.useState)(''), assignTechId = _g[0], setAssignTechId = _g[1];
    var _h = (0, react_1.useState)(''), assignStatus = _h[0], setAssignStatus = _h[1];
    var user = JSON.parse(localStorage.getItem('user') || '{}');
    (0, react_1.useEffect)(function () {
        function fetchAuditLogs() {
            return __awaiter(this, void 0, void 0, function () {
                var res, logs, _err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            if (!(user.roles && user.roles.includes('admin'))) return [3 /*break*/, 3];
                            return [4 /*yield*/, fetch('/api/audit/logs', {
                                    headers: { Authorization: "Bearer ".concat(localStorage.getItem('jwt')) },
                                })];
                        case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            logs = _a.sent();
                            setAuditLogs(logs);
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            _err_1 = _a.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        fetchAuditLogs();
    }, [user.roles]);
    (0, react_1.useEffect)(function () {
        function fetchData() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, jobsData, accountsData, routesData, _err_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setLoading(true);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all([
                                    jobsApi.today(),
                                    crmApi.accounts(),
                                    routingApi.optimize(new Date().toISOString().split('T')[0] || ''),
                                ])];
                        case 2:
                            _a = _b.sent(), jobsData = _a[0], accountsData = _a[1], routesData = _a[2];
                            setJobs(jobsData || []);
                            setAccounts(accountsData || []);
                            setRoutes(Array.isArray(routesData) ? routesData : []);
                            return [3 /*break*/, 4];
                        case 3:
                            _err_2 = _b.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            setLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchData();
    }, []);
    function handleAssignJob(e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                e.preventDefault();
                // TODO: Call backend to assign job
                setAssignStatus('Assigning...');
                setTimeout(function () {
                    setAssignStatus('Job assigned!');
                }, 1000);
                return [2 /*return*/];
            });
        });
    }
    // Helper function for chart data (currently unused, kept for potential future use)
    function _getJobsPerDayData(jobs) {
        // Group jobs by scheduled_date
        var counts = {};
        jobs.forEach(function (job) {
            var date = job.scheduled_date || 'Unknown';
            counts[date] = (counts[date] || 0) + 1;
        });
        return Object.entries(counts).map(function (_a) {
            var date = _a[0], count = _a[1];
            return ({ date: date, count: count });
        });
    }
    void _getJobsPerDayData; // Suppress unused warning
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 bg-gray-50 min-h-screen", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold mb-6 text-blue-700", children: "Dashboard" }), loading ? (0, jsx_runtime_1.jsx)("div", { className: "text-lg", children: "Loading..." }) : ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold mb-2", children: "Jobs" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [Array.isArray(jobs) && jobs.map(function (job) {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow rounded p-4 border-l-4 border-blue-400", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-bold text-blue-600", children: job.status }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [job.scheduled_date, " | ", (_a = job.location) === null || _a === void 0 ? void 0 : _a.name] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["Technician: ", job.technician_id || 'Unassigned'] }), (0, jsx_runtime_1.jsxs)("form", { className: "mt-2 flex gap-2", onSubmit: handleAssignJob, children: [(0, jsx_runtime_1.jsxs)("select", { value: assignTechId, onChange: function (e) { return setAssignTechId(e.target.value); }, className: "border rounded px-2", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select Technician" }), routes.map(function (route) { return ((0, jsx_runtime_1.jsx)("option", { value: route.technician, children: route.technician }, route.id)); })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-2 py-1 bg-blue-500 text-white rounded", onClick: function () { return setAssignJobId(job.id); }, children: "Assign" })] })] }, job.id));
                                    }), assignStatus && (0, jsx_runtime_1.jsx)("div", { className: "text-green-600 mt-2", children: assignStatus })] }), user.roles && user.roles.includes('admin') && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mt-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold mb-2", children: "User Management" }), (0, jsx_runtime_1.jsx)(UserManagementForm_1.UserManagementForm, { onSave: function () { }, onCancel: function () { } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold mb-2", children: "Audit Logs" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: auditLogs.length === 0 ? (0, jsx_runtime_1.jsx)("div", { children: "No audit logs found." }) : auditLogs.map(function (log) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 rounded p-2 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold", children: log.action }), " on ", (0, jsx_runtime_1.jsx)("span", { children: log.resource_type }), " (", log.resource_id, ")"] }), (0, jsx_runtime_1.jsx)("div", { children: log.timestamp }), (0, jsx_runtime_1.jsx)("div", { children: log.user_id ? "User: ".concat(log.user_id) : '' })] }, log.id)); }) })] })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "rounded shadow overflow-hidden", children: (0, jsx_runtime_1.jsxs)(react_leaflet_1.MapContainer, { center: [40.4406, -79.9959], zoom: 12, style: { height: '400px', width: '100%' }, children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), Array.isArray(jobs) && jobs.map(function (job) {
                                    var _a, _b, _c, _d;
                                    return (((_b = (_a = job.location) === null || _a === void 0 ? void 0 : _a.coordinates) === null || _b === void 0 ? void 0 : _b.lat) && ((_d = (_c = job.location) === null || _c === void 0 ? void 0 : _c.coordinates) === null || _d === void 0 ? void 0 : _d.lng) ? ((0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: [job.location.coordinates.lat, job.location.coordinates.lng], children: (0, jsx_runtime_1.jsxs)(react_leaflet_1.Popup, { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-bold", children: job.location.name }), (0, jsx_runtime_1.jsx)("div", { children: job.status })] }) }, job.id)) : null);
                                }), Array.isArray(routes) && routes.map(function (route, idx) {
                                    // For demo, assume route.jobs is an array of job IDs in order
                                    var routeJobs = Array.isArray(route.jobs)
                                        ? route.jobs.map(function (jobId) { return jobs.find(function (j) { return j.id === jobId; }); })
                                        : [];
                                    var positions = routeJobs
                                        .filter(function (job) { var _a, _b, _c, _d; return job && ((_b = (_a = job.location) === null || _a === void 0 ? void 0 : _a.coordinates) === null || _b === void 0 ? void 0 : _b.lat) && ((_d = (_c = job.location) === null || _c === void 0 ? void 0 : _c.coordinates) === null || _d === void 0 ? void 0 : _d.lng); })
                                        .map(function (job) { return [job.location.coordinates.lat, job.location.coordinates.lng]; });
                                    return positions.length > 1 ? ((0, jsx_runtime_1.jsx)(react_leaflet_2.Polyline, { positions: positions, color: "purple" }, route.id || idx)) : null;
                                })] }) })] }))] }));
}
