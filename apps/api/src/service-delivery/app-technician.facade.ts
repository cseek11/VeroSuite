/**
 * App facade for technician operations.
 */
import { TechnicianFacade } from "./technician.facade";

export class AppTechnicianFacade implements TechnicianFacade {
  constructor(/* handlers */) {}

  async getTechnician(_id: string) {
    // TODO
    return null;
  }

  async updateProfile(_id: string, _payload: any) {
    // TODO
    return { ok: true };
  }
}
