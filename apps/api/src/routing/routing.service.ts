import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';

@Injectable()
export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);

  constructor(private db: DatabaseService) {}

  async getRoutes(tenantId: string, date?: string) {
    this.logger.log(`Fetching routes for tenant ${tenantId} on ${date || 'all dates'}`);
    
    try {
      const whereClause: any = { tenant_id: tenantId };
      
      if (date) {
        whereClause.scheduled_date = new Date(date);
      }

      const jobs = await this.db.job.findMany({
        where: whereClause,
        include: {
          workOrder: {
            include: {
              location: true,
              account: true
            }
          }
        },
        orderBy: [
          { scheduled_date: 'asc' },
          { scheduled_start_time: 'asc' }
        ]
      });

      // Group jobs by technician
      const routesByTechnician = new Map<string, any[]>();
      
      jobs.forEach(job => {
        const technicianId = job.technician_id || 'unassigned';
        
        if (!routesByTechnician.has(technicianId)) {
          routesByTechnician.set(technicianId, []);
        }
        
        routesByTechnician.get(technicianId)!.push({
          id: job.id,
          customer: job.workOrder.account?.name || 'Unknown Customer',
          location: job.workOrder.location?.address_line1 || 'Unknown Location',
          coordinates: {
            lat: job.workOrder.location?.latitude || 0,
            lng: job.workOrder.location?.longitude || 0
          },
          scheduled_time: job.scheduled_start_time,
          estimated_duration: job.workOrder.estimated_duration || 60,
          priority: job.priority,
          status: job.status
        });
      });

      // Convert to route format
      const routes = Array.from(routesByTechnician.entries()).map(([technicianId, stops]) => {
        const technician = technicianId === 'unassigned' 
          ? { id: 'unassigned', name: 'Unassigned' }
          : { id: technicianId, name: `Technician ${technicianId}` };

        return {
          id: `route-${technicianId}`,
          technicianId: technician.id,
          technicianName: technician.name,
          date: date || new Date().toISOString().split('T')[0],
          stops: stops,
          totalJobs: stops.length,
          estimatedDuration: stops.reduce((total, stop) => total + (stop.estimated_duration || 60), 0),
          totalDistance: this.calculateTotalDistance(stops)
        };
      });

      return routes;
    } catch (error) {
      this.logger.error(`Failed to fetch routes: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  async optimizeRoute(tenantId: string, technicianId: string, date: string) {
    this.logger.log(`Optimizing route for technician ${technicianId} on ${date}`);
    
    try {
      const jobs = await this.db.job.findMany({
        where: {
          tenant_id: tenantId,
          technician_id: technicianId,
          scheduled_date: new Date(date)
        },
        include: {
          workOrder: {
            include: {
              location: true,
              account: true
            }
          }
        }
      });

      if (jobs.length === 0) {
        return {
          technicianId,
          date,
          stops: [],
          totalDistance: 0,
          optimized: false
        };
      }

      // Simple optimization: sort by priority and time
      const optimizedStops = jobs
        .sort((a, b) => {
          // First by priority
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority;
          }
          
          // Then by scheduled time
          return (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || '');
        })
        .map(job => ({
          id: job.id,
          customer: job.workOrder.account?.name || 'Unknown Customer',
          location: job.workOrder.location?.address_line1 || 'Unknown Location',
          coordinates: {
            lat: job.workOrder.location?.latitude || 0,
            lng: job.workOrder.location?.longitude || 0
          },
          scheduled_time: job.scheduled_start_time,
          estimated_duration: job.workOrder.estimated_duration || 60,
          priority: job.priority,
          status: job.status
        }));

      return {
        technicianId,
        date,
        stops: optimizedStops,
        totalDistance: this.calculateTotalDistance(optimizedStops),
        optimized: true,
        optimizationMethod: 'priority_and_time_based'
      };
    } catch (error) {
      this.logger.error(`Failed to optimize route: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  async getRouteMetrics(tenantId: string, startDate: string, endDate: string) {
    this.logger.log(`Fetching route metrics from ${startDate} to ${endDate}`);
    
    try {
      const jobs = await this.db.job.findMany({
        where: {
          tenant_id: tenantId,
          scheduled_date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: {
          workOrder: {
            include: {
              location: true
            }
          }
        }
      });

      const metrics = {
        totalJobs: jobs.length,
        completedJobs: jobs.filter(job => job.status === 'completed').length,
        onTimeJobs: jobs.filter(job => {
          if (job.status !== 'completed' || !job.actual_end_time || !job.scheduled_end_time) {
            return false;
          }
          return new Date(job.actual_end_time) <= new Date(`${job.scheduled_date}T${job.scheduled_end_time}`);
        }).length,
        averageJobDuration: this.calculateAverageJobDuration(jobs),
        totalDistance: this.calculateTotalDistanceForJobs(jobs),
        technicianUtilization: this.calculateTechnicianUtilization(jobs)
      };

      return metrics;
    } catch (error) {
      this.logger.error(`Failed to fetch route metrics: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  private calculateTotalDistance(stops: any[]): number {
    if (stops.length < 2) return 0;
    
    // Simple distance calculation (Haversine formula approximation)
    let totalDistance = 0;
    
    for (let i = 0; i < stops.length - 1; i++) {
      const stop1 = stops[i];
      const stop2 = stops[i + 1];
      
      const distance = this.calculateDistance(
        stop1.coordinates.lat,
        stop1.coordinates.lng,
        stop2.coordinates.lat,
        stop2.coordinates.lng
      );
      
      totalDistance += distance;
    }
    
    return Math.round(totalDistance * 100) / 100; // Round to 2 decimal places
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private calculateAverageJobDuration(jobs: any[]): number {
    const completedJobs = jobs.filter(job => 
      job.status === 'completed' && 
      job.actual_start_time && 
      job.actual_end_time
    );
    
    if (completedJobs.length === 0) return 0;
    
    const totalDuration = completedJobs.reduce((total, job) => {
      const start = new Date(job.actual_start_time);
      const end = new Date(job.actual_end_time);
      return total + (end.getTime() - start.getTime()) / (1000 * 60); // Duration in minutes
    }, 0);
    
    return Math.round(totalDuration / completedJobs.length);
  }

  private calculateTotalDistanceForJobs(jobs: any[]): number {
    const jobsWithCoordinates = jobs.filter(job => 
      job.workOrder.location?.latitude && 
      job.workOrder.location?.longitude
    );
    
    if (jobsWithCoordinates.length < 2) return 0;
    
    return this.calculateTotalDistance(jobsWithCoordinates.map(job => ({
      coordinates: {
        lat: job.workOrder.location.latitude,
        lng: job.workOrder.location.longitude
      }
    })));
  }

  private calculateTechnicianUtilization(jobs: any[]): Record<string, number> {
    const technicianJobs = new Map<string, any[]>();
    
    jobs.forEach(job => {
      if (job.technician_id) {
        if (!technicianJobs.has(job.technician_id)) {
          technicianJobs.set(job.technician_id, []);
        }
        technicianJobs.get(job.technician_id)!.push(job);
      }
    });
    
    const utilization: Record<string, number> = {};
    
    technicianJobs.forEach((techJobs, technicianId) => {
      const completedJobs = techJobs.filter(job => job.status === 'completed');
      utilization[technicianId] = Math.round((completedJobs.length / techJobs.length) * 100);
    });
    
    return utilization;
  }
}
