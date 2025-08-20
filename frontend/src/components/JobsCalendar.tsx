import './JobsCalendar.css';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
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
  view = 'timeGridDay',
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateSelect,
}) => {
  const handleEventClick = (clickInfo: any) => {
    if (onEventClick) {
      onEventClick(clickInfo);
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    if (onEventDrop) {
      onEventDrop(dropInfo);
    }
  };

  const handleEventResize = (resizeInfo: any) => {
    if (onEventResize) {
      onEventResize(resizeInfo);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    if (onDateSelect) {
      onDateSelect(selectInfo);
    }
  };

  return (
    <div className='jobs-calendar JobsCalendar_div2'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        initialView={view}
        height={height}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        select={handleDateSelect}
        eventContent={arg => (
          <div className='p-1'>
            <div className='text-xs font-medium truncate'>
              {arg.event.title}
            </div>
            {arg.event.extendedProps.technician && (
              <div className='text-xs text-gray-500 truncate'>
                {arg.event.extendedProps.technician}
              </div>
            )}
          </div>
        )}
        eventClassNames={arg => {
          const status = arg.event.extendedProps.status;
          const baseClasses = 'cursor-pointer';

          switch (status) {
            case 'completed':
              return `${baseClasses} bg-green-500 border-green-600`;
            case 'in-progress':
              return `${baseClasses} bg-blue-500 border-blue-600`;
            case 'urgent':
              return `${baseClasses} bg-red-500 border-red-600`;
            case 'scheduled':
            default:
              return `${baseClasses} bg-purple-500 border-purple-600`;
          }
        }}
        slotMinTime='06:00:00'
        slotMaxTime='20:00:00'
        allDaySlot={false}
        slotDuration='00:30:00'
        slotLabelInterval='01:00'
        expandRows={true}
        stickyHeaderDates={true}
        nowIndicator={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
          startTime: '08:00',
          endTime: '18:00',
        }}
      />
    </div>
  );
};

export default JobsCalendar;
