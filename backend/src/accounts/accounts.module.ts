import { Module } from '@nestjs/common';
import { BasicAccountsController } from './basic-accounts.controller';

@Module({
  controllers: [BasicAccountsController],
  providers: [],
  exports: [],
})
export class AccountsModule {}
