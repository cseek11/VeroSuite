import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ServiceTypesService } from './service-types.service';
import { CreateServiceTypeDto, UpdateServiceTypeDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('service-types')
@ApiBearerAuth()
@Controller({ path: 'service-types', version: '1' })
@UseGuards(JwtAuthGuard)
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service type' })
  @ApiResponse({ status: 201, description: 'Service type created successfully' })
  async create(@Request() req: any, @Body() createServiceTypeDto: CreateServiceTypeDto) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.serviceTypesService.create(createServiceTypeDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service types' })
  @ApiResponse({ status: 200, description: 'Service types retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean, description: 'Filter by active status' })
  async findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('is_active') isActive?: string,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.serviceTypesService.findAll(tenantId, page, limit, isActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service type by ID' })
  @ApiResponse({ status: 200, description: 'Service type retrieved successfully' })
  async findOne(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.serviceTypesService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service type' })
  @ApiResponse({ status: 200, description: 'Service type updated successfully' })
  async update(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.serviceTypesService.update(id, updateServiceTypeDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service type' })
  @ApiResponse({ status: 200, description: 'Service type deleted successfully' })
  async remove(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.serviceTypesService.remove(id, tenantId);
  }
}
