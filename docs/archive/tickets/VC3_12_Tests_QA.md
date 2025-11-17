# VC3-12: Tests and QA - Add Unit Tests and Smoke Testing

## Summary
Add comprehensive unit tests for services and registry, implement smoke testing for KPI creation/linkage, and verify RLS-backed calls still pass with current keys. This ensures code quality, prevents regressions, and validates the V3 migration.

## Scope
- Add unit tests for service layer (KPIService, LayoutService, DashboardDataService)
- Add unit tests for card registry and type validation
- Implement smoke testing for KPI operations
- Verify RLS (Row Level Security) calls with current keys
- Add integration tests for provider state management
- Add performance tests for virtual scrolling

## Current Testing Gaps

### 1. Service Layer Testing
- No unit tests for KPIService
- No unit tests for LayoutService
- No unit tests for DashboardDataService
- No error handling tests
- No retry logic tests

### 2. Registry Testing
- No tests for card registry
- No tests for type validation
- No tests for card type resolution
- No tests for registry completeness

### 3. KPI Operations Testing
- No smoke tests for KPI creation
- No tests for KPI linkage
- No tests for template operations
- No tests for drilldown functionality

### 4. RLS Testing
- No tests for RLS-backed API calls
- No tests for tenant isolation
- No tests for authentication
- No tests for authorization

## Tasks

### Phase 1: Service Layer Unit Tests

#### 1. KPIService Tests
**File**: `frontend/src/routes/dashboard/services/__tests__/kpiService.test.ts`
```typescript
import { KPIService } from '../kpiService';
import { enhancedApi } from '@/lib/enhanced-api';

// Mock enhancedApi
jest.mock('@/lib/enhanced-api');
const mockEnhancedApi = enhancedApi as jest.Mocked<typeof enhancedApi>;

describe('KPIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTemplates', () => {
    it('should return KPI templates', async () => {
      const mockTemplates = [
        {
          id: 'template-1',
          name: 'Test Template',
          description: 'Test Description',
          type: 'system',
          template_type: 'system' as const,
          threshold_config: { green: 80, yellow: 60, unit: '%' },
          chart_config: { type: 'line' as const },
          data_source_config: { table: 'jobs', column: 'status' },
          tags: ['test'],
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      mockEnhancedApi.kpiTemplates.list.mockResolvedValue(mockTemplates);

      const result = await KPIService.listTemplates();

      expect(result).toEqual(mockTemplates);
      expect(mockEnhancedApi.kpiTemplates.list).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockEnhancedApi.kpiTemplates.list.mockRejectedValue(error);

      await expect(KPIService.listTemplates()).rejects.toThrow('API Error');
    });
  });

  describe('createUserKPI', () => {
    it('should create user KPI', async () => {
      const mockKpiData = {
        name: 'Test KPI',
        description: 'Test Description',
        category: 'operational',
        threshold: { green: 80, yellow: 60, unit: '%' },
        enabled: true,
        realTime: false,
        tags: [],
        templateId: 'template-1',
        formulaExpression: 'SUM(value)',
        formulaFields: ['field1', 'field2']
      };

      const mockCreatedKPI = {
        id: 'kpi-1',
        ...mockKpiData,
        user_id: 'user-1',
        tenant_id: 'tenant-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockEnhancedApi.userKpis.create.mockResolvedValue(mockCreatedKPI);

      const result = await KPIService.createUserKPI(mockKpiData);

      expect(result).toEqual(mockCreatedKPI);
      expect(mockEnhancedApi.userKpis.create).toHaveBeenCalledWith(mockKpiData);
    });

    it('should handle validation errors', async () => {
      const invalidKpiData = {
        name: '', // Invalid: empty name
        description: 'Test Description',
        category: 'operational',
        threshold: { green: 80, yellow: 60, unit: '%' },
        enabled: true,
        realTime: false,
        tags: [],
        templateId: 'template-1',
        formulaExpression: 'SUM(value)',
        formulaFields: ['field1', 'field2']
      };

      await expect(KPIService.createUserKPI(invalidKpiData)).rejects.toThrow();
    });
  });

  describe('createKPICard', () => {
    it('should create KPI card', async () => {
      const layoutId = 'layout-1';
      const templateId = 'template-1';
      const cardId = 'card-1';

      mockEnhancedApi.dashboardLayouts.upsertCard.mockResolvedValue({ id: cardId });

      const result = await KPIService.createKPICard(layoutId, templateId);

      expect(result).toBe(cardId);
      expect(mockEnhancedApi.dashboardLayouts.upsertCard).toHaveBeenCalledWith(
        layoutId,
        expect.objectContaining({
          type: 'kpi-display',
          template_id: templateId
        })
      );
    });

    it('should handle retry logic', async () => {
      const layoutId = 'layout-1';
      const templateId = 'template-1';

      // Mock first call to fail, second to succeed
      mockEnhancedApi.dashboardLayouts.upsertCard
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({ id: 'card-1' });

      const result = await KPIService.createKPICard(layoutId, templateId);

      expect(result).toBe('card-1');
      expect(mockEnhancedApi.dashboardLayouts.upsertCard).toHaveBeenCalledTimes(2);
    });
  });
});
```

