import React, { useState } from 'react';
import { Trash2, Lock, Unlock, Ungroup } from 'lucide-react';
import { CardGroup as CardGroupType } from '@/hooks/useCardGrouping';

interface CardGroupProps {
  group: CardGroupType;
  onUpdateGroup: (groupId: string, updates: Partial<CardGroupType>) => void;
  onDeleteGroup: (groupId: string) => void;
  onUngroupCards: (groupId: string) => void;
  isSelected: boolean;
  onClick: () => void;
  onGroupDragStart?: (groupId: string, e: React.MouseEvent) => void;
  onRequestDelete?: (groupId: string) => void;
}

const CardGroup: React.FC<CardGroupProps> = ({
  group,
  onUpdateGroup,
  onDeleteGroup,
  onUngroupCards,
  isSelected,
  onClick,
  onGroupDragStart,
  onRequestDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(group.name);

  const handleSaveName = () => {
    if (editName.trim() && editName !== group.name) {
      onUpdateGroup(group.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditName(group.name);
      setIsEditing(false);
    }
  };

  const getBorderColor = () => {
    const colorMap: Record<string, string> = {
      purple: 'border-purple-300',
      blue: 'border-blue-300',
      green: 'border-green-300',
      red: 'border-red-300',
      yellow: 'border-yellow-300',
      pink: 'border-pink-300',
      indigo: 'border-indigo-300',
      orange: 'border-orange-300'
    };
    return colorMap[group.color] || 'border-gray-300';
  };

  const getBackgroundColor = () => {
    const colorMap: Record<string, string> = {
      purple: 'bg-purple-50/30',
      blue: 'bg-blue-50/30',
      green: 'bg-green-50/30',
      red: 'bg-red-50/30',
      yellow: 'bg-yellow-50/30',
      pink: 'bg-pink-50/30',
      indigo: 'bg-indigo-50/30',
      orange: 'bg-orange-50/30'
    };
    return colorMap[group.color] || 'bg-gray-50/30';
  };

  const getTextColor = () => {
    const colorMap: Record<string, string> = {
      purple: 'text-purple-700',
      blue: 'text-blue-700',
      green: 'text-green-700',
      red: 'text-red-700',
      yellow: 'text-yellow-700',
      pink: 'text-pink-700',
      indigo: 'text-indigo-700',
      orange: 'text-orange-700'
    };
    return colorMap[group.color] || 'text-gray-700';
  };

  if (!group.visible) return null;

  return (
    <div
      data-group-id={group.id}
      className={`absolute border-2 border-dashed rounded-lg transition-all duration-200 ${getBorderColor()} ${getBackgroundColor()} ${
        isSelected ? 'ring-2 ring-offset-2 ring-gray-400' : ''
      } ${group.locked ? 'opacity-60 cursor-default' : 'hover:border-solid cursor-move'}`}
      style={{
        left: group.x,
        top: group.y,
        width: group.width,
        height: group.height,
        zIndex: 1 // Behind cards but above canvas
      }}
      onClick={onClick}
      onMouseDown={(e) => {
        if (onGroupDragStart && !group.locked) {
          onGroupDragStart(group.id, e);
        }
      }}
    >
      {/* Group Header */}
      <div className={`absolute -top-6 left-2 flex items-center gap-2 px-2 py-1 bg-white rounded-md shadow-sm border ${getBorderColor()}`}>
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={handleKeyDown}
            className={`text-xs font-medium ${getTextColor()} bg-transparent border-none outline-none w-20`}
            autoFocus
          />
        ) : (
          <span 
            className={`text-xs font-medium ${getTextColor()} cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {group.name}
          </span>
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateGroup(group.id, { locked: !group.locked });
            }}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
            title={group.locked ? 'Unlock group' : 'Lock group'}
          >
            {group.locked ? (
              <Unlock className="w-3 h-3 text-red-500" />
            ) : (
              <Lock className="w-3 h-3 text-gray-500" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUngroupCards(group.id);
            }}
            className="p-0.5 hover:bg-yellow-100 rounded transition-colors"
            title="Ungroup cards (keep cards, remove group)"
          >
            <Ungroup className="w-3 h-3 text-yellow-600" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRequestDelete) {
                onRequestDelete(group.id);
              } else {
                onDeleteGroup(group.id);
              }
            }}
            className="p-0.5 hover:bg-red-100 rounded transition-colors"
            title="Delete group and all cards inside"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>

      {/* Group Info */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        {group.cardIds.size} card{group.cardIds.size !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default CardGroup;
