import React, { useEffect, useState } from "react";

export default function EventEditor({ event, setEvent, saveEvent, deleteEvent, resources = [], timeZone }) {
  const [form, setForm] = useState(event || null);
  useEffect(() => setForm(event || null), [event]);
  if (!form) return null;
  function patch(p) { setForm(f => ({ ...f, ...p })); }
  function onSave() { saveEvent(form.id, form); setEvent(null); }
  return (
    <div className="fixed inset-0 grid place-items-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEvent(null)} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="mb-4 text-xl font-semibold text-gray-900">Edit Event</div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input 
              value={form.title} 
              onChange={e=>patch({title:e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="Enter event title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input 
                type="datetime-local" 
                value={form.start ? new Date(form.start).toISOString().slice(0,16) : ''} 
                onChange={e=>patch({start:new Date(e.target.value).toISOString()})} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input 
                type="datetime-local" 
                value={form.end ? new Date(form.end).toISOString().slice(0,16) : ''} 
                onChange={e=>patch({end:new Date(e.target.value).toISOString()})} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" 
            onClick={() => setEvent(null)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
