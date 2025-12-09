/**
 * Domain repository interface for schedules.
 * Implementations live in packages/infrastructure/persistence/repositories/service-delivery/
 */
import { Schedule } from "../entities/schedule";

export interface ScheduleRepository {
  findById(id: string, tenantId: string): Promise<Schedule | null>;
  findByRange(tenantId: string, from: Date, to: Date): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<void>;
}
