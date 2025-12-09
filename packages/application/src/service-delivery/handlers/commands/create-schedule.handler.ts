/**
 * CreateScheduleCommandHandler skeleton.
 * Inject domain repos/services via constructor.
 */
import { CreateScheduleCommand } from "../../commands/create-schedule.command";

export class CreateScheduleCommandHandler {
  constructor(/* scheduleRepo, conflictResolver, etc. */) {}

  async execute(cmd: CreateScheduleCommand): Promise<any> {
    // TODO: map DTO -> domain entities, call domain services, persist via repositories
    return { ok: true };
  }
}