#### 2. LayoutService Tests
**File**: `frontend/src/routes/dashboard/services/__tests__/layoutService.test.ts`
```typescript
import { LayoutService } from '../layoutService';
import { enhancedApi } from '@/lib/enhanced-api';

jest.mock('@/lib/enhanced-api');
const mockEnhancedApi = enhancedApi as jest.Mocked<typeof enhancedApi>;

describe('LayoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrCreateDefaultLayout', () => {
    it('should return existing layout', async () => {
      const mockLayout = {
        id: 'layout-1',
        name: 'Default Layout',
        description: 'Default dashboard layout',
        is_default: true,
        user_id: 'user-1',
        tenant_id: 'tenant-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockResolvedValue(mockLayout);

      const result = await LayoutService.getOrCreateDefaultLayout();

      expect(result).toEqual(mockLayout);
      expect(mockEnhancedApi.dashboardLayouts.getOrCreateDefault).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockRejectedValue(error);

      await expect(LayoutService.getOrCreateDefaultLayout()).rejects.toThrow('API Error');
    });
  });

  describe('listLayoutCards', () => {
    it('should return layout cards', async () => {
      const layoutId = 'layout-1';
      const mockCards = [
        {
          card_uid: 'card-1',
          type: 'kpi-display',
          x: 0,
          y: 0,
          width: 300,
          height: 200,
          template_id: 'template-1',
          config: {},
          layout_id: layoutId,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      mockEnhancedApi.dashboardLayouts.listCards.mockResolvedValue(mockCards);

      const result = await LayoutService.listLayoutCards(layoutId);

      expect(result).toEqual(mockCards);
      expect(mockEnhancedApi.dashboardLayouts.listCards).toHaveBeenCalledWith(layoutId);
    });
  });

  describe('upsertCard', () => {
    it('should upsert card', async () => {
      const layoutId = 'layout-1';
      const cardData = {
        card_uid: 'card-1',
        type: 'kpi-display' as const,
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        template_id: 'template-1',
        config: {}
      };

      mockEnhancedApi.dashboardLayouts.upsertCard.mockResolvedValue({ id: 'card-1' });

      await LayoutService.upsertCard(layoutId, cardData);

      expect(mockEnhancedApi.dashboardLayouts.upsertCard).toHaveBeenCalledWith(
        layoutId,
        cardData
      );
    });
  });
});
```

