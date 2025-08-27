import React, { useRef, useState } from "react";

export default function TimelineView({ days, events, resources, onEdit, onMove, onCreate }) {
  const containerRef = useRef();
  const [dragState, setDragState] = useState(null); // { id, startX, origStartMs, origEndMs }

  function onMouseDown(ev, e) {
    ev.stopPropagation(); 
    ev.preventDefault();
    const rect = ev.currentTarget.getBoundingClientRect();
    setDragState({ 
      id: e.id, 
      startX: ev.clientX, 
      origStartMs: new Date(e.start).getTime(), 
      origEndMs: new Date(e.end).getTime() 
    });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(ev) {
    if (!dragState) return;
    const dx = ev.clientX - dragState.startX; // px
    const dayWidth = 110; // same as view
    const minutesPerPx = (24 * 60) / dayWidth; // (minutes in day) / px per day
    const deltaMinutes = Math.round((dx * minutesPerPx) / 15) * 15;
    const ns = new Date(dragState.origStartMs + deltaMinutes * 60000);
    const ne = new Date(dragState.origEndMs + deltaMinutes * 60000);
    // live-preview: call onMove with ISO patch
    onMove(dragState.id, { start: ns.toISOString(), end: ne.toISOString() });
  }

  function onMouseUp() { 
    setDragState(null); 
    window.removeEventListener("mousemove", onMouseMove); 
    window.removeEventListener("mouseup", onMouseUp); 
  }

  return (
    <div className="timeline-root h-full flex flex-col overflow-hidden">
      <div className="flex border-b border-gray-200">
        <div style={{ width: 200 }} className="border-r border-gray-200 bg-gray-50/50 p-3 font-medium text-gray-700">
          Resource
        </div>
        <div className="flex-1 overflow-x-auto">
          <div style={{ width: days.length * 110 }} className="grid grid-cols-14">
            {days.map((d, i) => (
              <div key={i} className="p-3 border-r border-gray-200 text-center bg-gray-50/50">
                <div className="text-sm font-medium text-gray-700">
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {d.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {resources.map(r => (
          <div key={r.id} className="flex border-b border-gray-200 hover:bg-gray-50/50">
            <div style={{ width: 200 }} className="border-r border-gray-200 p-3 font-medium text-gray-700 bg-gray-50/50">
              {r.name}
            </div>
            <div className="flex-1 overflow-x-auto relative" onDoubleClick={(ev) => onCreate && onCreate(days[0], 8, r.id)}>
              <div style={{ width: days.length * 110, minHeight: 80 }} className="p-2">
                {events.filter(e => e.resourceId === r.id).map(e => {
                  const s = new Date(e.start); 
                  const en = new Date(e.end);
                  const dayIdx = Math.floor((s - days[0]) / (24*60*60*1000));
                  const dayIdxEnd = Math.floor((en - days[0]) / (24*60*60*1000));
                  const left = Math.max(0, dayIdx) * 110 + 4;
                  const width = (Math.max(1, dayIdxEnd - dayIdx + 1)) * 110 - 8;
                  return (
                    <div 
                      key={e.id} 
                      className="absolute top-2 h-8 rounded-lg text-white flex items-center px-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-white/20" 
                      style={{ left, width, background: e.color || r.color }} 
                      onMouseDown={(ev) => onMouseDown(ev, e)} 
                      onDoubleClick={() => onEdit && onEdit(e)}
                    >
                      <div className="truncate font-medium text-sm">
                        {e.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}