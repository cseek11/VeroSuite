import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  ParseUUIDPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CrmService } from './crm.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@ApiTags('CRM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'crm', version: '1' })
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'Get all accounts' })
  async getAccounts(@Request() req: any) {
    console.log('CRM Controller - Request user:', req.user);
    console.log('CRM Controller - Tenant ID:', req.user?.tenantId);
    return this.crmService.getAccounts(req.user?.tenantId);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAccount(@Body() createAccountDto: any, @Request() req: any) {
    console.log('CRM Controller - Creating account for tenant:', req.user?.tenantId);
    console.log('CRM Controller - Account data:', createAccountDto);
    return this.crmService.createAccount(createAccountDto, req.user?.tenantId);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  async test() {
    console.log('CRM Controller - Test endpoint called');
    return { message: 'CRM Controller is working', timestamp: new Date().toISOString() };
  }

  @Get('test-supabase')
  @ApiOperation({ summary: 'Test Supabase connection' })
  async testSupabase() {
    console.log('CRM Controller - Test Supabase endpoint called');
    try {
      const result = await this.crmService.testSupabaseConnection();
      return { message: 'Supabase connection test successful', result };
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { message: 'Supabase connection test failed', error: errorMessage };
    }
  }

  // Customer Notes Endpoints
  @Get('accounts/:customerId/notes')
  @ApiOperation({ summary: 'Get all notes for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Notes retrieved successfully' })
  async getCustomerNotes(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Request() req: any
  ) {
    return this.crmService.getCustomerNotes(customerId, req.user.tenantId);
  }

  @Get('notes/:noteId')
  @ApiOperation({ summary: 'Get a specific note by ID' })
  @ApiParam({ name: 'noteId', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async getCustomerNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Request() req: any
  ) {
    return this.crmService.getCustomerNote(noteId, req.user.tenantId);
  }

  @Post('accounts/:customerId/notes')
  @ApiOperation({ summary: 'Create a new note for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCustomerNote(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: any
  ) {
    return this.crmService.createCustomerNote(customerId, createNoteDto, req.user.tenantId, req.user.id);
  }

  @Put('notes/:noteId')
  @ApiOperation({ summary: 'Update an existing note' })
  @ApiParam({ name: 'noteId', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async updateCustomerNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: any
  ) {
    return this.crmService.updateCustomerNote(noteId, updateNoteDto, req.user.tenantId);
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'noteId', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async deleteCustomerNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Request() req: any
  ) {
    return this.crmService.deleteCustomerNote(noteId, req.user.tenantId);
  }
}
