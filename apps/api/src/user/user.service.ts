import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { DatabaseService } from '../common/services/database.service';
import { EncryptionService } from '../common/services/encryption.service';

@Injectable()
export class UserService {
  private supabase;

  constructor(
    private db: DatabaseService,
    private encryptionService: EncryptionService,
  ) {
    // Initialize Supabase client for auth operations
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async findByEmail(email: string) {
    try {
      // Get user from Supabase auth
      const { data: { users }, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching users:', error);
        return null;
      }

      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return null;
      }

      // Return user in the format expected by the auth service
      return {
        id: user.id,
        email: user.email,
        password_hash: '', // Password validation is handled by Supabase auth
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        tenant_id: user.user_metadata?.tenant_id,
        roles: user.user_metadata?.roles || ['user'],
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      console.error('Error in findByEmail:', error);
      return null;
    }
  }

  async getUsers(tenantId: string) {
    try {
      const users = await this.db.user.findMany({
        where: {
          tenant_id: tenantId,
        },
        select: {
          id: true,
          tenant_id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          employee_id: true,
          technician_number: true,
          pesticide_license_number: true,
          license_expiration_date: true,
          roles: true,
          status: true,
          manager_id: true,
          avatar_url: true,
          tags: true,
          department: true,
          position: true,
          hire_date: true,
          employment_type: true,
          custom_permissions: true,
          emergency_contact_name: true,
          emergency_contact_phone: true,
          emergency_contact_relationship: true,
          address_line1: true,
          address_line2: true,
          city: true,
          state: true,
          postal_code: true,
          country: true,
          date_of_birth: true,
          driver_license_state: true,
          driver_license_expiry: true,
          qualifications: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          first_name: 'asc',
        },
      });

      return {
        users: users.map(user => ({
          id: user.id,
          tenant_id: user.tenant_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          employee_id: user.employee_id,
          technician_number: user.technician_number,
          pesticide_license_number: user.pesticide_license_number,
          license_expiration_date: user.license_expiration_date?.toISOString() || null,
          roles: user.roles,
          status: user.status,
          manager_id: user.manager_id,
          avatar_url: user.avatar_url,
          tags: user.tags,
          department: user.department,
          position: user.position,
          hire_date: user.hire_date?.toISOString() || null,
          employment_type: user.employment_type,
          custom_permissions: user.custom_permissions,
          emergency_contact_name: user.emergency_contact_name,
          emergency_contact_phone: user.emergency_contact_phone,
          emergency_contact_relationship: user.emergency_contact_relationship,
          address_line1: user.address_line1,
          address_line2: user.address_line2,
          city: user.city,
          state: user.state,
          postal_code: user.postal_code,
          country: user.country,
          date_of_birth: (user as any).date_of_birth?.toISOString() || null,
          driver_license_state: user.driver_license_state,
          driver_license_expiry: user.driver_license_expiry?.toISOString() || null,
          qualifications: user.qualifications,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
        })),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserHierarchy(tenantId: string, userId: string) {
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          tenant_id: true,
          first_name: true,
          last_name: true,
          email: true,
          manager_id: true,
          position: true,
          department: true,
        },
      });

      if (!user || user.tenant_id !== tenantId) {
        return null;
      }

      // Get manager
      let manager = null;
      if (user.manager_id) {
        manager = await this.db.user.findUnique({
          where: { id: user.manager_id },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            position: true,
            department: true,
          },
        });
      }

      // Get direct reports
      const directReports = await this.db.user.findMany({
        where: {
          tenant_id: tenantId,
          manager_id: userId,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          position: true,
          department: true,
          status: true,
        },
        orderBy: {
          first_name: 'asc',
        },
      });

      return {
        user,
        manager,
        directReports,
      };
    } catch (error) {
      console.error('Error fetching user hierarchy:', error);
      throw error;
    }
  }

  async getUserActivity(tenantId: string, userId: string, limit: number = 50) {
    try {
      const activities = await this.db.auditLog.findMany({
        where: {
          tenant_id: tenantId,
          user_id: userId,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
        select: {
          id: true,
          action: true,
          resource_type: true,
          resource_id: true,
          timestamp: true,
          ip_address: true,
          user_agent: true,
        },
      });

      return activities.map(activity => ({
        id: activity.id,
        action: activity.action,
        resource_type: activity.resource_type,
        resource_id: activity.resource_id,
        timestamp: activity.timestamp.toISOString(),
        ip_address: activity.ip_address,
        user_agent: activity.user_agent,
      }));
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  async createUser(tenantId: string, createUserDto: any) {
    try {
      const { 
        email, 
        first_name, 
        last_name, 
        phone, 
        password,
        employee_id,
        hire_date,
        position,
        department,
        employment_type,
        roles,
        custom_permissions,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        date_of_birth,
        social_security_number,
        driver_license_number,
        driver_license_state,
        driver_license_expiry,
        qualifications,
        technician_number,
        pesticide_license_number,
        license_expiration_date,
      } = createUserDto;

      // Check if user already exists in local database
      const existingUser = await this.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Encrypt sensitive fields
      const encryptedData: any = {};
      if (social_security_number) {
        encryptedData.social_security_number = this.encryptionService.encrypt(social_security_number);
      }
      if (driver_license_number) {
        encryptedData.driver_license_number = this.encryptionService.encrypt(driver_license_number);
      }

      // Create user in Supabase Auth first
      const userRoles = roles || ['technician'];
      const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
        email,
        password: password || this.generateTempPassword(),
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name,
          last_name,
          tenant_id: tenantId,
          roles: userRoles,
        },
      });

      if (authError) {
        console.error('Error creating user in Supabase Auth:', authError);
        throw new Error(`Failed to create user in authentication system: ${authError.message}`);
      }

      // Determine primary role from roles array or default to 'technician'
      const primaryRole = Array.isArray(userRoles) ? userRoles[0] : userRoles;
      
      // Generate employee ID if not provided
      let finalEmployeeId: string | null = employee_id || null;
      if (!finalEmployeeId) {
        try {
          finalEmployeeId = await this.generateEmployeeId(tenantId, primaryRole);
        } catch (error) {
          console.error('Error generating employee ID:', error);
          // Continue without employee ID - it can be generated later
        }
      }

      // Prepare date fields
      const hireDate = hire_date ? new Date(hire_date) : null;
      const dateOfBirth = date_of_birth ? new Date(date_of_birth) : null;
      const driverLicenseExpiry = driver_license_expiry ? new Date(driver_license_expiry) : null;
      const licenseExpiration = license_expiration_date ? new Date(license_expiration_date) : null;

      // Create user in local database with the Supabase Auth user ID
      const user = await this.db.user.create({
        data: {
          id: authUser.user.id, // Use Supabase Auth user ID
          tenant_id: tenantId,
          email,
          first_name,
          last_name,
          phone: phone || null,
          employee_id: finalEmployeeId,
          password_hash: '', // Password is managed by Supabase Auth
          roles: userRoles,
          status: createUserDto.status || 'active',
          hire_date: hireDate,
          position: position || null,
          department: department || null,
          employment_type: employment_type || 'full_time',
          custom_permissions: custom_permissions || [],
          emergency_contact_name: emergency_contact_name || null,
          emergency_contact_phone: emergency_contact_phone || null,
          emergency_contact_relationship: emergency_contact_relationship || null,
          address_line1: address_line1 || null,
          address_line2: address_line2 || null,
          city: city || null,
          state: state || null,
          postal_code: postal_code || null,
          country: country || 'US',
          date_of_birth: dateOfBirth,
          social_security_number: encryptedData.social_security_number || null,
          driver_license_number: encryptedData.driver_license_number || null,
          driver_license_state: driver_license_state || null,
          driver_license_expiry: driverLicenseExpiry,
          qualifications: qualifications || [],
          technician_number: technician_number || null,
          pesticide_license_number: pesticide_license_number || null,
          license_expiration_date: licenseExpiration,
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          employee_id: true,
          roles: true,
          status: true,
          hire_date: true,
          position: true,
          department: true,
          employment_type: true,
          custom_permissions: true,
          emergency_contact_name: true,
          emergency_contact_phone: true,
          emergency_contact_relationship: true,
          address_line1: true,
          address_line2: true,
          city: true,
          state: true,
          postal_code: true,
          country: true,
          date_of_birth: true,
          driver_license_state: true,
          driver_license_expiry: true,
          qualifications: true,
          technician_number: true,
          pesticide_license_number: true,
          license_expiration_date: true,
          created_at: true,
          updated_at: true,
        },
      });

      return {
        user: {
          ...user,
          hire_date: user.hire_date?.toISOString() || null,
          date_of_birth: (user as any).date_of_birth?.toISOString() || null,
          driver_license_expiry: user.driver_license_expiry?.toISOString() || null,
          license_expiration_date: user.license_expiration_date?.toISOString() || null,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
          // Note: SSN and driver_license_number are encrypted and not returned
        },
        message: 'User created successfully in both authentication system and database',
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  private generateTempPassword(): string {
    // Generate a secure temporary password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Generate a unique employee ID based on role and year
   * Format: PREFIX-YYYY-NNNN (e.g., TECH-2025-0001)
   * @public - Used by controller and internally
   */
  async generateEmployeeId(tenantId: string, role: string): Promise<string> {
    // Map role to prefix
    const rolePrefixMap: { [key: string]: string } = {
      'technician': 'TECH',
      'admin': 'ADMIN',
      'dispatcher': 'DISP',
    };
    
    const prefix = rolePrefixMap[role.toLowerCase()] || 'EMP';
    const currentYear = new Date().getFullYear();
    const fullPrefix = `${prefix}-${currentYear}-`;

    // Get the last employee ID for this tenant, prefix, and year
    const lastUser = await this.db.user.findFirst({
      where: {
        tenant_id: tenantId,
        employee_id: {
          startsWith: fullPrefix,
        },
      },
      orderBy: {
        employee_id: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastUser && lastUser.employee_id) {
      // Extract the number part after the prefix
      const lastNumberStr = lastUser.employee_id.replace(fullPrefix, '');
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // Format as PREFIX-YYYY-NNNN with zero-padding
    return `${fullPrefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  async syncAuthUsersToDatabase(tenantId: string) {
    try {
      // Get all users from Supabase Auth
      const { data: { users }, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching users from Supabase Auth:', error);
        throw error;
      }

      const syncedUsers = [];

      for (const authUser of users) {
        // Check if user metadata contains tenant_id and it matches
        const userTenantId = authUser.user_metadata?.tenant_id;
        if (userTenantId !== tenantId) {
          continue; // Skip users from other tenants
        }

        // Check if user already exists in local database
        const existingUser = await this.db.user.findUnique({
          where: { id: authUser.id },
        });

        if (!existingUser) {
          // Create user in local database
          const newUser = await this.db.user.create({
            data: {
              id: authUser.id,
              tenant_id: tenantId,
              email: authUser.email || '',
              first_name: authUser.user_metadata?.first_name || '',
              last_name: authUser.user_metadata?.last_name || '',
              phone: authUser.user_metadata?.phone || null,
              password_hash: '', // Password is managed by Supabase Auth
              roles: authUser.user_metadata?.roles || ['user'],
              status: 'active',
            },
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
          });
          syncedUsers.push(newUser);
        }
      }

      return {
        synced: syncedUsers.length,
        users: syncedUsers,
        message: `Synced ${syncedUsers.length} users from authentication system`,
      };
    } catch (error) {
      console.error('Error syncing auth users to database:', error);
      throw error;
    }
  }

  async deactivateUser(tenantId: string, userId: string, reassignToUserId?: string, _reason?: string) {
    try {
      // Get user's open jobs and work orders
      const openJobs = await this.db.job.findMany({
        where: {
          tenant_id: tenantId,
          technician_id: userId,
          status: {
            in: ['scheduled', 'in_progress', 'unassigned'],
          },
        },
      });

      const openWorkOrders = await this.db.workOrder.findMany({
        where: {
          tenant_id: tenantId,
          assigned_to: userId,
          status: {
            in: ['open', 'in_progress'],
          },
        },
      });

      // Reassign jobs if reassignToUserId is provided
      if (reassignToUserId && openJobs.length > 0) {
        await this.db.job.updateMany({
          where: {
            id: {
              in: openJobs.map(j => j.id),
            },
          },
          data: {
            technician_id: reassignToUserId,
          },
        });
      } else if (openJobs.length > 0) {
        // Unassign jobs if no reassignment target
        await this.db.job.updateMany({
          where: {
            id: {
              in: openJobs.map(j => j.id),
            },
          },
          data: {
            technician_id: null,
            status: 'unassigned',
          },
        });
      }

      // Reassign work orders if reassignToUserId is provided
      if (reassignToUserId && openWorkOrders.length > 0) {
        await this.db.workOrder.updateMany({
          where: {
            id: {
              in: openWorkOrders.map(wo => wo.id),
            },
          },
          data: {
            assigned_to: reassignToUserId,
          },
        });
      } else if (openWorkOrders.length > 0) {
        // Unassign work orders if no reassignment target
        await this.db.workOrder.updateMany({
          where: {
            id: {
              in: openWorkOrders.map(wo => wo.id),
            },
          },
          data: {
            assigned_to: null,
          },
        });
      }

      // Update user status
      const updatedUser = await this.db.user.update({
        where: { id: userId },
        data: {
          status: 'inactive',
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          status: true,
        },
      });

      return {
        user: updatedUser,
        reassigned: {
          jobs: reassignToUserId ? openJobs.length : 0,
          workOrders: reassignToUserId ? openWorkOrders.length : 0,
        },
        unassigned: {
          jobs: reassignToUserId ? 0 : openJobs.length,
          workOrders: reassignToUserId ? 0 : openWorkOrders.length,
        },
        message: `User deactivated successfully. ${reassignToUserId ? `Reassigned ${openJobs.length} jobs and ${openWorkOrders.length} work orders.` : `Unassigned ${openJobs.length} jobs and ${openWorkOrders.length} work orders.`}`,
      };
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  async updateUser(tenantId: string, userId: string, updateUserDto: any) {
    try {
      // Verify user belongs to tenant
      const existingUser = await this.db.user.findFirst({
        where: {
          id: userId,
          tenant_id: tenantId,
        },
      });

      if (!existingUser) {
        throw new Error('User not found or does not belong to tenant');
      }

      // Encrypt sensitive fields if provided
      const updateData: any = {};
      
      // Handle regular fields
      if (updateUserDto.first_name !== undefined) updateData.first_name = updateUserDto.first_name;
      if (updateUserDto.last_name !== undefined) updateData.last_name = updateUserDto.last_name;
      if (updateUserDto.phone !== undefined) updateData.phone = updateUserDto.phone || null;
      if (updateUserDto.employee_id !== undefined) updateData.employee_id = updateUserDto.employee_id || null;
      if (updateUserDto.hire_date !== undefined) updateData.hire_date = updateUserDto.hire_date ? new Date(updateUserDto.hire_date) : null;
      if (updateUserDto.position !== undefined) updateData.position = updateUserDto.position || null;
      if (updateUserDto.department !== undefined) updateData.department = updateUserDto.department || null;
      if (updateUserDto.employment_type !== undefined) updateData.employment_type = updateUserDto.employment_type || null;
      if (updateUserDto.status !== undefined) updateData.status = updateUserDto.status;
      if (updateUserDto.roles !== undefined) updateData.roles = updateUserDto.roles;
      if (updateUserDto.custom_permissions !== undefined) updateData.custom_permissions = updateUserDto.custom_permissions;
      if (updateUserDto.emergency_contact_name !== undefined) updateData.emergency_contact_name = updateUserDto.emergency_contact_name || null;
      if (updateUserDto.emergency_contact_phone !== undefined) updateData.emergency_contact_phone = updateUserDto.emergency_contact_phone || null;
      if (updateUserDto.emergency_contact_relationship !== undefined) updateData.emergency_contact_relationship = updateUserDto.emergency_contact_relationship || null;
      if (updateUserDto.address_line1 !== undefined) updateData.address_line1 = updateUserDto.address_line1 || null;
      if (updateUserDto.address_line2 !== undefined) updateData.address_line2 = updateUserDto.address_line2 || null;
      if (updateUserDto.city !== undefined) updateData.city = updateUserDto.city || null;
      if (updateUserDto.state !== undefined) updateData.state = updateUserDto.state || null;
      if (updateUserDto.postal_code !== undefined) updateData.postal_code = updateUserDto.postal_code || null;
      if (updateUserDto.country !== undefined) updateData.country = updateUserDto.country || null;
      if (updateUserDto.date_of_birth !== undefined) updateData.date_of_birth = updateUserDto.date_of_birth ? new Date(updateUserDto.date_of_birth) : null;
      if (updateUserDto.driver_license_state !== undefined) updateData.driver_license_state = updateUserDto.driver_license_state || null;
      if (updateUserDto.driver_license_expiry !== undefined) updateData.driver_license_expiry = updateUserDto.driver_license_expiry ? new Date(updateUserDto.driver_license_expiry) : null;
      if (updateUserDto.qualifications !== undefined) updateData.qualifications = updateUserDto.qualifications || [];
      if (updateUserDto.technician_number !== undefined) updateData.technician_number = updateUserDto.technician_number || null;
      if (updateUserDto.pesticide_license_number !== undefined) updateData.pesticide_license_number = updateUserDto.pesticide_license_number || null;
      if (updateUserDto.license_expiration_date !== undefined) updateData.license_expiration_date = updateUserDto.license_expiration_date ? new Date(updateUserDto.license_expiration_date) : null;

      // Encrypt sensitive fields if provided
      if (updateUserDto.social_security_number !== undefined) {
        updateData.social_security_number = updateUserDto.social_security_number 
          ? this.encryptionService.encrypt(updateUserDto.social_security_number)
          : null;
      }
      if (updateUserDto.driver_license_number !== undefined) {
        updateData.driver_license_number = updateUserDto.driver_license_number
          ? this.encryptionService.encrypt(updateUserDto.driver_license_number)
          : null;
      }

      // Update user in database
      const updatedUser = await this.db.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          employee_id: true,
          roles: true,
          status: true,
          hire_date: true,
          position: true,
          department: true,
          employment_type: true,
          custom_permissions: true,
          emergency_contact_name: true,
          emergency_contact_phone: true,
          emergency_contact_relationship: true,
          address_line1: true,
          address_line2: true,
          city: true,
          state: true,
          postal_code: true,
          country: true,
          date_of_birth: true,
          driver_license_state: true,
          driver_license_expiry: true,
          qualifications: true,
          technician_number: true,
          pesticide_license_number: true,
          license_expiration_date: true,
          created_at: true,
          updated_at: true,
        },
      });

      // Update roles in Supabase Auth metadata if roles changed
      if (updateUserDto.roles !== undefined) {
        try {
          await this.supabase.auth.admin.updateUserById(userId, {
            user_metadata: {
              first_name: updatedUser.first_name,
              last_name: updatedUser.last_name,
              tenant_id: tenantId,
              roles: updateUserDto.roles,
            },
          });
        } catch (error) {
          console.warn('Failed to update Supabase Auth metadata:', error);
          // Continue - local database update was successful
        }
      }

      return {
        user: {
          ...updatedUser,
          hire_date: updatedUser.hire_date?.toISOString() || null,
          date_of_birth: updatedUser.date_of_birth?.toISOString() || null,
          driver_license_expiry: updatedUser.driver_license_expiry?.toISOString() || null,
          license_expiration_date: updatedUser.license_expiration_date?.toISOString() || null,
          created_at: updatedUser.created_at.toISOString(),
          updated_at: updatedUser.updated_at.toISOString(),
        },
        message: 'User updated successfully',
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Decrypt sensitive fields for display (only when needed)
   * @param user User object with encrypted fields
   * @returns User object with decrypted sensitive fields
   */
  decryptSensitiveFields(user: any): any {
    const decrypted = { ...user };
    
    if (user.social_security_number) {
      try {
        decrypted.social_security_number = this.encryptionService.decrypt(user.social_security_number);
      } catch (error) {
        console.warn('Failed to decrypt SSN:', error);
        decrypted.social_security_number = null;
      }
    }
    
    if (user.driver_license_number) {
      try {
        decrypted.driver_license_number = this.encryptionService.decrypt(user.driver_license_number);
      } catch (error) {
        console.warn('Failed to decrypt driver license:', error);
        decrypted.driver_license_number = null;
      }
    }
    
    return decrypted;
  }
}
