import { Injectable } from '@nestjs/common';

@Injectable()
export class CrmService {
  async getAccounts() {
    // TODO: Fetch accounts from DB
    return [{ id: 'demo-account', name: 'Demo Account' }];
  }
}
