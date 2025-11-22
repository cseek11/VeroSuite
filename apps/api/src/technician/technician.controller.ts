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
import { DeprecationInterceptor } from '../common/interceptors/deprecation.interceptor';

@Controller({ path: 'technicians', version: '1' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(DeprecationInterceptor)
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTechnicianProfile(
    @Request() req: any,
    @Body() createDto: CreateTechnicianProfileDto
  ): Promise<TechnicianProfileResponseDto> {
    const tenantId = req.tenantId;
    return this.technicianService.createTechnicianProfile(tenantId, createDto);
  }

  @Get()
  async getTechnicianProfiles(
    @Request() req: any,
    @Query() query: TechnicianQueryDto
  ): Promise<TechnicianListResponseDto> {
    const tenantId = req.tenantId;
    return this.technicianService.getTechnicianProfiles(tenantId, query);
  }

  @Get(':id')
  async getTechnicianProfile(
    @Request() req: any,
    @Param('id') id: string
  ): Promise<TechnicianProfileResponseDto> {
    const tenantId = req.tenantId;
    return this.technicianService.getTechnicianProfile(tenantId, id);
  }

  @Put(':id')
  async updateTechnicianProfile(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateTechnicianProfileDto
  ): Promise<TechnicianProfileResponseDto> {
    const tenantId = req.tenantId;
    return this.technicianService.updateTechnicianProfile(tenantId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTechnicianProfile(
    @Request() req: any,
    @Param('id') id: string
  ): Promise<void> {
    const tenantId = req.tenantId;
    return this.technicianService.deleteTechnicianProfile(tenantId, id);
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Request() req: any) {
    const tenantId = req.tenantId;
    return this.technicianService.getDashboardStats(tenantId);
  }

  @Get('dashboard/performance')
  async getPerformanceMetrics(@Request() req: any) {
    const tenantId = req.tenantId;
    return this.technicianService.getPerformanceMetrics(tenantId);
  }

  @Get('dashboard/availability')
  async getAvailabilityData(@Request() req: any) {
    const tenantId = req.tenantId;
    return this.technicianService.getAvailabilityData(tenantId);
  }

  // ===== AVAILABILITY MANAGEMENT ENDPOINTS =====

  @Get(':id/availability')
  async getTechnicianAvailability(
    @Request() req: any,
    @Param('id') id: string,
    @Query() query: GetAvailabilityQueryDto
  ) {
    const tenantId = req.tenantId;
    return this.technicianService.getTechnicianAvailability(
      tenantId,
      id,
      query.start_date,
      query.end_date
    );
  }

  @Post(':id/availability')
  async setAvailability(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateAvailabilityDto
  ) {
    const tenantId = req.tenantId;
    return this.technicianService.setAvailability(
      tenantId,
      id,
      dto.day_of_week,
      dto.start_time,
      dto.end_time,
      dto.is_active ?? true
    );
  }

  @Get('available')
  async getAvailableTechnicians(
    @Request() req: any,
    @Query() query: { date: string; start_time: string; end_time: string }
  ) {
    const tenantId = req.tenantId;
    return this.technicianService.getAvailableTechnicians(
      tenantId,
      query.date,
      query.start_time,
      query.end_time
    );
  }
}
