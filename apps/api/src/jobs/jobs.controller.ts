import { Controller, Get, Post, Put, Delete, Body, Query, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { 
  CreateJobDto, 
  AssignJobDto,
  CheckConflictsDto,
  ConflictResponseDto,
  CreateRecurringJobTemplateDto,
  UpdateRecurringJobTemplateDto,
  GenerateRecurringJobsDto,
  RecurringJobTemplateResponseDto
} from './dto';
import { UpdatePhotosDto, PhotoDto } from './dto/index';
import { StartJobDto, CompleteJobDto } from './jobs.actions';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'jobs', version: '1' })
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

  @Post('check-conflicts')
  @ApiOperation({ summary: 'Check for scheduling conflicts before assigning a job' })
  async checkConflicts(@Body() dto: CheckConflictsDto, @Request() req: any): Promise<ConflictResponseDto> {
    const scheduledDate = new Date(dto.scheduled_date);
    return this.jobsService.checkConflicts(
      dto.technician_id,
      scheduledDate,
      dto.scheduled_start_time,
      dto.scheduled_end_time,
      req.user.tenantId,
      dto.exclude_job_ids || []
    );
  }

  // ===== RECURRING JOBS ENDPOINTS =====

  @Post('recurring')
  @ApiOperation({ summary: 'Create a recurring job template' })
  async createRecurringTemplate(
    @Body() dto: CreateRecurringJobTemplateDto,
    @Request() req: any
  ): Promise<RecurringJobTemplateResponseDto> {
    return this.jobsService.createRecurringJobTemplate(dto, req.user.tenantId);
  }

  @Get('recurring')
  @ApiOperation({ summary: 'Get all recurring job templates' })
  @ApiQuery({ name: 'active_only', required: false, type: Boolean })
  async getRecurringTemplates(
    @Query('active_only') activeOnly: boolean,
    @Request() req: any
  ): Promise<RecurringJobTemplateResponseDto[]> {
    return this.jobsService.getRecurringJobTemplates(req.user.tenantId, activeOnly);
  }

  @Get('recurring/:id')
  @ApiOperation({ summary: 'Get a recurring job template by ID' })
  async getRecurringTemplate(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<RecurringJobTemplateResponseDto> {
    const templates = await this.jobsService.getRecurringJobTemplates(req.user.tenantId, false);
    const template = templates.find(t => t.id === id);
    if (!template) {
      throw new NotFoundException('Recurring job template not found');
    }
    return template;
  }

  @Put('recurring/:id')
  @ApiOperation({ summary: 'Update a recurring job template' })
  async updateRecurringTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateRecurringJobTemplateDto,
    @Request() req: any
  ): Promise<RecurringJobTemplateResponseDto> {
    return this.jobsService.updateRecurringJobTemplate(id, dto, req.user.tenantId);
  }

  @Delete('recurring/:id')
  @ApiOperation({ summary: 'Delete a recurring job template' })
  @ApiQuery({ name: 'delete_all_jobs', required: false, type: Boolean })
  async deleteRecurringTemplate(
    @Param('id') id: string,
    @Query('delete_all_jobs') deleteAllJobs: boolean,
    @Request() req: any
  ): Promise<void> {
    await this.jobsService.deleteRecurringJobTemplate(id, req.user.tenantId, deleteAllJobs);
  }

  @Post('recurring/:id/generate')
  @ApiOperation({ summary: 'Generate jobs from a recurring template' })
  async generateRecurringJobs(
    @Param('id') id: string,
    @Body() dto: GenerateRecurringJobsDto,
    @Request() req: any
  ): Promise<{ generated: number; skipped: number }> {
    const generateUntil = new Date(dto.generate_until);
    await this.jobsService.generateRecurringJobs(id, generateUntil, req.user.tenantId, dto.skip_existing ?? true);
    return { generated: 0, skipped: 0 }; // TODO: Return actual counts
  }

  @Put(':id/skip-recurrence')
  @ApiOperation({ summary: 'Skip a single occurrence of a recurring job' })
  async skipRecurringOccurrence(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<void> {
    await this.jobsService.skipRecurringJobOccurrence(id, req.user.tenantId);
  }
}
