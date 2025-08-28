import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Chip,
  Modal,
  Textarea,
  Tabs
} from '@/components/ui/EnhancedUI';
import {
  FileText,
  User,
  Smartphone,
  MapPin,
  Camera,
  Mic,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit
} from 'lucide-react';

interface CustomerNote {
  id: string;
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

interface DualNotesSystemProps {
  notes: CustomerNote[];
  customerId: string;
  isLoading: boolean;
}

export default function DualNotesSystem({ notes, customerId, isLoading }: DualNotesSystemProps) {
  const [activeTab, setActiveTab] = useState('internal');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<CustomerNote | null>(null);
  const [newNote, setNewNote] = useState({
    note_type: 'general',
    note_source: 'office',
    note_content: '',
    priority: 'low',
    is_alert: false,
    is_internal: true
  });

  const getNoteTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'internal': return 'gray';
      case 'technician': return 'blue';
      case 'safety': return 'red';
      case 'preference': return 'green';
      case 'property': return 'purple';
      case 'general': return 'gray';
      default: return 'gray';
    }
  };

  const getNoteSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'office': return User;
      case 'field': return MapPin;
      case 'mobile_app': return Smartphone;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
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

  const handleCreateNote = () => {
    // Mock create note functionality
    console.log('Creating note:', newNote);
    setShowNewNoteModal(false);
    setNewNote({
      note_type: 'general',
      note_source: 'office',
      note_content: '',
      priority: 'low',
      is_alert: false,
      is_internal: true
    });
  };

  const internalNotes = notes.filter(note => note.is_internal);
  const technicianNotes = notes.filter(note => !note.is_internal);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Typography variant="body1" className="text-gray-600">
            Loading notes...
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h3" className="text-gray-900">
            Notes & Communication
          </Typography>
          <Button
            variant="primary"
            onClick={() => setShowNewNoteModal(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <Button
              variant={activeTab === 'internal' ? "primary" : "outline"}
              onClick={() => setActiveTab('internal')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Internal Notes ({internalNotes.length})
            </Button>
            <Button
              variant={activeTab === 'technician' ? "primary" : "outline"}
              onClick={() => setActiveTab('technician')}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Technician Notes ({technicianNotes.length})
            </Button>
          </div>
        </Tabs>

        {/* Notes List */}
        <div className="space-y-4">
          {(activeTab === 'internal' ? internalNotes : technicianNotes).length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h4" className="text-gray-900 mb-2">
                No {activeTab === 'internal' ? 'Internal' : 'Technician'} Notes
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                {activeTab === 'internal' 
                  ? 'No internal notes have been added yet.' 
                  : 'No technician notes have been added yet.'
                }
              </Typography>
            </div>
          ) : (
            (activeTab === 'internal' ? internalNotes : technicianNotes).map((note) => {
              const SourceIcon = getNoteSourceIcon(note.note_source);
              
              return (
                <div
                  key={note.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    note.is_alert ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  {/* Note Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <SourceIcon className="h-4 w-4 text-gray-500" />
                      <Chip
                        color={getNoteTypeColor(note.note_type)}
                        variant="default"
                      >
                        {note.note_type}
                      </Chip>
                      <Chip
                        color={getPriorityColor(note.priority)}
                        variant="default"
                      >
                        {note.priority}
                      </Chip>
                      {note.is_alert && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                  </div>

                  {/* Note Content */}
                  <Typography variant="body1" className="text-gray-800 mb-3">
                    {note.note_content}
                  </Typography>

                  {/* Note Footer */}
                  <div className="flex items-center justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      By: {note.created_by}
                    </Typography>
                    
                    {note.location_coords && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>GPS: {note.location_coords}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'general', is_internal: true });
              setShowNewNoteModal(true);
            }}
          >
            <FileText className="h-6 w-6 mb-2 text-gray-600" />
            <Typography variant="body2">General Note</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'safety', is_alert: true, is_internal: true });
              setShowNewNoteModal(true);
            }}
          >
            <AlertTriangle className="h-6 w-6 mb-2 text-red-600" />
            <Typography variant="body2">Safety Alert</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'preference', is_internal: true });
              setShowNewNoteModal(true);
            }}
          >
            <CheckCircle className="h-6 w-6 mb-2 text-green-600" />
            <Typography variant="body2">Customer Preference</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'technician', is_internal: false });
              setShowNewNoteModal(true);
            }}
          >
            <Smartphone className="h-6 w-6 mb-2 text-blue-600" />
            <Typography variant="body2">Field Note</Typography>
          </Button>
        </div>
      </Card>

      {/* New Note Modal */}
      <Modal
        isOpen={showNewNoteModal}
        onClose={() => setShowNewNoteModal(false)}
        title="Add New Note"
        size="lg"
      >
        <div className="space-y-6">
          {/* Note Type Selection */}
          <div>
            <Typography variant="body2" className="text-gray-600 mb-2">
              Note Type
            </Typography>
            <div className="grid grid-cols-2 gap-2">
              {['general', 'safety', 'preference', 'property', 'technician'].map((type) => (
                <Button
                  key={type}
                  variant={newNote.note_type === type ? "primary" : "outline"}
                  onClick={() => setNewNote({ ...newNote, note_type: type })}
                  className="justify-start"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Note Source */}
          <div>
            <Typography variant="body2" className="text-gray-600 mb-2">
              Note Source
            </Typography>
            <div className="grid grid-cols-3 gap-2">
              {['office', 'field', 'mobile_app'].map((source) => (
                <Button
                  key={source}
                  variant={newNote.note_source === source ? "primary" : "outline"}
                  onClick={() => setNewNote({ ...newNote, note_source: source })}
                  className="justify-start"
                >
                  {source.replace('_', ' ').charAt(0).toUpperCase() + source.replace('_', ' ').slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <Typography variant="body2" className="text-gray-600 mb-2">
              Priority
            </Typography>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <Button
                  key={priority}
                  variant={newNote.priority === priority ? "primary" : "outline"}
                  onClick={() => setNewNote({ ...newNote, priority })}
                  className="justify-start"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Note Content */}
          <div>
            <Typography variant="body2" className="text-gray-600 mb-2">
              Note Content
            </Typography>
            <Textarea
              value={newNote.note_content}
              onChange={(e) => setNewNote({ ...newNote, note_content: e })}
              placeholder="Enter your note content..."
              rows={6}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newNote.is_alert}
                onChange={(e) => setNewNote({ ...newNote, is_alert: e.target.checked })}
                className="rounded"
              />
              <Typography variant="body2">Mark as alert/warning</Typography>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newNote.is_internal}
                onChange={(e) => setNewNote({ ...newNote, is_internal: e.target.checked })}
                className="rounded"
              />
              <Typography variant="body2">Internal note (not customer-facing)</Typography>
            </label>
          </div>

          {/* Rich Media Options */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-1" />
              Attach Photo
            </Button>
            <Button variant="outline" size="sm">
              <Mic className="h-4 w-4 mr-1" />
              Voice Note
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowNewNoteModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNote}
              disabled={!newNote.note_content}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Note Detail Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title="Note Details"
        size="lg"
      >
        {selectedNote && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-600">Note Type</Typography>
                <Chip color={getNoteTypeColor(selectedNote.note_type)}>
                  {selectedNote.note_type}
                </Chip>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Priority</Typography>
                <Chip color={getPriorityColor(selectedNote.priority)}>
                  {selectedNote.priority}
                </Chip>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Source</Typography>
                <Typography variant="body1">{selectedNote.note_source}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Created By</Typography>
                <Typography variant="body1">{selectedNote.created_by}</Typography>
              </div>
            </div>

            <div>
              <Typography variant="body2" className="text-gray-600 mb-2">Content</Typography>
              <Typography variant="body1">{selectedNote.note_content}</Typography>
            </div>

            {selectedNote.location_coords && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-2">Location</Typography>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <Typography variant="body1">{selectedNote.location_coords}</Typography>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedNote(null)}
              >
                Close
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-1" />
                Edit Note
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}






