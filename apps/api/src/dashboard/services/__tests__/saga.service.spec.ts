import { SagaService, SagaContext, SagaStep, SagaResult } from '../saga.service';
import { DashboardService } from '../../dashboard.service';
import { EventStoreService, EventType } from '../event-store.service';
import { DashboardMetricsService } from '../dashboard-metrics.service';

describe('SagaService', () => {
  let sagaService: SagaService;
  let dashboardService: jest.Mocked<DashboardService>;
  let eventStore: jest.Mocked<EventStoreService>;
  let metricsService: jest.Mocked<DashboardMetricsService>;

  beforeEach(() => {
    dashboardService = {
      createRegion: jest.fn(),
      updateRegion: jest.fn(),
      deleteRegion: jest.fn(),
      getRegion: jest.fn(),
    } as any;

    eventStore = {
      appendEvent: jest.fn(),
    } as any;

    metricsService = {
      recordOperation: jest.fn(),
      recordError: jest.fn(),
      recordConflict: jest.fn(),
      recordRegionOperation: jest.fn(),
    } as any;

    sagaService = new SagaService(dashboardService, eventStore, metricsService);
  });

  function createTestContext(overrides: Partial<SagaContext> = {}): SagaContext {
    return {
      sagaId: 'saga-1',
      userId: 'user-1',
      tenantId: 'tenant-1',
      steps: [],
      executedSteps: [],
      rollbackData: new Map(),
      ...overrides,
    };
  }

  it('should execute all steps and append saga_completed event on success', async () => {
    const step1: SagaStep = {
      id: 'step-1',
      name: 'first',
      execute: jest.fn().mockResolvedValue(undefined),
    };
    const step2: SagaStep = {
      id: 'step-2',
      name: 'second',
      execute: jest.fn().mockResolvedValue(undefined),
    };

    const context = createTestContext({ steps: [step1, step2] });

    const result: SagaResult = await sagaService.executeSaga(context);

    expect(result.success).toBe(true);
    expect(result.executedSteps).toEqual(['step-1', 'step-2']);
    expect(metricsService.recordOperation).toHaveBeenCalledWith(
      'saga_execution',
      expect.any(Number),
      'success',
    );
    expect(eventStore.appendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: EventType.SAGA_COMPLETED,
        entity_type: 'saga',
        entity_id: context.sagaId,
        tenant_id: context.tenantId,
        user_id: context.userId,
      }),
    );
  });

  it('should rollback executed steps and append saga_rolled_back event on failure', async () => {
    const rollback = jest.fn().mockResolvedValue(undefined);

    const step1: SagaStep = {
      id: 'step-1',
      name: 'first',
      execute: jest.fn().mockResolvedValue({ rollbackData: { value: 1 } }),
      rollback,
    };

    const step2: SagaStep = {
      id: 'step-2',
      name: 'second',
      execute: jest.fn().mockRejectedValue(new Error('boom')),
      rollback,
    };

    const context = createTestContext({ steps: [step1, step2] });

    const result: SagaResult = await sagaService.executeSaga(context);

    expect(result.success).toBe(false);
    expect(rollback).toHaveBeenCalled();
    expect(eventStore.appendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: EventType.SAGA_ROLLED_BACK,
        entity_type: 'saga',
        entity_id: context.sagaId,
      }),
    );
  });
});



