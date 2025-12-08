/* eslint-env browser */
/* eslint-disable no-undef */
// Legacy JS export utility - to be migrated to TS
export function exportCsv(events) {
  const header = ["id","title","start","end","resourceId","location","notes","rrule"].join(",");
  const rows = events.map(e => [e.id,e.title,e.start,e.end,e.resourceId||"",e.location||"",(e.notes||"").replace(/\n/g," "),e.rrule||""].map(v=>`"${String(v).replace(/"/g,'""') }"`).join(","));
  const csv = [header,...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `events-${new Date().toISOString().slice(0,10)}.csv`; a.click();
}

export function downloadIcs(events) {
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SchedulerPro//EN", ...events.flatMap(e=>["BEGIN:VEVENT",`UID:${e.id}`,`DTSTAMP:${toICSDate(new Date())}`,`DTSTART:${toICSDate(new Date(e.start))}`,`DTEND:${toICSDate(new Date(e.end))}`,`SUMMARY:${escapeICS(e.title)}`, e.location?`LOCATION:${escapeICS(e.location)}`:null, e.rrule?`RRULE:${e.rrule}`:null, "END:VEVENT" ].filter(Boolean)), "END:VCALENDAR" ].join("\n");
  const blob = new Blob([lines], { type: "text/calendar" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `events-${new Date().toISOString().slice(0,10)}.ics`; a.click();
}
function toICSDate(d) { return d.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"; }
function escapeICS(s) { return String(s||"").replace(/[,;]/g, m => ({",":"\\,",";":"\\;"}[m])); }

export function parseIcs(text) {
  const lines = text.replace(/\r\n/g,"\n").split("\n");
  const out = []; let cur = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") cur = {}; else if (line === "END:VEVENT") { if (cur) { out.push({ id: cur.UID||crypto.randomUUID(), title: cur.SUMMARY||"(no title)", start: parseICSDate(cur.DTSTART), end: parseICSDate(cur.DTEND), rrule: cur.RRULE }); cur=null; } }
    else if (cur) { const [k,...rest]=line.split(":"); cur[k.split(";")[0]] = rest.join(":"); }
  }
  return out;
}
function parseICSDate(val) { if (!val) return new Date().toISOString(); if (val.includes('T')) { const y=val.slice(0,4),mo=val.slice(4,6),d=val.slice(6,8),hh=val.slice(9,11),mm=val.slice(11,13),ss=val.slice(13,15); return new Date(`${y}-${mo}-${d}T${hh}:${mm}:${ss}Z`).toISOString(); } return new Date(`${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}T00:00:00Z`).toISOString(); }




