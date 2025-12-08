"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoScroll = void 0;
var react_1 = require("react");
var useAutoScroll = function (_a) {
    var containerRef = _a.containerRef, scrollToCard = _a.scrollToCard, _b = _a.enableAutoScroll, enableAutoScroll = _b === void 0 ? true : _b, _c = _a.scrollSpeed, scrollSpeed = _c === void 0 ? 15 : _c, // Pixels to scroll per frame
    _d = _a.boundaryZone // Distance from edge to trigger scroll
    , // Pixels to scroll per frame
    boundaryZone = _d === void 0 ? 80 : _d // Distance from edge to trigger scroll
    ;
    var scrollFrameRef = (0, react_1.useRef)(null);
    var lastMousePosition = (0, react_1.useRef)(null);
    var isScrollingRef = (0, react_1.useRef)(false);
    // Stop auto-scrolling
    var stopAutoScroll = (0, react_1.useCallback)(function () {
        if (scrollFrameRef.current) {
            cancelAnimationFrame(scrollFrameRef.current);
            scrollFrameRef.current = null;
        }
        isScrollingRef.current = false;
    }, []);
    // Find the actual scrollable container (might be the container or a parent)
    var getScrollableContainer = (0, react_1.useCallback)(function () {
        if (!containerRef.current)
            return null;
        var element = containerRef.current;
        // Check if the container itself is scrollable
        var style = window.getComputedStyle(element);
        var isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            element.scrollHeight > element.clientHeight;
        if (isScrollable) {
            return element;
        }
        // If not, find the scrollable parent
        element = element.parentElement;
        while (element) {
            var parentStyle = window.getComputedStyle(element);
            var parentIsScrollable = (parentStyle.overflowY === 'auto' || parentStyle.overflowY === 'scroll') &&
                element.scrollHeight > element.clientHeight;
            if (parentIsScrollable) {
                return element;
            }
            element = element.parentElement;
        }
        // Fallback to the original container
        return containerRef.current;
    }, [containerRef]);
    // Continuous smooth scrolling animation
    var performScroll = (0, react_1.useCallback)(function () {
        var container = getScrollableContainer();
        if (!container || !lastMousePosition.current) {
            stopAutoScroll();
            return;
        }
        var rect = container.getBoundingClientRect();
        var mouseY = lastMousePosition.current.y;
        var threshold = boundaryZone;
        // Calculate distance from edges of the scrollable container
        var distanceFromTop = mouseY - rect.top;
        var distanceFromBottom = rect.bottom - mouseY;
        // Determine scroll direction and speed based on proximity to edge
        var scrollDelta = 0;
        if (distanceFromTop < threshold && distanceFromTop > 0) {
            // Near top edge - scroll up
            var proximity = Math.max(0, threshold - distanceFromTop);
            var speedMultiplier = 1 - (proximity / threshold); // Faster when closer to edge (0 to 1)
            scrollDelta = -scrollSpeed * (1 + speedMultiplier * 2); // Base speed + up to 2x multiplier
        }
        else if (distanceFromBottom < threshold && distanceFromBottom > 0) {
            // Near bottom edge - scroll down
            var proximity = Math.max(0, threshold - distanceFromBottom);
            var speedMultiplier = 1 - (proximity / threshold);
            scrollDelta = scrollSpeed * (1 + speedMultiplier * 2);
        }
        // Apply scroll if needed
        if (scrollDelta !== 0) {
            var currentScrollTop = container.scrollTop;
            var maxScrollTop = container.scrollHeight - container.clientHeight;
            var newScrollTop = Math.max(0, Math.min(maxScrollTop, currentScrollTop + scrollDelta));
            if (newScrollTop !== currentScrollTop) {
                // Direct scroll assignment for immediate response
                container.scrollTop = newScrollTop;
                isScrollingRef.current = true;
                // Continue scrolling on next frame
                scrollFrameRef.current = requestAnimationFrame(performScroll);
            }
            else {
                // Reached scroll limit - stop scrolling
                stopAutoScroll();
            }
        }
        else {
            // Mouse moved away from edge - stop scrolling
            stopAutoScroll();
        }
    }, [getScrollableContainer, boundaryZone, scrollSpeed, stopAutoScroll]);
    // Auto-scroll during drag operations - smooth continuous scrolling
    var handleAutoScroll = (0, react_1.useCallback)(function (_cardId, mouseY) {
        if (!enableAutoScroll) {
            stopAutoScroll();
            return;
        }
        // Always update mouse position (called on every mouse move during drag)
        // mouseY is in screen coordinates (clientY)
        lastMousePosition.current = { x: 0, y: mouseY };
        var container = getScrollableContainer();
        if (!container) {
            stopAutoScroll();
            return;
        }
        var rect = container.getBoundingClientRect();
        var threshold = boundaryZone;
        // Check if mouse is near edges of the scrollable container
        var distanceFromTop = mouseY - rect.top;
        var distanceFromBottom = rect.bottom - mouseY;
        var isNearEdge = (distanceFromTop < threshold && distanceFromTop > 0) ||
            (distanceFromBottom < threshold && distanceFromBottom > 0);
        if (isNearEdge) {
            // Start or continue scrolling
            if (!isScrollingRef.current) {
                isScrollingRef.current = true;
                scrollFrameRef.current = requestAnimationFrame(performScroll);
            }
            // If already scrolling, performScroll will pick up the updated mouse position on next frame
        }
        else {
            // Stop scrolling if mouse moved away from edge
            stopAutoScroll();
        }
    }, [enableAutoScroll, getScrollableContainer, boundaryZone, stopAutoScroll, performScroll]);
    // Cleanup on unmount
    (0, react_1.useEffect)(function () {
        return function () {
            stopAutoScroll();
        };
    }, [stopAutoScroll]);
    return {
        handleAutoScroll: handleAutoScroll,
        scrollToCard: scrollToCard,
        stopAutoScroll: stopAutoScroll
    };
};
exports.useAutoScroll = useAutoScroll;
