/**
 * ScheduleConflictResolver interface + skeleton implementation.
 * Responsibility: determine appointment conflicts and provide resolution suggestions.
 * Important: pure domain logic; no IO.
 */
import { Appointment } from "../entities/appointment";

export interface ScheduleConflictResolver {
  findConflicts(appointments: Appointment[]): Appointment[];
}

export class ScheduleConflictResolverImpl implements ScheduleConflictResolver {
  findConflicts(appointments: Appointment[]): Appointment[] {
    // TODO: implement conflict detection (overlap, adjacency rules)
    return [];
  }
}
