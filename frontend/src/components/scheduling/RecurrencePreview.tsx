import React, { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import { RecurrencePattern } from './RecurrencePatternSelector';

interface RecurrencePreviewProps {
  pattern: RecurrencePattern;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  maxPreview?: number; // Maximum number of dates to show
}

export const RecurrencePreview: React.FC<RecurrencePreviewProps> = ({
  pattern,
  startTime,
  endTime,
  maxPreview = 10,
}) => {
  const previewDates = useMemo(() => {
    const dates: Date[] = [];
    const startDate = new Date(pattern.start_date);
    const endDate = pattern.end_date ? new Date(pattern.end_date) : null;
    const maxOccurrences = pattern.max_occurrences || maxPreview;
    const interval = pattern.recurrence_interval || 1;

    const currentDate = new Date(startDate);
    let occurrenceCount = 0;

    while (occurrenceCount < maxOccurrences && occurrenceCount < maxPreview) {
      // Check end date limit
      if (endDate && currentDate > endDate) {
        break;
      }

      let shouldInclude = false;

      switch (pattern.recurrence_type) {
        case 'daily':
          shouldInclude = true;
          if (occurrenceCount > 0) {
            currentDate.setDate(currentDate.getDate() + interval);
          }
          break;

        case 'weekly':
          if (pattern.recurrence_days_of_week && pattern.recurrence_days_of_week.length > 0) {
            const dayOfWeek = currentDate.getDay();
            if (pattern.recurrence_days_of_week.includes(dayOfWeek)) {
              shouldInclude = true;
            }
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
            // If we've passed all days, move to next week
            if (currentDate.getDay() === 0 && !pattern.recurrence_days_of_week.includes(0)) {
              currentDate.setDate(currentDate.getDate() + (7 * (interval - 1)));
            }
          } else {
            shouldInclude = true;
            if (occurrenceCount > 0) {
              currentDate.setDate(currentDate.getDate() + (7 * interval));
            }
          }
          break;

        case 'monthly':
          if (pattern.recurrence_day_of_month) {
            if (currentDate.getDate() === pattern.recurrence_day_of_month) {
              shouldInclude = true;
            }
            if (occurrenceCount > 0) {
              currentDate.setMonth(currentDate.getMonth() + interval);
              currentDate.setDate(pattern.recurrence_day_of_month);
            }
          } else {
            const dayOfMonth = startDate.getDate();
            if (currentDate.getDate() === dayOfMonth) {
              shouldInclude = true;
            }
            if (occurrenceCount > 0) {
              currentDate.setMonth(currentDate.getMonth() + interval);
              currentDate.setDate(dayOfMonth);
            }
          }
          break;

        case 'custom':
          shouldInclude = true;
          if (occurrenceCount > 0) {
            currentDate.setDate(currentDate.getDate() + interval);
          }
          break;

        default:
          currentDate.setDate(currentDate.getDate() + 1);
          break;
      }

      if (shouldInclude && currentDate >= startDate) {
        dates.push(new Date(currentDate));
        occurrenceCount++;
      }

      // Safety check
      if (dates.length >= maxPreview || occurrenceCount >= maxOccurrences) {
        break;
      }

      // Prevent infinite loops
      if (dates.length > 100) {
        break;
      }
    }

    return dates;
  }, [pattern, maxPreview]);

  const totalOccurrences = useMemo(() => {
    if (pattern.max_occurrences) {
      return pattern.max_occurrences;
    }
    if (pattern.end_date) {
      // Estimate based on pattern
      const start = new Date(pattern.start_date);
      const end = new Date(pattern.end_date);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (pattern.recurrence_type) {
        case 'daily':
          return Math.floor(daysDiff / (pattern.recurrence_interval || 1)) + 1;
        case 'weekly':
          const weeks = Math.floor(daysDiff / 7);
          const daysPerWeek = pattern.recurrence_days_of_week?.length || 1;
          return Math.floor(weeks / (pattern.recurrence_interval || 1)) * daysPerWeek + daysPerWeek;
        case 'monthly':
          const months = Math.floor(daysDiff / 30);
          return Math.floor(months / (pattern.recurrence_interval || 1)) + 1;
        default:
          return Math.floor(daysDiff / (pattern.recurrence_interval || 1)) + 1;
      }
    }
    return 'Unlimited';
  }, [pattern]);

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Total Occurrences:</span>
            <span className="text-sm font-bold text-gray-900">{totalOccurrences}</span>
          </div>
          {pattern.end_date && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ends:</span>
              <span className="text-sm text-gray-900">
                {new Date(pattern.end_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Next {maxPreview} Occurrences:</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {previewDates.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No occurrences match this pattern</p>
            ) : (
              previewDates.map((date, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {startTime && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {startTime}
                        {endTime && ` - ${endTime}`}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {previewDates.length === maxPreview && (
          <p className="text-xs text-gray-500 italic">
            Showing first {maxPreview} occurrences. More may exist.
          </p>
        )}
      </div>
    </Card>
  );
};






