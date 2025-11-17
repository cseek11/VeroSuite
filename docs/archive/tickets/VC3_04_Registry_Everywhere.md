# VC3-04: Registry Everywhere - Ensure CardSelectorDialog and Rendering Paths Use cardRegistry

## Summary
Audit and refactor all card rendering paths to consistently use the centralized `cardRegistry` system. Remove any residual inline type maps and ensure CardSelectorDialog and all card rendering components consume the registry for type definitions and component resolution.

## Scope
- Audit all card rendering paths for registry usage
- Refactor CardSelectorDialog to use cardRegistry exclusively
- Remove inline type maps and hardcoded card type definitions
- Ensure consistent card type resolution throughout the system
- Add proper TypeScript typing with CardTypeId

## Current Issues Identified
1. **VeroCardsV3.tsx** has inline `getCardTypes` function (lines 71-78)
2. **CardSelectorDialog** may have hardcoded card type mappings
3. **Mixed type resolution** between registry and inline maps
4. **Inconsistent CardTypeId usage** in some components

## Tasks

### Phase 1: Audit Current Usage
1. **Search for inline card type definitions**
   ```bash
   grep -r "getCardTypes\|cardTypes\|cardTypeMap" frontend/src/
   ```
2. **Identify hardcoded card type arrays**
3. **Find components not using cardRegistry**
4. **Document current type resolution patterns**

### Phase 2: Refactor CardSelectorDialog
1. **Update CardSelectorDialog.tsx**
   - Remove any hardcoded card type arrays
   - Use cardRegistry directly for type resolution
   - Accept cardRegistry as prop or import directly
   - Ensure proper CardTypeId typing

2. **Create registry adapter function**
   ```typescript
   // frontend/src/routes/dashboard/utils/cardRegistryUtils.ts
   export const getCardTypesForSelector = () => 
     Object.entries(cardRegistry).map(([id, entry]) => ({
       id: id as CardTypeId,
       name: entry.name,
       component: entry.component
     }));
   ```

### Phase 3: Update VeroCardsV3 Integration
1. **Remove inline getCardTypes function** (lines 71-78)
2. **Use cardRegistry directly**
   ```typescript
   // Replace getCardTypes with:
   const cardTypes = useMemo(() => 
     Object.entries(cardRegistry).map(([id, entry]) => ({
       id: id as CardTypeId,
       name: entry.name,
       component: id === 'kpi-builder'
         ? () => <KpiBuilderCard onOpenBuilder={() => setShowKPIBuilder(true)} />
         : entry.component
     })), []);
   ```

3. **Update cardTypeMap creation**
   ```typescript
   const cardTypeMap = useMemo(() => 
     new Map(Object.entries(cardRegistry).map(([id, entry]) => [id, {
       id: id as CardTypeId,
       name: entry.name,
       component: entry.component
     }])), []);
   ```

### Phase 4: Standardize Card Type Resolution
1. **Update all card rendering paths**
   - DashboardCardContent.tsx
   - Card rendering functions
   - Type checking functions

2. **Replace hardcoded type checks**
   ```typescript
   // Instead of: card.type === 'kpi-display'
   // Use: card.type in cardRegistry
   
   // Instead of: getCardTypeName(card.type) || 'Unknown'
   // Use: cardRegistry[card.type]?.name || 'Unknown Card'
   ```

3. **Add proper CardTypeId constraints**
   ```typescript
   interface DashboardCardModel {
     id: string;
     type: CardTypeId; // Instead of CardTypeId | string
     x: number;
     y: number;
     width: number;
     height: number;
   }
   ```

### Phase 5: Registry Validation
1. **Add runtime validation**
   ```typescript
   export const validateCardType = (type: string): type is CardTypeId => {
     return type in cardRegistry;
   };
   ```

2. **Add development warnings**
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     if (!validateCardType(card.type)) {
       console.warn(`Unknown card type: ${card.type}`);
     }
   }
   ```

## Files to Modify

### Primary Files
- `frontend/src/routes/VeroCardsV3.tsx` - Remove inline getCardTypes
- `frontend/src/routes/dashboard/components/CardSelectorDialog.tsx` - Use registry
- `frontend/src/routes/dashboard/components/DashboardCardContent.tsx` - Registry integration
- `frontend/src/routes/dashboard/types.ts` - Stronger CardTypeId typing

### New Files
- `frontend/src/routes/dashboard/utils/cardRegistryUtils.ts` - Registry utilities
- `frontend/src/routes/dashboard/utils/cardTypeValidation.ts` - Type validation

### Updated Files
- `frontend/src/routes/dashboard/cards/cardRegistry.ts` - Ensure completeness
- All card rendering components - Registry consistency

## Acceptance Criteria
- CardSelectorDialog uses cardRegistry exclusively
- No inline card type definitions in VeroCardsV3.tsx
- All card rendering paths use registry for type resolution
- CardTypeId is used consistently throughout
- Runtime validation catches unknown card types
- Zero TypeScript errors with strict typing
- All existing functionality preserved

## Registry Completeness Check
Ensure cardRegistry includes all card types used in the system:
- ✅ dashboard-metrics
- ✅ smart-kpis  
- ✅ jobs-calendar
- ✅ recent-activity
- ✅ customer-search
- ✅ reports
- ✅ quick-actions
- ✅ kpi-builder
- ✅ predictive-analytics
- ✅ auto-layout
- ✅ routing
- ✅ team-overview
- ✅ financial-summary
- ✅ kpi-display
- ✅ kpi-template

## Notes
- Maintain backward compatibility with existing card data
- Preserve all existing card functionality
- Keep purple theme and styling unchanged
- Add helpful error messages for unknown card types
- Consider adding card type metadata (icons, categories) to registry

## Dependencies
- VC3-03 (Presentational Split) should be completed first
- Registry must be complete and properly typed

## Testing
- Test CardSelectorDialog with all registry types
- Verify card rendering works for all types
- Test unknown card type handling
- Ensure no runtime errors with registry validation
- Test card creation, editing, and deletion flows











