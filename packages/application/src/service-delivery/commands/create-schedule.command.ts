/**
 * CreateScheduleCommand DTO.
 * TODO: refine properties to match handlers.
 */
export class CreateScheduleCommand {
  constructor(public tenantId: string, public appointments: any[]) {}
}
