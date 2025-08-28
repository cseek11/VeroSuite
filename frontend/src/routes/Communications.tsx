import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Input, 
  Tabs,
  Dropdown,
  Modal,
  Textarea
} from '@/components/ui/EnhancedUI';
import Select from '@/components/ui/Select';
import {
  MessageCircle,
  Mail,
  Phone,
  Send,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Calendar,
  FileText,
  Image,
  Paperclip,
  Smile,
  Settings,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Edit,
  Eye,
  Download,
  Share2,
  Bell,
  BellOff,
  Lock,
  Unlock
} from 'lucide-react';

// Mock data for communications
const mockMessages = [
  {
    id: 1,
    type: 'email',
    from: 'john.smith@acme.com',
    to: 'kevin@veropest.com',
    subject: 'Service Schedule Confirmation',
    content: 'Thank you for confirming our pest control service for next Tuesday at 2:00 PM. We look forward to your visit.',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'read',
    priority: 'normal',
    attachments: ['service_agreement.pdf'],
    tags: ['confirmation', 'scheduling']
  },
  {
    id: 2,
    type: 'sms',
    from: '+1 (555) 123-4567',
    to: '+1 (555) 987-6543',
    subject: 'Appointment Reminder',
    content: 'Reminder: Your pest control appointment is scheduled for tomorrow at 2:00 PM. Please ensure access to the property.',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'sent',
    priority: 'high',
    attachments: [],
    tags: ['reminder', 'appointment']
  },
  {
    id: 3,
    type: 'phone',
    from: 'Maria Lopez',
    to: 'Kevin Davis',
    subject: 'Service Inquiry',
    content: 'Customer called to inquire about additional services and pricing for termite treatment.',
    timestamp: '2024-01-15T08:45:00Z',
    status: 'completed',
    priority: 'normal',
    attachments: [],
    tags: ['inquiry', 'pricing']
  },
  {
    id: 4,
    type: 'email',
    from: 'support@veropest.com',
    to: 'customer@example.com',
    subject: 'Service Completion Report',
    content: 'Your pest control service has been completed. Please find the detailed report attached.',
    timestamp: '2024-01-14T16:20:00Z',
    status: 'sent',
    priority: 'normal',
    attachments: ['service_report.pdf', 'invoice.pdf'],
    tags: ['completion', 'report']
  }
];

const mockTemplates = [
  {
    id: 1,
    name: 'Appointment Confirmation',
    type: 'email',
    subject: 'Service Appointment Confirmed',
    content: 'Dear {{customer_name}}, Your pest control service has been confirmed for {{appointment_date}} at {{appointment_time}}...',
    category: 'scheduling'
  },
  {
    id: 2,
    name: 'Service Reminder',
    type: 'sms',
    subject: 'Appointment Reminder',
    content: 'Reminder: Your pest control appointment is scheduled for {{appointment_date}} at {{appointment_time}}...',
    category: 'reminders'
  },
  {
    id: 3,
    name: 'Service Completion',
    type: 'email',
    subject: 'Service Completed',
    content: 'Dear {{customer_name}}, Your pest control service has been completed successfully...',
    category: 'completion'
  }
];

const CommunicationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: MessageCircle },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'archived', label: 'Archived', icon: Archive }
  ];

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || message.type === filterType;
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageCircle;
      case 'phone': return Phone;
      default: return MessageCircle;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return CheckCircle;
      case 'sent': return Send;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'text-green-600';
      case 'sent': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Communications</h1>
          <p className="text-gray-600">Manage customer communications and messaging</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Templates
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowNewMessageModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              borderRadius: '0.5rem',
              color: 'rgb(30, 41, 59)',
              backdropFilter: 'blur(4px)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="phone">Phone</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              borderRadius: '0.5rem',
              color: 'rgb(30, 41, 59)',
              backdropFilter: 'blur(4px)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="sent">Sent</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="space-y-3">
          {activeTab === 'inbox' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMessages.map((message) => {
                  const MessageIcon = getMessageIcon(message.type);
                  const StatusIcon = getStatusIcon(message.status);
                  
                  return (
                                         <div key={message.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 rounded-lg bg-white" onClick={() => setSelectedMessage(message)}>
                       <div className="flex items-start justify-between mb-3">
                         <div className="flex items-center gap-2">
                           <MessageIcon className="h-5 w-5 text-gray-600" />
                           <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                             {message.priority}
                           </span>
                         </div>
                         <div className="flex items-center gap-2">
                           <StatusIcon className={`h-4 w-4 ${getStatusColor(message.status)}`} />
                           <Dropdown
                             trigger={
                               <Button variant="outline" size="sm">
                                 <MoreVertical className="h-4 w-4" />
                               </Button>
                             }
                             items={[
                               { label: 'Reply', onClick: () => {} },
                               { label: 'Forward', onClick: () => {} },
                               { label: 'Archive', onClick: () => {} },
                               { label: 'Delete', onClick: () => {} }
                             ]}
                           />
                         </div>
                       </div>
                       <div className="mb-2">
                         <Typography variant="h6" className="text-gray-900 mb-1 truncate">
                           {message.subject}
                         </Typography>
                         <Typography variant="body2" className="text-gray-600 mb-1">
                           From: {message.from}
                         </Typography>
                         <Typography variant="body2" className="text-gray-600 mb-2">
                           {message.content.substring(0, 80)}...
                         </Typography>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-gray-500">
                           {new Date(message.timestamp).toLocaleDateString()}
                         </span>
                         {message.attachments.length > 0 && (
                           <div className="flex items-center gap-1">
                             <Paperclip className="h-3 w-3 text-gray-400" />
                             <span className="text-xs text-gray-500">{message.attachments.length}</span>
                           </div>
                         )}
                       </div>
                     </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMessages.filter(m => m.status === 'sent').map((message) => {
                  const MessageIcon = getMessageIcon(message.type);
                  const StatusIcon = getStatusIcon(message.status);
                  
                                     return (
                     <div key={message.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 rounded-lg bg-white" onClick={() => setSelectedMessage(message)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MessageIcon className="h-5 w-5 text-gray-600" />
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(message.status)}`} />
                          <Dropdown
                            trigger={
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            }
                            items={[
                              { label: 'Forward', onClick: () => {} },
                              { label: 'Archive', onClick: () => {} },
                              { label: 'Delete', onClick: () => {} }
                            ]}
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <Typography variant="h6" className="text-gray-900 mb-1 truncate">
                          {message.subject}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 mb-1">
                          To: {message.to}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 mb-2">
                          {message.content.substring(0, 80)}...
                        </Typography>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                        {message.attachments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{message.attachments.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'drafts' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    </div>
                    <Dropdown
                      trigger={
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      }
                      items={[
                        { label: 'Edit', onClick: () => {} },
                        { label: 'Send', onClick: () => {} },
                        { label: 'Delete', onClick: () => {} }
                      ]}
                    />
                  </div>
                  <div className="mb-2">
                    <Typography variant="h6" className="text-gray-900 mb-1">
                      Service Follow-up
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      To: customer@example.com
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      Thank you for choosing our services. We hope everything...
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Draft saved 2 hours ago
                    </span>
                    <Button variant="primary" size="sm">
                      Continue Editing
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'archived' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        Archived
                      </span>
                    </div>
                    <Dropdown
                      trigger={
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      }
                      items={[
                        { label: 'Restore', onClick: () => {} },
                        { label: 'Delete', onClick: () => {} }
                      ]}
                    />
                  </div>
                  <div className="mb-2">
                    <Typography variant="h6" className="text-gray-900 mb-1">
                      Old Service Request
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      From: oldcustomer@example.com
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      Previous service request from last month...
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Archived 1 week ago
                    </span>
                    <Button variant="outline" size="sm">
                      Restore
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Typography variant="h6" className="text-gray-900 mb-1">
                          {template.name}
                        </Typography>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {template.type.toUpperCase()}
                        </span>
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        items={[
                          { label: 'Edit', onClick: () => {} },
                          { label: 'Duplicate', onClick: () => {} },
                          { label: 'Delete', onClick: () => {} }
                        ]}
                      />
                    </div>
                    <Typography variant="body2" className="text-gray-600 mb-3">
                      {template.content.substring(0, 100)}...
                    </Typography>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowNewMessageModal(true)}
                      >
                        Use Template
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                      >
                        Preview
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
            <Typography variant="h3" className="text-gray-900 mb-6">
              Communication Statistics
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-blue-600 font-bold">
                  1,247
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Messages This Month
                </Typography>
              </Card>
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-green-600 font-bold">
                  98.2%
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Delivery Rate
                </Typography>
              </Card>
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-purple-600 font-bold">
                  2.3 min
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Avg Response Time
                </Typography>
              </Card>
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-orange-600 font-bold">
                  892
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Active Conversations
                </Typography>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title="Message Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="text-gray-900">
                  {selectedMessage.subject}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  From: {selectedMessage.from}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                  {selectedMessage.priority}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(selectedMessage.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <Typography variant="body1" className="text-gray-800">
                {selectedMessage.content}
              </Typography>
            </div>
            {selectedMessage.attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <Typography variant="h6" className="text-gray-900 mb-2">
                  Attachments
                </Typography>
                <div className="space-y-2">
                  {selectedMessage.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <Modal
          isOpen={showNewMessageModal}
          onClose={() => setShowNewMessageModal(false)}
          title="New Message"
          size="lg"
        >
          <div className="space-y-4">
            <Select
              label="Type"
              value=""
              onChange={() => {}}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
                { value: 'phone', label: 'Phone Call' },
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <Input placeholder="Enter recipient..." value="" onChange={() => {}} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Input placeholder="Enter subject..." value="" onChange={() => {}} />
            </div>
            <Textarea
              label="Message"
              placeholder="Enter your message..."
              value=""
              onChange={() => {}}
              rows={6}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewMessageModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                Send Message
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CommunicationsPage;
