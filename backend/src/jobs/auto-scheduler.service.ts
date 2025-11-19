import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { JobsService } from './jobs.service';
import { TechnicianService } from '../technician/technician.service';
import {
  RouteOptimizationEngine,
  RouteJob,
  RouteTechnician,
  OptimizationResult,
} from '../routing/route-optimization.engine';
import { JobStatus } from './dto';

export interface AutoScheduleOptions {
  date?: string; // YYYY-MM-DD format, defaults to today
  strategy?: 'balanced' | 'priority-first' | 'distance-first';
  respectTimeWindows?: boolean;
  allowOverbook?: boolean;
  commit?: boolean; // Whether to actually assign jobs (default: false for safety)
}

export interface AutoScheduleResult {
  date: string;
  totalUnassignedJobs: number;
  optimizedJobs: number;
  unassignedJobs: number;
  assignments: Array<{
    technicianId: string;
    technicianName: string;
    assignedJobs: number;
    jobIds: string[];
  }>;
  metadata: {
    totalDistanceMiles: number;
    totalTravelMinutes: number;
    totalServiceMinutes: number;
  };
  commitApplied: boolean;
  warnings: string[];
}

@Injectable()
export class AutoSchedulerService {
  private readonly logger = new Logger(AutoSchedulerService.name);
  private readonly optimizationEngine = new RouteOptimizationEngine();

  constructor(
    private readonly db: DatabaseService,
    private readonly jobsService: JobsService,
    private readonly technicianService: TechnicianService,
  ) {}

