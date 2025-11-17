import { useState, useCallback, useEffect } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';

export enum VersionStatus {
  DRAFT = 'draft',
  PREVIEW = 'preview',
  PUBLISHED = 'published'
}

export interface LayoutVersion {
  id: string;
  layout_id: string;
  version_number: number;
  status: VersionStatus;
  created_by: string;
  created_at: string;
  diff?: any;
  notes?: string;
  payload: any;
}

interface UseLayoutVersioningOptions {
  layoutId: string;
}

interface UseLayoutVersioningReturn {
  versions: LayoutVersion[];
  loading: boolean;
  error: Error | null;
  currentVersion: LayoutVersion | null;
  createVersion: (status?: VersionStatus, notes?: string) => Promise<LayoutVersion>;
  publishVersion: (versionId: string, notes?: string) => Promise<LayoutVersion>;
  revertToVersion: (versionId: string) => Promise<void>;
  getVersionDiff: (versionId1: string, versionId2: string) => Promise<any>;
  loadVersions: () => Promise<void>;
}

export function useLayoutVersioning({ layoutId }: UseLayoutVersioningOptions): UseLayoutVersioningReturn {
  const [versions, setVersions] = useState<LayoutVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentVersion, setCurrentVersion] = useState<LayoutVersion | null>(null);

  const loadVersions = useCallback(async () => {
    if (!layoutId) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await enhancedApi.dashboardLayouts.getVersions(layoutId);
      setVersions(data as LayoutVersion[]);
      
      // Find published version
      const published = data.find((v: LayoutVersion) => v.status === VersionStatus.PUBLISHED);
      setCurrentVersion(published || null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load versions'));
    } finally {
      setLoading(false);
    }
  }, [layoutId]);

  // Don't load if layoutId is not available
  useEffect(() => {
    if (layoutId) {
      loadVersions();
    }
  }, [layoutId, loadVersions]);

  const createVersion = useCallback(async (status: VersionStatus = VersionStatus.DRAFT, notes?: string): Promise<LayoutVersion> => {
    try {
      setError(null);
      const version = await enhancedApi.dashboardLayouts.createVersion(layoutId, status, notes);
      setVersions(prev => [version as LayoutVersion, ...prev]);
      return version as LayoutVersion;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create version');
      setError(error);
      throw error;
    }
  }, [layoutId]);

  const publishVersion = useCallback(async (versionId: string, notes?: string): Promise<LayoutVersion> => {
    try {
      setError(null);
      const version = await enhancedApi.dashboardLayouts.publishVersion(layoutId, versionId, notes);
      
      // Update versions list
      setVersions(prev => prev.map(v => 
        v.id === versionId 
          ? { ...v, status: VersionStatus.PUBLISHED, notes: notes || v.notes }
          : v.status === VersionStatus.PUBLISHED
          ? { ...v, status: VersionStatus.DRAFT }
          : v
      ));
      
      setCurrentVersion(version as LayoutVersion);
      return version as LayoutVersion;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to publish version');
      setError(error);
      throw error;
    }
  }, [layoutId]);

  const revertToVersion = useCallback(async (versionId: string): Promise<void> => {
    try {
      setError(null);
      await enhancedApi.dashboardLayouts.revertToVersion(layoutId, versionId);
      // Reload versions after revert
      await loadVersions();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to revert to version');
      setError(error);
      throw error;
    }
  }, [layoutId, loadVersions]);

  const getVersionDiff = useCallback(async (versionId1: string, versionId2: string): Promise<any> => {
    try {
      setError(null);
      const version1 = versions.find(v => v.id === versionId1);
      const version2 = versions.find(v => v.id === versionId2);
      
      if (!version1 || !version2) {
        throw new Error('One or both versions not found');
      }

      // Simple diff calculation
      const diff: any = {
        added: [],
        removed: [],
        modified: []
      };

      const regions1 = version1.payload?.regions || [];
      const regions2 = version2.payload?.regions || [];

      const regionMap1 = new Map(regions1.map((r: any) => [r.id, r]));
      const regionMap2 = new Map(regions2.map((r: any) => [r.id, r]));

      // Find added regions
      for (const [id, region] of regionMap2) {
        if (!regionMap1.has(id)) {
          diff.added.push(region);
        }
      }

      // Find removed regions
      for (const [id, region] of regionMap1) {
        if (!regionMap2.has(id)) {
          diff.removed.push(region);
        }
      }

      // Find modified regions
      for (const [id, region1] of regionMap1) {
        const region2 = regionMap2.get(id);
        if (region2 && JSON.stringify(region1) !== JSON.stringify(region2)) {
          diff.modified.push({
            id,
            old: region1,
            new: region2
          });
        }
      }

      return diff;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get version diff');
      setError(error);
      throw error;
    }
  }, [versions]);

  return {
    versions,
    loading,
    error,
    currentVersion,
    createVersion,
    publishVersion,
    revertToVersion,
    getVersionDiff,
    loadVersions
  };
}

