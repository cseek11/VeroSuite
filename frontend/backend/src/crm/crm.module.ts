import { Module } from '@nestjs/common';
import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
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
  @IsString() name: string;
  @IsEnum(AccountType) account_type: AccountType;
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
  @IsUUID() account_id: string;
  @IsString() name: string;
  @IsString() address_line1: string;
  @IsOptional() @IsString() address_line2?: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() postal_code: string;
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
        phone: dto.phone,
        email: dto.email,
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
        address_line2: dto.address_line2,
        city: dto.city,
        state: dto.state,
        postal_code: dto.postal_code,
        latitude: coords.latitude as any,
        longitude: coords.longitude as any,
        service_area_id: dto.service_area_id,
      },
    });
  }

  async getAccount(id: string, tenantId: string) {
    return this.db.account.findFirst({
      where: { id, tenant_id: tenantId },
      include: {
        locations: true,
        work_orders: {
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
}

// Module
@Module({
  providers: [CrmService, DatabaseService, GeocodingService],
  controllers: [CrmController],
})
export class CrmModule {}
