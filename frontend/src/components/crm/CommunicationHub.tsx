import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Chip,
  Modal,
  Input,
  Textarea
} from '@/components/ui/EnhancedUI';
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  Paperclip,
  Camera,
  Video,
  User,
  Clock,
  CheckCircle
} from 'lucide-react';

interface CommunicationHubProps {
  customerId: string;
}

interface CommunicationLog {
  id: string;
  communication_type: string;
  direction: string;
  subject?: string;
  message_content?: string;
  staff_member?: string;
  timestamp: string;
  follow_up_required: boolean;
  follow_up_date?: string;
}

export default function CommunicationHub({ customerId }: CommunicationHubProps) {
  const [selectedCommunicationType, setSelectedCommunicationType] = useState<string>('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Mock communication logs
  const communicationLogs: CommunicationLog[] = [
    {
      id: '1',
      communication_type: 'call',
      direction: 'inbound',
      subject: 'Service inquiry',
      message_content: 'Customer called to ask about scheduling a termite inspection.',
      staff_member: 'John Smith',
      timestamp: '2024-01-20T10:30:00Z',
      follow_up_required: true,
      follow_up_date: '2024-01-22'
    },
    {
      id: '2',
      communication_type: 'email',
      direction: 'outbound',
      subject: 'Service confirmation',
      message_content: 'Thank you for choosing our services. Your appointment has been confirmed for January 25th at 2:00 PM.',
      staff_member: 'Sarah Johnson',
      timestamp: '2024-01-19T14:15:00Z',
      follow_up_required: false
    },
    {
      id: '3',
      communication_type: 'sms',
      direction: 'outbound',
      subject: 'Appointment reminder',
      message_content: 'Reminder: Your pest control service is scheduled for tomorrow at 2:00 PM. Please ensure access to the property.',
      staff_member: 'System',
      timestamp: '2024-01-18T09:00:00Z',
      follow_up_required: false
    }
  ];

  const getCommunicationTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'sms': return MessageCircle;
      case 'in-person': return User;
      default: return MessageCircle;
    }
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'inbound' ? 'blue' : 'green';
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

  const handleSendMessage = () => {
    // Mock send functionality
    console.log('Sending message:', { selectedCommunicationType, subject, message });
    setShowNewMessageModal(false);
    setMessage('');
    setSubject('');
    setSelectedCommunicationType('');
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h3" className="text-gray-900">
            Communication Hub
          </Typography>
          <Button
            variant="primary"
            onClick={() => setShowNewMessageModal(true)}
          >
            <Send className="h-4 w-4 mr-1" />
            New Message
          </Button>
        </div>

        {/* Communication Timeline */}
        <div className="space-y-4">
          {communicationLogs.map((log) => {
            const IconComponent = getCommunicationTypeIcon(log.communication_type);
            
            return (
              <div
                key={log.id}
                className={`flex gap-4 p-4 rounded-lg border ${
                  log.direction === 'inbound' 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-green-50 border-green-200'
                }`}
              >
                {/* Communication Type Icon */}
                <div className={`p-2 rounded-full ${
                  log.direction === 'inbound' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  <IconComponent className="h-5 w-5" />
                </div>

                {/* Message Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Typography variant="h5" className="text-gray-900">
                        {log.communication_type.charAt(0).toUpperCase() + log.communication_type.slice(1)}
                      </Typography>
                      <Chip
                        color={getDirectionColor(log.direction)}
                        variant="default"
                      >
                        {log.direction}
                      </Chip>
                      {log.follow_up_required && (
                        <Chip color="red" variant="default">
                          Follow-up Required
                        </Chip>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </div>

                  {log.subject && (
                    <Typography variant="h6" className="text-gray-800 mb-2">
                      {log.subject}
                    </Typography>
                  )}

                  {log.message_content && (
                    <Typography variant="body1" className="text-gray-700 mb-2">
                      {log.message_content}
                    </Typography>
                  )}

                  <div className="flex items-center justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      {log.staff_member}
                    </Typography>
                    
                    {log.follow_up_required && log.follow_up_date && (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Follow-up: {new Date(log.follow_up_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setSelectedCommunicationType('call');
              setShowNewMessageModal(true);
            }}
          >
            <Phone className="h-6 w-6 mb-2 text-blue-600" />
            <Typography variant="body2">Call Customer</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setSelectedCommunicationType('email');
              setShowNewMessageModal(true);
            }}
          >
            <Mail className="h-6 w-6 mb-2 text-green-600" />
            <Typography variant="body2">Send Email</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setSelectedCommunicationType('sms');
              setShowNewMessageModal(true);
            }}
          >
            <MessageCircle className="h-6 w-6 mb-2 text-purple-600" />
            <Typography variant="body2">Send SMS</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              setSelectedCommunicationType('in-person');
              setShowNewMessageModal(true);
            }}
          >
            <User className="h-6 w-6 mb-2 text-orange-600" />
            <Typography variant="body2">In-Person</Typography>
          </Button>
        </div>
      </Card>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        title={`New ${selectedCommunicationType ? selectedCommunicationType.charAt(0).toUpperCase() + selectedCommunicationType.slice(1) : 'Communication'}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Communication Type Selection */}
          {!selectedCommunicationType && (
            <div>
              <Typography variant="body2" className="text-gray-600 mb-2">
                Communication Type
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('call')}
                >
                  <Phone className="h-6 w-6 mb-2 text-blue-600" />
                  <Typography variant="body2">Call</Typography>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('email')}
                >
                  <Mail className="h-6 w-6 mb-2 text-green-600" />
                  <Typography variant="body2">Email</Typography>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('sms')}
                >
                  <MessageCircle className="h-6 w-6 mb-2 text-purple-600" />
                  <Typography variant="body2">SMS</Typography>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('in-person')}
                >
                  <User className="h-6 w-6 mb-2 text-orange-600" />
                  <Typography variant="body2">In-Person</Typography>
                </Button>
              </div>
            </div>
          )}

          {/* Message Form */}
          {selectedCommunicationType && (
            <>
              {/* Subject (for email) */}
              {selectedCommunicationType === 'email' && (
                <div>
                  <Typography variant="body2" className="text-gray-600 mb-2">
                    Subject
                  </Typography>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e)}
                    placeholder="Enter subject..."
                  />
                </div>
              )}

              {/* Message Content */}
              <div>
                <Typography variant="body2" className="text-gray-600 mb-2">
                  Message
                </Typography>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e)}
                  placeholder={`Enter your ${selectedCommunicationType} message...`}
                  rows={6}
                />
              </div>

              {/* Rich Media Options */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-1" />
                  Attach File
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-1" />
                  Photo
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Button>
              </div>

              {/* Follow-up Options */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <Typography variant="body2">Requires follow-up</Typography>
                </label>
                <input
                  type="date"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Follow-up date"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowNewMessageModal(false);
                setMessage('');
                setSubject('');
                setSelectedCommunicationType('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!selectedCommunicationType || !message}
            >
              <Send className="h-4 w-4 mr-1" />
              Send {selectedCommunicationType ? selectedCommunicationType.charAt(0).toUpperCase() + selectedCommunicationType.slice(1) : 'Message'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}





