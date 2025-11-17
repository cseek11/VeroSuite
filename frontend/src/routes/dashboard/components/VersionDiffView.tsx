import React, { useState, useEffect } from 'react';
import { useLayoutVersioning, LayoutVersion } from '@/hooks/useLayoutVersioning';

interface VersionDiffViewProps {
  layoutId: string;
  version1: LayoutVersion;
  version2: LayoutVersion;
}

export const VersionDiffView: React.FC<VersionDiffViewProps> = ({
  layoutId,
  version1,
  version2
}) => {
  const [diff, setDiff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getVersionDiff } = useLayoutVersioning({ layoutId });

  useEffect(() => {
    const loadDiff = async () => {
      try {
        setLoading(true);
        const diffData = await getVersionDiff(version1.id, version2.id);
        setDiff(diffData);
      } catch (error) {
        console.error('Failed to load diff:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDiff();
  }, [version1.id, version2.id, getVersionDiff]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-100 rounded"></div>
            <div className="h-8 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!diff) {
    return (
      <div className="p-4 text-gray-500">
        <p>No differences found between versions</p>
      </div>
    );
  }

  return (
    <div className="version-diff p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Version Comparison</h3>
        <div className="text-sm text-gray-600">
          Version {version1.version_number} → Version {version2.version_number}
        </div>
      </div>

      <div className="space-y-4">
        {diff.added && diff.added.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-2">
              Added Regions ({diff.added.length})
            </h4>
            <div className="space-y-2">
              {diff.added.map((region: any, index: number) => (
                <div key={index} className="p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium">{region.region_type}</p>
                  <p className="text-xs text-gray-600">Position: ({region.grid_row}, {region.grid_col})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {diff.removed && diff.removed.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-2">
              Removed Regions ({diff.removed.length})
            </h4>
            <div className="space-y-2">
              {diff.removed.map((region: any, index: number) => (
                <div key={index} className="p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-medium">{region.region_type}</p>
                  <p className="text-xs text-gray-600">Position: ({region.grid_row}, {region.grid_col})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {diff.modified && diff.modified.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-yellow-700 mb-2">
              Modified Regions ({diff.modified.length})
            </h4>
            <div className="space-y-2">
              {diff.modified.map((change: any, index: number) => (
                <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-medium">{change.new.region_type}</p>
                  <div className="mt-1 text-xs space-y-1">
                    {change.old.grid_row !== change.new.grid_row && (
                      <p className="text-gray-600">
                        Row: {change.old.grid_row} → {change.new.grid_row}
                      </p>
                    )}
                    {change.old.grid_col !== change.new.grid_col && (
                      <p className="text-gray-600">
                        Col: {change.old.grid_col} → {change.new.grid_col}
                      </p>
                    )}
                    {change.old.row_span !== change.new.row_span && (
                      <p className="text-gray-600">
                        Row Span: {change.old.row_span} → {change.new.row_span}
                      </p>
                    )}
                    {change.old.col_span !== change.new.col_span && (
                      <p className="text-gray-600">
                        Col Span: {change.old.col_span} → {change.new.col_span}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!diff.added || diff.added.length === 0) &&
         (!diff.removed || diff.removed.length === 0) &&
         (!diff.modified || diff.modified.length === 0) && (
          <div className="p-4 text-center text-gray-500">
            <p>No differences found between these versions</p>
          </div>
        )}
      </div>
    </div>
  );
};





