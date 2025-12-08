"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.useToast = exports.ToastProvider = exports.Toast = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var Toast = function (_a) {
    var message = _a.message, _b = _a.type, type = _b === void 0 ? 'info' : _b, _c = _a.duration, duration = _c === void 0 ? 5000 : _c, onClose = _a.onClose;
    (0, react_1.useEffect)(function () {
        if (duration > 0) {
            var timer_1 = setTimeout(function () {
                onClose();
            }, duration);
            return function () { return clearTimeout(timer_1); };
        }
        return undefined;
    }, [duration, onClose]);
    var icons = {
        success: lucide_react_1.CheckCircle,
        error: lucide_react_1.AlertCircle,
        info: lucide_react_1.Info,
        warning: lucide_react_1.AlertTriangle,
    };
    var colors = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    };
    var Icon = icons[type];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed top-4 right-4 z-[10000] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ".concat(colors[type], " animate-in slide-in-from-right"), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-5 h-5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: message }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "ml-2 text-gray-400 hover:text-gray-600 transition-colors", "aria-label": "Close", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }));
};
exports.Toast = Toast;
var ToastContext = react_1.default.createContext(undefined);
var ToastProvider = function (_a) {
    var children = _a.children;
    var _b = react_1.default.useState([]), toasts = _b[0], setToasts = _b[1];
    var showToast = react_1.default.useCallback(function (message, type, duration) {
        if (type === void 0) { type = 'info'; }
        if (duration === void 0) { duration = 5000; }
        var id = Math.random().toString(36).substr(2, 9);
        setToasts(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ id: id, message: message, type: type, duration: duration }], false); });
    }, []);
    var removeToast = react_1.default.useCallback(function (id) {
        setToasts(function (prev) { return prev.filter(function (toast) { return toast.id !== id; }); });
    }, []);
    return ((0, jsx_runtime_1.jsxs)(ToastContext.Provider, { value: { showToast: showToast }, children: [children, toasts.map(function (toast) {
                var _a;
                return ((0, jsx_runtime_1.jsx)(exports.Toast, { message: toast.message, type: toast.type, duration: (_a = toast.duration) !== null && _a !== void 0 ? _a : 5000, onClose: function () { return removeToast(toast.id); } }, toast.id));
            })] }));
};
exports.ToastProvider = ToastProvider;
var useToast = function () {
    var context = react_1.default.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
exports.useToast = useToast;
