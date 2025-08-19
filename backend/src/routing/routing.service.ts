import { Injectable } from '@nestjs/common';

@Injectable()
export class RoutingService {
  async getRoutes() {
    // TODO: Fetch routes from DB
    return [{ id: 'demo-route', technician: 'Demo Tech' }];
  }
}
