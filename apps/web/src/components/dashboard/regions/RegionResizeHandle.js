"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionResizeHandle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var RegionResizeHandle = function (_a) {
    var onResize = _a.onResize, onResizeStart = _a.onResizeStart, onResizeEnd = _a.onResizeEnd, position = _a.position, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    var handleRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), isResizing = _c[0], setIsResizing = _c[1];
    var startPosRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!isResizing)
            return;
        var handleMouseMove = function (e) {
            if (!startPosRef.current)
                return;
            var deltaX = e.clientX - startPosRef.current.x;
            var deltaY = e.clientY - startPosRef.current.y;
            onResize(deltaX, deltaY);
        };
        var handleMouseUp = function () {
            setIsResizing(false);
            startPosRef.current = null;
            onResizeEnd === null || onResizeEnd === void 0 ? void 0 : onResizeEnd();
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return function () {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, onResize, onResizeEnd]);
    var handleMouseDown = function (e) {
        if (disabled)
            return;
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        startPosRef.current = { x: e.clientX, y: e.clientY };
        onResizeStart === null || onResizeStart === void 0 ? void 0 : onResizeStart();
    };
    var getCursor = function () {
        switch (position) {
            case 'se': return 'se-resize';
            case 'sw': return 'sw-resize';
            case 'ne': return 'ne-resize';
            case 'nw': return 'nw-resize';
            case 'e': return 'e-resize';
            case 'w': return 'w-resize';
            case 'n': return 'n-resize';
            case 's': return 's-resize';
            default: return 'default';
        }
    };
    var getPositionClasses = function () {
        switch (position) {
            case 'se': return 'bottom-0 right-0';
            case 'sw': return 'bottom-0 left-0';
            case 'ne': return 'top-0 right-0';
            case 'nw': return 'top-0 left-0';
            case 'e': return 'top-1/2 right-0 -translate-y-1/2';
            case 'w': return 'top-1/2 left-0 -translate-y-1/2';
            case 'n': return 'top-0 left-1/2 -translate-x-1/2';
            case 's': return 'bottom-0 left-1/2 -translate-x-1/2';
            default: return '';
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { ref: handleRef, className: "absolute ".concat(getPositionClasses(), " w-4 h-4 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors ").concat(disabled ? 'opacity-50 cursor-not-allowed' : ''), onMouseDown: handleMouseDown, style: {
            cursor: getCursor(),
            zIndex: 100,
            pointerEvents: disabled ? 'none' : 'auto',
            touchAction: 'none'
        }, role: "button", "aria-label": "Resize handle ".concat(position), tabIndex: disabled ? -1 : 0 }));
};
exports.RegionResizeHandle = RegionResizeHandle;
