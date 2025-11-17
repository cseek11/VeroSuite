import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsBoolean, IsInt, IsEnum, IsArray, IsObject, Min, Max } from 'class-validator';

export class CreateRecurringJobTemplateDto {
  @ApiProperty({ description: 'Template name', example: 'Weekly Pest Control' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Recurrence type', 
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    example: 'weekly'
  })
  @IsEnum(['daily', 'weekly', 'monthly', 'custom'])
  recurrence_type!: 'daily' | 'weekly' | 'monthly' | 'custom';

  @ApiProperty({ description: 'Recurrence interval (every N days/weeks/months)', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  recurrence_interval?: number;

  @ApiProperty({ 
    description: 'Days of week for weekly recurrence (0=Sunday, 6=Saturday)', 
    example: [1, 3, 5],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  recurrence_days_of_week?: number[];

  @ApiProperty({ description: 'Day of month for monthly recurrence (1-31)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  recurrence_day_of_month?: number;

  @ApiProperty({ 
    description: 'Weekday of month (e.g., first_monday, last_friday)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  recurrence_weekday_of_month?: string;

  @ApiProperty({ description: 'Start time (HH:mm format)', example: '09:00' })
  @IsString()
  start_time!: string;

  @ApiProperty({ description: 'End time (HH:mm format)', required: false })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiProperty({ description: 'Estimated duration in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimated_duration?: number;

  @ApiProperty({ description: 'Start date (ISO string)', example: '2025-01-15' })
  @IsDateString()
  start_date!: string;

  @ApiProperty({ description: 'End date (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ description: 'Maximum number of occurrences', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_occurrences?: number;

  @ApiProperty({ 
    description: 'Job template data (customer, service, location, etc.)',
    example: {
      customer_id: 'uuid',
      service_type_id: 'uuid',
      location_id: 'uuid',
      priority: 'medium',
      notes: 'Recurring service'
    }
  })
  @IsObject()
  job_template!: Record<string, any>;

  @ApiProperty({ description: 'Whether template is active', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateRecurringJobTemplateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_occurrences?: number;
}

export class GenerateRecurringJobsDto {
  @ApiProperty({ 
    description: 'Generate jobs up to this date',
    example: '2025-12-31'
  })
  @IsDateString()
  generate_until!: string;

  @ApiProperty({ 
    description: 'Whether to skip existing jobs',
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  skip_existing?: boolean;
}

export class RecurringJobTemplateResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  recurrence_type!: string;

  @ApiProperty()
  recurrence_interval!: number;

  @ApiProperty({ required: false })
  recurrence_days_of_week?: number[];

  @ApiProperty({ required: false })
  recurrence_day_of_month?: number;

  @ApiProperty({ required: false })
  recurrence_weekday_of_month?: string;

  @ApiProperty()
  start_time!: string;

  @ApiProperty({ required: false })
  end_time?: string;

  @ApiProperty({ required: false })
  estimated_duration?: number;

  @ApiProperty()
  start_date!: string;

  @ApiProperty({ required: false })
  end_date?: string;

  @ApiProperty({ required: false })
  max_occurrences?: number;

  @ApiProperty()
  job_template!: Record<string, any>;

  @ApiProperty()
  is_active!: boolean;

  @ApiProperty({ required: false })
  last_generated_date?: string;

  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  updated_at!: string;
}

