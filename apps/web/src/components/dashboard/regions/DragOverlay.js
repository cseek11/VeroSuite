"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidityIndicator = exports.DragOverlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
require("./drag-overlay.css");
/**
 * Drag overlay component showing visual feedback during drag operations
 */
var DragOverlay = function (_a) {
    var isDragging = _a.isDragging, isValid = _a.isValid, message = _a.message, position = _a.position, size = _a.size;
    var _b = (0, react_1.useState)(false), showMessage = _b[0], setShowMessage = _b[1];
    (0, react_1.useEffect)(function () {
        if (isDragging && message) {
            var timer_1 = setTimeout(function () { return setShowMessage(true); }, 300);
            return function () { return clearTimeout(timer_1); };
        }
        setShowMessage(false);
        return undefined;
    }, [isDragging, message]);
    if (!isDragging)
        return null;
    var overlayClass = "drag-overlay ".concat(isValid === true ? 'valid' : isValid === false ? 'invalid' : '');
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: overlayClass, style: {
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                pointerEvents: 'none',
                zIndex: 10000
            }, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 }, children: [isValid !== null && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "validity-badge", initial: { scale: 0 }, animate: { scale: 1 }, exit: { scale: 0 }, children: isValid ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-5 h-5 text-red-500" })) })), showMessage && message && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "drag-message", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [isValid === false && (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: message })] }) })), (0, jsx_runtime_1.jsx)("div", { className: "drag-grid-overlay" })] }) }));
};
exports.DragOverlay = DragOverlay;
/**
 * Validity indicator component for regions
 */
var ValidityIndicator = function (_a) {
    var isValid = _a.isValid, warning = _a.warning, _b = _a.className, className = _b === void 0 ? '' : _b;
    if (isValid === null && !warning)
        return null;
    var indicatorClass = "validity-indicator ".concat(isValid === true ? 'valid' :
        isValid === false ? 'invalid' :
            warning ? 'warning' : '', " ").concat(className);
    return ((0, jsx_runtime_1.jsxs)("div", { className: indicatorClass, title: isValid === true ? 'Valid position' :
            isValid === false ? 'Invalid position' :
                'Warning', children: [isValid === true && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 text-green-500" }), isValid === false && (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-3 h-3 text-red-500" }), warning && (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-3 h-3 text-yellow-500" })] }));
};
exports.ValidityIndicator = ValidityIndicator;
