import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Module,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from '../common/services/database.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TechnicianService } from '../technician/technician.service';
import {
  OptimizationResult,
  RouteJob,
  RouteOptimizationEngine,
  RouteTechnician,
} from './route-optimization.engine';

interface OptimizeRoutesOptions {
  strategy?: 'balanced' | 'priority-first' | 'distance-first';
  commit?: boolean;
  respectTimeWindows?: boolean;
  allowOverbook?: boolean;
}

interface OptimizeRoutesResponse extends OptimizationResult {
  date: string;
  strategy: 'balanced' | 'priority-first' | 'distance-first';
  commitApplied: boolean;
}

export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);
  private readonly optimizationEngine = new RouteOptimizationEngine();

  constructor(private db: DatabaseService, private techs: TechnicianService) {}

  async optimizeRoutes(
    tenantId: string,
    date: string,
    options?: OptimizeRoutesOptions,
  ): Promise<OptimizeRoutesResponse> {
    this.logger.log(`Starting route optimization`, {
      tenantId,
      date,
      strategy: options?.strategy ?? 'balanced',
      commit: options?.commit ?? false,
    });

    try {
      const scheduledDate = this.parseDate(date);

      const [jobs, technicianProfiles, technicianSkills] = await Promise.all([
        this.db.job.findMany({
          where: {
            tenant_id: tenantId,
            scheduled_date: scheduledDate,
            status: { in: ['unassigned', 'scheduled'] },
          },
          include: {
            workOrder: {
              include: {
                location: true,
                account: true,
              },
            },
          },
        }),
        this.techs.getAvailableTechniciansBasic(tenantId, date),
        this.db.technicianSkill.findMany({
          where: { tenant_id: tenantId, is_active: true },
          include: { serviceType: true },
        }),
      ]);

      if (!jobs.length) {
        return {
          date,
          strategy: (options?.strategy ?? 'balanced'),
          commitApplied: false,
          routes: [],
          unassignedJobs: [],
          metadata: {
            totalJobs: 0,
            optimizedJobs: 0,
            totalDistanceMiles: 0,
            totalTravelMinutes: 0,
            totalServiceMinutes: 0,
          },
        };
      }

      const routeJobs = this.mapJobsToRouteJobs(jobs);
      const routeTechnicians = this.mapTechniciansToRouteTechnicians(
        technicianProfiles,
        technicianSkills,
        routeJobs,
      );

      if (!routeTechnicians.length) {
        throw new BadRequestException('No active technicians available for optimization.');
      }

      const result = this.optimizationEngine.optimize({
        jobs: routeJobs,
        technicians: routeTechnicians,
        options: {
          strategy: options?.strategy,
          respectTimeWindows: options?.respectTimeWindows,
          allowOverbook: options?.allowOverbook,
        },
      });

      if (options?.commit) {
        await this.commitOptimizedRoutes(tenantId, scheduledDate, result.routes);
      }

      this.logger.log(`Route optimization complete`, {
        tenantId,
        date,
        strategy: options?.strategy ?? 'balanced',
        optimizedJobs: result.metadata.optimizedJobs,
        unassignedJobs: result.unassignedJobs.length,
        commitApplied: options?.commit ?? false,
      });

      return {
        date,
        strategy: options?.strategy ?? 'balanced',
        commitApplied: Boolean(options?.commit),
        ...result,
      };
    } catch (error) {
      this.logger.error(
        `Route optimization failed for tenant ${tenantId} on ${date}`,
        (error as Error).stack,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to optimize routes');
    }
  }

  private parseDate(date: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Date must be formatted as YYYY-MM-DD');
    }
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid date provided');
    }
    return parsed;
  }

  private mapJobsToRouteJobs(jobs: Array<any>): RouteJob[] {
    const fallbackCoordinates = this.getFallbackCoordinates(jobs);

    return jobs.map((job) => {
      const lat = Number(job.workOrder?.location?.latitude ?? fallbackCoordinates.lat);
      const lng = Number(job.workOrder?.location?.longitude ?? fallbackCoordinates.lng);
      const valid = Number.isFinite(lat) && Number.isFinite(lng);
      const timeWindow =
        job.scheduled_start_time && job.scheduled_end_time
          ? {
              startMinutes: this.timeToMinutes(job.scheduled_start_time),
              endMinutes: this.timeToMinutes(job.scheduled_end_time),
            }
          : undefined;

      return {
        id: job.id,
        priority: (job.priority as 'low' | 'medium' | 'high' | 'urgent') ?? 'medium',
        serviceDurationMinutes: job.workOrder?.estimated_duration ?? 60,
        location: {
          lat: valid ? lat : fallbackCoordinates.lat,
          lng: valid ? lng : fallbackCoordinates.lng,
          valid,
        },
        timeWindow,
        requiredSkills: job.workOrder?.service_type
          ? [job.workOrder.service_type.toLowerCase()]
          : [],
        accountName: job.workOrder?.account?.name,
        address: job.workOrder?.location
          ? `${job.workOrder.location.address_line1 ?? ''}, ${job.workOrder.location.city ?? ''}, ${
              job.workOrder.location.state ?? ''
            }`.replace(/\s+,/g, ',')
          : undefined,
      };
    });
  }

  private mapTechniciansToRouteTechnicians(
    technicians: Array<any>,
    technicianSkills: Array<any>,
    jobs: RouteJob[],
  ): RouteTechnician[] {
    const fallback = this.getFallbackCoordinates(jobs);
    const skillByTechnician = new Map<string, Set<string>>();

    technicianSkills.forEach((skill) => {
      const key = skill.technician_id;
      if (!skillByTechnician.has(key)) {
        skillByTechnician.set(key, new Set());
      }
      if (skill.serviceType?.service_name) {
        skillByTechnician.get(key)!.add(skill.serviceType.service_name.toLowerCase());
      }
    });

    return technicians.map((technician) => {
      const skills = skillByTechnician.get(technician.id);
      return {
        id: technician.id,
        name: technician.name ?? 'Unknown Technician',
        skills: skills ? Array.from(skills) : ['general'],
        shiftStartMinutes: 8 * 60,
        shiftEndMinutes: 18 * 60,
        startLocation: {
          lat: fallback.lat,
          lng: fallback.lng,
        },
      };
    });
  }

  private async commitOptimizedRoutes(
    tenantId: string,
    date: Date,
    routes: OptimizationResult['routes'],
  ): Promise<void> {
    const updates = routes.flatMap((route) =>
      route.stops.map((stop) =>
        this.db.job.update({
          where: { id: stop.jobId },
          data: {
            tenant_id: tenantId,
            technician_id: route.technicianId,
            status: 'scheduled',
            scheduled_date: date,
            scheduled_start_time: stop.arrivalTime,
            scheduled_end_time: stop.departureTime,
          },
        }),
      ),
    );

    if (!updates.length) {
      return;
    }

    await this.db.$transaction(updates);
  }

  private getFallbackCoordinates(jobs: RouteJob[] | Array<any>): { lat: number; lng: number } {
    const coordinates = jobs
      .map((job: any) => {
        const lat =
          typeof job.location === 'object'
            ? job.location.lat
            : Number(job.workOrder?.location?.latitude);
        const lng =
          typeof job.location === 'object'
            ? job.location.lng
            : Number(job.workOrder?.location?.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return { lat, lng };
        }
        return null;
      })
      .filter((value): value is { lat: number; lng: number } => value !== null);

    if (!coordinates.length) {
      return { lat: 0, lng: 0 };
    }

    const avgLat = coordinates.reduce((sum, item) => sum + item.lat, 0) / coordinates.length;
    const avgLng = coordinates.reduce((sum, item) => sum + item.lng, 0) / coordinates.length;
    return { lat: avgLat, lng: avgLng };
  }

  private timeToMinutes(value?: string | null): number {
    if (!value || !/^\d{2}:\d{2}$/.test(value)) {
      return 0;
    }
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

@ApiTags('Routing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/routing')
export class RoutingController {
  constructor(private readonly routing: RoutingService) {}

  @Get('optimize')
  @ApiOperation({ summary: 'Optimize routes for a given date' })
  @ApiQuery({ name: 'date', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({
    name: 'strategy',
    required: false,
    description: 'Optimization strategy (balanced | priority-first | distance-first)',
  })
  @ApiQuery({
    name: 'commit',
    required: false,
    description: 'Persist optimized assignments (true|false)',
  })
  async optimize(
    @Query('date') date: string,
    @Query('strategy') strategy?: string,
    @Query('commit') commit?: string,
    @Request() req: any,
  ) {
    const parsedStrategy = this.parseStrategy(strategy);
    const commitFlag = commit === 'true' || commit === '1';

    return this.routing.optimizeRoutes(req.user.tenantId, date, {
      strategy: parsedStrategy,
      commit: commitFlag,
    });
  }

  private parseStrategy(
    strategy?: string,
  ): 'balanced' | 'priority-first' | 'distance-first' | undefined {
    if (!strategy) {
      return undefined;
    }
    if (['balanced', 'priority-first', 'distance-first'].includes(strategy)) {
      return strategy as 'balanced' | 'priority-first' | 'distance-first';
    }
    throw new BadRequestException(
      'Strategy must be one of balanced, priority-first, or distance-first',
    );
  }
}

@Module({
  providers: [RoutingService, DatabaseService, TechnicianService],
  controllers: [RoutingController],
})
export class RoutingModule {}
