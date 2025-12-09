/**
 * TechnicianFacade interface for controller consumption.
 */
export interface TechnicianFacade {
  getTechnician(id: string): Promise<any>;
  updateProfile(id: string, payload: any): Promise<any>;
}
