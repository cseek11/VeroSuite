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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var auth_service_1 = require("@/lib/auth-service");
var auth_1 = require("@/stores/auth");
var validation_1 = require("@/lib/validation");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var background_beams_1 = require("@/components/ui/background-beams");
var logger_1 = require("@/utils/logger");
function Login() {
    var _this = this;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var setAuth = (0, auth_1.useAuthStore)(function (s) { return s.setAuth; });
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)(false), showPassword = _c[0], setShowPassword = _c[1];
    var _d = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(validation_1.loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    }), register = _d.register, handleSubmit = _d.handleSubmit, errors = _d.formState.errors;
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var res, token, user, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, auth_service_1.authService.login(data.email, data.password)];
                case 2:
                    res = _a.sent();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Login successful', { res: res }, 'Login');
                    }
                    token = res.token;
                    user = res.user;
                    if (!token || !user) {
                        throw new Error('Invalid login response from server');
                    }
                    // Don't set tenantId from user input - it will be validated and set by the auth store
                    return [4 /*yield*/, setAuth({ token: token, user: user })];
                case 3:
                    // Don't set tenantId from user input - it will be validated and set by the auth store
                    _a.sent();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Auth set, navigating to dashboard', {}, 'Login');
                    }
                    navigate('/dashboard');
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    logger_1.logger.error('Login error', err_1, 'Login');
                    setError(err_1 instanceof Error ? err_1.message : 'Login failed');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen flex items-center justify-center relative overflow-hidden", style: {
            background: "url('/branding/newbg22.png') center 48% / cover no-repeat fixed",
            position: 'relative',
        }, children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pointer-events-none", style: { backgroundColor: 'rgba(255,255,255,0.25)' } }), (0, jsx_runtime_1.jsx)(background_beams_1.BackgroundBeams, {}), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 w-full max-w-md", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center justify-center w-1215 h-214 rounded-2xl mb-4 p-2", children: (0, jsx_runtime_1.jsx)("img", { src: "/branding/veropest_logo.png", alt: "VeroPest Logo", className: "w-full h-full object-contain" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold login-text mb-2", children: "Welcome Back" }), (0, jsx_runtime_1.jsx)("p", { className: "login-subtitle", children: "Sign in to your VeroPest Suite account" })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "login-form-card p-8", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium login-text", children: "Email Address" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" }), (0, jsx_runtime_1.jsx)("input", __assign({ id: "email", type: "email", className: "login-gradient-input pl-10 w-full", placeholder: "Enter your email" }, register('email')))] }), errors.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-300 text-sm", children: errors.email.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium login-text", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" }), (0, jsx_runtime_1.jsx)("input", __assign({ id: "password", type: showPassword ? 'text' : 'password', className: "login-gradient-input pl-10 pr-10 w-full", placeholder: "Enter your password" }, register('password'))), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () { return setShowPassword(!showPassword); }, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-200", children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) })] }), errors.password && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-300 text-sm", children: errors.password.message }))] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", role: "alert", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "ml-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: error }) })] }) })), (0, jsx_runtime_1.jsx)("div", { className: "mt-8" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "login-button w-full", disabled: loading, children: loading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Signing In..."] })) : ('Sign In') })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-center mt-8", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-200 drop-shadow-md", children: "\u00A9 2025 VeroPest Suite. All rights reserved." }) })] })] }));
}
