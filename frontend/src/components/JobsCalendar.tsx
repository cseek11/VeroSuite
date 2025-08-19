import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const mockJobs = [
  { id: '1', title: 'Job 1', start: new Date(2025, 7, 17, 9, 0), end: new Date(2025, 7, 17, 11, 0), technician: 'tech1' },
  { id: '2', title: 'Job 2', start: new Date(2025, 7, 18, 13, 0), end: new Date(2025, 7, 18, 15, 0), technician: 'tech2' },
  { id: '3', title: 'Job 3', start: new Date(2025, 7, 19, 10, 0), end: new Date(2025, 7, 19, 12, 0), technician: 'tech1' }
];

export default function JobsCalendar() {
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleSelectEvent = (event: any) => {
    setSelectedJob(event);
  };

  // Drag-and-drop and assignment logic can be expanded here

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs Calendar</h1>
      <Calendar
        localizer={localizer}
        events={jobs}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
      {selectedJob && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">{selectedJob.title}</h2>
          <p>Technician: {selectedJob.technician}</p>
          <p>Start: {selectedJob.start.toString()}</p>
          <p>End: {selectedJob.end.toString()}</p>
          <button className="bg-gray-400 text-white px-4 py-2 rounded mt-2" onClick={() => setSelectedJob(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
