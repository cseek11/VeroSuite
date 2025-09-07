import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
      datasources: { 
        db: { 
          url: process.env.DATABASE_URL || 'postgresql://localhost:5432/verosuite'
        } 
      },
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
    // For $queryRawUnsafe, we need to replace placeholders with actual values
    if (params.length === 0) {
      return this.$queryRawUnsafe(sql);
    }
    
    // Replace $1, $2, etc. with actual values
    let processedSql = sql;
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`;
      let value;
      if (typeof param === 'string') {
        // Escape single quotes in strings
        value = `'${param.replace(/'/g, "''")}'`;
      } else if (param === null || param === undefined) {
        value = 'NULL';
      } else {
        value = String(param);
      }
      processedSql = processedSql.replace(placeholder, value);
    });
    
    console.log('DatabaseService - Processed SQL:', processedSql);
    return this.$queryRawUnsafe(processedSql);
  }

  async withTenant<T>(_tenantId: string, operation: () => Promise<T>): Promise<T> {
    // For now, just run the operation without tenant context
    return operation();
  }
}
