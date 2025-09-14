import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { 
  CreateTechnicianProfileDto, 
  UpdateTechnicianProfileDto,
  TechnicianQueryDto,
  TechnicianProfileResponseDto,
  TechnicianListResponseDto,
  TechnicianStatus,
  EmploymentType
} from './dto/technician.dto';

@Injectable()
export class TechnicianService {
  constructor(private db: DatabaseService) {}

  // ===== TECHNICIAN PROFILE METHODS =====

  async createTechnicianProfile(tenantId: string, createDto: CreateTechnicianProfileDto): Promise<TechnicianProfileResponseDto> {
    // Check if user exists and belongs to tenant
    const user = await this.db.user.findFirst({
      where: {
        id: createDto.user_id,
        tenant_id: tenantId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found or does not belong to tenant');
    }

    // Check if technician profile already exists
    const existingProfile = await this.db.technicianProfile.findFirst({
      where: {
        tenant_id: tenantId,
        user_id: createDto.user_id,
      },
    });

    if (existingProfile) {
      throw new BadRequestException('Technician profile already exists for this user');
    }

    // Check if employee_id is unique within tenant
    if (createDto.employee_id) {
      const existingEmployeeId = await this.db.technicianProfile.findFirst({
        where: {
          tenant_id: tenantId,
          employee_id: createDto.employee_id,
        },
      });

      if (existingEmployeeId) {
        throw new BadRequestException('Employee ID already exists');
      }
    }

    const technician_profiles = await this.db.technicianProfile.create({
      data: {
        tenant_id: tenantId,
        user_id: createDto.user_id,
        employee_id: createDto.employee_id || null,
        hire_date: new Date(createDto.hire_date),
        position: createDto.position || null,
        department: createDto.department || null,
        employment_type: createDto.employment_type || EmploymentType.FULL_TIME,
        status: createDto.status || TechnicianStatus.ACTIVE,
        emergency_contact_name: createDto.emergency_contact_name || null,
        emergency_contact_phone: createDto.emergency_contact_phone || null,
        emergency_contact_relationship: createDto.emergency_contact_relationship || null,
        address_line1: createDto.address_line1 || null,
        address_line2: createDto.address_line2 || null,
        city: createDto.city || null,
        state: createDto.state || null,
        postal_code: createDto.postal_code || null,
        country: createDto.country || 'US',
        date_of_birth: createDto.date_of_birth ? new Date(createDto.date_of_birth) : null,
        social_security_number: createDto.social_security_number || null,
        driver_license_number: createDto.driver_license_number || null,
        driver_license_state: createDto.driver_license_state || null,
        driver_license_expiry: createDto.driver_license_expiry ? new Date(createDto.driver_license_expiry) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            technician_number: true,
            pesticide_license_number: true,
            license_expiration_date: true,
          },
        },
      },
    });

    return this.mapToResponseDto(technician_profiles);
  }

  async getTechnicianProfiles(tenantId: string, query: TechnicianQueryDto): Promise<TechnicianListResponseDto> {
    try {
      console.log('🔧 getTechnicianProfiles called with:', { tenantId, query });
      const { search, status, department, position, employment_type, sort_by = 'created_at', sort_order = 'desc' } = query;
    
    // Convert string parameters to numbers
    const page = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 20;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {
      tenant_id: tenantId,
    };

    if (search) {
      where.OR = [
        { employee_id: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { user: { first_name: { contains: search, mode: 'insensitive' } } },
        { user: { last_name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { technician_number: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) where.status = status;
    if (department) where.department = department;
    if (position) where.position = position;
    if (employment_type) where.employment_type = employment_type;

    // Build orderBy clause
    let orderBy: any = { created_at: 'desc' }; // Default
    if (sort_by === 'created_at') {
      orderBy = { created_at: sort_order };
    } else if (sort_by === 'updated_at') {
      orderBy = { updated_at: sort_order };
    } else if (sort_by === 'hire_date') {
      orderBy = { hire_date: sort_order };
    } else if (sort_by === 'employee_id') {
      orderBy = { employee_id: sort_order };
    }

    console.log('🔧 About to query technician_profiles with where:', where);
    
    const [technicians, total] = await Promise.all([
      this.db.technicianProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              phone: true,
              technician_number: true,
              pesticide_license_number: true,
              license_expiration_date: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.db.technicianProfile.count({ where }),
    ]);
    
    console.log('🔧 Query results:', { technicians: technicians.length, total });

      return {
        technicians: technicians.map(tech => this.mapToResponseDto(tech)),
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('🔧 Error in getTechnicianProfiles:', error);
      throw error;
    }
  }

  async getTechnicianProfile(tenantId: string, id: string): Promise<TechnicianProfileResponseDto> {
    const technician_profiles = await this.db.technicianProfile.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            technician_number: true,
            pesticide_license_number: true,
            license_expiration_date: true,
          },
        },
      },
    });

    if (!technician_profiles) {
      throw new NotFoundException('Technician profile not found');
    }

    return this.mapToResponseDto(technician_profiles);
  }

  async updateTechnicianProfile(tenantId: string, id: string, updateDto: UpdateTechnicianProfileDto): Promise<TechnicianProfileResponseDto> {
    // Check if technician profile exists
    const existingProfile = await this.db.technicianProfile.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
    });

