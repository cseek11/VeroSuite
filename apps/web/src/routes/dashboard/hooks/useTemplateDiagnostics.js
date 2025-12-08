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
exports.useTemplateDiagnostics = void 0;
var react_1 = require("react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var useTemplateDiagnostics = function () {
    var _a = (0, react_1.useState)({
        apiEndpoint: false,
        authentication: false,
        network: false,
        server: false,
        overall: 'unhealthy',
        issues: [],
        recommendations: []
    }), diagnostics = _a[0], setDiagnostics = _a[1];
    var _b = (0, react_1.useState)(false), isRunning = _b[0], setIsRunning = _b[1];
    var runDiagnostics = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var issues, recommendations, apiEndpoint, authentication, network, server, response, error_1, token, response, error_2, response, error_3, templates, error_4, healthyCount, overall, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsRunning(true);
                    issues = [];
                    recommendations = [];
                    apiEndpoint = false;
                    authentication = false;
                    network = false;
                    server = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 20, 21, 22]);
                    // Test 1: API Endpoint Availability
                    logger_1.logger.debug('Testing API endpoint');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/kpi-templates', {
                            method: 'HEAD',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })];
                case 3:
                    response = _a.sent();
                    apiEndpoint = response.ok;
                    if (!apiEndpoint) {
                        issues.push('API endpoint not responding');
                        recommendations.push('Check if backend server is running on port 3001');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    issues.push('Cannot reach API endpoint');
                    recommendations.push('Start the backend server: npm run dev:server');
                    return [3 /*break*/, 5];
                case 5:
                    // Test 2: Authentication
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Testing authentication', {}, 'useTemplateDiagnostics');
                    }
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 10, , 11]);
                    token = localStorage.getItem('jwt') || localStorage.getItem('verofield_auth');
                    if (!token) return [3 /*break*/, 8];
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/kpi-templates', {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 7:
                    response = _a.sent();
                    authentication = response.status !== 401;
                    if (!authentication) {
                        issues.push('Authentication failed');
                        recommendations.push('Login again or check token validity');
                    }
                    return [3 /*break*/, 9];
                case 8:
                    issues.push('No authentication token found');
                    recommendations.push('Login to the application');
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    issues.push('Authentication test failed');
                    recommendations.push('Check network connection and try logging in again');
                    return [3 /*break*/, 11];
                case 11:
                    // Test 3: Network Connectivity
                    logger_1.logger.debug('Testing network connectivity');
                    _a.label = 12;
                case 12:
                    _a.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, fetch('http://localhost:3001/health', {
                            method: 'GET',
                        })];
                case 13:
                    response = _a.sent();
                    network = response.ok;
                    if (!network) {
                        issues.push('Network connectivity issues');
                        recommendations.push('Check internet connection and server status');
                    }
                    return [3 /*break*/, 15];
                case 14:
                    error_3 = _a.sent();
                    issues.push('Cannot reach server');
                    recommendations.push('Verify server is running and accessible');
                    return [3 /*break*/, 15];
                case 15:
                    // Test 4: Server Response
                    logger_1.logger.debug('Testing server response');
                    _a.label = 16;
                case 16:
                    _a.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.kpiTemplates.list()];
                case 17:
                    templates = _a.sent();
                    server = Array.isArray(templates);
                    if (!server) {
                        issues.push('Server returned invalid data');
                        recommendations.push('Check server logs for errors');
                    }
                    return [3 /*break*/, 19];
                case 18:
                    error_4 = _a.sent();
                    issues.push('Server request failed');
                    recommendations.push('Check server configuration and database connection');
                    return [3 /*break*/, 19];
                case 19:
                    healthyCount = [apiEndpoint, authentication, network, server].filter(Boolean).length;
                    overall = void 0;
                    if (healthyCount === 4) {
                        overall = 'healthy';
                    }
                    else if (healthyCount >= 2) {
                        overall = 'degraded';
                    }
                    else {
                        overall = 'unhealthy';
                    }
                    setDiagnostics({
                        apiEndpoint: apiEndpoint,
                        authentication: authentication,
                        network: network,
                        server: server,
                        overall: overall,
                        issues: issues,
                        recommendations: recommendations
                    });
                    return [3 /*break*/, 22];
                case 20:
                    error_5 = _a.sent();
                    logger_1.logger.error('Diagnostics failed', error_5, 'TemplateDiagnostics');
                    setDiagnostics(function (prev) { return (__assign(__assign({}, prev), { overall: 'unhealthy', issues: __spreadArray(__spreadArray([], prev.issues, true), ['Diagnostics failed'], false), recommendations: __spreadArray(__spreadArray([], prev.recommendations, true), ['Check console for detailed errors'], false) })); });
                    return [3 /*break*/, 22];
                case 21:
                    setIsRunning(false);
                    return [7 /*endfinally*/];
                case 22: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        runDiagnostics();
    }, [runDiagnostics]);
    return {
        diagnostics: diagnostics,
        isRunning: isRunning,
        runDiagnostics: runDiagnostics
    };
};
exports.useTemplateDiagnostics = useTemplateDiagnostics;
