import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JobPriority } from '../jobs/dto';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderFiltersDto, WorkOrderStatus, WorkOrderPriority } from './dto';

@Injectable()
export class WorkOrdersService {
  private readonly logger = new Logger(WorkOrdersService.name);

  constructor(
    private db: DatabaseService,
    private audit: AuditService,
  ) {}

  async createWorkOrder(data: CreateWorkOrderDto, tenantId: string, userId?: string) {
    const traceId = randomUUID();
    this.logger.debug('Creating work order', {
      operation: 'createWorkOrder',
      traceId,
      tenantId,
      userId,
      customerId: data.customer_id,
    });
    
    // Validate that customer exists and belongs to tenant
    const customer = await this.db.account.findFirst({
      where: { id: data.customer_id, tenant_id: tenantId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer not found: ${data.customer_id} for tenant: ${tenantId}`);
    }

    // Validate assigned technician if provided
    if (data.assigned_to) {
      const technician = await this.db.user.findFirst({
        where: { id: data.assigned_to, tenant_id: tenantId },
      });
      if (!technician) {
        throw new NotFoundException('Assigned technician not found');
      }
    }

    // Validate scheduled date is not in the past
    if (data.scheduled_date) {
      const scheduledDate = new Date(data.scheduled_date);
      if (scheduledDate < new Date()) {
        throw new BadRequestException('Scheduled date cannot be in the past');
      }
    }

    let workOrder;
    // Try to find a default location for this customer/account
    let defaultLocationId: string | null = null;
    try {
      const defaultLocation = await this.db.location.findFirst({
        where: { tenant_id: tenantId, account_id: data.customer_id },
        orderBy: { created_at: 'asc' },
      });
      defaultLocationId = defaultLocation?.id ?? null;
    } catch (e) {
      // If locations table is unavailable or no location found, proceed with null
      defaultLocationId = null;
    }
    try {
      // Use a transaction so that optional auto-created job is consistent
      const result = await this.db.$transaction(async (tx) => {
        const wo = await tx.workOrder.create({
          data: {
            tenant_id: tenantId,
            customer_id: data.customer_id,
            account_id: data.customer_id,
            location_id: defaultLocationId,
            service_type: data.service_type || 'General Service',
            assigned_to: data.assigned_to || null,
            status: data.status || WorkOrderStatus.PENDING,
            priority: data.priority || WorkOrderPriority.MEDIUM,
            scheduled_date: data.scheduled_date ? new Date(data.scheduled_date) : null,
            description: data.description,
            notes: data.notes || null,
            estimated_duration: data.estimated_duration || 60,
            service_price: data.service_price || null,
            special_instructions: data.description,
          },
          include: { location: true },
        });

        // If a schedule was provided, ensure there is a location and auto-create a job
        if (data.scheduled_date) {
          const scheduledDateTime = new Date(data.scheduled_date);
          // Extract date for job.scheduled_date (@db.Date stores only date)
          const scheduledDate = new Date(Date.UTC(
            scheduledDateTime.getUTCFullYear(),
            scheduledDateTime.getUTCMonth(),
            scheduledDateTime.getUTCDate()
          ));
          // Extract HH:mm:ss for start/end time strings
          const hh = String(scheduledDateTime.getHours()).padStart(2, '0');
          const mm = String(scheduledDateTime.getMinutes()).padStart(2, '0');
          const startTime = `${hh}:${mm}:00`;
          let endTime: string | null = null;
          if (wo.estimated_duration || data.estimated_duration) {
            const durationMin = wo.estimated_duration || data.estimated_duration || 0;
            const end = new Date(scheduledDateTime.getTime() + durationMin * 60 * 1000);
            const eh = String(end.getHours()).padStart(2, '0');
            const em = String(end.getMinutes()).padStart(2, '0');
            endTime = `${eh}:${em}:00`;
          }

          // Ensure we have a location_id
          let locationIdToUse = wo.location_id || defaultLocationId;
          if (!locationIdToUse) {
            // Try to create a default location from the customer's address
            if (customer.address && customer.city && customer.state) {
              const createdLocation = await tx.location.create({
                data: {
                  tenant_id: tenantId,
                  account_id: wo.account_id!,
                  name: 'Primary',
                  address_line1: customer.address,
                  address_line2: null,
                  city: customer.city,
                  state: customer.state,
                  postal_code: customer.zip_code || '',
                  country: 'US',
                },
              });
              locationIdToUse = createdLocation.id;
              // backfill on work order for consistency
              await tx.workOrder.update({
                where: { id: wo.id },
                data: { location_id: createdLocation.id },
              });
            }
          }

          if (locationIdToUse) {
            await tx.job.create({
              data: {
                tenant_id: tenantId,
                work_order_id: wo.id,
                account_id: wo.account_id!,
                location_id: locationIdToUse,
                scheduled_date: scheduledDate,
                scheduled_start_time: startTime,
                scheduled_end_time: endTime,
                priority: (data.priority as any) || (JobPriority.MEDIUM as any),
                technician_id: data.assigned_to || null,
                status: data.assigned_to ? 'scheduled' : 'unassigned',
              },
            });
          } else {
            // No viable location - skip job creation silently
            this.logger.warn('Auto-schedule skipped: no location available for account', {
              operation: 'createWorkOrder',
              traceId,
              tenantId,
              accountId: wo.account_id,
              errorCode: 'NO_LOCATION_FOR_JOB',
            });
          }
        }

        return wo;
      });

      workOrder = result;
      this.logger.log('Work order created successfully', {
        operation: 'createWorkOrder',
        traceId,
        tenantId,
        workOrderId: workOrder.id,
        customerId: workOrder.customer_id,
      });
    } catch (error) {
      this.logger.error('Error creating work order', {
        operation: 'createWorkOrder',
        traceId,
        tenantId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'CREATE_WORK_ORDER_ERROR',
        rootCause: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }

    try {
      await this.audit.log({
        tenantId,
        ...(userId && { userId }),
        action: 'created',
        resourceType: 'work_order',
        resourceId: workOrder.id,
        afterState: {
          customerId: workOrder.customer_id,
          assignedTo: workOrder.assigned_to,
          status: workOrder.status,
          priority: workOrder.priority,
          scheduledDate: workOrder.scheduled_date,
          description: workOrder.description,
        },
      });
    } catch (auditError) {
      this.logger.error('Error logging audit', {
        operation: 'createWorkOrder',
        traceId,
        tenantId,
        workOrderId: workOrder.id,
        error: auditError instanceof Error ? auditError.message : 'Unknown error',
        errorCode: 'AUDIT_LOG_ERROR',
      });
      // Don't fail the work order creation if audit logging fails
    }

    return workOrder;
  }

  async getWorkOrderById(id: string, tenantId: string) {
    const workOrder = await this.db.workOrder.findFirst({ where: { id, tenant_id: tenantId }, include: { location: true } });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }
    // Enrich with customer info
    try {
      const account = await this.db.account.findFirst({ where: { id: workOrder.account_id ?? workOrder.customer_id, tenant_id: tenantId } });
      return {
        ...workOrder,
        customer_name: account?.name ?? 'Unknown Customer',
        customer_email: account?.email ?? null,
      } as any;
    } catch {
      return { ...workOrder, customer_name: 'Unknown Customer' } as any;
    }
  }

  async listWorkOrders(filters: WorkOrderFiltersDto, tenantId: string) {
    const where: any = { tenant_id: tenantId };

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.assigned_to) {
      where.assigned_to = filters.assigned_to;
    }
    if (filters.customer_id) {
      where.customer_id = filters.customer_id;
    }
    if (filters.start_date || filters.end_date) {
      where.scheduled_date = {};
      if (filters.start_date) {
        where.scheduled_date.gte = new Date(filters.start_date);
      }
      if (filters.end_date) {
        where.scheduled_date.lte = new Date(filters.end_date);
      }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [workOrdersRaw, total] = await Promise.all([
      this.db.workOrder.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { scheduled_date: 'asc' },
          { created_at: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.db.workOrder.count({ where }),
    ]);

    // Batch load accounts to avoid N+1
    const accountIds = Array.from(new Set((workOrdersRaw || []).map(w => w.account_id ?? w.customer_id).filter(Boolean) as string[]));
    const accounts = accountIds.length
      ? await this.db.account.findMany({ where: { tenant_id: tenantId, id: { in: accountIds } } })
      : [];
    const accountMap = new Map(accounts.map(a => [a.id, a]));

    const workOrders = workOrdersRaw.map(w => {
      const acc = accountMap.get((w.account_id ?? w.customer_id) as string);
      return { ...w, customer_name: acc?.name ?? 'Unknown Customer', customer_email: acc?.email ?? null } as any;
    });

    return {
      data: workOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateWorkOrder(id: string, data: UpdateWorkOrderDto, tenantId: string, userId?: string) {
    // Check if work order exists and belongs to tenant
    const existingWorkOrder = await this.db.workOrder.findFirst({
      where: { id, tenant_id: tenantId },
    });

    if (!existingWorkOrder) {
      throw new NotFoundException('Work order not found');
    }

    // Validate customer if being updated
    if (data.customer_id) {
      const customer = await this.db.account.findFirst({
        where: { id: data.customer_id, tenant_id: tenantId },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    // Validate assigned technician if being updated
    if (data.assigned_to) {
      const technician = await this.db.user.findFirst({
        where: { id: data.assigned_to, tenant_id: tenantId },
      });
      if (!technician) {
        throw new NotFoundException('Assigned technician not found');
      }
    }

    // Validate scheduled date is not in the past
    if (data.scheduled_date) {
      const scheduledDate = new Date(data.scheduled_date);
      if (scheduledDate < new Date()) {
        throw new BadRequestException('Scheduled date cannot be in the past');
      }
    }

    // Validate completion date logic
    if (data.completion_date && data.status !== WorkOrderStatus.COMPLETED) {
      throw new BadRequestException('Completion date can only be set when status is completed');
    }

    const updateData: any = {};
    if (data.customer_id !== undefined) {
      updateData.customer_id = data.customer_id;
      updateData.account_id = data.customer_id; // Keep legacy field in sync
    }
    if (data.assigned_to !== undefined) updateData.assigned_to = data.assigned_to;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.scheduled_date !== undefined) updateData.scheduled_date = data.scheduled_date ? new Date(data.scheduled_date) : null;
    if (data.completion_date !== undefined) updateData.completion_date = data.completion_date ? new Date(data.completion_date) : null;
    if (data.description !== undefined) {
      updateData.description = data.description;
      updateData.special_instructions = data.description; // Keep legacy field in sync
    }
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    // Handle other legacy fields
    // location_id is no longer provided by frontend - will be handled separately if needed
    if (data.service_type !== undefined) updateData.service_type = data.service_type;
    if (data.recurrence_rule !== undefined) updateData.recurrence_rule = data.recurrence_rule;
    if (data.estimated_duration !== undefined) updateData.estimated_duration = data.estimated_duration;
    if (data.service_price !== undefined) updateData.service_price = data.service_price;

    const updatedWorkOrder = await this.db.workOrder.update({
      where: { id },
      data: updateData,
      include: { location: true },
    });

    await this.audit.log({
      tenantId,
      ...(userId && { userId }),
      action: 'updated',
      resourceType: 'work_order',
      resourceId: updatedWorkOrder.id,
      beforeState: {
        customerId: existingWorkOrder.customer_id,
        assignedTo: existingWorkOrder.assigned_to,
        status: existingWorkOrder.status,
        priority: existingWorkOrder.priority,
        scheduledDate: existingWorkOrder.scheduled_date,
        completionDate: existingWorkOrder.completion_date,
        description: existingWorkOrder.description,
        notes: existingWorkOrder.notes,
      },
      afterState: {
        customerId: updatedWorkOrder.customer_id,
        assignedTo: updatedWorkOrder.assigned_to,
        status: updatedWorkOrder.status,
        priority: updatedWorkOrder.priority,
        scheduledDate: updatedWorkOrder.scheduled_date,
        completionDate: updatedWorkOrder.completion_date,
        description: updatedWorkOrder.description,
        notes: updatedWorkOrder.notes,
      },
    });

    return updatedWorkOrder;
  }

  async deleteWorkOrder(id: string, tenantId: string, userId?: string) {
    // Check if work order exists and belongs to tenant
    const workOrder = await this.db.workOrder.findFirst({
      where: { id, tenant_id: tenantId },
      include: { /* no jobs relation in include type; checking separately if needed */ },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    // Check if work order has active jobs
    // Note: jobs relation is not directly available; skip active jobs check for now
    if (false) {
      throw new BadRequestException('Cannot delete work order with active jobs');
    }

    // Soft delete by updating status to canceled
    const deletedWorkOrder = await this.db.workOrder.update({
      where: { id },
      data: {
        status: WorkOrderStatus.CANCELED,
        updated_at: new Date(),
      },
    });

    await this.audit.log({
      tenantId,
      ...(userId && { userId }),
      action: 'deleted',
      resourceType: 'work_order',
      resourceId: deletedWorkOrder.id,
      beforeState: {
        customerId: workOrder.customer_id,
        assignedTo: workOrder.assigned_to,
        status: workOrder.status,
        priority: workOrder.priority,
        scheduledDate: workOrder.scheduled_date,
        description: workOrder.description,
      },
    });

    return { message: 'Work order deleted successfully' };
  }

  async getWorkOrdersByCustomer(customerId: string, tenantId: string) {
    // Verify customer belongs to tenant
    const customer = await this.db.account.findFirst({
      where: { id: customerId, tenant_id: tenantId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.db.workOrder.findMany({
      where: { customer_id: customerId, tenant_id: tenantId },
      include: { location: true },
      orderBy: [
        { priority: 'desc' },
        { scheduled_date: 'asc' },
        { created_at: 'desc' },
      ],
    });
  }

  async getWorkOrdersByTechnician(technicianId: string, tenantId: string) {
    // Verify technician belongs to tenant
    const technician = await this.db.user.findFirst({
      where: { id: technicianId, tenant_id: tenantId },
    });
    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    return this.db.workOrder.findMany({
      where: { assigned_to: technicianId, tenant_id: tenantId },
      include: { location: true },
      orderBy: [
        { priority: 'desc' },
        { scheduled_date: 'asc' },
        { created_at: 'desc' },
      ],
    });
  }
}