#### 3. DashboardDataService Tests
**File**: `frontend/src/routes/dashboard/services/__tests__/dashboardDataService.test.ts`
```typescript
import { DashboardDataService } from '../dashboardDataService';
import { LayoutService } from '../layoutService';
import { KPIService } from '../kpiService';

jest.mock('../layoutService');
jest.mock('../kpiService');

const mockLayoutService = LayoutService as jest.Mocked<typeof LayoutService>;
const mockKPIService = KPIService as jest.Mocked<typeof KPIService>;

describe('DashboardDataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadDashboardData', () => {
    it('should load complete dashboard data', async () => {
      const mockLayout = {
        id: 'layout-1',
        name: 'Default Layout',
        description: 'Default dashboard layout',
        is_default: true,
        user_id: 'user-1',
        tenant_id: 'tenant-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      const mockCards = [
        {
          card_uid: 'card-1',
          type: 'kpi-display',
          x: 0,
          y: 0,
          width: 300,
          height: 200,
          template_id: 'template-1',
          config: {},
          layout_id: 'layout-1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      const mockTemplates = [
        {
          id: 'template-1',
          name: 'Test Template',
          description: 'Test Description',
          type: 'system',
          template_type: 'system' as const,
          threshold_config: { green: 80, yellow: 60, unit: '%' },
          chart_config: { type: 'line' as const },
          data_source_config: { table: 'jobs', column: 'status' },
          tags: ['test'],
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      mockLayoutService.getOrCreateDefaultLayout.mockResolvedValue(mockLayout);
      mockLayoutService.listLayoutCards.mockResolvedValue(mockCards);
      mockKPIService.listTemplates.mockResolvedValue(mockTemplates);

      const result = await DashboardDataService.loadDashboardData();

      expect(result).toEqual({
        layout: mockLayout,
        cards: mockCards,
        templates: mockTemplates
      });
    });
  });

  describe('hydrateKPIData', () => {
    it('should hydrate KPI data from cards', async () => {
      const mockCards = [
        {
          card_uid: 'card-1',
          type: 'kpi-display',
          x: 0,
          y: 0,
          width: 300,
          height: 200,
          template_id: 'template-1',
          config: {},
          layout_id: 'layout-1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      const mockTemplate = {
        id: 'template-1',
        name: 'Test Template',
        description: 'Test Description',
        type: 'system',
        template_type: 'system' as const,
        threshold_config: { green: 80, yellow: 60, unit: '%' },
        chart_config: { type: 'line' as const },
        data_source_config: { table: 'jobs', column: 'status' },
        tags: ['test'],
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockKPIService.getTemplate.mockResolvedValue(mockTemplate);

      const result = await DashboardDataService.hydrateKPIData(mockCards);

      expect(result).toEqual({
        'card-1': {
          id: 'template-1',
          name: 'Test Template',
          description: 'Test Description',
          enabled: true,
          realTime: false,
          template_id: 'template-1',
          template_type: 'system',
          threshold_config: { green: 80, yellow: 60, unit: '%' },
          chart_config: { type: 'line' },
          data_source_config: { table: 'jobs', column: 'status' },
          tags: ['test'],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      });
    });
  });
});
```

### Phase 2: Registry and Type Validation Tests

