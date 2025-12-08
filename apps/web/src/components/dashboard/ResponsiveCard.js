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
exports.ResponsiveCard = ResponsiveCard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useDensityMode_1 = require("@/hooks/useDensityMode");
function ResponsiveCard(_a) {
    var id = _a.id, title = _a.title, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.style, style = _c === void 0 ? {} : _c, _d = _a.isLocked, isLocked = _d === void 0 ? false : _d, _e = _a.isSelected, isSelected = _e === void 0 ? false : _e, _f = _a.isResizable, _isResizable = _f === void 0 ? true : _f, _g = _a.isDraggable, isDraggable = _g === void 0 ? true : _g, _h = _a.minWidth, minWidth = _h === void 0 ? 200 : _h, _j = _a.minHeight, minHeight = _j === void 0 ? 150 : _j, _k = _a.width, width = _k === void 0 ? 300 : _k, _l = _a.height, height = _l === void 0 ? 200 : _l, _m = _a.x, x = _m === void 0 ? 0 : _m, _o = _a.y, y = _o === void 0 ? 0 : _o, onDragStart = _a.onDragStart, _onResize = _a.onResize, onSelect = _a.onSelect, onLock = _a.onLock, onMinimize = _a.onMinimize, onMaximize = _a.onMaximize, onReset = _a.onReset, onMenuClick = _a.onMenuClick, _p = _a.responsiveMode, _responsiveMode = _p === void 0 ? 'auto' : _p, _q = _a.cardType, cardType = _q === void 0 ? 'custom' : _q;
    var _r = (0, react_1.useState)(false), isMinimized = _r[0], setIsMinimized = _r[1];
    var _s = (0, react_1.useState)(false), isMaximized = _s[0], setIsMaximized = _s[1];
    var _t = (0, react_1.useState)('desktop'), devicePreview = _t[0], setDevicePreview = _t[1];
    var _u = (0, useDensityMode_1.useDensityMode)(), densityMode = _u.densityMode, isMobile = _u.isMobile, isTablet = _u.isTablet;
    // Responsive sizing based on screen size and density
    var responsiveDimensions = (0, react_1.useMemo)(function () {
        var baseWidth = width;
        var baseHeight = height;
        // Adjust for density mode
        if (densityMode === 'dense') {
            baseWidth *= 0.9;
            baseHeight *= 0.9;
        }
        // Adjust for screen size
        if (isMobile) {
            baseWidth = Math.min(baseWidth, 320);
            baseHeight = Math.min(baseHeight, 240);
        }
        else if (isTablet) {
            baseWidth = Math.min(baseWidth, 400);
            baseHeight = Math.min(baseHeight, 300);
        }
        // Adjust for card type
        switch (cardType) {
            case 'metric':
                baseHeight = Math.min(baseHeight, 120);
                break;
            case 'chart':
                baseHeight = Math.max(baseHeight, 200);
                break;
            case 'table':
                baseHeight = Math.max(baseHeight, 250);
                break;
            case 'form':
                baseHeight = Math.max(baseHeight, 300);
                break;
        }
        return {
            width: Math.max(minWidth, baseWidth),
            height: Math.max(minHeight, baseHeight)
        };
    }, [width, height, minWidth, minHeight, densityMode, isMobile, isTablet, cardType]);
    // Responsive header height
    var headerHeight = (0, react_1.useMemo)(function () {
        if (isMobile)
            return 32;
        if (isTablet)
            return 40;
        return densityMode === 'dense' ? 36 : 44;
    }, [isMobile, isTablet, densityMode]);
    // Responsive padding
    var cardPadding = (0, react_1.useMemo)(function () {
        if (isMobile)
            return '8px';
        if (isTablet)
            return '12px';
        return densityMode === 'dense' ? '10px' : '16px';
    }, [isMobile, isTablet, densityMode]);
    // Responsive font sizes
    var fontSizes = (0, react_1.useMemo)(function () {
        if (isMobile)
            return {
                title: '14px',
                content: '12px',
                button: '12px'
            };
        if (isTablet)
            return {
                title: '16px',
                content: '14px',
                button: '14px'
            };
        return {
            title: densityMode === 'dense' ? '14px' : '16px',
            content: densityMode === 'dense' ? '12px' : '14px',
            button: densityMode === 'dense' ? '12px' : '14px'
        };
    }, [isMobile, isTablet, densityMode]);
    var handleMinimize = (0, react_1.useCallback)(function () {
        setIsMinimized(!isMinimized);
        if (onMinimize)
            onMinimize(id);
    }, [isMinimized, id, onMinimize]);
    var handleMaximize = (0, react_1.useCallback)(function () {
        setIsMaximized(!isMaximized);
        if (onMaximize)
            onMaximize(id);
    }, [isMaximized, id, onMaximize]);
    var handleReset = (0, react_1.useCallback)(function () {
        setIsMinimized(false);
        setIsMaximized(false);
        if (onReset)
            onReset(id);
    }, [id, onReset]);
    var handleLock = (0, react_1.useCallback)(function () {
        if (onLock)
            onLock(id);
    }, [id, onLock]);
    var handleMenuClick = (0, react_1.useCallback)(function () {
        if (onMenuClick)
            onMenuClick(id);
    }, [id, onMenuClick]);
    var handleCardClick = (0, react_1.useCallback)(function (e) {
        e.stopPropagation();
        if (onSelect)
            onSelect(id);
    }, [id, onSelect]);
    var toggleDevicePreview = (0, react_1.useCallback)(function () {
        setDevicePreview(function (prev) {
            switch (prev) {
                case 'desktop': return 'tablet';
                case 'tablet': return 'mobile';
                default: return 'desktop';
            }
        });
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "responsive-card ".concat(className, " ").concat(isSelected ? 'selected' : '', " ").concat(isLocked ? 'locked' : '', " ").concat(isMinimized ? 'minimized' : '', " ").concat(isMaximized ? 'maximized' : '', " ").concat(densityMode, " ").concat(isMobile ? 'mobile' : '', " ").concat(isTablet ? 'tablet' : ''), style: __assign(__assign({}, style), { width: isMaximized ? '100vw' : responsiveDimensions.width, height: isMinimized ? headerHeight : (isMaximized ? '100vh' : responsiveDimensions.height), minWidth: minWidth, minHeight: minHeight, left: isMaximized ? 0 : x, top: isMaximized ? 0 : y, fontSize: fontSizes.content, zIndex: isMaximized ? 1000 : isSelected ? 10 : 1 }), "data-card-id": id, onClick: handleCardClick, children: [(0, jsx_runtime_1.jsx)("div", { className: "card-header", style: {
                    height: headerHeight,
                    fontSize: fontSizes.title,
                    padding: "0 ".concat(cardPadding),
                    cursor: isDraggable ? 'grab' : 'default'
                }, onMouseDown: isDraggable ? onDragStart : undefined, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between h-full", children: [isDraggable && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1 text-gray-400", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium truncate", title: title, children: title })] })), !isDraggable && ((0, jsx_runtime_1.jsx)("span", { className: "font-medium truncate", title: title, children: title })), (0, jsx_runtime_1.jsxs)("button", { onClick: toggleDevicePreview, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "Preview: ".concat(devicePreview), style: { fontSize: fontSizes.button }, children: [devicePreview === 'mobile' && (0, jsx_runtime_1.jsx)(lucide_react_1.Smartphone, { className: "w-3 h-3" }), devicePreview === 'tablet' && (0, jsx_runtime_1.jsx)(lucide_react_1.Tablet, { className: "w-3 h-3" }), devicePreview === 'desktop' && (0, jsx_runtime_1.jsx)(lucide_react_1.Monitor, { className: "w-3 h-3" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleLock, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: isLocked ? 'Unlock card' : 'Lock card', style: { fontSize: fontSizes.button }, children: isLocked ? ((0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-red-500 rounded-sm" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 border border-gray-300 rounded-sm" })) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleMinimize, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: isMinimized ? 'Restore card' : 'Minimize card', style: { fontSize: fontSizes.button }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Minimize2, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleMaximize, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: isMaximized ? 'Restore card' : 'Maximize card', style: { fontSize: fontSizes.button }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleReset, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "Reset card", style: { fontSize: fontSizes.button }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleMenuClick, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "More options", style: { fontSize: fontSizes.button }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "w-3 h-3" }) })] })] }) }), !isMinimized && ((0, jsx_runtime_1.jsxs)("div", { className: "card-content", style: {
                    height: "calc(100% - ".concat(headerHeight, "px)"),
                    padding: cardPadding,
                    fontSize: fontSizes.content,
                    overflow: isMaximized ? 'visible' : 'auto'
                }, children: [devicePreview !== 'desktop' && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pointer-events-none border-2 border-dashed border-blue-400 bg-blue-50/20 z-10", style: {
                            borderRadius: devicePreview === 'mobile' ? '20px' : '12px',
                            margin: devicePreview === 'mobile' ? '8px' : '4px'
                        }, children: (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 left-2 text-xs text-blue-600 font-medium", children: devicePreview === 'mobile' ? 'Mobile View' : 'Tablet View' }) })), (0, jsx_runtime_1.jsx)("div", { className: "relative z-0", children: children })] })), (0, jsx_runtime_1.jsx)("style", { children: "\n        .responsive-card {\n          position: absolute;\n          background: white;\n          border: 1px solid #e5e7eb;\n          border-radius: 8px;\n          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n          transition: all 0.2s ease;\n          overflow: hidden;\n        }\n\n        .responsive-card:hover {\n          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n        }\n\n        .responsive-card.selected {\n          border-color: #8b5cf6;\n          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);\n        }\n\n        .responsive-card.locked {\n          border-color: #ef4444;\n          background: #fef2f2;\n        }\n\n        .responsive-card.minimized {\n          min-height: ".concat(headerHeight, "px;\n        }\n\n        .responsive-card.maximized {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          border-radius: 0;\n          z-index: 1000;\n        }\n\n        .card-header {\n          background: #f9fafb;\n          border-bottom: 1px solid #e5e7eb;\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          user-select: none;\n        }\n\n        .card-header:active {\n          cursor: grabbing;\n        }\n\n        .card-content {\n          background: white;\n          overflow: auto;\n        }\n\n        /* Mobile optimizations */\n        .responsive-card.mobile {\n          border-radius: 12px;\n          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n        }\n\n        .responsive-card.mobile .card-header {\n          padding: 0 12px;\n        }\n\n        .responsive-card.mobile .card-content {\n          padding: 12px;\n        }\n\n        /* Tablet optimizations */\n        .responsive-card.tablet {\n          border-radius: 10px;\n        }\n\n        /* Density mode styles */\n        .responsive-card.dense .card-header {\n          background: #f3f4f6;\n        }\n\n        .responsive-card.dense .card-content {\n          padding: 8px;\n        }\n\n        /* Touch optimizations */\n        @media (hover: none) and (pointer: coarse) {\n          .responsive-card .card-header button {\n            min-width: 44px;\n            min-height: 44px;\n          }\n        }\n\n        /* High contrast mode */\n        @media (prefers-contrast: high) {\n          .responsive-card {\n            border-width: 2px;\n          }\n          \n          .responsive-card.selected {\n            border-width: 3px;\n          }\n        }\n\n        /* Reduced motion */\n        @media (prefers-reduced-motion: reduce) {\n          .responsive-card {\n            transition: none;\n          }\n        }\n      ") })] }));
}
