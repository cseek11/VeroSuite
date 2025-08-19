import { Controller, Get } from '@nestjs/common';
import { RoutingService } from './routing.service';

@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Get('routes')
  async getRoutes() {
    return this.routingService.getRoutes();
  }
}
