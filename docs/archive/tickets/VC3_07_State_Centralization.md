# VC3-07: State Centralization - Migrate to DashboardProvider/Zustand

## Summary
Centralize all dashboard state management by migrating layout, cards, modals, and KPI state from scattered useState hooks into a unified DashboardProvider (or Zustand slices). This improves state consistency, debugging, and component organization.

## Scope
- Audit all useState hooks in VeroCardsV3.tsx
- Migrate state to centralized DashboardProvider or Zustand store
- Remove scattered state management
- Improve state consistency and debugging
- Enable better state sharing between components

## Current State Management Issues

### Scattered useState Hooks in VeroCardsV3.tsx
1. **Layout State** (lines 83-86)
   ```typescript
   const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
   const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
   const [showCardSelector, setShowCardSelector] = useState(false);
   const [showLayoutManager, setShowLayoutManager] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   ```

2. **Modal States** (lines 90-120)
   ```typescript
   const [alertModal, setAlertModal] = useState<{...}>({...});
   const [confirmModal, setConfirmModal] = useState<{...}>({...});
   const [promptModal, setPromptModal] = useState<{...}>({...});
   const [groupDeleteModal, setGroupDeleteModal] = useState<{...}>({...});
   ```

3. **KPI State** (lines 164-175)
   ```typescript
   const [kpiData, setKpiData] = useState<Record<string, any>>({});
   const [showKPIBuilder, setShowKPIBuilder] = useState(false);
   const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
   ```

4. **Virtual Scrolling State** (lines 156-157)
   ```typescript
   const [useVirtualScrollingEnabled, setUseVirtualScrollingEnabled] = useState(false);
   const [virtualScrollingThreshold, setVirtualScrollingThreshold] = useState(100);
   ```

5. **Mobile State** (lines 160-162)
   ```typescript
   const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
   const [showMobileNavigation, setShowMobileNavigation] = useState(false);
   ```

## Tasks

### Phase 1: Choose State Management Approach

#### Option A: Enhanced DashboardProvider (Recommended)
Extend existing DashboardProvider with comprehensive state management.

#### Option B: Zustand Store
Create dedicated Zustand store for dashboard state.

**Recommendation**: Use enhanced DashboardProvider for consistency with existing architecture.

### Phase 2: Design State Architecture

#### 1. Dashboard State Interface
```typescript
interface DashboardState {
  // Selection State
  selectedCards: Set<string>;
  selectedGroupId: string | null;
  
  // UI State
  searchTerm: string;
  showKeyboardHelp: boolean;
  showCardSelector: boolean;
  showLayoutManager: boolean;
  
  // Modal State (integrate with KpiModalProvider from VC3-06)
  modals: {
    alert: AlertModalState;
    confirm: ConfirmModalState;
    prompt: PromptModalState;
    groupDelete: GroupDeleteModalState;
  };
  
  // KPI State
  kpiData: Record<string, KPIData>;
  processedKpis: Set<string>;
  
  // Performance State
  virtualScrolling: {
    enabled: boolean;
    threshold: number;
  };
  
  // Mobile State
  mobile: {
    isFullscreen: boolean;
    showNavigation: boolean;
  };
  
  // Server State
  server: {
    currentLayoutId: string | null;
    isLoadingLayout: boolean;
    serverLoadSucceeded: boolean;
  };
}
```

#### 2. State Actions Interface
```typescript
interface DashboardActions {
  // Selection actions
  selectCard: (cardId: string, addToSelection?: boolean) => void;
  deselectCard: (cardId: string) => void;
  selectAllCards: () => void;
  deselectAllCards: () => void;
  
  // UI actions
  setSearchTerm: (term: string) => void;
  toggleKeyboardHelp: () => void;
  toggleCardSelector: () => void;
  toggleLayoutManager: () => void;
  
  // Modal actions
  showAlert: (config: AlertModalConfig) => void;
  showConfirm: (config: ConfirmModalConfig) => void;
  showPrompt: (config: PromptModalConfig) => void;
  hideModal: (modalType: ModalType) => void;
  
  // KPI actions
  setKpiData: (cardId: string, data: KPIData) => void;
  removeKpiData: (cardId: string) => void;
  markKpiProcessed: (kpiId: string) => void;
  
  // Performance actions
  setVirtualScrolling: (enabled: boolean, threshold?: number) => void;
  
  // Mobile actions
  setMobileFullscreen: (fullscreen: boolean) => void;
  setShowMobileNavigation: (show: boolean) => void;
  
  // Server actions
  setCurrentLayoutId: (layoutId: string | null) => void;
  setLoadingLayout: (loading: boolean) => void;
  setServerLoadSucceeded: (succeeded: boolean) => void;
}
```

### Phase 3: Implement Enhanced DashboardProvider

