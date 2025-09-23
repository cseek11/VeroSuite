import React, { useState } from 'react';
import { 
  Trash2, 
  Lock, 
  Unlock, 
  Copy, 
  Move, 
  Maximize2, 
  Users, 
  UserMinus,
  MoreHorizontal,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionBarProps {
  selectedCount: number;
  isVisible: boolean;
  onBulkDelete: () => void;
  onBulkLock: () => void;
  onBulkUnlock: () => void;
  onBulkDuplicate: () => void;
  onBulkGroup: (groupName?: string) => void;
  onBulkUngroup: () => void;
  onBulkMove: (deltaX: number, deltaY: number) => void;
  onBulkResize: (deltaWidth: number, deltaHeight: number) => void;
  onClearSelection: () => void;
  className?: string;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  isVisible,
  onBulkDelete,
  onBulkLock,
  onBulkUnlock,
  onBulkDuplicate,
  onBulkGroup,
  onBulkUngroup,
  onBulkMove,
  onBulkResize,
  onClearSelection,
  className
}) => {
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showResizeDialog, setShowResizeDialog] = useState(false);

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  const handleGroup = () => {
    if (groupName.trim()) {
      onBulkGroup(groupName.trim());
      setGroupName('');
      setShowGroupDialog(false);
    } else {
      onBulkGroup();
      setShowGroupDialog(false);
    }
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    const distance = 20;
    let deltaX = 0;
    let deltaY = 0;

    switch (direction) {
      case 'up':
        deltaY = -distance;
        break;
      case 'down':
        deltaY = distance;
        break;
      case 'left':
        deltaX = -distance;
        break;
      case 'right':
        deltaX = distance;
        break;
    }

    onBulkMove(deltaX, deltaY);
    setShowMoveDialog(false);
  };

  const handleResize = (type: 'grow' | 'shrink' | 'wider' | 'narrower' | 'taller' | 'shorter') => {
    const amount = 20;
    let deltaWidth = 0;
    let deltaHeight = 0;

    switch (type) {
      case 'grow':
        deltaWidth = amount;
        deltaHeight = amount;
        break;
      case 'shrink':
        deltaWidth = -amount;
        deltaHeight = -amount;
        break;
      case 'wider':
        deltaWidth = amount;
        break;
      case 'narrower':
        deltaWidth = -amount;
        break;
      case 'taller':
        deltaHeight = amount;
        break;
      case 'shorter':
        deltaHeight = -amount;
        break;
    }

    onBulkResize(deltaWidth, deltaHeight);
    setShowResizeDialog(false);
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
        "bg-white border border-gray-200 rounded-lg shadow-lg",
        "transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}>
        <div className="flex items-center gap-2 p-3">
          {/* Selection Info */}
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm font-medium">
            {selectedCount} selected
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            {/* Delete */}
            <button
              onClick={onBulkDelete}
              className="p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors"
              title="Delete selected cards"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Lock/Unlock */}
            <button
              onClick={onBulkLock}
              className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-md transition-colors"
              title="Lock selected cards"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={onBulkUnlock}
              className="p-2 hover:bg-green-100 text-green-600 rounded-md transition-colors"
              title="Unlock selected cards"
            >
              <Unlock className="w-4 h-4" />
            </button>

            {/* Duplicate */}
            <button
              onClick={onBulkDuplicate}
              className="p-2 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
              title="Duplicate selected cards"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Group */}
            <button
              onClick={() => setShowGroupDialog(true)}
              className="p-2 hover:bg-purple-100 text-purple-600 rounded-md transition-colors"
              title="Group selected cards"
            >
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={onBulkUngroup}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
              title="Ungroup selected cards"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Advanced Actions */}
          <div className="flex items-center gap-1">
            {/* Move */}
            <div className="relative">
              <button
                onClick={() => setShowMoveDialog(true)}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
                title="Move selected cards"
              >
                <Move className="w-4 h-4" />
              </button>
            </div>

            {/* Resize */}
            <div className="relative">
              <button
                onClick={() => setShowResizeDialog(true)}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
                title="Resize selected cards"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Undo removed - available in settings */}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Group Dialog */}
      {showGroupDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Group</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name (optional)
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter group name..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowGroupDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGroup}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Move Dialog */}
      {showMoveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Move Cards</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMove('up')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↑ Up
                </button>
                <button
                  onClick={() => handleMove('down')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↓ Down
                </button>
                <button
                  onClick={() => handleMove('left')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ← Left
                </button>
                <button
                  onClick={() => handleMove('right')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  → Right
                </button>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowMoveDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resize Dialog */}
      {showResizeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resize Cards</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleResize('grow')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↗ Grow
                </button>
                <button
                  onClick={() => handleResize('shrink')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↙ Shrink
                </button>
                <button
                  onClick={() => handleResize('wider')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↔ Wider
                </button>
                <button
                  onClick={() => handleResize('narrower')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↕ Narrower
                </button>
                <button
                  onClick={() => handleResize('taller')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↑ Taller
                </button>
                <button
                  onClick={() => handleResize('shorter')}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ↓ Shorter
                </button>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowResizeDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
