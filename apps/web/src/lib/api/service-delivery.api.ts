/**
 * Web client facade for service-delivery operations.
 * Phase 7: use same endpoints as today; this file is a seam for future endpoint changes.
 */
export async function fetchAvailability(tenantId: string, from: string, to: string) {
  // TODO: call existing backend endpoint (e.g. /api/scheduling/availability)
  throw new Error("Not implemented yet");
}

export async function createSchedule(payload: any) {
  // TODO: post to /api/scheduling
  throw new Error("Not implemented yet");
}

export async function assignTechnician(payload: any) {
  // TODO: post to /api/technicians/assign
  throw new Error("Not implemented yet");
}
