import React from "react";
import EventCard from "../EventCard";

export default function DayView({ events, onEdit, resources }) {
  const hours = Array.from({length: 24}, (_, i) => i);
  
  return (
    <div className="day-view h-full flex flex-col overflow-hidden">
      <div className="text-center text-lg font-semibold p-2 text-gray-800 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        Day View
      </div>
      <div className="flex-1 overflow-auto">
        <div className="relative border border-gray-200 rounded-lg overflow-hidden" style={{ minHeight: 24 * 40 }}>
          {hours.map(hour => (
            <div key={hour} className="border-b border-gray-200 bg-gray-50" style={{ height: 40 }}>
              <div className="text-xs text-gray-600 p-2 font-medium">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
              </div>
            </div>
          ))}
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={() => onEdit && onEdit(event)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
