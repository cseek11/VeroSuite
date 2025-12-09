export class GetAvailabilityQuery {
  constructor(public tenantId: string, public from: Date, public to: Date) {}
}
