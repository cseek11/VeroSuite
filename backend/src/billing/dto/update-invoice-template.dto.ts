import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceTemplateItemDto } from './create-invoice-template.dto';

export class UpdateInvoiceTemplateDto {
  @ApiPropertyOptional({
    description: 'Template name',
    example: 'Standard Monthly Service'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Template description',
    example: 'Monthly pest control service invoice template'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Template items',
    type: [InvoiceTemplateItemDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceTemplateItemDto)
  items?: InvoiceTemplateItemDto[];

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


