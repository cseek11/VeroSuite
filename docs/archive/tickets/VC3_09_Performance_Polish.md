# VC3-09: Performance Polish - Memo Boundaries and Handler Stability

## Summary
Implement performance optimizations including memo boundaries on extracted components, ensure handler stability, optimize key props, and centralize virtualization configuration. This improves rendering performance and reduces unnecessary re-renders.

## Scope
- Add React.memo boundaries to extracted components
- Ensure callback stability with useCallback/useMemo
- Optimize key props for list rendering
- Centralize virtualization configuration
- Implement performance monitoring and debugging
- Optimize component re-render patterns

## Current Performance Issues Identified

### 1. Missing Memo Boundaries
- Extracted components (DashboardGroups, DashboardCards, etc.) lack memoization
- Components re-render unnecessarily when parent state changes
- Large component trees cause cascading re-renders

### 2. Unstable Callbacks
- Event handlers recreated on every render
- Props passed to child components change frequently
- useCallback dependencies not optimized

### 3. Inefficient Key Props
- Card rendering uses unstable keys
- Virtual scrolling keys not optimized
- Group rendering keys could be improved

### 4. Virtualization Configuration Optimization
- Virtual scrolling settings scattered across components (already implemented)
- Configuration not centralized for easy management
- Performance thresholds hardcoded in multiple places
- Virtual scrolling performance could be further optimized

## Tasks

### Phase 1: Add Memo Boundaries

#### 1. Memoize Extracted Components
**File**: `frontend/src/routes/dashboard/components/DashboardGroups.tsx`
```typescript
import React, { memo } from 'react';

interface DashboardGroupsProps {
  groups: Record<string, Group>;
  selectedGroupId: string | null;
  onUpdateGroup: (groupId: string, updates: Partial<Group>) => void;
  onDeleteGroup: (groupId: string) => void;
  onUngroupCards: (groupId: string) => void;
  onGroupDragStart: (groupId: string, e: React.MouseEvent) => void;
  onRequestDelete: (groupId: string) => void;
  onSelectGroup: (groupId: string | null) => void;
}

const DashboardGroups = memo<DashboardGroupsProps>(({
  groups,
  selectedGroupId,
  onUpdateGroup,
  onDeleteGroup,
  onUngroupCards,
  onGroupDragStart,
  onRequestDelete,
  onSelectGroup
}) => {
  return (
    <>
      {Object.values(groups).map((group) => (
        <CardGroup
          key={group.id}
          group={group}
          onUpdateGroup={onUpdateGroup}
          onDeleteGroup={onDeleteGroup}
          onUngroupCards={onUngroupCards}
          isSelected={selectedGroupId === group.id}
          onClick={() => onSelectGroup(selectedGroupId === group.id ? null : group.id)}
          onGroupDragStart={onGroupDragStart}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </>
  );
});

DashboardGroups.displayName = 'DashboardGroups';

export default DashboardGroups;
```

**File**: `frontend/src/routes/dashboard/components/DashboardCards.tsx`
```typescript
import React, { memo } from 'react';

interface DashboardCardsProps {
  cards: DashboardCard[];
  renderCard: (card: DashboardCard, index: number) => React.ReactNode;
  virtualScrolling: VirtualScrollingState;
  containerHeight: number;
  filteredCards: DashboardCard[];
}

const DashboardCards = memo<DashboardCardsProps>(({
  cards,
  renderCard,
  virtualScrolling,
  containerHeight,
  filteredCards
}) => {
  return (
    <>
      {virtualScrolling.isVirtualScrolling ? (
        <VirtualCardContainer
          cards={filteredCards}
          cardWidth={300}
          cardHeight={200}
          containerWidth={1200}
          containerHeight={containerHeight}
          renderCard={renderCard}
          onScroll={(_scrollTop) => {
            // Handle scroll events if needed
          }}
          overscan={5}
          threshold={virtualScrolling.threshold}
        />
      ) : (
        filteredCards.map((card, index) => renderCard(card, index))
      )}
    </>
  );
});

DashboardCards.displayName = 'DashboardCards';

export default DashboardCards;
```

**File**: `frontend/src/routes/dashboard/components/DashboardEmptyState.tsx`
```typescript
import React, { memo } from 'react';

interface DashboardEmptyStateProps {
  onAddCard: () => void;
}

const DashboardEmptyState = memo<DashboardEmptyStateProps>(({ onAddCard }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 text-lg font-medium mb-2">
          Your Customizable Dashboard
        </div>
        <div className="text-gray-500 text-sm mb-4">
          Add cards to create your personalized workspace
        </div>
        <button
          onClick={onAddCard}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Your First Card
        </button>
      </div>
    </div>
  );
});

DashboardEmptyState.displayName = 'DashboardEmptyState';

export default DashboardEmptyState;
```

