import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Header,
  UseInterceptors
} from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { 
  CreateTechnicianProfileDto, 
  UpdateTechnicianProfileDto,
  TechnicianQueryDto,
  TechnicianProfileResponseDto,
  TechnicianListResponseDto,
  GetAvailabilityQueryDto,
  CreateAvailabilityDto
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

/**
 * Technician API v2 Controller
 * 
 * Enhanced endpoints with:
 * - Consistent response format with metadata
 * - Idempotency support
 * - Better error responses
 */
@Controller({ path: 'technicians', version: '2' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(IdempotencyInterceptor)
export class TechnicianV2Controller {
  constructor(private readonly technicianService: TechnicianService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('API-Version', '2.0')
  async createTechnicianProfile(
    @Request() req: any,
    @Body() createDto: CreateTechnicianProfileDto
  ): Promise<any> {
    const tenantId = req.tenantId;
    const result = await this.technicianService.createTechnicianProfile(tenantId, createDto);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get()
  @Header('API-Version', '2.0')
  async getTechnicianProfiles(
    @Request() req: any,
    @Query() query: TechnicianQueryDto
  ): Promise<any> {
    const tenantId = req.tenantId;
    const result = await this.technicianService.getTechnicianProfiles(tenantId, query);
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
  @Header('API-Version', '2.0')
  async getTechnicianProfile(
    @Request() req: any,
    @Param('id') id: string
  ): Promise<any> {
    const tenantId = req.tenantId;
    const result = await this.technicianService.getTechnicianProfile(tenantId, id);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put(':id')
  @Header('API-Version', '2.0')
  async updateTechnicianProfile(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateTechnicianProfileDto
  ): Promise<any> {
    const tenantId = req.tenantId;
    const result = await this.technicianService.updateTechnicianProfile(tenantId, id, updateDto);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('API-Version', '2.0')
  async deleteTechnicianProfile(
    @Request() req: any,
    @Param('id') id: string
  ): Promise<any> {
    const tenantId = req.tenantId;
    await this.technicianService.deleteTechnicianProfile(tenantId, id);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('dashboard/stats')
  @Header('API-Version', '2.0')
  async getDashboardStats(@Request() req: any) {
    const tenantId = req.tenantId;
    const result = await this.technicianService.getDashboardStats(tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('dashboard/performance')
  @Header('API-Version', '2.0')
  async getPerformanceMetrics(@Request() req: any) {
    const tenantId = req.tenantId;
    const result = await this.technicianService.getPerformanceMetrics(tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('dashboard/availability')
  @Header('API-Version', '2.0')
  async getAvailabilityData(@Request() req: any) {
    const tenantId = req.tenantId;
    const result = await this.technicianService.getAvailabilityData(tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/availability')
  @Header('API-Version', '2.0')
  async getTechnicianAvailability(
    @Request() req: any,
    @Param('id') id: string,
    @Query() query: GetAvailabilityQueryDto
  ) {
    const tenantId = req.tenantId;
    const result = await this.technicianService.getTechnicianAvailability(
      tenantId,
      id,
      query.start_date,
      query.end_date
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post(':id/availability')
  @Header('API-Version', '2.0')
  async setAvailability(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateAvailabilityDto
  ) {
    const tenantId = req.tenantId;
    const result = await this.technicianService.setAvailability(
      tenantId,
      id,
      dto.day_of_week,
      dto.start_time,
      dto.end_time,
      dto.is_active ?? true
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('available')
  @Header('API-Version', '2.0')
  async getAvailableTechnicians(
    @Request() req: any,
    @Query() query: { date: string; start_time: string; end_time: string }
  ) {
    const tenantId = req.tenantId;
    const result = await this.technicianService.getAvailableTechnicians(
      tenantId,
      query.date,
      query.start_time,
      query.end_time
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }
}


