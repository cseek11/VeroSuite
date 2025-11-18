import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceTemplateItemResponseDto {
  @ApiProperty({ description: 'Service type ID' })
  service_type_id!: string;

  @ApiProperty({ description: 'Item description' })
  description!: string;

  @ApiProperty({ description: 'Quantity' })
  quantity!: number;

  @ApiProperty({ description: 'Unit price' })
  unit_price!: number;
}

export class InvoiceTemplateResponseDto {
  @ApiProperty({ description: 'Template ID' })
  id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Template name' })
  name!: string;

  @ApiPropertyOptional({ description: 'Template description' })
  description?: string;

  @ApiProperty({ description: 'Template items', type: [InvoiceTemplateItemResponseDto] })
  items!: InvoiceTemplateItemResponseDto[];

  @ApiPropertyOptional({ description: 'Template tags', type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Created at' })
  created_at!: Date;

  @ApiProperty({ description: 'Updated at' })
  updated_at!: Date;

  @ApiProperty({ description: 'Created by user ID' })
  created_by!: string;

  @ApiProperty({ description: 'Updated by user ID' })
  updated_by!: string;
}