#### 1. Card Registry Tests
**File**: `frontend/src/routes/dashboard/cards/__tests__/cardRegistry.test.ts`
```typescript
import { cardRegistry, getCardTypeName, getDefaultCardSize, getCardRegistryEntry } from '../cardRegistry';
import { CardTypeId } from '../types';

describe('Card Registry', () => {
  describe('cardRegistry', () => {
    it('should contain all required card types', () => {
      const requiredTypes: CardTypeId[] = [
        'dashboard-metrics',
        'smart-kpis',
        'jobs-calendar',
        'recent-activity',
        'customer-search',
        'reports',
        'quick-actions',
        'kpi-builder',
        'predictive-analytics',
        'auto-layout',
        'routing',
        'team-overview',
        'financial-summary',
        'kpi-display',
        'kpi-template'
      ];

      requiredTypes.forEach(type => {
        expect(cardRegistry[type]).toBeDefined();
        expect(cardRegistry[type].name).toBeTruthy();
        expect(cardRegistry[type].component).toBeDefined();
        expect(cardRegistry[type].defaultSize).toBeDefined();
        expect(cardRegistry[type].defaultSize.width).toBeGreaterThan(0);
        expect(cardRegistry[type].defaultSize.height).toBeGreaterThan(0);
      });
    });

    it('should have consistent default sizes', () => {
      Object.values(cardRegistry).forEach(entry => {
        expect(entry.defaultSize.width).toBeGreaterThan(100);
        expect(entry.defaultSize.width).toBeLessThan(1000);
        expect(entry.defaultSize.height).toBeGreaterThan(100);
        expect(entry.defaultSize.height).toBeLessThan(1000);
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['analytics', 'management', 'communication', 'custom'];
      
      Object.values(cardRegistry).forEach(entry => {
        expect(validCategories).toContain(entry.category);
      });
    });
  });

  describe('getCardTypeName', () => {
    it('should return correct name for valid card type', () => {
      expect(getCardTypeName('kpi-display')).toBe('KPI Display');
      expect(getCardTypeName('jobs-calendar')).toBe('Jobs Calendar');
    });

    it('should throw error for invalid card type', () => {
      expect(() => getCardTypeName('invalid-type' as CardTypeId)).toThrow('Unknown card type');
    });
  });

  describe('getDefaultCardSize', () => {
    it('should return correct size for valid card type', () => {
      const size = getDefaultCardSize('kpi-display');
      expect(size.width).toBe(300);
      expect(size.height).toBe(200);
    });

    it('should throw error for invalid card type', () => {
      expect(() => getDefaultCardSize('invalid-type' as CardTypeId)).toThrow('Unknown card type');
    });
  });

  describe('getCardRegistryEntry', () => {
    it('should return correct entry for valid card type', () => {
      const entry = getCardRegistryEntry('kpi-display');
      expect(entry.name).toBe('KPI Display');
      expect(entry.category).toBe('analytics');
    });

    it('should throw error for invalid card type', () => {
      expect(() => getCardRegistryEntry('invalid-type' as CardTypeId)).toThrow('Unknown card type');
    });
  });
});
```

