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
exports.useCompleteJob = exports.useStartJob = exports.useAssignJob = exports.useDeleteJob = exports.useUpdateJob = exports.useCreateJob = exports.useJobsByTechnician = exports.useTodayJobs = exports.useJob = exports.useJobs = exports.jobKeys = exports.jobsApi = void 0;
var react_query_1 = require("@tanstack/react-query");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
var JobsApiService = /** @class */ (function () {
    function JobsApiService() {
    }
    Object.defineProperty(JobsApiService.prototype, "getAuthHeaders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var token, authData, parsed, tenantId;
                return __generator(this, function (_a) {
                    token = null;
                    try {
                        authData = localStorage.getItem('verofield_auth');
                        if (authData) {
                            parsed = JSON.parse(authData);
                            token = parsed.token;
                        }
                    }
                    catch (error) {
                        logger_1.logger.error('Error parsing auth data', error, 'useJobs');
                    }
                    // Fallback to direct jwt key
                    if (!token) {
                        token = localStorage.getItem('jwt');
                    }
                    tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
                    return [2 /*return*/, {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(token),
                            'x-tenant-id': tenantId,
                        }];
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "handleResponse", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (response) {
            return __awaiter(this, void 0, void 0, function () {
                var errorData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!response.ok) return [3 /*break*/, 2];
                            return [4 /*yield*/, response.json().catch(function () { return ({}); })];
                        case 1:
                            errorData = _a.sent();
                            throw new Error(errorData.message || "HTTP error! status: ".concat(response.status));
                        case 2: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "getJobs", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (filters) {
                var params, response, _a, _b;
                var _c;
                if (filters === void 0) { filters = {}; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            params = new URLSearchParams();
                            if (filters.technician_id)
                                params.append('technician_id', filters.technician_id);
                            if (filters.status)
                                params.append('status', filters.status);
                            if (filters.start_date)
                                params.append('start_date', filters.start_date);
                            if (filters.end_date)
                                params.append('end_date', filters.end_date);
                            if (filters.page)
                                params.append('page', filters.page.toString());
                            if (filters.limit)
                                params.append('limit', filters.limit.toString());
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/jobs?").concat(params)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "getJobById", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/jobs/").concat(id)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "createJob", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/jobs")];
                            _c = {
                                method: 'POST'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c.body = JSON.stringify(data),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "updateJob", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/jobs/").concat(id)];
                            _c = {
                                method: 'PUT'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c.body = JSON.stringify(data),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "deleteJob", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/jobs/").concat(id)];
                            _c = {
                                method: 'DELETE'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "getJobsByTechnician", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (technicianId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/jobs/technician/").concat(technicianId)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(JobsApiService.prototype, "getTodayJobs", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (technicianId) {
            return __awaiter(this, void 0, void 0, function () {
                var today, filters, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            today = new Date().toISOString().split('T')[0];
                            filters = __assign({ start_date: today, end_date: today }, (technicianId ? { technician_id: technicianId } : {}));
                            return [4 /*yield*/, this.getJobs(filters)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                    }
                });
            });
        }
    });
    return JobsApiService;
}());
exports.jobsApi = new JobsApiService();
// Query keys
exports.jobKeys = {
    all: ['jobs'],
    lists: function () { return __spreadArray(__spreadArray([], exports.jobKeys.all, true), ['list'], false); },
    list: function (filters) { return __spreadArray(__spreadArray([], exports.jobKeys.lists(), true), [filters], false); },
    details: function () { return __spreadArray(__spreadArray([], exports.jobKeys.all, true), ['detail'], false); },
    detail: function (id) { return __spreadArray(__spreadArray([], exports.jobKeys.details(), true), [id], false); },
    byTechnician: function (technicianId) { return __spreadArray(__spreadArray([], exports.jobKeys.all, true), ['technician', technicianId], false); },
    today: function (technicianId) { return __spreadArray(__spreadArray([], exports.jobKeys.all, true), ['today', technicianId], false); },
};
// Hook to get jobs with filters
var useJobs = function (filters) {
    if (filters === void 0) { filters = {}; }
    return (0, react_query_1.useQuery)({
        queryKey: exports.jobKeys.list(filters),
        queryFn: function () { return exports.jobsApi.getJobs(filters); },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};
exports.useJobs = useJobs;
// Hook to get a specific job
var useJob = function (id) {
    return (0, react_query_1.useQuery)({
        queryKey: exports.jobKeys.detail(id),
        queryFn: function () { return exports.jobsApi.getJobById(id); },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
exports.useJob = useJob;
// Hook to get today's jobs
var useTodayJobs = function (technicianId) {
    return (0, react_query_1.useQuery)({
        queryKey: exports.jobKeys.today(technicianId),
        queryFn: function () { return exports.jobsApi.getTodayJobs(technicianId); },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};
exports.useTodayJobs = useTodayJobs;
// Hook to get jobs by technician
var useJobsByTechnician = function (technicianId) {
    return (0, react_query_1.useQuery)({
        queryKey: exports.jobKeys.byTechnician(technicianId),
        queryFn: function () { return exports.jobsApi.getJobsByTechnician(technicianId); },
        enabled: !!technicianId,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
exports.useJobsByTechnician = useJobsByTechnician;
// Hook to create a new job
var useCreateJob = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (jobData) { return exports.jobsApi.createJob(jobData); },
        onSuccess: function (newJob) {
            // Invalidate and refetch jobs lists
            queryClient.invalidateQueries({ queryKey: exports.jobKeys.lists() });
            // Add the new job to the cache
            queryClient.setQueryData(exports.jobKeys.detail(newJob.id), newJob);
            // If it's assigned to a technician, invalidate their jobs
            if (newJob.technician_id) {
                queryClient.invalidateQueries({
                    queryKey: exports.jobKeys.byTechnician(newJob.technician_id)
                });
            }
        },
    });
};
exports.useCreateJob = useCreateJob;
// Hook to update a job
var useUpdateJob = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return exports.jobsApi.updateJob(id, data);
        },
        onSuccess: function (updatedJob) {
            // Update the job in cache
            queryClient.setQueryData(exports.jobKeys.detail(updatedJob.id), updatedJob);
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: exports.jobKeys.lists() });
            // Invalidate related queries
            if (updatedJob.technician_id) {
                queryClient.invalidateQueries({
                    queryKey: exports.jobKeys.byTechnician(updatedJob.technician_id)
                });
            }
        },
    });
};
exports.useUpdateJob = useUpdateJob;
// Hook to delete a job
var useDeleteJob = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (id) { return exports.jobsApi.deleteJob(id); },
        onSuccess: function (_, deletedId) {
            // Remove from cache
            queryClient.removeQueries({ queryKey: exports.jobKeys.detail(deletedId) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: exports.jobKeys.lists() });
        },
    });
};
exports.useDeleteJob = useDeleteJob;
// Hook to assign a job to a technician
var useAssignJob = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var jobId = _a.jobId, technicianId = _a.technicianId;
            return exports.jobsApi.updateJob(jobId, { technician_id: technicianId });
        },
        onSuccess: function (updatedJob) {
            // Update the job in cache
            queryClient.setQueryData(exports.jobKeys.detail(updatedJob.id), updatedJob);
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: exports.jobKeys.lists() });
            // Invalidate technician jobs
            if (updatedJob.technician_id) {
                queryClient.invalidateQueries({
                    queryKey: exports.jobKeys.byTechnician(updatedJob.technician_id)
                });
            }
        },
    });
};
exports.useAssignJob = useAssignJob;
// Hook to start a job
var useStartJob = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id;
            return exports.jobsApi.updateJob(id, {
                status: 'in_progress',
                actual_start_time: new Date().toISOString()
            });
        },
        onSuccess: function (updatedJob) {
            // Update the job in cache
            queryClient.setQueryData(exports.jobKeys.detail(updatedJob.id), updatedJob);
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: exports.jobKeys.lists() });
        },
    });
};
exports.useStartJob = useStartJob;
// Hook to complete a job
var useCompleteJob = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, notes = _a.notes;
            return exports.jobsApi.updateJob(id, __assign({ status: 'completed', actual_end_time: new Date().toISOString() }, (notes ? { notes: notes } : {})));
        },
        onSuccess: function (updatedJob) {
            // Update the job in cache
            queryClient.setQueryData(exports.jobKeys.detail(updatedJob.id), updatedJob);
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: exports.jobKeys.lists() });
        },
    });
};
exports.useCompleteJob = useCompleteJob;
