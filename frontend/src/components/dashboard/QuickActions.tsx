import React, { useState } from 'react';
import { 
  UserCheck, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  Package, 
  MapPin, 
  FileText, 
  CheckSquare, 
  DollarSign,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { useRoleBasedActions } from '@/hooks/useRoleBasedActions';
import { RoleAction, CardContext } from '@/types/role-actions';
import { AlertDialog, ConfirmDialog } from '@/components/ui/DialogModals';

interface QuickActionsProps {
  context?: CardContext;
  compact?: boolean;
  showLabels?: boolean;
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  context, 
  compact = false, 
  showLabels = true,
  className = ''
}) => {
  const [pendingAction, setPendingAction] = useState<RoleAction | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const {
    availableActions,
    actionsByCategory,
    isExecuting,
    lastResult,
    executeAction,
    executeActionWithConfirmation
  } = useRoleBasedActions(context);

  // Icon mapping for actions
  const iconMap: Record<string, React.ComponentType<any>> = {
    'UserCheck': UserCheck,
    'MessageSquare': MessageSquare,
    'Calendar': Calendar,
    'CheckCircle': CheckCircle,
    'Package': Package,
    'MapPin': MapPin,
    'FileText': FileText,
    'CheckSquare': CheckSquare,
    'DollarSign': DollarSign,
    'MoreHorizontal': MoreHorizontal
  };

  const handleActionClick = async (action: RoleAction) => {
    if (action.confirmMessage) {
      setPendingAction(action);
      setShowConfirmModal(true);
    } else {
      await executeActionDirectly(action);
    }
  };

  const executeActionDirectly = async (action: RoleAction) => {
    try {
      const result = await executeAction(action);
      
      if (result.success) {
        setAlertMessage(result.message || 'Action completed successfully');
        setShowAlertModal(true);
      } else {
        setAlertMessage(result.error || 'Action failed');
        setShowAlertModal(true);
      }
    } catch (error) {
      setAlertMessage('An unexpected error occurred');
      setShowAlertModal(true);
    }
  };

  const handleConfirm = async () => {
    if (pendingAction) {
      await executeActionDirectly(pendingAction);
      setPendingAction(null);
      setShowConfirmModal(false);
    }
  };

  const handleCancel = () => {
    setPendingAction(null);
    setShowConfirmModal(false);
  };

  // Render action button
  const renderActionButton = (action: RoleAction) => {
    const IconComponent = iconMap[action.icon] || MoreHorizontal;
    const isDisabled = isExecuting;

    if (compact) {
      return (
        <button
          key={action.id}
          onClick={() => handleActionClick(action)}
          disabled={isDisabled}
          className={`
            p-2 rounded-lg transition-all duration-200 
            ${isDisabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200 hover:scale-105'
            }
          `}
          title={action.label}
        >
          {isDisabled ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <IconComponent className="w-4 h-4" />
          )}
        </button>
      );
    }

    return (
      <button
        key={action.id}
        onClick={() => handleActionClick(action)}
        disabled={isDisabled}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
          ${isDisabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-purple-100 text-purple-600 hover:bg-purple-200 hover:scale-105'
          }
        `}
      >
        {isDisabled ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <IconComponent className="w-4 h-4" />
        )}
        {showLabels && <span className="text-sm font-medium">{action.label}</span>}
      </button>
    );
  };

  // Render category section
  const renderCategory = (category: string, actions: RoleAction[]) => {
    if (actions.length === 0) return null;

    const categoryLabels: Record<string, string> = {
      'dispatch': 'Dispatch Actions',
      'technician': 'Technician Actions',
      'owner': 'Owner Actions',
      'admin': 'Admin Actions'
    };

    return (
      <div key={category} className="space-y-2">
        {!compact && (
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {categoryLabels[category] || category}
          </h4>
        )}
        <div className={`flex flex-wrap gap-2 ${compact ? 'justify-center' : ''}`}>
          {actions.map(renderActionButton)}
        </div>
      </div>
    );
  };

  // If no actions available
  if (availableActions.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-sm text-gray-500">
          No quick actions available for your role
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Render actions by category */}
      {Object.entries(actionsByCategory).map(([category, actions]) => 
        renderCategory(category, actions)
      )}

      {/* Confirmation Modal */}
      <ConfirmDialog
        open={showConfirmModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
        }}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message={pendingAction?.confirmMessage || 'Are you sure?'}
        type="warning"
      />

      {/* Alert Modal */}
      <AlertDialog
        open={showAlertModal}
        onOpenChange={(open) => setShowAlertModal(open)}
        title={lastResult?.success ? "Success" : "Error"}
        message={alertMessage}
        type={lastResult?.success ? "success" : "error"}
      />

      {/* Last result indicator */}
      {lastResult && !showAlertModal && (
        <div className={`
          p-3 rounded-lg text-sm
          ${lastResult.success 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
          }
        `}>
          {lastResult.message || lastResult.error}
        </div>
      )}
    </div>
  );
};

export default QuickActions;
