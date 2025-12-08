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
exports.useVirtualScrolling = useVirtualScrolling;
var react_1 = require("react");
function useVirtualScrolling(options) {
    var itemHeight = options.itemHeight, containerHeight = options.containerHeight, _a = options.overscan, overscan = _a === void 0 ? 5 : _a, _b = options.threshold, threshold = _b === void 0 ? 100 : _b;
    var _c = (0, react_1.useState)(0), scrollTop = _c[0], setScrollTop = _c[1];
    var _d = (0, react_1.useState)(0), itemCount = _d[0], setItemCount = _d[1];
    var _e = (0, react_1.useState)(false), isEnabled = _e[0], setIsEnabled = _e[1];
    var _f = (0, react_1.useState)(containerHeight), containerHeightState = _f[0], setContainerHeightState = _f[1];
    var containerRef = (0, react_1.useRef)(null);
    // Calculate virtual scrolling state
    var virtualState = (0, react_1.useMemo)(function () {
        if (!isEnabled || itemCount === 0) {
            return {
                startIndex: 0,
                endIndex: itemCount - 1,
                totalHeight: itemCount * itemHeight,
                offsetY: 0,
                isVirtualScrolling: false
            };
        }
        var visibleCount = Math.ceil(containerHeightState / itemHeight);
        var startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        var endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);
        var totalHeight = itemCount * itemHeight;
        var offsetY = startIndex * itemHeight;
        return {
            startIndex: startIndex,
            endIndex: endIndex,
            totalHeight: totalHeight,
            offsetY: offsetY,
            isVirtualScrolling: itemCount > threshold
        };
    }, [isEnabled, itemCount, itemHeight, containerHeightState, scrollTop, overscan, threshold]);
    // Enable virtual scrolling when item count exceeds threshold
    var enableVirtualScrolling = (0, react_1.useCallback)(function (count) {
        setItemCount(count);
        setIsEnabled(count > threshold);
    }, [threshold]);
    // Disable virtual scrolling
    var disableVirtualScrolling = (0, react_1.useCallback)(function () {
        setIsEnabled(false);
        setItemCount(0);
    }, []);
    // Update container height
    var updateContainerHeight = (0, react_1.useCallback)(function (height) {
        setContainerHeightState(height);
    }, []);
    // Scroll to specific index
    var scrollToIndex = (0, react_1.useCallback)(function (index) {
        if (containerRef.current) {
            var targetScrollTop = index * itemHeight;
            containerRef.current.scrollTop = targetScrollTop;
            setScrollTop(targetScrollTop);
        }
    }, [itemHeight]);
    // Get visible items for rendering
    var getVisibleItems = (0, react_1.useCallback)(function (items) {
        if (!virtualState.isVirtualScrolling) {
            return items;
        }
        return items.slice(virtualState.startIndex, virtualState.endIndex + 1);
    }, [virtualState]);
    // Get style for individual items
    var getItemStyle = (0, react_1.useCallback)(function (index) {
        if (!virtualState.isVirtualScrolling) {
            return {};
        }
        var adjustedIndex = index - virtualState.startIndex;
        return {
            position: 'absolute',
            top: adjustedIndex * itemHeight,
            height: itemHeight,
            width: '100%'
        };
    }, [virtualState, itemHeight]);
    // Handle scroll events
    var handleScroll = (0, react_1.useCallback)(function (e) {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);
    // Set up scroll listener
    (0, react_1.useEffect)(function () {
        var container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return function () { return container.removeEventListener('scroll', handleScroll); };
        }
        return undefined;
    }, [handleScroll]);
    return __assign(__assign({}, virtualState), { enableVirtualScrolling: enableVirtualScrolling, disableVirtualScrolling: disableVirtualScrolling, updateContainerHeight: updateContainerHeight, scrollToIndex: scrollToIndex, getVisibleItems: getVisibleItems, getItemStyle: getItemStyle, 
        // Expose container ref for external use
        containerRef: containerRef });
}
