import React, { useState, useMemo } from 'react';
import { useTechnicians } from '@/hooks/useTechnicians';
import { TechnicianProfile, TechnicianStatus } from '@/types/technician';
import { Job, JobStatus } from '@/types/jobs';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Search,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface TechnicianAvailabilityCalendarProps {
  selectedTechnician?: TechnicianProfile;
  onTechnicianSelect?: (technician: TechnicianProfile) => void;
  onTimeSlotSelect?: (technician: TechnicianProfile, date: Date, timeSlot: string) => void;
  mode?: 'availability' | 'scheduling' | 'overview';
}

interface TimeSlot {
  time: string;
  available: boolean;
  job?: Job;
  status: 'available' | 'busy' | 'break' | 'travel';
}

interface DaySchedule {
  date: Date;
  timeSlots: TimeSlot[];
  totalHours: number;
  availableHours: number;
  jobs: Job[];
}

export default function TechnicianAvailabilityCalendar({
  selectedTechnician,
  onTechnicianSelect,
  onTimeSlotSelect,
  mode = 'availability'
}: TechnicianAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TechnicianStatus | ''>('');

  const { data: techniciansData, isLoading: techniciansLoading } = useTechnicians({
    status: filterStatus || undefined,
    limit: 20
  });

  const technicians = techniciansData?.technicians || [];

  // Filter technicians based on search
  const filteredTechnicians = useMemo(() => {
    if (!searchTerm) return technicians;
    
    const searchLower = searchTerm.toLowerCase();
    return technicians.filter(tech =>
      tech.user?.first_name?.toLowerCase().includes(searchLower) ||
      tech.user?.last_name?.toLowerCase().includes(searchLower) ||
      tech.user?.email?.toLowerCase().includes(searchLower) ||
      tech.position?.toLowerCase().includes(searchLower)
    );
  }, [technicians, searchTerm]);

  // Generate time slots for a day (8 AM to 6 PM, 30-minute intervals)
  const generateTimeSlots = (date: Date, technician: TechnicianProfile): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Mock availability logic - in real app, this would check actual schedules
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        const hasJob = Math.random() > 0.8; // 20% chance of having a job
        
        let status: TimeSlot['status'] = 'available';
        let job: Job | undefined;
        
        if (hasJob && !isAvailable) {
          status = 'busy';
          job = {
            id: `job-${Math.random()}`,
            work_order_id: `wo-${Math.random()}`,
            technician_id: technician.id,
            scheduled_date: date.toISOString(),
            scheduled_start_time: time,
            scheduled_end_time: `${(hour + 1).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            status: JobStatus.SCHEDULED,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            work_order: {
              id: `wo-${Math.random()}`,
              description: 'Sample Job',
              priority: 'medium',
              status: 'pending',
              account: {
                id: `acc-${Math.random()}`,
                name: 'Sample Customer',
                account_type: 'residential'
              }
            }
          } as Job;
        } else if (!isAvailable && !hasJob) {
          status = Math.random() > 0.5 ? 'break' : 'travel';
        }
        
        slots.push({
          time,
          available: isAvailable,
          job,
          status
        });
      }
    }
    
    return slots;
  };

  // Generate schedule for a technician for a specific date
  const generateDaySchedule = (date: Date, technician: TechnicianProfile): DaySchedule => {
    const timeSlots = generateTimeSlots(date, technician);
    const jobs = timeSlots.filter(slot => slot.job).map(slot => slot.job!);
    
    const totalHours = 10; // 8 AM to 6 PM
    const availableHours = timeSlots.filter(slot => slot.available).length * 0.5; // 30-minute slots
    
    return {
      date,
      timeSlots,
      totalHours,
      availableHours,
      jobs
    };
  };

  // Get week days
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Navigate calendar
  const navigateCalendar = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  // Get time slot color
  const getTimeSlotColor = (status: TimeSlot['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-200 text-green-800';
      case 'busy': return 'bg-red-100 border-red-200 text-red-800';
      case 'break': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'travel': return 'bg-blue-100 border-blue-200 text-blue-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: TimeSlot['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-3 w-3" />;
      case 'busy': return <XCircle className="h-3 w-3" />;
      case 'break': return <Clock className="h-3 w-3" />;
      case 'travel': return <MapPin className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  if (techniciansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading technicians..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Technician Availability</h2>
          <p className="text-gray-600">View technician schedules and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TechnicianStatus | '')}
              className="crm-input"
            >
              <option value="">All Statuses</option>
              <option value={TechnicianStatus.ACTIVE}>Active</option>
              <option value={TechnicianStatus.INACTIVE}>Inactive</option>
              <option value={TechnicianStatus.ON_LEAVE}>On Leave</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Calendar Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateCalendar(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {viewMode === 'week' 
                ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateCalendar(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </Card>

      {/* Technicians List */}
      <div className="space-y-4">
        {filteredTechnicians.map((technician) => {
          const weekDays = getWeekDays(currentDate);
          const daySchedules = weekDays.map(day => generateDaySchedule(day, technician));
          
          return (
            <Card key={technician.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-purple-600">
                      {technician.user?.first_name?.[0]}{technician.user?.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {technician.user?.first_name} {technician.user?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{technician.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Availability</div>
                    <div className="font-semibold text-green-600">
                      {Math.round((daySchedules.reduce((sum, day) => sum + day.availableHours, 0) / 
                        (daySchedules.length * 10)) * 100)}%
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTechnicianSelect?.(technician)}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, dayIndex) => {
                  const schedule = daySchedules[dayIndex];
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={dayIndex} className="space-y-2">
                      <div className={`text-center p-2 rounded-md ${
                        isToday ? 'bg-blue-100 text-blue-900' : 'bg-gray-50 text-gray-700'
                      }`}>
                        <div className="text-sm font-medium">
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-semibold">
                          {day.getDate()}
                        </div>
                      </div>
                      
                      {/* Time Slots */}
                      <div className="space-y-1">
                        {schedule.timeSlots.slice(0, 6).map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className={`p-1 rounded text-xs border cursor-pointer hover:shadow-sm transition-shadow ${getTimeSlotColor(slot.status)}`}
                            onClick={() => onTimeSlotSelect?.(technician, day, slot.time)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(slot.status)}
                              <span className="truncate">{slot.time}</span>
                            </div>
                            {slot.job && (
                              <div className="text-xs opacity-75 truncate">
                                {slot.job.work_order?.description}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {schedule.timeSlots.length > 6 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{schedule.timeSlots.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Total Jobs</div>
                    <div className="font-semibold text-gray-900">
                      {daySchedules.reduce((sum, day) => sum + day.jobs.length, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Available Hours</div>
                    <div className="font-semibold text-green-600">
                      {daySchedules.reduce((sum, day) => sum + day.availableHours, 0).toFixed(1)}h
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Utilization</div>
                    <div className="font-semibold text-blue-600">
                      {Math.round((daySchedules.reduce((sum, day) => sum + (day.totalHours - day.availableHours), 0) / 
                        (daySchedules.length * 10)) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-600">Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-sm text-gray-600">Break</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-sm text-gray-600">Travel</span>
          </div>
        </div>
      </Card>
    </div>
  );
}






