import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dto/base-response.dto';

export class WorkOrderResponseDto {
  @ApiProperty({ description: 'Work order ID' })
  id!: string;

  @ApiProperty({ description: 'Work order title' })
  title!: string;

  @ApiProperty({ description: 'Work order description' })
  description!: string;

  @ApiProperty({ description: 'Work order priority', enum: ['low', 'medium', 'high', 'urgent'] })
  priority!: 'low' | 'medium' | 'high' | 'urgent';

  @ApiProperty({ description: 'Work order status', enum: ['pending', 'in_progress', 'completed', 'cancelled'] })
  status!: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: 'Assigned technician ID' })
  technician_id?: string;

  @ApiPropertyOptional({ description: 'Assigned technician name' })
  technician_name?: string;

  @ApiPropertyOptional({ description: 'Account ID' })
  account_id?: string;

  @ApiPropertyOptional({ description: 'Account name' })
  account_name?: string;

  @ApiPropertyOptional({ description: 'Service type ID' })
  service_type_id?: string;

  @ApiPropertyOptional({ description: 'Service type name' })
  service_type_name?: string;

  @ApiPropertyOptional({ description: 'Scheduled date' })
  scheduled_date?: string;

  @ApiPropertyOptional({ description: 'Completion date' })
  completion_date?: string;

  @ApiPropertyOptional({ description: 'Estimated duration in minutes' })
  estimated_duration?: number;

  @ApiPropertyOptional({ description: 'Actual duration in minutes' })
  actual_duration?: number;

  @ApiPropertyOptional({ description: 'Work order notes' })
  notes?: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Work order creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Work order last update timestamp' })
  updated_at!: string;
}

export class WorkOrderListResponseDto extends PaginatedResponseDto<WorkOrderResponseDto> {
  @ApiProperty({ description: 'List of work orders', type: [WorkOrderResponseDto] })
  override data!: WorkOrderResponseDto[];

  constructor(
    workOrders: WorkOrderResponseDto[],
    pagination: { page: number; limit: number; total: number },
    message: string = 'Work orders retrieved successfully'
  ) {
    super(workOrders, pagination, message);
  }
}

export class WorkOrderDetailResponseDto extends BaseResponseDto<WorkOrderResponseDto> {
  @ApiProperty({ description: 'Work order details' })
  override data!: WorkOrderResponseDto;

  constructor(workOrder: WorkOrderResponseDto, message: string = 'Work order retrieved successfully') {
    super(workOrder, message, true);
  }
}

export class WorkOrderCreateResponseDto extends BaseResponseDto<WorkOrderResponseDto> {
  @ApiProperty({ description: 'Created work order' })
  override data!: WorkOrderResponseDto;

  constructor(workOrder: WorkOrderResponseDto, message: string = 'Work order created successfully') {
    super(workOrder, message, true);
  }
}

export class WorkOrderUpdateResponseDto extends BaseResponseDto<WorkOrderResponseDto> {
  @ApiProperty({ description: 'Updated work order' })
  override data!: WorkOrderResponseDto;

  constructor(workOrder: WorkOrderResponseDto, message: string = 'Work order updated successfully') {
    super(workOrder, message, true);
  }
}

export class WorkOrderAssignResponseDto extends BaseResponseDto<WorkOrderResponseDto> {
  @ApiProperty({ description: 'Assigned work order' })
  override data!: WorkOrderResponseDto;

  constructor(workOrder: WorkOrderResponseDto, message: string = 'Work order assigned successfully') {
    super(workOrder, message, true);
  }
}

export class WorkOrderDeleteResponseDto extends BaseResponseDto<{ id: string }> {
  @ApiProperty({ description: 'Deleted work order ID' })
  override data!: { id: string };

  constructor(workOrderId: string, message: string = 'Work order deleted successfully') {
    super({ id: workOrderId }, message, true);
  }
}
