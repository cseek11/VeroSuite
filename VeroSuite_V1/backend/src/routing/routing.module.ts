import { Module } from '@nestjs/common';
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DatabaseService } from '../common/services/database.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TechnicianService } from '../technician/technician.service';

interface RoutePoint {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  timeWindow?: { start: string; end: string };
  serviceDuration: number; // minutes
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface OptimizedRoute {
  technicianId: string;
  totalDistance: number; // miles
  totalDuration: number; // minutes
  estimatedCompletionTime: string;
  stops: Array<{
    jobId: string;
    order: number;
    estimatedArrival: string;
    estimatedDeparture: string;
    drivingTime: number;
    coordinates: { lat: number | null; lng: number | null };
    name: string;
    address: string;
  }>;
}

export class RoutingService {
  constructor(private db: DatabaseService, private techs: TechnicianService) {}

  async optimizeRoutes(tenantId: string, date: string): Promise<OptimizedRoute[]> {
    const jobs = await this.db.job.findMany({
      where: {
        tenant_id: tenantId,
        scheduled_date: new Date(date),
        status: { in: ['unassigned', 'scheduled'] },
      },
      include: { work_order: { include: { location: true, account: true } } },
    });

    const technicians = await this.techs.getAvailableTechnicians(tenantId, date);

    const routes: OptimizedRoute[] = [];

    for (const tech of technicians) {
      const availableJobs = jobs.filter((j) => !j.technician_id || j.technician_id === tech.id);
      if (availableJobs.length === 0) continue;

      const points: RoutePoint[] = availableJobs.map((j) => ({
        id: j.id,
        name: `${j.work_order.account.name} - ${j.work_order.location.name}`,
        address: `${j.work_order.location.address_line1}, ${j.work_order.location.city}, ${j.work_order.location.state}`,
        coordinates: {
          lat: Number(j.work_order.location.latitude) || 40.4406,
          lng: Number(j.work_order.location.longitude) || -79.9959,
        },
        timeWindow: { start: j.scheduled_start_time || '08:00', end: j.scheduled_end_time || '17:00' },
        serviceDuration: j.work_order.estimated_duration,
        priority: (j.priority as any) || 'medium',
      }));

      const optimized = this.optimize(points, tech.id, availableJobs);
      routes.push(optimized);

      for (const stop of optimized.stops) {
        await this.db.job.update({
          where: { id: stop.jobId },
          data: {
            technician_id: tech.id,
            status: 'scheduled',
            scheduled_start_time: stop.estimatedArrival,
            scheduled_end_time: stop.estimatedDeparture,
          },
        });
      }
    }

    return routes;
  }

  private optimize(points: RoutePoint[], technicianId: string, jobs: any[]): OptimizedRoute {
    if (points.length === 0) {
      return { technicianId, totalDistance: 0, totalDuration: 0, estimatedCompletionTime: '08:00', stops: [] };
    }

    const priorityWeight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
    const sorted = [...points].sort((a, b) => {
      const d = (priorityWeight[b.priority] || 2) - (priorityWeight[a.priority] || 2);
      if (d !== 0) return d;
      return a.timeWindow!.start.localeCompare(b.timeWindow!.start);
    });

    let t = 8 * 60; // 8:00 AM
    let totalDistance = 0;

    const stops = sorted.map((p, i) => {
      const job = jobs.find((j) => j.id === p.id);
      const loc = job?.work_order?.location;
      const drivingTime = i === 0 ? 15 : 20;
      const distance = i === 0 ? 5 : 8;
      t += drivingTime;
      totalDistance += distance;
      const arrival = this.minutesToTime(t);
      t += p.serviceDuration;
      const departure = this.minutesToTime(t);
      return {
        jobId: p.id,
        order: i + 1,
        estimatedArrival: arrival,
        estimatedDeparture: departure,
        drivingTime,
        coordinates: { lat: loc?.latitude ?? null, lng: loc?.longitude ?? null },
        name: `${job?.work_order?.account?.name || ''} - ${loc?.name || ''}`.trim(),
        address: `${loc?.address_line1 || ''}, ${loc?.city || ''}, ${loc?.state || ''}`,
      };
    });

    return { technicianId, totalDistance: Math.round(totalDistance), totalDuration: t - 8 * 60, estimatedCompletionTime: this.minutesToTime(t), stops };
  }

  private minutesToTime(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
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
  async optimize(@Query('date') date: string, @Request() req: any) {
    return this.routing.optimizeRoutes(req.user.tenantId, date);
  }
}

@Module({
  providers: [RoutingService, DatabaseService, TechnicianService],
  controllers: [RoutingController],
})
export class RoutingModule {}