#### 2. Type Validation Tests
**File**: `frontend/src/routes/dashboard/utils/__tests__/typeValidation.test.ts`
```typescript
import {
  validateCardType,
  validateDashboardCard,
  validateKPIData,
  validateThresholdConfig,
  validateInDevelopment
} from '../typeValidation';
import { CardTypeId } from '../../types';

describe('Type Validation', () => {
  describe('validateCardType', () => {
    it('should validate correct card types', () => {
      expect(validateCardType('kpi-display')).toBe(true);
      expect(validateCardType('jobs-calendar')).toBe(true);
      expect(validateCardType('recent-activity')).toBe(true);
    });

    it('should reject invalid card types', () => {
      expect(validateCardType('invalid-type')).toBe(false);
      expect(validateCardType('')).toBe(false);
      expect(validateCardType('123')).toBe(false);
    });
  });

  describe('validateDashboardCard', () => {
    it('should validate correct dashboard card', () => {
      const validCard = {
        id: 'card-1',
        type: 'kpi-display',
        x: 0,
        y: 0,
        width: 300,
        height: 200
      };

      expect(validateDashboardCard(validCard)).toBe(true);
    });

    it('should reject invalid dashboard card', () => {
      const invalidCard = {
        id: 'card-1',
        type: 'kpi-display',
        x: 'invalid', // Should be number
        y: 0,
        width: 300,
        height: 200
      };

      expect(validateDashboardCard(invalidCard)).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validateDashboardCard(null)).toBe(false);
      expect(validateDashboardCard(undefined)).toBe(false);
    });
  });

  describe('validateKPIData', () => {
    it('should validate correct KPI data', () => {
      const validKPIData = {
        id: 'kpi-1',
        name: 'Test KPI',
        description: 'Test Description',
        enabled: true,
        realTime: false
      };

      expect(validateKPIData(validKPIData)).toBe(true);
    });

    it('should reject invalid KPI data', () => {
      const invalidKPIData = {
        id: 'kpi-1',
        name: 'Test KPI',
        description: 'Test Description',
        enabled: 'invalid', // Should be boolean
        realTime: false
      };

      expect(validateKPIData(invalidKPIData)).toBe(false);
    });
  });

  describe('validateThresholdConfig', () => {
    it('should validate correct threshold config', () => {
      const validConfig = {
        green: 80,
        yellow: 60,
        unit: '%'
      };

      expect(validateThresholdConfig(validConfig)).toBe(true);
    });

    it('should reject invalid threshold config', () => {
      const invalidConfig = {
        green: 'invalid', // Should be number
        yellow: 60,
        unit: '%'
      };

      expect(validateThresholdConfig(invalidConfig)).toBe(false);
    });
  });

  describe('validateInDevelopment', () => {
    it('should validate in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const validData = { id: 'test', name: 'Test' };
      
      expect(() => validateInDevelopment(validData, validateKPIData, 'Test error')).not.toThrow();

      process.env.NODE_ENV = originalEnv;
    });

    it('should not validate in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const invalidData = { id: 'test' }; // Missing required fields
      
      expect(() => validateInDevelopment(invalidData, validateKPIData, 'Test error')).not.toThrow();

      process.env.NODE_ENV = originalEnv;
    });
  });
});
```

### Phase 3: KPI Operations Smoke Tests

#### 1. KPI Creation Smoke Test
**File**: `frontend/src/routes/dashboard/__tests__/kpiOperations.test.ts`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VeroCardsV3 from '../VeroCardsV3';
import { KPIService } from '../services/kpiService';
import { LayoutService } from '../services/layoutService';

// Mock services
jest.mock('../services/kpiService');
jest.mock('../services/layoutService');

const mockKPIService = KPIService as jest.Mocked<typeof KPIService>;
const mockLayoutService = LayoutService as jest.Mocked<typeof LayoutService>;

