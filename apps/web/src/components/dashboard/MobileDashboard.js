"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileDashboard = MobileDashboard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useTouchGestures_1 = require("@/hooks/useTouchGestures");
var useDensityMode_1 = require("@/hooks/useDensityMode");
var logger_1 = require("@/utils/logger");
function MobileDashboard(_a) {
    var children = _a.children, onZoom = _a.onZoom, onPan = _a.onPan, onReset = _a.onReset, _b = _a.zoom, zoom = _b === void 0 ? 1 : _b, _c = _a.pan, pan = _c === void 0 ? { x: 0, y: 0 } : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    var _e = (0, react_1.useState)(false), isFullscreen = _e[0], setIsFullscreen = _e[1];
    var _f = (0, react_1.useState)(false), showMobileControls = _f[0], setShowMobileControls = _f[1];
    var _g = (0, react_1.useState)('desktop'), deviceMode = _g[0], setDeviceMode = _g[1];
    var _h = (0, react_1.useState)(false), showGrid = _h[0], setShowGrid = _h[1];
    var _j = (0, react_1.useState)(false), isPanning = _j[0], setIsPanning = _j[1];
    var _k = (0, useDensityMode_1.useDensityMode)(), densityMode = _k.densityMode, toggleDensity = _k.toggleDensity, isMobile = _k.isMobile, _isTablet = _k.isTablet;
    // Touch gesture handling
    var handlePan = (0, react_1.useCallback)(function (deltaX, deltaY, _velocity) {
        if (onPan) {
            onPan(deltaX, deltaY);
        }
        setIsPanning(true);
    }, [onPan]);
    var handlePinch = (0, react_1.useCallback)(function (scale, _center) {
        if (onZoom) {
            var newZoom = Math.max(0.5, Math.min(3, zoom * scale));
            onZoom(newZoom);
        }
    }, [onZoom, zoom]);
    var handleTap = (0, react_1.useCallback)(function (_point) {
        // Handle tap actions
        logger_1.logger.debug('Tap gesture detected', {}, 'MobileDashboard');
    }, []);
    var handleDoubleTap = (0, react_1.useCallback)(function (_point) {
        // Double tap to reset zoom
        if (onZoom && onPan && onReset) {
            onZoom(1);
            onPan(0, 0);
            onReset();
        }
    }, [onZoom, onPan, onReset]);
    var handleSwipe = (0, react_1.useCallback)(function (direction, velocity) {
        // Handle swipe gestures for navigation
        logger_1.logger.debug('Swipe gesture detected', { direction: direction, velocity: velocity }, 'MobileDashboard');
    }, []);
    var _l = (0, useTouchGestures_1.useTouchGestures)({
        onPan: handlePan,
        onPinch: handlePinch,
        onTap: handleTap,
        onDoubleTap: handleDoubleTap,
        onSwipe: handleSwipe,
        enablePinch: true,
        enablePan: true,
        enableTap: true,
        enableSwipe: true
    }), gestureState = _l.gestureState, handleTouchStart = _l.handleTouchStart, handleTouchMove = _l.handleTouchMove, handleTouchEnd = _l.handleTouchEnd, handleTouchCancel = _l.handleTouchCancel;
    // Device mode detection and styling
    var deviceStyles = (0, react_1.useMemo)(function () {
        switch (deviceMode) {
            case 'mobile':
                return {
                    maxWidth: '375px',
                    margin: '0 auto',
                    transform: 'scale(0.8)',
                    transformOrigin: 'top center'
                };
            case 'tablet':
                return {
                    maxWidth: '768px',
                    margin: '0 auto',
                    transform: 'scale(0.9)',
                    transformOrigin: 'top center'
                };
            default:
                return {
                    maxWidth: '100%',
                    margin: '0',
                    transform: 'scale(1)',
                    transformOrigin: 'top center'
                };
        }
    }, [deviceMode]);
    var toggleFullscreen = (0, react_1.useCallback)(function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        }
        else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);
    var toggleDeviceMode = (0, react_1.useCallback)(function () {
        setDeviceMode(function (prev) {
            switch (prev) {
                case 'desktop': return 'tablet';
                case 'tablet': return 'mobile';
                default: return 'desktop';
            }
        });
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mobile-dashboard ".concat(className), children: [showMobileControls && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 space-y-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: toggleDeviceMode, className: "p-2 hover:bg-gray-100 rounded-md transition-colors", title: "Switch to ".concat(deviceMode === 'desktop' ? 'tablet' : deviceMode === 'tablet' ? 'mobile' : 'desktop', " view"), children: [deviceMode === 'mobile' && (0, jsx_runtime_1.jsx)(lucide_react_1.Smartphone, { className: "w-4 h-4" }), deviceMode === 'tablet' && (0, jsx_runtime_1.jsx)(lucide_react_1.Tablet, { className: "w-4 h-4" }), deviceMode === 'desktop' && (0, jsx_runtime_1.jsx)(lucide_react_1.Monitor, { className: "w-4 h-4" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: toggleDensity, className: "p-2 hover:bg-gray-100 rounded-md transition-colors", title: "Switch to ".concat(densityMode === 'dense' ? 'standard' : 'dense', " density"), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowGrid(!showGrid); }, className: "p-2 hover:bg-gray-100 rounded-md transition-colors", title: "Toggle grid overlay", children: showGrid ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: toggleFullscreen, className: "p-2 hover:bg-gray-100 rounded-md transition-colors", title: isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen', children: isFullscreen ? (0, jsx_runtime_1.jsx)(lucide_react_1.Minimize2, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onReset, className: "p-2 hover:bg-gray-100 rounded-md transition-colors", title: "Reset view", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowMobileControls(!showMobileControls); }, className: "p-2 hover:bg-gray-100 rounded-md transition-colors", title: "Toggle mobile controls", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" }) })] })), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowMobileControls(!showMobileControls); }, className: "fixed top-4 right-4 z-40 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors", title: "Mobile controls", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Smartphone, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-container relative overflow-hidden ".concat(isPanning ? 'cursor-grabbing' : 'cursor-grab', " ").concat(densityMode === 'dense' ? 'dense-mode' : 'standard-mode'), style: deviceStyles, onTouchStart: function (e) { return handleTouchStart(e.nativeEvent); }, onTouchMove: function (e) { return handleTouchMove(e.nativeEvent); }, onTouchEnd: function (e) { return handleTouchEnd(e.nativeEvent); }, onTouchCancel: function (e) { return handleTouchCancel(e.nativeEvent); }, onMouseDown: function (e) {
                    // Handle mouse events for desktop
                    if (!isMobile) {
                        handleTouchStart(e);
                    }
                }, onMouseMove: function (e) {
                    if (!isMobile && gestureState.isGesturing) {
                        handleTouchMove(e);
                    }
                }, onMouseUp: function (e) {
                    if (!isMobile) {
                        handleTouchEnd(e);
                    }
                }, children: [showGrid && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pointer-events-none opacity-20", style: {
                            backgroundImage: "\n                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),\n                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)\n              ",
                            backgroundSize: '20px 20px'
                        } })), (0, jsx_runtime_1.jsx)("div", { className: "dashboard-content", style: {
                            transform: "translate(".concat(pan.x, "px, ").concat(pan.y, "px) scale(").concat(zoom, ")"),
                            transformOrigin: 'center center',
                            transition: isPanning ? 'none' : 'transform 0.2s ease-out'
                        }, children: children }), gestureState.isGesturing && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed top-20 left-4 z-30 bg-black/80 text-white px-3 py-2 rounded-lg text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Gesture: ", gestureState.gestureType] }), gestureState.gestureType === 'pinch' && ((0, jsx_runtime_1.jsxs)("div", { children: ["Scale: ", gestureState.scale.toFixed(2)] })), gestureState.gestureType === 'pan' && ((0, jsx_runtime_1.jsxs)("div", { children: ["Delta: ", gestureState.deltaX.toFixed(0), ", ", gestureState.deltaY.toFixed(0)] }))] }))] }), (0, jsx_runtime_1.jsx)("style", { children: "\n        .mobile-dashboard {\n          height: 100vh;\n          width: 100vw;\n          overflow: hidden;\n          position: relative;\n        }\n\n        .dashboard-container {\n          height: 100%;\n          width: 100%;\n          touch-action: none;\n          user-select: none;\n        }\n\n        .dashboard-content {\n          height: 100%;\n          width: 100%;\n          will-change: transform;\n        }\n\n        /* Mobile optimizations */\n        @media (max-width: 768px) {\n          .mobile-dashboard {\n            padding: 0;\n          }\n          \n          .dashboard-container {\n            padding: 8px;\n          }\n        }\n\n        /* Touch feedback */\n        .dashboard-container:active {\n          cursor: grabbing;\n        }\n\n        /* Density mode styles */\n        .dense-mode .dashboard-content {\n          transform: scale(0.9);\n        }\n\n        .standard-mode .dashboard-content {\n          transform: scale(1);\n        }\n\n        /* Device mode specific styles */\n        @media (max-width: 375px) {\n          .mobile-dashboard {\n            font-size: 14px;\n          }\n        }\n\n        @media (min-width: 376px) and (max-width: 768px) {\n          .mobile-dashboard {\n            font-size: 16px;\n          }\n        }\n\n        /* High DPI displays */\n        @media (-webkit-min-device-pixel-ratio: 2) {\n          .dashboard-content {\n            image-rendering: -webkit-optimize-contrast;\n          }\n        }\n      " })] }));
}
