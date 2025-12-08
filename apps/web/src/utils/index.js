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
exports.setQueryParams = exports.getQueryParams = exports.handleError = exports.getStatusColor = exports.throttle = exports.debounce = exports.storage = exports.omit = exports.pick = exports.sortBy = exports.groupBy = exports.isValidUUID = exports.isValidPhone = exports.isValidEmail = exports.formatPhoneNumber = exports.truncate = exports.capitalize = exports.formatDateTime = exports.formatTime = exports.formatDate = void 0;
// Date utilities
// Last Updated: 2025-12-05
var formatDate = function (date, options) {
    var dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', __assign({ year: 'numeric', month: 'short', day: 'numeric' }, options));
};
exports.formatDate = formatDate;
var formatTime = function (time) {
    var timeObj = typeof time === 'string' ? new Date("2000-01-01T".concat(time)) : time;
    return timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};
exports.formatTime = formatTime;
var formatDateTime = function (dateTime) {
    var dateTimeObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    return dateTimeObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};
exports.formatDateTime = formatDateTime;
// String utilities
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
exports.capitalize = capitalize;
var truncate = function (str, length) {
    if (str.length <= length)
        return str;
    return str.slice(0, length) + '...';
};
exports.truncate = truncate;
var formatPhoneNumber = function (phone) {
    var cleaned = phone.replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return "(".concat(match[1], ") ").concat(match[2], "-").concat(match[3]);
    }
    return phone;
};
exports.formatPhoneNumber = formatPhoneNumber;
// Validation utilities
var isValidEmail = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
var isValidPhone = function (phone) {
    var phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};
exports.isValidPhone = isValidPhone;
var isValidUUID = function (uuid) {
    var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.isValidUUID = isValidUUID;
// Array utilities
var groupBy = function (array, key) {
    return array.reduce(function (groups, item) {
        var group = key(item);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};
exports.groupBy = groupBy;
var sortBy = function (array, key, direction) {
    if (direction === void 0) { direction = 'asc'; }
    return __spreadArray([], array, true).sort(function (a, b) {
        var aVal = a[key];
        var bVal = b[key];
        if (aVal < bVal)
            return direction === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return direction === 'asc' ? 1 : -1;
        return 0;
    });
};
exports.sortBy = sortBy;
// Object utilities
var pick = function (obj, keys) {
    var result = {};
    keys.forEach(function (key) {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};
exports.pick = pick;
var omit = function (obj, keys) {
    var result = __assign({}, obj);
    keys.forEach(function (key) {
        delete result[key];
    });
    return result;
};
exports.omit = omit;
// Storage utilities
exports.storage = {
    get: function (key, defaultValue) {
        try {
            var item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue || null;
        }
        catch (_a) {
            return defaultValue || null;
        }
    },
    set: function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    },
    remove: function (key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    },
    clear: function () {
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    },
};
// Debounce utility
var debounce = function (func, wait) {
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () { return func.apply(void 0, args); }, wait);
    };
};
exports.debounce = debounce;
// Throttle utility
var throttle = function (func, limit) {
    var inThrottle;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!inThrottle) {
            func.apply(void 0, args);
            inThrottle = true;
            setTimeout(function () { return (inThrottle = false); }, limit);
        }
    };
};
exports.throttle = throttle;
// Color utilities
var getStatusColor = function (status) {
    var colors = {
        active: 'green',
        inactive: 'gray',
        pending: 'yellow',
        completed: 'green',
        'in-progress': 'blue',
        urgent: 'red',
        scheduled: 'purple',
        cancelled: 'gray',
    };
    return colors[status] || 'gray';
};
exports.getStatusColor = getStatusColor;
// Error handling utilities
var handleError = function (error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unexpected error occurred';
};
exports.handleError = handleError;
// URL utilities
var getQueryParams = function () {
    var params = new URLSearchParams(window.location.search);
    var result = {};
    params.forEach(function (value, key) {
        result[key] = value;
    });
    return result;
};
exports.getQueryParams = getQueryParams;
var setQueryParams = function (params) {
    var url = new URL(window.location.href);
    Object.entries(params).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        url.searchParams.set(key, value);
    });
    window.history.replaceState({}, '', url.toString());
};
exports.setQueryParams = setQueryParams;
