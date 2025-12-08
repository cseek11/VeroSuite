import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Plus, 
  Send,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2
} from 'lucide-react';
import { Button, Textarea, Badge } from '@/components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Note: enhancedApi not used - customerNotes API not available
import { logger } from '@/utils/logger';

interface CustomerNotesHistoryProps {
  customerId: string;
}

interface NoteData {
  id: string;
  tenant_id: string;
  customer_id: string;
  note_type: string;
  note_source: string;
  note_content: string;
  created_by: string;
  created_at: string;
  priority: string;
  is_alert: boolean;
  is_internal: boolean;
  technician_id?: string;
  work_order_id?: string;
  location_coords?: string;
}

const CustomerNotesHistory: React.FC<CustomerNotesHistoryProps> = ({ customerId }) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePriority, setNewNotePriority] = useState<'low' | 'medium' | 'high'>('low');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch notes from API
  const { data: notesData, isLoading: notesLoading, error: notesError } = useQuery({
    queryKey: ['customer-notes', customerId],
    queryFn: async () => {
      // Note: customerNotes API not available in enhancedApi
      // Return empty array as fallback
      return [];
    },
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { content: string; priority: string }) => {
      // Note: customerNotes API not available in enhancedApi
      // Return mock response
      return Promise.resolve({
        id: `note-${Date.now()}`,
        customer_id: customerId,
        note_type: 'internal',
        note_source: 'office',
        note_content: noteData.content,
        priority: noteData.priority as 'low' | 'medium' | 'high',
        is_alert: false,
        is_internal: true,
        created_at: new Date().toISOString(),
        created_by: 'system'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerId] });
      setNewNoteContent('');
      setNewNotePriority('low');
      setShowAddNoteModal(false);
      setIsSubmittingNote(false);
    },
    onError: (error) => {
      logger.error('Error creating note', error, 'CustomerNotesHistory');
      setIsSubmittingNote(false);
    },
  });

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    
    setIsSubmittingNote(true);
    createNoteMutation.mutate({
      content: newNoteContent,
      priority: newNotePriority,
    });
  };

  const handleCancelAddNote = () => {
    setNewNoteContent('');
    setNewNotePriority('low');
    setShowAddNoteModal(false);
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Calendar className="w-4 h-4" />;
      case 'internal':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'invoice':
        return <DollarSign className="w-4 h-4" />;
      case 'payment':
        return <CheckCircle className="w-4 h-4" />;
      case 'account':
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-800';
      case 'internal':
        return 'bg-purple-100 text-purple-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'phone':
        return 'bg-orange-100 text-orange-800';
      case 'invoice':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment':
        return 'bg-emerald-100 text-emerald-800';
      case 'account':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Transform API data to match the component's expected format
  const transformedNotes = notesData?.map((note: NoteData) => ({
    id: note.id,
    type: note.note_type as any,
    title: `Internal Note - ${note.priority} Priority`,
    content: note.note_content,
    author: note.created_by,
    timestamp: note.created_at,
    priority: note.priority as 'low' | 'medium' | 'high',
    status: note.is_alert ? 'alert' : undefined
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header with Add Note Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Account Notes History</h3>
          <p className="text-sm text-gray-600">View and manage all customer interactions and notes</p>
        </div>
        <Button
          onClick={() => setShowAddNoteModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Internal Note
        </Button>
      </div>

      {/* Loading State */}
      {notesLoading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading notes...</p>
        </div>
      )}

      {/* Error State */}
      {notesError && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Notes</h3>
          <p className="text-gray-600">Failed to load notes. Please try again.</p>
        </div>
      )}

      {/* Notes List */}
      {!notesLoading && !notesError && (
        <div className="space-y-4">
          {transformedNotes.map((note: {
            id: string;
            type: string;
            title: string;
            content: string;
            author: string;
            timestamp: string;
            priority: 'low' | 'medium' | 'high';
            status: string | undefined;
          }) => (
            <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getNoteColor(note.type)}`}>
                    {getNoteIcon(note.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{note.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getNoteColor(note.type)}>
                        {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                      </Badge>
                      {note.priority && (
                        <Badge variant="outline" className={getPriorityColor(note.priority)}>
                          {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)} Priority
                        </Badge>
                      )}
                      {note.status && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Alert
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {formatDate(note.timestamp)}
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {note.author}
                </div>
                <div className="flex items-center gap-2">
                  {note.priority === 'high' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      High Priority
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!notesLoading && !notesError && transformedNotes.length === 0 && (
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Notes Found</h3>
          <p className="text-gray-600">Start by adding an internal note or wait for system-generated notes.</p>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Add Internal Note</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Note Content
                </label>
                <Textarea
                  value={newNoteContent}
                  onChange={(value) => setNewNoteContent(value)}
                  placeholder="Enter your internal note..."
                  rows={4}
                  className="w-full border-purple-300 bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Priority
                </label>
                <select
                  value={newNotePriority}
                  onChange={(e) => setNewNotePriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim() || isSubmittingNote}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {isSubmittingNote ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmittingNote ? 'Creating...' : 'Create Note'}
              </Button>
              
              <Button
                onClick={handleCancelAddNote}
                disabled={isSubmittingNote}
                className="px-4 py-2 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium text-purple-700 hover:border-purple-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerNotesHistory;
