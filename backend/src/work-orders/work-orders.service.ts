import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderFiltersDto, WorkOrderStatus, WorkOrderPriority } from './dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    private db: DatabaseService,
    private audit: AuditService,
  ) {}

  async createWorkOrder(data: CreateWorkOrderDto, tenantId: string, userId?: string) {
    // Validate that customer exists and belongs to tenant
    const customer = await this.db.account.findFirst({
      where: { id: data.customer_id, tenant_id: tenantId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
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

    const workOrder = await this.db.workOrder.create({
      data: {
        tenant_id: tenantId,
        customer_id: data.customer_id,
        location_id: data.customer_id, // Use customer_id as fallback for location
        service_type: data.service_type || 'General Service',
        assigned_to: data.assigned_to || null,
        status: data.status || WorkOrderStatus.PENDING,
        priority: data.priority || WorkOrderPriority.MEDIUM,
        scheduled_date: data.scheduled_date ? new Date(data.scheduled_date) : null,
        description: data.description,
        notes: data.notes || null,
        estimated_duration: data.estimated_duration || 60,
        service_price: data.service_price || null,
        special_instructions: data.description, // Use description as special_instructions
      },
      include: {
        account: true,
        assignedTechnician: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

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

    return workOrder;
  }

  async getWorkOrderById(id: string, tenantId: string) {
    const workOrder = await this.db.workOrder.findFirst({
      where: { id, tenant_id: tenantId },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            account_type: true,
            phone: true,
            email: true,
          },
        },
        assignedTechnician: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        jobs: {
          select: {
            id: true,
            status: true,
            scheduled_date: true,
            scheduled_start_time: true,
            scheduled_end_time: true,
          },
          orderBy: { scheduled_date: 'desc' },
        },
      },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    return workOrder;
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

    const [workOrders, total] = await Promise.all([
      this.db.workOrder.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              account_type: true,
            },
          },
          assignedTechnician: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
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
      include: {
        account: {
          select: {
            id: true,
            name: true,
            account_type: true,
            phone: true,
            email: true,
          },
        },
        assignedTechnician: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
      },
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
      include: {
        jobs: {
          where: {
            status: {
              in: ['scheduled', 'in_progress'],
            },
          },
        },
      },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    // Check if work order has active jobs
    if (workOrder.jobs.length > 0) {
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
      include: {
        assignedTechnician: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        jobs: {
          select: {
            id: true,
            status: true,
            scheduled_date: true,
          },
          orderBy: { scheduled_date: 'desc' },
        },
      },
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
      include: {
        account: {
          select: {
            id: true,
            name: true,
            account_type: true,
            phone: true,
            email: true,
          },
        },
        jobs: {
          select: {
            id: true,
            status: true,
            scheduled_date: true,
          },
          orderBy: { scheduled_date: 'desc' },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { scheduled_date: 'asc' },
        { created_at: 'desc' },
      ],
    });
  }
}
