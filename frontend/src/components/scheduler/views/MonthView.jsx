import React from "react";

export default function MonthView({ events, onEdit, resources }) {
  // Compact month view implementation for smaller sizes
  return (
    <div className="month-view h-full w-full flex flex-col overflow-hidden">
      <div className="text-center text-lg font-semibold p-2 text-gray-800 border-b border-gray-200 bg-gray-50 flex-shrink-1">
        Month View
      </div>
      <div className="flex-1 overflow-auto p-1">
        <div className="grid grid-cols-7 gap-0.5 h-full">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={`day-${index}`} className="p-1 text-center text-xs font-medium bg-gray-100 text-gray-700 border-b border-gray-200">
              {day}
            </div>
          ))}
          {Array.from({length: 35}, (_, i) => (
            <div key={i} className="p-1 border border-gray-200 relative hover:bg-gray-50 flex flex-col min-h-0">
              <div className="text-xs font-medium text-gray-700 mb-0.5 flex-shrink-1">
                {i + 1}
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                {events.filter(e => {
                  const eventDate = new Date(e.start);
                  const dayDate = new Date(2025, 0, i + 1);
                  return eventDate.toDateString() === dayDate.toDateString();
                }).map(event => (
                  <div 
                    key={event.id} 
                    className="text-xs p-1 mb-0.5 rounded text-white truncate cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    style={{ background: event.color || '#2563eb' }}
                    onClick={() => onEdit && onEdit(event)}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
