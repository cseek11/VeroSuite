import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantContextInterceptor } from './common/interceptors/tenant-context.interceptor';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { CrmModule } from './crm/crm.module';
import { RoutingModule } from './routing/routing.module';
import { UploadsModule } from './uploads/uploads.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { AccountsModule } from './accounts/accounts.module';
import { TechnicianModule } from './technician/technician.module';
import { UserModule } from './user/user.module';
import { AgreementsModule } from './agreements/agreements.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { BillingModule } from './billing/billing.module';
import { CompanyModule } from './company/company.module';
import { HealthModule } from './health/health.module';
import { LayoutsModule } from './layouts/layouts.module';
import { KPIsModule } from './kpis/kpis.module';
import { KpiTemplatesModule } from './kpi-templates/kpi-templates.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebSocketModule } from './websocket/websocket.module';
import { SessionsModule } from './sessions/sessions.module';
import { SecurityHeadersMiddleware } from './common/middleware/security-headers.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    JobsModule,
    CrmModule,
    RoutingModule,
    UploadsModule,
    WorkOrdersModule,
    AccountsModule,
    CompanyModule,
    TechnicianModule,
    UserModule,
    AgreementsModule,
    ServiceTypesModule,
    BillingModule,
    HealthModule,
    LayoutsModule,
    KPIsModule,
    KpiTemplatesModule,
    DashboardModule,
    WebSocketModule,
    SessionsModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TenantContextInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply security headers to all routes (first, so they're always present)
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*');
    
    // Apply rate limiting globally to all routes for abuse prevention
    // Configured per-route with different limits (dashboard: 100/min, auth: 10/min, etc.)
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');
    
    // Apply tenant middleware to all routes for multi-tenant isolation
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
