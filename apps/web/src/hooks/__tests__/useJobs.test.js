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
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var useJobs_1 = require("../useJobs");
var jobs_1 = require("@/types/jobs");
// Mock fetch
global.fetch = vitest_1.vi.fn();
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    },
}); });
var createWrapper = function () {
    var queryClient = new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });
    return function (_a) {
        var children = _a.children;
        return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children }));
    };
};
(0, vitest_1.describe)('useJobs', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        localStorage.setItem('verofield_auth', JSON.stringify({ token: 'mock-token' }));
    });
    (0, vitest_1.describe)('useJobs', function () {
        (0, vitest_1.it)('should fetch jobs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockJobs, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockJobs = {
                            data: [
                                { id: 'job-1', status: 'scheduled' },
                                { id: 'job-2', status: 'completed' },
                            ],
                            pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
                        };
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, mockJobs];
                            }); }); },
                        });
                        result = (0, react_1.renderHook)(function () { return (0, useJobs_1.useJobs)(); }, {
                            wrapper: createWrapper(),
                        }).result;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(result.current.isLoading).toBe(false);
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(result.current.data).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter jobs by technician', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockJobs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockJobs = {
                            data: [{ id: 'job-1', technician_id: 'tech-1' }],
                            pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
                        };
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, mockJobs];
                            }); }); },
                        });
                        (0, react_1.renderHook)(function () { return (0, useJobs_1.useJobs)({ technician_id: 'tech-1' }); }, {
                            wrapper: createWrapper(),
                        });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(global.fetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining('technician_id=tech-1'), vitest_1.expect.any(Object));
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('useCreateJob', function () {
        (0, vitest_1.it)('should create job', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockJob, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockJob = { id: 'job-1', status: 'scheduled' };
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, mockJob];
                            }); }); },
                        });
                        result = (0, react_1.renderHook)(function () { return (0, useJobs_1.useCreateJob)(); }, {
                            wrapper: createWrapper(),
                        }).result;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, result.current.mutateAsync({
                                                work_order_id: 'wo-1',
                                                account_id: 'account-1',
                                                location_id: 'loc-1',
                                                scheduled_date: '2024-01-01',
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining('/jobs'), vitest_1.expect.objectContaining({
                            method: 'POST',
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('useUpdateJob', function () {
        (0, vitest_1.it)('should update job', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockJob, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockJob = { id: 'job-1', status: 'in-progress' };
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, mockJob];
                            }); }); },
                        });
                        result = (0, react_1.renderHook)(function () { return (0, useJobs_1.useUpdateJob)(); }, {
                            wrapper: createWrapper(),
                        }).result;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, result.current.mutateAsync({
                                                id: 'job-1',
                                                data: { status: jobs_1.JobStatus.IN_PROGRESS },
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining('/jobs/job-1'), vitest_1.expect.objectContaining({
                            method: 'PUT',
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('useDeleteJob', function () {
        (0, vitest_1.it)('should delete job', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ message: 'Job deleted' })];
                            }); }); },
                        });
                        result = (0, react_1.renderHook)(function () { return (0, useJobs_1.useDeleteJob)(); }, {
                            wrapper: createWrapper(),
                        }).result;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, result.current.mutateAsync('job-1')];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining('/jobs/job-1'), vitest_1.expect.objectContaining({
                            method: 'DELETE',
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
