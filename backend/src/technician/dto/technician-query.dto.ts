import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsIn, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { EmploymentType, TechnicianStatus } from './create-technician-profile.dto';

export class TechnicianQueryDto {
  @ApiPropertyOptional({ 
    description: 'Search term for name, email, or employee ID',
    example: 'John Doe',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Search term must be between 1 and 100 characters' })
  search?: string;

  @ApiPropertyOptional({ 
    enum: TechnicianStatus,
    description: 'Filter by technician status'
  })
  @IsOptional()
  @IsEnum(TechnicianStatus, { message: 'Invalid technician status' })
  status?: TechnicianStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by department',
    example: 'Field Operations',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Department must be between 1 and 100 characters' })
  department?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by position',
    example: 'Senior Technician',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Position must be between 1 and 100 characters' })
  position?: string;

  @ApiPropertyOptional({ 
    enum: EmploymentType,
    description: 'Filter by employment type'
  })
  @IsOptional()
  @IsEnum(EmploymentType, { message: 'Invalid employment type' })
  employment_type?: EmploymentType;

  @ApiPropertyOptional({ 
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  @ApiPropertyOptional({ 
    description: 'Sort by field',
    example: 'hire_date',
    enum: ['hire_date', 'created_at', 'updated_at', 'employee_id', 'position']
  })
  @IsOptional()
  @IsString()
  @IsIn(['hire_date', 'created_at', 'updated_at', 'employee_id', 'position'], {
    message: 'Invalid sort field'
  })
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sort_order?: 'asc' | 'desc' = 'desc';
}
