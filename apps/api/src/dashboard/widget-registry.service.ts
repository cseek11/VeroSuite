import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { RegisterWidgetDto, WidgetRegistryResponseDto, WidgetManifestDto } from './dto/dashboard-region.dto';
import * as crypto from 'crypto';

@Injectable()
export class WidgetRegistryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async registerWidget(registerDto: RegisterWidgetDto, user: any): Promise<WidgetRegistryResponseDto> {
    try {
      // Validate manifest
      this.validateWidgetManifest(registerDto.manifest);

      // Check if widget already exists
      const { data: existing } = await this.supabaseService.getClient()
        .from('dashboard_widget_registry')
        .select('*')
        .eq('widget_id', registerDto.manifest.widget_id)
        .single();

      if (existing) {
        throw new BadRequestException(`Widget with ID ${registerDto.manifest.widget_id} already exists`);
      }

      // Sign manifest (simplified - in production, use proper signing)
      const signature = this.signWidgetManifest(registerDto.manifest);

      // Insert widget (requires admin approval)
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_widget_registry')
        .insert({
          widget_id: registerDto.manifest.widget_id,
          manifest: registerDto.manifest,
          signature,
          allowed_tenants: registerDto.allowed_tenants || [],
          is_public: registerDto.is_public || false,
          is_approved: false, // Requires admin approval
          created_by: user.userId
        })
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to register widget: ${error.message}`);
      }

      return data as WidgetRegistryResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to register widget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateWidgetManifest(manifest: WidgetManifestDto): void {
    if (!manifest.widget_id || !manifest.name || !manifest.version || !manifest.entry_point) {
      throw new BadRequestException('Manifest must include widget_id, name, version, and entry_point');
    }

    // Validate widget_id format (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(manifest.widget_id)) {
      throw new BadRequestException('widget_id must contain only alphanumeric characters, hyphens, and underscores');
    }

    // Validate entry_point is a valid URL
    try {
      new URL(manifest.entry_point);
    } catch {
      throw new BadRequestException('entry_point must be a valid URL');
    }

    // Validate config_schema if provided
    if (manifest.config_schema) {
      // Basic validation - in production, use JSON Schema validator
      if (typeof manifest.config_schema !== 'object') {
        throw new BadRequestException('config_schema must be a valid JSON object');
      }
    }
  }

  signWidgetManifest(manifest: WidgetManifestDto): string {
    // Simplified signing - in production, use proper cryptographic signing
    const manifestString = JSON.stringify(manifest, Object.keys(manifest).sort());
    const hash = crypto.createHash('sha256').update(manifestString).digest('hex');
    return hash;
  }

  async getApprovedWidgets(tenantId: string): Promise<WidgetRegistryResponseDto[]> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_widget_registry')
        .select('*')
        .eq('is_approved', true)
        .or(`is_public.eq.true,allowed_tenants.cs.{${tenantId}}`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new BadRequestException(`Failed to get approved widgets: ${error.message}`);
      }

      return data as WidgetRegistryResponseDto[];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get approved widgets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateWidgetConfig(widgetType: string, config: any): Promise<{ valid: boolean; errors: string[] }> {
    try {
      // Get widget manifest
      const { data: widget } = await this.supabaseService.getClient()
        .from('dashboard_widget_registry')
        .select('manifest')
        .eq('widget_id', widgetType)
        .eq('is_approved', true)
        .single();

      if (!widget) {
        return { valid: false, errors: [`Widget ${widgetType} not found or not approved`] };
      }

      const manifest = widget.manifest as WidgetManifestDto;
      const errors: string[] = [];

      // Validate config against schema if provided
      if (manifest.config_schema) {
        // Basic validation - in production, use JSON Schema validator like ajv
        const schema = manifest.config_schema;
        
        // Check required fields
        if (schema.required && Array.isArray(schema.required)) {
          for (const field of schema.required) {
            if (!(field in config)) {
              errors.push(`Missing required field: ${field}`);
            }
          }
        }

        // Check field types
        if (schema.properties && typeof schema.properties === 'object') {
          for (const [field, fieldSchema] of Object.entries(schema.properties)) {
            if (field in config) {
              const fieldType = (fieldSchema as any).type;
              const actualType = typeof config[field];
              
              if (fieldType === 'string' && actualType !== 'string') {
                errors.push(`Field ${field} must be a string`);
              } else if (fieldType === 'number' && actualType !== 'number') {
                errors.push(`Field ${field} must be a number`);
              } else if (fieldType === 'boolean' && actualType !== 'boolean') {
                errors.push(`Field ${field} must be a boolean`);
              }
            }
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to validate widget config: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  async approveWidget(widgetId: string, _user: any): Promise<WidgetRegistryResponseDto> {
    try {
      // Check if user is admin (simplified - in production, use proper role checking)
      // For now, allow any authenticated user to approve (should be restricted in production)

      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_widget_registry')
        .update({ is_approved: true })
        .eq('widget_id', widgetId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Widget not found');
        }
        throw new BadRequestException(`Failed to approve widget: ${error.message}`);
      }

      return data as WidgetRegistryResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to approve widget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

