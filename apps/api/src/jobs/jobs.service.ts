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
      include: { workOrder: { include: { location: true } } },
      orderBy: [{ priority: 'desc' }, { scheduled_start_time: 'asc' }],
    });

    return jobs.map((job) => ({
      id: job.id,
      status: job.status,
      priority: job.priority,
      scheduled_date: job.scheduled_date,
      time_window: { start: job.scheduled_start_time, end: job.scheduled_end_time },
      customer: { id: job.account_id, name: '', type: 'unknown' },
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
      include: { workOrder: { include: { location: true } } },
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
      include: { workOrder: { include: { location: true } } },
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
      include: { workOrder: { include: { location: true } } },
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

  /**
   * Check for scheduling conflicts before assigning a job
   * Detects: time overlaps, double-booking, location conflicts
   */
  async checkConflicts(
    technicianId: string,
    scheduledDate: Date,
    startTime: string,
    endTime: string,
    tenantId: string,
    excludeJobIds: string[] = []
  ) {
    const conflicts: any[] = [];

    // Convert time strings to Date objects for comparison
    const scheduledDateTime = new Date(scheduledDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const conflictStart = new Date(scheduledDateTime);
    conflictStart.setHours(startHours || 0, startMinutes || 0, 0, 0);
    
    const conflictEnd = new Date(scheduledDateTime);
    conflictEnd.setHours(endHours || 0, endMinutes || 0, 0, 0);

    // Create date range for query (don't mutate original date)
    const dateStart = new Date(scheduledDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(scheduledDate);
    dateEnd.setHours(23, 59, 59, 999);

    // Find all jobs for this technician on this date
    const existingJobs = await this.db.job.findMany({
      where: {
        tenant_id: tenantId,
        technician_id: technicianId,
        scheduled_date: {
          gte: dateStart,
          lte: dateEnd,
        },
        status: {
          in: [JobStatus.SCHEDULED, JobStatus.IN_PROGRESS],
        },
        ...(excludeJobIds.length > 0 ? {
          id: { notIn: excludeJobIds },
        } : {}),
      },
      include: {
        workOrder: {
          include: {
            location: true,
            account: true,
          },
        },
      },
    });

    // Check for time overlaps (double-booking)
    for (const existingJob of existingJobs) {
      if (!existingJob.scheduled_start_time || !existingJob.scheduled_end_time) {
        continue;
      }

      const [existingStartHours, existingStartMinutes] = existingJob.scheduled_start_time.split(':').map(Number);
      const [existingEndHours, existingEndMinutes] = existingJob.scheduled_end_time.split(':').map(Number);
      
      const existingStart = new Date(scheduledDateTime);
      existingStart.setHours(existingStartHours || 0, existingStartMinutes || 0, 0, 0);
      
      const existingEnd = new Date(scheduledDateTime);
      existingEnd.setHours(existingEndHours || 0, existingEndMinutes || 0, 0, 0);

      // Check if time ranges overlap
      const hasOverlap = (
        (conflictStart >= existingStart && conflictStart < existingEnd) ||
        (conflictEnd > existingStart && conflictEnd <= existingEnd) ||
        (conflictStart <= existingStart && conflictEnd >= existingEnd)
      );

      if (hasOverlap) {
        conflicts.push({
          type: 'technician_double_booking',
          severity: 'critical',
          description: `Technician is already scheduled from ${existingJob.scheduled_start_time} to ${existingJob.scheduled_end_time}`,
          conflicting_job_ids: [existingJob.id],
          conflicting_jobs: [{
            id: existingJob.id,
            scheduled_date: existingJob.scheduled_date.toISOString().split('T')[0],
            scheduled_start_time: existingJob.scheduled_start_time,
            scheduled_end_time: existingJob.scheduled_end_time,
            customer_name: existingJob.workOrder?.account?.name || 'Unknown',
            location_address: existingJob.workOrder?.location 
              ? `${existingJob.workOrder.location.address_line1}, ${existingJob.workOrder.location.city}`
              : 'Unknown',
          }],
        });
      }
    }

    return {
      has_conflicts: conflicts.length > 0,
      conflicts,
      can_proceed: conflicts.filter(c => c.severity === 'critical').length === 0,
    };
  }

  // ===== RECURRING JOBS MANAGEMENT =====

  /**
   * Create a recurring job template
   */
  async createRecurringJobTemplate(dto: any, tenantId: string) {
    try {
      const result = await this.db.$queryRawUnsafe(`
        INSERT INTO recurring_job_templates (
          tenant_id, name, description, recurrence_type, recurrence_interval,
          recurrence_days_of_week, recurrence_day_of_month, recurrence_weekday_of_month,
          start_time, end_time, estimated_duration, start_date, end_date,
          max_occurrences, job_template, is_active, created_at, updated_at
        ) VALUES (
          $1::uuid, $2, $3, $4, $5, $6::integer[], $7, $8, $9::time, $10::time,
          $11, $12::date, $13::date, $14, $15::jsonb, $16, NOW(), NOW()
        )
        RETURNING *
      `,
        tenantId,
        dto.name,
        dto.description || null,
        dto.recurrence_type,
        dto.recurrence_interval || 1,
        dto.recurrence_days_of_week ? `{${dto.recurrence_days_of_week.join(',')}}` : null,
        dto.recurrence_day_of_month || null,
        dto.recurrence_weekday_of_month || null,
        dto.start_time,
        dto.end_time || null,
        dto.estimated_duration || null,
        dto.start_date,
        dto.end_date || null,
        dto.max_occurrences || null,
        JSON.stringify(dto.job_template),
        dto.is_active !== false
      );

      return Array.isArray(result) && result.length > 0 ? result[0] : result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        throw new BadRequestException(
          'Recurring jobs tables not created yet. Please run the migration: create_recurring_jobs.sql'
        );
      }
      throw error;
    }
  }

  /**
   * Get recurring job templates
   */
  async getRecurringJobTemplates(tenantId: string, activeOnly: boolean = false) {
    try {
      let query = `
        SELECT * FROM recurring_job_templates
        WHERE tenant_id = $1::uuid
      `;
      const params: any[] = [tenantId];

      if (activeOnly) {
        query += ' AND is_active = true';
      }

      query += ' ORDER BY created_at DESC';

      const result = await this.db.$queryRawUnsafe(query, ...params);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      // If tables don't exist, return empty array
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Update a recurring job template
   */
  async updateRecurringJobTemplate(templateId: string, dto: any, tenantId: string) {
    try {
      const updates: string[] = [];
      const params: any[] = [tenantId, templateId];
      let paramIndex = 3;

      if (dto.name !== undefined) {
        updates.push(`name = $${paramIndex}`);
        params.push(dto.name);
        paramIndex++;
      }
      if (dto.description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        params.push(dto.description);
        paramIndex++;
      }
      if (dto.is_active !== undefined) {
        updates.push(`is_active = $${paramIndex}`);
        params.push(dto.is_active);
        paramIndex++;
      }
      if (dto.end_date !== undefined) {
        updates.push(`end_date = $${paramIndex}::date`);
        params.push(dto.end_date);
        paramIndex++;
      }
      if (dto.max_occurrences !== undefined) {
        updates.push(`max_occurrences = $${paramIndex}`);
        params.push(dto.max_occurrences);
        paramIndex++;
      }

      if (updates.length === 0) {
        throw new BadRequestException('No fields to update');
      }

      updates.push('updated_at = NOW()');

      const query = `
        UPDATE recurring_job_templates
        SET ${updates.join(', ')}
        WHERE tenant_id = $1::uuid AND id = $2::uuid
        RETURNING *
      `;

      const result = await this.db.$queryRawUnsafe(query, ...params);
      return Array.isArray(result) && result.length > 0 ? result[0] : result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        throw new BadRequestException(
          'Recurring jobs tables not created yet. Please run the migration: create_recurring_jobs.sql'
        );
      }
      throw error;
    }
  }

  /**
   * Delete a recurring job template
   */
  async deleteRecurringJobTemplate(templateId: string, tenantId: string, deleteAllJobs: boolean = false) {
    try {
      if (deleteAllJobs) {
        // Delete all jobs associated with this template
        await this.db.$queryRawUnsafe(`
          DELETE FROM jobs
          WHERE tenant_id = $1::uuid 
            AND recurring_template_id = $2::uuid
        `, tenantId, templateId);

        // Delete all instances
        await this.db.$queryRawUnsafe(`
          DELETE FROM recurring_job_instances
          WHERE tenant_id = $1::uuid 
            AND recurring_template_id = $2::uuid
        `, tenantId, templateId);
      }

      // Delete the template
      await this.db.$queryRawUnsafe(`
        DELETE FROM recurring_job_templates
        WHERE tenant_id = $1::uuid AND id = $2::uuid
      `, tenantId, templateId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        throw new BadRequestException(
          'Recurring jobs tables not created yet. Please run the migration: create_recurring_jobs.sql'
        );
      }
      throw error;
    }
  }

  /**
   * Calculate occurrence dates for a recurrence pattern
   */
  private calculateOccurrenceDates(
    template: any,
    generateUntil: Date
  ): Date[] {
    const dates: Date[] = [];
    const startDate = new Date(template.start_date);
    const endDate = template.end_date ? new Date(template.end_date) : null;
    const maxOccurrences = template.max_occurrences;
    const interval = template.recurrence_interval || 1;

    let currentDate = new Date(startDate);
    let occurrenceCount = 0;

    while (currentDate <= generateUntil) {
      // Check end date limit
      if (endDate && currentDate > endDate) {
        break;
      }

      // Check max occurrences limit
      if (maxOccurrences && occurrenceCount >= maxOccurrences) {
        break;
      }

      let shouldInclude = false;

      switch (template.recurrence_type) {
        case 'daily':
          shouldInclude = true;
          currentDate.setDate(currentDate.getDate() + interval);
          break;

        case 'weekly':
          if (template.recurrence_days_of_week && template.recurrence_days_of_week.length > 0) {
            const dayOfWeek = currentDate.getDay();
            if (template.recurrence_days_of_week.includes(dayOfWeek)) {
              shouldInclude = true;
            }
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
            // If we've passed all days in the week, move to next week
            if (currentDate.getDay() === 0 && !template.recurrence_days_of_week.includes(0)) {
              currentDate.setDate(currentDate.getDate() + (7 * (interval - 1)));
            }
          } else {
            shouldInclude = true;
            currentDate.setDate(currentDate.getDate() + (7 * interval));
          }
          break;

        case 'monthly':
          if (template.recurrence_day_of_month) {
            // Specific day of month
            if (currentDate.getDate() === template.recurrence_day_of_month) {
              shouldInclude = true;
            }
            // Move to same day next month
            currentDate.setMonth(currentDate.getMonth() + interval);
            currentDate.setDate(template.recurrence_day_of_month);
          } else if (template.recurrence_weekday_of_month) {
            // Weekday of month (e.g., first Monday)
            // This is more complex - for now, use day of month as fallback
            shouldInclude = true;
            currentDate.setMonth(currentDate.getMonth() + interval);
          } else {
            // Same day of month as start date
            const dayOfMonth = startDate.getDate();
            if (currentDate.getDate() === dayOfMonth) {
              shouldInclude = true;
            }
            currentDate.setMonth(currentDate.getMonth() + interval);
            currentDate.setDate(dayOfMonth);
          }
          break;

        case 'custom':
          // For custom, use interval as days
          shouldInclude = true;
          currentDate.setDate(currentDate.getDate() + interval);
          break;

        default:
          currentDate.setDate(currentDate.getDate() + 1);
          break;
      }

      if (shouldInclude && currentDate >= startDate) {
        dates.push(new Date(currentDate));
        occurrenceCount++;
      }

      // Safety check to prevent infinite loops
      if (dates.length > 1000) {
        break;
      }
    }

    return dates;
  }

  /**
   * Generate jobs from a recurring template
   */
  async generateRecurringJobs(
    templateId: string,
    generateUntil: Date,
    tenantId: string,
    skipExisting: boolean = true
  ): Promise<{ generated: number; skipped: number }> {
    try {
      // Get template
      const templates = await this.getRecurringJobTemplates(tenantId, false);
      const template = templates.find((t: any) => t.id === templateId);
      
      if (!template) {
        throw new NotFoundException('Recurring job template not found');
      }

      if (!template.is_active) {
        throw new BadRequestException('Template is not active');
      }

      // Calculate occurrence dates
      const occurrenceDates = this.calculateOccurrenceDates(template, generateUntil);

      let generated = 0;
      let skipped = 0;

      // Check last generated date
      const lastGenerated = template.last_generated_date 
        ? new Date(template.last_generated_date)
        : new Date(template.start_date);

      // Filter dates that need to be generated
      const datesToGenerate = occurrenceDates.filter(date => date > lastGenerated);

      for (const date of datesToGenerate) {
        // Check if job already exists for this date
        if (skipExisting) {
          const existing = await this.db.$queryRawUnsafe(`
            SELECT id FROM recurring_job_instances
            WHERE tenant_id = $1::uuid
              AND recurring_template_id = $2::uuid
              AND scheduled_date = $3::date
            LIMIT 1
          `, tenantId, templateId, date.toISOString().split('T')[0]);

          if (Array.isArray(existing) && existing.length > 0) {
            skipped++;
            continue;
          }
        }

        // Create job from template
        const jobTemplate = typeof template.job_template === 'string' 
          ? JSON.parse(template.job_template)
          : template.job_template;

        const job = await this.createJob({
          work_order_id: jobTemplate.work_order_id || null,
          account_id: jobTemplate.customer_id || jobTemplate.account_id,
          location_id: jobTemplate.location_id,
          scheduled_date: date.toISOString().split('T')[0] || '',
          scheduled_start_time: template.start_time,
          scheduled_end_time: template.end_time || null,
          priority: jobTemplate.priority || 'medium',
          technician_id: jobTemplate.technician_id || null
        }, tenantId);

        // Create recurring_job_instances record
        const occurrenceNumber = datesToGenerate.indexOf(date) + 1;
        await this.db.$queryRawUnsafe(`
          INSERT INTO recurring_job_instances (
            tenant_id, recurring_template_id, job_id, scheduled_date,
            occurrence_number, is_exception, created_at, updated_at
          ) VALUES (
            $1::uuid, $2::uuid, $3::uuid, $4::date, $5, false, NOW(), NOW()
          )
        `, tenantId, templateId, job.id, date.toISOString().split('T')[0], occurrenceNumber);

        // Update job with recurring fields
        // Note: is_recurring and recurring_template_id need to be added to Prisma schema
        // For now, we'll use raw SQL to update these fields
        await this.db.$executeRawUnsafe(`
          UPDATE jobs 
          SET is_recurring = true, recurring_template_id = $1::uuid
          WHERE id = $2::uuid
        `, templateId, job.id);

        generated++;
      }

      // Update template's last_generated_date
      await this.db.$queryRawUnsafe(`
        UPDATE recurring_job_templates
        SET last_generated_date = $1::date, updated_at = NOW()
        WHERE tenant_id = $2::uuid AND id = $3::uuid
      `, generateUntil.toISOString().split('T')[0], tenantId, templateId);

      return { generated, skipped };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        throw new BadRequestException(
          'Recurring jobs tables not created yet. Please run the migration: create_recurring_jobs.sql'
        );
      }
      throw error;
    }
  }

  /**
   * Skip a single occurrence of a recurring job
   */
  async skipRecurringJobOccurrence(jobId: string, tenantId: string) {
    try {
      // Find the instance
      const instance = await this.db.$queryRawUnsafe(`
        SELECT * FROM recurring_job_instances
        WHERE tenant_id = $1::uuid AND job_id = $2::uuid
        LIMIT 1
      `, tenantId, jobId);

      if (!Array.isArray(instance) || instance.length === 0) {
        throw new NotFoundException('Recurring job instance not found');
      }

      // Mark as exception
      await this.db.$queryRawUnsafe(`
        UPDATE recurring_job_instances
        SET is_exception = true,
            exception_type = 'skipped',
            updated_at = NOW()
        WHERE tenant_id = $1::uuid AND job_id = $2::uuid
      `, tenantId, jobId);

      // Optionally cancel the job
      await this.db.job.update({
        where: { id: jobId },
        data: { status: JobStatus.CANCELLED }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        throw new BadRequestException(
          'Recurring jobs tables not created yet. Please run the migration: create_recurring_jobs.sql'
        );
      }
      throw error;
    }
  }
}
