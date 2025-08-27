import React, { useMemo } from "react";
import EventCard from "../EventCard";
import { computeConflictLayout } from "../../../utils/eventHelpers";

export default function WeekView({ days, events, resources, onEdit, onSave, onCreate }) {
  // events are pre-expanded
  const groupsByDay = useMemo(() => {
    const map = new Map();
    days.forEach(d => map.set(+new Date(d).setHours(0,0,0,0), []));
    for (const e of events) {
      const key = +new Date(new Date(e.start).setHours(0,0,0,0));
      if (map.has(key)) map.get(key).push(e);
    }
    // compute layouts
    const layout = {};
    for (const [k, list] of map.entries()) {
      layout[k] = computeConflictLayout(list);
    }
    return { map, layout };
  }, [days, events]);

  return (
    <div className="grid grid-cols-8 h-full overflow-auto">
      <div className="col-span-1 bg-gray-50/50 border-r border-gray-200">
        <div className="p-2 border-b border-gray-200 bg-gray-100/50 font-medium text-gray-700 text-xs">Time</div>
        {Array.from({length: 24}, (_, i) => (
          <div key={i} className="p-1 text-xs text-gray-500 border-b border-gray-100" style={{ height: 32 }}>
            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
          </div>
        ))}
      </div>
      {days.map((d, i) => (
        <div key={i} className="col-span-1 border-r border-gray-200">
          <div className="p-2 border-b border-gray-200 bg-gray-50/50 font-medium text-gray-700 text-center">
            <div className="text-xs">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className="text-sm font-bold">{d.getDate()}</div>
          </div>
          <div className="relative" style={{ minHeight: 24 * 32 }}>
            { (groupsByDay.map?.[+new Date(d).setHours(0,0,0,0)] || groupsByDay.map?.get(+new Date(d).setHours(0,0,0,0)) || []).map(item => (
              <EventCard key={item.e.id} event={item.e} layout={item.layout} onEdit={() => onEdit(item.e)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
