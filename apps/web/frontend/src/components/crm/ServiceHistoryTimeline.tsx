import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Heading,
  Text,
} from '@/components/ui';
import {
  Calendar,
  DollarSign,
  Star,
  Camera,
  TrendingUp,
  Cloud,
  Thermometer,
  Droplets
} from 'lucide-react';

interface ServiceHistory {
  id: string;
  service_date: string;
  service_type: string;
  treatments_applied?: string;
  technician_id?: string;
  technician_notes?: string;
  before_photos?: string[];
  after_photos?: string[];
  cost: number;
  status: string;
  effectiveness_score?: number;
  weather_conditions?: string;
  temperature?: number;
  humidity?: number;
}

interface ServiceHistoryTimelineProps {
  serviceHistory: ServiceHistory[];
  isLoading: boolean;
}

export default function ServiceHistoryTimeline({ serviceHistory, isLoading }: ServiceHistoryTimelineProps) {
  const [selectedService, setSelectedService] = useState<ServiceHistory | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (isLoading) {
    return (
      <Card className="p-6">
        <LoadingSpinner text="Loading service history..." />
      </Card>
    );
  }

  const getServiceTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'prevention': return 'bg-green-100 text-green-800';
      case 'treatment': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePhotoClick = (photos: string[], startIndex: number = 0) => {
    setSelectedPhotos(photos);
    setPhotoIndex(startIndex);
    setShowPhotoModal(true);
  };

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  // Mock predictive analytics data
  const predictiveData = {
    nextServiceRecommended: '2024-02-15',
    pestPressureTrend: 'increasing',
    treatmentEffectiveness: 85,
    seasonalRisk: 'medium'
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-slate-900">
            Service History
          </Heading>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule Next Service
          </Button>
        </div>

        {/* Predictive Analytics Panel */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <Heading level={4} className="text-slate-900">
              Predictive Insights
            </Heading>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Text variant="small" className="text-slate-600">
                Next Service
              </Text>
              <Heading level={4} className="text-blue-900 font-semibold">
                {formatDate(predictiveData.nextServiceRecommended)}
              </Heading>
            </div>
            
            <div className="text-center">
              <Text variant="small" className="text-slate-600">
                Pest Pressure
              </Text>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className={`h-4 w-4 ${
                  predictiveData.pestPressureTrend === 'increasing' ? 'text-red-500' : 'text-green-500'
                }`} />
                <Heading level={4} className="text-slate-900 font-semibold capitalize">
                  {predictiveData.pestPressureTrend}
                </Heading>
              </div>
            </div>
            
            <div className="text-center">
              <Text variant="small" className="text-slate-600">
                Effectiveness
              </Text>
              <Heading level={4} className="text-green-900 font-semibold">
                {predictiveData.treatmentEffectiveness}%
              </Heading>
            </div>
            
            <div className="text-center">
              <Text variant="small" className="text-slate-600">
                Seasonal Risk
              </Text>
              <Badge
                variant="outline"
                className={
                  predictiveData.seasonalRisk === 'high' ? 'bg-red-100 text-red-800 border-red-300' : 
                  predictiveData.seasonalRisk === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                  'bg-green-100 text-green-800 border-green-300'
                }
              >
                {predictiveData.seasonalRisk}
              </Badge>
            </div>
          </div>
        </div>

        {/* Service Timeline */}
        <div className="space-y-4">
          {serviceHistory.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <Heading level={4} className="text-slate-900 mb-2">
                No Service History
              </Heading>
              <Text variant="body" className="text-slate-600">
                This customer hasn't had any services yet.
              </Text>
            </div>
          ) : (
            serviceHistory.map((service, index) => (
              <div
                key={service.id}
                className="relative border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                {/* Timeline connector */}
                {index < serviceHistory.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-300" />
                )}

                <div className="flex gap-4">
                  {/* Date indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>

                  {/* Service details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Heading level={4} className="text-slate-900">
                          {service.service_type}
                        </Heading>
                        <Text variant="small" className="text-slate-600">
                          {formatDate(service.service_date)} at {formatTime(service.service_date)}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getServiceTypeColor(service.service_type)}
                        >
                          {service.service_type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getStatusColor(service.status)}
                        >
                          {service.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Service metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <Text variant="small" className="text-slate-600">
                          ${service.cost.toFixed(2)}
                        </Text>
                      </div>
                      
                      {service.effectiveness_score && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Text variant="small" className="text-slate-600">
                            {service.effectiveness_score}/10
                          </Text>
                        </div>
                      )}
                      
                      {service.weather_conditions && (
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4 text-slate-400" />
                          <Text variant="small" className="text-slate-600">
                            {service.weather_conditions}
                          </Text>
                        </div>
                      )}
                      
                      {service.temperature && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-400" />
                          <Text variant="small" className="text-slate-600">
                            {service.temperature}°F
                          </Text>
                        </div>
                      )}
                    </div>

                    {/* Photos */}
                    {(service.before_photos?.length || service.after_photos?.length) && (
                      <div className="flex gap-2 mb-3">
                        {service.before_photos?.length && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePhotoClick(service.before_photos!, 0)}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Before ({service.before_photos!.length})
                          </Button>
                        )}
                        {service.after_photos?.length && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePhotoClick(service.after_photos!, 0)}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            After ({service.after_photos!.length})
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Treatment details */}
                    {service.treatments_applied && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <Text variant="small" className="text-slate-700">
                          <strong>Treatments Applied:</strong> {service.treatments_applied}
                        </Text>
                      </div>
                    )}

                    {/* Technician notes preview */}
                    {service.technician_notes && (
                      <div className="mt-2">
                        <Text variant="small" className="text-slate-600 line-clamp-2">
                          <strong>Notes:</strong> {service.technician_notes}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{`Service Details - ${selectedService?.service_type}`}</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="small" className="text-slate-600">Date</Text>
                  <Text variant="body">{formatDate(selectedService.service_date)}</Text>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Cost</Text>
                  <Text variant="body">${selectedService.cost.toFixed(2)}</Text>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Status</Text>
                  <Badge variant="default" className={getStatusColor(selectedService.status)}>
                    {selectedService.status}
                  </Badge>
                </div>
                {selectedService.effectiveness_score && (
                  <div>
                    <Text variant="small" className="text-slate-600">Effectiveness</Text>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 flex-1">
                        <div
                          className={`h-2 rounded-full ${getEffectivenessColor(selectedService.effectiveness_score)}`}
                          style={{ width: `${selectedService.effectiveness_score * 10}%` }}
                        />
                      </div>
                      <Text variant="small">{selectedService.effectiveness_score}/10</Text>
                    </div>
                  </div>
                )}
              </div>

              {selectedService.treatments_applied && (
                <div>
                  <Text variant="small" className="text-slate-600 mb-2">Treatments Applied</Text>
                  <Text variant="body">{selectedService.treatments_applied}</Text>
                </div>
              )}

              {selectedService.technician_notes && (
                <div>
                  <Text variant="small" className="text-slate-600 mb-2">Technician Notes</Text>
                  <Text variant="body">{selectedService.technician_notes}</Text>
                </div>
              )}

              {/* Weather conditions */}
              {(selectedService.weather_conditions || selectedService.temperature || selectedService.humidity) && (
                <div>
                  <Text variant="small" className="text-slate-600 mb-2">Weather Conditions</Text>
                  <div className="flex gap-4">
                    {selectedService.weather_conditions && (
                      <div className="flex items-center gap-1">
                        <Cloud className="h-4 w-4 text-slate-400" />
                        <Text variant="small">{selectedService.weather_conditions}</Text>
                      </div>
                    )}
                    {selectedService.temperature && (
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-red-400" />
                        <Text variant="small">{selectedService.temperature}°F</Text>
                      </div>
                    )}
                    {selectedService.humidity && (
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-400" />
                        <Text variant="small">{selectedService.humidity}%</Text>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Gallery Modal */}
      <Dialog open={showPhotoModal} onOpenChange={(open) => !open && setShowPhotoModal(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Service Photos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPhotos.length > 0 && (
              <>
                <div className="relative">
                  <img
                    src={selectedPhotos[photoIndex]}
                    alt={`Service photo ${photoIndex + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {selectedPhotos.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      >
                        ←
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        →
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="text-center">
                  <Text variant="small" className="text-slate-600">
                    Photo {photoIndex + 1} of {selectedPhotos.length}
                  </Text>
                </div>
              
              {/* Thumbnail navigation */}
              {selectedPhotos.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {selectedPhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setPhotoIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === photoIndex ? 'border-blue-500' : 'border-slate-200'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        </DialogContent>
      </Dialog>
    </>
  );
}







