import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async getAccounts(@Req() req: Request) {
    // Tenant context is automatically available from middleware
    return this.accountsService.getAccountsForTenant(req.user!.tenantId);
  }

  @Get('search')
  async searchAccounts(@Req() req: Request, @Query('q') searchTerm: string) {
    return this.accountsService.searchAccounts(req.user!.tenantId, searchTerm);
  }

  @Get(':id')
  async getAccount(@Req() req: Request, @Param('id') accountId: string) {
    return this.accountsService.getAccountById(req.user!.tenantId, accountId);
  }

  @Post()
  async createAccount(@Req() req: Request, @Body() accountData: any) {
    return this.accountsService.createAccount(req.user!.tenantId, accountData);
  }

  @Put(':id')
  async updateAccount(
    @Req() req: Request,
    @Param('id') accountId: string,
    @Body() updates: any
  ) {
    return this.accountsService.updateAccount(req.user!.tenantId, accountId, updates);
  }

  @Delete(':id')
  async deleteAccount(@Req() req: Request, @Param('id') accountId: string) {
    return this.accountsService.deleteAccount(req.user!.tenantId, accountId);
  }
}
