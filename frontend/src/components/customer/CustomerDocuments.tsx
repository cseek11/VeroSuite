import { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, FolderOpen, Image, File } from 'lucide-react';
import { Button, Typography } from '@/components/ui';

interface CustomerDocumentsProps {
  customerId: string;
}

const CustomerDocuments: React.FC<CustomerDocumentsProps> = ({ customerId: _customerId }) => {
  const [activeTab, setActiveTab] = useState('documents');

  const documents = [
    {
      id: 1,
      name: 'Service Agreement - 2024',
      type: 'pdf',
      size: '2.4 MB',
      date: '2024-01-02',
      category: 'Contracts',
      description: 'Annual pest control service agreement'
    },
    {
      id: 2,
      name: 'Inspection Report - Dec 2023',
      type: 'pdf',
      size: '1.8 MB',
      date: '2023-12-15',
      category: 'Reports',
      description: 'Quarterly pest inspection report'
    },
    {
      id: 3,
      name: 'Property Photos - Before Treatment',
      type: 'image',
      size: '4.2 MB',
      date: '2023-12-10',
      category: 'Photos',
      description: 'Before and after treatment photos'
    },
    {
      id: 4,
      name: 'Payment Receipt - Dec 2023',
      type: 'pdf',
      size: '0.8 MB',
      date: '2023-12-28',
      category: 'Financial',
      description: 'Payment confirmation for December services'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-500';
      case 'image':
        return 'bg-green-500';
      case 'doc':
      case 'docx':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Contracts':
        return 'bg-purple-100 text-purple-800';
      case 'Reports':
        return 'bg-blue-100 text-blue-800';
      case 'Photos':
        return 'bg-green-100 text-green-800';
      case 'Financial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="text-lg font-semibold text-gray-900">
          Documents & Media
        </Typography>
        <Button size="sm" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'documents'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Documents ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upload
        </button>
      </div>

      {/* Content */}
      {activeTab === 'documents' && (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${getFileColor(doc.type)} rounded-lg flex items-center justify-center`}>
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(doc.category)}`}>
                        {doc.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{doc.size}</span>
                    <span>{new Date(doc.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="bg-white rounded-lg p-6 border border-gray-200/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Upload Files</h4>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <Button className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Choose Files
              </Button>
            </div>
          </div>

          {/* File Categories */}
          <div className="bg-white rounded-lg p-4 border border-gray-200/50">
            <h4 className="font-medium text-gray-900 mb-3">File Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Contracts
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reports
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Photos
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Financial
              </Button>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-lg p-4 border border-gray-200/50">
            <h4 className="font-medium text-gray-900 mb-3">Recent Uploads</h4>
            <div className="text-sm text-gray-600 text-center py-4">
              No recent uploads
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDocuments;
