/**
 * Compliance Queue Service
 * Async write queue for compliance updates (with database fallback)
 * 
 * Last Updated: 2025-11-24
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../common/services/database.service';
import { StructuredLoggerService } from '../common/services/logger.service';
import { CreateComplianceCheckDto } from './dto/compliance-check.dto';
import type { ComplianceTrend } from '@prisma/client';

@Injectable()
export class ComplianceQueueService implements OnModuleInit {
  private readonly logger = new Logger(ComplianceQueueService.name);
  private useRedis = false;
  private redisClient: any = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: DatabaseService,
    private readonly structuredLogger: StructuredLoggerService,
  ) {}

  async onModuleInit() {
    // Check if Redis is available
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl) {
      try {
        // Try to use Redis if available (would need BullMQ setup)
        // For now, we'll use database fallback
        this.logger.log('Redis URL configured, but using database fallback for now');
        this.useRedis = false;
      } catch (error) {
        this.logger.warn('Redis connection failed, using database fallback', error);
        this.useRedis = false;
      }
    } else {
      this.logger.log('No Redis URL configured, using database-based queue');
      this.useRedis = false;
    }

    // Start processing queue
    this.startQueueProcessor();
  }

  /**
   * Add compliance check to queue
   */
  async addComplianceCheck(
    tenantId: string,
    checkData: CreateComplianceCheckDto,
  ): Promise<void> {
    const traceId = `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (this.useRedis) {
      // TODO: Implement Redis queue when BullMQ is set up
      // For now, fall through to database queue
    }

    // Database-based queue (fallback)
    try {
      await this.prisma.$executeRaw`
        INSERT INTO compliance.write_queue (id, job_type, job_data, status, created_at)
        VALUES (
          gen_random_uuid(),
          'compliance_check',
          ${JSON.stringify({ tenantId, ...checkData })}::jsonb,
          'pending',
          NOW()
        )
      `;

      this.structuredLogger.log(
        'Compliance check queued',
        'ComplianceQueueService',
        traceId,
        'addComplianceCheck',
        { tenantId, prNumber: checkData.pr_number, ruleId: checkData.rule_id },
      );
    } catch (error) {
      this.structuredLogger.error(
        'Failed to queue compliance check',
        (error as Error).stack,
        'ComplianceQueueService',
        traceId,
        'addComplianceCheck',
        'QUEUE_ERROR',
        (error as Error).message,
        { tenantId },
      );
      throw error;
    }
  }

  /**
   * Add compliance trend to queue
   */
  async addComplianceTrend(tenantId: string, trendData: Partial<ComplianceTrend>): Promise<void> {
    const traceId = `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (this.useRedis) {
      // TODO: Implement Redis queue when BullMQ is set up
    }

    // Database-based queue (fallback)
    try {
      await this.prisma.$executeRaw`
        INSERT INTO compliance.write_queue (id, job_type, job_data, status, created_at)
        VALUES (
          gen_random_uuid(),
          'compliance_trend',
          ${JSON.stringify({ tenantId, ...trendData })}::jsonb,
          'pending',
          NOW()
        )
      `;

      this.structuredLogger.log(
        'Compliance trend queued',
        'ComplianceQueueService',
        traceId,
        'addComplianceTrend',
        { tenantId, ruleId: trendData.rule_id },
      );
    } catch (error) {
      this.structuredLogger.error(
        'Failed to queue compliance trend',
        (error as Error).stack,
        'ComplianceQueueService',
        traceId,
        'addComplianceTrend',
        'QUEUE_ERROR',
        (error as Error).message,
        { tenantId },
      );
      throw error;
    }
  }

  /**
   * Start processing queue (database-based)
   */
  private startQueueProcessor() {
    // Process queue every 5 seconds
    setInterval(async () => {
      try {
        await this.processQueue();
      } catch (error) {
        this.logger.error('Error processing queue', error);
      }
    }, 5000);

    this.logger.log('Queue processor started (database-based)');
  }

  /**
   * Process pending queue items
   */
  private async processQueue(): Promise<void> {
    try {
      // Get pending jobs (limit 10 at a time)
      const jobs = await this.prisma.$queryRaw<Array<{
        id: string;
        job_type: string;
        job_data: any;
        attempts: number;
        max_attempts: number;
      }>>`
        SELECT id, job_type, job_data, attempts, max_attempts
        FROM compliance.write_queue
        WHERE status = 'pending'
        ORDER BY created_at ASC
        LIMIT 10
        FOR UPDATE SKIP LOCKED
      `;

      for (const job of jobs) {
        try {
          // Mark as processing - cast job.id to UUID
          await this.prisma.$executeRawUnsafe(
            `UPDATE compliance.write_queue
             SET status = 'processing', attempts = attempts + 1
             WHERE id = $1::uuid`,
            job.id
          );

          // Process job
          if (job.job_type === 'compliance_check') {
            await this.processComplianceCheck(job.job_data);
          } else if (job.job_type === 'compliance_trend') {
            await this.processComplianceTrend(job.job_data);
          }

          // Mark as completed
          await this.prisma.$executeRawUnsafe(
            `UPDATE compliance.write_queue
             SET status = 'completed', processed_at = NOW()
             WHERE id = $1::uuid`,
            job.id
          );
        } catch (error) {
          // Mark as failed if max attempts reached
          if (job.attempts >= job.max_attempts) {
            await this.prisma.$executeRawUnsafe(
              `UPDATE compliance.write_queue
               SET status = 'failed', error_message = $2
               WHERE id = $1::uuid`,
              job.id,
              (error as Error).message
            );
          } else {
            // Retry later
            await this.prisma.$executeRawUnsafe(
              `UPDATE compliance.write_queue
               SET status = 'pending'
               WHERE id = $1::uuid`,
              job.id
            );
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing queue batch', error);
    }
  }

  /**
   * Process compliance check job
   */
  private async processComplianceCheck(data: any): Promise<void> {
    const { tenantId, ...checkData } = data;
    
    // Use Prisma to create compliance check
    await this.prisma.complianceCheck.create({
      data: {
        tenant_id: tenantId,
        pr_number: checkData.pr_number,
        commit_sha: checkData.commit_sha,
        rule_id: checkData.rule_id,
        status: checkData.status,
        severity: checkData.severity,
        file_path: checkData.file_path,
        line_number: checkData.line_number,
        violation_message: checkData.violation_message,
        context: checkData.context || {},
      },
    });
  }

  /**
   * Process compliance trend job
   */
  private async processComplianceTrend(data: any): Promise<void> {
    const { tenantId, ...trendData } = data;
    
    // Use Prisma to create or update compliance trend
    // Note: Using raw SQL for upsert since Prisma unique constraint name might differ
    await this.prisma.$executeRaw`
      INSERT INTO compliance.compliance_trends (tenant_id, date, rule_id, violation_count, compliance_rate, created_at)
      VALUES (${tenantId}::uuid, ${new Date(trendData.date)}::date, ${trendData.rule_id}, ${trendData.violation_count || 0}, ${trendData.compliance_rate || 0}, NOW())
      ON CONFLICT (tenant_id, date, rule_id)
      DO UPDATE SET
        violation_count = EXCLUDED.violation_count,
        compliance_rate = EXCLUDED.compliance_rate
    `;
  }
}

