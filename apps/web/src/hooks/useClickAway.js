"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClickAway = void 0;
var react_1 = require("react");
/**
 * Hook that triggers a callback when clicking outside of the specified element
 * @param ref - Ref to the element to watch
 * @param handler - Callback function to execute when clicking outside
 * @param excludeRefs - Array of refs to exclude from the click away detection
 */
var useClickAway = function (ref, handler, excludeRefs) {
    if (excludeRefs === void 0) { excludeRefs = []; }
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            // Check if the click is outside the main ref
            if (ref.current && !ref.current.contains(event.target)) {
                // Check if the click is inside any of the excluded refs
                var isInsideExcluded = excludeRefs.some(function (excludeRef) { return excludeRef.current && excludeRef.current.contains(event.target); });
                // Only trigger handler if not inside excluded refs
                if (!isInsideExcluded) {
                    handler();
                }
            }
        };
        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);
        // Cleanup
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handler, excludeRefs]);
};
exports.useClickAway = useClickAway;
