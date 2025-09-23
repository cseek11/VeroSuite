import { DashboardLayout } from '@/hooks/useDashboardLayout';
import { useAuthStore } from '@/stores/auth';

export interface SavedLayout {
  id: string;
  name: string;
  description?: string;
  storage_path: string;
  file_size?: number;
  layout?: DashboardLayout; // Optional - loaded separately
  created_at: string;
  updated_at: string;
  user_id: string;
  tenant_id: string;
  is_public: boolean;
  tags?: string[];
}

export interface LayoutStorageService {
  saveLayout: (name: string, layout: DashboardLayout, description?: string, tags?: string[], isPublic?: boolean) => Promise<SavedLayout>;
  loadLayout: (id: string) => Promise<SavedLayout | null>;
  loadLayoutData: (layoutId: string) => Promise<DashboardLayout | null>;
  getUserLayouts: () => Promise<SavedLayout[]>;
  deleteLayout: (id: string) => Promise<boolean>;
  updateLayout: (id: string, updates: Partial<SavedLayout>) => Promise<SavedLayout | null>;
  searchLayouts: (query: string) => Promise<SavedLayout[]>;
  downloadLayout: (id: string) => Promise<void>;
  uploadLayout: (file: File, name?: string, description?: string) => Promise<SavedLayout>;
}

class LayoutStorageServiceImpl implements LayoutStorageService {
  private getApiHeaders() {
    const authStore = useAuthStore.getState();
    if (!authStore.token) {
      throw new Error('No authentication token found');
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    };
  }

  private getApiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  }

  async saveLayout(
    name: string, 
    layout: DashboardLayout, 
    description?: string, 
    tags?: string[], 
    isPublic: boolean = false
  ): Promise<SavedLayout> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    const layoutData = {
      name: name.trim(),
      description: description?.trim() || null,
      layout: layout,
      tags: tags || [],
      is_public: isPublic
    };

    try {
      const response = await fetch(`${apiUrl}/layouts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(layoutData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to save layout: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving layout:', error);
      throw error;
    }
  }

  async loadLayout(id: string): Promise<SavedLayout | null> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    try {
      const response = await fetch(`${apiUrl}/layouts/${id}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to load layout: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error loading layout:', error);
      return null;
    }
  }

  async loadLayoutData(layoutId: string): Promise<DashboardLayout | null> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    try {
      const response = await fetch(`${apiUrl}/layouts/${layoutId}/data`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to load layout data: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error loading layout data:', error);
      return null;
    }
  }

  async getUserLayouts(): Promise<SavedLayout[]> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    try {
      const response = await fetch(`${apiUrl}/layouts`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to load user layouts: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error loading user layouts:', error);
      throw error;
    }
  }

  async deleteLayout(id: string): Promise<boolean> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    try {
      const response = await fetch(`${apiUrl}/layouts/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to delete layout: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result.success || true;
    } catch (error) {
      console.error('Error deleting layout:', error);
      throw error;
    }
  }

  async updateLayout(id: string, updates: Partial<SavedLayout>): Promise<SavedLayout | null> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    try {
      const response = await fetch(`${apiUrl}/layouts/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to update layout: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating layout:', error);
      return null;
    }
  }

  async searchLayouts(query: string): Promise<SavedLayout[]> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    try {
      const response = await fetch(`${apiUrl}/layouts/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to search layouts: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error searching layouts:', error);
      throw error;
    }
  }

  async downloadLayout(id: string): Promise<void> {
    const headers = this.getApiHeaders();
    const apiUrl = this.getApiBaseUrl();

    try {
      const response = await fetch(`${apiUrl}/layouts/${id}/download`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to download layout: ${errorData.message || response.statusText}`);
      }

      // Get the filename from the Content-Disposition header or use a default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'layout.json';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading layout:', error);
      throw error;
    }
  }

  async uploadLayout(file: File, name?: string, description?: string): Promise<SavedLayout> {
    // For now, read the file and parse it, then save it using the regular save method
    try {
      const fileContent = await file.text();
      const layoutData = JSON.parse(fileContent);
      
      // Handle both old and new file formats
      const layout = layoutData.layout || layoutData;
      const fileName = name || file.name.replace('.json', '');
      const fileDescription = description || layoutData.metadata?.description || '';
      const fileTags = layoutData.metadata?.tags || [];

      return this.saveLayout(fileName, layout, fileDescription, fileTags);
    } catch (error) {
      console.error('Error uploading layout:', error);
      throw new Error(`Failed to upload layout: ${error.message}`);
    }
  }
}

// Export singleton instance
export const layoutStorage = new LayoutStorageServiceImpl();
export default layoutStorage;