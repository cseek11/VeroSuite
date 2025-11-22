import { Controller, Get, UseGuards, Request, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'VeroField API',
      version: '1.0.0'
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed health check with all components' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  @ApiResponse({ status: 503, description: 'Service unhealthy' })
  async detailedHealthCheck() {
    const checks: Record<string, any> = {};
    let overallStatus = 'healthy';
    let httpStatus = HttpStatus.OK;

    // Database check
    const dbCheck = await this.healthService.checkDatabase();
    checks.database = {
      status: dbCheck.healthy ? 'up' : 'down',
      responseTime: dbCheck.responseTime,
      message: dbCheck.message
    };
    
    if (!dbCheck.healthy) {
      overallStatus = 'unhealthy';
      httpStatus = HttpStatus.SERVICE_UNAVAILABLE;
    }

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'VeroField API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks
    };

    if (httpStatus !== HttpStatus.OK) {
      throw new HttpException(response, httpStatus);
    }

    return response;
  }

  @Get('health/live')
  @ApiOperation({ summary: 'Liveness probe - Kubernetes liveness check' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  livenessProbe() {
    // Simple check - just verify the process is running
    return {
      status: 'alive',
      timestamp: new Date().toISOString()
    };
  }

  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness probe - Kubernetes readiness check' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async readinessProbe() {
    // Check if service is ready to serve traffic (database connectivity)
    const dbCheck = await this.healthService.checkDatabase();
    
    if (!dbCheck.healthy) {
      throw new HttpException(
        {
          status: 'not_ready',
          timestamp: new Date().toISOString(),
          reason: 'Database not available'
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    return {
      status: 'ready',
      timestamp: new Date().toISOString()
    };
  }

  @Get('auth/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Current user information' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCurrentUser(@Request() req: any) {
    return {
      user: req.user,
      timestamp: new Date().toISOString()
    };
  }
}
