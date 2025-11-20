import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionsService } from './sessions.service';
import {
  SessionDataResponseDto,
  SessionDto,
} from './dto/session-response.dto';
import { extractTraceContextFromHeaders, TraceContext } from '../common/utils/trace-propagation.util';

@ApiTags('Auto-PR Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'sessions', version: '1' })
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Auto-PR sessions (active + completed)' })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
    type: SessionDataResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllSessions(@Request() req: any): Promise<SessionDataResponseDto> {
    const traceContext = extractTraceContextFromHeaders(req.headers) || undefined;
    return this.sessionsService.getAllSessions(traceContext);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific Auto-PR session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session retrieved successfully',
    type: SessionDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSessionById(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<SessionDto> {
    const traceContext = extractTraceContextFromHeaders(req.headers) || undefined;
    const session = await this.sessionsService.getSessionById(id, traceContext);
    
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Manually complete an Auto-PR session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session completed successfully',
    type: SessionDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async completeSession(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<SessionDto> {
    const traceContext = extractTraceContextFromHeaders(req.headers) || undefined;
    
    // For now, this endpoint just returns the session
    // In the future, this could trigger the session completion logic
    // from auto_pr_session_manager.py via a subprocess or API call
    const session = await this.sessionsService.getSessionById(id, traceContext);
    
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // TODO: Implement actual session completion logic
    // This would involve calling the Python script or implementing
    // the completion logic directly in the service

    return session;
  }
}

