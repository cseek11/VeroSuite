import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import { Heading, Text } from '@/components/ui';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';

interface AvailabilityPattern {
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_active: boolean;
}

interface TimeOffRequest {
  id?: string;
  start_date: string;
  end_date: string;
  reason: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

interface AvailabilityManagerProps {
  technicianId: string;
  technicianName?: string;
  onClose?: () => void;
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export default function AvailabilityManager({
  technicianId,
  technicianName,
  onClose
}: AvailabilityManagerProps) {
  const [editingPattern, setEditingPattern] = useState<AvailabilityPattern | null>(null);
  const [showTimeOffDialog, setShowTimeOffDialog] = useState(false);
  const [timeOffRequest, setTimeOffRequest] = useState<TimeOffRequest>({
    start_date: '',
    end_date: '',
    reason: ''
  });

  const queryClient = useQueryClient();

  // Fetch availability
  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ['technician-availability', technicianId],
    queryFn: () => enhancedApi.technicians.getAvailability(technicianId),
  });

  // Set availability mutation
  const setAvailabilityMutation = useMutation({
    mutationFn: async (pattern: AvailabilityPattern) => {
      return enhancedApi.technicians.setAvailability(
        technicianId,
        pattern.day_of_week,
        pattern.start_time,
        pattern.end_time,
        pattern.is_active
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-availability'] });
      setEditingPattern(null);
    },
    onError: (error) => {
      logger.error('Failed to set availability', error, 'AvailabilityManager');
    }
  });

  // Create time-off request mutation
  const createTimeOffMutation = useMutation({
    mutationFn: async (request: TimeOffRequest) => {
      // TODO: Implement time-off request API endpoint
      logger.debug('Creating time-off request', request, 'AvailabilityManager');
      return Promise.resolve({ id: 'temp-id', ...request, status: 'pending' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-availability'] });
      setShowTimeOffDialog(false);
      setTimeOffRequest({ start_date: '', end_date: '', reason: '' });
    },
    onError: (error) => {
      logger.error('Failed to create time-off request', error, 'AvailabilityManager');
    }
  });

  const availabilityPatterns = availabilityData?.patterns || [];
  const timeOffRequests = availabilityData?.timeOffRequests || [];

  const handleEditPattern = (dayOfWeek: number) => {
    const existing = availabilityPatterns.find((p: any) => p.day_of_week === dayOfWeek);
    if (existing) {
      setEditingPattern({
        day_of_week: dayOfWeek,
        start_time: existing.start_time,
        end_time: existing.end_time,
        is_active: existing.is_active
      });
    } else {
      setEditingPattern({
        day_of_week: dayOfWeek,
        start_time: '09:00',
        end_time: '17:00',
        is_active: true
      });
    }
  };

  const handleSavePattern = () => {
    if (editingPattern) {
      setAvailabilityMutation.mutate(editingPattern);
    }
  };

  const handleDeletePattern = (dayOfWeek: number) => {
    setAvailabilityMutation.mutate({
      day_of_week: dayOfWeek,
      start_time: '00:00',
      end_time: '00:00',
      is_active: false
    });
  };

  const handleCreateTimeOff = () => {
    if (timeOffRequest.start_date && timeOffRequest.end_date && timeOffRequest.reason) {
      createTimeOffMutation.mutate(timeOffRequest);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading availability...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Availability Management
          </Heading>
          {technicianName && (
            <Text className="text-gray-600 mt-1">
              {technicianName}
            </Text>
          )}
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose} icon={X}>
            Close
          </Button>
        )}
      </div>

      {/* Recurring Availability Patterns */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Weekly Availability Pattern
            </Heading>
            <Text className="text-sm text-gray-600">
              Set recurring weekly availability
            </Text>
          </div>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day, index) => {
              const pattern = availabilityPatterns.find((p: any) => p.day_of_week === index);
              const isEditing = editingPattern?.day_of_week === index;

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    pattern?.is_active
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Text className="font-medium">{day}</Text>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={editingPattern.is_active}
                            onChange={(checked: boolean) => setEditingPattern({
                              ...editingPattern,
                              is_active: checked
                            })}
                          />
                          <Text className="text-sm">Active</Text>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Text className="text-sm text-gray-600 mb-1">Start Time</Text>
                          <Input
                            type="time"
                            value={editingPattern.start_time}
                            onChange={(e) => setEditingPattern({
                              ...editingPattern,
                              start_time: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Text className="text-sm text-gray-600 mb-1">End Time</Text>
                          <Input
                            type="time"
                            value={editingPattern.end_time}
                            onChange={(e) => setEditingPattern({
                              ...editingPattern,
                              end_time: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleSavePattern}
                          disabled={setAvailabilityMutation.isPending}
                          icon={Save}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPattern(null)}
                        >
                          Cancel
                        </Button>
                        {pattern && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePattern(index)}
                            icon={Trash2}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          pattern?.is_active ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <Text className="font-medium">{day}</Text>
                        {pattern?.is_active && (
                          <Text className="text-sm text-gray-600">
                            {pattern.start_time} - {pattern.end_time}
                          </Text>
                        )}
                        {!pattern?.is_active && (
                          <Text className="text-sm text-gray-500 italic">Not available</Text>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPattern(index)}
                        icon={pattern ? Edit : Plus}
                      >
                        {pattern ? 'Edit' : 'Add'}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Time-Off Requests */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Time-Off Requests
            </Heading>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowTimeOffDialog(true)}
              icon={Plus}
            >
              Request Time Off
            </Button>
          </div>

          {timeOffRequests.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <Text className="text-gray-500">No time-off requests</Text>
            </div>
          ) : (
            <div className="space-y-3">
              {timeOffRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">{request.reason}</Text>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Time-Off Request Dialog */}
      <Dialog open={showTimeOffDialog} onOpenChange={setShowTimeOffDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
            <DialogDescription>
              Submit a time-off request for approval
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Text className="text-sm font-medium mb-1">Start Date</Text>
              <Input
                type="date"
                value={timeOffRequest.start_date}
                onChange={(e) => setTimeOffRequest({
                  ...timeOffRequest,
                  start_date: e.target.value
                })}
              />
            </div>
            <div>
              <Text className="text-sm font-medium mb-1">End Date</Text>
              <Input
                type="date"
                value={timeOffRequest.end_date}
                onChange={(e) => setTimeOffRequest({
                  ...timeOffRequest,
                  end_date: e.target.value
                })}
              />
            </div>
            <div>
              <Text className="text-sm font-medium mb-1">Reason</Text>
              <Input
                type="text"
                placeholder="Vacation, sick leave, personal time..."
                value={timeOffRequest.reason}
                onChange={(e) => setTimeOffRequest({
                  ...timeOffRequest,
                  reason: e.target.value
                })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTimeOffDialog(false);
                setTimeOffRequest({ start_date: '', end_date: '', reason: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTimeOff}
              disabled={createTimeOffMutation.isPending || !timeOffRequest.start_date || !timeOffRequest.end_date || !timeOffRequest.reason}
            >
              {createTimeOffMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}





