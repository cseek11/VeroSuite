import React from "react";

export default function AgendaView({ events, onEdit, resources }) {
  const sortedEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));
  
  return (
    <div className="agenda-view p-4">
      <div className="text-center text-lg font-semibold mb-4">Agenda View</div>
      <div className="space-y-2">
        {sortedEvents.map(event => (
          <div 
            key={event.id} 
            className="p-3 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => onEdit && onEdit(event)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(event.start).toLocaleDateString()} - {new Date(event.start).toLocaleTimeString()}
                </div>
              </div>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: event.color || '#2563eb' }}
              />
            </div>
          </div>
        ))}
        {sortedEvents.length === 0 && (
          <div className="text-center text-gray-500 py-8">No events scheduled</div>
        )}
      </div>
    </div>
  );
}


