"use strict";
/**
 * Debounce utility function
 * Delays function execution until after a specified wait time
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = debounce;
exports.debounceImmediate = debounceImmediate;
function debounce(func, wait) {
    var timeout = null;
    return function executedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var later = function () {
            timeout = null;
            func.apply(void 0, args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
/**
 * Debounce with immediate execution option
 */
function debounceImmediate(func, wait, immediate) {
    if (immediate === void 0) { immediate = false; }
    var timeout = null;
    return function executedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callNow = immediate && !timeout;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(void 0, args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(void 0, args);
    };
}
