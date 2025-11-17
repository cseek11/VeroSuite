# VC3-06: KPI Modal Provider - Create Centralized Modal State Management

## Summary
Create a `KpiModalProvider` context provider to host KPI builder, template library, and drilldown modal state management. Replace scattered local modal state with centralized provider state for better state management and component organization.

## Scope
- Create KpiModalProvider context for modal state management
- Centralize KPI builder, template library, and drilldown modal states
- Replace local useState with provider state
- Improve modal state consistency and debugging
- Enable better modal coordination and lifecycle management

## Current Modal State Issues
1. **Scattered Modal States** in VeroCardsV3.tsx:
   - `showKPIBuilder` (line 162)
   - `showTemplateLibrary` (line 163)
   - Smart KPIs drilldown modal state (lines 1313-1318)

2. **Inconsistent Modal Management**:
   - Different modal opening/closing patterns
   - No centralized modal coordination
   - Hard to debug modal state issues

3. **Modal State Duplication**:
   - Similar modal logic repeated across components
   - No shared modal state validation

## Tasks

### Phase 1: Create KpiModalProvider

#### 1. Define Modal State Interface
**File**: `frontend/src/routes/dashboard/context/KpiModalProvider.tsx`
```typescript
interface KpiModalState {
  // KPI Builder Modal
  isKPIBuilderOpen: boolean;
  kpiBuilderMode: 'create' | 'edit';
  kpiBuilderData?: KPIBuilderData;
  
  // Template Library Modal
  isTemplateLibraryOpen: boolean;
  templateLibraryFilters?: TemplateFilters;
  
  // Drilldown Modal
  isDrillDownOpen: boolean;
  drillDownData?: DrillDownData;
  selectedKPI?: KPI;
  
  // Modal Coordination
  isAnyModalOpen: boolean;
  modalStack: string[]; // Track modal opening order
}

interface KpiModalActions {
  // KPI Builder actions
  openKPIBuilder: (mode: 'create' | 'edit', data?: KPIBuilderData) => void;
  closeKPIBuilder: () => void;
  
  // Template Library actions
  openTemplateLibrary: (filters?: TemplateFilters) => void;
  closeTemplateLibrary: () => void;
  
  // Drilldown actions
  openDrillDown: (kpi: KPI, data: DrillDownData) => void;
  closeDrillDown: () => void;
  
  // Global modal actions
  closeAllModals: () => void;
  closeTopModal: () => void;
}
```

#### 2. Implement Provider Component
```typescript
export const KpiModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<KpiModalState>({
    isKPIBuilderOpen: false,
    kpiBuilderMode: 'create',
    isTemplateLibraryOpen: false,
    isDrillDownOpen: false,
    isAnyModalOpen: false,
    modalStack: []
  });

  const actions = useMemo(() => ({
    openKPIBuilder: (mode: 'create' | 'edit', data?: KPIBuilderData) => {
      setModalState(prev => ({
        ...prev,
        isKPIBuilderOpen: true,
        kpiBuilderMode: mode,
        kpiBuilderData: data,
        isAnyModalOpen: true,
        modalStack: [...prev.modalStack, 'kpi-builder']
      }));
    },
    
    closeKPIBuilder: () => {
      setModalState(prev => ({
        ...prev,
        isKPIBuilderOpen: false,
        kpiBuilderData: undefined,
        isAnyModalOpen: prev.modalStack.filter(id => id !== 'kpi-builder').length > 0,
        modalStack: prev.modalStack.filter(id => id !== 'kpi-builder')
      }));
    },
    
    // ... other modal actions
    
    closeAllModals: () => {
      setModalState(prev => ({
        ...prev,
        isKPIBuilderOpen: false,
        isTemplateLibraryOpen: false,
        isDrillDownOpen: false,
        isAnyModalOpen: false,
        modalStack: [],
        kpiBuilderData: undefined,
        drillDownData: undefined,
        selectedKPI: undefined
      }));
    }
  }), []);

  const contextValue = useMemo(() => ({
    ...modalState,
    ...actions
  }), [modalState, actions]);

  return (
    <KpiModalContext.Provider value={contextValue}>
      {children}
    </KpiModalContext.Provider>
  );
};
```

#### 3. Create Custom Hook
```typescript
export const useKpiModals = () => {
  const context = useContext(KpiModalContext);
  if (!context) {
    throw new Error('useKpiModals must be used within KpiModalProvider');
  }
  return context;
};
```

### Phase 2: Refactor VeroCardsV3.tsx

#### 1. Remove Local Modal State
```typescript
// Remove these state variables:
// const [showKPIBuilder, setShowKPIBuilder] = useState(false);
// const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
```

