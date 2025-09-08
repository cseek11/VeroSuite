// ============================================================================
// CUSTOMER SEARCH RESULTS COMPONENT - Display Search Results
// ============================================================================
// This component displays search results in a modern, accessible format
// with actions for CRUD operations

import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  User, 
  Calendar,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import type { SearchResult } from '@/lib/unified-search-service';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface CustomerSearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  error?: string | null;
  onView?: (result: SearchResult) => void;
  onEdit?: (result: SearchResult) => void;
  onDelete?: (result: SearchResult) => void;
  onCall?: (result: SearchResult) => void;
  onEmail?: (result: SearchResult) => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

interface CustomerResultCardProps {
  result: SearchResult;
  onView?: (result: SearchResult) => void;
  onEdit?: (result: SearchResult) => void;
  onDelete?: (result: SearchResult) => void;
  onCall?: (result: SearchResult) => void;
  onEmail?: (result: SearchResult) => void;
  showActions?: boolean;
  compact?: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'inactive':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'commercial':
      return <Building className="h-4 w-4 text-blue-500" />;
    case 'residential':
      return <User className="h-4 w-4 text-green-500" />;
    default:
      return <User className="h-4 w-4 text-gray-500" />;
  }
};

const formatScore = (score: number) => {
  return Math.round(score * 100);
};

// ============================================================================
// CUSTOMER RESULT CARD COMPONENT
// ============================================================================

const CustomerResultCard: React.FC<CustomerResultCardProps> = ({
  result,
  onView,
  onEdit,
  onDelete,
  onCall,
  onEmail,
  showActions = true,
  compact = false
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const handleAction = (action: (result: SearchResult) => void) => {
    action(result);
    setShowActionsMenu(false);
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getTypeIcon(result.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {result.name}
                </h3>
                {getStatusIcon(result.status)}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  result.type === 'commercial' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {result.type}
                </span>
              </div>
              
              <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                {result.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {result.email}
                  </span>
                )}
                {result.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {result.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500">
              {formatScore(result.score)}% match
            </div>
            
            {showActions && (
              <div className="relative">
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
                
                {showActionsMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      {onView && (
                        <button
                          onClick={() => handleAction(onView)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => handleAction(onEdit)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Customer
                        </button>
                      )}
                      {onCall && result.phone && (
                        <button
                          onClick={() => handleAction(onCall)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Phone className="h-4 w-4" />
                          Call Customer
                        </button>
                      )}
                      {onEmail && result.email && (
                        <button
                          onClick={() => handleAction(onEmail)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Mail className="h-4 w-4" />
                          Send Email
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleAction(onDelete)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Customer
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0">
              {getTypeIcon(result.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {result.name}
                </h3>
                {getStatusIcon(result.status)}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  result.type === 'commercial' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {result.type}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  result.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {result.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {result.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{result.email}</span>
              </div>
            )}
            
            {result.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{result.phone}</span>
              </div>
            )}
            
            {result.address && (
              <div className="flex items-start gap-2 text-sm text-gray-600 md:col-span-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="truncate">{result.address}</span>
              </div>
            )}
          </div>
          
          {result.matchedFields && result.matchedFields.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Matched fields:</p>
              <div className="flex flex-wrap gap-1">
                {result.matchedFields.map((field, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="text-sm text-gray-500">
            {formatScore(result.score)}% match
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2">
              {onView && (
                <button
                  onClick={() => onView(result)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              
              {onEdit && (
                <button
                  onClick={() => onEdit(result)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Customer"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => onDelete(result)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Customer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN CUSTOMER SEARCH RESULTS COMPONENT
// ============================================================================

export const CustomerSearchResults: React.FC<CustomerSearchResultsProps> = ({
  results,
  loading = false,
  error = null,
  onView,
  onEdit,
  onDelete,
  onCall,
  onEmail,
  className = '',
  showActions = true,
  compact = false
}) => {
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderLoading = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Searching customers...</p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Search Failed</h3>
      <p className="text-sm text-gray-500 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Try Again
      </button>
    </div>
  );

  const renderEmpty = () => (
    <div className="text-center py-12">
      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
      <p className="text-sm text-gray-500">Try adjusting your search terms or filters</p>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-4">
      {results.map((result) => (
        <CustomerResultCard
          key={result.id}
          result={result}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onCall={onCall}
          onEmail={onEmail}
          showActions={showActions}
          compact={compact}
        />
      ))}
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={className}>
      {loading && renderLoading()}
      {error && renderError()}
      {!loading && !error && results.length === 0 && renderEmpty()}
      {!loading && !error && results.length > 0 && renderResults()}
    </div>
  );
};

export default CustomerSearchResults;
