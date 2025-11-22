import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../common/services/database.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class CrmService {
  private supabase;
  private readonly logger = new Logger(CrmService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: DatabaseService,
  ) {
    // Initialize Supabase client for direct database access
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SECRET_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    this.logger.log('Initializing Supabase client', {
      operation: 'crm-service-init',
      url: supabaseUrl,
      keyType: supabaseKey.startsWith('sb_secret_') ? 'Secret Key' : 'Other',
    });
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAccounts(tenantId?: string) {
    const traceId = randomUUID();
    try {
      this.logger.debug('getAccounts called', {
        operation: 'get-accounts',
        traceId,
        tenantId,
      });
      
      // Test Supabase connection first
      const { error: testError } = await this.supabase
        .from('accounts')
        .select('count')
        .limit(1);
      
      if (testError) {
        this.logger.error('Supabase connection test failed', {
          operation: 'get-accounts',
          traceId,
          error: testError.message,
        });
        throw new BadRequestException(`Supabase connection failed: ${testError.message}`);
      }
      
      // Fetch accounts from Supabase with proper tenant filtering
      const { data, error } = await this.supabase
        .from('accounts')
        .select('*')
        .order('name');

      if (error) {
        this.logger.error('Error fetching accounts', {
          operation: 'get-accounts',
          traceId,
          error: error.message,
        });
        throw new BadRequestException(`Failed to fetch accounts: ${error.message}`);
      }

      // If tenantId is provided, filter by tenant (additional security layer)
      if (tenantId) {
        const filteredData = data.filter(account => account.tenant_id === tenantId);
        this.logger.debug('Accounts filtered by tenant', {
          operation: 'get-accounts',
          traceId,
          tenantId,
          accountCount: filteredData.length,
        });
        return filteredData;
      }

      this.logger.debug('Accounts fetched successfully', {
        operation: 'get-accounts',
        traceId,
        accountCount: data?.length || 0,
      });

      return data || [];
    } catch (error) {
      this.logger.error('Error in getAccounts', {
        operation: 'get-accounts',
        traceId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch accounts: ${errorMessage}`);
    }
  }

  async createAccount(accountData: any, tenantId: string) {
    const traceId = randomUUID();
    try {
      this.logger.debug('Creating account', {
        operation: 'create-account',
        traceId,
        tenantId,
      });
      
      // Ensure tenant_id is set
      const accountWithTenant = {
        ...accountData,
        tenant_id: tenantId
      };
      
      // Try using Prisma instead of Supabase for INSERT operations
      // This bypasses the materialized view issue
      const account = await this.prisma.account.create({
        data: accountWithTenant
      });
      
      this.logger.log('Account created successfully', {
        operation: 'create-account',
        traceId,
        tenantId,
        accountId: account.id,
      });
      
      return account;
    } catch (error) {
      this.logger.error('Error in createAccount', {
        operation: 'create-account',
        traceId,
        tenantId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to create account: ${errorMessage}`);
    }
  }

  async testSupabaseConnection() {
    const traceId = randomUUID();
    try {
      this.logger.debug('Testing Supabase connection', {
        operation: 'test-supabase-connection',
        traceId,
      });
      
      const { error } = await this.supabase
        .from('accounts')
        .select('count')
        .limit(1);
      
      if (error) {
        this.logger.error('Supabase connection test failed', {
          operation: 'test-supabase-connection',
          traceId,
          error: error.message,
        });
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
      
      this.logger.log('Supabase connection test successful', {
        operation: 'test-supabase-connection',
        traceId,
      });
      
      return { success: true, message: 'Supabase connection working' };
    } catch (error) {
      this.logger.error('Supabase connection test error', {
        operation: 'test-supabase-connection',
        traceId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
      });
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
        id: randomUUID(),
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
