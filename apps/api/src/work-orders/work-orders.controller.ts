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

@ApiTags('Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'work-orders', version: '1' })
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work order' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Work order created successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Customer or technician not found' 
  })
  async createWorkOrder(
    @Body() createWorkOrderDto: CreateWorkOrderDto, 
    @Request() req: any
  ) {
    return this.workOrdersService.createWorkOrder(
      createWorkOrderDto, 
      req.user.tenantId, 
      req.user.userId
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Work order retrieved successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Work order not found' 
  })
  async getWorkOrderById(
    @Param('id', ParseUUIDPipe) id: string, 
    @Request() req: any
  ) {
    return this.workOrdersService.getWorkOrderById(id, req.user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List work orders with filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in-progress', 'completed', 'canceled'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high', 'urgent'] })
  @ApiQuery({ name: 'assigned_to', required: false, description: 'Technician ID' })
  @ApiQuery({ name: 'customer_id', required: false, description: 'Customer ID' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'end_date', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Work orders retrieved successfully' 
  })
  async listWorkOrders(
    @Query() filters: WorkOrderFiltersDto, 
    @Request() req: any
  ) {
    return this.workOrdersService.listWorkOrders(filters, req.user.tenantId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Work order updated successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Work order not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  async updateWorkOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
    @Request() req: any
  ) {
    return this.workOrdersService.updateWorkOrder(
      id, 
      updateWorkOrderDto, 
      req.user.tenantId, 
      req.user.userId
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work order (soft delete)' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Work order deleted successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Work order not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Cannot delete work order with active jobs' 
  })
  async deleteWorkOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any
  ) {
    return this.workOrdersService.deleteWorkOrder(
      id, 
      req.user.tenantId, 
      req.user.userId
    );
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get work orders by customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Work orders retrieved successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Customer not found' 
  })
  async getWorkOrdersByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Request() req: any
  ) {
    return this.workOrdersService.getWorkOrdersByCustomer(
      customerId, 
      req.user.tenantId
    );
  }

  @Get('technician/:technicianId')
  @ApiOperation({ summary: 'Get work orders by technician' })
  @ApiParam({ name: 'technicianId', description: 'Technician ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Work orders retrieved successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Technician not found' 
  })
  async getWorkOrdersByTechnician(
    @Param('technicianId', ParseUUIDPipe) technicianId: string,
    @Request() req: any
  ) {
    return this.workOrdersService.getWorkOrdersByTechnician(
      technicianId, 
      req.user.tenantId
    );
  }
}
