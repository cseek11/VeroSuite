import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { logger } from '@/utils/logger';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

// Types
interface TimeSlot {
  id: string;
  technician_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  job_id?: string;
  created_at: string;
}


interface TimeSlotManagerProps {
  selectedDate: Date;
  technicianId?: string;
  onSlotSelect?: (slot: TimeSlot) => void;
  onSlotCreate?: (slot: Partial<TimeSlot>) => void;
}

export const TimeSlotManager: React.FC<TimeSlotManagerProps> = ({
  selectedDate,
  technicianId,
  onSlotSelect,
  onSlotCreate: _onSlotCreate
}) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>(technicianId || '');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    start_time: '09:00',
    end_time: '10:00',
    is_available: true
  });
  const [conflicts, setConflicts] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Fetch technicians
  const { data: technicians = [], isLoading: techniciansLoading } = useQuery({
    queryKey: ['technicians', 'active'],
    queryFn: () => enhancedApi.users.list(),
    staleTime: 10 * 60 * 1000,
  });

  // Fetch time slots for selected date and technician
  const { data: timeSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ['time-slots', selectedDate, selectedTechnician],
    queryFn: async () => {
      if (!selectedTechnician) return [];
      
      // TODO: Implement time slots API endpoint
      // For now, return mock data
      return [
        {
          id: '1',
          technician_id: selectedTechnician,
          start_time: '09:00',
          end_time: '10:00',
          is_available: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          technician_id: selectedTechnician,
          start_time: '10:00',
          end_time: '11:00',
          is_available: false,
          job_id: 'job-123',
          created_at: new Date().toISOString()
        }
      ];
    },
    enabled: !!selectedTechnician,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch availability patterns
  const { data: availabilityPatterns = [] } = useQuery({
    queryKey: ['availability-patterns', selectedTechnician],
    queryFn: async () => {
      if (!selectedTechnician) return [];
      
      // TODO: Implement availability patterns API endpoint
      return [
        {
          id: '1',
          technician_id: selectedTechnician,
          day_of_week: selectedDate.getDay(),
          start_time: '08:00',
          end_time: '17:00',
          is_active: true
        }
      ];
    },
    enabled: !!selectedTechnician,
    staleTime: 10 * 60 * 1000,
  });

  // Create time slot mutation
  const createSlotMutation = useMutation({
    mutationFn: async (slotData: Partial<TimeSlot>) => {
      // TODO: Implement create time slot API endpoint
      logger.debug('Creating time slot', slotData, 'TimeSlotManager');
      return { id: 'new-slot', ...slotData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-slots'] });
      setShowCreateDialog(false);
      setNewSlot({
        start_time: '09:00',
        end_time: '10:00',
        is_available: true
      });
    },
    onError: (error) => {
      logger.error('Failed to create time slot', error, 'TimeSlotManager');
    }
  });

  // Update time slot mutation
  const updateSlotMutation = useMutation({
    mutationFn: async ({ slotId, updates }: { slotId: string; updates: Partial<TimeSlot> }) => {
      // TODO: Implement update time slot API endpoint
      logger.debug('Updating time slot', { slotId, updates }, 'TimeSlotManager');
      return { id: slotId, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-slots'] });
    },
    onError: (error) => {
      logger.error('Failed to update time slot', error, 'TimeSlotManager');
    }
  });

  // Delete time slot mutation
  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: string) => {
      // TODO: Implement delete time slot API endpoint
      logger.debug('Deleting time slot', { slotId }, 'TimeSlotManager');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-slots'] });
    },
    onError: (error) => {
      logger.error('Failed to delete time slot', error, 'TimeSlotManager');
    }
  });

  // Generate time slots based on availability patterns
  const generateTimeSlots = () => {
    if (!selectedTechnician || availabilityPatterns.length === 0) return;

    const pattern = availabilityPatterns.find(p => 
      p.technician_id === selectedTechnician && 
      p.day_of_week === selectedDate.getDay() &&
      p.is_active
    );

    if (!pattern) return;

    if (!pattern.start_time || !pattern.end_time) return;
    const slots = [];
    const startHour = parseInt(pattern.start_time.split(':')[0] ?? '0');
    const endHour = parseInt(pattern.end_time.split(':')[0] ?? '0');

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

      // Check if slot already exists
      const existingSlot = timeSlots.find(slot => 
        slot.start_time === startTime && slot.end_time === endTime
      );

      if (!existingSlot) {
        slots.push({
          id: `generated-${hour}`,
          technician_id: selectedTechnician,
          start_time: startTime,
          end_time: endTime,
          is_available: true,
          created_at: new Date().toISOString()
        });
      }
    }

    return slots;
  };

  // Check for conflicts
  const checkConflicts = (startTime: string, endTime: string, excludeId?: string) => {
    const conflicts: string[] = [];
    
    timeSlots.forEach(slot => {
      if (slot.id === excludeId) return;
      
      const slotStart = slot.start_time;
      const slotEnd = slot.end_time;
      
      // Check for overlap
      if (
        (startTime >= slotStart && startTime < slotEnd) ||
        (endTime > slotStart && endTime <= slotEnd) ||
        (startTime <= slotStart && endTime >= slotEnd)
      ) {
        conflicts.push(`Conflicts with ${slotStart}-${slotEnd}`);
      }
    });
    
    return conflicts;
  };

  // Handle create slot
  const handleCreateSlot = () => {
    const slotConflicts = checkConflicts(newSlot.start_time!, newSlot.end_time!);
    
    if (slotConflicts.length > 0) {
      setConflicts(slotConflicts);
      return;
    }

    createSlotMutation.mutate({
      ...newSlot,
      technician_id: selectedTechnician
    });
  };

  // Handle slot toggle availability
  const handleToggleAvailability = (slot: TimeSlot) => {
    updateSlotMutation.mutate({
      slotId: slot.id,
      updates: { is_available: !slot.is_available }
    });
  };

  // Handle slot delete
  const handleDeleteSlot = (slot: TimeSlot) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      deleteSlotMutation.mutate(slot.id);
    }
  };

  // Render time slot
  const renderTimeSlot = (slot: TimeSlot) => {
    const isConflict = conflicts.some(conflict => 
      conflict.includes(`${slot.start_time}-${slot.end_time}`)
    );

    return (
      <div
        key={slot.id}
        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
          slot.is_available 
            ? 'bg-green-50 border-green-200 hover:bg-green-100' 
            : 'bg-red-50 border-red-200 hover:bg-red-100'
        } ${isConflict ? 'ring-2 ring-red-500' : ''}`}
        onClick={() => onSlotSelect?.(slot)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">
              {slot.start_time} - {slot.end_time}
            </div>
            <div className="text-sm text-gray-500">
              {slot.is_available ? 'Available' : 'Booked'}
            </div>
            {slot.job_id && (
              <div className="text-xs text-blue-600">
                Job: {slot.job_id}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleToggleAvailability(slot);
              }}
            >
              {slot.is_available ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleDeleteSlot(slot);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (techniciansLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Technician Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Technician
        </label>
        <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a technician" />
          </SelectTrigger>
          <SelectContent>
            {technicians.map(technician => (
              <SelectItem key={technician.id} value={technician.id}>
                {technician.first_name} {technician.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Display */}
      <div className="text-sm text-gray-600">
        Managing time slots for: {selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateDialog(true)}
          disabled={!selectedTechnician}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Time Slot
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const generatedSlots = generateTimeSlots();
            if (generatedSlots && generatedSlots.length > 0) {
              generatedSlots.forEach(slot => {
                createSlotMutation.mutate(slot);
              });
            }
          }}
          disabled={!selectedTechnician}
        >
          Generate from Pattern
        </Button>
      </div>

      {/* Conflicts Display */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <div className="font-medium text-red-800">Time Conflicts Detected</div>
              <ul className="text-sm text-red-700 mt-1">
                {conflicts.map((conflict, index) => (
                  <li key={index}>• {conflict}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Time Slots List */}
      <div className="space-y-2">
        {slotsLoading ? (
          <LoadingSpinner />
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No time slots found for this technician and date.
          </div>
        ) : (
          timeSlots.map(renderTimeSlot)
        )}
      </div>

      {/* Create Time Slot Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Time Slot</DialogTitle>
            <DialogDescription>
              Add a new time slot for the selected technician
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_available"
                checked={newSlot.is_available}
                onChange={(e) => setNewSlot({ ...newSlot, is_available: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="is_available" className="text-sm text-gray-700">
                Available for booking
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSlot}
              disabled={createSlotMutation.isPending}
            >
              {createSlotMutation.isPending ? 'Creating...' : 'Create Slot'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimeSlotManager;
