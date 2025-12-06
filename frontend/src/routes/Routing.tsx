import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { logger } from '@/utils/logger';

// TODO: Implement routing API in enhanced API
// For now, using placeholder functions
const routingApi = {
  optimize: async (_date: string) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('TODO: Implement routing API in enhanced API', {}, 'Routing');
    }
    return [];
  }
};

import { LoadingSpinner } from '@/components/LoadingSpinner';

import {
  Navigation,
  Calendar,
  RefreshCw,
  MapPin,
  Clock,
  Route,
  Car
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Route Optimization
            </h1>
            <p className="text-slate-600 text-sm">
              Optimize technician routes for maximum efficiency and reduced travel time.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <button
            onClick={() => refetch()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Optimize Routes
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner text="Optimizing routes..." />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800">
            {(error as any)?.message || 'Failed to optimize routes'}
          </p>
        </div>
      )}

      {/* Content */}
      {!isLoading && Array.isArray(data) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Route List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Route className="h-4 w-4 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Optimized Routes
              </h2>
            </div>
            
            {data.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6 text-center">
                <Navigation className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No Routes Found
                </h3>
                <p className="text-sm text-slate-600">
                  No routes available for the selected date.
                </p>
              </div>
            ) : (
              data.map((route: any) => (
                <div key={route.technicianId} className="p-4 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Car className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-900">
                      Technician: {route.technicianId}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{route.totalDistance} miles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{route.totalDuration} min</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-700">
                      Stops:
                    </p>
                    {route.stops.map((s: any) => (
                      <div key={s.jobId} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        <div className="flex justify-between">
                          <span>#{s.order} Job {s.jobId}</span>
                          <span className="text-xs text-slate-500">
                            {s.estimatedArrival}-{s.estimatedDeparture}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Map */}
          <div className="w-full h-[500px] border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="p-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">
                Route Map
              </h3>
            </div>
            <MapContainer 
              center={[40.44, -79.99]} 
              zoom={12} 
              style={{ height: 'calc(100% - 60px)', width: '100%' }}
            >
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
      )}
    </div>
  );
}
