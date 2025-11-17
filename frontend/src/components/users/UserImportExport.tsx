import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Download, Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { logger } from '@/utils/logger';
import { exportToCSV } from '@/utils/exportUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

async function exportUsers(): Promise<any[]> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const response = await fetch(`${API_BASE_URL}/v1/users/export`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to export users: ${response.statusText}`);
  }

  const data = await response.json();
  return data.users;
}

async function importUsers(file: File): Promise<ImportResult> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/v1/users/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to import users');
  }

  return response.json();
}

export default function UserImportExport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const exportMutation = useMutation({
    mutationFn: exportUsers,
    onSuccess: (users) => {
      // Use existing export utility
      exportToCSV(
        {
          title: 'Users Export',
          level: { id: 'users', name: 'Users' },
          data: users,
          metadata: {
            exportedAt: new Date().toISOString(),
            exportedBy: 'System',
            totalRecords: users.length,
            filteredRecords: users.length,
          },
        },
        {
          format: 'csv',
          filename: `users-export-${new Date().toISOString().split('T')[0]}`,
          includeMetadata: true,
        }
      );
    },
    onError: (error) => {
      logger.error('Error exporting users', error, 'UserImportExport');
    },
  });

  const importMutation = useMutation({
    mutationFn: importUsers,
    onSuccess: (result) => {
      setImportResult(result);
      logger.info('Users imported', { result }, 'UserImportExport');
    },
    onError: (error) => {
      logger.error('Error importing users', error, 'UserImportExport');
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert('Please select a file to import');
      return;
    }

    if (!confirm('Are you sure you want to import users? Existing users with matching emails will be updated.')) {
      return;
    }

    importMutation.mutate(selectedFile);
  };

  const downloadTemplate = () => {
    const template = [
      {
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '(555) 123-4567',
        roles: 'technician',
        department: 'Field Operations',
        position: 'Technician',
        employee_id: '',
        technician_number: '',
        pesticide_license_number: '',
        license_expiration_date: '',
      },
    ];

    exportToCSV(
      {
        title: 'User Import Template',
        level: { id: 'template', name: 'Template' },
        data: template,
      },
      {
        format: 'csv',
        filename: 'user-import-template',
        includeMetadata: false,
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Export Users</h3>
            <p className="text-sm text-gray-500 mt-1">
              Export all users to a CSV file for backup or migration
            </p>
          </div>
          <button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Import Users</h3>
          <p className="text-sm text-gray-500 mt-1">
            Import users from a CSV file. Existing users with matching emails will be updated.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {selectedFile ? selectedFile.name : 'Select a CSV file to import'}
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="user-import-file"
            />
            <label
              htmlFor="user-import-file"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setImportResult(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importMutation.isPending ? 'Importing...' : 'Import Users'}
            </button>
          </div>
        </div>

        {/* Import Results */}
        {importResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            importResult.failed === 0
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start space-x-3">
              {importResult.failed === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-2">
                  Import Complete
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Total:</span> {importResult.total} rows
                  </p>
                  <p className="text-green-700">
                    <span className="font-medium">Successful:</span> {importResult.successful}
                  </p>
                  {importResult.failed > 0 && (
                    <p className="text-red-700">
                      <span className="font-medium">Failed:</span> {importResult.failed}
                    </p>
                  )}
                </div>
                {importResult.errors.length > 0 && (
                  <div className="mt-3 max-h-40 overflow-y-auto">
                    <p className="text-xs font-medium mb-1">Errors:</p>
                    {importResult.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-700">
                        Row {error.row} ({error.email}): {error.error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {importMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Import Failed</p>
                <p className="text-sm text-red-700 mt-1">
                  {importMutation.error instanceof Error
                    ? importMutation.error.message
                    : 'Unknown error occurred'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSV Format Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Required columns: email, first_name, last_name</li>
          <li>Optional columns: phone, roles (semicolon-separated), department, position, employee_id</li>
          <li>Roles should be separated by semicolons (e.g., "technician;dispatcher")</li>
          <li>Existing users with matching emails will be updated</li>
          <li>New users will be created with default password (they'll need to reset it)</li>
        </ul>
      </div>
    </div>
  );
}





