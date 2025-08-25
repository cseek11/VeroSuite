import React from "react";

export default function EventCard({ event, layout = {}, onEdit }) {
  // layout: { col, cols, leftPct, widthPct }
  const style = {};
  if (layout.leftPct != null) { style.left = `${layout.leftPct}%`; style.width = `${layout.widthPct}%`; }
  return (
    <div 
      className="absolute rounded text-white p-1 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-white/20" 
      style={{ 
        top: (new Date(event.start).getHours() + new Date(event.start).getMinutes()/60) * 32, 
        height: Math.max(16, ((new Date(event.end)-new Date(event.start))/60000)/60*32), 
        background: event.color || '#2563eb', 
        ...style 
      }} 
      onDoubleClick={() => onEdit && onEdit(event)}
    >
      <div className="font-medium truncate text-xs">{event.title}</div>
      <div className="text-xs opacity-90 mt-0.5">
        {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </div>
    </div>
  );
}
