import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { CreateLayoutDto, UpdateLayoutDto, SearchLayoutsDto, LayoutResponseDto } from './dto';

@Injectable()
export class LayoutsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createLayout(createLayoutDto: CreateLayoutDto, user: any): Promise<LayoutResponseDto> {
    const { name, description, layout, tags, is_public } = createLayoutDto;
    
    // Generate unique layout ID and file path
    const layoutId = this.generateUUID();
    const fileName = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${layoutId}.json`;
    const storagePath = `${user.userId}/${fileName}`;

    // Prepare layout data for storage
    const layoutJson = JSON.stringify({
      version: '2.0',
      exportedAt: Date.now(),
      layout: layout,
      metadata: {
        name: name.trim(),
        description: description?.trim(),
        tags: tags || []
      }
    }, null, 2);

    try {
      // Upload layout file to Supabase storage using service role key
      const { error: uploadError } = await this.supabaseService.getClient()
        .storage
        .from('dashboard-layouts')
        .upload(storagePath, layoutJson, {
          contentType: 'application/json',
          upsert: false
        });

      if (uploadError) {
        throw new BadRequestException(`Failed to upload layout file: ${uploadError.message}`);
      }

      // Save metadata to database
      const layoutData = {
        id: layoutId,
        name: name.trim(),
        description: description?.trim() || null,
        storage_path: storagePath,
        file_size: Buffer.byteLength(layoutJson, 'utf8'),
        user_id: user.userId,
        tenant_id: user.tenantId,
        is_public: is_public || false,
        tags: tags || []
      };

      const { data, error } = await this.supabaseService.getClient()
        .from('saved_layouts')
        .insert([layoutData])
        .select()
        .single();

      if (error) {
        // Clean up uploaded file if database insert fails
        try {
          await this.supabaseService.getClient()
            .storage
            .from('dashboard-layouts')
            .remove([storagePath]);
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', cleanupError);
        }
        throw new BadRequestException(`Failed to save layout metadata: ${error.message}`);
      }

      return data as LayoutResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserLayouts(user: any): Promise<LayoutResponseDto[]> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('saved_layouts')
        .select('*')
        .or(`user_id.eq.${user.userId},and(tenant_id.eq.${user.tenantId},is_public.eq.true)`)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new BadRequestException(`Failed to retrieve layouts: ${error.message}`);
      }

      return data as LayoutResponseDto[];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get user layouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLayout(id: string, user: any): Promise<LayoutResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('saved_layouts')
        .select('*')
        .eq('id', id)
        .or(`user_id.eq.${user.userId},and(tenant_id.eq.${user.tenantId},is_public.eq.true)`)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Layout not found');
        }
        throw new BadRequestException(`Failed to retrieve layout: ${error.message}`);
      }

      return data as LayoutResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLayoutData(id: string, user: any): Promise<any> {
    // First get the layout metadata
    const layout = await this.getLayout(id, user);

    try {
      // Download the layout file from storage
      const { data, error } = await this.supabaseService.getClient()
        .storage
        .from('dashboard-layouts')
        .download(layout.storage_path);

      if (error) {
        throw new BadRequestException(`Failed to download layout file: ${error.message}`);
      }

      // Parse the JSON content
      const text = await data.text();
      const layoutContent = JSON.parse(text);

      // Return the layout data (handle both old and new formats)
      if (layoutContent.layout) {
        return layoutContent.layout;
      } else {
        return layoutContent;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get layout data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateLayout(id: string, updateLayoutDto: UpdateLayoutDto, user: any): Promise<LayoutResponseDto> {
    // First verify the layout exists and user has access
    await this.getLayout(id, user);

    try {
      const updateData = {
        ...updateLayoutDto,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabaseService.getClient()
        .from('saved_layouts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.userId) // Ensure user can only update their own layouts
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to update layout: ${error.message}`);
      }

      return data as LayoutResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteLayout(id: string, user: any): Promise<{ success: boolean }> {
    // First get the layout to get the storage path
    const layout = await this.getLayout(id, user);

    // Ensure user can only delete their own layouts
    if (layout.user_id !== user.userId) {
      throw new UnauthorizedException('You can only delete your own layouts');
    }

    try {
      // Delete from database
      const { error: dbError } = await this.supabaseService.getClient()
        .from('saved_layouts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.userId);

      if (dbError) {
        throw new BadRequestException(`Failed to delete layout: ${dbError.message}`);
      }

      // Delete from storage
      const { error: storageError } = await this.supabaseService.getClient()
        .storage
        .from('dashboard-layouts')
        .remove([layout.storage_path]);

      if (storageError) {
        console.error('Failed to delete layout file from storage:', storageError);
        // Don't throw error here as the database record is already deleted
      }

      return { success: true };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchLayouts(searchDto: SearchLayoutsDto, user: any): Promise<LayoutResponseDto[]> {
    try {
      let query = this.supabaseService.getClient()
        .from('saved_layouts')
        .select('*')
        .or(`user_id.eq.${user.userId},and(tenant_id.eq.${user.tenantId},is_public.eq.true)`);

      if (searchDto.q) {
        query = query.or(`name.ilike.%${searchDto.q}%,description.ilike.%${searchDto.q}%`);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) {
        throw new BadRequestException(`Failed to search layouts: ${error.message}`);
      }

      return data as LayoutResponseDto[];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to search layouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadLayout(_uploadDto: any, _user: any): Promise<LayoutResponseDto> {
    // This would handle file upload - implementation depends on your file handling approach
    throw new BadRequestException('File upload not yet implemented');
  }

  async downloadLayout(id: string, user: any): Promise<{ data: Buffer; filename: string }> {
    const layout = await this.getLayout(id, user);

    try {
      const { data, error } = await this.supabaseService.getClient()
        .storage
        .from('dashboard-layouts')
        .download(layout.storage_path);

      if (error) {
        throw new BadRequestException(`Failed to download layout file: ${error.message}`);
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      const filename = `${layout.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;

      return { data: buffer, filename };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to download layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
