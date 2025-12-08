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
exports.LazyRegion = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var RegionContainer_1 = require("./RegionContainer");
var LazyRegion = function (_a) {
    var region = _a.region, children = _a.children, onResize = _a.onResize, onMove = _a.onMove, onToggleCollapse = _a.onToggleCollapse, onToggleLock = _a.onToggleLock, onDelete = _a.onDelete, renderSkeleton = _a.renderSkeleton;
    var _b = (0, react_1.useState)(false), isVisible = _b[0], setIsVisible = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var containerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!containerRef.current)
            return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Simulate loading delay
                    setTimeout(function () {
                        setIsLoading(false);
                    }, 200);
                }
            });
        }, {
            root: null,
            rootMargin: '100px', // Start loading 100px before entering viewport
            threshold: 0.1
        });
        observer.observe(containerRef.current);
        return function () {
            observer.disconnect();
        };
    }, []);
    var defaultSkeleton = function () { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/2 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-2/3" })] })); };
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, children: isVisible ? (isLoading ? ((0, jsx_runtime_1.jsx)(RegionContainer_1.RegionContainer, __assign({ region: region }, (onResize ? { onResize: onResize } : {}), (onMove ? { onMove: onMove } : {}), (onToggleCollapse ? { onToggleCollapse: onToggleCollapse } : {}), (onToggleLock ? { onToggleLock: onToggleLock } : {}), (onDelete ? { onDelete: onDelete } : {}), { children: renderSkeleton ? renderSkeleton() : defaultSkeleton() }))) : ((0, jsx_runtime_1.jsx)(RegionContainer_1.RegionContainer, __assign({ region: region }, (onResize ? { onResize: onResize } : {}), (onMove ? { onMove: onMove } : {}), (onToggleCollapse ? { onToggleCollapse: onToggleCollapse } : {}), (onToggleLock ? { onToggleLock: onToggleLock } : {}), (onDelete ? { onDelete: onDelete } : {}), { children: children })))) : ((0, jsx_runtime_1.jsx)(RegionContainer_1.RegionContainer, __assign({ region: region }, (onResize ? { onResize: onResize } : {}), (onMove ? { onMove: onMove } : {}), (onToggleCollapse ? { onToggleCollapse: onToggleCollapse } : {}), (onToggleLock ? { onToggleLock: onToggleLock } : {}), (onDelete ? { onDelete: onDelete } : {}), { children: renderSkeleton ? renderSkeleton() : defaultSkeleton() }))) }));
};
exports.LazyRegion = LazyRegion;
