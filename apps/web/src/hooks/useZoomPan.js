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
exports.useZoomPan = useZoomPan;
var react_1 = require("react");
function useZoomPan(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.minZoom, minZoom = _c === void 0 ? 0.25 : _c, _d = _b.maxZoom, maxZoom = _d === void 0 ? 3 : _d, _e = _b.zoomStep, zoomStep = _e === void 0 ? 0.1 : _e;
    var _f = (0, react_1.useState)({
        zoom: 1,
        pan: { x: 0, y: 0 },
        isDragging: false,
        dragStart: { x: 0, y: 0 }
    }), state = _f[0], setState = _f[1];
    var containerRef = (0, react_1.useRef)(null);
    var isDraggingRef = (0, react_1.useRef)(false);
    // Zoom in
    var zoomIn = (0, react_1.useCallback)(function () {
        setState(function (prev) { return (__assign(__assign({}, prev), { zoom: Math.min(maxZoom, prev.zoom + zoomStep) })); });
    }, [maxZoom, zoomStep]);
    // Zoom out
    var zoomOut = (0, react_1.useCallback)(function () {
        setState(function (prev) { return (__assign(__assign({}, prev), { zoom: Math.max(minZoom, prev.zoom - zoomStep) })); });
    }, [minZoom, zoomStep]);
    // Set specific zoom level
    var setZoom = (0, react_1.useCallback)(function (zoom) {
        setState(function (prev) { return (__assign(__assign({}, prev), { zoom: Math.max(minZoom, Math.min(maxZoom, zoom)) })); });
    }, [minZoom, maxZoom]);
    // Set specific pan position
    var setPan = (0, react_1.useCallback)(function (pan) {
        setState(function (prev) { return (__assign(__assign({}, prev), { pan: pan })); });
    }, []);
    // Reset zoom and pan
    var resetView = (0, react_1.useCallback)(function () {
        setState(function (prev) { return (__assign(__assign({}, prev), { zoom: 1, pan: { x: 0, y: 0 } })); });
    }, []);
    // Fit to view
    var fitToView = (0, react_1.useCallback)(function (contentBounds) {
        if (!containerRef.current)
            return;
        var container = containerRef.current.getBoundingClientRect();
        var scaleX = container.width / contentBounds.width;
        var scaleY = container.height / contentBounds.height;
        var scale = Math.min(scaleX, scaleY, maxZoom);
        setState(function (prev) { return (__assign(__assign({}, prev), { zoom: Math.max(minZoom, scale * 0.9), pan: { x: 0, y: 0 } })); });
    }, [minZoom, maxZoom]);
    // Handle wheel zoom
    var handleWheel = (0, react_1.useCallback)(function (e) {
        var _a;
        if (!e.ctrlKey && !e.metaKey)
            return;
        e.preventDefault();
        var rect = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (!rect)
            return;
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        // Calculate zoom point
        var zoomPoint = {
            x: (mouseX - state.pan.x) / state.zoom,
            y: (mouseY - state.pan.y) / state.zoom
        };
        var deltaZoom = e.deltaY > 0 ? -zoomStep : zoomStep;
        var newZoom = Math.max(minZoom, Math.min(maxZoom, state.zoom + deltaZoom));
        // Adjust pan to zoom around mouse position
        var newPan = {
            x: mouseX - zoomPoint.x * newZoom,
            y: mouseY - zoomPoint.y * newZoom
        };
        setState(function (prev) { return (__assign(__assign({}, prev), { zoom: newZoom, pan: newPan })); });
    }, [state.zoom, state.pan, minZoom, maxZoom, zoomStep]);
    // Handle pan start
    var handlePanStart = (0, react_1.useCallback)(function (e) {
        if (e.button !== 1)
            return; // Only middle mouse button
        e.preventDefault();
        isDraggingRef.current = true;
        setState(function (prev) { return (__assign(__assign({}, prev), { isDragging: true, dragStart: { x: e.clientX, y: e.clientY } })); });
        document.body.style.cursor = 'grabbing';
    }, []);
    // Handle pan move
    var handlePanMove = (0, react_1.useCallback)(function (e) {
        if (!isDraggingRef.current)
            return;
        var deltaX = e.clientX - state.dragStart.x;
        var deltaY = e.clientY - state.dragStart.y;
        setState(function (prev) { return (__assign(__assign({}, prev), { pan: {
                x: prev.pan.x + deltaX,
                y: prev.pan.y + deltaY
            }, dragStart: { x: e.clientX, y: e.clientY } })); });
    }, [state.dragStart]);
    // Handle pan end
    var handlePanEnd = (0, react_1.useCallback)(function () {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        setState(function (prev) { return (__assign(__assign({}, prev), { isDragging: false })); });
    }, []);
    // Add event listeners
    (0, react_1.useEffect)(function () {
        var container = containerRef.current;
        if (!container)
            return;
        container.addEventListener('wheel', handleWheel, { passive: false });
        if (state.isDragging) {
            document.addEventListener('mousemove', handlePanMove);
            document.addEventListener('mouseup', handlePanEnd);
        }
        return function () {
            container.removeEventListener('wheel', handleWheel);
            document.removeEventListener('mousemove', handlePanMove);
            document.removeEventListener('mouseup', handlePanEnd);
        };
    }, [handleWheel, handlePanMove, handlePanEnd, state.isDragging]);
    // Calculate canvas size based on content bounds
    var calculateCanvasSize = (0, react_1.useCallback)(function (contentBounds) {
        var _a, _b, _c, _d;
        if (!contentBounds || !containerRef.current) {
            return { width: 0, height: 0 };
        }
        var container = containerRef.current.getBoundingClientRect();
        var viewportWidth = container.width;
        var viewportHeight = container.height;
        // Calculate bounding box with padding (20% of viewport)
        var paddingX = viewportWidth * 0.2;
        var paddingY = viewportHeight * 0.2;
        var minX = (_a = contentBounds.minX) !== null && _a !== void 0 ? _a : 0;
        var minY = (_b = contentBounds.minY) !== null && _b !== void 0 ? _b : 0;
        var maxX = (_c = contentBounds.maxX) !== null && _c !== void 0 ? _c : contentBounds.width;
        var maxY = (_d = contentBounds.maxY) !== null && _d !== void 0 ? _d : contentBounds.height;
        var contentWidth = Math.max(maxX - minX, viewportWidth);
        var contentHeight = Math.max(maxY - minY, viewportHeight);
        return {
            width: Math.max(contentWidth + paddingX * 2, viewportWidth),
            height: Math.max(contentHeight + paddingY * 2, viewportHeight)
        };
    }, []);
    // Get transform style with improved rendering
    var getTransformStyle = (0, react_1.useCallback)(function () {
        return {
            transform: "translate3d(".concat(state.pan.x, "px, ").concat(state.pan.y, "px, 0) scale3d(").concat(state.zoom, ", ").concat(state.zoom, ", 1)"),
            transformOrigin: '0 0',
            transition: state.isDragging ? 'none' : 'transform 0.1s ease-out',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
        };
    }, [state.zoom, state.pan, state.isDragging]);
    return {
        containerRef: containerRef,
        zoom: state.zoom,
        pan: state.pan,
        isDragging: state.isDragging,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        setZoom: setZoom,
        setPan: setPan,
        resetView: resetView,
        fitToView: fitToView,
        handlePanStart: handlePanStart,
        getTransformStyle: getTransformStyle,
        calculateCanvasSize: calculateCanvasSize,
        canZoomIn: state.zoom < maxZoom,
        canZoomOut: state.zoom > minZoom
    };
}
