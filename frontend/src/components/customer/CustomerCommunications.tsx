import { useState } from 'react';
import { MessageSquare, Phone, Mail, Send, Plus, Clock, CheckCircle } from 'lucide-react';
import { Button, Typography, Input, Textarea } from '@/components/ui';
import { logger } from '@/utils/logger';

interface CustomerCommunicationsProps {
  customerId: string;
}

const CustomerCommunications: React.FC<CustomerCommunicationsProps> = ({ customerId: _customerId }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [newMessage, setNewMessage] = useState('');

  const communications = [
    {
      id: 1,
      type: 'email',
      date: '2024-01-02',
      time: '10:30 AM',
      subject: 'Service Reminder - Quarterly Pest Control',
      content: 'Hi John, this is a reminder that your quarterly pest control service is scheduled for January 15th at 9:00 AM. Please ensure access to your property.',
      status: 'sent',
      direction: 'outbound'
    },
    {
      id: 2,
      type: 'phone',
      date: '2023-12-28',
      time: '2:15 PM',
      subject: 'Payment Confirmation Call',
      content: 'Called to confirm payment of $300.00 received. Customer was satisfied with recent service.',
      status: 'completed',
      direction: 'inbound'
    },
    {
      id: 3,
      type: 'sms',
      date: '2023-12-20',
      time: '9:45 AM',
      subject: 'Service Completion Notification',
      content: 'Your pest control service has been completed. Technician Mike Johnson finished at 9:30 AM. Thank you for choosing our services!',
      status: 'sent',
      direction: 'outbound'
    },
    {
      id: 4,
      type: 'email',
      date: '2023-12-15',
      time: '11:20 AM',
      subject: 'Emergency Service Request',
      content: 'Customer reported spider infestation in basement. Emergency service scheduled for tomorrow.',
      status: 'sent',
      direction: 'inbound'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-500';
      case 'phone':
        return 'bg-green-500';
      case 'sms':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'outbound' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message via API
      logger.debug('Sending message', { messageLength: newMessage.length }, 'CustomerCommunications');
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="text-lg font-semibold text-gray-900">
          Communications
        </Typography>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'messages'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Messages ({communications.length})
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'compose'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Compose
        </button>
      </div>

      {/* Content */}
      {activeTab === 'messages' && (
        <div className="space-y-3">
          {communications.map((comm) => (
            <div key={comm.id} className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 ${getTypeColor(comm.type)} rounded-lg flex items-center justify-center`}>
                  {getTypeIcon(comm.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDirectionColor(comm.direction)}`}>
                        {comm.direction === 'outbound' ? 'Sent' : 'Received'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(comm.date).toLocaleDateString()} at {comm.time}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{comm.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      {comm.status === 'sent' ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <Clock className="w-3 h-3 text-yellow-500" />
                      )}
                      {comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                    </span>
                    <span className="capitalize">{comm.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  Reply
                </Button>
                <Button variant="outline" size="sm">
                  Forward
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200/50">
            <h4 className="font-medium text-gray-900 mb-4">Send New Message</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                 <Input
                   placeholder="Enter subject..."
                   value=""
                   onChange={() => {}}
                   className="w-full"
                 />
               </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(value) => setNewMessage(value)}
                  rows={4}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSendMessage} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
                <Button variant="outline">
                  Save Draft
                </Button>
                <Button variant="outline">
                  Schedule
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Templates */}
          <div className="bg-white rounded-lg p-4 border border-gray-200/50">
            <h4 className="font-medium text-gray-900 mb-3">Quick Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-left justify-start">
                Service Reminder
              </Button>
              <Button variant="outline" size="sm" className="text-left justify-start">
                Payment Reminder
              </Button>
              <Button variant="outline" size="sm" className="text-left justify-start">
                Follow-up Call
              </Button>
              <Button variant="outline" size="sm" className="text-left justify-start">
                Emergency Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCommunications;
