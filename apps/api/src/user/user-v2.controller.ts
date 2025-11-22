import { Controller, Get, Post, Put, Body, UseGuards, Request, Query, Param, Delete, UploadedFile, UseInterceptors, Header } from '@nestjs/common';
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
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

/**
 * User API v2 Controller
 * 
 * Enhanced endpoints with:
 * - Consistent response format with metadata
 * - Idempotency support
 * - Better error responses
 */
@ApiTags('Users V2')
@ApiBearerAuth()
@Controller({ path: 'users', version: '2' })
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@UseInterceptors(IdempotencyInterceptor)
export class UserV2Controller {
  constructor(
    private readonly userService: UserService,
    private readonly metricsService: UserMetricsService,
    private readonly importExportService: ImportExportService,
    private readonly sessionService: SessionService,
  ) {}

  @Get()
  @Roles('admin', 'owner', 'dispatcher')
  @RequirePermissions('users:view')
  @ApiOperation({ summary: 'Get all users for the current tenant (V2)' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @Header('API-Version', '2.0')
  async getUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    const result = await this.userService.getUsers(tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post()
  @Roles('admin', 'owner')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Create a new user (V2)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Header('API-Version', '2.0')
  async createUser(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    const tenantId = req.tenantId;
    const result = await this.userService.createUser(tenantId, createUserDto);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync authenticated users to local database (V2)' })
  @ApiResponse({ status: 200, description: 'Users synced successfully' })
  @Header('API-Version', '2.0')
  async syncUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    const result = await this.userService.syncAuthUsersToDatabase(tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('next-employee-id')
  @ApiOperation({ summary: 'Get next available employee ID for a role (V2)' })
  @ApiQuery({ name: 'role', required: false, description: 'User role (technician, admin, dispatcher)', example: 'technician' })
  @ApiResponse({ status: 200, description: 'Next employee ID generated successfully' })
  @Header('API-Version', '2.0')
  async getNextEmployeeId(@Request() req: any, @Query('role') role?: string) {
    const tenantId = req.tenantId;
    const roleToUse = role || 'technician';
    const employeeId = await this.userService.generateEmployeeId(tenantId, roleToUse);
    return {
      data: { employee_id: employeeId },
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('export')
  @ApiOperation({ summary: 'Export users to CSV (V2)' })
  @ApiResponse({ status: 200, description: 'Users exported successfully' })
  @Header('API-Version', '2.0')
  async exportUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    const users = await this.importExportService.exportUsers(tenantId);
    return {
      data: { users },
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('import')
  @ApiOperation({ summary: 'Import users from CSV (V2)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Users imported successfully' })
  @Header('API-Version', '2.0')
  async importUsers(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const tenantId = req.tenantId;
    
    if (!file) {
      throw new Error('No file uploaded');
    }

    const csvContent = file.buffer.toString('utf-8');
    const users = await this.importExportService.parseCSV(csvContent);
    const result = await this.importExportService.importUsers(tenantId, users);
    
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('certifications/alerts')
  @ApiOperation({ summary: 'Get certification expiration alerts (V2)' })
  @ApiQuery({ name: 'daysAhead', required: false, description: 'Days ahead to check', example: 30 })
  @ApiResponse({ status: 200, description: 'Certification alerts retrieved successfully' })
  @Header('API-Version', '2.0')
  async getCertificationAlerts(@Request() req: any, @Query('daysAhead') daysAhead?: number) {
    const tenantId = req.tenantId;
    const days = daysAhead ? parseInt(daysAhead.toString(), 10) : 30;
    const result = await this.metricsService.getCertificationAlerts(tenantId, days);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put(':id')
  @Roles('admin', 'owner')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Update a user (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @Header('API-Version', '2.0')
  async updateUser(@Request() req: any, @Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    const tenantId = req.tenantId;
    const result = await this.userService.updateUser(tenantId, userId, updateUserDto);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/hierarchy')
  @ApiOperation({ summary: 'Get user hierarchy (manager and direct reports) (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User hierarchy retrieved successfully' })
  @Header('API-Version', '2.0')
  async getUserHierarchy(@Request() req: any, @Param('id') userId: string) {
    const tenantId = req.tenantId;
    const result = await this.userService.getUserHierarchy(tenantId, userId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Get user activity logs (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of activities to return', example: 50 })
  @ApiResponse({ status: 200, description: 'User activity logs retrieved successfully' })
  @Header('API-Version', '2.0')
  async getUserActivity(@Request() req: any, @Param('id') userId: string, @Query('limit') limit?: number) {
    const tenantId = req.tenantId;
    const limitValue = limit ? parseInt(limit.toString(), 10) : 50;
    const result = await this.userService.getUserActivity(tenantId, userId, limitValue);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'Get active sessions for a user (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Active sessions retrieved successfully' })
  @Header('API-Version', '2.0')
  async getActiveSessions(@Request() req: any, @Param('id') userId: string) {
    const tenantId = req.tenantId;
    const result = await this.sessionService.getActiveSessions(tenantId, userId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete(':id/sessions/:sessionId')
  @ApiOperation({ summary: 'Revoke a specific session (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session revoked successfully' })
  @Header('API-Version', '2.0')
  async revokeSession(@Request() req: any, @Param('id') userId: string, @Param('sessionId') sessionId: string) {
    const tenantId = req.tenantId;
    await this.sessionService.revokeSession(tenantId, userId, sessionId);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete(':id/sessions')
  @ApiOperation({ summary: 'Revoke all sessions for a user (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'All sessions revoked successfully' })
  @Header('API-Version', '2.0')
  async revokeAllSessions(@Request() req: any, @Param('id') userId: string) {
    const tenantId = req.tenantId;
    await this.sessionService.revokeAllSessions(tenantId, userId);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Get user performance metrics (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'User metrics retrieved successfully' })
  @Header('API-Version', '2.0')
  async getUserMetrics(
    @Request() req: any,
    @Param('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const tenantId = req.tenantId;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    const result = await this.metricsService.getUserMetrics(tenantId, userId, start, end);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user and reassign their work (V2)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @Header('API-Version', '2.0')
  async deactivateUser(
    @Request() req: any,
    @Param('id') userId: string,
    @Body() body: { reassignToUserId?: string; reason?: string },
  ) {
    const tenantId = req.tenantId;
    const result = await this.userService.deactivateUser(tenantId, userId, body.reassignToUserId, body.reason);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }
}


