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
exports.RegionDashboardPage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var enhanced_api_1 = require("@/lib/enhanced-api");
var RegionDashboard_1 = require("./RegionDashboard");
var RegionDashboardPage = function () {
    var user = (0, auth_1.useAuthStore)(function (s) { return s.user; });
    var _a = (0, react_1.useState)(null), layoutId = _a[0], setLayoutId = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    (0, react_1.useEffect)(function () {
        var loadDefaultLayout = function () { return __awaiter(void 0, void 0, void 0, function () {
            var layout, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.getOrCreateDefault()];
                    case 1:
                        layout = _a.sent();
                        if (layout === null || layout === void 0 ? void 0 : layout.id) {
                            setLayoutId(layout.id);
                        }
                        else {
                            throw new Error('Failed to get or create default layout');
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        setError(err_1 instanceof Error ? err_1.message : 'Failed to load dashboard');
                        console.error('Failed to load default layout:', err_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        if (user === null || user === void 0 ? void 0 : user.id) {
            loadDefaultLayout();
        }
    }, [user === null || user === void 0 ? void 0 : user.id]);
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Please log in to view the dashboard." }) }));
    }
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-200 rounded w-1/4 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4", children: [1, 2, 3, 4].map(function (i) { return ((0, jsx_runtime_1.jsx)("div", { className: "h-48 bg-gray-100 rounded" }, i)); }) })] }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded p-4", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-red-800", children: ["Error: ", error] }) }) }));
    }
    if (!layoutId) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "No dashboard layout found." }) }));
    }
    return (0, jsx_runtime_1.jsx)(RegionDashboard_1.RegionDashboard, { layoutId: layoutId, userId: user.id });
};
exports.RegionDashboardPage = RegionDashboardPage;
