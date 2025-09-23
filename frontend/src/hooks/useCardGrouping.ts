import { useState, useCallback, useEffect } from 'react';

export interface CardGroup {
  id: string;
  name: string;
  color: string;
  cardIds: Set<string>;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
}

const GROUP_COLORS = [
  { name: 'Purple', value: 'purple' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Red', value: 'red' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Pink', value: 'pink' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Orange', value: 'orange' }
];

const GROUPS_STORAGE_KEY = 'verocards-v2-groups';

export function useCardGrouping(onDeleteCards?: (cardIds: string[]) => void) {
  const [groups, setGroups] = useState<Record<string, CardGroup>>({});
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Load groups from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (saved) {
      try {
        const parsedGroups = JSON.parse(saved);
        // Convert cardIds arrays back to Sets
        const groupsWithSets: Record<string, CardGroup> = {};
        Object.entries(parsedGroups).forEach(([id, group]: [string, any]) => {
          groupsWithSets[id] = {
            ...group,
            cardIds: new Set(group.cardIds)
          };
        });
        setGroups(groupsWithSets);
      } catch (error) {
        console.warn('Failed to load card groups');
      }
    }
  }, []);

  // Save groups to localStorage
  const saveGroups = useCallback((groupsToSave: Record<string, CardGroup>) => {
    try {
      // Convert Sets to arrays for JSON serialization
      const serializable: Record<string, any> = {};
      Object.entries(groupsToSave).forEach(([id, group]) => {
        serializable[id] = {
          ...group,
          cardIds: Array.from(group.cardIds)
        };
      });
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save card groups:', error);
    }
  }, []);

  // Create new group
  const createGroup = useCallback((name: string, cardIds: string[], cards: Record<string, any>, color?: string) => {
    const groupId = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const selectedColor = color || GROUP_COLORS[Object.keys(groups).length % GROUP_COLORS.length].value;

    // Calculate group bounds based on actual card positions
    const groupBounds = calculateGroupBounds(cardIds, cards);
    
    const newGroup: CardGroup = {
      id: groupId,
      name: name.trim(),
      color: selectedColor,
      cardIds: new Set(cardIds),
      x: groupBounds.x - 15,
      y: groupBounds.y - 15,
      width: groupBounds.width + 30,
      height: groupBounds.height + 30,
      visible: true,
      locked: false
    };

    setGroups(prev => {
      const updated = { ...prev, [groupId]: newGroup };
      saveGroups(updated);
      return updated;
    });

    return groupId;
  }, [groups, saveGroups]);

  // Update group
  const updateGroup = useCallback((groupId: string, updates: Partial<CardGroup>) => {
    setGroups(prev => {
      if (!prev[groupId]) return prev;
      
      const updated = {
        ...prev,
        [groupId]: { ...prev[groupId], ...updates }
      };
      saveGroups(updated);
      return updated;
    });
  }, [saveGroups]);

  // Delete group (and all cards inside it)
  const deleteGroup = useCallback((groupId: string) => {
    setGroups(prev => {
      const group = prev[groupId];
      if (group && onDeleteCards) {
        // Delete all cards in the group
        onDeleteCards(Array.from(group.cardIds));
      }
      
      const updated = { ...prev };
      delete updated[groupId];
      saveGroups(updated);
      return updated;
    });
  }, [saveGroups, onDeleteCards]);

  // Ungroup cards (delete group but keep cards)
  const ungroupCards = useCallback((groupId: string) => {
    setGroups(prev => {
      const updated = { ...prev };
      delete updated[groupId];
      saveGroups(updated);
      return updated;
    });
  }, [saveGroups]);

  // Clear all groups (emergency function)
  const clearAllGroups = useCallback(() => {
    setGroups({});
    saveGroups({});
  }, [saveGroups]);

  // Add cards to group
  const addCardsToGroup = useCallback((groupId: string, cardIds: string[]) => {
    setGroups(prev => {
      if (!prev[groupId]) return prev;
      
      const group = prev[groupId];
      const newCardIds = new Set([...group.cardIds, ...cardIds]);
      
      const updated = {
        ...prev,
        [groupId]: { ...group, cardIds: newCardIds }
      };
      saveGroups(updated);
      return updated;
    });
  }, [saveGroups]);

  // Remove cards from group
  const removeCardsFromGroup = useCallback((groupId: string, cardIds: string[]) => {
    setGroups(prev => {
      if (!prev[groupId]) return prev;
      
      const group = prev[groupId];
      const newCardIds = new Set(group.cardIds);
      cardIds.forEach(id => newCardIds.delete(id));
      
      const updated = {
        ...prev,
        [groupId]: { ...group, cardIds: newCardIds }
      };
      saveGroups(updated);
      return updated;
    });
  }, [saveGroups]);

  // Get group for card
  const getCardGroup = useCallback((cardId: string) => {
    return Object.values(groups).find(group => group.cardIds.has(cardId));
  }, [groups]);

  // Update group bounds based on card positions
  const updateGroupBounds = useCallback((groupId: string, cards: Record<string, any>) => {
    const group = groups[groupId];
    if (!group) return;

    const cardPositions = Array.from(group.cardIds)
      .map(cardId => cards[cardId])
      .filter(Boolean);

    if (cardPositions.length === 0) return;

    const bounds = calculateGroupBounds(Array.from(group.cardIds), cards);
    
    updateGroup(groupId, {
      x: bounds.x - 10,
      y: bounds.y - 10,
      width: bounds.width + 20,
      height: bounds.height + 20
    });
  }, [groups, updateGroup]);

  return {
    groups,
    selectedGroupId,
    setSelectedGroupId,
    createGroup,
    updateGroup,
    deleteGroup,
    ungroupCards,
    addCardsToGroup,
    removeCardsFromGroup,
    getCardGroup,
    updateGroupBounds,
    clearAllGroups,
    availableColors: GROUP_COLORS
  };
}

// Helper function to calculate group bounds
function calculateGroupBounds(cardIds: string[], cards: Record<string, any>) {
  const cardPositions = cardIds.map(id => cards[id]).filter(Boolean);
  
  if (cardPositions.length === 0) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  const minX = Math.min(...cardPositions.map(card => card.x));
  const minY = Math.min(...cardPositions.map(card => card.y));
  const maxX = Math.max(...cardPositions.map(card => card.x + card.width));
  const maxY = Math.max(...cardPositions.map(card => card.y + card.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
