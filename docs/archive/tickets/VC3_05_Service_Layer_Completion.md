# VC3-05: Service Layer Completion - Move Direct enhancedApi Calls to Services

## Summary
Complete the service layer architecture by moving remaining direct `enhancedApi` calls (particularly KPI save/link operations) into dedicated service classes. Keep components hook-only and maintain clean separation between UI logic and business logic.

## Scope
- Identify all remaining direct enhancedApi calls in VeroCardsV3.tsx
- Create dedicated service classes for KPI operations
- Move API calls from components to services
- Maintain hook-only architecture in components
- Ensure proper error handling and type safety

## Current Direct API Calls Identified

### In VeroCardsV3.tsx (lines 138, 345, 357, 388, 403, 1398, 1475, 1523)
1. **KPI Templates API** (lines 138, 388)
   ```typescript
   const templates = await enhancedApi.kpiTemplates.list();
   ```

2. **Dashboard Layouts API** (lines 345, 357)
   ```typescript
   const layout = await enhancedApi.dashboardLayouts.getOrCreateDefault();
   const cards = await enhancedApi.dashboardLayouts.listCards(layout.id);
   ```

3. **User KPIs API** (line 403)
   ```typescript
   const userKpisList: any[] = await enhancedApi.userKpis.list();
   ```

4. **KPI Save/Link Operations** (lines 1398, 1475, 1523)
   ```typescript
   await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload);
   const savedKpi = await enhancedApi.userKpis.create(userKpiData);
   await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {...});
   ```

## Tasks

### Phase 1: Create Service Classes

#### 1. KPIService
**File**: `frontend/src/routes/dashboard/services/kpiService.ts`
```typescript
export class KPIService {
  // KPI Templates operations
  static async listTemplates(): Promise<KpiTemplate[]>
  static async getTemplate(id: string): Promise<KpiTemplate>
  
  // User KPIs operations  
  static async listUserKPIs(): Promise<UserKPI[]>
  static async createUserKPI(data: CreateKPIDto): Promise<UserKPI>
  static async updateUserKPI(id: string, data: UpdateKPIDto): Promise<UserKPI>
  static async deleteUserKPI(id: string): Promise<void>
  
  // KPI Card operations
  static async createKPICard(layoutId: string, templateId: string): Promise<string>
  static async linkKPIToCard(layoutId: string, cardId: string, kpiId: string): Promise<void>
  static async unlinkKPIFromCard(layoutId: string, cardId: string): Promise<void>
}
```

#### 2. LayoutService (extend existing)
**File**: `frontend/src/routes/dashboard/services/layoutService.ts` (extend)
```typescript
export class LayoutService {
  // Existing methods...
  
  // Enhanced layout operations
  static async getOrCreateDefaultLayout(): Promise<DashboardLayout>
  static async listLayoutCards(layoutId: string): Promise<DashboardCard[]>
  static async upsertCard(layoutId: string, card: DashboardCard): Promise<void>
  static async deleteCard(layoutId: string, cardId: string): Promise<void>
  
  // Bulk operations
  static async updateMultipleCards(layoutId: string, updates: CardUpdate[]): Promise<void>
  static async duplicateCard(layoutId: string, cardId: string): Promise<string>
}
```

#### 3. DashboardDataService
**File**: `frontend/src/routes/dashboard/services/dashboardDataService.ts`
```typescript
export class DashboardDataService {
  // Complete dashboard data loading
  static async loadDashboardData(): Promise<DashboardData>
  static async saveDashboardState(layoutId: string, data: DashboardState): Promise<void>
  
  // KPI data hydration
  static async hydrateKPIData(cards: DashboardCard[]): Promise<Record<string, KPIData>>
  static async syncKPIDataWithServer(layoutId: string, kpiData: Record<string, KPIData>): Promise<void>
}
```

### Phase 2: Create Custom Hooks

#### 1. useKPIService Hook
**File**: `frontend/src/routes/dashboard/hooks/useKPIService.ts`
```typescript
export const useKPIService = () => {
  const createKPIFromTemplate = useCallback(async (template: KpiTemplate) => {
    // Use KPIService.createKPICard
  }, []);
  
  const saveCustomKPI = useCallback(async (kpiData: CreateKPIDto) => {
    // Use KPIService.createUserKPI
  }, []);
  
  const linkKPIToCard = useCallback(async (layoutId: string, cardId: string, kpiId: string) => {
    // Use KPIService.linkKPIToCard
  }, []);
  
  return {
    createKPIFromTemplate,
    saveCustomKPI,
    linkKPIToCard,
    // ... other KPI operations
  };
};
```

