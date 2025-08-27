import React, { useState } from 'react';
import SchedulerPro from '../components/scheduler/SchedulerPro';

import {
  Typography,
  Card
} from '@/components/ui/EnhancedUI';
import {
  Calendar,
  Clock,
  Users
} from 'lucide-react';

export default function SchedulerPage() {
  const [sampleEvents] = useState([
    {
      id: '1',
      title: 'Rodent Inspection',
      start: new Date(2025, 7, 21, 9, 0).toISOString(),
      end: new Date(2025, 7, 21, 11, 0).toISOString(),
      resourceId: 'ashley',
      color: '#FF6B6B',
      jobType: 'Inspection'
    },
    {
      id: '2',
      title: 'Pest Treatment',
      start: new Date(2025, 7, 21, 14, 0).toISOString(),
      end: new Date(2025, 7, 21, 16, 0).toISOString(),
      resourceId: 'john',
      color: '#4ECDC4',
      jobType: 'Treatment'
    },
    {
      id: '3',
      title: 'Follow-up Visit',
      start: new Date(2025, 7, 22, 10, 0).toISOString(),
      end: new Date(2025, 7, 22, 11, 0).toISOString(),
      resourceId: 'sarah',
      color: '#45B7D1',
      jobType: 'Follow-up'
    }
  ]);

  const resources = [
    { id: "unassigned", name: "Unassigned", color: "#9CA3AF" },
    { id: "ashley", name: "Ashley", color: "#60A5FA" },
    { id: "john", name: "John", color: "#34D399" },
    { id: "sarah", name: "Sarah", color: "#F59E0B" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-gray-900">
          VeroPest Scheduler
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-2">
          Advanced scheduling and resource management for pest control operations
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div>
              <Typography variant="h4" className="text-gray-900 font-bold">
                {sampleEvents.length}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Scheduled Jobs
              </Typography>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <Typography variant="h4" className="text-gray-900 font-bold">
                {resources.length - 1}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Active Technicians
              </Typography>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-purple-500" />
            <div>
              <Typography variant="h4" className="text-gray-900 font-bold">
                {sampleEvents.filter(e => new Date(e.start) > new Date()).length}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Upcoming Jobs
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      {/* Scheduler */}
      <Card className="h-[600px] overflow-hidden">
        <div className="h-full">
          <SchedulerPro
            initialView="month"
            initialDate={new Date(2025, 7, 21)}
            resources={resources}
            dataAdapter={{
              source: sampleEvents
            }}
          />
        </div>
      </Card>
    </div>
  );
}
