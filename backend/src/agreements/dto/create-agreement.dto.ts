import { IsString, IsUUID, IsDateString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceAgreementStatus, BillingFrequency } from '@prisma/client';

export class CreateServiceAgreementDto {
  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  account_id!: string;

  @ApiProperty({ description: 'Service Type ID' })
  @IsUUID()
  service_type_id!: string;

  @ApiPropertyOptional({ description: 'Agreement number (auto-generated if not provided)' })
  @IsOptional()
  @IsString()
  agreement_number?: string;

  @ApiProperty({ description: 'Agreement title' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Agreement description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Start date', example: '2025-01-01' })
  @IsDateString()
  start_date!: string;

  @ApiPropertyOptional({ description: 'End date', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Agreement status', enum: ServiceAgreementStatus })
  @IsOptional()
  @IsEnum(ServiceAgreementStatus)
  status?: ServiceAgreementStatus;

  @ApiPropertyOptional({ description: 'Terms and conditions' })
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiPropertyOptional({ description: 'Pricing amount' })
  @IsOptional()
  @IsNumber()
  pricing?: number;

  @ApiPropertyOptional({ description: 'Billing frequency', enum: BillingFrequency })
  @IsOptional()
  @IsEnum(BillingFrequency)
  billing_frequency?: BillingFrequency;


  @ApiPropertyOptional({ description: 'Created by user ID' })
  @IsOptional()
  @IsUUID()
  created_by?: string;

  @ApiPropertyOptional({ description: 'Updated by user ID' })
  @IsOptional()
  @IsUUID()
  updated_by?: string;
}