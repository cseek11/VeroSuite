import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Add connection pool parameters to DATABASE_URL (merge safely with existing params)
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/verofield';
    let urlWithPooling = databaseUrl;
    try {
      const url = new URL(databaseUrl);
      const searchParams = url.searchParams;
      // Defaults; allow overrides via env
      const defaultConnectionLimit = process.env.DB_CONNECTION_LIMIT || '10';
      const defaultPoolTimeout = process.env.DB_POOL_TIMEOUT || '60';
      const defaultConnectTimeout = process.env.DB_CONNECT_TIMEOUT || '60';
      if (!searchParams.has('connection_limit')) {
        searchParams.set('connection_limit', defaultConnectionLimit);
      }
      // Always ensure a sensible pool_timeout (override too-low values)
      searchParams.set('pool_timeout', defaultPoolTimeout);
      if (!searchParams.has('connect_timeout')) {
        searchParams.set('connect_timeout', defaultConnectTimeout);
      }
      url.search = searchParams.toString();
      urlWithPooling = url.toString();
    } catch {
      // Fallback to original string if URL parsing fails
      urlWithPooling = databaseUrl;
    }
    
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
      datasources: { 
        db: { 
          url: urlWithPooling
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

          async withTenant<T>(tenantId: string, operation: () => Promise<T>): Promise<T> {
            // Set tenant context for this operation
            await this.query(`SET LOCAL app.tenant_id = $1`, [tenantId]);
            // Skip setting the role for now - we'll rely on RLS policies instead
            // await this.query(`SET LOCAL ROLE verofield_app`);
            
            try {
              return await operation();
            } finally {
              // Reset context after operation
              await this.query(`RESET app.tenant_id`);
              // await this.query(`RESET ROLE`);
            }
          }

  async getCurrentTenantId(): Promise<string | null> {
    try {
      const result = await this.query(`SELECT current_setting('app.tenant_id', true) as tenant_id`) as any[];
      return result[0]?.tenant_id || null;
    } catch (error) {
      console.error('Failed to get current tenant ID:', error);
      return null;
    }
  }
}
