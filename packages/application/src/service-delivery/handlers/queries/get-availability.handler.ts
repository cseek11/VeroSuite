import { GetAvailabilityQuery } from "../../queries/get-availability.query";

export class GetAvailabilityQueryHandler {
  constructor(/* repositories */) {}

  async execute(q: GetAvailabilityQuery): Promise<any> {
    // TODO: query repos and map to DTO
    return { availability: [] };
  }
}
