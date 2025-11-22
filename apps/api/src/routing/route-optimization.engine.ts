export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface RouteJob {
  id: string;
  priority: PriorityLevel;
  serviceDurationMinutes: number;
  location: {
    lat: number;
    lng: number;
    valid: boolean;
  };
  timeWindow?: {
    startMinutes: number;
    endMinutes: number;
  };
  requiredSkills: string[];
  accountName?: string;
  address?: string;
}

export interface RouteTechnician {
  id: string;
  name: string;
  skills: string[];
  shiftStartMinutes: number;
  shiftEndMinutes: number;
  startLocation: {
    lat: number;
    lng: number;
  };
}

export interface RouteStop {
  jobId: string;
  order: number;
  priority: PriorityLevel;
  arrivalTime: string;
  departureTime: string;
  arrivalMinutes: number;
  departureMinutes: number;
  travelMinutes: number;
  distanceFromPreviousMiles: number;
  serviceMinutes: number;
  accountName?: string;
  address?: string;
  warnings?: string[];
}

export interface OptimizedRoute {
  technicianId: string;
  technicianName: string;
  stops: RouteStop[];
  totalDistanceMiles: number;
  totalTravelMinutes: number;
  totalServiceMinutes: number;
  estimatedCompletionTime: string;
  warnings: string[];
}

export interface OptimizationOptions {
  strategy: 'balanced' | 'priority-first' | 'distance-first';
  respectTimeWindows: boolean;
  maxRouteMinutes: number;
  allowOverbook: boolean;
  averageTravelSpeedMph: number;
}

export interface OptimizationInput {
  jobs: RouteJob[];
  technicians: RouteTechnician[];
  options?: Partial<OptimizationOptions>;
}

export interface OptimizationResult {
  routes: OptimizedRoute[];
  unassignedJobs: RouteJob[];
  metadata: {
    totalJobs: number;
    optimizedJobs: number;
    totalDistanceMiles: number;
    totalTravelMinutes: number;
    totalServiceMinutes: number;
  };
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  strategy: 'balanced',
  respectTimeWindows: true,
  maxRouteMinutes: 12 * 60,
  allowOverbook: false,
  averageTravelSpeedMph: 28,
};

