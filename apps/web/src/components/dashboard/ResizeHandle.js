"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var logger_1 = require("@/utils/logger");
var ResizeHandle = function (_a) {
    var position = _a.position, onResizeStart = _a.onResizeStart;
    var getPositionClasses = function () {
        switch (position) {
            case 'se': return 'bottom-0 right-0 cursor-se-resize';
            case 'sw': return 'bottom-0 left-0 cursor-sw-resize';
            case 'ne': return 'top-0 right-0 cursor-ne-resize';
            case 'nw': return 'top-0 left-0 cursor-nw-resize';
            case 'e': return 'top-1/2 right-0 -translate-y-1/2 cursor-e-resize';
            case 'w': return 'top-1/2 left-0 -translate-y-1/2 cursor-w-resize';
            case 's': return 'bottom-0 left-1/2 -translate-x-1/2 cursor-s-resize';
            case 'n': return 'top-0 left-1/2 -translate-x-1/2 cursor-n-resize';
            default: return '';
        }
    };
    var isCorner = ['se', 'sw', 'ne', 'nw'].includes(position);
    var isEdge = ['e', 'w', 's', 'n'].includes(position);
    return ((0, jsx_runtime_1.jsx)("div", { className: "absolute ".concat(getPositionClasses(), " ").concat(isCorner
            ? 'w-4 h-4 bg-purple-500 rounded-full opacity-80 hover:opacity-100 transition-opacity duration-100 hover:scale-110'
            : isEdge
                ? 'bg-purple-500 opacity-80 hover:opacity-100 transition-opacity duration-100 hover:scale-110 ' +
                    (position === 'e' || position === 'w' ? 'w-2 h-6' : 'w-6 h-2')
                : '', " hover:bg-purple-600 shadow-lg cursor-pointer pointer-events-auto"), style: { zIndex: 1000 }, onMouseDown: function (e) {
            e.preventDefault();
            e.stopPropagation();
            logger_1.logger.debug('Resize handle clicked', { position: position }, 'ResizeHandle');
            onResizeStart(position, e);
        }, title: "Resize ".concat(position.toUpperCase()) }));
};
exports.default = ResizeHandle;
