import { ApiProperty } from '@nestjs/swagger';

export class ScoreBreakdownDto {
  @ApiProperty({ description: 'Tests score', required: false })
  tests?: number;

  @ApiProperty({ description: 'Bug fix score', required: false })
  bug_fix?: number;

  @ApiProperty({ description: 'Documentation score', required: false })
  docs?: number;

  @ApiProperty({ description: 'Performance score', required: false })
  performance?: number;

  @ApiProperty({ description: 'Security score', required: false })
  security?: number;

  @ApiProperty({ description: 'Penalties', required: false })
  penalties?: number;
}

export class FileScoreDto {
  @ApiProperty({ description: 'File score' })
  score!: number;

  @ApiProperty({ description: 'Score breakdown', type: ScoreBreakdownDto })
  breakdown!: ScoreBreakdownDto;

  @ApiProperty({ description: 'Notes', required: false })
  notes?: string;
}

export class SessionMetadataDto {
  @ApiProperty({ description: 'PR number', required: false })
  pr?: string;

  @ApiProperty({ description: 'Computed at timestamp', required: false })
  computed_at?: string;

  @ApiProperty({ description: 'Session ID', required: false })
  session_id?: string;
}

export class SessionDto {
  @ApiProperty({ description: 'Session ID' })
  session_id!: string;

  @ApiProperty({ description: 'Author' })
  author!: string;

  @ApiProperty({ description: 'Started timestamp' })
  started!: string;

  @ApiProperty({ description: 'Last activity timestamp', required: false })
  last_activity?: string;

  @ApiProperty({ description: 'Completed timestamp', required: false })
  completed?: string;

  @ApiProperty({ description: 'PR numbers', type: [String] })
  prs!: string[];

  @ApiProperty({ description: 'Total files changed' })
  total_files_changed!: number;

  @ApiProperty({ description: 'Test files added' })
  test_files_added!: number;

  @ApiProperty({ description: 'Status', enum: ['active', 'idle', 'warning'], required: false })
  status?: 'active' | 'idle' | 'warning';

  @ApiProperty({ description: 'Final score', required: false })
  final_score?: number;

  @ApiProperty({ description: 'Duration in minutes', required: false })
  duration_minutes?: number;

  @ApiProperty({ description: 'Score breakdown', type: ScoreBreakdownDto, required: false })
  breakdown?: ScoreBreakdownDto;

  @ApiProperty({ description: 'File scores', type: 'object', additionalProperties: { type: 'object', $ref: '#/components/schemas/FileScoreDto' }, required: false })
  file_scores?: Record<string, FileScoreDto>;

  @ApiProperty({ description: 'Metadata', type: SessionMetadataDto, required: false })
  metadata?: SessionMetadataDto;
}

export class SessionDataResponseDto {
  @ApiProperty({ description: 'Active sessions', type: 'object', additionalProperties: { type: 'object', $ref: '#/components/schemas/SessionDto' } })
  active_sessions!: Record<string, SessionDto>;

  @ApiProperty({ description: 'Completed sessions', type: [SessionDto] })
  completed_sessions!: SessionDto[];
}








