import React from 'react';

interface ConflictAlertProps {
  conflicts: Array<{
    region_id: string;
    conflicting_users: string[];
  }>;
  onResolve?: () => void;
  onDismiss?: () => void;
}

export const ConflictAlert: React.FC<ConflictAlertProps> = ({
  conflicts,
  onResolve,
  onDismiss
}) => {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div className="conflict-alert fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-lg rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Editing Conflicts Detected
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                {conflicts.length} {conflicts.length === 1 ? 'region' : 'regions'} {conflicts.length === 1 ? 'is' : 'are'} being edited by other users.
              </p>
              <ul className="mt-2 list-disc list-inside">
                {conflicts.map((conflict, index) => (
                  <li key={index}>
                    Region {conflict.region_id.slice(0, 8)}: {conflict.conflicting_users.length} {conflict.conflicting_users.length === 1 ? 'user' : 'users'}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex gap-2">
              {onResolve && (
                <button
                  onClick={onResolve}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Resolve Conflicts
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





