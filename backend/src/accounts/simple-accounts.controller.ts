import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

@Controller('accounts')
export class SimpleAccountsController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async getAccounts() {
    const supabase = this.supabaseService.getClient();
    
    // For now, return all accounts (we'll add tenant filtering later)
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .limit(100);

    if (error) {
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }

    return data;
  }

  @Get('search')
  async searchAccounts(@Query('q') searchTerm: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(50);

    if (error) {
      throw new Error(`Failed to search accounts: ${error.message}`);
    }

    return data;
  }

  @Get(':id')
  async getAccount(@Param('id') accountId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch account: ${error.message}`);
    }

    return data;
  }

  @Post()
  async createAccount(@Body() accountData: any) {
    const supabase = this.supabaseService.getClient();
    
    // Add tenant_id if not present (for now, use a default)
    const dataWithTenant = {
      ...accountData,
      tenant_id: accountData.tenant_id || '7193113e-ece2-4f7b-ae8c-176df4367e28'
    };
    
    const { data, error } = await supabase
      .from('accounts')
      .insert(dataWithTenant)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }

    return data;
  }

  @Put(':id')
  async updateAccount(@Param('id') accountId: string, @Body() updates: any) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', accountId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update account: ${error.message}`);
    }

    return data;
  }

  @Delete(':id')
  async deleteAccount(@Param('id') accountId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', accountId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }

    return data;
  }
}