    if (!existingProfile) {
      throw new NotFoundException('Technician profile not found');
    }

    // Check if employee_id is unique within tenant (if being updated)
    if (updateDto.employee_id && updateDto.employee_id !== existingProfile.employee_id) {
      const existingEmployeeId = await this.db.technicianProfile.findFirst({
        where: {
          tenant_id: tenantId,
          employee_id: updateDto.employee_id,
        },
      });

      if (existingEmployeeId) {
        throw new BadRequestException('Employee ID already exists');
      }
    }

    const updateData: any = {};
    
    if (updateDto.employee_id !== undefined) updateData.employee_id = updateDto.employee_id;
    if (updateDto.hire_date !== undefined) updateData.hire_date = new Date(updateDto.hire_date);
    if (updateDto.position !== undefined) updateData.position = updateDto.position;
    if (updateDto.department !== undefined) updateData.department = updateDto.department;
    if (updateDto.employment_type !== undefined) updateData.employment_type = updateDto.employment_type;
    if (updateDto.status !== undefined) updateData.status = updateDto.status;
    if (updateDto.emergency_contact_name !== undefined) updateData.emergency_contact_name = updateDto.emergency_contact_name;
    if (updateDto.emergency_contact_phone !== undefined) updateData.emergency_contact_phone = updateDto.emergency_contact_phone;
    if (updateDto.emergency_contact_relationship !== undefined) updateData.emergency_contact_relationship = updateDto.emergency_contact_relationship;
    if (updateDto.address_line1 !== undefined) updateData.address_line1 = updateDto.address_line1;
    if (updateDto.address_line2 !== undefined) updateData.address_line2 = updateDto.address_line2;
    if (updateDto.city !== undefined) updateData.city = updateDto.city;
    if (updateDto.state !== undefined) updateData.state = updateDto.state;
    if (updateDto.postal_code !== undefined) updateData.postal_code = updateDto.postal_code;
    if (updateDto.country !== undefined) updateData.country = updateDto.country;
    if (updateDto.date_of_birth !== undefined) updateData.date_of_birth = updateDto.date_of_birth ? new Date(updateDto.date_of_birth) : null;
    if (updateDto.social_security_number !== undefined) updateData.social_security_number = updateDto.social_security_number;
    if (updateDto.driver_license_number !== undefined) updateData.driver_license_number = updateDto.driver_license_number;
    if (updateDto.driver_license_state !== undefined) updateData.driver_license_state = updateDto.driver_license_state;
    if (updateDto.driver_license_expiry !== undefined) updateData.driver_license_expiry = updateDto.driver_license_expiry ? new Date(updateDto.driver_license_expiry) : null;

