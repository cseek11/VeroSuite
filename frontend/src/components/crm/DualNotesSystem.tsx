import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  Heading,
  Text,
} from '@/components/ui';
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
import { logger } from '@/utils/logger';

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
      case 'internal': return 'slate';
      case 'technician': return 'blue';
      case 'safety': return 'red';
      case 'preference': return 'green';
      case 'property': return 'purple';
      case 'general': return 'slate';
      default: return 'slate';
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
      default: return 'slate';
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
    logger.debug('Creating note', { noteType: newNote.note_type, priority: newNote.priority }, 'DualNotesSystem');
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
          <Text variant="body" className="text-slate-600">
            Loading notes...
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-slate-900">
            Notes & Communication
          </Heading>
          <Button
            variant="primary"
            onClick={() => setShowNewNoteModal(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-2 mb-6 border-b border-slate-200">
            <TabsTrigger value="internal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Internal Notes ({internalNotes.length})
            </TabsTrigger>
            <TabsTrigger value="technician" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Technician Notes ({technicianNotes.length})
            </TabsTrigger>
          </TabsList>

          {/* Notes List */}
          <div className="space-y-4">
          {(activeTab === 'internal' ? internalNotes : technicianNotes).length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <Heading level={4} className="text-slate-900 mb-2">
                No {activeTab === 'internal' ? 'Internal' : 'Technician'} Notes
              </Heading>
              <Text variant="body" className="text-slate-600">
                {activeTab === 'internal' 
                  ? 'No internal notes have been added yet.' 
                  : 'No technician notes have been added yet.'
                }
              </Text>
            </div>
          ) : (
            (activeTab === 'internal' ? internalNotes : technicianNotes).map((note) => {
              const SourceIcon = getNoteSourceIcon(note.note_source);
              
              return (
                <div
                  key={note.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    note.is_alert ? 'border-red-200 bg-red-50' : 'border-slate-200'
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  {/* Note Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <SourceIcon className="h-4 w-4 text-slate-500" />
                      <Badge variant="default">
                        {note.note_type}
                      </Badge>
                      <Badge variant={note.priority === 'high' ? 'destructive' : 'secondary'}>
                        {note.priority}
                      </Badge>
                      {note.is_alert && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                  </div>

                  {/* Note Content */}
                  <Text variant="body" className="text-slate-800 mb-3">
                    {note.note_content}
                  </Text>

                  {/* Note Footer */}
                  <div className="flex items-center justify-between">
                    <Text variant="small" className="text-slate-600">
                      By: {note.created_by}
                    </Text>
                    
                    {note.location_coords && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
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
        </Tabs>

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
            <FileText className="h-6 w-6 mb-2 text-slate-600" />
            <Text variant="small">General Note</Text>
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
            <Text variant="small">Safety Alert</Text>
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
            <Text variant="small">Customer Preference</Text>
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
            <Text variant="small">Field Note</Text>
          </Button>
        </div>
      </Card>

      {/* New Note Dialog */}
      <Dialog open={showNewNoteModal} onOpenChange={(open) => !open && setShowNewNoteModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
          </DialogHeader>
        <div className="space-y-6">
          {/* Note Type Selection */}
          <div>
            <Text variant="small" className="text-slate-600 mb-2">
              Note Type
            </Text>
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
            <Text variant="small" className="text-slate-600 mb-2">
              Note Source
            </Text>
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
            <Text variant="small" className="text-slate-600 mb-2">
              Priority
            </Text>
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
            <Text variant="small" className="text-slate-600 mb-2">
              Note Content
            </Text>
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
              <Text variant="small">Mark as alert/warning</Text>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newNote.is_internal}
                onChange={(e) => setNewNote({ ...newNote, is_internal: e.target.checked })}
                className="rounded"
              />
              <Text variant="small">Internal note (not customer-facing)</Text>
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
        </DialogContent>
      </Dialog>

      {/* Note Detail Dialog */}
      <Dialog open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Note Details</DialogTitle>
          </DialogHeader>
        {selectedNote && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="small" className="text-slate-600">Note Type</Text>
                <Badge variant="default">
                  {selectedNote.note_type}
                </Badge>
              </div>
              <div>
                <Text variant="small" className="text-slate-600">Priority</Text>
                <Badge variant={selectedNote.priority === 'high' ? 'destructive' : 'secondary'}>
                  {selectedNote.priority}
                </Badge>
              </div>
              <div>
                <Text variant="small" className="text-slate-600">Source</Text>
                <Text variant="body">{selectedNote.note_source}</Text>
              </div>
              <div>
                <Text variant="small" className="text-slate-600">Created By</Text>
                <Text variant="body">{selectedNote.created_by}</Text>
              </div>
            </div>

            <div>
              <Text variant="small" className="text-slate-600 mb-2">Content</Text>
              <Text variant="body">{selectedNote.note_content}</Text>
            </div>

            {selectedNote.location_coords && (
              <div>
                <Text variant="small" className="text-slate-600 mb-2">Location</Text>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <Text variant="body">{selectedNote.location_coords}</Text>
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
        </DialogContent>
      </Dialog>
    </>
  );
}







