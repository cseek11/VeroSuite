import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Heading,
  Text,
} from '@/components/ui';
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
import { logger } from '@/utils/logger';

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

export default function CommunicationHub({ customerId: _customerId }: CommunicationHubProps) {
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
    logger.debug('Sending message', { 
      communicationType: selectedCommunicationType, 
      hasSubject: !!subject,
      messageLength: message.length 
    }, 'CommunicationHub');
    setShowNewMessageModal(false);
    setMessage('');
    setSubject('');
    setSelectedCommunicationType('');
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-slate-900">
            Communication Hub
          </Heading>
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
                      <Heading level={4} className="text-slate-900">
                        {log.communication_type.charAt(0).toUpperCase() + log.communication_type.slice(1)}
                      </Heading>
                      <Badge variant={log.direction === 'inbound' ? 'default' : 'secondary'}>
                        {log.direction}
                      </Badge>
                      {log.follow_up_required && (
                        <Badge variant="destructive">
                          Follow-up Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </div>

                  {log.subject && (
                  <Heading level={4} className="text-slate-800 mb-2">
                      {log.subject}
                    </Heading>
                  )}

                  {log.message_content && (
                    <Text variant="body" className="text-slate-700 mb-2">
                      {log.message_content}
                    </Text>
                  )}

                  <div className="flex items-center justify-between">
                    <Text variant="small" className="text-slate-600">
                      {log.staff_member}
                    </Text>
                    
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
            <Text variant="small">Call Customer</Text>
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
            <Text variant="small">Send Email</Text>
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
            <Text variant="small">Send SMS</Text>
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
            <Text variant="small">In-Person</Text>
          </Button>
        </div>
      </Card>

      {/* New Message Dialog */}
      <Dialog open={showNewMessageModal} onOpenChange={(open) => !open && setShowNewMessageModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              New {selectedCommunicationType ? selectedCommunicationType.charAt(0).toUpperCase() + selectedCommunicationType.slice(1) : 'Communication'}
            </DialogTitle>
          </DialogHeader>
        <div className="space-y-6">
          {/* Communication Type Selection */}
          {!selectedCommunicationType && (
            <div>
              <Text variant="small" className="text-slate-600 mb-2">
                Communication Type
              </Text>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('call')}
                >
                  <Phone className="h-6 w-6 mb-2 text-blue-600" />
                  <Text variant="small">Call</Text>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('email')}
                >
                  <Mail className="h-6 w-6 mb-2 text-green-600" />
                  <Text variant="small">Email</Text>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('sms')}
                >
                  <MessageCircle className="h-6 w-6 mb-2 text-purple-600" />
                  <Text variant="small">SMS</Text>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setSelectedCommunicationType('in-person')}
                >
                  <User className="h-6 w-6 mb-2 text-orange-600" />
                  <Text variant="small">In-Person</Text>
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
                  <Text variant="small" className="text-slate-600 mb-2">
                    Subject
                  </Text>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject((e as unknown as React.ChangeEvent<HTMLInputElement>).target.value)}
                    placeholder="Enter subject..."
                  />
                </div>
              )}

              {/* Message Content */}
              <div>
                <Text variant="small" className="text-slate-600 mb-2">
                  Message
                </Text>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage((e as unknown as React.ChangeEvent<HTMLTextAreaElement>).target.value)}
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
                  <Text variant="small">Requires follow-up</Text>
                </label>
                <input
                  type="date"
                  className="p-2 border border-slate-300 rounded-md"
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
        </DialogContent>
      </Dialog>
    </>
  );
}







