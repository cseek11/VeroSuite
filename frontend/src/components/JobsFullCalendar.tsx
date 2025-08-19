import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const mockJobs = [
  { id: '1', title: 'Pest Control - Office Building', start: '2025-01-17T09:00:00', end: '2025-01-17T11:00:00', technician: 'John Smith', status: 'scheduled' },
  { id: '2', title: 'Termite Inspection - Residential', start: '2025-01-18T13:00:00', end: '2025-01-18T15:00:00', technician: 'Sarah Johnson', status: 'in-progress' },
  { id: '3', title: 'Rodent Control - Restaurant', start: '2025-01-19T10:00:00', end: '2025-01-19T12:00:00', technician: 'Mike Davis', status: 'completed' },
];

export default function JobsCalendar() {
  const [events, setEvents] = useState(mockJobs.map(j => ({ 
    id: j.id, 
    title: j.title, 
    start: j.start, 
    end: j.end,
    extendedProps: {
      technician: j.technician,
      status: j.status
    }
  })));
  const [isLoaded, setIsLoaded] = useState(false);
  const [calendarError, setCalendarError] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    console.log('JobsCalendar component mounted, events:', events);
  }, []);

  if (!isLoaded) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Jobs Calendar</h1>
        <div className="bg-white rounded-lg shadow p-4">
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Simple fallback calendar display
  const renderSimpleCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Jobs List View</h3>
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-gray-600">
                {new Date(event.start).toLocaleDateString()} - {new Date(event.start).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-500">
                Technician: {event.extendedProps.technician} | Status: {event.extendedProps.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs Calendar</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="mb-4 text-gray-600">Calendar should appear below:</p>
        
        {calendarError ? (
          renderSimpleCalendar()
        ) : (
          <div style={{ minHeight: '400px', border: '1px solid #ccc', padding: '10px' }}>
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
              dayMaxEvents={true}
              weekends={true}
              events={events}
              height="auto"
              eventColor="#3b82f6"
              eventTextColor="#ffffff"
            />
          </div>
        )}
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>Events loaded: {events.length}</p>
          <p>Component rendered at: {new Date().toLocaleTimeString()}</p>
          <p>FullCalendar plugins loaded: {dayGridPlugin ? 'Yes' : 'No'}</p>
          <p>Calendar error: {calendarError ? 'Yes' : 'No'}</p>
          <button 
            onClick={() => setCalendarError(!calendarError)} 
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Toggle Calendar View
          </button>
        </div>
      </div>
    </div>
  );
}
