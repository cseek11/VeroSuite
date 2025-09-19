import { Controller, Get, Put, Post, Body, Logger, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { UpdateCompanySettingsDto, CompanySettingsResponseDto } from './dto/company-settings.dto';

@Controller('v1/company')
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
  ): Promise<{ logo_url: string }> {
    this.logger.log(`POST /company/logo - Logo upload received`);
    this.logger.log(`Request user:`, req.user);
    this.logger.log(`File details:`, { 
      filename: file?.originalname, 
      mimetype: file?.mimetype, 
      size: file?.size 
    });

    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      this.logger.error('❌ Tenant ID not found in request');
      throw new Error('Tenant ID not found in request');
    }

    this.logger.log(`✅ Uploading logo for tenant: ${tenantId}`);
    const logoUrl = await this.companyService.uploadLogo(tenantId, file);
    
    // Update the company settings with the new logo URL
    await this.companyService.updateCompanySettings(tenantId, { logo_url: logoUrl });
    this.logger.log(`✅ Logo URL saved to database: ${logoUrl}`);
    
    return { logo_url: logoUrl };
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