#### 2. Memoize Individual Card Components
```typescript
// In DashboardCard.tsx
const DashboardCard = memo<DashboardCardProps>(({
  cardId,
  x,
  y,
  width,
  height,
  type,
  isFocused,
  isSelected,
  navigationMode,
  isNavigating,
  onFocus,
  isDraggingMultiple,
  draggedCardId,
  isLocked,
  groupLocked,
  searchActive,
  headerTitle,
  onToggleLock,
  onDelete,
  onMouseDown,
  onClick,
  resizingCardId,
  onResizeStart,
  children
}) => {
  // Component implementation
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
```

### Phase 2: Optimize Callback Stability

#### 1. Stabilize Event Handlers
```typescript
// In VeroCardsV3.tsx
const handleCardClick = useCallback((cardId: string, e: React.MouseEvent) => {
  e.stopPropagation();
  if (isDragging) return;

  if (e.ctrlKey || e.metaKey) {
    // Multi-select
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  } else {
    // Single select
    setSelectedCards(new Set([cardId]));
  }
}, [isDragging]); // Minimal dependencies

const handleAddCard = useCallback((type: CardTypeId) => {
  addCard(type).then(cardId => {
    setSelectedCards(new Set([cardId]));
  });
}, [addCard]); // Stable dependency

const handleDeleteCards = useCallback((cardIds: string[]) => {
  cardIds.forEach(removeCard);
  setSelectedCards(new Set());
}, [removeCard]); // Stable dependency
```

#### 2. Optimize Props Passing
```typescript
// Memoize filtered cards to prevent unnecessary recalculations
const filteredCards = useMemo(() => {
  if (!searchTerm.trim()) {
    return Object.values(layout.cards);
  }
  
  const term = searchTerm.toLowerCase();
  return Object.values(layout.cards).filter(card => {
    const cardType = cardTypes.find(t => t.id === card.type);
    const cardName = cardType?.name || '';
    return cardName.toLowerCase().includes(term) || 
           card.type.toLowerCase().includes(term) ||
           card.id.toLowerCase().includes(term);
  });
}, [layout.cards, searchTerm, cardTypes]); // Optimized dependencies

// Memoize card type map
const cardTypeMap = useMemo(() => 
  new Map(cardTypes.map(ct => [ct.id, ct])), 
  [cardTypes]
);
```

#### 3. Optimize Render Functions
```typescript
// Memoize render card function
const renderCard = useCallback((card: DashboardCard, _index: number) => (
  <DashboardCard
    key={card.id} // Stable key
    cardId={card.id}
    x={card.x}
    y={card.y}
    width={card.width}
    height={card.height}
    type={card.type}
    isFocused={keyboardNavigation.focusedCardId === card.id}
    isSelected={selectedCards.has(card.id)}
    navigationMode={keyboardNavigation.navigationMode}
    isNavigating={keyboardNavigation.isNavigating}
    onFocus={() => keyboardNavigation.navigateToCard(card.id)}
    isDraggingMultiple={isDraggingMultiple}
    draggedCardId={draggedCardId ?? null}
    isLocked={isCardLocked(card.id)}
    groupLocked={!!getCardGroup(card.id)?.locked}
    searchActive={!!(searchTerm && filteredCards.find(c => c.id === card.id))}
    headerTitle={card.type === 'kpi-display' && kpiData[card.id]?.name ? kpiData[card.id].name : (getCardTypeName(card.type) || cardTypeMap.get(card.type)?.name || 'Unknown Card')}
    onToggleLock={() => toggleCardLock(card.id)}
    onDelete={() => removeCard(card.id)}
    onMouseDown={(e) => {
      const cardGroup = getCardGroup(card.id);
      if (!isCardLocked(card.id) && (!cardGroup || !cardGroup?.locked)) {
        handleDragStart(card.id, e);
      }
    }}
    onClick={(e) => handleCardClick(card.id, e)}
    resizingCardId={resizingCardId ?? null}
    onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)}
  >
    {renderCardContent(card)}
  </DashboardCard>
), [
  selectedCards, 
  isDraggingMultiple, 
  draggedCardId, 
  isCardLocked, 
  getCardGroup, 
  searchTerm, 
  filteredCards, 
  handleDragStart, 
  handleCardClick, 
  toggleCardLock, 
  removeCard, 
  renderCardContent, 
  resizingCardId, 
  handleResizeStart,
  keyboardNavigation,
  kpiData,
  cardTypeMap
]); // Optimized dependencies
```

