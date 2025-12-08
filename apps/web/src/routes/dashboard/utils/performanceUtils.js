"use strict";
/**
 * Performance optimization utilities
 * Provides memoization and optimization helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepEqual = exports.shallowEqual = exports.useMemoizedCallback = exports.useMemoizedValue = void 0;
var react_1 = require("react");
/**
 * Memoize expensive calculations
 */
var useMemoizedValue = function (factory, deps) {
    return (0, react_1.useMemo)(factory, deps);
};
exports.useMemoizedValue = useMemoizedValue;
/**
 * Memoize callbacks to prevent unnecessary re-renders
 */
var useMemoizedCallback = function (callback, deps) {
    return (0, react_1.useCallback)(callback, deps);
};
exports.useMemoizedCallback = useMemoizedCallback;
/**
 * Shallow comparison for objects
 */
var shallowEqual = function (obj1, obj2) {
    if (obj1 === obj2)
        return true;
    if (!obj1 || !obj2)
        return false;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object')
        return false;
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length)
        return false;
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        if (obj1[key] !== obj2[key])
            return false;
    }
    return true;
};
exports.shallowEqual = shallowEqual;
/**
 * Deep comparison for objects (use sparingly - expensive)
 */
var deepEqual = function (obj1, obj2) {
    if (obj1 === obj2)
        return true;
    if (!obj1 || !obj2)
        return false;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object')
        return false;
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length)
        return false;
    for (var _i = 0, keys1_2 = keys1; _i < keys1_2.length; _i++) {
        var key = keys1_2[_i];
        if (!keys2.includes(key))
            return false;
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!(0, exports.deepEqual)(obj1[key], obj2[key]))
                return false;
        }
        else if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
};
exports.deepEqual = deepEqual;
