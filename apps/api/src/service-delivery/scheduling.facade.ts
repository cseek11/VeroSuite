/**
 * SchedulingFacade interface: controllers depend on this abstraction.
 * Controllers remain in apps/api/src/presentation/http and use DI to resolve this facade.
 */
export interface SchedulingFacade {
  getAvailability(tenantId: string, from: string, to: string): Promise<any>;
  createSchedule(payload: any): Promise<any>;
  assignTechnician(payload: any): Promise<any>;
}
