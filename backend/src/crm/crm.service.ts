import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CrmService {
  private supabase;

  constructor(private readonly prisma: DatabaseService) {
    // Initialize Supabase client for direct database access
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    console.log('CRM Service - Initializing Supabase client with URL:', supabaseUrl);
    console.log('CRM Service - Using key type:', supabaseKey.startsWith('sb_secret_') ? 'Secret Key' : 'Other');
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAccounts(tenantId?: string) {
    try {
      console.log('CRM Service - getAccounts called with tenantId:', tenantId);
      console.log('CRM Service - Supabase client initialized:', !!this.supabase);
      
      // Test Supabase connection first
      console.log('CRM Service - Testing Supabase connection...');
      const { error: testError } = await this.supabase
        .from('accounts')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('CRM Service - Supabase connection test failed:', testError);
        throw new BadRequestException(`Supabase connection failed: ${testError.message}`);
      }
      
      console.log('CRM Service - Supabase connection test successful');
      
      // Fetch accounts from Supabase with proper tenant filtering
      const { data, error } = await this.supabase
        .from('accounts')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching accounts:', error);
        throw new BadRequestException(`Failed to fetch accounts: ${error.message}`);
      }

      console.log('CRM Service - Fetched accounts:', data?.length || 0);

      // If tenantId is provided, filter by tenant (additional security layer)
      if (tenantId) {
        const filteredData = data.filter(account => account.tenant_id === tenantId);
        console.log('CRM Service - Filtered accounts for tenant:', filteredData.length);
        return filteredData;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAccounts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch accounts: ${errorMessage}`);
    }
  }

  async createAccount(accountData: any, tenantId: string) {
    try {
      console.log('CRM Service - Creating account for tenant:', tenantId);
      console.log('CRM Service - Account data:', accountData);
      
      // Ensure tenant_id is set
      const accountWithTenant = {
        ...accountData,
        tenant_id: tenantId
      };
      
      // Try using Prisma instead of Supabase for INSERT operations
      // This bypasses the materialized view issue
      console.log('CRM Service - Using Prisma for account creation...');
      
      const account = await this.prisma.account.create({
        data: accountWithTenant
      });
      
      console.log('CRM Service - Account created successfully via Prisma:', account.id);
      return account;
    } catch (error) {
      console.error('Error in createAccount:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to create account: ${errorMessage}`);
    }
  }

  async testSupabaseConnection() {
    try {
      console.log('CRM Service - Testing Supabase connection...');
      console.log('CRM Service - Supabase client initialized:', !!this.supabase);
      
      const { error } = await this.supabase
        .from('accounts')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('CRM Service - Supabase connection test failed:', error);
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
      
      console.log('CRM Service - Supabase connection test successful');
      return { success: true, message: 'Supabase connection working' };
    } catch (error) {
      console.error('CRM Service - Supabase connection test error:', error);
      throw error;
    }
  }

  // Customer Notes CRUD Operations
  async getCustomerNotes(customerId: string, tenantId: string) {
    return this.prisma.customerNote.findMany({
      where: {
        tenant_id: tenantId,
        customer_id: customerId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getCustomerNote(noteId: string, tenantId: string) {
    const note = await this.prisma.customerNote.findFirst({
      where: {
        id: noteId,
        tenant_id: tenantId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async createCustomerNote(customerId: string, dto: CreateNoteDto, tenantId: string, userId: string) {
    // Get user info for created_by field
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { first_name: true, last_name: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.prisma.customerNote.create({
      data: {
        tenant_id: tenantId,
        customer_id: customerId,
        note_type: dto.note_type,
        note_source: dto.note_source || 'office',
        note_content: dto.note_content,
        created_by: `${user.first_name} ${user.last_name}`,
        priority: dto.priority || 'low',
        is_alert: dto.is_alert || false,
        is_internal: dto.is_internal || false,
        technician_id: dto.technician_id || null,
        work_order_id: dto.work_order_id || null,
        location_coords: dto.location_coords || null,
      },
    });
  }

  async updateCustomerNote(noteId: string, dto: UpdateNoteDto, tenantId: string) {
    // Check if note exists and belongs to tenant
    await this.getCustomerNote(noteId, tenantId);

    // Build update data object, only including defined values
    const updateData: any = {};
    
    if (dto.note_type !== undefined) updateData.note_type = dto.note_type;
    if (dto.note_source !== undefined) updateData.note_source = dto.note_source;
    if (dto.note_content !== undefined) updateData.note_content = dto.note_content;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.is_alert !== undefined) updateData.is_alert = dto.is_alert;
    if (dto.is_internal !== undefined) updateData.is_internal = dto.is_internal;
    if (dto.technician_id !== undefined) updateData.technician_id = dto.technician_id || null;
    if (dto.work_order_id !== undefined) updateData.work_order_id = dto.work_order_id || null;
    if (dto.location_coords !== undefined) updateData.location_coords = dto.location_coords || null;

    return this.prisma.customerNote.update({
      where: { id: noteId },
      data: updateData,
    });
  }

  async deleteCustomerNote(noteId: string, tenantId: string) {
    // Check if note exists and belongs to tenant
    await this.getCustomerNote(noteId, tenantId);

    return this.prisma.customerNote.delete({
      where: { id: noteId },
    });
  }
}
