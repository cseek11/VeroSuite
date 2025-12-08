"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntersectionObserver = useIntersectionObserver;
var react_1 = require("react");
/**
 * Hook for observing element intersection with viewport
 */
function useIntersectionObserver(containerRef, options) {
    if (options === void 0) { options = {}; }
    var _a = (0, react_1.useState)(null), observer = _a[0], setObserver = _a[1];
    var observedElements = (0, react_1.useRef)(new Map());
    (0, react_1.useEffect)(function () {
        var _a, _b, _c;
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                observedElements.current.set(entry.target, entry.isIntersecting);
            });
        }, {
            threshold: (_a = options.threshold) !== null && _a !== void 0 ? _a : 0,
            rootMargin: (_b = options.rootMargin) !== null && _b !== void 0 ? _b : '0px',
            root: (_c = options.root) !== null && _c !== void 0 ? _c : containerRef.current
        });
        setObserver(obs);
        return function () {
            obs.disconnect();
            observedElements.current.clear();
        };
    }, [containerRef, options.threshold, options.rootMargin, options.root]);
    if (!observer) {
        return null;
    }
    return {
        isIntersecting: function (element) {
            var _a;
            return (_a = observedElements.current.get(element)) !== null && _a !== void 0 ? _a : false;
        },
        observe: function (element) {
            observer.observe(element);
        },
        unobserve: function (element) {
            observer.unobserve(element);
            observedElements.current.delete(element);
        },
        disconnect: function () {
            observer.disconnect();
            observedElements.current.clear();
        }
    };
}
