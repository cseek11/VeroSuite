import React, { useState } from 'react';
import { useLayoutVersioning, LayoutVersion, VersionStatus } from '@/hooks/useLayoutVersioning';

interface PublishDialogProps {
  layoutId: string;
  version: LayoutVersion;
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (version: LayoutVersion) => void;
}

export const PublishDialog: React.FC<PublishDialogProps> = ({
  layoutId,
  version,
  isOpen,
  onClose,
  onPublished
}) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { publishVersion } = useLayoutVersioning({ layoutId });

  const handlePublish = async () => {
    if (version.status === VersionStatus.PUBLISHED) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const published = await publishVersion(version.id, notes || undefined);
      onPublished?.(published);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to publish version'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Publish Version</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Publishing version <strong>{version.version_number}</strong> will make it the active version for all users.
            </p>
            {version.status === VersionStatus.PUBLISHED && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                This version is already published.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe what changed in this version..."
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800">{error.message}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={loading || version.status === VersionStatus.PUBLISHED}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Version'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};





