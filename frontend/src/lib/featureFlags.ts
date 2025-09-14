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
  };
}

/**
 * Debug function to log current feature flag state
 */
export function logFeatureFlags(): void {
  if (import.meta.env.DEV) {
    console.group('🔧 VeroField Feature Flags');
    console.table(getFeatureFlags());
    console.groupEnd();
  }
}

/**
 * Emergency rollback function
 * Call this if critical issues are detected
 */
export function enableEmergencyRollback(): void {
  console.warn('🚨 EMERGENCY ROLLBACK ENABLED - All V4 features disabled');
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
  console.log('✅ Emergency rollback cleared');
}

// Log feature flags in development
if (import.meta.env.DEV) {
  logFeatureFlags();
}





