import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import LayoutWrapper from './LayoutWrapper';
import V4Layout from './layout/V4Layout';
import { useFeatureFlag, shouldShowV4, isEmergencyRollbackActive } from '@/lib/featureFlags';

interface LayoutSelectorProps {
  children: React.ReactNode;
}

export default function LayoutSelector({ children }: LayoutSelectorProps) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  
  // Feature flag checks
  const v4LayoutEnabled = useFeatureFlag('V4_LAYOUT') as boolean;
  const emergencyRollback = isEmergencyRollbackActive();
  
  // Define which routes should use V4 layout
  const v4Routes = [
    '/dashboard',     // NEW DEFAULT - now uses V4Dashboard
    '/v4-dashboard', 
    '/v4-test', 
    '/settings',
    '/resizable-dashboard',
    '/customers',
    '/jobs',
    '/reports'
  ];
  
  // Legacy routes that should never use V4 layout
  const legacyRoutes = [
    '/legacy-dashboard',
    '/legacy-enhanced-dashboard', 
    '/legacy-resizable-dashboard'
  ];
  
  // Check user preference from localStorage
  const userPrefersV4 = localStorage.getItem('preferred-layout') === 'v4';
  
  // Special case: resizable-dashboard should always use V4Layout
  if (location.pathname === '/resizable-dashboard') {
    return <V4Layout>{children}</V4Layout>;
  }
  
  // Determine if we should use V4 layout
  const shouldUseV4Layout = 
    !emergencyRollback && // Emergency rollback overrides everything
    v4LayoutEnabled && // Feature flag must be enabled
    (v4Routes.includes(location.pathname) || // Route is explicitly V4
     userPrefersV4 || // User preference
     shouldShowV4(user?.id)); // Gradual rollout check
  
  // Force legacy layout for legacy routes
  const forceLegacyLayout = legacyRoutes.includes(location.pathname);
  
  // Log layout decision in development
  if (import.meta.env.DEV) {
    console.log('🔧 LayoutSelector Decision:', {
      pathname: location.pathname,
      v4LayoutEnabled,
      emergencyRollback,
      userPrefersV4,
      shouldShowV4: shouldShowV4(user?.id),
      shouldUseV4Layout,
      forceLegacyLayout,
      finalLayout: forceLegacyLayout ? 'legacy' : (shouldUseV4Layout ? 'v4' : 'legacy')
    });
  }
  
  // Emergency rollback or legacy route - use old layout
  if (emergencyRollback || forceLegacyLayout || !shouldUseV4Layout) {
    return <LayoutWrapper>{children}</LayoutWrapper>;
  }
  
  // Use V4 layout
  return <V4Layout>{children}</V4Layout>;
}
