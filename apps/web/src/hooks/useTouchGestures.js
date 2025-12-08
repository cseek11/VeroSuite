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
exports.useTouchGestures = useTouchGestures;
var react_1 = require("react");
function useTouchGestures(_a) {
    var _b = _a === void 0 ? {} : _a, onPan = _b.onPan, onPinch = _b.onPinch, onRotate = _b.onRotate, onTap = _b.onTap, onDoubleTap = _b.onDoubleTap, onLongPress = _b.onLongPress, onSwipe = _b.onSwipe, onGestureStart = _b.onGestureStart, onGestureEnd = _b.onGestureEnd, _c = _b.enablePinch, enablePinch = _c === void 0 ? true : _c, _d = _b.enablePan, enablePan = _d === void 0 ? true : _d, _e = _b.enableTap, enableTap = _e === void 0 ? true : _e, _f = _b.enableSwipe, enableSwipe = _f === void 0 ? true : _f, _g = _b.longPressDelay, longPressDelay = _g === void 0 ? 500 : _g, _h = _b.swipeThreshold, swipeThreshold = _h === void 0 ? 50 : _h, _j = _b.pinchThreshold, pinchThreshold = _j === void 0 ? 0.1 : _j;
    var _k = (0, react_1.useState)({
        isGesturing: false,
        gestureType: null,
        startPoints: [],
        currentPoints: [],
        deltaX: 0,
        deltaY: 0,
        scale: 1,
        rotation: 0,
        velocity: { x: 0, y: 0 },
        direction: null
    }), gestureState = _k[0], setGestureState = _k[1];
    var lastTapTime = (0, react_1.useRef)(0);
    var lastTapPoint = (0, react_1.useRef)({ x: 0, y: 0 });
    var longPressTimer = (0, react_1.useRef)(null);
    var lastMoveTime = (0, react_1.useRef)(0);
    var lastMovePoint = (0, react_1.useRef)({ x: 0, y: 0 });
    // Helper function to get touch points from event
    var getTouchPoints = (0, react_1.useCallback)(function (e) {
        return Array.from(e.touches).map(function (touch) { return ({
            x: touch.clientX,
            y: touch.clientY,
            id: touch.identifier
        }); });
    }, []);
    // Helper function to calculate distance between two points
    var getDistance = (0, react_1.useCallback)(function (p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }, []);
    // Helper function to calculate angle between two points
    var getAngle = (0, react_1.useCallback)(function (p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }, []);
    // Helper function to calculate center point
    var getCenter = (0, react_1.useCallback)(function (points) {
        if (points.length === 0)
            return { x: 0, y: 0 };
        if (points.length === 1 && points[0])
            return { x: points[0].x, y: points[0].y };
        var sumX = points.reduce(function (sum, p) { return sum + p.x; }, 0);
        var sumY = points.reduce(function (sum, p) { return sum + p.y; }, 0);
        return {
            x: sumX / points.length,
            y: sumY / points.length
        };
    }, []);
    // Helper function to detect swipe direction
    var getSwipeDirection = (0, react_1.useCallback)(function (deltaX, deltaY) {
        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);
        if (absX > absY) {
            return deltaX > 0 ? 'right' : 'left';
        }
        else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }, []);
    // Touch start handler
    var handleTouchStart = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        var points = getTouchPoints(e);
        var center = getCenter(points);
        // Clear any existing long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        // Start long press timer for single touch
        if (points.length === 1 && onLongPress) {
            longPressTimer.current = setTimeout(function () {
                onLongPress(center);
                setGestureState(function (prev) { return (__assign(__assign({}, prev), { gestureType: 'long-press' })); });
            }, longPressDelay);
        }
        setGestureState(function (prev) { return (__assign(__assign({}, prev), { isGesturing: true, gestureType: null, startPoints: points, currentPoints: points, deltaX: 0, deltaY: 0, scale: 1, rotation: 0, velocity: { x: 0, y: 0 }, direction: null })); });
        // Initialize velocity tracking
        lastMoveTime.current = Date.now();
        lastMovePoint.current = center;
    }, [getTouchPoints, getCenter, onLongPress, longPressDelay]);
    // Touch move handler
    var handleTouchMove = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        var points = getTouchPoints(e);
        var center = getCenter(points);
        var currentTime = Date.now();
        // Calculate velocity
        var timeDelta = currentTime - lastMoveTime.current;
        if (timeDelta > 0) {
            var velocityX_1 = (center.x - lastMovePoint.current.x) / timeDelta;
            var velocityY_1 = (center.y - lastMovePoint.current.y) / timeDelta;
            setGestureState(function (prev) { return (__assign(__assign({}, prev), { currentPoints: points, velocity: { x: velocityX_1, y: velocityY_1 } })); });
        }
        lastMoveTime.current = currentTime;
        lastMovePoint.current = center;
        setGestureState(function (prev) {
            var startCenter = getCenter(prev.startPoints);
            var deltaX = center.x - startCenter.x;
            var deltaY = center.y - startCenter.y;
            var gestureType = prev.gestureType;
            var scale = prev.scale;
            var rotation = prev.rotation;
            // Detect gesture type if not already detected
            if (!gestureType) {
                if (points.length === 1 && enablePan) {
                    gestureType = 'pan';
                    if (onGestureStart)
                        onGestureStart('pan');
                }
                else if (points.length === 2 && enablePinch) {
                    gestureType = 'pinch';
                    if (onGestureStart)
                        onGestureStart('pinch');
                }
            }
            // Handle pan gesture
            if (gestureType === 'pan' && points.length === 1 && onPan) {
                onPan(deltaX, deltaY, prev.velocity);
            }
            // Handle pinch gesture
            if (gestureType === 'pinch' && points.length === 2 && prev.startPoints[0] && prev.startPoints[1] && points[0] && points[1]) {
                var startDistance = getDistance(prev.startPoints[0], prev.startPoints[1]);
                var currentDistance = getDistance(points[0], points[1]);
                var newScale = currentDistance / startDistance;
                if (Math.abs(newScale - scale) > pinchThreshold && onPinch) {
                    scale = newScale;
                    onPinch(scale, center);
                }
                // Handle rotation
                if (prev.startPoints[0] && prev.startPoints[1] && points[0] && points[1]) {
                    var startAngle = getAngle(prev.startPoints[0], prev.startPoints[1]);
                    var currentAngle = getAngle(points[0], points[1]);
                    var angleDelta = currentAngle - startAngle;
                    if (Math.abs(angleDelta) > 0.1 && onRotate) {
                        rotation = angleDelta;
                        onRotate(rotation, center);
                    }
                }
            }
            return __assign(__assign({}, prev), { currentPoints: points, deltaX: deltaX, deltaY: deltaY, scale: scale, rotation: rotation, gestureType: gestureType });
        });
    }, [getTouchPoints, getCenter, enablePan, enablePinch, onPan, onPinch, onRotate, onGestureStart, getDistance, getAngle, pinchThreshold]);
    // Touch end handler
    var handleTouchEnd = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        // Clear long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        setGestureState(function (prev) {
            var gestureType = prev.gestureType, deltaX = prev.deltaX, deltaY = prev.deltaY, velocity = prev.velocity;
            // Handle tap gestures
            if (gestureType === null || gestureType === 'tap') {
                var currentTime = Date.now();
                var timeSinceLastTap = currentTime - lastTapTime.current;
                var center = getCenter(prev.currentPoints);
                // Check for double tap
                if (timeSinceLastTap < 300 &&
                    Math.abs(center.x - lastTapPoint.current.x) < 30 &&
                    Math.abs(center.y - lastTapPoint.current.y) < 30 &&
                    onDoubleTap) {
                    onDoubleTap(center);
                    lastTapTime.current = 0; // Reset to prevent triple tap
                }
                else if (enableTap && onTap) {
                    // Single tap
                    onTap(center);
                    lastTapTime.current = currentTime;
                    lastTapPoint.current = center;
                }
            }
            // Handle swipe gesture
            if (gestureType === 'pan' && enableSwipe && onSwipe) {
                var swipeDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (swipeDistance > swipeThreshold) {
                    var direction = getSwipeDirection(deltaX, deltaY);
                    if (direction) {
                        onSwipe(direction, velocity);
                    }
                }
            }
            // End gesture
            if (gestureType && onGestureEnd) {
                onGestureEnd(gestureType);
            }
            return {
                isGesturing: false,
                gestureType: null,
                startPoints: [],
                currentPoints: [],
                deltaX: 0,
                deltaY: 0,
                scale: 1,
                rotation: 0,
                velocity: { x: 0, y: 0 },
                direction: null
            };
        });
    }, [getCenter, enableTap, enableSwipe, onTap, onDoubleTap, onSwipe, onGestureEnd, getSwipeDirection, swipeThreshold]);
    // Touch cancel handler
    var handleTouchCancel = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        // Clear long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        setGestureState(function (prev) { return (__assign(__assign({}, prev), { isGesturing: false, gestureType: null })); });
    }, []);
    return {
        gestureState: gestureState,
        handleTouchStart: handleTouchStart,
        handleTouchMove: handleTouchMove,
        handleTouchEnd: handleTouchEnd,
        handleTouchCancel: handleTouchCancel
    };
}
