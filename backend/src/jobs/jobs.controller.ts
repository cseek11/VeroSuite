import { Controller, Get, Post, Put, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { 
  CreateJobDto, 
  AssignJobDto
} from './dto';
import { UpdatePhotosDto, PhotoDto } from './dto/index';
import { StartJobDto, CompleteJobDto } from './jobs.actions';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's jobs" })
  @ApiQuery({ name: 'technician_id', required: false })
  async getToday(@Query('technician_id') technicianId: string, @Request() req: any) {
    return this.jobsService.getTodaysJobs(req.user.tenantId, technicianId);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign job to technician' })
  async assign(@Body() dto: AssignJobDto, @Request() req: any) {
    return this.jobsService.assignJob(dto, req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by id' })
  async getById(@Param('id') id: string, @Request() req: any) {
    return this.jobsService.getJobById(id, req.user.tenantId);
  }

  @Put(':id/start')
  @ApiOperation({ summary: 'Start a job (technician mobile)' })
  async start(@Param('id') id: string, @Body() dto: StartJobDto, @Request() req: any) {
    return this.jobsService.startJob(id, dto.gps_location, req.user.tenantId);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete a job with service details' })
  async complete(@Param('id') id: string, @Body() dto: CompleteJobDto, @Request() req: any) {
    return this.jobsService.completeJob(id, dto, req.user.tenantId);
  }

  @Put(':id/photos')
  @ApiOperation({ summary: 'Replace photos collection for a job' })
  async updatePhotos(@Param('id') id: string, @Body() updatePhotosDto: UpdatePhotosDto, @Request() req: any) {
    return this.jobsService.updatePhotos(id, updatePhotosDto.photos.map((p: PhotoDto) => p.url), req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create job' })
  async create(@Body() dto: CreateJobDto, @Request() req: any) {
    return this.jobsService.createJob(dto, req.user.tenantId);
  }
}