  /**
   * Automatically schedule unassigned jobs for a given date
   * Uses route optimization engine to assign jobs to technicians
   */
  async autoSchedule(
    tenantId: string,
    options: AutoScheduleOptions = {},
  ): Promise<AutoScheduleResult> {
    try {
      const targetDate = options.date
        ? this.parseDate(options.date)
        : new Date();
      const dateStr = targetDate.toISOString().split('T')[0];

      this.logger.log(`Starting auto-scheduling for tenant ${tenantId} on ${dateStr}`, {
        tenantId,
        date: dateStr,
        strategy: options.strategy ?? 'balanced',
        commit: options.commit ?? false,
      });

      // Get unassigned jobs for the date
      const unassignedJobs = await this.getUnassignedJobs(tenantId, targetDate);
      
      if (unassignedJobs.length === 0) {
        this.logger.log(`No unassigned jobs found for ${dateStr}`, { tenantId, date: dateStr });
        return {
          date: dateStr,
          totalUnassignedJobs: 0,
          optimizedJobs: 0,
          unassignedJobs: 0,
          assignments: [],
          metadata: {
            totalDistanceMiles: 0,
            totalTravelMinutes: 0,
            totalServiceMinutes: 0,
          },
          commitApplied: false,
          warnings: [],
        };
      }

      // Get available technicians
      const technicians = await this.getAvailableTechnicians(tenantId, dateStr);
      
      if (technicians.length === 0) {
        const warning = `No available technicians found for ${dateStr}`;
        this.logger.warn(warning, { tenantId, date: dateStr });
        return {
          date: dateStr,
          totalUnassignedJobs: unassignedJobs.length,
          optimizedJobs: 0,
          unassignedJobs: unassignedJobs.length,
          assignments: [],
          metadata: {
            totalDistanceMiles: 0,
            totalTravelMinutes: 0,
            totalServiceMinutes: 0,
          },
          commitApplied: false,
          warnings: [warning],
        };
      }

      // Convert to route optimization format
      const routeJobs = this.convertJobsToRouteJobs(unassignedJobs);
      const routeTechnicians = this.convertTechniciansToRouteTechnicians(technicians, dateStr);

      // Run optimization
      const optimizationResult = this.optimizationEngine.optimize({
        jobs: routeJobs,
        technicians: routeTechnicians,
        options: {
          strategy: options.strategy,
          respectTimeWindows: options.respectTimeWindows,
          allowOverbook: options.allowOverbook,
        },
      });

      // Commit assignments if requested
      let commitApplied = false;
      if (options.commit) {
        commitApplied = await this.commitAssignments(
          tenantId,
          targetDate,
          optimizationResult,
          unassignedJobs,
        );
      }

      const result: AutoScheduleResult = {
        date: dateStr,
        totalUnassignedJobs: unassignedJobs.length,
        optimizedJobs: optimizationResult.metadata.optimizedJobs,
        unassignedJobs: optimizationResult.unassignedJobs.length,
        assignments: optimizationResult.routes.map((route) => ({
          technicianId: route.technicianId,
          technicianName: route.technicianName,
          assignedJobs: route.stops.length,
          jobIds: route.stops.map((stop) => stop.jobId),
        })),
        metadata: {
          totalDistanceMiles: optimizationResult.metadata.totalDistanceMiles,
          totalTravelMinutes: optimizationResult.metadata.totalTravelMinutes,
          totalServiceMinutes: optimizationResult.metadata.totalServiceMinutes,
        },
        commitApplied,
        warnings: optimizationResult.routes.flatMap((route) => route.warnings || []),
      };

      this.logger.log(`Auto-scheduling complete for ${dateStr}`, {
        tenantId,
        date: dateStr,
        totalUnassigned: unassignedJobs.length,
        optimized: result.optimizedJobs,
        unassigned: result.unassignedJobs,
        commitApplied,
      });

      return result;
    } catch (error) {
      this.logger.error(
        `Auto-scheduling failed for tenant ${tenantId}`,
        (error as Error).stack,
        {
          tenantId,
          date: options.date,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to auto-schedule jobs');
    }
  }

  /**
   * Get unassigned jobs for a specific date
   */
  private async getUnassignedJobs(tenantId: string, date: Date) {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const jobs = await this.db.job.findMany({
      where: {
        tenant_id: tenantId,
        scheduled_date: {
          gte: dateStart,
          lte: dateEnd,
        },
        status: JobStatus.UNASSIGNED,
        technician_id: null,
      },
      include: {
        workOrder: {
          include: {
            location: true,
            account: true,
            serviceType: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { scheduled_start_time: 'asc' },
      ],
    });

    return jobs;
  }

  /**
   * Get available technicians for a date
   */
  private async getAvailableTechnicians(tenantId: string, date: string) {
    try {
      // Get all active technicians
      const technicians = await this.technicianService.getAvailableTechnicians(
        tenantId,
        date,
        '00:00',
        '23:59',
      );

      // Filter to only available ones
      return technicians.filter((tech) => tech.is_available);
    } catch (error) {
      // Fallback: get basic available technicians
      this.logger.warn('Error getting detailed availability, using basic method', {
        tenantId,
        date,
        error: error instanceof Error ? error.message : String(error),
      });
      
      return await this.technicianService.getAvailableTechniciansBasic(tenantId, date);
    }
  }

  /**
   * Convert database jobs to RouteJob format
   */
  private convertJobsToRouteJobs(jobs: any[]): RouteJob[] {
    return jobs.map((job) => {
      const location = job.workOrder?.location;
      const hasValidCoords =
        location?.latitude != null &&
        location?.longitude != null &&
        !isNaN(Number(location.latitude)) &&
        !isNaN(Number(location.longitude));

      // Determine required skills from service type
      const requiredSkills: string[] = [];
      if (job.workOrder?.serviceType?.service_name) {
        requiredSkills.push(job.workOrder.serviceType.service_name.toLowerCase());
      }

      // Calculate service duration from work order or default
      const estimatedDuration = job.workOrder?.estimated_duration || 60; // Default 60 minutes

      // Parse time window
      let timeWindow: { startMinutes: number; endMinutes: number } | undefined;
      if (job.scheduled_start_time && job.scheduled_end_time) {
        timeWindow = {
          startMinutes: this.timeToMinutes(job.scheduled_start_time),
          endMinutes: this.timeToMinutes(job.scheduled_end_time),
        };
      }

      return {
        id: job.id,
        priority: (job.priority as 'low' | 'medium' | 'high' | 'urgent') || 'medium',
        serviceDurationMinutes: estimatedDuration,
        location: {
          lat: hasValidCoords ? Number(location.latitude) : 0,
          lng: hasValidCoords ? Number(location.longitude) : 0,
          valid: hasValidCoords,
        },
        timeWindow,
        requiredSkills,
        accountName: job.workOrder?.account?.name,
        address: location
          ? `${location.address_line1 || ''}, ${location.city || ''}, ${location.state || ''}`.trim()
          : undefined,
      };
    });
  }

  /**
   * Convert technicians to RouteTechnician format
   */
  private convertTechniciansToRouteTechnicians(
    technicians: any[],
    date: string,
  ): RouteTechnician[] {
    // Default shift: 8 AM to 5 PM
    const defaultShiftStart = 8 * 60; // 8:00 AM in minutes
    const defaultShiftEnd = 17 * 60; // 5:00 PM in minutes

    return technicians.map((tech) => {
      // Get skills from technician (if available)
      const skills: string[] = tech.skills || ['general'];

      // Default start location (can be enhanced with actual technician location)
      const startLocation = {
        lat: 0, // TODO: Get from technician profile or last known location
        lng: 0,
      };

      return {
        id: tech.id || tech.user_id,
        name: tech.name || `${tech.first_name || ''} ${tech.last_name || ''}`.trim() || 'Unknown',
        skills,
        shiftStartMinutes: defaultShiftStart,
        shiftEndMinutes: defaultShiftEnd,
        startLocation,
      };
    });
  }

  /**
   * Commit optimized assignments to database
   */
  private async commitAssignments(
    tenantId: string,
    date: Date,
    optimizationResult: OptimizationResult,
    originalJobs: any[],
  ): Promise<boolean> {
    try {
      const jobMap = new Map(originalJobs.map((job) => [job.id, job]));

      // Use transaction to ensure atomicity
      await this.db.$transaction(async (tx) => {
        for (const route of optimizationResult.routes) {
          let currentTime = route.stops[0]?.arrivalMinutes || 8 * 60; // Default 8 AM

          for (const stop of route.stops) {
            const job = jobMap.get(stop.jobId);
            if (!job) {
              this.logger.warn(`Job ${stop.jobId} not found in original jobs`, {
                tenantId,
                jobId: stop.jobId,
              });
              continue;
            }

            // Calculate scheduled times from stop times
            const scheduledStartTime = this.minutesToTime(stop.arrivalMinutes);
            const scheduledEndTime = this.minutesToTime(stop.departureMinutes);

            // Update job assignment
            await tx.job.update({
              where: { id: stop.jobId },
              data: {
                technician_id: route.technicianId,
                status: JobStatus.SCHEDULED,
                scheduled_start_time: scheduledStartTime,
                scheduled_end_time: scheduledEndTime,
                updated_at: new Date(),
              },
            });

            currentTime = stop.departureMinutes;
          }
        }
      });

      this.logger.log(`Committed ${optimizationResult.metadata.optimizedJobs} job assignments`, {
        tenantId,
        date: date.toISOString().split('T')[0],
        assignedJobs: optimizationResult.metadata.optimizedJobs,
      });

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to commit assignments`,
        (error as Error).stack,
        {
          tenantId,
          date: date.toISOString().split('T')[0],
          error: error instanceof Error ? error.message : String(error),
        },
      );
      throw new InternalServerErrorException('Failed to commit job assignments');
    }
  }

  /**
   * Parse date string (YYYY-MM-DD) to Date object
   */
  private parseDate(dateStr: string): Date {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }
    return parsed;
  }

  /**
   * Convert time string (HH:MM) to minutes since midnight
   */
  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return 0;
    }
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes since midnight to time string (HH:MM)
   */
  private minutesToTime(minutes: number): string {
    const hrs = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}`;
  }
}


