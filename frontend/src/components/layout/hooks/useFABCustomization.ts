import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

// Types for Phase 2 role-based customization
export interface FABCustomization {
  userId: string;
  role: string;
  preferredCategories: string[];
  pinnedActions: string[];
  hiddenCategories: string[];
  customOrder: string[];
}

// Default configurations by role
const roleDefaults: Record<string, Partial<FABCustomization>> = {
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

export function useFABCustomization() {
  const { user } = useAuthStore();
  const [customization, setCustomization] = useState<FABCustomization | null>(null);

  useEffect(() => {
    if (user) {
      // In Phase 2, this would load from backend
      // For now, use role-based defaults
      const userRole = user.role || 'admin';
      const defaults = roleDefaults[userRole] || roleDefaults['admin'];
      
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

  const updateCustomization = (updates: Partial<FABCustomization>) => {
    if (customization) {
      const updated = { ...customization, ...updates };
      setCustomization(updated);
      
      // In Phase 2, this would save to backend
      logger.debug('FAB customization updated', { customization: updated }, 'useFABCustomization');
    }
  };

  return {
    customization,
    updateCustomization,
    isLoading: !customization
  };
}

// Utility function to filter and order categories based on customization
export function getCustomizedCategories(categories: any[], customization: FABCustomization | null) {
  if (!customization) return categories;

  // Filter out hidden categories
  let filtered = categories.filter(cat => !customization.hiddenCategories.includes(cat.id));

  // Apply custom order if specified
  if (customization.customOrder.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aIndex = customization.customOrder.indexOf(a.id);
      const bIndex = customization.customOrder.indexOf(b.id);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
  }

  return filtered;
}

// Utility function to highlight preferred categories
export function getCategoryPriority(categoryId: string, customization: FABCustomization | null): 'high' | 'normal' | 'low' {
  if (!customization) return 'normal';
  
  if (customization.preferredCategories.includes(categoryId)) return 'high';
  if (customization.hiddenCategories.includes(categoryId)) return 'low';
  
  return 'normal';
}
