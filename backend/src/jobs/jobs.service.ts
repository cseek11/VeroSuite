import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';
import { CreateJobDto, AssignJobDto, JobStatus } from './dto';
import { CompleteJobDto } from './jobs.actions';

@Injectable()
export class JobsService {
  constructor(private db: DatabaseService, private audit: AuditService) {}

  async getTodaysJobs(tenantId: string, technicianId?: string) {
    const today = new Date().toISOString().split('T')[0];
    const jobs = await this.db.job.findMany({
      where: {
        tenant_id: tenantId,
        scheduled_date: { equals: new Date(today!) },
        ...(technicianId ? { technician_id: technicianId } : {}),
      },
      include: { workOrder: { include: { account: true, location: true } } },
      orderBy: [{ priority: 'desc' }, { scheduled_start_time: 'asc' }],
    });

    return jobs.map((job) => ({
      id: job.id,
      status: job.status,
      priority: job.priority,
      scheduled_date: job.scheduled_date,
      time_window: { start: job.scheduled_start_time, end: job.scheduled_end_time },
      customer: { 
        id: job.workOrder.account?.id || '', 
        name: job.workOrder.account?.name || 'Unknown Customer', 
        type: job.workOrder.account?.account_type || 'unknown' 
      },
      location: {
        id: job.workOrder.location?.id || '',
        name: job.workOrder.location?.name || '',
        address: job.workOrder.location ? `${job.workOrder.location.address_line1}, ${job.workOrder.location.city}, ${job.workOrder.location.state}` : '',
        coordinates: { lat: job.workOrder.location?.latitude || 0, lng: job.workOrder.location?.longitude || 0 },
      },
      service: {
        type: job.workOrder.service_type,
        description: job.workOrder.description,
        estimated_duration: job.workOrder.estimated_duration,
        price: job.workOrder.service_price,
        special_instructions: job.workOrder.special_instructions,
      },
      technician_id: job.technician_id,
      actual_times: { started_at: job.actual_start_time, completed_at: job.actual_end_time },
      completion_data: { notes: job.completion_notes, signature: job.customer_signature, photos: job.photos, chemicals_used: job.chemicals_used },
    }));
  }

  async getJobById(jobId: string, tenantId: string) {
    const job = await this.db.job.findFirst({
      where: { id: jobId, tenant_id: tenantId },
      include: { workOrder: { include: { account: true, location: true } } },
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async assignJob(dto: AssignJobDto, tenantId: string) {
    const job = await this.db.job.findFirst({ where: { id: dto.job_id, tenant_id: tenantId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== JobStatus.UNASSIGNED) throw new BadRequestException('Job is already assigned or completed');

    const updated = await this.db.job.update({
      where: { id: dto.job_id },
      data: {
        tenant_id: tenantId,
        technician_id: dto.technician_id,
        status: JobStatus.SCHEDULED,
        scheduled_date: new Date(dto.scheduled_date),
        scheduled_start_time: dto.time_window_start,
        scheduled_end_time: dto.time_window_end,
        updated_at: new Date(),
      },
      include: { workOrder: { include: { account: true, location: true } } },
    });

    await this.audit.log({
      tenantId,
      action: 'assigned',
      resourceType: 'job',
      resourceId: updated.id,
      afterState: {
        technicianId: dto.technician_id,
        scheduledDate: updated.scheduled_date,
        timeWindow: { start: dto.time_window_start, end: dto.time_window_end },
      },
    });

    return updated;
  }

  async createJob(dto: CreateJobDto, tenantId: string) {
    const job = await this.db.job.create({
      data: {
        tenant_id: tenantId,
        work_order_id: dto.work_order_id,
        account_id: dto.account_id,
        location_id: dto.location_id,
        scheduled_date: new Date(dto.scheduled_date),
        scheduled_start_time: dto.scheduled_start_time || null,
        scheduled_end_time: dto.scheduled_end_time || null,
        priority: dto.priority,
        technician_id: dto.technician_id || null,
        status: dto.technician_id ? JobStatus.SCHEDULED : JobStatus.UNASSIGNED,
      },
      include: { workOrder: { include: { account: true, location: true } } },
    });

    await this.audit.log({
      tenantId,
      action: 'created',
      resourceType: 'job',
      resourceId: job.id,
      afterState: {
        accountId: job.account_id,
        locationId: job.location_id,
        scheduledDate: job.scheduled_date,
        priority: job.priority,
      },
    });

    return job;
  }

  async startJob(jobId: string, gps: { lat: number; lng: number }, tenantId: string) {
    const job = await this.db.job.findFirst({ where: { id: jobId, tenant_id: tenantId } });
    if (!job) throw new NotFoundException('Job not found');
    if (![JobStatus.SCHEDULED, JobStatus.UNASSIGNED].includes(job.status as any)) {
      throw new BadRequestException('Job must be scheduled or unassigned to start');
    }

    const updated = await this.db.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.IN_PROGRESS,
        actual_start_time: new Date(),
        updated_at: new Date(),
      },
    });

    await this.audit.log({
      tenantId,
      action: 'started',
      resourceType: 'job',
      resourceId: jobId,
      afterState: { gps_location: gps, started_at: updated.actual_start_time },
    });

    return updated;
  }

  async updatePhotos(jobId: string, photos: string[], tenantId: string) {
    const job = await this.db.job.findFirst({ where: { id: jobId, tenant_id: tenantId } });
    if (!job) throw new NotFoundException('Job not found');

    const updated = await this.db.job.update({
      where: { id: jobId },
      data: { photos, updated_at: new Date() },
    });

    await this.audit.log({
      tenantId,
      action: 'photos_updated',
      resourceType: 'job',
      resourceId: jobId,
      afterState: { photosCount: photos.length },
    });

    return updated;
  }

  async completeJob(jobId: string, dto: CompleteJobDto, tenantId: string) {
    const job = await this.db.job.findFirst({ where: { id: jobId, tenant_id: tenantId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== JobStatus.IN_PROGRESS) {
      throw new BadRequestException('Job must be in progress to complete');
    }

    const completed = await this.db.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED,
        actual_end_time: new Date(),
        completion_notes: dto.notes || null,
        customer_signature: dto.signature_url || null,
        photos: dto.photos || [],
        chemicals_used: dto.chemicals_used || [],
        updated_at: new Date(),
      },
    });

    await this.audit.log({
      tenantId,
      action: 'completed',
      resourceType: 'job',
      resourceId: jobId,
      afterState: {
        notes: dto.notes,
        signature: dto.signature_url,
        photos: (dto.photos || []).length,
        chemicals_used: (dto.chemicals_used || []).length,
        completed_at: completed.actual_end_time,
      },
    });

    return completed;
  }
}
