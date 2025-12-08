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
exports.TechnicianMobile = TechnicianMobile;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// TODO: Implement jobs API in enhanced API
// For now, using placeholder functions
var jobsApi = {
    today: function (technicianId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.warn('TODO: Implement jobs API in enhanced API', { technicianId: technicianId }, 'TechnicianMobile');
            return [2 /*return*/, []];
        });
    }); }
};
function TechnicianMobile() {
    var _a = (0, react_1.useState)([]), jobs = _a[0], setJobs = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), user = _c[0], setUser = _c[1];
    (0, react_1.useEffect)(function () {
        try {
            var userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to parse user from localStorage', error, 'TechnicianMobile');
        }
    }, []);
    (0, react_1.useEffect)(function () {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return;
        var userId = user.id;
        function fetchJobs() {
            return __awaiter(this, void 0, void 0, function () {
                var jobsData, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setLoading(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, jobsApi.today(userId)];
                        case 2:
                            jobsData = _a.sent();
                            // Filter jobs assigned to this technician
                            setJobs((jobsData || []).filter(function (job) { return job.technician_id === userId; }));
                            return [3 /*break*/, 5];
                        case 3:
                            err_1 = _a.sent();
                            logger_1.logger.error('Failed to fetch jobs', err_1, 'TechnicianMobile');
                            toast_1.toast.error('Failed to load jobs');
                            return [3 /*break*/, 5];
                        case 4:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        fetchJobs();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Placeholder handlers for job actions
    function handleStartJob(jobId) {
        // TODO: Call backend to start job
        toast_1.toast.info("Starting job ".concat(jobId));
    }
    function handleCompleteJob(jobId) {
        // TODO: Call backend to complete job
        toast_1.toast.success("Completing job ".concat(jobId));
    }
    function handlePhotoUpload(jobId, files) {
        // TODO: Upload photos to backend
        if (files && files.length > 0) {
            toast_1.toast.success("Uploading ".concat(files.length, " photo(s) for job ").concat(jobId));
        }
        else {
            toast_1.toast.warning('Please select photos to upload');
        }
    }
    function handleChemicalLog(jobId) {
        // TODO: Log chemicals used
        toast_1.toast.info("Logging chemicals for job ".concat(jobId));
    }
    if (!user) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6 bg-slate-50 min-h-screen", children: (0, jsx_runtime_1.jsx)("div", { className: "text-center text-slate-600", children: "Loading user data..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 bg-slate-50 min-h-screen", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold mb-4 text-emerald-700", children: "Technician Mobile" }), loading ? (0, jsx_runtime_1.jsx)("div", { children: "Loading..." }) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: jobs.length === 0 ? (0, jsx_runtime_1.jsx)("div", { children: "No assigned jobs." }) : jobs.map(function (job) {
                    var _a, _b;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded shadow p-4 border-l-4 border-emerald-400", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-bold text-emerald-700", children: job.status }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-slate-600", children: [job.scheduled_date, " | ", ((_b = (_a = job.work_order) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.name) || 'N/A'] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 bg-blue-500 text-white rounded", onClick: function () { return handleStartJob(job.id); }, children: "Start" }), (0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 bg-green-500 text-white rounded", onClick: function () { return handleCompleteJob(job.id); }, children: "Complete" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsxs)("label", { className: "block text-xs", children: ["Upload Photos:", (0, jsx_runtime_1.jsx)("input", { type: "file", multiple: true, onChange: function (e) { return handlePhotoUpload(job.id, e.target.files); } })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 bg-yellow-500 text-white rounded", onClick: function () { return handleChemicalLog(job.id); }, children: "Log Chemicals" }) })] }, job.id));
                }) }))] }));
}