#### 2. Use Provider State
```typescript
export default function VeroCardsV3({}: VeroCardsV3Props) {
  const kpiModals = useKpiModals();
  
  // Replace local state with provider state
  const handleOpenKPIBuilder = useCallback(() => {
    kpiModals.openKPIBuilder('create');
  }, [kpiModals]);
  
  const handleUseTemplate = useCallback(async (template: KpiTemplate) => {
    // KPI creation logic...
    kpiModals.closeKPIBuilder(); // Use provider action
  }, [kpiModals]);
}
```

#### 3. Update Modal Rendering
```typescript
// Replace local state checks with provider state
{kpiModals.isKPIBuilderOpen && (
  <KPIBuilder
    isOpen={kpiModals.isKPIBuilderOpen}
    onClose={kpiModals.closeKPIBuilder}
    mode={kpiModals.kpiBuilderMode}
    initialData={kpiModals.kpiBuilderData}
    // ... other props
  />
)}

{kpiModals.isTemplateLibraryOpen && (
  <KpiTemplateLibraryModal
    isOpen={kpiModals.isTemplateLibraryOpen}
    onClose={kpiModals.closeTemplateLibrary}
    // ... other props
  />
)}
```

### Phase 3: Update Smart KPIs Integration

#### 1. Integrate Drilldown Modal
```typescript
// In useSmartKPIs hook or component
const kpiModals = useKpiModals();

const handleDrillDown = useCallback((kpi: KPI, data: DrillDownData) => {
  kpiModals.openDrillDown(kpi, data);
}, [kpiModals]);

// Remove local drilldown modal state management
```

#### 2. Update DrillDownModal Rendering
```typescript
<DrillDownModal
  isOpen={kpiModals.isDrillDownOpen}
  onClose={kpiModals.closeDrillDown}
  kpi={kpiModals.selectedKPI}
  data={kpiModals.drillDownData}
/>
```

### Phase 4: Modal Coordination Features

#### 1. Add Modal Stack Management
```typescript
// Prevent multiple modals from opening simultaneously
const openKPIBuilder = useCallback((mode: 'create' | 'edit', data?: KPIBuilderData) => {
  if (modalState.isAnyModalOpen) {
    console.warn('Another modal is already open. Closing existing modal.');
    closeAllModals();
  }
  // ... open KPI builder
}, [modalState.isAnyModalOpen]);
```

#### 2. Add Keyboard Shortcuts
```typescript
// Add ESC key handling for modal management
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalState.isAnyModalOpen) {
      closeTopModal();
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [modalState.isAnyModalOpen]);
```

#### 3. Add Modal State Debugging
```typescript
// Development-only modal state logging
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('KPI Modal State:', modalState);
  }
}, [modalState]);
```

## Files to Create

### Provider Files
- `frontend/src/routes/dashboard/context/KpiModalProvider.tsx`
- `frontend/src/routes/dashboard/context/KpiModalContext.ts`
- `frontend/src/routes/dashboard/hooks/useKpiModals.ts`

### Type Files
- `frontend/src/routes/dashboard/types/modalTypes.ts`

## Files to Modify
- `frontend/src/routes/VeroCardsV3.tsx` - Remove local modal state, use provider
- `frontend/src/routes/dashboard/hooks/useSmartKPIs.ts` - Integrate drilldown modal
- `frontend/src/routes/dashboard/state/DashboardProvider.tsx` - Include KpiModalProvider

## Integration with DashboardProvider

```typescript
// In DashboardProvider.tsx
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutProvider>
      <KpiModalProvider>
        <DashboardStateProvider>
          {children}
        </DashboardStateProvider>
      </KpiModalProvider>
    </LayoutProvider>
  );
};
```

## Acceptance Criteria
- All KPI-related modal state managed by KpiModalProvider
- No local modal useState in VeroCardsV3.tsx
- Modal coordination prevents multiple modals open simultaneously
- ESC key closes top modal
- Modal stack tracks opening order
- Development debugging shows modal state changes
- All existing modal functionality preserved
- Clean separation between modal state and UI logic

## Notes
- Maintain all existing modal behavior and styling
- Keep purple theme and Tailwind classes
- Preserve all modal props and event handlers
- Add helpful console warnings for modal conflicts
- Consider adding modal transition animations in future

## Dependencies
- VC3-05 (Service Layer Completion) should be completed first
- DashboardProvider should be updated to include KpiModalProvider

## Testing
- Test all modal opening/closing scenarios
- Test modal coordination (prevent multiple modals)
- Test ESC key modal closing
- Test modal stack management
- Test KPI builder, template library, and drilldown modals
- Verify no regression in existing modal functionality











