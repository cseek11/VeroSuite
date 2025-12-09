/**
 * TechnicianRepository interface for domain persistence.
 */
import { Technician } from "../entities/technician";

export interface TechnicianRepository {
  findById(id: string, tenantId: string): Promise<Technician | null>;
  findAvailable(tenantId: string, from: Date, to: Date, requiredSkills?: string[]): Promise<Technician[]>;
  save(tech: Technician): Promise<void>;
}
