import { useQuery } from '@tanstack/react-query';
import { routingApi } from '@/lib/api';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Routing() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['routing', 'optimize', date],
    queryFn: () => routingApi.optimize(date),
  });

  const polylines = useMemo(() => {
    if (!Array.isArray(data)) return [] as any[];
    // Since backend returns no coordinates in stops, this is a placeholder; a real implementation would fetch job details to get coords.
    return data.map((route: any, idx: number) => ({
      id: route.technicianId,
      color: ['#ef4444', '#3b82f6', '#10b981'][idx % 3],
      points: route.stops.map((_: any, i: number) => [40.44 + i * 0.01, -79.99 + i * 0.01]),
    }));
  }, [data]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Route Optimization</h1>
      <div className="flex flex-wrap gap-2 items-center">
        <label className="sr-only" htmlFor="date">Date</label>
        <input id="date" type="date" className="border rounded p-2" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => refetch()}>Optimize</button>
      </div>

      {isLoading && <div role="status" aria-live="polite">Optimizing...</div>}
      {isError && <div className="text-red-600" role="alert">{(error as any)?.message || 'Failed to optimize'}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {Array.isArray(data) && data.map((route: any) => (
            <div key={route.technicianId} className="bg-white shadow rounded p-4">
              <div className="font-medium">Technician: {route.technicianId}</div>
              <div className="text-sm text-gray-600">Total Distance: {route.totalDistance} miles • Total Duration: {route.totalDuration} min</div>
              <div className="mt-2 space-y-1">
                {route.stops.map((s: any) => (
                  <div key={s.jobId} className="text-sm text-gray-700">#{s.order} Job {s.jobId} • {s.estimatedArrival}-{s.estimatedDeparture}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-[500px] bg-white shadow rounded overflow-hidden">
          <MapContainer center={[40.44, -79.99]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {polylines.map((r) => (
              <Polyline key={r.id} positions={r.points as any} pathOptions={{ color: r.color }} />
            ))}
            {polylines.flatMap((r) => r.points.map((p: any, idx: number) => (
              <Marker key={`${r.id}-${idx}`} position={p as any}>
                <Popup>Stop {idx + 1}</Popup>
              </Marker>
            )))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