### Phase 3: Optimize Key Props

#### 1. Stable Keys for Lists
```typescript
// Use stable keys for card rendering
const renderCard = useCallback((card: DashboardCard, _index: number) => (
  <DashboardCard
    key={card.id} // Use card.id instead of index
    // ... other props
  />
), [/* dependencies */]);

// Use stable keys for group rendering
{Object.values(groups).map((group) => (
  <CardGroup
    key={group.id} // Use group.id instead of index
    // ... other props
  />
))}

// Use stable keys for virtual scrolling
<VirtualCardContainer
  cards={filteredCards}
  getItemKey={(card) => card.id} // Stable key function
  // ... other props
/>
```

#### 2. Optimize Existing Virtual Scrolling
```typescript
// Current implementation already exists, optimize it:
// 1. Improve VirtualCardContainer performance
// 2. Optimize key props for virtual scrolling
// 3. Enhance virtual scrolling configuration

// In VirtualCardContainer (already exists, optimize it)
interface VirtualCardContainerProps {
  cards: DashboardCard[];
  getItemKey?: (card: DashboardCard) => string; // Add optional key function
  // ... existing props
}

const VirtualCardContainer = memo<VirtualCardContainerProps>(({
  cards,
  getItemKey = (card) => card.id, // Default to card.id
  // ... other props
}) => {
  // Optimize item key generation
  const itemKeys = useMemo(() => 
    cards.map(getItemKey), 
    [cards, getItemKey]
  );
  
  // ... optimize existing virtual scrolling implementation
});
```

### Phase 4: Optimize Existing Virtualization Configuration

#### 1. Centralize Existing Virtualization Config
**File**: `frontend/src/routes/dashboard/config/virtualizationConfig.ts`
```typescript
export interface VirtualizationConfig {
  // Performance thresholds
  virtualScrollingThreshold: number;
  autoEnableThreshold: number;
  
  // Virtual scrolling settings
  itemHeight: number;
  containerHeight: number;
  overscan: number;
  
  // Performance monitoring
  enablePerformanceMonitoring: boolean;
  performanceLoggingThreshold: number;
  
  // Optimization settings
  enableMemoBoundaries: boolean;
  enableCallbackOptimization: boolean;
  enableKeyOptimization: boolean;
}

export const defaultVirtualizationConfig: VirtualizationConfig = {
  virtualScrollingThreshold: 100,
  autoEnableThreshold: 50,
  itemHeight: 200,
  containerHeight: 600,
  overscan: 5,
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
  performanceLoggingThreshold: 16, // 60fps
  enableMemoBoundaries: true,
  enableCallbackOptimization: true,
  enableKeyOptimization: true,
};

// Environment-specific overrides
export const getVirtualizationConfig = (): VirtualizationConfig => {
  const config = { ...defaultVirtualizationConfig };
  
  // Override for production
  if (process.env.NODE_ENV === 'production') {
    config.enablePerformanceMonitoring = false;
    config.virtualScrollingThreshold = 50; // Enable earlier in production
  }
  
  // Override for development
  if (process.env.NODE_ENV === 'development') {
    config.enablePerformanceMonitoring = true;
    config.performanceLoggingThreshold = 16;
  }
  
  return config;
};
```

#### 2. Optimize Existing Virtual Scrolling Usage
```typescript
// In VeroCardsV3.tsx - optimize existing implementation
import { getVirtualizationConfig } from './config/virtualizationConfig';

export default function VeroCardsV3({}: VeroCardsV3Props) {
  const virtualizationConfig = useMemo(() => getVirtualizationConfig(), []);
  
  // Optimize existing virtual scrolling state
  const [useVirtualScrollingEnabled, setUseVirtualScrollingEnabled] = useState(false);
  const [virtualScrollingThreshold, setVirtualScrollingThreshold] = useState(
    virtualizationConfig.virtualScrollingThreshold // Use centralized config
  );
  
  // Optimize existing virtual scrolling hook usage
  const virtualScrolling = useVirtualScrolling({
    itemHeight: virtualizationConfig.itemHeight,
    containerHeight: Math.max(virtualizationConfig.containerHeight, layout.canvasHeight),
    overscan: virtualizationConfig.overscan,
    threshold: virtualScrollingThreshold
  });
  
  // ... rest of existing component
}
```

### Phase 5: Performance Monitoring

