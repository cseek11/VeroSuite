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
  HttpStatus
} from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { 
  CreateTechnicianProfileDto, 
  UpdateTechnicianProfileDto,
  TechnicianQueryDto,
  TechnicianProfileResponseDto,
  TechnicianListResponseDto
} from './dto/technician.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('technicians')
@UseGuards(JwtAuthGuard)
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
}
