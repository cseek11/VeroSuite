import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { routingApi } from '@/lib/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Typography,
  Button,
  Card,
  Input,
  Alert
} from '@/components/ui/EnhancedUI';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-gray-900">
          Route Optimization
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-2">
          Optimize technician routes for maximum efficiency and reduced travel time.
        </Typography>
      </div>

      {/* Controls */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <Input
              type="date"
              value={date}
              onChange={(value) => setDate(value)}
              className="w-full md:w-auto"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Optimize Routes
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner text="Optimizing routes..." />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Alert type="danger" className="mb-6">
          <Typography variant="body2">
            {(error as any)?.message || 'Failed to optimize routes'}
          </Typography>
        </Alert>
      )}

      {/* Content */}
      {!isLoading && Array.isArray(data) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Route className="h-5 w-5 text-green-500" />
              <Typography variant="h6" className="text-gray-900">
                Optimized Routes
              </Typography>
            </div>
            
            {data.length === 0 ? (
              <Card className="p-8 text-center">
                <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-900 mb-2">
                  No Routes Found
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  No routes available for the selected date.
                </Typography>
              </Card>
            ) : (
              data.map((route: any) => (
                <Card key={route.technicianId} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <Car className="h-5 w-5 text-blue-500" />
                    <Typography variant="h6" className="text-gray-900">
                      Technician: {route.technicianId}
                    </Typography>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{route.totalDistance} miles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{route.totalDuration} min</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Typography variant="body2" className="font-medium text-gray-700">
                      Stops:
                    </Typography>
                    {route.stops.map((s: any) => (
                      <div key={s.jobId} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <div className="flex justify-between">
                          <span>#{s.order} Job {s.jobId}</span>
                          <span className="text-xs text-gray-500">
                            {s.estimatedArrival}-{s.estimatedDeparture}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Map */}
          <div className="w-full h-[600px] bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <Typography variant="h6" className="text-gray-900">
                Route Map
              </Typography>
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