    const technician_profiles = await this.db.technicianProfile.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            technician_number: true,
            pesticide_license_number: true,
            license_expiration_date: true,
          },
        },
      },
    });

    return this.mapToResponseDto(technician_profiles);
  }

  async deleteTechnicianProfile(tenantId: string, id: string): Promise<void> {
    const technician_profiles = await this.db.technicianProfile.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
    });

    if (!technician_profiles) {
      throw new NotFoundException('Technician profile not found');
    }

    await this.db.technicianProfile.delete({
      where: { id },
    });
  }

  // ===== AVAILABILITY METHODS =====

  async getAvailableTechnicians(tenantId: string, _date: string) {
    // For now, return all active technicians
    // This can be enhanced later with actual availability checking
    const technicians = await this.db.technicianProfile.findMany({
      where: {
        tenant_id: tenantId,
        status: TechnicianStatus.ACTIVE,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            phone: true,
          },
        },
      },
    });

    return technicians.map(tech => ({
      id: tech.user_id,
      name: `${tech.user.first_name} ${tech.user.last_name}`,
      phone: tech.user.phone,
      skills: ['general'], // Default skills for now
      status: 'available' as const,
    }));
  }

  // ===== DASHBOARD METHODS =====

  async getDashboardStats(tenantId: string) {
    const totalTechnicians = await this.db.technicianProfile.count({
      where: { tenant_id: tenantId }
    });

    const activeTechnicians = await this.db.technicianProfile.count({
      where: { 
        tenant_id: tenantId,
        status: TechnicianStatus.ACTIVE
      }
    });

    const onLeaveTechnicians = await this.db.technicianProfile.count({
      where: { 
        tenant_id: tenantId,
        status: TechnicianStatus.ON_LEAVE
      }
    });

    const terminatedTechnicians = await this.db.technicianProfile.count({
      where: { 
        tenant_id: tenantId,
        status: TechnicianStatus.TERMINATED
      }
    });

    return {
      totalTechnicians,
      activeTechnicians,
      onLeaveTechnicians,
      terminatedTechnicians,
      utilizationRate: 0, // Will be calculated based on jobs
      averagePerformance: 0, // Will be calculated based on performance metrics
    };
  }

  async getPerformanceMetrics(tenantId: string) {
    // Mock performance data - in real implementation, this would query job completion rates, customer ratings, etc.
    const technicians = await this.db.technicianProfile.findMany({
      where: { tenant_id: tenantId },
      include: { user: true }
    });

    const performanceMetrics = technicians.map(tech => ({
      technicianId: tech.id,
      name: `${tech.user?.first_name} ${tech.user?.last_name}`,
      completionRate: Math.floor(Math.random() * 30) + 70, // 70-100%
      customerRating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
      jobsCompleted: Math.floor(Math.random() * 50) + 10, // 10-60 jobs
      utilizationRate: Math.floor(Math.random() * 40) + 60, // 60-100%
      onTimeRate: Math.floor(Math.random() * 20) + 80, // 80-100%
    }));

    return {
      metrics: performanceMetrics,
      averageCompletionRate: performanceMetrics.reduce((sum, m) => sum + m.completionRate, 0) / performanceMetrics.length,
      averageCustomerRating: performanceMetrics.reduce((sum, m) => sum + parseFloat(m.customerRating), 0) / performanceMetrics.length,
      totalJobsCompleted: performanceMetrics.reduce((sum, m) => sum + m.jobsCompleted, 0),
    };
  }

  async getAvailabilityData(tenantId: string) {
    // Mock availability data - in real implementation, this would query job schedules
    const technicians = await this.db.technicianProfile.findMany({
      where: { 
        tenant_id: tenantId,
        status: TechnicianStatus.ACTIVE
      },
      include: { user: true }
    });

    const availabilityData = technicians.map(tech => ({
      technicianId: tech.id,
      name: `${tech.user?.first_name} ${tech.user?.last_name}`,
      isAvailable: Math.random() > 0.3, // 70% chance of being available
      currentWorkload: Math.floor(Math.random() * 8) + 2, // 2-10 hours
      maxWorkload: 8,
      nextAvailableSlot: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['General Pest Control', 'Termite Treatment', 'Rodent Control'],
      location: {
        lat: 40.4406 + (Math.random() - 0.5) * 0.1,
        lng: -79.9959 + (Math.random() - 0.5) * 0.1,
        address: 'Pittsburgh, PA'
      }
    }));

    return {
      technicians: availabilityData,
      totalAvailable: availabilityData.filter(t => t.isAvailable).length,
      totalBusy: availabilityData.filter(t => !t.isAvailable).length,
      averageWorkload: availabilityData.reduce((sum, t) => sum + t.currentWorkload, 0) / availabilityData.length,
    };
  }

  // ===== HELPER METHODS =====

  private mapToResponseDto(technician_profiles: any): TechnicianProfileResponseDto {
    return {
      id: technician_profiles.id,
      user_id: technician_profiles.user_id,
      employee_id: technician_profiles.employee_id,
      hire_date: technician_profiles.hire_date.toISOString(),
      position: technician_profiles.position,
      department: technician_profiles.department,
      employment_type: technician_profiles.employment_type,
      status: technician_profiles.status,
      emergency_contact_name: technician_profiles.emergency_contact_name,
      emergency_contact_phone: technician_profiles.emergency_contact_phone,
      emergency_contact_relationship: technician_profiles.emergency_contact_relationship,
      address_line1: technician_profiles.address_line1,
      address_line2: technician_profiles.address_line2,
      city: technician_profiles.city,
      state: technician_profiles.state,
      postal_code: technician_profiles.postal_code,
      country: technician_profiles.country,
      date_of_birth: technician_profiles.date_of_birth?.toISOString(),
      social_security_number: technician_profiles.social_security_number,
      driver_license_number: technician_profiles.driver_license_number,
      driver_license_state: technician_profiles.driver_license_state,
      driver_license_expiry: technician_profiles.driver_license_expiry?.toISOString(),
      created_at: technician_profiles.created_at.toISOString(),
      updated_at: technician_profiles.updated_at.toISOString(),
      user: technician_profiles.users,
    };
  }
}