import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  Query,
  ParseUUIDPipe,
  UseInterceptors
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { KPIsService } from './kpis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateKPIDto, UpdateKPIDto, KPIResponseDto, KPIDataResponseDto, KPITrendResponseDto } from './dto';
import { DeprecationInterceptor } from '../common/interceptors/deprecation.interceptor';

@ApiTags('KPIs V1 (Deprecated)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'kpis', version: '1' })
@UseInterceptors(DeprecationInterceptor)
export class KPIsController {
  constructor(private readonly kpisService: KPIsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new KPI configuration' })
  @ApiResponse({ status: 201, description: 'KPI created successfully', type: KPIResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createKPI(@Request() req: any, @Body() createKPIDto: CreateKPIDto): Promise<KPIResponseDto> {
    return this.kpisService.createKPI(req.user.tenantId, req.user.userId, createKPIDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all KPI configurations for the tenant' })
  @ApiResponse({ status: 200, description: 'KPIs retrieved successfully', type: [KPIResponseDto] })
  async getKPIs(@Request() req: any): Promise<KPIResponseDto[]> {
    return this.kpisService.getKPIs(req.user.tenantId);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get current user\'s saved KPIs (user_kpis)' })
  @ApiResponse({ status: 200, description: 'User KPIs retrieved successfully' })
  async getUserKPIs(@Request() req: any): Promise<any[]> {
    return this.kpisService.getUserKPIs(req.user.tenantId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific KPI configuration' })
  @ApiResponse({ status: 200, description: 'KPI retrieved successfully', type: KPIResponseDto })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  async getKPI(@Request() req: any, @Param('id', ParseUUIDPipe) id: string): Promise<KPIResponseDto> {
    return this.kpisService.getKPI(req.user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a KPI configuration' })
  @ApiResponse({ status: 200, description: 'KPI updated successfully', type: KPIResponseDto })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateKPI(
    @Request() req: any, 
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateKPIDto: UpdateKPIDto
  ): Promise<KPIResponseDto> {
    return this.kpisService.updateKPI(req.user.tenantId, id, updateKPIDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a KPI configuration' })
  @ApiResponse({ status: 200, description: 'KPI deleted successfully' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  async deleteKPI(@Request() req: any, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.kpisService.deleteKPI(req.user.tenantId, id);
  }

  @Get('data/current')
  @ApiOperation({ summary: 'Get current KPI data values' })
  @ApiResponse({ status: 200, description: 'KPI data retrieved successfully', type: [KPIDataResponseDto] })
  @ApiQuery({ name: 'kpiId', required: false, description: 'Specific KPI ID to filter by' })
  async getKPIData(
    @Request() req: any, 
    @Query('kpiId') kpiId?: string
  ): Promise<KPIDataResponseDto[]> {
    return this.kpisService.getKPIData(req.user.tenantId, kpiId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get KPI trends over time' })
  @ApiResponse({ status: 200, description: 'KPI trends retrieved successfully', type: [KPITrendResponseDto] })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (1h, 24h, 7d, 30d)', example: '24h' })
  async getKPITrends(
    @Request() req: any, 
    @Query('period') period: string = '24h'
  ): Promise<KPITrendResponseDto[]> {
    return this.kpisService.getKPITrends(req.user.tenantId, period);
  }

  @Post(':id/drill-down')
  @ApiOperation({ summary: 'Get drill-down data for a specific KPI' })
  @ApiResponse({ status: 200, description: 'Drill-down data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  async getDrillDownData(
    @Request() req: any, 
    @Param('id', ParseUUIDPipe) id: string,
    @Body() filters: Record<string, any>
  ): Promise<any> {
    return this.kpisService.getDrillDownData(req.user.tenantId, id, filters);
  }
}
