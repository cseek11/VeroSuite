import { useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/stores/auth';
import { 
  RoleAction, 
  CardContext, 
  ActionExecutionResult, 
  PREDEFINED_ACTIONS,
  PREDEFINED_ROLES 
} from '@/types/role-actions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const useRoleBasedActions = (cardContext?: CardContext) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ActionExecutionResult | null>(null);
  const authStore = useAuthStore();

  // Get user's role from auth store
  const userRole = useMemo(() => {
    const user = authStore.user;
    if (!user || !user.roles || user.roles.length === 0) {
      return 'technician'; // Default role
    }
    return user.roles[0]; // Use first role for now
  }, [authStore.user]);

  // Get user's permissions based on role
  const userPermissions = useMemo(() => {
    const role = PREDEFINED_ROLES.find(r => r.id === userRole);
    if (!role) return [];
    
    return role.permissions.map(p => `${p.resource}:${p.action}`);
  }, [userRole]);

  // Filter actions based on user's role and permissions
  const availableActions = useMemo(() => {
    return PREDEFINED_ACTIONS.filter(action => {
      // Check if user has required permissions
      const hasPermission = action.permissions.every(permission => 
        userPermissions.includes(permission)
      );
      
      // Check if action requires selection and we have selected items
      const hasSelection = !action.requiresSelection || 
        (cardContext?.selectedItems && cardContext.selectedItems.length > 0);
      
      return hasPermission && hasSelection;
    });
  }, [userRole, userPermissions, cardContext?.selectedItems]);

  // Group actions by category
  const actionsByCategory = useMemo(() => {
    const grouped = availableActions.reduce((acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = [];
      }
      acc[action.category].push(action);
      return acc;
    }, {} as Record<string, RoleAction[]>);

    return grouped;
  }, [availableActions]);

  // Execute an action
  const executeAction = useCallback(async (
    action: RoleAction, 
    payload?: any
  ): Promise<ActionExecutionResult> => {
    setIsExecuting(true);
    setLastResult(null);

    try {
      // Prepare request payload
      const requestPayload = {
        ...payload,
        selectedItems: cardContext?.selectedItems || [],
        filters: cardContext?.activeFilters || {},
        userId: authStore.user?.id,
        tenantId: authStore.user?.tenant_id
      };

      // Make API request
      const response = await fetch(`${API_BASE_URL}${action.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ActionExecutionResult = {
        success: true,
        message: action.successMessage || 'Action completed successfully',
        data: await response.json()
      };

      setLastResult(result);
      return result;

    } catch (error) {
      const result: ActionExecutionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };

      setLastResult(result);
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, [cardContext, authStore]);

  // Execute action with confirmation
  const executeActionWithConfirmation = useCallback(async (
    action: RoleAction,
    payload?: any,
    onConfirm?: () => void
  ): Promise<ActionExecutionResult> => {
    if (action.confirmMessage && !onConfirm) {
      // This would typically trigger a confirmation modal
      // For now, we'll return a pending result
      return {
        success: false,
        error: 'Confirmation required'
      };
    }

    return executeAction(action, payload);
  }, [executeAction]);

  // Get actions for a specific context
  const getActionsForContext = useCallback((context: 'card' | 'global') => {
    return availableActions.filter(action => action.context === context);
  }, [availableActions]);

  // Get actions for a specific category
  const getActionsForCategory = useCallback((category: string) => {
    return actionsByCategory[category] || [];
  }, [actionsByCategory]);

  // Check if user can perform a specific action
  const canPerformAction = useCallback((actionId: string) => {
    const action = PREDEFINED_ACTIONS.find(a => a.id === actionId);
    if (!action) return false;

    const hasPermission = action.permissions.every(permission => 
      userPermissions.includes(permission)
    );

    const hasSelection = !action.requiresSelection || 
      (cardContext?.selectedItems && cardContext.selectedItems.length > 0);

    return hasPermission && hasSelection;
  }, [userPermissions, cardContext?.selectedItems]);

  // Get action by ID
  const getActionById = useCallback((actionId: string) => {
    return PREDEFINED_ACTIONS.find(a => a.id === actionId);
  }, []);

  // Execute multiple actions in sequence
  const executeMultipleActions = useCallback(async (
    actionIds: string[],
    payloads?: Record<string, any>
  ): Promise<ActionExecutionResult[]> => {
    const results: ActionExecutionResult[] = [];

    for (const actionId of actionIds) {
      const action = getActionById(actionId);
      if (action && canPerformAction(actionId)) {
        const payload = payloads?.[actionId];
        const result = await executeAction(action, payload);
        results.push(result);
        
        // Stop on first failure
        if (!result.success) {
          break;
        }
      }
    }

    return results;
  }, [executeAction, getActionById, canPerformAction]);

  return {
    // Data
    userRole,
    userPermissions,
    availableActions,
    actionsByCategory,
    
    // State
    isExecuting,
    lastResult,
    
    // Actions
    executeAction,
    executeActionWithConfirmation,
    executeMultipleActions,
    
    // Utilities
    getActionsForContext,
    getActionsForCategory,
    canPerformAction,
    getActionById
  };
};
