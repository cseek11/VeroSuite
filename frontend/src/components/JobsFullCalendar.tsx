import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


const mockJobs = [
  { id: '1', title: 'Job 1', date: '2025-08-17' },
  { id: '2', title: 'Job 2', date: '2025-08-18' },
  { id: '3', title: 'Job 3', date: '2025-08-19' },
];

export default function JobsFullCalendar() {
  const [events, setEvents] = useState(mockJobs.map(j => ({ id: j.id, title: j.title, start: j.date })));
  const calendarRef = useRef(null);

  const handleEventDrop = (info: any) => {
    setEvents(events.map(e => e.id === info.event.id ? { ...e, start: info.event.startStr } : e));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs FullCalendar</h1>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        events={events}
        eventDrop={handleEventDrop}
        height={600}
      />
    </div>
  );
}
