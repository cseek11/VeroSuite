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
  ParseUUIDPipe,
  Header,
  UseInterceptors
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
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

/**
 * CRM API v2 Controller
 * 
 * Enhanced endpoints with:
 * - Consistent response format with metadata
 * - Idempotency support
 * - Better error responses
 */
@ApiTags('CRM V2')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'crm', version: '2' })
@UseInterceptors(IdempotencyInterceptor)
export class CrmV2Controller {
  constructor(private readonly crmService: CrmService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'Get all accounts (V2)' })
  @Header('API-Version', '2.0')
  async getAccounts(@Request() req: any) {
    const result = await this.crmService.getAccounts(req.user?.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Create a new account (V2)' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @Header('API-Version', '2.0')
  async createAccount(@Body() createAccountDto: any, @Request() req: any) {
    const result = await this.crmService.createAccount(createAccountDto, req.user?.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('accounts/:customerId/notes')
  @ApiOperation({ summary: 'Get all notes for a customer (V2)' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Notes retrieved successfully' })
  @Header('API-Version', '2.0')
  async getCustomerNotes(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Request() req: any
  ) {
    const result = await this.crmService.getCustomerNotes(customerId, req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('notes/:noteId')
  @ApiOperation({ summary: 'Get a specific note by ID (V2)' })
  @ApiParam({ name: 'noteId', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note retrieved successfully' })
  @Header('API-Version', '2.0')
  async getCustomerNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Request() req: any
  ) {
    const result = await this.crmService.getCustomerNote(noteId, req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('accounts/:customerId/notes')
  @ApiOperation({ summary: 'Create a new note for a customer (V2)' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @Header('API-Version', '2.0')
  async createCustomerNote(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: any
  ) {
    const result = await this.crmService.createCustomerNote(customerId, createNoteDto, req.user.tenantId, req.user.id);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put('notes/:noteId')
  @ApiOperation({ summary: 'Update an existing note (V2)' })
  @ApiParam({ name: 'noteId', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @Header('API-Version', '2.0')
  async updateCustomerNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: any
  ) {
    const result = await this.crmService.updateCustomerNote(noteId, updateNoteDto, req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: 'Delete a note (V2)' })
  @ApiParam({ name: 'noteId', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  @Header('API-Version', '2.0')
  async deleteCustomerNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Request() req: any
  ) {
    await this.crmService.deleteCustomerNote(noteId, req.user.tenantId);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }
}