#### 1. Add Performance Monitoring Hook
**File**: `frontend/src/routes/dashboard/hooks/usePerformanceMonitoring.ts`
```typescript
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformanceMonitoring = (
  componentName: string,
  enabled: boolean = false
) => {
  const renderStartTime = useRef<number>(0);
  
  useEffect(() => {
    if (enabled) {
      renderStartTime.current = performance.now();
    }
  });
  
  useEffect(() => {
    if (enabled && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      
      if (renderTime > 16) { // Log slow renders (> 16ms)
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      // Log performance metrics
      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now()
      };
      
      // Store metrics for analysis
      if (typeof window !== 'undefined' && (window as any).__VERO_PERFORMANCE__) {
        (window as any).__VERO_PERFORMANCE__.push(metrics);
      }
    }
  });
};

// Performance monitoring wrapper
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = (props: P) => {
    usePerformanceMonitoring(componentName, process.env.NODE_ENV === 'development');
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return WrappedComponent;
};
```

#### 2. Add Performance Monitoring to Components
```typescript
// In VeroCardsV3.tsx
import { withPerformanceMonitoring } from './hooks/usePerformanceMonitoring';

// Wrap main component
const VeroCardsV3WithMonitoring = withPerformanceMonitoring(VeroCardsV3, 'VeroCardsV3');

export default VeroCardsV3WithMonitoring;

// In extracted components
const DashboardGroupsWithMonitoring = withPerformanceMonitoring(DashboardGroups, 'DashboardGroups');
const DashboardCardsWithMonitoring = withPerformanceMonitoring(DashboardCards, 'DashboardCards');
```

#### 3. Add Performance Debugging
```typescript
// Development performance debugging
useEffect(() => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Add performance debugging to window object
    (window as any).__VERO_PERFORMANCE__ = [];
    
    // Log performance summary
    setInterval(() => {
      const metrics = (window as any).__VERO_PERFORMANCE__;
      if (metrics && metrics.length > 0) {
        const avgRenderTime = metrics.reduce((sum: number, m: PerformanceMetrics) => sum + m.renderTime, 0) / metrics.length;
        const slowRenders = metrics.filter((m: PerformanceMetrics) => m.renderTime > 16).length;
        
        console.log(`Performance Summary: Avg ${avgRenderTime.toFixed(2)}ms, ${slowRenders} slow renders`);
        
        // Clear metrics
        (window as any).__VERO_PERFORMANCE__ = [];
      }
    }, 5000); // Log every 5 seconds
  }
}, []);
```

## Files to Create

### Config Files
- `frontend/src/routes/dashboard/config/virtualizationConfig.ts`

### Hook Files
- `frontend/src/routes/dashboard/hooks/usePerformanceMonitoring.ts`

### Optimized Component Files
- `frontend/src/routes/dashboard/components/DashboardGroups.tsx` (memoized)
- `frontend/src/routes/dashboard/components/DashboardCards.tsx` (memoized)
- `frontend/src/routes/dashboard/components/DashboardEmptyState.tsx` (memoized)

## Files to Modify
- `frontend/src/routes/VeroCardsV3.tsx` - Add performance optimizations
- `frontend/src/routes/dashboard/components/DashboardCard.tsx` - Add memoization
- `frontend/src/routes/dashboard/components/VirtualCardContainer.tsx` - Optimize keys
- All extracted components - Add memo boundaries

## Acceptance Criteria
- All extracted components use React.memo
- Event handlers are stable with minimal dependencies
- Key props are optimized for list rendering
- **Existing virtual scrolling is optimized and centralized** (not implemented from scratch)
- Performance monitoring is enabled in development
- No unnecessary re-renders in component tree
- Render performance is improved (measured)
- All existing functionality preserved

## Performance Metrics
- Target: < 16ms render time for main components
- Target: < 5ms render time for individual cards
- Target: < 100ms for large card sets (100+ cards)
- Monitor: Re-render frequency and causes
- Monitor: Memory usage and garbage collection

## Notes
- Maintain all existing functionality and styling
- Keep purple theme and Tailwind classes
- Performance optimizations should be transparent to users
- Add helpful performance debugging in development
- Consider adding performance budgets for CI/CD

## Dependencies
- VC3-08 (Strong Typing Pass) should be completed first
- Extracted components must be properly structured

## Testing
- Test performance with large card sets (100+ cards)
- Test virtual scrolling performance
- Test re-render frequency with React DevTools
- Test memory usage and garbage collection
- Test performance monitoring and logging
- Verify no regression in existing functionality
