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
          header_logo_url: true,
          invoice_logo_url: true,
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

      // Return settings with independent logo fields (no fallback to main logo)
      return {
        ...settings,
        header_logo_url: settings.header_logo_url || null,
        invoice_logo_url: settings.invoice_logo_url || null,
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
      // Build update object with only provided fields
      const updateData: any = {
        updated_at: new Date(),
      };

      // Only update fields that are explicitly provided
      if (updateDto.company_name !== undefined) updateData.company_name = updateDto.company_name || null;
      if (updateDto.address !== undefined) updateData.address = updateDto.address || null;
      if (updateDto.city !== undefined) updateData.city = updateDto.city || null;
      if (updateDto.state !== undefined) updateData.state = updateDto.state || null;
      if (updateDto.zip_code !== undefined) updateData.zip_code = updateDto.zip_code || null;
      if (updateDto.country !== undefined) updateData.country = updateDto.country || null;
      if (updateDto.phone !== undefined) updateData.phone = updateDto.phone || null;
      if (updateDto.email !== undefined) updateData.email = updateDto.email || null;
      if (updateDto.website !== undefined) updateData.website = updateDto.website || null;
      if (updateDto.logo_url !== undefined) updateData.logo_url = updateDto.logo_url || null;
      if (updateDto.header_logo_url !== undefined) updateData.header_logo_url = updateDto.header_logo_url === '' ? null : updateDto.header_logo_url;
      if (updateDto.invoice_logo_url !== undefined) updateData.invoice_logo_url = updateDto.invoice_logo_url === '' ? null : updateDto.invoice_logo_url;

      const settings = await this.databaseService.tenantBranding.upsert({
        where: { tenant_id: tenantId },
        update: updateData,
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
          header_logo_url: updateDto.header_logo_url === '' ? null : (updateDto.header_logo_url ?? null),
          invoice_logo_url: updateDto.invoice_logo_url === '' ? null : (updateDto.invoice_logo_url ?? null),
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
          header_logo_url: true,
          invoice_logo_url: true,
          created_at: true,
          updated_at: true,
        },
      });

      this.logger.log(`Company settings updated successfully for tenant: ${tenantId}`);
      // Return settings with independent logo fields (no fallback to main logo)
      return {
        ...settings,
        header_logo_url: settings.header_logo_url || null,
        invoice_logo_url: settings.invoice_logo_url || null,
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

  async deleteLogo(tenantId: string, logoType: 'header' | 'invoice'): Promise<void> {
    this.logger.log(`🗑️ Starting delete process for ${logoType} logo, tenant: ${tenantId}`);

    try {
      // First, get the current logo URL from database
      const settings = await this.databaseService.tenantBranding.findUnique({
        where: { tenant_id: tenantId },
        select: {
          header_logo_url: true,
          invoice_logo_url: true,
        },
      });

      this.logger.log(`📋 Database settings retrieved:`, settings);

      if (!settings) {
        this.logger.warn(`❌ No tenant branding found for tenant: ${tenantId}`);
        return;
      }

      const logoUrl = logoType === 'header' ? settings.header_logo_url : settings.invoice_logo_url;
      this.logger.log(`🔍 Logo URL to delete: ${logoUrl}`);
      
      if (!logoUrl) {
        this.logger.warn(`❌ No ${logoType} logo found for tenant: ${tenantId}`);
        return;
      }

      // Extract the file path from the URL
      // URL format: https://domain.supabase.co/storage/v1/object/public/company-assets/company-logos/tenant-id/logo-timestamp.ext
      const urlParts = logoUrl.split('/storage/v1/object/public/company-assets/');
      this.logger.log(`🔗 URL split result:`, urlParts);
      
      if (urlParts.length !== 2) {
        this.logger.error(`❌ Invalid logo URL format: ${logoUrl}`);
        throw new Error('Invalid logo URL format');
      }
      
      const filePath = urlParts[1]; // e.g., "company-logos/tenant-id/logo-timestamp.ext"
      
      if (!filePath) {
        this.logger.error(`❌ Could not extract file path from URL: ${logoUrl}`);
        throw new Error('Could not extract file path from logo URL');
      }
      
      this.logger.log(`📁 File path to delete: ${filePath}`);

      // Delete from Supabase Storage
      this.logger.log(`🚮 Attempting to delete from Supabase Storage...`);
      const { data, error } = await this.supabaseService.getClient()
        .storage
        .from('company-assets')
        .remove([filePath]);

      this.logger.log(`📤 Supabase delete response:`, { data, error });

      if (error) {
        this.logger.error(`❌ Failed to delete logo from storage: ${error.message}`);
        throw new Error(`Logo deletion failed: ${error.message}`);
      }

      // Update database to remove the logo URL
      const updateData = logoType === 'header' 
        ? { header_logo_url: '' }
        : { invoice_logo_url: '' };
        
      await this.updateCompanySettings(tenantId, updateData);
      
      this.logger.log(`✅ ${logoType} logo deleted successfully from storage and database`);
    } catch (error) {
      this.logger.error(`Failed to delete logo: ${error}`);
      throw error;
    }
  }
}
