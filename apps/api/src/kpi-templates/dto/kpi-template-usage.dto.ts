import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TemplateUsageAction {
  VIEWED = 'viewed',
  USED = 'used',
  FAVORITED = 'favorited',
  UNFAVORITED = 'unfavorited',
  SHARED = 'shared'
}

export class TrackTemplateUsageDto {
  @ApiProperty({ description: 'ID of the template' })
  @IsUUID()
  template_id!: string;

  @ApiProperty({ 
    description: 'Action being tracked',
    enum: TemplateUsageAction,
    example: TemplateUsageAction.VIEWED
  })
  @IsEnum(TemplateUsageAction)
  action!: TemplateUsageAction;
}
