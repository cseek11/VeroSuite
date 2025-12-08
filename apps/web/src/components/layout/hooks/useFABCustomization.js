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
exports.useFABCustomization = useFABCustomization;
exports.getCustomizedCategories = getCustomizedCategories;
exports.getCategoryPriority = getCategoryPriority;
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
// Default configurations by role
var roleDefaults = {
    'dispatcher': {
        preferredCategories: ['scheduling', 'work-management', 'team-management'],
        pinnedActions: ['emergency-dispatch', 'todays-schedule', 'create-work-order'],
        customOrder: ['scheduling', 'work-management', 'team-management', 'customers', 'financial', 'quick-actions']
    },
    'office-manager': {
        preferredCategories: ['customers', 'financial', 'work-management'],
        pinnedActions: ['add-customer', 'create-invoice', 'view-work-orders'],
        customOrder: ['customers', 'financial', 'work-management', 'scheduling', 'team-management', 'quick-actions']
    },
    'technician': {
        preferredCategories: ['work-management', 'quick-actions'],
        pinnedActions: ['todays-schedule', 'emergency-job', 'recent-activity'],
        hiddenCategories: ['financial', 'team-management'],
        customOrder: ['work-management', 'scheduling', 'customers', 'quick-actions']
    },
    'admin': {
        preferredCategories: ['team-management', 'financial', 'quick-actions'],
        pinnedActions: ['view-technicians', 'financial-reports', 'settings'],
        customOrder: ['team-management', 'financial', 'work-management', 'customers', 'scheduling', 'quick-actions']
    }
};
function useFABCustomization() {
    var user = (0, auth_1.useAuthStore)().user;
    var _a = (0, react_1.useState)(null), customization = _a[0], setCustomization = _a[1];
    (0, react_1.useEffect)(function () {
        var _a;
        if (user) {
            // In Phase 2, this would load from backend
            // For now, use role-based defaults
            var userRole = user.role || 'admin';
            var defaults = (_a = roleDefaults[userRole]) !== null && _a !== void 0 ? _a : roleDefaults['admin'];
            if (!defaults)
                return;
            setCustomization({
                userId: user.id || user.email,
                role: userRole,
                preferredCategories: defaults.preferredCategories || [],
                pinnedActions: defaults.pinnedActions || [],
                hiddenCategories: defaults.hiddenCategories || [],
                customOrder: defaults.customOrder || []
            });
        }
    }, [user]);
    var updateCustomization = function (updates) {
        if (customization) {
            var updated = __assign(__assign({}, customization), updates);
            setCustomization(updated);
            // In Phase 2, this would save to backend
            logger_1.logger.debug('FAB customization updated', { customization: updated }, 'useFABCustomization');
        }
    };
    return {
        customization: customization,
        updateCustomization: updateCustomization,
        isLoading: !customization
    };
}
// Utility function to filter and order categories based on customization
function getCustomizedCategories(categories, customization) {
    if (!customization)
        return categories;
    // Filter out hidden categories
    var filtered = categories.filter(function (cat) { return !customization.hiddenCategories.includes(cat.id); });
    // Apply custom order if specified
    if (customization.customOrder.length > 0) {
        filtered = filtered.sort(function (a, b) {
            var aIndex = customization.customOrder.indexOf(a.id);
            var bIndex = customization.customOrder.indexOf(b.id);
            if (aIndex === -1 && bIndex === -1)
                return 0;
            if (aIndex === -1)
                return 1;
            if (bIndex === -1)
                return -1;
            return aIndex - bIndex;
        });
    }
    return filtered;
}
// Utility function to highlight preferred categories
function getCategoryPriority(categoryId, customization) {
    if (!customization)
        return 'normal';
    if (customization.preferredCategories.includes(categoryId))
        return 'high';
    if (customization.hiddenCategories.includes(categoryId))
        return 'low';
    return 'normal';
}
