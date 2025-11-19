/**
 * Type definitions for auto-scheduler service
 * These types represent Prisma query results with includes
 */

import { Prisma } from '@prisma/client';

/**
 * Job with work order, location, account, and service type includes
 * Represents the result of db.job.findMany with workOrder includes
 */
export type JobWithWorkOrder = Prisma.JobGetPayload<{
  include: {
    workOrder: {
      include: {
        location: true;
        account: true;
        serviceType: true;
      };
    };
  };
}>;

/**
 * Technician availability result
 * Represents the result from TechnicianService.getAvailableTechnicians
 */
export interface AvailableTechnician {
  id: string;
  user_id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  is_available: boolean;
  skills?: string[];
  reason?: string | null;
}

/**
 * Basic technician result
 * Represents the result from TechnicianService.getAvailableTechniciansBasic
 */
export interface BasicTechnician {
  id: string;
  name: string;
  phone?: string;
  skills: string[];
  status: 'available' | 'busy' | 'unavailable';
}



