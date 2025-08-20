import './JobsCalendar.css';
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const mockJobs = [
  {
    id: '1',
    title: 'Pest Control - Office Building',
    start: '2025-01-17T09:00:00',
    end: '2025-01-17T11:00:00',
    technician: 'John Smith',
    status: 'scheduled',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Termite Inspection - Residential',
    start: '2025-01-18T13:00:00',
    end: '2025-01-18T15:00:00',
    technician: 'Sarah Johnson',
    status: 'in-progress',
    color: '#f59e0b',
  },
  {
    id: '3',
    title: 'Rodent Control - Restaurant',
    start: '2025-01-19T10:00:00',
    end: '2025-01-19T12:00:00',
    technician: 'Mike Davis',
    status: 'completed',
    color: '#10b981',
  },
  {
    id: '4',
    title: 'Bed Bug Treatment - Hotel',
    start: '2025-01-20T08:00:00',
    end: '2025-01-20T16:00:00',
    technician: 'Lisa Wilson',
    status: 'scheduled',
    color: '#8b5cf6',
  },
  {
    id: '5',
    title: 'General Pest Control - Warehouse',
    start: '2025-01-21T14:00:00',
    end: '2025-01-21T16:00:00',
    technician: 'Tom Brown',
    status: 'scheduled',
    color: '#ef4444',
  },
  {
    id: '6',
    title: 'All-Day Event - Annual Inspection',
    start: '2025-01-22',
    allDay: true,
    technician: 'Team A',
    status: 'scheduled',
    color: '#06b6d4',
  },
  {
    id: '7',
    title: 'Multi-Day Treatment',
    start: '2025-01-23T08:00:00',
    end: '2025-01-25T17:00:00',
    technician: 'Specialist Team',
    status: 'scheduled',
    color: '#84cc16',
  },
  {
    id: '8',
    title: 'Emergency Call - Bee Removal',
    start: '2025-01-24T14:30:00',
    end: '2025-01-24T16:30:00',
    technician: 'Emergency Team',
    status: 'urgent',
    color: '#dc2626',
  },
];

export default function JobsCalendar() {
  const [events, setEvents] = useState(
    mockJobs.map((job) => ({
      id: job.id,
      title: job.title,
      start: job.start,
      end: job.end,
      allDay: job.allDay || false,
      color: job.color,
      extendedProps: {
        technician: job.technician,
        status: job.status,
      },
    })),
  );

  const handleEventDrop = (info: any) => {
    setEvents(
      events.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.startStr,
              end: info.event.endStr,
            }
          : event,
      ),
    );
  };

  const handleEventResize = (info: any) => {
    setEvents(
      events.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.startStr,
              end: info.event.endStr,
            }
          : event,
      ),
    );
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
        color: '#3b82f6',
        extendedProps: {
          technician: 'Unassigned',
          status: 'scheduled',
        },
      };

      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (window.confirm(`Are you sure you want to delete the job '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      <div className="bg-white rounded-lg shadow p-4 JobsCalendar_div1">
        <div
          style={{
            minHeight: '600px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,listMonth',
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
            height="700px"
            eventTextColor="#ffffff"
            eventDisplay="block"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            slotMinTime="06:00:00"
            slotMaxTime="20:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '08:00',
              endTime: '18:00',
            }}
            nowIndicator={true}
            scrollTime="08:00:00"
            eventConstraint="businessHours"
            eventOverlap={false}
            eventDidMount={(info) => {
              // Add custom styling based on status
              const status = info.event.extendedProps.status;
              if (status === 'urgent') {
                info.el.style.border = '2px solid #dc2626';
                info.el.style.fontWeight = 'bold';
              } else if (status === 'completed') {
                info.el.style.opacity = '0.7';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
