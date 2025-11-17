import { Controller, Get, Post, Put, Body, UseGuards, Request, Query, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserMetricsService } from './user-metrics.service';
import { ImportExportService } from './import-export.service';
import { SessionService } from '../auth/session.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { PermissionsGuard, RequirePermissions } from '../auth/permissions.guard';
import { CreateUserDto, UpdateUserDto } from './dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly metricsService: UserMetricsService,
    private readonly importExportService: ImportExportService,
    private readonly sessionService: SessionService,
  ) {}

  @Get()
  @Roles('admin', 'owner', 'dispatcher')
  @RequirePermissions('users:view')
  @ApiOperation({ summary: 'Get all users for the current tenant' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  async getUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    return this.userService.getUsers(tenantId);
  }

  @Post()
  @Roles('admin', 'owner')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    const tenantId = req.tenantId;
    return this.userService.createUser(tenantId, createUserDto);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync authenticated users to local database' })
  @ApiResponse({ status: 200, description: 'Users synced successfully' })
  async syncUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    return this.userService.syncAuthUsersToDatabase(tenantId);
  }

  @Get('next-employee-id')
  @ApiOperation({ summary: 'Get next available employee ID for a role' })
  @ApiQuery({ name: 'role', required: false, description: 'User role (technician, admin, dispatcher)', example: 'technician' })
  @ApiResponse({ status: 200, description: 'Next employee ID generated successfully' })
  async getNextEmployeeId(@Request() req: any, @Query('role') role?: string) {
    const tenantId = req.tenantId;
    const roleToUse = role || 'technician';
    const employeeId = await this.userService.generateEmployeeId(tenantId, roleToUse);
    return { employee_id: employeeId };
  }

  @Get('export')
  @ApiOperation({ summary: 'Export users to CSV' })
  @ApiResponse({ status: 200, description: 'Users exported successfully' })
  async exportUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    const users = await this.importExportService.exportUsers(tenantId);
    return { users };
  }

  @Post('import')
  @ApiOperation({ summary: 'Import users from CSV' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Users imported successfully' })
  async importUsers(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<import('./import-export.service').ImportResult> {
    const tenantId = req.tenantId;
    
    if (!file) {
      throw new Error('No file uploaded');
    }

    const csvContent = file.buffer.toString('utf-8');
    const users = await this.importExportService.parseCSV(csvContent);
    const result = await this.importExportService.importUsers(tenantId, users);
    
    return result;
  }

  @Get('certifications/alerts')
  @ApiOperation({ summary: 'Get certification expiration alerts' })
  @ApiQuery({ name: 'daysAhead', required: false, description: 'Days ahead to check', example: 30 })
  @ApiResponse({ status: 200, description: 'Certification alerts retrieved successfully' })
  async getCertificationAlerts(@Request() req: any, @Query('daysAhead') daysAhead?: number) {
    const tenantId = req.tenantId;
    const days = daysAhead ? parseInt(daysAhead.toString(), 10) : 30;
    return this.metricsService.getCertificationAlerts(tenantId, days);
  }

  @Put(':id')
  @Roles('admin', 'owner')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(@Request() req: any, @Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    const tenantId = req.tenantId;
    return this.userService.updateUser(tenantId, userId, updateUserDto);
  }

  @Get(':id/hierarchy')
  @ApiOperation({ summary: 'Get user hierarchy (manager and direct reports)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User hierarchy retrieved successfully' })
  async getUserHierarchy(@Request() req: any, @Param('id') userId: string) {
    const tenantId = req.tenantId;
    return this.userService.getUserHierarchy(tenantId, userId);
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Get user activity logs' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of activities to return', example: 50 })
  @ApiResponse({ status: 200, description: 'User activity logs retrieved successfully' })
  async getUserActivity(@Request() req: any, @Param('id') userId: string, @Query('limit') limit?: number) {
    const tenantId = req.tenantId;
    const limitValue = limit ? parseInt(limit.toString(), 10) : 50;
    return this.userService.getUserActivity(tenantId, userId, limitValue);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'Get active sessions for a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Active sessions retrieved successfully' })
  async getActiveSessions(@Request() req: any, @Param('id') userId: string) {
    const tenantId = req.tenantId;
    return this.sessionService.getActiveSessions(tenantId, userId);
  }

  @Delete(':id/sessions/:sessionId')
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session revoked successfully' })
  async revokeSession(@Request() req: any, @Param('id') userId: string, @Param('sessionId') sessionId: string) {
    const tenantId = req.tenantId;
    return this.sessionService.revokeSession(tenantId, userId, sessionId);
  }

  @Delete(':id/sessions')
  @ApiOperation({ summary: 'Revoke all sessions for a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'All sessions revoked successfully' })
  async revokeAllSessions(@Request() req: any, @Param('id') userId: string) {
    const tenantId = req.tenantId;
    return this.sessionService.revokeAllSessions(tenantId, userId);
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Get user performance metrics' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'User metrics retrieved successfully' })
  async getUserMetrics(
    @Request() req: any,
    @Param('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const tenantId = req.tenantId;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
    const end = endDate ? new Date(endDate) : new Date(); // Default: now
    return this.metricsService.getUserMetrics(tenantId, userId, start, end);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user and reassign their work' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  async deactivateUser(
    @Request() req: any,
    @Param('id') userId: string,
    @Body() body: { reassignToUserId?: string; reason?: string },
  ) {
    const tenantId = req.tenantId;
    return this.userService.deactivateUser(tenantId, userId, body.reassignToUserId, body.reason);
  }
}
