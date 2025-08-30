import { IsString, IsUUID, IsDateString, IsOptional, IsEnum, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum WorkOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum WorkOrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateWorkOrderDto {
  @ApiProperty({ description: 'Customer/Account ID' })
  @IsUUID()
  customer_id!: string;

  @ApiProperty({ description: 'Assigned technician ID', required: false })
  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @ApiProperty({ enum: WorkOrderStatus, default: WorkOrderStatus.PENDING })
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus = WorkOrderStatus.PENDING;

  @ApiProperty({ enum: WorkOrderPriority, default: WorkOrderPriority.MEDIUM })
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority = WorkOrderPriority.MEDIUM;

  @ApiProperty({ description: 'Scheduled date', required: false, example: '2025-01-15T09:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduled_date?: string;

  @ApiProperty({ description: 'Work order description' })
  @IsString()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiProperty({ description: 'Service type', required: false })
  @IsOptional()
  @IsString()
  service_type?: string;

  @ApiProperty({ description: 'Recurrence rule', required: false })
  @IsOptional()
  @IsString()
  recurrence_rule?: string;

  @ApiProperty({ description: 'Estimated duration in minutes', required: false, default: 60 })
  @IsOptional()
  @IsNumber()
  estimated_duration?: number;

  @ApiProperty({ description: 'Service price', required: false })
  @IsOptional()
  @IsNumber()
  service_price?: number;
}

export class UpdateWorkOrderDto {
  @ApiProperty({ description: 'Customer/Account ID', required: false })
  @IsOptional()
  @IsUUID()
  customer_id?: string;

  @ApiProperty({ description: 'Assigned technician ID', required: false })
  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @ApiProperty({ enum: WorkOrderStatus, required: false })
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @ApiProperty({ enum: WorkOrderPriority, required: false })
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority;

  @ApiProperty({ description: 'Scheduled date', required: false, example: '2025-01-15T09:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduled_date?: string;

  @ApiProperty({ description: 'Completion date', required: false, example: '2025-01-15T17:00:00Z' })
  @IsOptional()
  @IsDateString()
  completion_date?: string;

  @ApiProperty({ description: 'Work order description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiProperty({ description: 'Service type', required: false })
  @IsOptional()
  @IsString()
  service_type?: string;

  @ApiProperty({ description: 'Recurrence rule', required: false })
  @IsOptional()
  @IsString()
  recurrence_rule?: string;

  @ApiProperty({ description: 'Estimated duration in minutes', required: false, default: 60 })
  @IsOptional()
  @IsNumber()
  estimated_duration?: number;

  @ApiProperty({ description: 'Service price', required: false })
  @IsOptional()
  @IsNumber()
  service_price?: number;
}

export class WorkOrderFiltersDto {
  @ApiProperty({ enum: WorkOrderStatus, required: false })
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @ApiProperty({ enum: WorkOrderPriority, required: false })
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority;

  @ApiProperty({ description: 'Start date for filtering', required: false, example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ description: 'End date for filtering', required: false, example: '2025-01-31' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ description: 'Assigned technician ID', required: false })
  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @ApiProperty({ description: 'Customer ID', required: false })
  @IsOptional()
  @IsUUID()
  customer_id?: string;

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
