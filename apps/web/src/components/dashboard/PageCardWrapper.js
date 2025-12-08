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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PageCardWrapper;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
function PageCardWrapper(_a) {
    var pageId = _a.pageId, title = _a.title, Icon = _a.icon, children = _a.children, onClose = _a.onClose, onResize = _a.onResize, _b = _a.initialSize, initialSize = _b === void 0 ? { width: 800, height: 600 } : _b, _c = _a.className, className = _c === void 0 ? '' : _c, rest = __rest(_a, ["pageId", "title", "icon", "children", "onClose", "onResize", "initialSize", "className"]);
    var _d = (0, react_1.useState)(false), isMaximized = _d[0], setIsMaximized = _d[1];
    var _e = (0, react_1.useState)(false), isResizing = _e[0], setIsResizing = _e[1];
    var _f = (0, react_1.useState)(initialSize), size = _f[0], setSize = _f[1];
    var cardRef = (0, react_1.useRef)(null);
    var resizeHandleRef = (0, react_1.useRef)(null);
    // Handle resize functionality
    var handleResize = function (newSize) {
        setSize(newSize);
        onResize === null || onResize === void 0 ? void 0 : onResize(newSize);
    };
    // Handle maximize/restore
    var toggleMaximize = function () {
        setIsMaximized(!isMaximized);
    };
    // Handle reset size
    var resetSize = function () {
        handleResize(initialSize);
    };
    // Mouse event handlers for resizing
    (0, react_1.useEffect)(function () {
        var handleMouseMove = function (e) {
            if (!isResizing || !cardRef.current)
                return;
            var rect = cardRef.current.getBoundingClientRect();
            var newWidth = Math.max(400, e.clientX - rect.left);
            var newHeight = Math.max(300, e.clientY - rect.top);
            handleResize({ width: newWidth, height: newHeight });
        };
        var handleMouseUp = function () {
            setIsResizing(false);
        };
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return function () {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);
    var cardStyle = {
        width: isMaximized ? '100vw' : "".concat(size.width, "px"),
        height: isMaximized ? '100vh' : "".concat(size.height, "px"),
        minWidth: '400px',
        minHeight: '300px',
        maxWidth: isMaximized ? '100vw' : '90vw',
        maxHeight: isMaximized ? '100vh' : '90vh',
    };
    return ((0, jsx_runtime_1.jsx)("div", { ref: cardRef, className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ".concat(className), style: { display: 'flex' }, children: (0, jsx_runtime_1.jsx)("div", { style: cardStyle, children: (0, jsx_runtime_1.jsxs)(Card_1.default, __assign({ className: "bg-white shadow-2xl border-0 overflow-hidden flex flex-col" }, rest, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [Icon && (0, jsx_runtime_1.jsx)(Icon, { className: "w-5 h-5 text-purple-600" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800", children: title })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: resetSize, className: "p-1.5 rounded-lg hover:bg-gray-200 transition-colors", title: "Reset Size", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "w-4 h-4 text-gray-600" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: toggleMaximize, className: "p-1.5 rounded-lg hover:bg-gray-200 transition-colors", title: isMaximized ? 'Restore' : 'Maximize', children: isMaximized ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Minimize2, { className: "w-4 h-4 text-gray-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-4 h-4 text-gray-600" })) }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-red-100 transition-colors", title: "Close", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4 text-red-600" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full overflow-auto", children: children }) }), !isMaximized && ((0, jsx_runtime_1.jsx)("div", { ref: resizeHandleRef, className: "absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 hover:bg-gray-400 transition-colors", onMouseDown: function (e) {
                            e.preventDefault();
                            setIsResizing(true);
                        }, style: {
                            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
                        } }))] })) }) }));
}
