import React from 'react';
import SchedulerPro from './scheduler/SchedulerPro';
import { JobEvent } from '@/types';

interface JobsCalendarProps {
  events: JobEvent[];
  height?: string;
  view?: string;
  onViewChange?: (view: string) => void;
  onEventClick?: (event: any) => void;
  onEventDrop?: (info: any) => void;
  onEventResize?: (info: any) => void;
  onDateSelect?: (selectInfo: any) => void;
}

const JobsCalendar: React.FC<JobsCalendarProps> = ({
  events = [],
  height = '400px',
  view = 'month',
  onViewChange,
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
    <div className="w-full" style={{ height: height }}>
      <SchedulerPro
        initialView={view}
        view={view}
        onViewChange={onViewChange}
        resources={resources}
        dataAdapter={{
          source: schedulerEvents
        }}
        hideToolbar={true}
      />
    </div>
  );
};

export default JobsCalendar;
