/**
 * Application-layer adapter implementing SchedulingFacade.
 * Inject application handlers (command/query handlers) at DI composition time.
 */
import { SchedulingFacade } from "./scheduling.facade";

export class AppSchedulingFacade implements SchedulingFacade {
  constructor(/* handlers */) {}

  async getAvailability(_tenantId: string, _from: string, _to: string) {
    // TODO: call GetAvailabilityQueryHandler
    return { availability: [] };
  }

  async createSchedule(_payload: any) {
    // TODO: call CreateScheduleCommandHandler
    return { ok: true };
  }

  async assignTechnician(_payload: any) {
    // TODO: call AssignTechnicianCommandHandler
    return { ok: true };
  }
}
