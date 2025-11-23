import { useState, useEffect } from 'react';
import { Repeat } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';
import { Switch } from '@/components/ui/Switch';

export interface RecurrencePattern {
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrence_interval: number;
  recurrence_days_of_week?: number[]; // 0=Sunday, 6=Saturday
  recurrence_day_of_month?: number; // 1-31
  recurrence_weekday_of_month?: string; // 'first_monday', 'last_friday', etc.
  start_date: string; // ISO date string
  end_date?: string; // ISO date string
  max_occurrences?: number;
}

interface RecurrencePatternSelectorProps {
  value?: RecurrencePattern;
  onChange: (pattern: RecurrencePattern) => void;
  startDate?: Date;
  endDate?: Date;
}

const daysOfWeek = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

export const RecurrencePatternSelector: React.FC<RecurrencePatternSelectorProps> = ({
  value,
  onChange,
  startDate = new Date(),
  endDate,
}) => {
  const [pattern, setPattern] = useState<RecurrencePattern>({
    recurrence_type: 'weekly',
    recurrence_interval: 1,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate?.toISOString().split('T')[0],
    ...value,
  });

  useEffect(() => {
    if (value) {
      setPattern({ ...value });
    }
  }, [value]);

  const handleChange = (updates: Partial<RecurrencePattern>) => {
    const newPattern = { ...pattern, ...updates };
    setPattern(newPattern);
    onChange(newPattern);
  };

  const toggleDayOfWeek = (day: number) => {
    const currentDays = pattern.recurrence_days_of_week || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    handleChange({ recurrence_days_of_week: newDays });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recurrence Pattern</h3>
        </div>

        {/* Recurrence Type */}
        <div>
          <Label htmlFor="recurrence-type">Pattern Type</Label>
          <Select
            value={pattern.recurrence_type}
            onValueChange={(value: RecurrencePattern['recurrence_type']) =>
              handleChange({ recurrence_type: value })
            }
          >
            <SelectTrigger id="recurrence-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interval */}
        <div>
          <Label htmlFor="interval">
            Repeat Every{' '}
            {pattern.recurrence_type === 'daily' && 'Day(s)'}
            {pattern.recurrence_type === 'weekly' && 'Week(s)'}
            {pattern.recurrence_type === 'monthly' && 'Month(s)'}
            {pattern.recurrence_type === 'custom' && 'Day(s)'}
          </Label>
          <Input
            id="interval"
            type="number"
            min="1"
            value={pattern.recurrence_interval || 1}
            onChange={(e) => handleChange({ recurrence_interval: parseInt(e.target.value) || 1 })}
            className="w-24"
          />
        </div>

        {/* Weekly: Days of Week */}
        {pattern.recurrence_type === 'weekly' && (
          <div>
            <Label>Days of Week</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDayOfWeek(day.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pattern.recurrence_days_of_week?.includes(day.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            {(!pattern.recurrence_days_of_week || pattern.recurrence_days_of_week.length === 0) && (
              <p className="text-xs text-red-600 mt-1">Please select at least one day</p>
            )}
          </div>
        )}

        {/* Monthly: Day of Month */}
        {pattern.recurrence_type === 'monthly' && (
          <div>
            <Label htmlFor="day-of-month">Day of Month</Label>
            <Input
              id="day-of-month"
              type="number"
              min="1"
              max="31"
              value={pattern.recurrence_day_of_month || startDate.getDate()}
              onChange={(e) =>
                handleChange({ recurrence_day_of_month: parseInt(e.target.value) || undefined })
              }
              className="w-24"
            />
            <p className="text-xs text-gray-500 mt-1">Day of the month (1-31)</p>
          </div>
        )}

        {/* Start Date */}
        <div>
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={pattern.start_date}
            onChange={(e) => handleChange({ start_date: e.target.value })}
          />
        </div>

        {/* End Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Switch
              id="has-end-date"
              checked={!!pattern.end_date}
              onCheckedChange={(checked) =>
                handleChange({ end_date: checked ? undefined : undefined })
              }
            />
            <Label htmlFor="has-end-date">Set End Date</Label>
          </div>

          {pattern.end_date !== undefined && (
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={pattern.end_date || ''}
                onChange={(e) => handleChange({ end_date: e.target.value || undefined })}
                min={pattern.start_date}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch
              id="has-max-occurrences"
              checked={!!pattern.max_occurrences}
              onCheckedChange={(checked) =>
                handleChange({ max_occurrences: checked ? undefined : undefined })
              }
            />
            <Label htmlFor="has-max-occurrences">Set Maximum Occurrences</Label>
          </div>

          {pattern.max_occurrences !== undefined && (
            <div>
              <Label htmlFor="max-occurrences">Maximum Occurrences</Label>
              <Input
                id="max-occurrences"
                type="number"
                min="1"
                value={pattern.max_occurrences || ''}
                onChange={(e) =>
                  handleChange({ max_occurrences: parseInt(e.target.value) || undefined })
                }
                className="w-32"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

