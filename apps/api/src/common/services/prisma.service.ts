import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Backwards-compatible PrismaService wrapper.
 * 
 * Older tests and modules expect a PrismaService class; the primary
 * implementation for database access is now DatabaseService, which
 * extends PrismaClient. This wrapper simply reuses that behavior.
 */
@Injectable()
export class PrismaService extends DatabaseService {}



