import React, { useState } from 'react';
import { Zap, Users, Calendar, Package } from 'lucide-react';
import Card from '@/components/ui/Card';
import QuickActions from './QuickActions';
import { useRoleBasedActions } from '@/hooks/useRoleBasedActions';
import { CardContext } from '@/types/role-actions';

interface QuickActionsCardProps {
  title?: string;
  compact?: boolean;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ 
  title = "Quick Actions",
  compact = false 
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // Mock card context - in real implementation, this would come from parent
  const cardContext: CardContext = {
    selectedItems,
    activeFilters,
    userRole: 'dispatcher', // This would come from auth store
    permissions: ['jobs:assign', 'technicians:message', 'jobs:update'],
    cardId: 'quick-actions'
  };

  const { availableActions, actionsByCategory } = useRoleBasedActions(cardContext);

  const getActionCount = () => {
    return Object.values(actionsByCategory).reduce((total, actions) => total + actions.length, 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dispatch':
        return <Users className="w-4 h-4" />;
      case 'technician':
        return <Package className="w-4 h-4" />;
      case 'owner':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <Card title={title}>
      <div className="space-y-6">
        {/* Action Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              {getActionCount()} actions available
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {Object.entries(actionsByCategory).map(([category, actions]) => (
              actions.length > 0 && (
                <div
                  key={category}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full"
                  title={`${category}: ${actions.length} actions`}
                >
                  {getCategoryIcon(category)}
                  <span className="text-xs text-gray-600">{actions.length}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions 
          context={cardContext}
          compact={compact}
          showLabels={!compact}
        />

        {/* Selection Info */}
        {selectedItems.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!compact && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Actions are filtered based on your role and permissions</p>
            <p>• Select items in other cards to enable contextual actions</p>
            <p>• Some actions require confirmation before execution</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuickActionsCard;
