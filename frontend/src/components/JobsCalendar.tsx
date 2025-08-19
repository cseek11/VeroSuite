import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const mockJobs = [
  { id: '1', title: 'Pest Control - Office Building', start: '2025-01-17T09:00:00', end: '2025-01-17T11:00:00', technician: 'John Smith', status: 'scheduled' },
  { id: '2', title: 'Termite Inspection - Residential', start: '2025-01-18T13:00:00', end: '2025-01-18T15:00:00', technician: 'Sarah Johnson', status: 'in-progress' },
  { id: '3', title: 'Rodent Control - Restaurant', start: '2025-01-19T10:00:00', end: '2025-01-19T12:00:00', technician: 'Mike Davis', status: 'completed' },
  { id: '4', title: 'Bed Bug Treatment - Hotel', start: '2025-01-20T08:00:00', end: '2025-01-20T16:00:00', technician: 'Lisa Wilson', status: 'scheduled' },
  { id: '5', title: 'General Pest Control - Warehouse', start: '2025-01-21T14:00:00', end: '2025-01-21T16:00:00', technician: 'Tom Brown', status: 'scheduled' },
];

export default function JobsCalendar() {
  const [events, setEvents] = useState(mockJobs.map(job => ({
    id: job.id,
    title: job.title,
    start: job.start,
    end: job.end,
    extendedProps: {
      technician: job.technician,
      status: job.status
    }
  })));

  const handleEventDrop = (info: any) => {
    setEvents(events.map(event => 
      event.id === info.event.id 
        ? { 
            ...event, 
            start: info.event.startStr, 
            end: info.event.endStr 
          } 
        : event
    ));
  };

  const handleEventResize = (info: any) => {
    setEvents(events.map(event => 
      event.id === info.event.id 
        ? { 
            ...event, 
            start: info.event.startStr, 
            end: info.event.endStr 
          } 
        : event
    ));
  };

  const handleDateSelect = (selectInfo: any) => {
    const title = window.prompt('Please enter a name for your job');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const newEvent = {
        id: Date.now().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        extendedProps: {
          technician: 'Unassigned',
          status: 'scheduled'
        }
      };
      
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (window.confirm(`Are you sure you want to delete the job '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      setEvents(events.filter(event => event.id !== clickInfo.event.id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs Calendar</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <div style={{ 
          minHeight: '600px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            height="600px"
            eventColor="#3b82f6"
            eventTextColor="#ffffff"
            eventDisplay="block"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </div>
        
        {/* Debug info to verify component is loading */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <p><strong>Debug:</strong> Calendar component loaded</p>
          <p><strong>Events:</strong> {events.length} jobs loaded</p>
          <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
