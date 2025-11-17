import { Controller, Get, Put, Post, Delete, Body, Logger, UseInterceptors, UploadedFile, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { UpdateCompanySettingsDto, CompanySettingsResponseDto } from './dto/company-settings.dto';

@Controller({ path: 'company', version: '1' })
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);

  constructor(private readonly companyService: CompanyService) {}

  @Get('test')
  async testEndpoint(): Promise<{ message: string }> {
    this.logger.log(`GET /company/test - Test endpoint called`);
    return { message: 'Company module is working!' };
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  async getCompanySettings(@Req() req: Request): Promise<CompanySettingsResponseDto | null> {
    this.logger.log(`GET /company/settings - Request received`);
    this.logger.log(`Request user:`, req.user);
    
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      this.logger.error('❌ Tenant ID not found in request');
      throw new Error('Tenant ID not found in request');
    }

    this.logger.log(`✅ Using tenant ID: ${tenantId}`);
    return this.companyService.getCompanySettings(tenantId);
  }

  @Post('logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() body: { logoType?: string },
  ): Promise<{ logo_url: string }> {
    const logoType = body.logoType || 'header'; // Default to header
    this.logger.log(`POST /company/logo - ${logoType} logo upload received`);
    this.logger.log(`Request user:`, req.user);
    this.logger.log(`File details:`, { 
      filename: file?.originalname, 
      mimetype: file?.mimetype, 
      size: file?.size,
      logoType 
    });

    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      this.logger.error('❌ Tenant ID not found in request');
      throw new Error('Tenant ID not found in request');
    }

    // Validate logo type
    if (!['header', 'invoice'].includes(logoType)) {
      this.logger.error(`❌ Invalid logo type: ${logoType}`);
      throw new Error('Invalid logo type. Must be "header" or "invoice"');
    }

    this.logger.log(`✅ Uploading ${logoType} logo for tenant: ${tenantId}`);
    const logoUrl = await this.companyService.uploadLogo(tenantId, file);
    
    // Update the appropriate logo field based on type
    const updateData = logoType === 'header' 
      ? { header_logo_url: logoUrl }
      : { invoice_logo_url: logoUrl };
      
    await this.companyService.updateCompanySettings(tenantId, updateData);
    this.logger.log(`✅ ${logoType} logo URL saved to database: ${logoUrl}`);
    
    return { logo_url: logoUrl };
  }

  @Delete('logo/:logoType')
  @UseGuards(JwtAuthGuard)
  async deleteLogo(
    @Req() req: Request,
    @Param('logoType') logoType: string,
  ): Promise<{ message: string }> {
    console.log(`🚨 DELETE ENDPOINT HIT! /company/logo/${logoType}`);
    this.logger.log(`DELETE /company/logo/${logoType} - Logo deletion received`);
    this.logger.log(`Request user:`, req.user);

    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      this.logger.error('❌ Tenant ID not found in request');
      throw new Error('Tenant ID not found in request');
    }

    // Validate logo type
    if (!['header', 'invoice'].includes(logoType)) {
      this.logger.error(`❌ Invalid logo type: ${logoType}`);
      throw new Error('Invalid logo type. Must be "header" or "invoice"');
    }

    this.logger.log(`✅ Deleting ${logoType} logo for tenant: ${tenantId}`);
    
    // Delete logo from storage and database
    await this.companyService.deleteLogo(tenantId, logoType as 'header' | 'invoice');
    this.logger.log(`✅ ${logoType} logo deleted successfully`);
    
    return { message: `${logoType} logo deleted successfully` };
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  async updateCompanySettings(
    @Req() req: Request,
    @Body() updateDto: UpdateCompanySettingsDto,
  ): Promise<CompanySettingsResponseDto> {
    this.logger.log(`PUT /company/settings - Request received`);
    this.logger.log(`Request user:`, req.user);
    this.logger.log(`Request body:`, updateDto);

    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      this.logger.error('❌ Tenant ID not found in request');
      throw new Error('Tenant ID not found in request');
    }

    this.logger.log(`✅ Updating settings for tenant: ${tenantId}`);
    const result = await this.companyService.updateCompanySettings(tenantId, updateDto);
    this.logger.log(`✅ Settings updated successfully`);
    
    return result;
  }
}
