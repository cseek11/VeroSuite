import { Module, Global } from '@nestjs/common';
import { AppSchedulingFacade } from './app-scheduling.facade';
import { AppTechnicianFacade } from './app-technician.facade';

/**
 * ServiceDeliveryModule
 * Provides facades and application-layer adapters for the Service-Delivery bounded context.
 * Feature-flag wiring will be added at composition time to switch between old implementations
 * and these application adapters.
 */
@Global()
@Module({
  providers: [
    AppSchedulingFacade,
    AppTechnicianFacade,
    // TODO: add factory providers to bind tokens such as 'SchedulingFacade' and
    // 'TechnicianFacade' to either the old services or these adapters based on feature flags.
  ],
  exports: [AppSchedulingFacade, AppTechnicianFacade],
})
export class ServiceDeliveryModule {}
