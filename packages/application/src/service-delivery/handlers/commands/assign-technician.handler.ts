import { AssignTechnicianCommand } from "../../commands/assign-technician.command";

export class AssignTechnicianCommandHandler {
  constructor(/* repositories, domain services */) {}

  async execute(cmd: AssignTechnicianCommand): Promise<any> {
    // TODO: find appointment, verify availability/skills, assign and save
    return { ok: true };
  }
}
