import React, { useState } from 'react';

const mockJobs = [
  { id: '1', title: 'Pest Control - Office Building', start: '2025-01-17T09:00:00', end: '2025-01-17T11:00:00', technician: 'John Smith', status: 'scheduled' },
  { id: '2', title: 'Termite Inspection - Residential', start: '2025-01-18T13:00:00', end: '2025-01-18T15:00:00', technician: 'Sarah Johnson', status: 'in-progress' },
  { id: '3', title: 'Rodent Control - Restaurant', start: '2025-01-19T10:00:00', end: '2025-01-19T12:00:00', technician: 'Mike Davis', status: 'completed' },
  { id: '4', title: 'Bed Bug Treatment - Hotel', start: '2025-01-20T08:00:00', end: '2025-01-20T16:00:00', technician: 'Lisa Wilson', status: 'scheduled' },
  { id: '5', title: 'General Pest Control - Warehouse', start: '2025-01-21T14:00:00', end: '2025-01-21T16:00:00', technician: 'Tom Brown', status: 'scheduled' },
];

export default function JobsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getJobsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockJobs.filter(job => job.start.startsWith(dateStr));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-200 bg-gray-50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayJobs = getJobsForDate(date);
      
      days.push(
        <div key={day} className="p-2 border border-gray-200 min-h-[100px]">
          <div className="font-semibold text-sm">{day}</div>
          <div className="space-y-1 mt-1">
            {dayJobs.map(job => (
              <div key={job.id} className="text-xs p-1 bg-blue-100 rounded truncate" title={job.title}>
                {job.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 font-semibold text-center bg-gray-100 border border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayJobs = getJobsForDate(date);
      
      weekDays.push(
        <div key={i} className="border border-gray-200 p-2 min-h-[200px]">
          <div className="font-semibold text-sm mb-2">{formatDate(date)}</div>
          <div className="space-y-1">
            {dayJobs.map(job => (
              <div key={job.id} className="text-xs p-2 bg-blue-100 rounded border-l-4 border-blue-500">
                <div className="font-medium">{job.title}</div>
                <div className="text-gray-600">
                  {new Date(job.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(job.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-gray-500">{job.technician}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="space-y-3">
        {mockJobs.map(job => (
          <div key={job.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-600">
                  {new Date(job.start).toLocaleDateString()} - {new Date(job.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(job.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-gray-500">Technician: {job.technician}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs Calendar</h1>
      
      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setView('month')} 
              className={`px-3 py-1 rounded ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('week')} 
              className={`px-3 py-1 rounded ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('list')} 
              className={`px-3 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              List
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => changeMonth('prev')} 
              className="px-3 py-1 bg-gray-200 rounded"
            >
              ←
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => changeMonth('next')} 
              className="px-3 py-1 bg-gray-200 rounded"
            >
              →
            </button>
          </div>
        </div>
        
        {/* Calendar View */}
        <div className="bg-white rounded-lg">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'list' && renderListView()}
        </div>
      </div>
      
      {/* Debug Info */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Calendar Info:</h3>
        <p>Total Jobs: {mockJobs.length}</p>
        <p>Current View: {view}</p>
        <p>Current Date: {currentDate.toLocaleDateString()}</p>
        <p>Component rendered at: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
