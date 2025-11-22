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

    // Get user's employee_id if not provided in DTO
    let employeeId = createDto.employee_id;
    if (!employeeId) {
      const user = await this.db.user.findUnique({
        where: { id: createDto.user_id },
        select: { employee_id: true },
      });
      if (user && user.employee_id) {
        employeeId = user.employee_id;
      }
    }

    // Check if employee_id is unique within tenant (if provided)
    if (employeeId) {
      const existingEmployeeId = await this.db.technicianProfile.findFirst({
        where: {
          tenant_id: tenantId,
          employee_id: employeeId,
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
        employee_id: employeeId || null,
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

  async getAvailableTechniciansBasic(tenantId: string, _date: string) {
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
    const baseDto: any = {
      id: technician_profiles.id,
      user_id: technician_profiles.user_id,
      employee_id: technician_profiles.employee_id,
      hire_date: technician_profiles.hire_date?.toISOString() || new Date().toISOString(),
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
    };

    // Include user information for frontend compatibility (only if user exists)
    if (technician_profiles.user) {
      baseDto.user = {
        id: technician_profiles.user.id,
        email: technician_profiles.user.email,
        first_name: technician_profiles.user.first_name,
        last_name: technician_profiles.user.last_name,
        phone: technician_profiles.user.phone,
        technician_number: technician_profiles.user.technician_number,
        pesticide_license_number: technician_profiles.user.pesticide_license_number,
        license_expiration_date: technician_profiles.user.license_expiration_date?.toISOString(),
      };
    }

    return baseDto as TechnicianProfileResponseDto;
  }

  // ===== AVAILABILITY MANAGEMENT =====

  /**
   * Get availability for a technician within a date range
   * Combines recurring availability patterns, specific schedules, and time-off requests
   */
  async getTechnicianAvailability(
    tenantId: string,
    technicianId: string,
    startDate?: string,
    endDate?: string
  ) {
    try {
      // Get recurring availability patterns
      const availabilityPatterns = await this.db.$queryRawUnsafe(`
        SELECT * FROM technician_availability
        WHERE tenant_id = $1::uuid AND technician_id = $2::uuid AND is_active = true
        ORDER BY day_of_week
      `, tenantId, technicianId).catch(() => []);

      // Get specific schedules if date range provided
      let schedules: any[] = [];
      if (startDate && endDate) {
        schedules = (await this.db.$queryRawUnsafe(`
          SELECT * FROM technician_schedules
          WHERE tenant_id = $1::uuid 
            AND technician_id = $2::uuid
            AND schedule_date BETWEEN $3::date AND $4::date
          ORDER BY schedule_date
        `, tenantId, technicianId, startDate, endDate).catch(() => [])) as any[];
      }

      // Get time-off requests
      let timeOffRequests: any[] = [];
      if (startDate && endDate) {
        timeOffRequests = (await this.db.$queryRawUnsafe(`
          SELECT * FROM time_off_requests
          WHERE tenant_id = $1::uuid 
            AND technician_id = $2::uuid
            AND status = 'approved'
            AND (
              (start_date <= $4::date AND end_date >= $3::date)
            )
          ORDER BY start_date
        `, tenantId, technicianId, startDate, endDate).catch(() => [])) as any[];
      }

      return {
        technician_id: technicianId,
        availability_patterns: availabilityPatterns,
        schedules: schedules,
        time_off_requests: timeOffRequests,
        calculated_availability: this.calculateAvailability(
          availabilityPatterns as any[],
          schedules,
          timeOffRequests,
          startDate,
          endDate
        )
      };
    } catch (error) {
      // If tables don't exist yet, return empty structure
      console.warn('Availability tables may not exist yet:', error);
      return {
        technician_id: technicianId,
        availability_patterns: [],
        schedules: [],
        time_off_requests: [],
        calculated_availability: []
      };
    }
  }

  /**
   * Calculate availability from patterns, schedules, and time-off
   */
  private calculateAvailability(
    _patterns: any[],
    _schedules: any[],
    _timeOffRequests: any[],
    _startDate?: string,
    _endDate?: string
  ): any[] {
    // This would calculate actual availability slots
    // For now, return empty array - will be implemented fully once tables exist
    return [];
  }

  /**
   * Create or update availability pattern for a technician
   */
  async setAvailability(
    tenantId: string,
    technicianId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    isActive: boolean = true
  ) {
    try {
      // Upsert availability pattern
      const result = await this.db.$queryRawUnsafe(`
        INSERT INTO technician_availability 
          (tenant_id, technician_id, day_of_week, start_time, end_time, is_active, created_at, updated_at)
        VALUES ($1::uuid, $2::uuid, $3, $4::time, $5::time, $6, NOW(), NOW())
        ON CONFLICT (tenant_id, technician_id, day_of_week)
        DO UPDATE SET
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          is_active = EXCLUDED.is_active,
          updated_at = NOW()
        RETURNING *
      `, tenantId, technicianId, dayOfWeek, startTime, endTime, isActive);

      return Array.isArray(result) && result.length > 0 ? result[0] : result;
    } catch (error) {
      // If table doesn't exist, throw helpful error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        throw new BadRequestException(
          'Availability tables not created yet. Please run the migration: create_technician_availability.sql'
        );
      }
      throw error;
    }
  }

  /**
   * Get available technicians for a specific time slot
   * Checks availability patterns, schedules, time-off, and existing jobs
   */
  async getAvailableTechnicians(
    tenantId: string,
    date: string,
    startTime: string,
    endTime: string
  ) {
    try {
      // Get all active technicians
      const technicians = await this.db.technicianProfile.findMany({
        where: {
          tenant_id: tenantId,
          status: TechnicianStatus.ACTIVE
        },
        include: {
          user: true
        }
      });

      // Check availability for each technician
      const availableTechnicians = await Promise.all(
        technicians.map(async (tech) => {
          const technicianId = tech.user_id;
          
          // Check if technician has time off on this date
          const timeOff = await this.db.$queryRawUnsafe(`
            SELECT * FROM time_off_requests
            WHERE tenant_id = $1::uuid 
              AND technician_id = $2::uuid
              AND status = 'approved'
              AND $3::date BETWEEN start_date AND end_date
            LIMIT 1
          `, tenantId, technicianId, date).catch(() => []);

          if (Array.isArray(timeOff) && timeOff.length > 0) {
            return {
              id: technicianId,
              name: `${tech.user?.first_name} ${tech.user?.last_name}`,
              is_available: false,
              reason: 'Time off requested'
            };
          }

          // Check specific schedule for this date
          const schedule = await this.db.$queryRawUnsafe(`
            SELECT * FROM technician_schedules
            WHERE tenant_id = $1::uuid 
              AND technician_id = $2::uuid
              AND schedule_date = $3::date
            LIMIT 1
          `, tenantId, technicianId, date).catch(() => []);

          if (Array.isArray(schedule) && schedule.length > 0) {
            const sched = schedule[0];
            if (!sched.is_available) {
              return {
                id: technicianId,
                name: `${tech.user?.first_name} ${tech.user?.last_name}`,
                is_available: false,
                reason: 'Not available on this date'
              };
            }
            // Check if time slot is within scheduled hours
            if (sched.start_time && sched.end_time) {
              if (startTime < sched.start_time || endTime > sched.end_time) {
                return {
                  id: technicianId,
                  name: `${tech.user?.first_name} ${tech.user?.last_name}`,
                  is_available: false,
                  reason: `Outside scheduled hours (${sched.start_time} - ${sched.end_time})`
                };
              }
            }
          } else {
            // Check recurring availability pattern
            const dayOfWeek = new Date(date).getDay();
            const pattern = await this.db.$queryRawUnsafe(`
              SELECT * FROM technician_availability
              WHERE tenant_id = $1::uuid 
                AND technician_id = $2::uuid
                AND day_of_week = $3
                AND is_active = true
              LIMIT 1
            `, tenantId, technicianId, dayOfWeek).catch(() => []);

            if (Array.isArray(pattern) && pattern.length > 0) {
              const pat = pattern[0];
              if (startTime < pat.start_time || endTime > pat.end_time) {
                return {
                  id: technicianId,
                  name: `${tech.user?.first_name} ${tech.user?.last_name}`,
                  is_available: false,
                  reason: `Outside availability hours (${pat.start_time} - ${pat.end_time})`
                };
              }
            } else {
              // No availability pattern set - assume available
              // In production, you might want to default to unavailable
            }
          }

          // Check for existing job conflicts
          const conflictingJobs = await this.db.job.findMany({
            where: {
              tenant_id: tenantId,
              technician_id: technicianId,
              scheduled_date: new Date(date),
              status: {
                in: ['scheduled', 'in_progress']
              }
            }
          });

          // Check for time overlap
          for (const job of conflictingJobs) {
            if (job.scheduled_start_time && job.scheduled_end_time) {
              const jobStart = job.scheduled_start_time;
              const jobEnd = job.scheduled_end_time;
              
              // Check if time ranges overlap
              if (
                (startTime >= jobStart && startTime < jobEnd) ||
                (endTime > jobStart && endTime <= jobEnd) ||
                (startTime <= jobStart && endTime >= jobEnd)
              ) {
                return {
                  id: technicianId,
                  name: `${tech.user?.first_name} ${tech.user?.last_name}`,
                  is_available: false,
                  reason: `Already has job scheduled (${jobStart} - ${jobEnd})`
                };
              }
            }
          }

          return {
            id: technicianId,
            name: `${tech.user?.first_name} ${tech.user?.last_name}`,
            is_available: true,
            reason: null
          };
        })
      );

      return availableTechnicians;
    } catch (error) {
      console.error('Error getting available technicians:', error);
      // Fallback: return all active technicians as available
      const technicians = await this.db.technicianProfile.findMany({
        where: {
          tenant_id: tenantId,
          status: TechnicianStatus.ACTIVE
        },
        include: {
          user: true
        }
      });

      return technicians.map(tech => ({
        id: tech.user_id,
        name: `${tech.user?.first_name} ${tech.user?.last_name}`,
        is_available: true,
        reason: null
      }));
    }
  }
}