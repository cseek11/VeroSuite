import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AgreementsService } from './agreements.service';
import { CreateServiceAgreementDto, UpdateServiceAgreementDto } from './dto';
import { ServiceAgreementStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Agreements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'agreements', version: '1' })
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service agreement' })
  @ApiResponse({ status: 201, description: 'Agreement created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Account or service type not found' })
  async create(@Body() createAgreementDto: CreateServiceAgreementDto, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const userId = req.user?.userId || 'system';
    
    return this.agreementsService.create(createAgreementDto, tenantId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service agreements' })
  @ApiResponse({ status: 200, description: 'Agreements retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: ServiceAgreementStatus, description: 'Filter by status' })
  async findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ServiceAgreementStatus,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.agreementsService.findAll(tenantId, page, limit, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get agreement statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.agreementsService.getAgreementStats(tenantId);
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get agreements expiring soon' })
  @ApiResponse({ status: 200, description: 'Expiring agreements retrieved successfully' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Days ahead to check (default: 30)' })
  async getExpiring(
    @Request() req: any,
    @Query('days', new ParseIntPipe({ optional: true })) days: number = 30,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.agreementsService.getExpiringAgreements(tenantId, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service agreement by ID' })
  @ApiResponse({ status: 200, description: 'Agreement retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.agreementsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service agreement' })
  @ApiResponse({ status: 200, description: 'Agreement updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAgreementDto: UpdateServiceAgreementDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const userId = req.user?.userId || 'system';
    
    return this.agreementsService.update(id, updateAgreementDto, tenantId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service agreement' })
  @ApiResponse({ status: 200, description: 'Agreement deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete agreement with invoices' })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.agreementsService.remove(id, tenantId);
  }
}