const PRIORITY_WEIGHT: Record<PriorityLevel, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export class RouteOptimizationEngine {
  optimize(input: OptimizationInput): OptimizationResult {
    const options = { ...DEFAULT_OPTIONS, ...(input.options || {}) };
    if (!input.jobs.length || !input.technicians.length) {
      return {
        routes: [],
        unassignedJobs: input.jobs,
        metadata: {
          totalJobs: input.jobs.length,
          optimizedJobs: 0,
          totalDistanceMiles: 0,
          totalTravelMinutes: 0,
          totalServiceMinutes: 0,
        },
      };
    }

    const { assignments, unassigned } = this.assignJobsToTechnicians(
      input.jobs,
      input.technicians,
      options,
    );

    const routes: OptimizedRoute[] = [];

    for (const assignment of assignments) {
      const orderedJobs = this.orderJobsForTechnician(assignment.jobs, assignment.technician);
      const stops = this.buildStops(orderedJobs, assignment.technician, options);
      const totalTravelMinutes = stops.reduce((sum, stop) => sum + stop.travelMinutes, 0);
      const totalServiceMinutes = stops.reduce((sum, stop) => sum + stop.serviceMinutes, 0);
      const totalDistanceMiles = stops.reduce(
        (sum, stop) => sum + stop.distanceFromPreviousMiles,
        0,
      );
      const estimatedCompletionMinutes =
        stops.length > 0 ? stops[stops.length - 1].departureMinutes : assignment.technician.shiftStartMinutes;

      routes.push({
        technicianId: assignment.technician.id,
        technicianName: assignment.technician.name,
        stops,
        totalDistanceMiles: Number(totalDistanceMiles.toFixed(2)),
        totalTravelMinutes: Math.round(totalTravelMinutes),
        totalServiceMinutes: Math.round(totalServiceMinutes),
        estimatedCompletionTime: this.minutesToTime(estimatedCompletionMinutes),
        warnings: stops.flatMap((stop) => stop.warnings ?? []),
      });
    }

    const totalDistanceMiles = routes.reduce((sum, route) => sum + route.totalDistanceMiles, 0);
    const totalTravelMinutes = routes.reduce((sum, route) => sum + route.totalTravelMinutes, 0);
    const totalServiceMinutes = routes.reduce((sum, route) => sum + route.totalServiceMinutes, 0);
    const optimizedJobs = routes.reduce((sum, route) => sum + route.stops.length, 0);

    return {
      routes,
      unassignedJobs: unassigned,
      metadata: {
        totalJobs: input.jobs.length,
        optimizedJobs,
        totalDistanceMiles: Number(totalDistanceMiles.toFixed(2)),
        totalTravelMinutes: Math.round(totalTravelMinutes),
        totalServiceMinutes: Math.round(totalServiceMinutes),
      },
    };
  }

  private assignJobsToTechnicians(
    jobs: RouteJob[],
    technicians: RouteTechnician[],
    options: OptimizationOptions,
  ): {
    assignments: Array<{ technician: RouteTechnician; jobs: RouteJob[] }>;
    unassigned: RouteJob[];
  } {
    const assignments = technicians.map((tech) => ({
      technician: tech,
      jobs: [] as RouteJob[],
    }));
    const unassigned: RouteJob[] = [];

    const sortedJobs = [...jobs].sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      const aStart = a.timeWindow?.startMinutes ?? 0;
      const bStart = b.timeWindow?.startMinutes ?? 0;
      return aStart - bStart;
    });

    for (const job of sortedJobs) {
      if (!job.location.valid) {
        unassigned.push(job);
        continue;
      }

      let bestAssignment: { technician: RouteTechnician; cost: number } | null = null;

      for (const assignment of assignments) {
        const technician = assignment.technician;
        const lastJob = assignment.jobs[assignment.jobs.length - 1];
        const fromLocation = lastJob?.location.valid
          ? lastJob.location
          : technician.startLocation;
        const distanceScore = this.distanceBetween(
          fromLocation.lat,
          fromLocation.lng,
          job.location.lat,
          job.location.lng,
        );
        const priorityScore = PRIORITY_WEIGHT[job.priority];
        const skillPenalty = job.requiredSkills.length
          ? job.requiredSkills.every((skill) => technician.skills.includes(skill))
            ? 0
            : 5
          : 0;
        const workloadPenalty = assignment.jobs.length * 0.25;
        const timeWindowPenalty = this.calculateTimeWindowPenalty(job, technician);

        let score = priorityScore * 2 - distanceScore * 0.05 - skillPenalty - workloadPenalty - timeWindowPenalty;

        if (options.strategy === 'distance-first') {
          score -= distanceScore * 0.1;
        } else if (options.strategy === 'priority-first') {
          score += priorityScore;
        }

        if (!bestAssignment || score > bestAssignment.cost) {
          bestAssignment = { technician, cost: score };
        }
      }

      if (!bestAssignment || bestAssignment.cost < 0) {
        unassigned.push(job);
        continue;
      }

      const targetAssignment = assignments.find(
        (assignment) => assignment.technician.id === bestAssignment!.technician.id,
      );

      if (targetAssignment) {
        targetAssignment.jobs.push(job);
      } else {
        unassigned.push(job);
      }
    }

    return { assignments, unassigned };
  }

  private orderJobsForTechnician(jobs: RouteJob[], technician: RouteTechnician): RouteJob[] {
    const remaining = [...jobs];
    const ordered: RouteJob[] = [];
    let currentLocation = technician.startLocation;
    let currentTime = technician.shiftStartMinutes;

    while (remaining.length) {
      let bestIndex = 0;
      let bestScore = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < remaining.length; i++) {
        const job = remaining[i];
        const distance = this.distanceBetween(
          currentLocation.lat,
          currentLocation.lng,
          job.location.lat,
          job.location.lng,
        );
        const travelMinutes = this.distanceToMinutes(distance);

        const arrivalTime = currentTime + travelMinutes;
        const timeWindowPenalty = job.timeWindow
          ? Math.max(0, job.timeWindow.startMinutes - arrivalTime) * 0.05
          : 0;
        const priorityScore = PRIORITY_WEIGHT[job.priority] * 5;
        const score = priorityScore - distance * 0.1 - timeWindowPenalty;

        if (score > bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      }

      const [selectedJob] = remaining.splice(bestIndex, 1);
      ordered.push(selectedJob);
      currentLocation = selectedJob.location.valid ? selectedJob.location : currentLocation;
      currentTime += selectedJob.serviceDurationMinutes;
    }

    return this.twoOptOptimization(ordered);
  }

  private twoOptOptimization(route: RouteJob[]): RouteJob[] {
    if (route.length < 3) {
      return route;
    }

    let improved = true;
    let bestRoute = [...route];

    while (improved) {
      improved = false;
      for (let i = 1; i < bestRoute.length - 1; i++) {
        for (let k = i + 1; k < bestRoute.length; k++) {
          const newRoute = this.twoOptSwap(bestRoute, i, k);
          if (this.routeDistance(newRoute) < this.routeDistance(bestRoute)) {
            bestRoute = newRoute;
            improved = true;
          }
        }
      }
    }

    return bestRoute;
  }

  private twoOptSwap(route: RouteJob[], i: number, k: number): RouteJob[] {
    return [
      ...route.slice(0, i),
      ...route.slice(i, k + 1).reverse(),
      ...route.slice(k + 1),
    ];
  }

  private routeDistance(route: RouteJob[]): number {
    let distance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      distance += this.distanceBetween(
        route[i].location.lat,
        route[i].location.lng,
        route[i + 1].location.lat,
        route[i + 1].location.lng,
      );
    }
    return distance;
  }

  private buildStops(
    jobs: RouteJob[],
    technician: RouteTechnician,
    options: OptimizationOptions,
  ): RouteStop[] {
    const stops: RouteStop[] = [];
    let currentTime = technician.shiftStartMinutes;
    let currentLocation = technician.startLocation;

    for (let index = 0; index < jobs.length; index++) {
      const job = jobs[index];
      const distance = this.distanceBetween(
        currentLocation.lat,
        currentLocation.lng,
        job.location.lat,
        job.location.lng,
      );
      const travelMinutes = this.distanceToMinutes(distance);
      currentTime += travelMinutes;

      if (job.timeWindow && options.respectTimeWindows && currentTime < job.timeWindow.startMinutes) {
        currentTime = job.timeWindow.startMinutes;
      }

      const serviceMinutes = job.serviceDurationMinutes;
      const departureTime = currentTime + serviceMinutes;
      const warnings: string[] = [];

      if (job.timeWindow && options.respectTimeWindows && departureTime > job.timeWindow.endMinutes) {
        warnings.push(
          `Time window exceeded for job ${job.id}. Scheduled departure ${this.minutesToTime(
            departureTime,
          )} past window ending ${this.minutesToTime(job.timeWindow.endMinutes)}.`,
        );
      }

      if (!options.allowOverbook && departureTime > technician.shiftEndMinutes) {
        warnings.push(
          `Route exceeds technician shift end (${this.minutesToTime(
            technician.shiftEndMinutes,
          )}). Consider reassigning.`,
        );
      }

      stops.push({
        jobId: job.id,
        order: index + 1,
        priority: job.priority,
        arrivalTime: this.minutesToTime(currentTime),
        departureTime: this.minutesToTime(departureTime),
        arrivalMinutes: currentTime,
        departureMinutes: departureTime,
        travelMinutes: Math.round(travelMinutes),
        distanceFromPreviousMiles: Number(distance.toFixed(2)),
        serviceMinutes,
        accountName: job.accountName,
        address: job.address,
        warnings: warnings.length ? warnings : undefined,
      });

      currentTime = departureTime;
      currentLocation = job.location;
    }

    return stops;
  }

  private calculateTimeWindowPenalty(job: RouteJob, technician: RouteTechnician): number {
    if (!job.timeWindow) {
      return 0;
    }
    if (
      job.timeWindow.startMinutes >= technician.shiftStartMinutes &&
      job.timeWindow.endMinutes <= technician.shiftEndMinutes
    ) {
      return 0;
    }
    return 10;
  }

  private distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; // miles
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private distanceToMinutes(distanceMiles: number): number {
    const mph = DEFAULT_OPTIONS.averageTravelSpeedMph;
    return (distanceMiles / mph) * 60;
  }

  private minutesToTime(minutes: number): string {
    const clamped = this.clampMinutes(Math.round(minutes));
    const hrs = Math.floor(clamped / 60)
      .toString()
      .padStart(2, '0');
    const mins = (clamped % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}`;
  }

  private clampMinutes(value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }
    if (value < 0) {
      return 0;
    }
    const max = 24 * 60 - 1;
    if (value > max) {
      return max;
    }
    return value;
  }
}

