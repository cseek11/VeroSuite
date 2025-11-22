import { Injectable, Logger } from '@nestjs/common';
import { DashboardService } from '../dashboard.service';
import { EventStoreService, EventType } from './event-store.service';
import { DashboardMetricsService } from './dashboard-metrics.service';
import { CreateDashboardRegionDto } from '../dto/dashboard-region.dto';

/**
 * Saga step definition
 */
export interface SagaStep {
  id: string;
  name: string;
  execute: () => Promise<any>;
  rollback?: (context: any) => Promise<void>;
  retryable?: boolean;
  maxRetries?: number;
}

/**
 * Saga execution context
 */
export interface SagaContext {
  sagaId: string;
  userId: string;
  tenantId: string;
  steps: SagaStep[];
  executedSteps: string[];
  rollbackData: Map<string, any>;
  metadata?: any;
}

/**
 * Saga execution result
 */
export interface SagaResult {
  success: boolean;
  sagaId: string;
  executedSteps: string[];
  failedStep?: string;
  error?: any;
  data?: any;
}

/**
 * Saga Orchestration Service
 * 
 * Handles complex multi-step operations with:
 * - Transaction management
 * - Automatic rollback on failure
 * - Retry logic for transient failures
 * - Comprehensive logging and metrics
 */
@Injectable()
export class SagaService {
  private readonly logger = new Logger(SagaService.name);
  private readonly activeSagas = new Map<string, SagaContext>();

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly eventStore: EventStoreService,
    private readonly metricsService: DashboardMetricsService
  ) {}

  /**
   * Execute a saga (multi-step operation)
   */
  async executeSaga(context: SagaContext): Promise<SagaResult> {
    const startTime = Date.now();
    this.activeSagas.set(context.sagaId, context);

    try {
      this.logger.log(`Starting saga execution: ${context.sagaId}`);

      // Execute each step sequentially
      for (const step of context.steps) {
        try {
          await this.executeStep(step, context);
          context.executedSteps.push(step.id);
        } catch (error) {
          this.logger.error(`Step ${step.id} failed in saga ${context.sagaId}`, error);
          
          // Attempt rollback
          await this.rollbackSaga(context);
          
          this.metricsService.recordError(
            `saga_step_failure`,
            `saga:${context.sagaId}:step:${step.id}`,
          );
          
          return {
            success: false,
            sagaId: context.sagaId,
            executedSteps: context.executedSteps,
            failedStep: step.id,
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }

      // All steps succeeded
      const duration = Date.now() - startTime;
      this.metricsService.recordOperation('saga_execution', duration, 'success');

      await this.eventStore.appendEvent({
        event_type: EventType.SAGA_COMPLETED,
        entity_type: 'saga',
        entity_id: context.sagaId,
        tenant_id: context.tenantId,
        user_id: context.userId,
        payload: {
          steps: context.executedSteps,
          metadata: context.metadata || {}
        },
        metadata: {
          duration
        }
      });

      this.logger.log(`Saga ${context.sagaId} completed successfully`);
      
      return {
        success: true,
        sagaId: context.sagaId,
        executedSteps: context.executedSteps,
        data: context.metadata
      };
    } catch (error) {
      this.logger.error(`Saga ${context.sagaId} failed`, error);
      await this.rollbackSaga(context);
      
      return {
        success: false,
        sagaId: context.sagaId,
        executedSteps: context.executedSteps,
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      this.activeSagas.delete(context.sagaId);
    }
  }

  /**
   * Execute a single step with retry logic
   */
  private async executeStep(step: SagaStep, context: SagaContext): Promise<void> {
    const maxRetries = step.maxRetries || 3;
    const isRetryable = step.retryable !== false;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await step.execute();
        
        // Store rollback data if step provides it
        if (result && typeof result === 'object' && 'rollbackData' in result) {
          context.rollbackData.set(step.id, result.rollbackData);
        }

        if (attempt > 0) {
          this.logger.log(`Step ${step.id} succeeded on retry ${attempt}`);
        }
        return;
      } catch (error) {
        lastError = error;
        
        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        this.logger.warn(`Step ${step.id} failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Rollback a saga by executing rollback functions in reverse order
   */
  private async rollbackSaga(context: SagaContext): Promise<void> {
    if (context.executedSteps.length === 0) {
      return;
    }

    this.logger.log(`Rolling back saga ${context.sagaId}`);

    // Execute rollbacks in reverse order
    for (let i = context.executedSteps.length - 1; i >= 0; i--) {
      const stepId = context.executedSteps[i];
      if (!stepId) {
        continue;
      }
      const step = context.steps.find(s => s.id === stepId);

      if (step && step.rollback) {
        try {
          const rollbackData = context.rollbackData.get(stepId);
          await step.rollback(rollbackData);
          this.logger.log(`Rolled back step ${stepId}`);
        } catch (error) {
          this.logger.error(`Failed to rollback step ${stepId}`, error);
          // Continue with other rollbacks even if one fails
        }
      }
    }

    await this.eventStore.appendEvent({
      event_type: EventType.SAGA_ROLLED_BACK,
      entity_type: 'saga',
      entity_id: context.sagaId,
      tenant_id: context.tenantId,
      user_id: context.userId,
      payload: {
        steps: context.executedSteps,
        metadata: context.metadata || {}
      },
      metadata: {
        rolledBackSteps: context.executedSteps
      }
    });
  }

  /**
   * Create a saga for bulk region operations
   */
  createBulkRegionSaga(
    user: any,
    layoutId: string,
    operations: Array<{ type: 'create' | 'update' | 'delete'; data: any; id?: string }>
  ): SagaContext {
    const sagaId = `saga-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const steps: SagaStep[] = [];

    operations.forEach((op, index) => {
      const stepId = `step-${index}-${op.type}`;
      
      if (op.type === 'create') {
        steps.push({
          id: stepId,
          name: `Create region ${index + 1}`,
          execute: async () => {
            const dto: CreateDashboardRegionDto = {
              ...op.data,
              layout_id: layoutId
            };
            const region = await this.dashboardService.createRegion(dto, user);
            return { rollbackData: { regionId: region.id } };
          },
          rollback: async (data: any) => {
            if (data?.regionId) {
              await this.dashboardService.deleteRegion(data.regionId, user);
            }
          },
          retryable: true
        });
      } else if (op.type === 'update' && op.id) {
        steps.push({
          id: stepId,
          name: `Update region ${op.id}`,
          execute: async () => {
            const existing = await this.dashboardService.getRegion(op.id!, user);
            await this.dashboardService.updateRegion(op.id!, op.data, user);
            return { rollbackData: existing };
          },
          rollback: async (data: any) => {
            if (data) {
              await this.dashboardService.updateRegion(data.id, data, user);
            }
          },
          retryable: true
        });
      } else if (op.type === 'delete' && op.id) {
        steps.push({
          id: stepId,
          name: `Delete region ${op.id}`,
          execute: async () => {
            const existing = await this.dashboardService.getRegion(op.id!, user);
            await this.dashboardService.deleteRegion(op.id!, user);
            return { rollbackData: existing };
          },
          rollback: async (data: any) => {
            if (data) {
              const dto: CreateDashboardRegionDto = {
                layout_id: layoutId,
                region_type: data.region_type,
                grid_row: data.grid_row,
                grid_col: data.grid_col,
                row_span: data.row_span,
                col_span: data.col_span,
                ...data
              };
              await this.dashboardService.createRegion(dto, user);
            }
          },
          retryable: false // Deletions are not retryable
        });
      }
    });

    return {
      sagaId,
      userId: user.userId,
      tenantId: user.tenantId,
      steps,
      executedSteps: [],
      rollbackData: new Map(),
      metadata: { layoutId, operationCount: operations.length }
    };
  }

  /**
   * Get active saga status
   */
  getSagaStatus(sagaId: string): SagaContext | null {
    return this.activeSagas.get(sagaId) || null;
  }
}

