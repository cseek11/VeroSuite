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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// Simple toast notification utility
// Uses a global toast manager that can be used without a provider
var client_1 = require("react-dom/client");
var lucide_react_1 = require("lucide-react");
var ToastManager = /** @class */ (function () {
    function ToastManager() {
        Object.defineProperty(this, "toasts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "container", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    Object.defineProperty(ToastManager.prototype, "createContainer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (this.container)
                return;
            this.container = document.createElement('div');
            this.container.className = 'fixed top-4 right-4 z-[10000] space-y-2';
            this.container.id = 'toast-container';
            document.body.appendChild(this.container);
            this.root = (0, client_1.createRoot)(this.container);
            this.render();
        }
    });
    Object.defineProperty(ToastManager.prototype, "render", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            if (!this.root)
                return;
            this.root.render((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: this.toasts.map(function (toast) { return ((0, jsx_runtime_1.jsx)(ToastNotification, __assign({}, toast, { onClose: function () { return _this.remove(toast.id); } }), toast.id)); }) }));
        }
    });
    Object.defineProperty(ToastManager.prototype, "show", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, type, duration) {
            var _this = this;
            if (type === void 0) { type = 'info'; }
            if (duration === void 0) { duration = 5000; }
            this.createContainer();
            var id = Math.random().toString(36).substr(2, 9);
            this.toasts.push({ id: id, message: message, type: type, duration: duration });
            this.render();
            if (duration > 0) {
                setTimeout(function () { return _this.remove(id); }, duration);
            }
        }
    });
    Object.defineProperty(ToastManager.prototype, "remove", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            this.toasts = this.toasts.filter(function (t) { return t.id !== id; });
            this.render();
        }
    });
    return ToastManager;
}());
var ToastNotification = function (_a) {
    var message = _a.message, type = _a.type, onClose = _a.onClose;
    var colors = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    };
    var icons = {
        success: lucide_react_1.CheckCircle,
        error: lucide_react_1.AlertCircle,
        info: lucide_react_1.Info,
        warning: lucide_react_1.AlertTriangle,
    };
    var Icon = icons[type];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ".concat(colors[type], " animate-in slide-in-from-right"), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-5 h-5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium flex-1", children: message }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "ml-2 text-gray-400 hover:text-gray-600 transition-colors", "aria-label": "Close", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }));
};
var manager = new ToastManager();
exports.toast = {
    success: function (message, duration) { return manager.show(message, 'success', duration); },
    error: function (message, duration) { return manager.show(message, 'error', duration); },
    info: function (message, duration) { return manager.show(message, 'info', duration); },
    warning: function (message, duration) { return manager.show(message, 'warning', duration); },
};
