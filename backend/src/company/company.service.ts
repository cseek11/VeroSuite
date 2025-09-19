import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { SupabaseService } from '../common/services/supabase.service';
import { UpdateCompanySettingsDto, CompanySettingsResponseDto } from './dto/company-settings.dto';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getCompanySettings(tenantId: string): Promise<CompanySettingsResponseDto | null> {
    this.logger.log(`Fetching company settings for tenant: ${tenantId}`);

    try {
      const settings = await this.databaseService.tenantBranding.findUnique({
        where: { tenant_id: tenantId },
        select: {
          id: true,
          tenant_id: true,
          company_name: true,
          address: true,
          city: true,
          state: true,
          zip_code: true,
          country: true,
          phone: true,
          email: true,
          website: true,
          logo_url: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!settings) {
        // Return default settings if none exist
        return {
          id: '',
          tenant_id: tenantId,
          company_name: 'VeroField Pest Control',
          address: null,
          city: null,
          state: null,
          zip_code: null,
          country: 'USA',
          phone: null,
          email: null,
          website: null,
          logo_url: null,
          header_logo_url: null, // Fallback value
          invoice_logo_url: null, // Fallback value
          created_at: new Date(),
          updated_at: new Date(),
        };
      }

      // Add fallback values for fields that don't exist in database yet
      return {
        ...settings,
        header_logo_url: settings.logo_url, // Use main logo as fallback
        invoice_logo_url: settings.logo_url, // Use main logo as fallback
      } as CompanySettingsResponseDto;
    } catch (error) {
      this.logger.error(`Failed to fetch company settings: ${error}`);
      throw error;
    }
  }

  async updateCompanySettings(
    tenantId: string,
    updateDto: UpdateCompanySettingsDto,
  ): Promise<CompanySettingsResponseDto> {
    this.logger.log(`Updating company settings for tenant: ${tenantId}`);

    try {
      const settings = await this.databaseService.tenantBranding.upsert({
        where: { tenant_id: tenantId },
        update: {
          company_name: updateDto.company_name ?? null,
          address: updateDto.address ?? null,
          city: updateDto.city ?? null,
          state: updateDto.state ?? null,
          zip_code: updateDto.zip_code ?? null,
          country: updateDto.country ?? null,
          phone: updateDto.phone ?? null,
          email: updateDto.email ?? null,
          website: updateDto.website ?? null,
          logo_url: updateDto.logo_url ?? null,
          updated_at: new Date(),
        },
        create: {
          tenant_id: tenantId,
          company_name: updateDto.company_name || 'VeroField Pest Control',
          address: updateDto.address ?? null,
          city: updateDto.city ?? null,
          state: updateDto.state ?? null,
          zip_code: updateDto.zip_code ?? null,
          country: updateDto.country || 'USA',
          phone: updateDto.phone ?? null,
          email: updateDto.email ?? null,
          website: updateDto.website ?? null,
          logo_url: updateDto.logo_url ?? null,
        },
        select: {
          id: true,
          tenant_id: true,
          company_name: true,
          address: true,
          city: true,
          state: true,
          zip_code: true,
          country: true,
          phone: true,
          email: true,
          website: true,
          logo_url: true,
          created_at: true,
          updated_at: true,
        },
      });

      this.logger.log(`Company settings updated successfully for tenant: ${tenantId}`);
      // Add fallback values for fields that don't exist in database yet
      return {
        ...settings,
        header_logo_url: settings.logo_url, // Use main logo as fallback
        invoice_logo_url: settings.logo_url, // Use main logo as fallback
      } as CompanySettingsResponseDto;
    } catch (error) {
      this.logger.error(`Failed to update company settings: ${error}`);
      throw error;
    }
  }

  async uploadLogo(tenantId: string, file: any): Promise<string> {
    this.logger.log(`Uploading logo for tenant: ${tenantId}`);

    try {
      // Create unique filename with tenant prefix
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `company-logos/${tenantId}/logo-${Date.now()}.${fileExtension}`;

      // Upload to Supabase Storage
      const { error } = await this.supabaseService.getClient()
        .storage
        .from('company-assets')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true, // Allow overwriting existing logos
        });

      if (error) {
        this.logger.error(`Failed to upload logo: ${error.message}`);
        throw new Error(`Logo upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = this.supabaseService.getClient()
        .storage
        .from('company-assets')
        .getPublicUrl(fileName);

      const logoUrl = publicUrlData.publicUrl;
      this.logger.log(`Logo uploaded successfully: ${logoUrl}`);

      return logoUrl;
    } catch (error) {
      this.logger.error(`Failed to upload logo: ${error}`);
      throw error;
    }
  }
}
