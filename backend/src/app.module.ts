import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseService } from './common/services/database.service';
import { SupabaseService } from './common/services/supabase.service';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
// import { TenantIsolationMiddleware } from './middleware/tenant-isolation.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantContextInterceptor } from './common/interceptors/tenant-context.interceptor';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    JobsModule,
    CrmModule,
    RoutingModule,
    UploadsModule,
    WorkOrdersModule,
    AccountsModule,
    TechnicianModule,
    UserModule,
    AgreementsModule,
    ServiceTypesModule,
  ],
  providers: [
    DatabaseService,
    SupabaseService,
    { provide: APP_INTERCEPTOR, useClass: TenantContextInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
    // Temporarily disable the complex middleware for now
    // consumer.apply(TenantIsolationMiddleware).forRoutes('api/accounts*');
  }
}
