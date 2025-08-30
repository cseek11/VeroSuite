import { Module } from '@nestjs/common';
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsPhoneNumber, IsUUID } from 'class-validator';
import { DatabaseService } from '../common/services/database.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GeocodingService } from '../common/services/geocoding.service';

// DTOs
export enum AccountType {
  COMMERCIAL = 'commercial',
  RESIDENTIAL = 'residential',
}

export class CreateAccountDto {
  @IsString() name!: string;
  @IsEnum(AccountType) account_type!: AccountType;
  @IsOptional() @IsPhoneNumber('US') phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() billing_address?: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

export class CreateLocationDto {
  @IsUUID() account_id!: string;
  @IsString() name!: string;
  @IsString() address_line1!: string;
  @IsOptional() @IsString() address_line2?: string;
  @IsString() city!: string;
  @IsString() state!: string;
  @IsString() postal_code!: string;
  @IsOptional() @IsUUID() service_area_id?: string;
}

// Service
export class CrmService {
  constructor(private db: DatabaseService, private geocoding: GeocodingService) {}

  async createAccount(dto: CreateAccountDto, tenantId: string) {
    return this.db.account.create({
      data: {
        tenant_id: tenantId,
        name: dto.name,
        account_type: dto.account_type,
        phone: dto.phone || null,
        email: dto.email || null,
        billing_address: dto.billing_address || {},
      },
    });
  }

  async createLocation(dto: CreateLocationDto, tenantId: string) {
    const account = await this.db.account.findFirst({ where: { id: dto.account_id, tenant_id: tenantId } });
    if (!account) throw new Error('Account not found');

    const fullAddress = `${dto.address_line1}, ${dto.city}, ${dto.state} ${dto.postal_code}`;
    const coords = await this.geocoding.geocodeAddress(fullAddress);

    return this.db.location.create({
      data: {
        tenant_id: tenantId,
        account_id: dto.account_id,
        name: dto.name,
        address_line1: dto.address_line1,
        address_line2: dto.address_line2 || null,
        city: dto.city,
        state: dto.state,
        postal_code: dto.postal_code,
        latitude: coords.latitude as any,
        longitude: coords.longitude as any,
        service_area_id: dto.service_area_id || null,
      },
    });
  }

  async getAccount(id: string, tenantId: string) {
    return this.db.account.findFirst({
      where: { id, tenant_id: tenantId },
      include: {
        locations: true,
        workOrders: {
          include: {
            jobs: { where: { status: { in: ['scheduled', 'in_progress'] } }, orderBy: { scheduled_date: 'asc' }, take: 5 },
          },
        },
      },
    });
  }

  async listAccounts(tenantId: string, search?: string) {
    return this.db.account.findMany({
      where: {
        tenant_id: tenantId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
          ],
        }),
      },
      include: {
        locations: { select: { id: true, name: true, city: true, state: true } },
      },
      orderBy: { name: 'asc' },
      take: 50,
    });
  }

  async listLocationsForAccount(accountId: string, tenantId: string) {
    return this.db.location.findMany({
      where: { tenant_id: tenantId, account_id: accountId },
      orderBy: { name: 'asc' },
    });
  }

  // Customer Notes CRUD Operations
  async getCustomerNotes(customerId: string, tenantId: string) {
    return this.db.customerNote.findMany({
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
    const note = await this.db.customerNote.findFirst({
      where: {
        id: noteId,
        tenant_id: tenantId,
      },
    });

    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  }

  async createCustomerNote(customerId: string, dto: any, tenantId: string, userId: string) {
    // Get user info for created_by field
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { first_name: true, last_name: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.db.customerNote.create({
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
        technician_id: dto.technician_id,
        work_order_id: dto.work_order_id,
        location_coords: dto.location_coords,
      },
    });
  }

  async updateCustomerNote(noteId: string, dto: any, tenantId: string) {
    // Check if note exists and belongs to tenant
    await this.getCustomerNote(noteId, tenantId);

    return this.db.customerNote.update({
      where: { id: noteId },
      data: {
        note_type: dto.note_type,
        note_source: dto.note_source,
        note_content: dto.note_content,
        priority: dto.priority,
        is_alert: dto.is_alert,
        is_internal: dto.is_internal,
        technician_id: dto.technician_id,
        work_order_id: dto.work_order_id,
        location_coords: dto.location_coords,
      },
    });
  }

  async deleteCustomerNote(noteId: string, tenantId: string) {
    // Check if note exists and belongs to tenant
    await this.getCustomerNote(noteId, tenantId);

    return this.db.customerNote.delete({
      where: { id: noteId },
    });
  }
}

// Controller
@ApiTags('CRM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/crm')
export class CrmController {
  constructor(private readonly crm: CrmService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'List accounts' })
  @ApiQuery({ name: 'search', required: false })
  async listAccounts(@Query('search') search: string, @Request() req: any) {
    return this.crm.listAccounts(req.user.tenantId, search);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Create account' })
  async createAccount(@Body() dto: CreateAccountDto, @Request() req: any) {
    return this.crm.createAccount(dto, req.user.tenantId);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get account details' })
  async getAccount(@Param('id') id: string, @Request() req: any) {
    return this.crm.getAccount(id, req.user.tenantId);
  }

  @Get('accounts/:id/locations')
  @ApiOperation({ summary: 'List locations for account' })
  async listAccountLocations(@Param('id') id: string, @Request() req: any) {
    return this.crm.listLocationsForAccount(id, req.user.tenantId);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Create location' })
  async createLocation(@Body() dto: CreateLocationDto, @Request() req: any) {
    return this.crm.createLocation(dto, req.user.tenantId);
  }

  // Customer Notes Endpoints
  @Get('accounts/:customerId/notes')
  @ApiOperation({ summary: 'Get all notes for a customer' })
  async getCustomerNotes(@Param('customerId') customerId: string, @Request() req: any) {
    return this.crm.getCustomerNotes(customerId, req.user.tenantId);
  }

  @Get('notes/:noteId')
  @ApiOperation({ summary: 'Get a specific note by ID' })
  async getCustomerNote(@Param('noteId') noteId: string, @Request() req: any) {
    return this.crm.getCustomerNote(noteId, req.user.tenantId);
  }

  @Post('accounts/:customerId/notes')
  @ApiOperation({ summary: 'Create a new note for a customer' })
  async createCustomerNote(
    @Param('customerId') customerId: string,
    @Body() createNoteDto: any,
    @Request() req: any
  ) {
    return this.crm.createCustomerNote(customerId, createNoteDto, req.user.tenantId, req.user.id);
  }

  @Put('notes/:noteId')
  @ApiOperation({ summary: 'Update an existing note' })
  async updateCustomerNote(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: any,
    @Request() req: any
  ) {
    return this.crm.updateCustomerNote(noteId, updateNoteDto, req.user.tenantId);
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: 'Delete a note' })
  async deleteCustomerNote(@Param('noteId') noteId: string, @Request() req: any) {
    return this.crm.deleteCustomerNote(noteId, req.user.tenantId);
  }
}

// Module
@Module({
  providers: [CrmService, DatabaseService, GeocodingService],
  controllers: [CrmController],
})
export class CrmModule {}
