import React, { useState } from 'react';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  TodayButton,
} from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';

const mockJobs = [
  { text: 'Job 1', startDate: '2025-08-17T09:00', endDate: '2025-08-17T11:00', technician: 'tech1' },
  { text: 'Job 2', startDate: '2025-08-18T13:00', endDate: '2025-08-18T15:00', technician: 'tech2' },
  { text: 'Job 3', startDate: '2025-08-19T10:00', endDate: '2025-08-19T12:00', technician: 'tech1' },
];

export default function JobsScheduler() {
  const [jobs, setJobs] = useState(mockJobs);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs Scheduler</h1>
      <Scheduler
        dataSource={jobs}
        defaultCurrentView="week"
        defaultCurrentDate="2025-08-18"
        height={600}
      >
        <WeekView startDayHour={8} endDayHour={18} />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
        <TodayButton />
        <Appointments />
        <AppointmentTooltip showCloseButton showOpenButton showDeleteButton />
        <AppointmentForm />
        <DragDropProvider />
      </Scheduler>
    </div>
  );
}
