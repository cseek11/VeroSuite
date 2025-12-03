import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class ComplianceScoreDto {
  @ApiProperty({ description: 'Compliance score (0-100)', example: 85, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;

  @ApiProperty({ description: 'Number of BLOCK violations', example: 0 })
  @IsInt()
  block_count!: number;

  @ApiProperty({ description: 'Number of OVERRIDE violations', example: 2 })
  @IsInt()
  override_count!: number;

  @ApiProperty({ description: 'Number of WARNING violations', example: 5 })
  @IsInt()
  warning_count!: number;

  @ApiProperty({ description: 'Weighted violation score', example: 11 })
  @IsNumber()
  weighted_violations!: number;

  @ApiProperty({ description: 'Can merge status', example: true })
  can_merge!: boolean;

  @ApiProperty({ description: 'PR number', example: 123 })
  @IsInt()
  pr_number!: number;
}