#### 2. useDashboardData Hook
**File**: `frontend/src/routes/dashboard/hooks/useDashboardData.ts`
```typescript
export const useDashboardData = () => {
  const loadDashboard = useCallback(async () => {
    // Use DashboardDataService.loadDashboardData
  }, []);
  
  const saveDashboardState = useCallback(async (state: DashboardState) => {
    // Use DashboardDataService.saveDashboardState
  }, []);
  
  return {
    loadDashboard,
    saveDashboardState,
    // ... other data operations
  };
};
```

### Phase 3: Refactor VeroCardsV3.tsx

#### Remove Direct API Calls
1. **Replace KPI template loading** (lines 138, 388)
   ```typescript
   // Replace:
   const templates = await enhancedApi.kpiTemplates.list();
   
   // With:
   const templates = await KPIService.listTemplates();
   ```

2. **Replace layout operations** (lines 345, 357)
   ```typescript
   // Replace:
   const layout = await enhancedApi.dashboardLayouts.getOrCreateDefault();
   const cards = await enhancedApi.dashboardLayouts.listCards(layout.id);
   
   // With:
   const layout = await LayoutService.getOrCreateDefaultLayout();
   const cards = await LayoutService.listLayoutCards(layout.id);
   ```

3. **Replace KPI save operations** (lines 1475, 1523)
   ```typescript
   // Replace direct enhancedApi calls with service calls
   const savedKpi = await KPIService.createUserKPI(userKpiData);
   await LayoutService.upsertCard(currentLayoutId, cardData);
   ```

#### Use Custom Hooks
1. **Add service hooks**
   ```typescript
   const kpiService = useKPIService();
   const dashboardData = useDashboardData();
   ```

2. **Replace inline API logic**
   ```typescript
   // Replace complex onUseTemplate logic with:
   const handleUseTemplate = useCallback(async (template: KpiTemplate) => {
     await kpiService.createKPIFromTemplate(template);
   }, [kpiService]);
   ```

### Phase 4: Error Handling & Type Safety

#### 1. Add Service Error Handling
```typescript
export class ServiceError extends Error {
  constructor(
    message: string,
    public service: string,
    public operation: string,
    public originalError?: Error
  ) {
    super(message);
  }
}
```

#### 2. Add Retry Logic
```typescript
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  // Retry logic implementation
};
```

#### 3. Add Type Safety
```typescript
// Strong typing for all service operations
interface CreateKPIDto {
  name: string;
  description: string;
  category: string;
  threshold: ThresholdConfig;
  enabled: boolean;
  realTime: boolean;
  tags: string[];
  templateId?: string;
  formulaExpression: string;
  formulaFields: string[];
}

interface DashboardCard {
  card_uid: string;
  type: CardTypeId;
  x: number;
  y: number;
  width: number;
  height: number;
  template_id?: string;
  user_kpi_id?: string;
  config?: Record<string, any>;
}
```

## Files to Create

### Service Files
- `frontend/src/routes/dashboard/services/kpiService.ts`
- `frontend/src/routes/dashboard/services/dashboardDataService.ts`
- `frontend/src/routes/dashboard/services/errorHandling.ts`

### Hook Files  
- `frontend/src/routes/dashboard/hooks/useKPIService.ts`
- `frontend/src/routes/dashboard/hooks/useDashboardData.ts`

### Type Files
- `frontend/src/routes/dashboard/types/serviceTypes.ts`

## Files to Modify
- `frontend/src/routes/dashboard/services/layoutService.ts` (extend)
- `frontend/src/routes/VeroCardsV3.tsx` (remove direct API calls)
- `frontend/src/routes/dashboard/hooks/useKpiManager.ts` (integrate with services)

## Acceptance Criteria
- No direct enhancedApi calls in VeroCardsV3.tsx
- All API operations go through dedicated service classes
- Components use custom hooks for business logic
- Proper error handling and retry logic
- Strong TypeScript typing throughout
- All existing functionality preserved
- Services are testable and reusable

## Notes
- Maintain existing error handling patterns
- Preserve all retry logic and atomic operations
- Keep purple theme and styling unchanged
- Services should be stateless and pure
- Add comprehensive JSDoc documentation

## Dependencies
- VC3-04 (Registry Everywhere) should be completed first
- Existing layoutService should be extended, not replaced

## Testing
- Test all KPI operations (create, link, save)
- Test layout operations (load, save, update)
- Test error handling and retry logic
- Test service layer independently
- Verify no regression in existing functionality











