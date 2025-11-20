import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  SessionDataResponseDto,
  SessionDto,
  ScoreBreakdownDto,
  FileScoreDto,
} from './dto/session-response.dto';
import { createOrExtendTraceContext, TraceContext } from '../common/utils/trace-propagation.util';

interface RewardScore {
  pr?: string;
  score?: number;
  breakdown?: {
    tests?: number;
    bug_fix?: number;
    docs?: number;
    performance?: number;
    security?: number;
    penalties?: number;
  };
  file_scores?: Record<string, {
    score: number;
    breakdown: {
      tests?: number;
      bug_fix?: number;
      docs?: number;
      performance?: number;
      security?: number;
      penalties?: number;
    };
    notes?: string;
  }>;
  computed_at?: string;
  session_id?: string;
}

interface RawSessionData {
  active_sessions?: Record<string, any>;
  completed_sessions?: any[];
  version?: string;
  last_updated?: string;
}

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly sessionDataFile = join(process.cwd(), 'docs', 'metrics', 'auto_pr_sessions.json');
  private readonly stateFile = join(process.cwd(), '.cursor', 'data', 'session_state.json');
  private readonly rewardScoresFile = join(process.cwd(), 'docs', 'metrics', 'reward_scores.json');

  /**
   * Get all sessions (active + completed) with merged score data
   */
  async getAllSessions(traceContext?: TraceContext): Promise<SessionDataResponseDto> {
    const context = createOrExtendTraceContext(traceContext);
    const operation = 'getAllSessions';

    try {
      this.logger.log('Loading session data', {
        context: 'SessionsService',
        operation,
        traceId: context.traceId,
        spanId: context.spanId,
        requestId: context.requestId,
        sessionDataFile: this.sessionDataFile,
        fileExists: existsSync(this.sessionDataFile),
      });

      // Load session data
      const sessionData = await this.loadSessionData(context);
      
      // Load reward scores for merging
      const rewardScores = await this.loadRewardScores(context);

      // Merge score data into sessions
      const mergedData = this.mergeScoreData(sessionData, rewardScores, context);

      this.logger.log('Session data loaded successfully', {
        context: 'SessionsService',
        operation,
        traceId: context.traceId,
        spanId: context.spanId,
        requestId: context.requestId,
        activeCount: Object.keys(mergedData.active_sessions).length,
        completedCount: mergedData.completed_sessions.length,
      });

      return mergedData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to load session data', {
        context: 'SessionsService',
        operation,
        traceId: context.traceId,
        spanId: context.spanId,
        requestId: context.requestId,
        error: errorMessage,
        rootCause: 'File read or data transformation failed',
      });

      // Return empty data instead of throwing to allow frontend to handle gracefully
      return {
        active_sessions: {},
        completed_sessions: [],
      };
    }
  }

  /**
   * Get specific session by ID
   */
  async getSessionById(sessionId: string, traceContext?: TraceContext): Promise<SessionDto | null> {
    const context = createOrExtendTraceContext(traceContext);
    const operation = 'getSessionById';

    try {
      const allSessions = await this.getAllSessions(context);
      
      // Check active sessions
      if (allSessions.active_sessions[sessionId]) {
        return allSessions.active_sessions[sessionId];
      }

      // Check completed sessions
      const completed = allSessions.completed_sessions.find(s => s.session_id === sessionId);
      if (completed) {
        return completed;
      }

      this.logger.warn('Session not found', {
        context: 'SessionsService',
        operation,
        traceId: context.traceId,
        spanId: context.spanId,
        requestId: context.requestId,
        sessionId,
      });

      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to get session by ID', {
        context: 'SessionsService',
        operation,
        traceId: context.traceId,
        spanId: context.spanId,
        requestId: context.requestId,
        sessionId,
        error: errorMessage,
        rootCause: 'Session lookup failed',
      });
      throw new InternalServerErrorException(`Failed to get session: ${errorMessage}`);
    }
  }

  /**
   * Load session data from JSON file
   */
  private async loadSessionData(traceContext: TraceContext): Promise<RawSessionData> {
    const operation = 'loadSessionData';

    try {
      if (!existsSync(this.sessionDataFile)) {
        this.logger.warn('Session data file not found, returning empty data', {
          context: 'SessionsService',
          operation,
          traceId: traceContext.traceId,
          spanId: traceContext.spanId,
          requestId: traceContext.requestId,
          filePath: this.sessionDataFile,
        });
        return {
          active_sessions: {},
          completed_sessions: [],
        };
      }

      const fileContent = await readFile(this.sessionDataFile, 'utf-8');
      const data: RawSessionData = JSON.parse(fileContent);

      this.logger.debug('Session data loaded from file', {
        context: 'SessionsService',
        operation,
        traceId: traceContext.traceId,
        spanId: traceContext.spanId,
        requestId: traceContext.requestId,
        filePath: this.sessionDataFile,
        activeCount: Object.keys(data.active_sessions || {}).length,
        completedCount: (data.completed_sessions || []).length,
        activeSessionIds: Object.keys(data.active_sessions || {}),
      });

      return {
        active_sessions: data.active_sessions || {},
        completed_sessions: data.completed_sessions || [],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to load session data file', {
        context: 'SessionsService',
        operation,
        traceId: traceContext.traceId,
        spanId: traceContext.spanId,
        requestId: traceContext.requestId,
        filePath: this.sessionDataFile,
        error: errorMessage,
        rootCause: 'File read or JSON parse failed',
      });
      throw error;
    }
  }

  /**
   * Load reward scores from JSON file
   */
  private async loadRewardScores(traceContext: TraceContext): Promise<RewardScore[]> {
    const operation = 'loadRewardScores';

    try {
      if (!existsSync(this.rewardScoresFile)) {
        this.logger.debug('Reward scores file not found, skipping score merge', {
          context: 'SessionsService',
          operation,
          traceId: traceContext.traceId,
          spanId: traceContext.spanId,
          requestId: traceContext.requestId,
          filePath: this.rewardScoresFile,
        });
        return [];
      }

      const fileContent = await readFile(this.rewardScoresFile, 'utf-8');
      const data = JSON.parse(fileContent);

      return data.scores || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn('Failed to load reward scores, continuing without score data', {
        context: 'SessionsService',
        operation,
        traceId: traceContext.traceId,
        spanId: traceContext.spanId,
        requestId: traceContext.requestId,
        filePath: this.rewardScoresFile,
        error: errorMessage,
        rootCause: 'File read or JSON parse failed',
      });
      return [];
    }
  }

  /**
   * Merge reward score data into sessions
   */
  private mergeScoreData(
    sessionData: RawSessionData,
    rewardScores: RewardScore[],
    traceContext: TraceContext
  ): SessionDataResponseDto {
    const operation = 'mergeScoreData';

    try {
      // Create a map of PR number to reward score for quick lookup
      const scoreMap = new Map<string, RewardScore>();
      for (const score of rewardScores) {
        if (score.pr) {
          scoreMap.set(score.pr, score);
        }
      }

      // Transform active sessions
      const activeSessions: Record<string, SessionDto> = {};
      for (const [sessionId, session] of Object.entries(sessionData.active_sessions || {})) {
        activeSessions[sessionId] = this.transformSession(session, scoreMap);
      }

      // Transform completed sessions
      const completedSessions: SessionDto[] = (sessionData.completed_sessions || []).map(session =>
        this.transformSession(session, scoreMap)
      );

      return {
        active_sessions: activeSessions,
        completed_sessions: completedSessions,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to merge score data', {
        context: 'SessionsService',
        operation,
        traceId: traceContext.traceId,
        spanId: traceContext.spanId,
        requestId: traceContext.requestId,
        error: errorMessage,
        rootCause: 'Data transformation failed',
      });
      throw error;
    }
  }

  /**
   * Transform raw session data to DTO format with merged score data
   */
  private transformSession(session: any, scoreMap: Map<string, RewardScore>): SessionDto {
    // Find matching reward score by PR number
    let matchedScore: RewardScore | undefined;
    if (session.prs && Array.isArray(session.prs)) {
      for (const pr of session.prs) {
        const prNumber = pr.replace('#', '');
        matchedScore = scoreMap.get(prNumber);
        if (matchedScore) break;
      }
    }

    // Build breakdown DTO
    let breakdown: ScoreBreakdownDto | undefined;
    if (matchedScore?.breakdown) {
      breakdown = {
        tests: matchedScore.breakdown.tests,
        bug_fix: matchedScore.breakdown.bug_fix,
        docs: matchedScore.breakdown.docs,
        performance: matchedScore.breakdown.performance,
        security: matchedScore.breakdown.security,
        penalties: matchedScore.breakdown.penalties,
      };
    } else if (session.breakdown) {
      breakdown = {
        tests: session.breakdown.tests,
        bug_fix: session.breakdown.bug_fix,
        docs: session.breakdown.docs,
        performance: session.breakdown.performance,
        security: session.breakdown.security,
        penalties: session.breakdown.penalties,
      };
    }

    // Build file scores DTO
    let fileScores: Record<string, FileScoreDto> | undefined;
    if (matchedScore?.file_scores) {
      fileScores = {};
      for (const [file, fileScore] of Object.entries(matchedScore.file_scores)) {
        fileScores[file] = {
          score: fileScore.score,
          breakdown: {
            tests: fileScore.breakdown.tests,
            bug_fix: fileScore.breakdown.bug_fix,
            docs: fileScore.breakdown.docs,
            performance: fileScore.breakdown.performance,
            security: fileScore.breakdown.security,
            penalties: fileScore.breakdown.penalties,
          },
          notes: fileScore.notes,
        };
      }
    } else if (session.file_scores) {
      fileScores = {};
      for (const [file, fileScore] of Object.entries(session.file_scores)) {
        fileScores[file] = {
          score: (fileScore as any).score,
          breakdown: {
            tests: (fileScore as any).breakdown?.tests,
            bug_fix: (fileScore as any).breakdown?.bug_fix,
            docs: (fileScore as any).breakdown?.docs,
            performance: (fileScore as any).breakdown?.performance,
            security: (fileScore as any).breakdown?.security,
            penalties: (fileScore as any).breakdown?.penalties,
          },
          notes: (fileScore as any).notes,
        };
      }
    }

    // Use matched score or session data for final_score
    const finalScore = matchedScore?.score !== undefined ? matchedScore.score : session.final_score;

    return {
      session_id: session.session_id,
      author: session.author,
      started: session.started,
      last_activity: session.last_activity,
      completed: session.completed,
      prs: session.prs || [],
      total_files_changed: session.total_files_changed || 0,
      test_files_added: session.test_files_added || 0,
      status: session.status,
      final_score: finalScore,
      duration_minutes: session.duration_minutes,
      breakdown,
      file_scores: fileScores,
      metadata: {
        pr: matchedScore?.pr || session.metadata?.pr,
        computed_at: matchedScore?.computed_at || session.metadata?.computed_at,
        session_id: session.session_id,
      },
    };
  }
}

