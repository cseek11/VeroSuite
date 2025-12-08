"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeatureFlag = useFeatureFlag;
exports.shouldShowV4 = shouldShowV4;
exports.getFeatureFlags = getFeatureFlags;
exports.logFeatureFlags = logFeatureFlags;
exports.enableEmergencyRollback = enableEmergencyRollback;
exports.isEmergencyRollbackActive = isEmergencyRollbackActive;
exports.clearEmergencyRollback = clearEmergencyRollback;
var logger_1 = require("@/utils/logger");
/**
 * Default feature flag configuration
 * Can be overridden via environment variables
 */
var DEFAULT_FLAGS = {
    V4_LAYOUT: true,
    V4_DASHBOARD: true,
    V4_SCHEDULER: true,
    UNIFIED_SCHEDULER: false, // Start disabled
    V4_NAVIGATION: true,
    V4_ROLLOUT_PERCENTAGE: 100, // 100% = all users see V4
    EMERGENCY_ROLLBACK: false,
    // Dashboard Enterprise Features - all disabled by default for gradual rollout
    DASHBOARD_NEW_STATE_MANAGEMENT: false,
    DASHBOARD_VIRTUALIZATION: false,
    DASHBOARD_MOBILE_BETA: false,
    DASHBOARD_PWA: false,
    DASHBOARD_EVENT_SOURCING: false,
    DASHBOARD_SAGA_ORCHESTRATION: false,
    DASHBOARD_CONFLICT_RESOLUTION: false,
    DASHBOARD_AUDIT_LOGGING: false,
    DASHBOARD_API_V2: false,
};
/**
 * Get feature flag value from environment or default
 */
function getFeatureFlag(key) {
    var envKey = "VITE_".concat(key);
    var envValue = import.meta.env[envKey];
    if (envValue !== undefined) {
        if (typeof DEFAULT_FLAGS[key] === 'boolean') {
            return envValue === 'true';
        }
        else if (typeof DEFAULT_FLAGS[key] === 'number') {
            return parseInt(envValue, 10);
        }
    }
    return DEFAULT_FLAGS[key];
}
/**
 * Feature flag hook for React components
 */
function useFeatureFlag(flag) {
    return getFeatureFlag(flag);
}
/**
 * Check if user should see V4 features based on rollout percentage
 */
function shouldShowV4(userId) {
    if (getFeatureFlag('EMERGENCY_ROLLBACK')) {
        return false;
    }
    var rolloutPercentage = getFeatureFlag('V4_ROLLOUT_PERCENTAGE');
    if (rolloutPercentage >= 100) {
        return true;
    }
    if (!userId) {
        return false;
    }
    // Simple hash-based user assignment
    var hash = String(userId).split('').reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    return Math.abs(hash) % 100 < rolloutPercentage;
}
/**
 * Get current feature flag configuration
 */
function getFeatureFlags() {
    return {
        V4_LAYOUT: getFeatureFlag('V4_LAYOUT'),
        V4_DASHBOARD: getFeatureFlag('V4_DASHBOARD'),
        V4_SCHEDULER: getFeatureFlag('V4_SCHEDULER'),
        UNIFIED_SCHEDULER: getFeatureFlag('UNIFIED_SCHEDULER'),
        V4_NAVIGATION: getFeatureFlag('V4_NAVIGATION'),
        V4_ROLLOUT_PERCENTAGE: getFeatureFlag('V4_ROLLOUT_PERCENTAGE'),
        EMERGENCY_ROLLBACK: getFeatureFlag('EMERGENCY_ROLLBACK'),
        DASHBOARD_NEW_STATE_MANAGEMENT: getFeatureFlag('DASHBOARD_NEW_STATE_MANAGEMENT'),
        DASHBOARD_VIRTUALIZATION: getFeatureFlag('DASHBOARD_VIRTUALIZATION'),
        DASHBOARD_MOBILE_BETA: getFeatureFlag('DASHBOARD_MOBILE_BETA'),
        DASHBOARD_PWA: getFeatureFlag('DASHBOARD_PWA'),
        DASHBOARD_EVENT_SOURCING: getFeatureFlag('DASHBOARD_EVENT_SOURCING'),
        DASHBOARD_SAGA_ORCHESTRATION: getFeatureFlag('DASHBOARD_SAGA_ORCHESTRATION'),
        DASHBOARD_CONFLICT_RESOLUTION: getFeatureFlag('DASHBOARD_CONFLICT_RESOLUTION'),
        DASHBOARD_AUDIT_LOGGING: getFeatureFlag('DASHBOARD_AUDIT_LOGGING'),
        DASHBOARD_API_V2: getFeatureFlag('DASHBOARD_API_V2'),
    };
}
/**
 * Debug function to log current feature flag state
 */
function logFeatureFlags() {
    if (import.meta.env.DEV) {
        logger_1.logger.debug('VeroField Feature Flags', getFeatureFlags(), 'featureFlags');
    }
}
/**
 * Emergency rollback function
 * Call this if critical issues are detected
 */
function enableEmergencyRollback() {
    logger_1.logger.warn('EMERGENCY ROLLBACK ENABLED - All V4 features disabled', {}, 'featureFlags');
    localStorage.setItem('vero-emergency-rollback', 'true');
    window.location.reload();
}
/**
 * Check if emergency rollback is active
 */
function isEmergencyRollbackActive() {
    return localStorage.getItem('vero-emergency-rollback') === 'true';
}
/**
 * Clear emergency rollback
 */
function clearEmergencyRollback() {
    localStorage.removeItem('vero-emergency-rollback');
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Emergency rollback cleared', {}, 'featureFlags');
    }
}
// Log feature flags in development
if (import.meta.env.DEV) {
    logFeatureFlags();
}
