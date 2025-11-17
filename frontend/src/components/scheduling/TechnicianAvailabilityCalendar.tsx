/**
 * Technician Availability Calendar Component
 * 
 * Allows technicians and managers to set recurring weekly availability patterns.
 * Shows a weekly view with time slots for each day.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface TechnicianAvailabilityCalendarProps {
  technicianId: string;
  technicianName?: string;
  onClose?: () => void;
  readOnly?: boolean;
}

interface AvailabilityPattern {
  id?: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_active: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' }
];

export const TechnicianAvailabilityCalendar: React.FC<TechnicianAvailabilityCalendarProps> = ({
  technicianId,
  technicianName,
  onClose,
  readOnly = false
}) => {
  const queryClient = useQueryClient();
  const [patterns, setPatterns] = useState<AvailabilityPattern[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tempStartTime, setTempStartTime] = useState<string>('09:00');
  const [tempEndTime, setTempEndTime] = useState<string>('17:00');
  const [tempIsActive, setTempIsActive] = useState<boolean>(true);

  // Fetch existing availability patterns
  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ['technician-availability', technicianId],
    queryFn: async () => {
      try {
        const data = await enhancedApi.technicians.getAvailability(technicianId);
        return data;
      } catch (error) {
        logger.error('Failed to fetch availability', error);
        return { availability_patterns: [] };
      }
    },
    enabled: !!technicianId,
    staleTime: 5 * 60 * 1000
  });

  // Initialize patterns from fetched data
  useEffect(() => {
    if (availabilityData?.availability_patterns) {
      const fetchedPatterns = availabilityData.availability_patterns.map((p: any) => ({
        day_of_week: p.day_of_week,
        start_time: p.start_time || '09:00',
        end_time: p.end_time || '17:00',
        is_active: p.is_active !== false
      }));
      setPatterns(fetchedPatterns);
    } else {
      // Initialize with empty patterns for all days
      setPatterns(DAYS_OF_WEEK.map(day => ({
        day_of_week: day.value,
        start_time: '09:00',
        end_time: '17:00',
        is_active: false
      })));
    }
  }, [availabilityData]);

  // Save availability pattern mutation
  const savePatternMutation = useMutation({
    mutationFn: async (pattern: AvailabilityPattern) => {
      await enhancedApi.technicians.setAvailability(
        technicianId,
        pattern.day_of_week,
        pattern.start_time,
        pattern.end_time,
        pattern.is_active
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-availability', technicianId] });
      queryClient.invalidateQueries({ queryKey: ['technicians', 'available'] });
      setEditingDay(null);
      logger.info('Availability pattern saved', { technicianId, day: editingDay });
    },
    onError: (error) => {
      logger.error('Failed to save availability pattern', error);
    }
  });

  const handleEditDay = (dayOfWeek: number) => {
    if (readOnly) return;
    
    const existingPattern = patterns.find(p => p.day_of_week === dayOfWeek);
    if (existingPattern) {
      setTempStartTime(existingPattern.start_time);
      setTempEndTime(existingPattern.end_time);
      setTempIsActive(existingPattern.is_active);
    } else {
      setTempStartTime('09:00');
      setTempEndTime('17:00');
      setTempIsActive(true);
    }
    setEditingDay(dayOfWeek);
  };

  const handleSaveDay = () => {
    if (editingDay === null) return;

    const pattern: AvailabilityPattern = {
      day_of_week: editingDay,
      start_time: tempStartTime,
      end_time: tempEndTime,
      is_active: tempIsActive
    };

    // Validate time range
    if (tempStartTime >= tempEndTime) {
      toast.error('End time must be after start time');
      return;
    }

    savePatternMutation.mutate(pattern);

    // Update local state
    setPatterns(prev => {
      const filtered = prev.filter(p => p.day_of_week !== editingDay);
      return [...filtered, pattern];
    });
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
  };

  const handleToggleActive = (dayOfWeek: number) => {
    if (readOnly) return;
    
    const pattern = patterns.find(p => p.day_of_week === dayOfWeek);
    if (pattern) {
      const updatedPattern = { ...pattern, is_active: !pattern.is_active };
      savePatternMutation.mutate(updatedPattern);
      setPatterns(prev => prev.map(p => 
        p.day_of_week === dayOfWeek ? updatedPattern : p
      ));
    }
  };

  const getPatternForDay = (dayOfWeek: number): AvailabilityPattern | undefined => {
    return patterns.find(p => p.day_of_week === dayOfWeek);
  };

  const formatTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <LoadingSpinner text="Loading availability..." />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Availability Schedule
          </h3>
          {technicianName && (
            <p className="text-sm text-gray-600 mt-1">for {technicianName}</p>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {DAYS_OF_WEEK.map((day) => {
          const pattern = getPatternForDay(day.value);
          const isEditing = editingDay === day.value;
          const isActive = pattern?.is_active ?? false;

          return (
            <div
              key={day.value}
              className={`border rounded-lg p-4 transition-colors ${
                isActive
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              } ${!readOnly ? 'cursor-pointer hover:border-blue-300' : ''}`}
              onClick={() => !isEditing && !readOnly && handleEditDay(day.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-20 font-medium text-gray-900">
                    {day.label}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">From:</label>
                        <Input
                          type="time"
                          value={tempStartTime}
                          onChange={(e) => setTempStartTime(e.target.value)}
                          className="w-32"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">To:</label>
                        <Input
                          type="time"
                          value={tempEndTime}
                          onChange={(e) => setTempEndTime(e.target.value)}
                          className="w-32"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tempIsActive}
                          onChange={(e) => setTempIsActive(e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded"
                        />
                        <label className="text-sm text-gray-600">Active</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveDay();
                          }}
                          disabled={savePatternMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEdit();
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 flex-1">
                      {isActive ? (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">
                              {formatTime(pattern?.start_time || '')} - {formatTime(pattern?.end_time || '')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Active</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Not available</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isEditing && !readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(day.value);
                    }}
                  >
                    {isActive ? 'Disable' : 'Enable'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {readOnly && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            This is a read-only view. Contact an administrator to modify availability.
          </p>
        </div>
      )}

      {!readOnly && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Tip:</strong> Click on any day to set availability hours. Availability patterns are recurring weekly.
          </p>
        </div>
      )}
    </Card>
  );
};

export default TechnicianAvailabilityCalendar;

