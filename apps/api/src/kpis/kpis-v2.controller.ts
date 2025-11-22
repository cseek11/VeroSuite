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
  Header,
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
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

/**
 * KPIs API v2 Controller
 * 
 * Enhanced endpoints with:
 * - Consistent response format with metadata
 * - Idempotency support
 * - Better error responses
 */
@ApiTags('KPIs V2')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'kpis', version: '2' })
@UseInterceptors(IdempotencyInterceptor)
export class KPIsV2Controller {
  constructor(private readonly kpisService: KPIsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new KPI configuration (V2)' })
  @ApiResponse({ status: 201, description: 'KPI created successfully', type: KPIResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Header('API-Version', '2.0')
  async createKPI(@Request() req: any, @Body() createKPIDto: CreateKPIDto): Promise<any> {
    const result = await this.kpisService.createKPI(req.user.tenantId, req.user.userId, createKPIDto);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all KPI configurations for the tenant (V2)' })
  @ApiResponse({ status: 200, description: 'KPIs retrieved successfully', type: [KPIResponseDto] })
  @Header('API-Version', '2.0')
  async getKPIs(@Request() req: any): Promise<any> {
    const result = await this.kpisService.getKPIs(req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('user')
  @ApiOperation({ summary: 'Get current user\'s saved KPIs (user_kpis) (V2)' })
  @ApiResponse({ status: 200, description: 'User KPIs retrieved successfully' })
  @Header('API-Version', '2.0')
  async getUserKPIs(@Request() req: any): Promise<any> {
    const result = await this.kpisService.getUserKPIs(req.user.tenantId, req.user.userId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific KPI configuration (V2)' })
  @ApiResponse({ status: 200, description: 'KPI retrieved successfully', type: KPIResponseDto })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @Header('API-Version', '2.0')
  async getKPI(@Request() req: any, @Param('id', ParseUUIDPipe) id: string): Promise<any> {
    const result = await this.kpisService.getKPI(req.user.tenantId, id);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a KPI configuration (V2)' })
  @ApiResponse({ status: 200, description: 'KPI updated successfully', type: KPIResponseDto })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Header('API-Version', '2.0')
  async updateKPI(
    @Request() req: any, 
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateKPIDto: UpdateKPIDto
  ): Promise<any> {
    const result = await this.kpisService.updateKPI(req.user.tenantId, id, updateKPIDto);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a KPI configuration (V2)' })
  @ApiResponse({ status: 200, description: 'KPI deleted successfully' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @Header('API-Version', '2.0')
  async deleteKPI(@Request() req: any, @Param('id', ParseUUIDPipe) id: string): Promise<any> {
    await this.kpisService.deleteKPI(req.user.tenantId, id);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('data/current')
  @ApiOperation({ summary: 'Get current KPI data values (V2)' })
  @ApiResponse({ status: 200, description: 'KPI data retrieved successfully', type: [KPIDataResponseDto] })
  @ApiQuery({ name: 'kpiId', required: false, description: 'Specific KPI ID to filter by' })
  @Header('API-Version', '2.0')
  async getKPIData(
    @Request() req: any, 
    @Query('kpiId') kpiId?: string
  ): Promise<any> {
    const result = await this.kpisService.getKPIData(req.user.tenantId, kpiId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get KPI trends over time (V2)' })
  @ApiResponse({ status: 200, description: 'KPI trends retrieved successfully', type: [KPITrendResponseDto] })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (1h, 24h, 7d, 30d)', example: '24h' })
  @Header('API-Version', '2.0')
  async getKPITrends(
    @Request() req: any, 
    @Query('period') period: string = '24h'
  ): Promise<any> {
    const result = await this.kpisService.getKPITrends(req.user.tenantId, period);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post(':id/drill-down')
  @ApiOperation({ summary: 'Get drill-down data for a specific KPI (V2)' })
  @ApiResponse({ status: 200, description: 'Drill-down data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @Header('API-Version', '2.0')
  async getDrillDownData(
    @Request() req: any, 
    @Param('id', ParseUUIDPipe) id: string,
    @Body() filters: Record<string, any>
  ): Promise<any> {
    const result = await this.kpisService.getDrillDownData(req.user.tenantId, id, filters);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }
}


