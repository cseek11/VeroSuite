import React from 'react';
import { useLayoutVersioning, LayoutVersion, VersionStatus } from '@/hooks/useLayoutVersioning';

interface VersionHistoryProps {
  layoutId: string;
  onSelectVersion?: (version: LayoutVersion) => void;
  onRevert?: (version: LayoutVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  layoutId,
  onSelectVersion,
  onRevert
}) => {
  const {
    versions,
    loading,
    error,
    currentVersion,
    loadVersions,
    revertToVersion
  } = useLayoutVersioning({ layoutId });

  React.useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  const handleRevert = async (version: LayoutVersion) => {
    if (window.confirm(`Are you sure you want to revert to version ${version.version_number}? This will create a new version with the reverted state.`)) {
      try {
        await revertToVersion(version.id);
        onRevert?.(version);
      } catch (error) {
        console.error('Failed to revert:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-800">Error loading versions: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="version-history p-4">
      <h3 className="text-lg font-semibold mb-4">Version History</h3>
      
      {versions.length === 0 ? (
        <p className="text-gray-500 text-sm">No versions found</p>
      ) : (
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                currentVersion?.id === version.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => onSelectVersion?.(version)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Version {version.version_number}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        version.status === VersionStatus.PUBLISHED
                          ? 'bg-green-100 text-green-800'
                          : version.status === VersionStatus.PREVIEW
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {version.status}
                    </span>
                    {currentVersion?.id === version.id && (
                      <span className="text-xs text-blue-600 font-medium">(Current)</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(version.created_at).toLocaleString()}
                  </p>
                  {version.notes && (
                    <p className="text-sm text-gray-500 mt-1">{version.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {currentVersion?.id !== version.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRevert(version);
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Revert
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};





