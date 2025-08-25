import React from 'react';
import SchedulerPro from './scheduler/SchedulerPro';
import { JobEvent } from '@/types';

interface JobsCalendarProps {
  events: JobEvent[];
  height?: string;
  view?: string;
  onEventClick?: (event: any) => void;
  onEventDrop?: (info: any) => void;
  onEventResize?: (info: any) => void;
  onDateSelect?: (selectInfo: any) => void;
}

const JobsCalendar: React.FC<JobsCalendarProps> = ({
  events = [],
  height = '400px',
  view = 'month',
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateSelect,
}) => {
  // Convert JobEvent format to SchedulerPro format
  const schedulerEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    resourceId: event.extendedProps?.technician || 'unassigned',
    color: event.color,
    location: event.extendedProps?.location || '',
    notes: event.extendedProps?.description || ''
  }));

  // Custom resources for technicians
  const resources = [
    { id: "unassigned", name: "Unassigned", color: "#9CA3AF" },
    { id: "ashley", name: "Ashley", color: "#60A5FA" },
    { id: "john", name: "John", color: "#34D399" },
    { id: "sarah", name: "Sarah", color: "#F59E0B" },
  ];

  return (
    <div className="h-full w-full">
      <SchedulerPro
        initialView={view}
        resources={resources}
        dataAdapter={{
          source: schedulerEvents
        }}
      />
    </div>
  );
};

export default JobsCalendar;
