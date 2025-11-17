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
  ParseUUIDPipe,
  HttpStatus,
  Header,
  UseInterceptors
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderFiltersDto } from './dto';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

/**
 * Work Orders API v2 Controller
 * 
 * Enhanced endpoints with:
 * - Consistent response format with metadata
 * - Idempotency support
 * - Better error responses
 */
@ApiTags('Work Orders V2')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'work-orders', version: '2' })
@UseInterceptors(IdempotencyInterceptor)
export class WorkOrdersV2Controller {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work order (V2)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Work order created successfully' })
  @Header('API-Version', '2.0')
  async createWorkOrder(@Body() createWorkOrderDto: CreateWorkOrderDto, @Request() req: any) {
    const result = await this.workOrdersService.createWorkOrder(
      createWorkOrderDto, 
      req.user.tenantId, 
      req.user.userId
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order by ID (V2)' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work order retrieved successfully' })
  @Header('API-Version', '2.0')
  async getWorkOrderById(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const result = await this.workOrdersService.getWorkOrderById(id, req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get()
  @ApiOperation({ summary: 'List work orders with filters (V2)' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in-progress', 'completed', 'canceled'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high', 'urgent'] })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work orders retrieved successfully' })
  @Header('API-Version', '2.0')
  async listWorkOrders(@Query() filters: WorkOrderFiltersDto, @Request() req: any) {
    const result = await this.workOrdersService.listWorkOrders(filters, req.user.tenantId);
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
  @ApiOperation({ summary: 'Update work order (V2)' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work order updated successfully' })
  @Header('API-Version', '2.0')
  async updateWorkOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
    @Request() req: any
  ) {
    const result = await this.workOrdersService.updateWorkOrder(
      id, 
      updateWorkOrderDto, 
      req.user.tenantId, 
      req.user.userId
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work order (soft delete) (V2)' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work order deleted successfully' })
  @Header('API-Version', '2.0')
  async deleteWorkOrder(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    await this.workOrdersService.deleteWorkOrder(id, req.user.tenantId, req.user.userId);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get work orders by customer (V2)' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work orders retrieved successfully' })
  @Header('API-Version', '2.0')
  async getWorkOrdersByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Request() req: any
  ) {
    const result = await this.workOrdersService.getWorkOrdersByCustomer(customerId, req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('technician/:technicianId')
  @ApiOperation({ summary: 'Get work orders by technician (V2)' })
  @ApiParam({ name: 'technicianId', description: 'Technician ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work orders retrieved successfully' })
  @Header('API-Version', '2.0')
  async getWorkOrdersByTechnician(
    @Param('technicianId', ParseUUIDPipe) technicianId: string,
    @Request() req: any
  ) {
    const result = await this.workOrdersService.getWorkOrdersByTechnician(technicianId, req.user.tenantId);
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


