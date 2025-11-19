import {
  RouteJob,
  RouteOptimizationEngine,
  RouteTechnician,
} from '../route-optimization.engine';

describe('RouteOptimizationEngine', () => {
  const engine = new RouteOptimizationEngine();

  const baseTechnician: RouteTechnician = {
    id: 'tech-1',
    name: 'Tech One',
    skills: ['general', 'termite'],
    shiftStartMinutes: 8 * 60,
    shiftEndMinutes: 18 * 60,
    startLocation: { lat: 40.0, lng: -80.0 },
  };

  const buildJob = (overrides: Partial<RouteJob>): RouteJob => ({
    id: overrides.id ?? 'job-default',
    priority: overrides.priority ?? 'medium',
    serviceDurationMinutes: overrides.serviceDurationMinutes ?? 60,
    location: overrides.location ?? { lat: 40.0, lng: -80.0, valid: true },
    timeWindow: overrides.timeWindow,
    requiredSkills: overrides.requiredSkills ?? [],
    accountName: overrides.accountName,
    address: overrides.address,
  });

  it('orders jobs by priority and proximity', () => {
    const jobs: RouteJob[] = [
      buildJob({
        id: 'job-low',
        priority: 'low',
        location: { lat: 40.01, lng: -80.01, valid: true },
      }),
      buildJob({
        id: 'job-urgent',
        priority: 'urgent',
        location: { lat: 40.05, lng: -80.05, valid: true },
      }),
      buildJob({
        id: 'job-medium',
        priority: 'medium',
        location: { lat: 40.02, lng: -80.02, valid: true },
      }),
    ];

    const result = engine.optimize({
      jobs,
      technicians: [baseTechnician],
    });

    expect(result.routes).toHaveLength(1);
    const stopOrder = result.routes[0].stops.map((stop) => stop.jobId);
    expect(stopOrder[0]).toBe('job-urgent');
    expect(stopOrder).toContain('job-low');
  });

  it('respects technician skills when assigning jobs', () => {
    const skilledTechnician: RouteTechnician = {
      ...baseTechnician,
      id: 'tech-2',
      name: 'Tech Two',
      skills: ['termite'],
    };

    const jobs: RouteJob[] = [
      buildJob({
        id: 'job-termite',
        requiredSkills: ['termite'],
        location: { lat: 40.01, lng: -80.01, valid: true },
      }),
      buildJob({
        id: 'job-general',
        requiredSkills: ['general'],
        location: { lat: 40.02, lng: -80.02, valid: true },
      }),
    ];

    const result = engine.optimize({
      jobs,
      technicians: [skilledTechnician],
    });

    expect(result.routes[0].stops.map((stop) => stop.jobId)).toContain('job-termite');
    expect(result.unassignedJobs.map((job) => job.id)).toContain('job-general');
  });

  it('returns metadata summarizing totals', () => {
    const jobs: RouteJob[] = [
      buildJob({
        id: 'job-1',
        location: { lat: 40.01, lng: -80.01, valid: true },
      }),
    ];

    const result = engine.optimize({
      jobs,
      technicians: [baseTechnician],
    });

    expect(result.metadata.totalJobs).toBe(1);
    expect(result.metadata.optimizedJobs).toBe(1);
    expect(result.routes[0].totalDistanceMiles).toBeGreaterThanOrEqual(0);
    expect(result.routes[0].totalTravelMinutes).toBeGreaterThanOrEqual(0);
  });

  it('handles invalid coordinates by flagging unassigned jobs', () => {
    const jobs: RouteJob[] = [
      buildJob({
        id: 'job-invalid',
        location: { lat: NaN, lng: NaN, valid: false },
      }),
    ];

    const result = engine.optimize({
      jobs,
      technicians: [baseTechnician],
    });

    expect(result.routes[0]?.stops).toBeDefined();
    expect(result.unassignedJobs.map((job) => job.id)).toContain('job-invalid');
  });
});