#### 1. Create Provider Component
**File**: `frontend/src/routes/dashboard/state/DashboardStateProvider.tsx`
```typescript
export const DashboardStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardState>({
    selectedCards: new Set(),
    selectedGroupId: null,
    searchTerm: '',
    showKeyboardHelp: false,
    showCardSelector: false,
    showLayoutManager: false,
    modals: {
      alert: { isOpen: false, title: '', message: '', type: 'info' },
      confirm: { isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'warning' },
      prompt: { isOpen: false, title: '', message: '', onConfirm: () => {}, placeholder: '', defaultValue: '' },
      groupDelete: { isOpen: false, groupId: '', groupName: '' }
    },
    kpiData: {},
    processedKpis: new Set(),
    virtualScrolling: { enabled: false, threshold: 100 },
    mobile: { isFullscreen: false, showNavigation: false },
    server: { currentLayoutId: null, isLoadingLayout: true, serverLoadSucceeded: false }
  });

  const actions = useMemo(() => ({
    // Selection actions
    selectCard: (cardId: string, addToSelection = false) => {
      setState(prev => ({
        ...prev,
        selectedCards: addToSelection 
          ? new Set([...prev.selectedCards, cardId])
          : new Set([cardId])
      }));
    },
    
    deselectCard: (cardId: string) => {
      setState(prev => ({
        ...prev,
        selectedCards: new Set([...prev.selectedCards].filter(id => id !== cardId))
      }));
    },
    
    selectAllCards: () => {
      setState(prev => ({
        ...prev,
        selectedCards: new Set(Object.keys(prev.kpiData)) // or from layout context
      }));
    },
    
    deselectAllCards: () => {
      setState(prev => ({
        ...prev,
        selectedCards: new Set()
      }));
    },
    
    // UI actions
    setSearchTerm: (term: string) => {
      setState(prev => ({ ...prev, searchTerm: term }));
    },
    
    toggleKeyboardHelp: () => {
      setState(prev => ({ ...prev, showKeyboardHelp: !prev.showKeyboardHelp }));
    },
    
    toggleCardSelector: () => {
      setState(prev => ({ ...prev, showCardSelector: !prev.showCardSelector }));
    },
    
    toggleLayoutManager: () => {
      setState(prev => ({ ...prev, showLayoutManager: !prev.showLayoutManager }));
    },
    
    // Modal actions
    showAlert: (config: AlertModalConfig) => {
      setState(prev => ({
        ...prev,
        modals: { ...prev.modals, alert: { ...config, isOpen: true } }
      }));
    },
    
    hideModal: (modalType: ModalType) => {
      setState(prev => ({
        ...prev,
        modals: {
          ...prev.modals,
          [modalType]: { ...prev.modals[modalType], isOpen: false }
        }
      }));
    },
    
    // KPI actions
    setKpiData: (cardId: string, data: KPIData) => {
      setState(prev => ({
        ...prev,
        kpiData: { ...prev.kpiData, [cardId]: data }
      }));
    },
    
    removeKpiData: (cardId: string) => {
      setState(prev => {
        const newKpiData = { ...prev.kpiData };
        delete newKpiData[cardId];
        return { ...prev, kpiData: newKpiData };
      });
    },
    
    markKpiProcessed: (kpiId: string) => {
      setState(prev => ({
        ...prev,
        processedKpis: new Set([...prev.processedKpis, kpiId])
      }));
    },
    
    // Performance actions
    setVirtualScrolling: (enabled: boolean, threshold = 100) => {
      setState(prev => ({
        ...prev,
        virtualScrolling: { enabled, threshold }
      }));
    },
    
    // Mobile actions
    setMobileFullscreen: (fullscreen: boolean) => {
      setState(prev => ({
        ...prev,
        mobile: { ...prev.mobile, isFullscreen: fullscreen }
      }));
    },
    
    setShowMobileNavigation: (show: boolean) => {
      setState(prev => ({
        ...prev,
        mobile: { ...prev.mobile, showNavigation: show }
      }));
    },
    
    // Server actions
    setCurrentLayoutId: (layoutId: string | null) => {
      setState(prev => ({
        ...prev,
        server: { ...prev.server, currentLayoutId: layoutId }
      }));
    },
    
    setLoadingLayout: (loading: boolean) => {
      setState(prev => ({
        ...prev,
        server: { ...prev.server, isLoadingLayout: loading }
      }));
    },
    
    setServerLoadSucceeded: (succeeded: boolean) => {
      setState(prev => ({
        ...prev,
        server: { ...prev.server, serverLoadSucceeded: succeeded }
      }));
    }
  }), []);

  const contextValue = useMemo(() => ({
    ...state,
    ...actions
  }), [state, actions]);

  return (
    <DashboardStateContext.Provider value={contextValue}>
      {children}
    </DashboardStateContext.Provider>
  );
};
```

#### 2. Create Custom Hook
```typescript
export const useDashboardState = () => {
  const context = useContext(DashboardStateContext);
  if (!context) {
    throw new Error('useDashboardState must be used within DashboardStateProvider');
  }
  return context;
};
```

### Phase 4: Refactor VeroCardsV3.tsx

