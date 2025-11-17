import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  MessageCircle,
  Mail,
  Phone,
  Send,
  Search,
  Plus,
  MoreVertical,
  Clock,
  CheckCircle,
  FileText,
  Paperclip,
  Archive,
  Download,
  X
} from 'lucide-react';

// Real data will be fetched from API
import { enhancedApi } from '@/lib/enhanced-api';

// Templates will be fetched from API
const getTemplates = async () => {
  return await enhancedApi.communicationTemplates.list();
};

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

  // Messages will be fetched from API
  const { data: messages = [] } = useQuery({
    queryKey: ['communications', 'messages'],
    queryFn: () => enhancedApi.communications.list(),
  });

  const filteredMessages = messages.filter(message => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Communications
            </h1>
            <p className="text-slate-600 text-sm">
              Manage customer communications and messaging
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm"
              onClick={() => setShowTemplateModal(true)}
            >
              <FileText className="h-3 w-3" />
              Templates
            </button>
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm"
              onClick={() => setShowNewMessageModal(true)}
            >
              <Plus className="h-3 w-3" />
              New Message
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="phone">Phone</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="sent">Sent</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden mb-4">
        <div className="flex space-x-4 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
                           <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                             <MoreVertical className="h-3 w-3" />
                           </button>
                         </div>
                       </div>
                       <div className="mb-2">
                         <h3 className="text-sm font-semibold text-slate-900 mb-1 truncate">
                           {message.subject}
                         </h3>
                         <p className="text-xs text-slate-600 mb-1">
                           From: {message.from}
                         </p>
                         <p className="text-xs text-slate-600 mb-2">
                           {message.content.substring(0, 80)}...
                         </p>
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
                          <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                            <MoreVertical className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1 truncate">
                          {message.subject}
                        </h3>
                        <p className="text-xs text-slate-600 mb-1">
                          To: {message.to}
                        </p>
                        <p className="text-xs text-slate-600 mb-2">
                          {message.content.substring(0, 80)}...
                        </p>
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
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    </div>
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                      <MoreVertical className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      Service Follow-up
                    </h3>
                    <p className="text-xs text-slate-600 mb-1">
                      To: customer@example.com
                    </p>
                    <p className="text-xs text-slate-600 mb-2">
                      Thank you for choosing our services. We hope everything...
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Draft saved 2 hours ago
                    </span>
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs">
                      Continue Editing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'archived' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-800">
                        Archived
                      </span>
                    </div>
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                      <MoreVertical className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      Old Service Request
                    </h3>
                    <p className="text-xs text-slate-600 mb-1">
                      From: oldcustomer@example.com
                    </p>
                    <p className="text-xs text-slate-600 mb-2">
                      Previous service request from last month...
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Archived 1 week ago
                    </span>
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200 text-xs">
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockTemplates.map((template) => (
                  <div key={template.id} className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">
                          {template.name}
                        </h3>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          template.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {template.type.toUpperCase()}
                        </span>
                      </div>
                      <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      {template.content.substring(0, 100)}...
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowNewMessageModal(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
                      >
                        Use Template
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200 text-xs"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Communication Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-4 text-center border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-blue-600">
                  1,247
                </h3>
                <p className="text-xs text-slate-600">
                  Messages This Month
                </p>
              </div>
              <div className="p-4 text-center border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-emerald-600">
                  98.2%
                </h3>
                <p className="text-xs text-slate-600">
                  Delivery Rate
                </p>
              </div>
              <div className="p-4 text-center border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-purple-600">
                  2.3 min
                </h3>
                <p className="text-xs text-slate-600">
                  Avg Response Time
                </p>
              </div>
              <div className="p-4 text-center border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-amber-600">
                  892
                </h3>
                <p className="text-xs text-slate-600">
                  Active Conversations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Message Details</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedMessage.subject}
                  </h3>
                  <p className="text-xs text-slate-600">
                    From: {selectedMessage.from}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-800">
                  {selectedMessage.content}
                </p>
              </div>
              {selectedMessage.attachments.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">
                    Attachments
                  </h4>
                  <div className="space-y-2">
                    {selectedMessage.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className="text-xs text-slate-700">{attachment}</span>
                        <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                          <Download className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">New Message</h2>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm">
                  <option value="">Select type</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                <input
                  type="text"
                  placeholder="Enter recipient..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  placeholder="Enter your message..."
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationsPage;
