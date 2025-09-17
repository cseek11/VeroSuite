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
} from './dto';

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

      return new TechnicianListResponseDto(
        technicians.map(tech => this.mapToResponseDto(tech)),
        { page, limit, total }
      );
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
    // Get real performance data from job completion and customer ratings
    const technicians = await this.db.technicianProfile.findMany({
      where: { tenant_id: tenantId },
      include: { 
        user: true,
        // TODO: Add relations to jobs and customer ratings when implemented
      }
    });

    // For now, return empty metrics until job and rating data is available
    const performanceMetrics = technicians.map(tech => ({
      technicianId: tech.id,
      name: `${tech.user?.first_name} ${tech.user?.last_name}`,
      completionRate: 0, // Will be calculated from actual job data
      customerRating: 0, // Will be calculated from actual rating data
      jobsCompleted: 0, // Will be calculated from actual job data
      utilizationRate: 0, // Will be calculated from actual schedule data
      onTimeRate: 0, // Will be calculated from actual job timing data
    }));

    return {
      metrics: performanceMetrics,
      averageCompletionRate: 0,
      averageCustomerRating: 0,
      totalJobsCompleted: 0,
    };
  }

  async getAvailabilityData(tenantId: string) {
    // Get real availability data from job schedules and technician status
    const technicians = await this.db.technicianProfile.findMany({
      where: { 
        tenant_id: tenantId,
        status: TechnicianStatus.ACTIVE
      },
      include: { 
        user: true,
        // TODO: Add relations to job schedules when implemented
      }
    });

    // Get skills for each technician
    const technicianSkills = await this.db.technicianSkill.findMany({
      where: {
        tenant_id: tenantId,
        is_active: true
      },
      include: {
        serviceType: true
      }
    });

    // Group skills by technician
    const skillsByTechnician = technicianSkills.reduce((acc, skill) => {
      if (!acc[skill.technician_id]) {
        acc[skill.technician_id] = [];
      }
      if (skill.serviceType) {
        acc[skill.technician_id]!.push(skill.serviceType.service_name);
      }
      return acc;
    }, {} as Record<string, string[]>);

    // For now, return basic availability data until schedule system is implemented
    const availabilityData = technicians.map(tech => ({
      technicianId: tech.id,
      name: `${tech.user?.first_name} ${tech.user?.last_name}`,
      isAvailable: true, // Will be calculated from actual schedule data
      currentWorkload: 0, // Will be calculated from actual job assignments
      maxWorkload: 8, // Default max workload
      nextAvailableSlot: new Date().toISOString(), // Will be calculated from actual schedule
      skills: skillsByTechnician[tech.user_id] || [], // Use actual skills from technician skills table
      location: {
        lat: 0, // Will be set from actual location data
        lng: 0, // Will be set from actual location data
        address: 'Location not set'
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
      first_name: technician_profiles.user?.first_name || '',
      last_name: technician_profiles.user?.last_name || '',
      phone: technician_profiles.user?.phone,
      email: technician_profiles.user?.email,
      license_number: technician_profiles.user?.pesticide_license_number,
      license_expiration: technician_profiles.user?.license_expiration_date?.toISOString(),
      specializations: [], // Default empty array
      certifications: [], // Default empty array
      is_active: technician_profiles.status === 'ACTIVE',
      tenant_id: technician_profiles.tenant_id,
      created_at: technician_profiles.created_at.toISOString(),
      updated_at: technician_profiles.updated_at.toISOString(),
    };
  }
}