#### 1. Remove Local State
```typescript
// Remove all useState hooks:
// const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
// const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
// const [showCardSelector, setShowCardSelector] = useState(false);
// const [showLayoutManager, setShowLayoutManager] = useState(false);
// const [searchTerm, setSearchTerm] = useState('');
// const [alertModal, setAlertModal] = useState<{...}>({...});
// const [confirmModal, setConfirmModal] = useState<{...}>({...});
// const [promptModal, setPromptModal] = useState<{...}>({...});
// const [groupDeleteModal, setGroupDeleteModal] = useState<{...}>({...});
// const [kpiData, setKpiData] = useState<Record<string, any>>({});
// const [showKPIBuilder, setShowKPIBuilder] = useState(false);
// const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
// const [useVirtualScrollingEnabled, setUseVirtualScrollingEnabled] = useState(false);
// const [virtualScrollingThreshold, setVirtualScrollingThreshold] = useState(100);
// const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
// const [showMobileNavigation, setShowMobileNavigation] = useState(false);
// const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
// const [isLoadingLayout, setIsLoadingLayout] = useState(true);
// const [serverLoadSucceeded, setServerLoadSucceeded] = useState(false);
```

#### 2. Use Provider State
```typescript
export default function VeroCardsV3({}: VeroCardsV3Props) {
  const dashboardState = useDashboardState();
  
  // Use provider state instead of local state
  const {
    selectedCards,
    searchTerm,
    showKeyboardHelp,
    showCardSelector,
    showLayoutManager,
    modals,
    kpiData,
    virtualScrolling,
    mobile,
    server
  } = dashboardState;
  
  const {
    selectCard,
    deselectCard,
    selectAllCards,
    deselectAllCards,
    setSearchTerm,
    toggleKeyboardHelp,
    toggleCardSelector,
    toggleLayoutManager,
    showAlert,
    showConfirm,
    showPrompt,
    hideModal,
    setKpiData,
    removeKpiData,
    setVirtualScrolling,
    setMobileFullscreen,
    setShowMobileNavigation,
    setCurrentLayoutId,
    setLoadingLayout,
    setServerLoadSucceeded
  } = dashboardState;
}
```

#### 3. Update Event Handlers
```typescript
// Update card selection handlers
const handleCardClick = useCallback((cardId: string, e: React.MouseEvent) => {
  e.stopPropagation();
  if (isDragging) return;

  if (e.ctrlKey || e.metaKey) {
    // Multi-select
    if (selectedCards.has(cardId)) {
      deselectCard(cardId);
    } else {
      selectCard(cardId, true);
    }
  } else {
    // Single select
    selectCard(cardId);
  }
}, [isDragging, selectedCards, selectCard, deselectCard]);

// Update modal handlers
const handleShowAlert = useCallback((title: string, message: string, type: 'info' | 'warning' | 'error' | 'success') => {
  showAlert({ title, message, type });
}, [showAlert]);

const handleShowConfirm = useCallback((title: string, message: string, onConfirm: () => void, type: 'warning' | 'danger' | 'info') => {
  showConfirm({ title, message, onConfirm, type });
}, [showConfirm]);
```

### Phase 5: Update Provider Hierarchy

```typescript
// In DashboardProvider.tsx
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutProvider>
      <DashboardStateProvider>
        <KpiModalProvider>
          <DashboardInteractionsProvider>
            {children}
          </DashboardInteractionsProvider>
        </KpiModalProvider>
      </DashboardStateProvider>
    </LayoutProvider>
  );
};
```

## Files to Create

### Provider Files
- `frontend/src/routes/dashboard/state/DashboardStateProvider.tsx`
- `frontend/src/routes/dashboard/state/DashboardStateContext.ts`

### Hook Files
- `frontend/src/routes/dashboard/hooks/useDashboardState.ts`

### Type Files
- `frontend/src/routes/dashboard/types/dashboardStateTypes.ts`

## Files to Modify
- `frontend/src/routes/VeroCardsV3.tsx` - Remove local state, use provider
- `frontend/src/routes/dashboard/state/DashboardProvider.tsx` - Include DashboardStateProvider
- All components using dashboard state - Update to use provider

## Acceptance Criteria
- No useState hooks in VeroCardsV3.tsx for dashboard state
- All state managed by centralized DashboardStateProvider
- State actions are properly typed and documented
- State debugging shows centralized state changes
- All existing functionality preserved
- Components can access shared state easily
- State updates are consistent and predictable

## Notes
- Maintain all existing behavior and styling
- Keep purple theme and Tailwind classes
- Preserve all event handlers and interactions
- Add helpful state debugging in development
- Consider adding state persistence for user preferences

## Dependencies
- VC3-06 (KPI Modal Provider) should be completed first
- DashboardProvider should be updated to include DashboardStateProvider

## Testing
- Test all state management scenarios
- Test state sharing between components
- Test state debugging and logging
- Test state persistence and restoration
- Verify no regression in existing functionality
- Test state consistency across component updates











