import { useState } from 'react';
import { useTechnicians } from '@/hooks/useTechnicians';
import { TechnicianProfile } from '@/types/technician';
import TechnicianList from '@/components/technicians/TechnicianList';
import TechnicianAssignmentInterface from '@/components/technicians/TechnicianAssignmentInterface';
import TechnicianAvailabilityCalendar from '@/components/technicians/TechnicianAvailabilityCalendar';
import TechnicianDashboard from '@/components/technicians/TechnicianDashboard';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  UserPlus,
  Settings
} from 'lucide-react';
import Card from '@/components/ui/Card';

type ViewMode = 'list' | 'assignment' | 'calendar' | 'dashboard';

export default function TechnicianManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianProfile | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | undefined>(undefined);

  const { data: techniciansData } = useTechnicians({ limit: 20 });
  const technicians = techniciansData?.technicians || [];

  const handleTechnicianSelect = (technician: TechnicianProfile) => {
    setSelectedTechnician(technician);
  };

  const handleAssignmentComplete = () => {
    // Handle assignment completion
    setSelectedDate('');
    setSelectedTimeSlot(undefined);
  };

  const handleTimeSlotSelect = (technician: TechnicianProfile, date: Date, timeSlot: string) => {
    setSelectedTechnician(technician);
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedTimeSlot({ start: timeSlot, end: addTime(timeSlot, 1) });
    setViewMode('assignment');
  };

  const addTime = (time: string, hours: number): string => {
    const [hour = 0, minute = 0] = time.split(':').map(Number);
    const newHour = (hour + hours) % 24;
    return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'list': return <Users className="h-4 w-4" />;
      case 'assignment': return <UserPlus className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      case 'dashboard': return <BarChart3 className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getViewModeTitle = (mode: ViewMode) => {
    switch (mode) {
      case 'list': return 'Technician List';
      case 'assignment': return 'Technician Assignment';
      case 'calendar': return 'Availability Calendar';
      case 'dashboard': return 'Performance Dashboard';
      default: return 'Technician Management';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Technician Management
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Manage your technician team and assignments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {/* Navigate to create technician */}}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Technician
            </button>
            <button
              onClick={() => {/* Navigate to settings */}}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <nav className="flex space-x-8">
          {(['dashboard', 'list', 'calendar', 'assignment'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                viewMode === mode
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {getViewModeIcon(mode)}
              {getViewModeTitle(mode)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Technicians</p>
                  <p className="text-2xl font-semibold text-gray-900">{technicians.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Technicians</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {technicians.filter(t => t.status === 'active').length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Jobs Today</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-semibold text-gray-900">87%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* View Content */}
          <div className="space-y-6">
            {viewMode === 'dashboard' && (
              <TechnicianDashboard
                {...(selectedTechnician ? { selectedTechnician } : {})}
                onTechnicianSelect={handleTechnicianSelect}
              />
            )}

            {viewMode === 'list' && (
              <TechnicianList />
            )}

            {viewMode === 'calendar' && (
              <TechnicianAvailabilityCalendar
                {...(selectedTechnician ? { selectedTechnician } : {})}
                onTechnicianSelect={handleTechnicianSelect}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            )}

            {viewMode === 'assignment' && (
              <TechnicianAssignmentInterface
                {...(selectedDate ? { selectedDate } : {})}
                {...(selectedTimeSlot ? { selectedTimeSlot } : {})}
                onTechnicianSelect={handleTechnicianSelect}
                onAssignmentComplete={handleAssignmentComplete}
              />
            )}
          </div>
      </div>
    </div>
  );
}






