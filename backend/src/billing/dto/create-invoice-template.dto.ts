import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceTemplateItemDto {
  @ApiProperty({
    description: 'Service type ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  service_type_id!: string;

  @ApiProperty({
    description: 'Item description',
    example: 'Monthly Pest Control Service'
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Quantity',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Unit price',
    example: 150.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  unit_price!: number;
}

export class CreateInvoiceTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'Standard Monthly Service'
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Template description',
    example: 'Monthly pest control service invoice template'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Template items',
    type: [InvoiceTemplateItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceTemplateItemDto)
  items!: InvoiceTemplateItemDto[];

  @ApiPropertyOptional({
    description: 'Template tags',
    example: ['monthly', 'recurring'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}


