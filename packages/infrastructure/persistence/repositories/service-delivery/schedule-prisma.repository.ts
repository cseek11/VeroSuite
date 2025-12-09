/**
 * Prisma-backed ScheduleRepository adapter (stub).
 * TODO: implement using the shared Prisma client used by other repos.
 */
import { ScheduleRepository } from "../../../domain/src/service-delivery/scheduling/repositories/schedule-repository";

export class SchedulePrismaRepository implements ScheduleRepository {
  async findById(id: string, tenantId: string) {
    throw new Error("Not implemented");
  }
  async findByRange(tenantId: string, from: Date, to: Date) {
    throw new Error("Not implemented");
  }
  async save(schedule: any) {
    throw new Error("Not implemented");
  }
}
