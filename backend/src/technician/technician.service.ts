import { Injectable } from '@nestjs/common';

export interface Technician {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  status: 'available' | 'in_progress' | 'off';
}

@Injectable()
export class TechnicianService {
  // Mock technicians per tenant
  async getAvailableTechnicians(tenantId: string, _date: string): Promise<Technician[]> {
    // Return a deterministic set based on tenantId
    const seed = tenantId.charCodeAt(0) % 3;
    const techs: Technician[] = [
      { id: 'tech1', name: 'John Smith', phone: '(412) 555-1001', skills: ['general', 'commercial'], status: 'available' },
      { id: 'tech2', name: 'Maria Garcia', phone: '(412) 555-1002', skills: ['residential', 'rodent'], status: 'in_progress' },
      { id: 'tech3', name: 'David Wilson', phone: '(412) 555-1003', skills: ['commercial', 'termite'], status: 'available' },
    ];
    return techs.slice(seed).concat(techs.slice(0, seed));
  }
}
