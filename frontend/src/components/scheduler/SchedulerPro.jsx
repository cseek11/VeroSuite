import React, { useEffect, useMemo, useRef, useState } from "react";
import WeekView from "./views/WeekView";
import TimelineView from "./views/TimelineView";
import MonthView from "./views/MonthView";
import AgendaView from "./views/AgendaView";
import DayView from "./views/DayView";
import EventEditor from "./EventEditor";
import { expandRecurrence, computeRange } from "../../utils/recurrence";
import { exportCsv, downloadIcs, parseIcs } from "../../utils/export";
import { DataAdapter } from "../../utils/dataAdapter";

import "./styles.css"; // optional: pull styles into project

const DEFAULT_RESOURCES = [
  { id: "unassigned", name: "Unassigned", color: "#9CA3AF" },
  { id: "team-a", name: "Team A", color: "#60A5FA" },
  { id: "team-b", name: "Team B", color: "#34D399" },
  { id: "team-c", name: "Team C", color: "#F59E0B" },
];

export default function SchedulerPro({
  initialView = "month",
  initialDate,
  resources = DEFAULT_RESOURCES,
  dataAdapter,
  timeZone,
  hideToolbar = false,
  view: externalView,
  onViewChange,
}) {
  const [internalView, setInternalView] = useState(initialView);
  const view = externalView !== undefined ? externalView : internalView;
  const setView = onViewChange || setInternalView;
  const [cursor, setCursor] = useState(initialDate ? new Date(initialDate) : new Date());
  const [editing, setEditing] = useState(null);
  const [events, setEvents] = useState(() => {
    try { const raw = localStorage.getItem("scheduler.events"); return raw ? JSON.parse(raw) : [];} catch { return []; }
  });
  const adapterRef = useRef(dataAdapter || new DataAdapter({ source: events }));

  // range compute & loading
  const range = useMemo(() => computeRange(view, cursor, 0), [view, cursor]);
  useEffect(() => { adapterRef.current.source = events; localStorage.setItem("scheduler.events", JSON.stringify(events)); }, [events]);

  // Expanded events (recurrence)
  const expanded = useMemo(() => events.flatMap((e) => expandRecurrence(e, range.start, range.end)), [events, range.start, range.end]);

  // Create/update/delete
  function createEvent(ev) { setEvents(prev => [...prev, ev]); }
  function saveEvent(id, patch) { setEvents(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e)); }
  function removeEvent(id) { setEvents(prev => prev.filter(e => e.id !== id)); setEditing(null); }

  return (
    <div className="scheduler-root h-full w-full flex-basis: 0%; flex flex-col">
      {!hideToolbar && (
        <div className="scheduler-toolbar p-2 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex space-x-1">
          <button 
            onClick={() => setView("day")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              view === "day" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100/10 text-gray-700 hover:bg-gray-200/75"
            }`}
          >
            Day
          </button>
          <button 
            onClick={() => setView("week")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              view === "week" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setView("month")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              view === "month" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setView("timeline")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              view === "timeline" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Timeline
          </button>
        </div>
        
      </div>
      )}

      <div className="scheduler-body flex-1 overflow-hidden bg-transparent">
        {view === "week" && (
          <WeekView
            days={/* compute week days */ Array.from({length:7},(_,i)=>{const d=new Date(cursor); const diff = (i - d.getDay()); d.setDate(d.getDate()+diff); return d;})}
            events={expanded}
            resources={resources}
            onEdit={setEditing}
            onSave={saveEvent}
            onCreate={(d,h,res) => createEvent({ id: crypto.randomUUID(), title: "New", start: new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,0).toISOString(), end: new Date(d.getFullYear(),d.getMonth(),d.getDate(),h+1,0).toISOString(), resourceId: res })}
          />
        )}
        {view === "timeline" && (
          <TimelineView
            days={Array.from({length:14},(_,i)=>{const d=new Date(cursor); d.setDate(d.getDate()+i); return d;})}
            events={expanded}
            resources={resources}
            onEdit={setEditing}
            onMove={(id, patch) => saveEvent(id, patch)}
          />
        )}
        {view === "month" && <MonthView events={expanded} onEdit={setEditing} resources={resources} />}
        {view === "day" && <DayView events={expanded} onEdit={setEditing} resources={resources} />}
      </div>

      <EventEditor event={editing} setEvent={setEditing} saveEvent={(id,patch)=>saveEvent(id,patch)} deleteEvent={removeEvent} resources={resources} timeZone={timeZone} />
    </div>
  );
}
