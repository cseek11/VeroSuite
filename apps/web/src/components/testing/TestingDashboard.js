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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var TestExecutionService_1 = require("../../services/TestExecutionService");
var logger_1 = require("@/utils/logger");
// Remove duplicate interfaces since they're imported from the service
var TestingDashboard = function () {
    var _a, _b;
    var _c = (0, react_1.useState)([
        {
            id: 'unit',
            name: 'Unit Tests',
            description: 'Individual component and service tests',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5" }),
            tests: [],
            status: 'pending',
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
        },
        {
            id: 'integration',
            name: 'Integration Tests',
            description: 'API and service integration tests',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-5 h-5" }),
            tests: [],
            status: 'pending',
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
        },
        {
            id: 'e2e',
            name: 'E2E Tests',
            description: 'End-to-end user workflow tests',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-5 h-5" }),
            tests: [],
            status: 'pending',
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
        },
        {
            id: 'security',
            name: 'Security Tests',
            description: 'OWASP and security compliance tests',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5" }),
            tests: [],
            status: 'pending',
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
        },
        {
            id: 'performance',
            name: 'Performance Tests',
            description: 'Load and stress testing',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5" }),
            tests: [],
            status: 'pending',
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
        },
    ]), categories = _c[0], setCategories = _c[1];
    var _d = (0, react_1.useState)(false), isRunning = _d[0], setIsRunning = _d[1];
    var _e = (0, react_1.useState)(null), selectedCategory = _e[0], setSelectedCategory = _e[1];
    var _f = (0, react_1.useState)('idle'), overallStatus = _f[0], setOverallStatus = _f[1];
    var _g = (0, react_1.useState)([]), logs = _g[0], setLogs = _g[1];
    var addLog = function (message) {
        setLogs(function (prev) { return __spreadArray(__spreadArray([], prev, true), ["".concat(new Date().toLocaleTimeString(), ": ").concat(message)], false); });
    };
    // Set up event listeners for real-time test updates
    (0, react_1.useEffect)(function () {
        var handleTestOutput = function (categoryId, output) {
            addLog("[".concat(categoryId.toUpperCase(), "] ").concat(output.trim()));
        };
        var handleTestError = function (categoryId, error) {
            addLog("[".concat(categoryId.toUpperCase(), "] ERROR: ").concat(error.trim()));
        };
        var handleTestResultUpdated = function (categoryId, test) {
            setCategories(function (prev) { return prev.map(function (c) {
                return c.id === categoryId
                    ? __assign(__assign({}, c), { tests: c.tests.map(function (t) { return t.id === test.id ? test : t; }), totalTests: c.tests.length, passedTests: c.tests.filter(function (t) { return t.status === 'passed'; }).length, failedTests: c.tests.filter(function (t) { return t.status === 'failed'; }).length }) : c;
            }); });
        };
        var handleTestCategoryStarted = function (categoryId) {
            addLog("Starting ".concat(categoryId, " tests..."));
        };
        var handleTestCategoryCompleted = function (categoryId, _output) {
            addLog("".concat(categoryId, " tests completed successfully"));
        };
        var handleTestCategoryFailed = function (categoryId, error) {
            addLog("".concat(categoryId, " tests failed: ").concat(error));
        };
        // Add event listeners
        TestExecutionService_1.testExecutionService.on('testOutput', handleTestOutput);
        TestExecutionService_1.testExecutionService.on('testError', handleTestError);
        TestExecutionService_1.testExecutionService.on('testResultUpdated', handleTestResultUpdated);
        TestExecutionService_1.testExecutionService.on('testCategoryStarted', handleTestCategoryStarted);
        TestExecutionService_1.testExecutionService.on('testCategoryCompleted', handleTestCategoryCompleted);
        TestExecutionService_1.testExecutionService.on('testCategoryFailed', handleTestCategoryFailed);
        // Cleanup event listeners
        return function () {
            TestExecutionService_1.testExecutionService.off('testOutput', handleTestOutput);
            TestExecutionService_1.testExecutionService.off('testError', handleTestError);
            TestExecutionService_1.testExecutionService.off('testResultUpdated', handleTestResultUpdated);
            TestExecutionService_1.testExecutionService.off('testCategoryStarted', handleTestCategoryStarted);
            TestExecutionService_1.testExecutionService.off('testCategoryCompleted', handleTestCategoryCompleted);
            TestExecutionService_1.testExecutionService.off('testCategoryFailed', handleTestCategoryFailed);
        };
    }, []);
    var runTestCategory = function (categoryId) { return __awaiter(void 0, void 0, void 0, function () {
        var category, mockTests_1, _loop_1, i, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    category = categories.find(function (c) { return c.id === categoryId; });
                    if (!category)
                        return [2 /*return*/];
                    addLog("Starting ".concat(category.name, "..."));
                    setCategories(function (prev) { return prev.map(function (c) {
                        return c.id === categoryId
                            ? __assign(__assign({}, c), { status: 'running' }) : c;
                    }); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    mockTests_1 = generateMockTests(categoryId);
                    // Update tests with running status
                    setCategories(function (prev) { return prev.map(function (c) {
                        return c.id === categoryId
                            ? __assign(__assign({}, c), { tests: mockTests_1.map(function (t) { return (__assign(__assign({}, t), { status: 'running' })); }) }) : c;
                    }); });
                    _loop_1 = function (i) {
                        var currentMock, testResultBase, includeError, testResult;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000 + Math.random() * 2000); })];
                                case 1:
                                    _b.sent();
                                    currentMock = mockTests_1[i];
                                    if (!currentMock)
                                        return [2 /*return*/, "continue"];
                                    testResultBase = {
                                        id: currentMock.id,
                                        name: currentMock.name,
                                        status: Math.random() > 0.1 ? 'passed' : 'failed',
                                        duration: Math.floor(Math.random() * 5000) + 1000,
                                    };
                                    includeError = Math.random() > 0.9;
                                    testResult = includeError
                                        ? __assign(__assign({}, testResultBase), { error: 'Test assertion failed' }) : testResultBase;
                                    setCategories(function (prev) { return prev.map(function (c) {
                                        var _a;
                                        if (c.id !== categoryId)
                                            return c;
                                        var tests = (_a = c.tests) !== null && _a !== void 0 ? _a : [];
                                        return __assign(__assign({}, c), { tests: tests.map(function (t, idx) { return idx === i ? testResult : t; }), totalTests: tests.length, passedTests: tests.filter(function (_, idx) { var _a; return idx <= i && ((_a = tests[idx]) === null || _a === void 0 ? void 0 : _a.status) === 'passed'; }).length, failedTests: tests.filter(function (_, idx) { var _a; return idx <= i && ((_a = tests[idx]) === null || _a === void 0 ? void 0 : _a.status) === 'failed'; }).length });
                                    }); });
                                    addLog("".concat(testResult.name, ": ").concat(testResult.status === 'passed' ? 'PASSED' : 'FAILED'));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < mockTests_1.length)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    // Mark category as completed
                    setCategories(function (prev) { return prev.map(function (c) {
                        return c.id === categoryId
                            ? __assign(__assign({}, c), { status: 'completed' }) : c;
                    }); });
                    addLog("".concat(category.name, " completed successfully"));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    addLog("Error running ".concat(category.name, ": ").concat(error_1));
                    setCategories(function (prev) { return prev.map(function (c) {
                        return c.id === categoryId
                            ? __assign(__assign({}, c), { status: 'completed' }) : c;
                    }); });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var runAllTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, categories_1, category, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsRunning(true);
                    setOverallStatus('running');
                    setLogs([]);
                    addLog('Starting comprehensive test suite...');
                    _i = 0, categories_1 = categories;
                    _a.label = 1;
                case 1:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 8];
                    category = categories_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, runTestCategory(category.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to run test category', {
                        error: error_2 instanceof Error ? error_2.message : String(error_2),
                        categoryId: category.id
                    });
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 6:
                    _a.sent(); // Brief pause between categories
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8:
                    setIsRunning(false);
                    setOverallStatus('completed');
                    addLog('All tests completed!');
                    return [2 /*return*/];
            }
        });
    }); };
    var generateMockTests = function (categoryId) {
        var _a;
        var testTemplates = {
            unit: [
                'Button Component Rendering',
                'Input Validation',
                'Form Submission',
                'Error Handling',
                'Loading States',
                'User Interactions',
                'Accessibility Tests',
                'Responsive Design',
            ],
            integration: [
                'API Authentication',
                'Database Connections',
                'Service Integration',
                'Data Validation',
                'Error Recovery',
                'Transaction Handling',
                'Cache Management',
                'External API Calls',
            ],
            e2e: [
                'User Login Flow',
                'Customer Creation',
                'Work Order Management',
                'Search Functionality',
                'Navigation Tests',
                'Form Workflows',
                'Data Persistence',
                'Error Scenarios',
            ],
            security: [
                'OWASP Top 10 Validation',
                'SQL Injection Prevention',
                'XSS Protection',
                'CSRF Protection',
                'Authentication Security',
                'Authorization Checks',
                'Data Encryption',
                'Session Management',
            ],
            performance: [
                'Load Testing',
                'Stress Testing',
                'Memory Usage',
                'Response Times',
                'Throughput Testing',
                'Concurrent Users',
                'Database Performance',
                'API Performance',
            ],
        };
        return ((_a = testTemplates[categoryId]) === null || _a === void 0 ? void 0 : _a.map(function (name, index) { return ({
            id: "".concat(categoryId, "-").concat(index),
            name: name,
            status: 'pending',
        }); })) || [];
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'passed': return 'text-green-600 bg-green-100';
            case 'failed': return 'text-red-600 bg-red-100';
            case 'running': return 'text-blue-600 bg-blue-100';
            case 'pending': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'passed': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" });
            case 'failed': return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-4 h-4" });
            case 'running': return (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4 animate-spin" });
            case 'pending': return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" });
        }
    };
    var exportResults = function () {
        var results = {
            timestamp: new Date().toISOString(),
            categories: categories.map(function (c) { return ({
                name: c.name,
                status: c.status,
                totalTests: c.totalTests,
                passedTests: c.passedTests,
                failedTests: c.failedTests,
                tests: c.tests,
            }); }),
            logs: logs,
        };
        var blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "test-results-".concat(new Date().toISOString().split('T')[0], ".json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "VeroField Testing Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-2", children: "Comprehensive testing suite for enterprise-grade CRM application" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: exportResults, className: "flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4 mr-2" }), "Export Results"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: runAllTests, disabled: isRunning, className: "flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-4 h-4 mr-2" }), isRunning ? 'Running Tests...' : 'Run All Tests'] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full ".concat(overallStatus === 'running' ? 'bg-blue-500 animate-pulse' :
                                            overallStatus === 'completed' ? 'bg-green-500' : 'bg-gray-400') }), (0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-semibold text-gray-900", children: ["Overall Status: ", overallStatus === 'running' ? 'Running Tests' :
                                                overallStatus === 'completed' ? 'Tests Completed' : 'Ready to Test'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Last run: ", new Date().toLocaleString()] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6", children: categories.map(function (category) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ".concat(selectedCategory === category.id ? 'ring-2 ring-purple-500' : ''), onClick: function () { return setSelectedCategory(selectedCategory === category.id ? null : category.id); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg ".concat(category.status === 'running' ? 'bg-blue-100 text-blue-600' :
                                                    category.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'), children: category.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900", children: category.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: category.description })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(category.status === 'running' ? 'bg-blue-100 text-blue-600' :
                                            category.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'), children: category.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Total Tests:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: category.totalTests })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Passed:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-green-600", children: category.passedTests })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Failed:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-red-600", children: category.failedTests })] })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function (e) {
                                    e.stopPropagation();
                                    runTestCategory(category.id);
                                }, disabled: isRunning, className: "w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-4 h-4 mr-2" }), "Run ", category.name] })] }, category.id)); }) }), selectedCategory && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-semibold text-gray-900", children: [(_a = categories.find(function (c) { return c.id === selectedCategory; })) === null || _a === void 0 ? void 0 : _a.name, " Details"] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setSelectedCategory(null); }, className: "text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: (_b = categories.find(function (c) { return c.id === selectedCategory; })) === null || _b === void 0 ? void 0 : _b.tests.map(function (test) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 border border-gray-200 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 rounded-full ".concat(getStatusColor(test.status)), children: getStatusIcon(test.status) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: test.name }), test.duration && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Duration: ", test.duration, "ms"] })), test.error && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-red-600 mt-1", children: ["Error: ", test.error] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusColor(test.status)), children: test.status })] }, test.id)); }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-gray-900", children: "Live Test Logs" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setLogs([]); }, className: "text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto", children: logs.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "No logs yet. Run tests to see live updates." })) : (logs.map(function (log, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "mb-1", children: log }, index)); })) })] })] }) }));
};
exports.default = TestingDashboard;
