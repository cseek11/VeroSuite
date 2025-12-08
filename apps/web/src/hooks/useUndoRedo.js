"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUndoRedo = useUndoRedo;
var react_1 = require("react");
function useUndoRedo(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.maxHistorySize, maxHistorySize = _c === void 0 ? 50 : _c, _d = _b.debounceMs, debounceMs = _d === void 0 ? 300 : _d;
    var _e = (0, react_1.useState)([]), history = _e[0], setHistory = _e[1];
    var _f = (0, react_1.useState)(-1), currentIndex = _f[0], setCurrentIndex = _f[1];
    var debounceTimerRef = (0, react_1.useRef)(null);
    var saveState = (0, react_1.useCallback)(function (regions) {
        // Debounce to avoid saving on every keystroke
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(function () {
            setHistory(function (prev) {
                // Remove any states after current index (when user undid and then made new changes)
                var newHistory = prev.slice(0, currentIndex + 1);
                // Add new state
                var newState = {
                    regions: JSON.parse(JSON.stringify(regions)), // Deep clone
                    timestamp: Date.now()
                };
                var updated = __spreadArray(__spreadArray([], newHistory, true), [newState], false);
                // Limit history size
                if (updated.length > maxHistorySize) {
                    return updated.slice(-maxHistorySize);
                }
                return updated;
            });
            setCurrentIndex(function (prev) {
                var newIndex = prev + 1;
                // Ensure index doesn't exceed history length
                return Math.min(newIndex, maxHistorySize - 1);
            });
        }, debounceMs);
    }, [currentIndex, maxHistorySize, debounceMs]);
    var undo = (0, react_1.useCallback)(function () {
        var _a;
        if (currentIndex <= 0)
            return null;
        var newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        return ((_a = history[newIndex]) === null || _a === void 0 ? void 0 : _a.regions) || null;
    }, [currentIndex, history]);
    var redo = (0, react_1.useCallback)(function () {
        var _a;
        if (currentIndex >= history.length - 1)
            return null;
        var newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        return ((_a = history[newIndex]) === null || _a === void 0 ? void 0 : _a.regions) || null;
    }, [currentIndex, history]);
    var clearHistory = (0, react_1.useCallback)(function () {
        setHistory([]);
        setCurrentIndex(-1);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    }, []);
    return {
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        undo: undo,
        redo: redo,
        saveState: saveState,
        clearHistory: clearHistory,
        historySize: history.length
    };
}
