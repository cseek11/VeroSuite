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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var user_api_1 = require("../../lib/user-api");
var Button_1 = __importDefault(require("../ui/Button"));
var Input_1 = __importDefault(require("../ui/Input"));
var useDialog_1 = require("../../hooks/useDialog");
var CreateUserModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onUserCreated = _a.onUserCreated;
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, useDialog_1.useDialog)(), showAlert = _d.showAlert, DialogComponents = _d.DialogComponents;
    var _e = (0, react_hook_form_1.useForm)(), register = _e.register, handleSubmit = _e.handleSubmit, errors = _e.formState.errors, reset = _e.reset;
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var userData, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    userData = __assign(__assign({ email: data.email, first_name: data.first_name, last_name: data.last_name }, (data.phone ? { phone: data.phone } : {})), (data.password && data.password.trim() !== '' ? { password: data.password } : {}));
                    return [4 /*yield*/, user_api_1.userApi.createUser(userData)];
                case 2:
                    result = _a.sent();
                    if (!result.user.employee_id) return [3 /*break*/, 4];
                    // Show success message with employee ID
                    return [4 /*yield*/, showAlert({
                            title: 'User Created Successfully',
                            message: "User created successfully!\nEmployee ID: ".concat(result.user.employee_id),
                            type: 'success',
                        })];
                case 3:
                    // Show success message with employee ID
                    _a.sent();
                    _a.label = 4;
                case 4:
                    onUserCreated(result.user);
                    reset();
                    onClose();
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Failed to create user');
                    return [3 /*break*/, 7];
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 w-full max-w-md mx-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Create New User" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", disabled: isLoading, children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name *" }), (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, register('first_name', { required: 'First name is required' }), { className: "crm-input" })), errors.first_name && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.first_name.message }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name *" }), (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, register('last_name', { required: 'Last name is required' }), { className: "crm-input" })), errors.last_name && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.last_name.message }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email *" }), (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "email" }, register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        }), { className: "crm-input" })), errors.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.email.message }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "tel" }, register('phone'), { className: "crm-input" }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Temporary Password" }), (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "password" }, register('password'), { placeholder: "Leave blank for auto-generated", className: "crm-input" })), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "A temporary password will be generated if left blank" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "secondary", onClick: onClose, disabled: isLoading, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: isLoading, children: isLoading ? 'Creating...' : 'Create User' })] })] })] }) })] }));
};
exports.default = CreateUserModal;
