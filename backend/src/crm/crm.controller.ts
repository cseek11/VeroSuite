import { Controller, Get } from '@nestjs/common';
import { CrmService } from './crm.service';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('accounts')
  async getAccounts() {
    return this.crmService.getAccounts();
  }
}
