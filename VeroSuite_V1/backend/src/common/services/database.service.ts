import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
      datasources: { db: { url: process.env.DATABASE_URL } },
    });
  }

  async onModuleInit() {
    await this.$connect();
    // eslint-disable-next-line no-console
    console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async query(sql: string, params: any[] = []) {
    // Use unsafe for dynamic SET LOCAL statements
    return this.$queryRawUnsafe(sql, ...params);
  }

  async withTenant<T>(tenantId: string, operation: () => Promise<T>): Promise<T> {
    return this.$transaction(async (tx) => {
      await tx.$queryRawUnsafe(`SET LOCAL app.tenant_id = $1`, tenantId);
      await tx.$queryRawUnsafe(`SET LOCAL ROLE verosuite_app`);
      return operation();
    });
  }
}
