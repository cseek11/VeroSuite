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
exports.HelpButton = exports.ContextualHelp = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
/**
 * Contextual help component that provides help based on current context
 */
var ContextualHelp = function (_a) {
    var topic = _a.topic, position = _a.position, onClose = _a.onClose;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)(null), currentTopic = _c[0], setCurrentTopic = _c[1];
    var helpTopics = [
        {
            id: 'drag-drop',
            title: 'Drag and Drop',
            content: 'Click and hold the drag handle (top-left corner) to move regions. Release to drop in a new position.',
            category: 'features'
        },
        {
            id: 'resize',
            title: 'Resizing Regions',
            content: 'Hover over a region and use the resize handles on the edges or corners to change its size.',
            category: 'features'
        },
        {
            id: 'settings',
            title: 'Region Settings',
            content: 'Click the settings icon (purple button) to customize colors, titles, and other properties.',
            category: 'features'
        },
        {
            id: 'collaboration',
            title: 'Real-time Collaboration',
            content: 'See who else is viewing or editing regions. Lock regions to prevent conflicts during editing.',
            category: 'features'
        },
        {
            id: 'templates',
            title: 'Using Templates',
            content: 'Start with a pre-configured template or save your current layout as a template for reuse.',
            category: 'getting-started'
        }
    ];
    (0, react_1.useEffect)(function () {
        if (topic) {
            var found = helpTopics.find(function (t) { return t.id === topic; });
            if (found) {
                setCurrentTopic(found);
                setIsOpen(true);
            }
        }
    }, [topic]);
    var handleClose = (0, react_1.useCallback)(function () {
        setIsOpen(false);
        onClose === null || onClose === void 0 ? void 0 : onClose();
    }, [onClose]);
    if (!isOpen || !currentTopic)
        return null;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "fixed z-[9999]", style: {
                left: (position === null || position === void 0 ? void 0 : position.x) || '50%',
                top: (position === null || position === void 0 ? void 0 : position.y) || '50%',
                transform: position ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)'
            }, initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-80", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-5 h-5 text-blue-500" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900", children: currentTopic.title })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleClose, className: "p-1 hover:bg-gray-100 rounded transition-colors", "aria-label": "Close help", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4 text-gray-500" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700", children: currentTopic.content }) }), (0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-3 border-t border-gray-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { className: "flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-4 h-4" }), "Learn More"] }), (0, jsx_runtime_1.jsxs)("button", { className: "flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Video, { className: "w-4 h-4" }), "Watch Video"] })] })] }) }) }));
};
exports.ContextualHelp = ContextualHelp;
/**
 * Help button that shows contextual help
 */
var HelpButton = function (_a) {
    var topic = _a.topic, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(false), showHelp = _c[0], setShowHelp = _c[1];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowHelp(true); }, className: "p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors ".concat(className), "aria-label": "Show help", children: (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-5 h-5" }) }), showHelp && ((0, jsx_runtime_1.jsx)(exports.ContextualHelp, __assign({}, (topic ? { topic: topic } : {}), { onClose: function () { return setShowHelp(false); } })))] }));
};
exports.HelpButton = HelpButton;
