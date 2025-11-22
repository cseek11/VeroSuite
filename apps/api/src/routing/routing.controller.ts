import { Controller, Get, Post, Query, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoutingService } from './routing.service';

@ApiTags('Routing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'routing', version: '1' })
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Get('routes')
  @ApiOperation({ summary: 'Get routes for a specific date or all routes' })
  @ApiResponse({ status: 200, description: 'Routes retrieved successfully' })
  @ApiQuery({ name: 'date', required: false, description: 'Date in YYYY-MM-DD format' })
  async getRoutes(
    @Request() req: any,
    @Query('date') date?: string
  ) {
    const tenantId = req.user.tenant_id;
    return this.routingService.getRoutes(tenantId, date);
  }

  @Post('optimize/:technicianId')
  @ApiOperation({ summary: 'Optimize route for a specific technician' })
  @ApiResponse({ status: 200, description: 'Route optimized successfully' })
  async optimizeRoute(
    @Request() req: any,
    @Param('technicianId') technicianId: string,
    @Query('date') date: string
  ) {
    const tenantId = req.user.tenant_id;
    return this.routingService.optimizeRoute(tenantId, technicianId, date);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get route metrics for a date range' })
  @ApiResponse({ status: 200, description: 'Route metrics retrieved successfully' })
  @ApiQuery({ name: 'start_date', required: true, description: 'Start date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'end_date', required: true, description: 'End date in YYYY-MM-DD format' })
  async getRouteMetrics(
    @Request() req: any,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string
  ) {
    const tenantId = req.user.tenant_id;
    return this.routingService.getRouteMetrics(tenantId, startDate, endDate);
  }
}
