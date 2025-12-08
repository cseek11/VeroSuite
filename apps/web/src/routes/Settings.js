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
exports.default = Settings;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var sections_1 = require("@/components/settings/sections");
var SuccessMessage_1 = require("@/components/settings/shared/SuccessMessage");
var logger_1 = require("@/utils/logger");
function Settings() {
    var _this = this;
    var _a = (0, react_1.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var _b = (0, react_1.useState)('profile'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)(false), showPassword = _c[0], setShowPassword = _c[1];
    var _d = (0, react_1.useState)(false), showSuccessMessage = _d[0], setShowSuccessMessage = _d[1];
    var _e = (0, react_1.useState)({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        bio: 'Experienced pest control professional with 5+ years in the industry.',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        theme: 'light',
        colorScheme: 'purple'
    }), formData = _e[0], setFormData = _e[1];
    var updateFormData = function (updates) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), updates)); });
    };
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!(activeTab === 'company')) return [3 /*break*/, 2];
                    // Company settings are handled by the CompanySettings component itself
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Company settings are managed by the CompanySettings component', {}, 'Settings');
                    }
                    return [2 /*return*/];
                case 2: 
                // Save other settings (profile, etc.)
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 3:
                    // Save other settings (profile, etc.)
                    _a.sent();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Settings saved successfully', {}, 'Settings');
                    }
                    _a.label = 4;
                case 4:
                    // Show success message for non-company tabs
                    setShowSuccessMessage(true);
                    setTimeout(function () { return setShowSuccessMessage(false); }, 3000); // Hide after 3 seconds
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to save settings', error_1, 'Settings');
                    return [3 /*break*/, 6];
                case 6:
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var tabs = [
        { id: 'profile', label: 'Profile', icon: lucide_react_1.User, color: 'indigo' },
        { id: 'company', label: 'Company', icon: lucide_react_1.Building2, color: 'purple' },
        { id: 'notifications', label: 'Notifications', icon: lucide_react_1.Bell, color: 'emerald' },
        { id: 'security', label: 'Security', icon: lucide_react_1.Shield, color: 'amber' },
        { id: 'appearance', label: 'Appearance', icon: lucide_react_1.Palette, color: 'violet' },
        { id: 'integrations', label: 'Integrations', icon: lucide_react_1.Globe, color: 'blue' },
        { id: 'data', label: 'Data & Privacy', icon: lucide_react_1.Database, color: 'rose' },
    ];
    var getTabBgColor = function (color) {
        var colors = {
            indigo: 'bg-indigo-50',
            purple: 'bg-purple-50',
            emerald: 'bg-emerald-50',
            amber: 'bg-amber-50',
            violet: 'bg-violet-50',
            blue: 'bg-blue-50',
            rose: 'bg-rose-50'
        };
        return colors[color] || 'bg-indigo-50';
    };
    var getTabTextColor = function (color) {
        var colors = {
            indigo: 'text-indigo-700',
            emerald: 'text-emerald-700',
            amber: 'text-amber-700',
            violet: 'text-violet-700',
            blue: 'text-blue-700',
            rose: 'text-rose-700'
        };
        return colors[color] || 'text-indigo-700';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)(SuccessMessage_1.SuccessMessage, { show: showSuccessMessage }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-5 h-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "Settings" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mt-1", children: "Manage your account settings, preferences, and system configurations." })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-56 flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-l-full transition-all duration-500 ease-out shadow-lg", style: {
                                            top: "".concat(tabs.findIndex(function (tab) { return tab.id === activeTab; }) * 36 + 4, "px"),
                                            transform: 'translateY(0)'
                                        } }), tabs.map(function (tab) {
                                        var Icon = tab.icon;
                                        var isActive = activeTab === tab.id;
                                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(tab.id); }, className: "relative w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out text-sm ".concat(isActive
                                                ? "".concat(getTabBgColor(tab.color), " ").concat(getTabTextColor(tab.color), " shadow-lg border border-white/50")
                                                : 'text-slate-600 hover:bg-white/50 hover:shadow-md'), children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 rounded-md ".concat(isActive ? 'bg-white/80' : 'bg-slate-100'), children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-3 h-3 ".concat(isActive ? getTabTextColor(tab.color) : 'text-slate-500') }) }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-xs", children: tab.label }), isActive && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-2", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 text-emerald-500" }) }))] }, tab.id));
                                    })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-4", children: [activeTab === 'profile' && ((0, jsx_runtime_1.jsx)(sections_1.ProfileSettings, { formData: formData, updateFormData: updateFormData, showPassword: showPassword, setShowPassword: setShowPassword })), activeTab === 'company' && ((0, jsx_runtime_1.jsx)(sections_1.CompanySettings, { isLoading: isLoading })), activeTab === 'notifications' && ((0, jsx_runtime_1.jsx)(sections_1.NotificationSettings, {})), activeTab === 'security' && ((0, jsx_runtime_1.jsx)(sections_1.SecuritySettings, {})), activeTab === 'appearance' && ((0, jsx_runtime_1.jsx)(sections_1.AppearanceSettings, { formData: formData, updateFormData: updateFormData })), activeTab === 'integrations' && ((0, jsx_runtime_1.jsx)(sections_1.IntegrationSettings, {})), activeTab === 'data' && ((0, jsx_runtime_1.jsx)(sections_1.DataSettings, {}))] }), activeTab !== 'company' && ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, disabled: isLoading, className: "px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ".concat(isLoading
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'), children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: "Saving..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Save Changes" })] })) }) }) }))] })] }));
}
