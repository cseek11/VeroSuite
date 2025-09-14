import React, { useState } from 'react';
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
  Settings,
  Filter,
  Search
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

type ViewMode = 'list' | 'assignment' | 'calendar' | 'dashboard';

export default function TechnicianManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);

  const { data: techniciansData } = useTechnicians({ limit: 20 });
  const technicians = techniciansData?.technicians || [];

  const handleTechnicianSelect = (technician: TechnicianProfile) => {
    setSelectedTechnician(technician);
    // You could navigate to a detailed view or open a modal
    console.log('Selected technician:', technician);
  };

  const handleAssignmentComplete = (assignment: any) => {
    console.log('Assignment completed:', assignment);
    // Handle assignment completion
    setSelectedDate('');
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (technician: TechnicianProfile, date: Date, timeSlot: string) => {
    setSelectedTechnician(technician);
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedTimeSlot({ start: timeSlot, end: addTime(timeSlot, 1) });
    setViewMode('assignment');
  };

  const addTime = (time: string, hours: number): string => {
    const [hour, minute] = time.split(':').map(Number);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Technician Management</h1>
              <p className="text-sm text-gray-600">Manage your technician team and assignments</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Navigate to create technician */}}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Technician
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Navigate to settings */}}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {(['dashboard', 'list', 'calendar', 'assignment'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  viewMode === mode
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getViewModeIcon(mode)}
                {getViewModeTitle(mode)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                selectedTechnician={selectedTechnician}
                onTechnicianSelect={handleTechnicianSelect}
              />
            )}

            {viewMode === 'list' && (
              <TechnicianList />
            )}

            {viewMode === 'calendar' && (
              <TechnicianAvailabilityCalendar
                selectedTechnician={selectedTechnician}
                onTechnicianSelect={handleTechnicianSelect}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            )}

            {viewMode === 'assignment' && (
              <TechnicianAssignmentInterface
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                onTechnicianSelect={handleTechnicianSelect}
                onAssignmentComplete={handleAssignmentComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






