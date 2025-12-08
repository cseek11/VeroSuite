import { logger } from '@/utils/logger';

/**
 * Feature Flag System for VeroField V4 Migration
 * 
 * This system allows for gradual rollout of V4 features and easy rollback
 * if issues are encountered during migration.
 */

export interface FeatureFlags {
  // Layout System
  V4_LAYOUT: boolean;
  V4_DASHBOARD: boolean;
  V4_SCHEDULER: boolean;
  
  // Component Migration
  UNIFIED_SCHEDULER: boolean;
  V4_NAVIGATION: boolean;
  
  // Gradual Rollout
  V4_ROLLOUT_PERCENTAGE: number;
  
  // Emergency Controls
  EMERGENCY_ROLLBACK: boolean;
  
  // Dashboard Enterprise Features (Phase 0+)
  DASHBOARD_NEW_STATE_MANAGEMENT: boolean;
  DASHBOARD_VIRTUALIZATION: boolean;
  DASHBOARD_MOBILE_BETA: boolean;
  DASHBOARD_PWA: boolean;
  DASHBOARD_EVENT_SOURCING: boolean;
  DASHBOARD_SAGA_ORCHESTRATION: boolean;
  DASHBOARD_CONFLICT_RESOLUTION: boolean;
  DASHBOARD_AUDIT_LOGGING: boolean;
  DASHBOARD_API_V2: boolean;
}

/**
 * Default feature flag configuration
 * Can be overridden via environment variables
 */
const DEFAULT_FLAGS: FeatureFlags = {
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
function getFeatureFlag(key: keyof FeatureFlags): boolean | number {
  const envKey = `VITE_${key}`;
  const envValue = import.meta.env[envKey];
  
  if (envValue !== undefined) {
    if (typeof DEFAULT_FLAGS[key] === 'boolean') {
      return envValue === 'true';
    } else if (typeof DEFAULT_FLAGS[key] === 'number') {
      return parseInt(envValue, 10);
    }
  }
  
  return DEFAULT_FLAGS[key];
}

/**
 * Feature flag hook for React components
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean | number {
  return getFeatureFlag(flag);
}

/**
 * Check if user should see V4 features based on rollout percentage
 */
export function shouldShowV4(userId?: string | number): boolean {
  if (getFeatureFlag('EMERGENCY_ROLLBACK')) {
    return false;
  }
  
  const rolloutPercentage = getFeatureFlag('V4_ROLLOUT_PERCENTAGE') as number;
  
  if (rolloutPercentage >= 100) {
    return true;
  }
  
  if (!userId) {
    return false;
  }
  
  // Simple hash-based user assignment
  const hash = String(userId).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return Math.abs(hash) % 100 < rolloutPercentage;
}

/**
 * Get current feature flag configuration
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    V4_LAYOUT: getFeatureFlag('V4_LAYOUT') as boolean,
    V4_DASHBOARD: getFeatureFlag('V4_DASHBOARD') as boolean,
    V4_SCHEDULER: getFeatureFlag('V4_SCHEDULER') as boolean,
    UNIFIED_SCHEDULER: getFeatureFlag('UNIFIED_SCHEDULER') as boolean,
    V4_NAVIGATION: getFeatureFlag('V4_NAVIGATION') as boolean,
    V4_ROLLOUT_PERCENTAGE: getFeatureFlag('V4_ROLLOUT_PERCENTAGE') as number,
    EMERGENCY_ROLLBACK: getFeatureFlag('EMERGENCY_ROLLBACK') as boolean,
    DASHBOARD_NEW_STATE_MANAGEMENT: getFeatureFlag('DASHBOARD_NEW_STATE_MANAGEMENT') as boolean,
    DASHBOARD_VIRTUALIZATION: getFeatureFlag('DASHBOARD_VIRTUALIZATION') as boolean,
    DASHBOARD_MOBILE_BETA: getFeatureFlag('DASHBOARD_MOBILE_BETA') as boolean,
    DASHBOARD_PWA: getFeatureFlag('DASHBOARD_PWA') as boolean,
    DASHBOARD_EVENT_SOURCING: getFeatureFlag('DASHBOARD_EVENT_SOURCING') as boolean,
    DASHBOARD_SAGA_ORCHESTRATION: getFeatureFlag('DASHBOARD_SAGA_ORCHESTRATION') as boolean,
    DASHBOARD_CONFLICT_RESOLUTION: getFeatureFlag('DASHBOARD_CONFLICT_RESOLUTION') as boolean,
    DASHBOARD_AUDIT_LOGGING: getFeatureFlag('DASHBOARD_AUDIT_LOGGING') as boolean,
    DASHBOARD_API_V2: getFeatureFlag('DASHBOARD_API_V2') as boolean,
  };
}

/**
 * Debug function to log current feature flag state
 */
export function logFeatureFlags(): void {
  if (import.meta.env.DEV) {
    logger.debug('VeroField Feature Flags', getFeatureFlags(), 'featureFlags');
  }
}

/**
 * Emergency rollback function
 * Call this if critical issues are detected
 */
export function enableEmergencyRollback(): void {
  logger.warn('EMERGENCY ROLLBACK ENABLED - All V4 features disabled', {}, 'featureFlags');
  localStorage.setItem('vero-emergency-rollback', 'true');
  window.location.reload();
}

/**
 * Check if emergency rollback is active
 */
export function isEmergencyRollbackActive(): boolean {
  return localStorage.getItem('vero-emergency-rollback') === 'true';
}

/**
 * Clear emergency rollback
 */
export function clearEmergencyRollback(): void {
  localStorage.removeItem('vero-emergency-rollback');
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Emergency rollback cleared', {}, 'featureFlags');
  }
}

// Log feature flags in development
if (import.meta.env.DEV) {
  logFeatureFlags();
}