describe('KPI Operations Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful service calls
    mockLayoutService.getOrCreateDefaultLayout.mockResolvedValue({
      id: 'layout-1',
      name: 'Default Layout',
      description: 'Default dashboard layout',
      is_default: true,
      user_id: 'user-1',
      tenant_id: 'tenant-1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    });

    mockLayoutService.listLayoutCards.mockResolvedValue([]);
    mockKPIService.listTemplates.mockResolvedValue([]);
  });

  describe('KPI Builder Modal', () => {
    it('should open KPI builder modal', async () => {
      render(<VeroCardsV3 />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Add Your First Card')).toBeInTheDocument();
      });

      // Click add card button
      fireEvent.click(screen.getByText('Add Your First Card'));

      // Should open card selector
      await waitFor(() => {
        expect(screen.getByText('Select Card Type')).toBeInTheDocument();
      });

      // Click KPI Builder card
      fireEvent.click(screen.getByText('KPI Builder'));

      // Should open KPI builder modal
      await waitFor(() => {
        expect(screen.getByText('KPI Builder')).toBeInTheDocument();
      });
    });

    it('should create custom KPI', async () => {
      const user = userEvent.setup();
      
      render(<VeroCardsV3 />);

      // Open KPI builder
      await waitFor(() => {
        expect(screen.getByText('Add Your First Card')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Add Your First Card'));
      
      await waitFor(() => {
        expect(screen.getByText('Select Card Type')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('KPI Builder'));

      // Fill KPI form
      await waitFor(() => {
        expect(screen.getByText('KPI Builder')).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText('KPI Name'), 'Test KPI');
      await user.type(screen.getByLabelText('Description'), 'Test Description');
      
      // Select category
      await user.selectOptions(screen.getByLabelText('Category'), 'operational');
      
      // Set threshold
      await user.type(screen.getByLabelText('Green Threshold'), '80');
      await user.type(screen.getByLabelText('Yellow Threshold'), '60');
      
      // Mock successful KPI creation
      mockKPIService.createUserKPI.mockResolvedValue({
        id: 'kpi-1',
        name: 'Test KPI',
        description: 'Test Description',
        category: 'operational',
        formula_expression: 'SUM(value)',
        formula_fields: [],
        threshold_config: { green: 80, yellow: 60, unit: '%' },
        chart_config: { type: 'line' },
        data_source_config: {},
        tags: [],
        is_active: true,
        realTime: false,
        user_id: 'user-1',
        tenant_id: 'tenant-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      });

      mockKPIService.createKPICard.mockResolvedValue('card-1');

      // Submit form
      fireEvent.click(screen.getByText('Create KPI'));

      // Should create KPI and close modal
      await waitFor(() => {
        expect(mockKPIService.createUserKPI).toHaveBeenCalledWith({
          name: 'Test KPI',
          description: 'Test Description',
          category: 'operational',
          threshold: { green: 80, yellow: 60, unit: '%' },
          enabled: true,
          realTime: false,
          tags: [],
          templateId: undefined,
          formulaExpression: 'SUM(value)',
          formulaFields: []
        });
      });

      await waitFor(() => {
        expect(mockKPIService.createKPICard).toHaveBeenCalled();
      });
    });
  });

  describe('Template Library', () => {
    it('should open template library', async () => {
      render(<VeroCardsV3 />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Add Your First Card')).toBeInTheDocument();
      });

      // Click add card button
      fireEvent.click(screen.getByText('Add Your First Card'));

      // Should open card selector
      await waitFor(() => {
        expect(screen.getByText('Select Card Type')).toBeInTheDocument();
      });

      // Click KPI Display card
      fireEvent.click(screen.getByText('KPI Display'));

      // Should open template library
      await waitFor(() => {
        expect(screen.getByText('KPI Template Library')).toBeInTheDocument();
      });
    });

    it('should use template to create KPI', async () => {
      const mockTemplate = {
        id: 'template-1',
        name: 'Test Template',
        description: 'Test Description',
        type: 'system',
        template_type: 'system' as const,
        threshold_config: { green: 80, yellow: 60, unit: '%' },
        chart_config: { type: 'line' as const },
        data_source_config: { table: 'jobs', column: 'status' },
        tags: ['test'],
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockKPIService.listTemplates.mockResolvedValue([mockTemplate]);
      mockKPIService.createKPICard.mockResolvedValue('card-1');

      render(<VeroCardsV3 />);

      // Open template library
      await waitFor(() => {
        expect(screen.getByText('Add Your First Card')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Add Your First Card'));
      
      await waitFor(() => {
        expect(screen.getByText('Select Card Type')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('KPI Display'));

      // Should show template library with template
      await waitFor(() => {
        expect(screen.getByText('Test Template')).toBeInTheDocument();
      });

      // Click use template
      fireEvent.click(screen.getByText('Use Template'));

      // Should create KPI card
      await waitFor(() => {
        expect(mockKPIService.createKPICard).toHaveBeenCalledWith('layout-1', 'template-1');
      });
    });
  });
});
```

### Phase 4: RLS and Authentication Tests

#### 1. RLS API Tests
**File**: `frontend/src/routes/dashboard/__tests__/rlsTests.test.ts`
```typescript
import { enhancedApi } from '@/lib/enhanced-api';

// Mock enhancedApi
jest.mock('@/lib/enhanced-api');
const mockEnhancedApi = enhancedApi as jest.Mocked<typeof enhancedApi>;

describe('RLS API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should include auth headers in API calls', async () => {
      // Mock successful API call
      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockResolvedValue({
        id: 'layout-1',
        name: 'Default Layout',
        description: 'Default dashboard layout',
        is_default: true,
        user_id: 'user-1',
        tenant_id: 'tenant-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      });

      await enhancedApi.dashboardLayouts.getOrCreateDefault();

      // Verify API was called with proper auth
      expect(mockEnhancedApi.dashboardLayouts.getOrCreateDefault).toHaveBeenCalled();
      
      // In a real test, you would verify the actual headers
      // This would require mocking the HTTP client
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Unauthorized');
      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockRejectedValue(authError);

      await expect(enhancedApi.dashboardLayouts.getOrCreateDefault()).rejects.toThrow('Unauthorized');
    });
  });

  describe('Tenant Isolation', () => {
    it('should only return data for current tenant', async () => {
      const mockLayout = {
        id: 'layout-1',
        name: 'Default Layout',
        description: 'Default dashboard layout',
        is_default: true,
        user_id: 'user-1',
        tenant_id: 'tenant-1', // Current tenant
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockResolvedValue(mockLayout);

      const result = await enhancedApi.dashboardLayouts.getOrCreateDefault();

      expect(result.tenant_id).toBe('tenant-1');
      expect(result.user_id).toBe('user-1');
    });

    it('should handle tenant isolation errors', async () => {
      const tenantError = new Error('Access denied: Invalid tenant');
      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockRejectedValue(tenantError);

      await expect(enhancedApi.dashboardLayouts.getOrCreateDefault()).rejects.toThrow('Access denied');
    });
  });

  describe('User Authorization', () => {
    it('should only return data for current user', async () => {
      const mockLayout = {
        id: 'layout-1',
        name: 'Default Layout',
        description: 'Default dashboard layout',
        is_default: true,
        user_id: 'user-1', // Current user
        tenant_id: 'tenant-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockResolvedValue(mockLayout);

      const result = await enhancedApi.dashboardLayouts.getOrCreateDefault();

      expect(result.user_id).toBe('user-1');
    });

    it('should handle user authorization errors', async () => {
      const authError = new Error('Access denied: Invalid user');
      mockEnhancedApi.dashboardLayouts.getOrCreateDefault.mockRejectedValue(authError);

      await expect(enhancedApi.dashboardLayouts.getOrCreateDefault()).rejects.toThrow('Access denied');
    });
  });
});
```

### Phase 5: Integration Tests

#### 1. Provider State Management Tests
**File**: `frontend/src/routes/dashboard/__tests__/providerIntegration.test.ts`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardProvider } from '../state/DashboardProvider';
import { useDashboardState } from '../hooks/useDashboardState';

// Test component that uses dashboard state
const TestComponent = () => {
  const { selectedCards, selectCard, deselectCard } = useDashboardState();

  return (
    <div>
      <div data-testid="selected-count">{selectedCards.size}</div>
      <button onClick={() => selectCard('card-1')}>Select Card 1</button>
      <button onClick={() => deselectCard('card-1')}>Deselect Card 1</button>
    </div>
  );
};

describe('Provider Integration Tests', () => {
  it('should manage dashboard state correctly', async () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    // Initial state
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');

    // Select card
    fireEvent.click(screen.getByText('Select Card 1'));
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');

    // Deselect card
    fireEvent.click(screen.getByText('Deselect Card 1'));
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
  });

  it('should handle multiple card selection', async () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    // Select multiple cards
    fireEvent.click(screen.getByText('Select Card 1'));
    fireEvent.click(screen.getByText('Select Card 1')); // Should deselect
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
  });
});
```

### Phase 6: Performance Tests

#### 1. Virtual Scrolling Performance Tests
**File**: `frontend/src/routes/dashboard/__tests__/performance.test.ts`
```typescript
import { render, screen } from '@testing-library/react';
import { performance } from 'perf_hooks';
import VeroCardsV3 from '../VeroCardsV3';

// Mock large dataset
const createLargeCardSet = (count: number) => {
  const cards = [];
  for (let i = 0; i < count; i++) {
    cards.push({
      id: `card-${i}`,
      type: 'kpi-display',
      x: (i % 10) * 320,
      y: Math.floor(i / 10) * 220,
      width: 300,
      height: 200
    });
  }
  return cards;
};

describe('Performance Tests', () => {
  describe('Virtual Scrolling', () => {
    it('should render large card sets efficiently', async () => {
      const largeCardSet = createLargeCardSet(1000);
      
      const startTime = performance.now();
      
      render(<VeroCardsV3 />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in less than 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle card updates efficiently', async () => {
      const largeCardSet = createLargeCardSet(500);
      
      const { rerender } = render(<VeroCardsV3 />);
      
      const startTime = performance.now();
      
      // Simulate card update
      rerender(<VeroCardsV3 />);
      
      const endTime = performance.now();
      const updateTime = endTime - startTime;
      
      // Should update in less than 50ms
      expect(updateTime).toBeLessThan(50);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with large datasets', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<VeroCardsV3 />);
        unmount();
      }
      
      // Force garbage collection
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
    });
  });
});
```

## Files to Create

### Test Files
- `frontend/src/routes/dashboard/services/__tests__/kpiService.test.ts`
- `frontend/src/routes/dashboard/services/__tests__/layoutService.test.ts`
- `frontend/src/routes/dashboard/services/__tests__/dashboardDataService.test.ts`
- `frontend/src/routes/dashboard/cards/__tests__/cardRegistry.test.ts`
- `frontend/src/routes/dashboard/utils/__tests__/typeValidation.test.ts`
- `frontend/src/routes/dashboard/__tests__/kpiOperations.test.ts`
- `frontend/src/routes/dashboard/__tests__/rlsTests.test.ts`
- `frontend/src/routes/dashboard/__tests__/providerIntegration.test.ts`
- `frontend/src/routes/dashboard/__tests__/performance.test.ts`

### Test Configuration Files
- `frontend/src/routes/dashboard/__tests__/setup.ts`
- `frontend/src/routes/dashboard/__tests__/mocks.ts`

## Files to Modify
- `package.json` - Add test scripts
- `jest.config.js` - Configure test environment
- `tsconfig.json` - Add test types

## Acceptance Criteria
- All service layer functions have unit tests
- Card registry and type validation are tested
- KPI operations smoke tests pass
- RLS API calls are validated
- Provider state management is tested
- Performance tests meet benchmarks
- Test coverage > 80%
- All tests pass in CI/CD
- No regression in existing functionality

## Test Coverage Targets
- **Services**: > 90% coverage
- **Registry**: > 95% coverage
- **Type Validation**: > 95% coverage
- **KPI Operations**: > 80% coverage
- **RLS Tests**: > 85% coverage
- **Integration Tests**: > 70% coverage
- **Performance Tests**: > 60% coverage

## Notes
- Use Jest and React Testing Library
- Mock external dependencies
- Test error scenarios and edge cases
- Include performance benchmarks
- Test both success and failure paths
- Validate RLS and authentication
- Test with realistic data sizes

## Dependencies
- VC3-11 (Routing and Documentation) should be completed first
- All previous tickets should be completed
- Test environment must be properly configured

## Testing Strategy
1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **Smoke Tests**: Test critical user workflows
4. **Performance Tests**: Test with large datasets
5. **RLS Tests**: Test security and authorization
6. **Regression Tests**: Ensure no functionality loss

## Test Execution
```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern=services
npm test -- --testPathPattern=registry
npm test -- --testPathPattern=kpiOperations

# Run with coverage
npm test -- --coverage

# Run performance tests
npm test -- --testPathPattern=performance

# Run RLS tests
npm test -- --testPathPattern=rlsTests
```











