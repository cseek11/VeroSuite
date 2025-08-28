import React, { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Card,
  Button,
  Typography,
  Chip,
  Modal,
  ProgressBar
} from '@/components/ui/EnhancedUI';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  Star,
  Camera,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Cloud,
  Thermometer,
  Droplets,
  Wind
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
      case 'prevention': return 'green';
      case 'treatment': return 'orange';
      case 'emergency': return 'red';
      case 'inspection': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green';
      case 'scheduled': return 'blue';
      case 'cancelled': return 'red';
      case 'in_progress': return 'yellow';
      default: return 'gray';
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 8) return 'green';
    if (score >= 6) return 'yellow';
    return 'red';
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
          <Typography variant="h3" className="text-gray-900">
            Service History
          </Typography>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule Next Service
          </Button>
        </div>

        {/* Predictive Analytics Panel */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <Typography variant="h4" className="text-gray-900">
              Predictive Insights
            </Typography>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600">
                Next Service
              </Typography>
              <Typography variant="h4" className="text-blue-900 font-semibold">
                {formatDate(predictiveData.nextServiceRecommended)}
              </Typography>
            </div>
            
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600">
                Pest Pressure
              </Typography>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className={`h-4 w-4 ${
                  predictiveData.pestPressureTrend === 'increasing' ? 'text-red-500' : 'text-green-500'
                }`} />
                <Typography variant="h4" className="text-gray-900 font-semibold capitalize">
                  {predictiveData.pestPressureTrend}
                </Typography>
              </div>
            </div>
            
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600">
                Effectiveness
              </Typography>
              <Typography variant="h4" className="text-green-900 font-semibold">
                {predictiveData.treatmentEffectiveness}%
              </Typography>
            </div>
            
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600">
                Seasonal Risk
              </Typography>
              <Chip
                color={predictiveData.seasonalRisk === 'high' ? 'red' : 
                       predictiveData.seasonalRisk === 'medium' ? 'yellow' : 'green'}
                variant="outline"
                size="sm"
              >
                {predictiveData.seasonalRisk}
              </Chip>
            </div>
          </div>
        </div>

        {/* Service Timeline */}
        <div className="space-y-4">
          {serviceHistory.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h4" className="text-gray-900 mb-2">
                No Service History
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                This customer hasn't had any services yet.
              </Typography>
            </div>
          ) : (
            serviceHistory.map((service, index) => (
              <div
                key={service.id}
                className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                {/* Timeline connector */}
                {index < serviceHistory.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300" />
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
                        <Typography variant="h4" className="text-gray-900">
                          {service.service_type}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {formatDate(service.service_date)} at {formatTime(service.service_date)}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip
                          color={getServiceTypeColor(service.service_type)}
                          variant="outline"
                          size="sm"
                        >
                          {service.service_type}
                        </Chip>
                        <Chip
                          color={getStatusColor(service.status)}
                          variant="outline"
                          size="sm"
                        >
                          {service.status}
                        </Chip>
                      </div>
                    </div>

                    {/* Service metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <Typography variant="body2" className="text-gray-600">
                          ${service.cost.toFixed(2)}
                        </Typography>
                      </div>
                      
                      {service.effectiveness_score && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Typography variant="body2" className="text-gray-600">
                            {service.effectiveness_score}/10
                          </Typography>
                        </div>
                      )}
                      
                      {service.weather_conditions && (
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4 text-gray-400" />
                          <Typography variant="body2" className="text-gray-600">
                            {service.weather_conditions}
                          </Typography>
                        </div>
                      )}
                      
                      {service.temperature && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-400" />
                          <Typography variant="body2" className="text-gray-600">
                            {service.temperature}°F
                          </Typography>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePhotoClick(service.before_photos!, 0);
                            }}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Before ({service.before_photos!.length})
                          </Button>
                        )}
                        {service.after_photos?.length && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePhotoClick(service.after_photos!, 0);
                            }}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            After ({service.after_photos!.length})
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Treatment details */}
                    {service.treatments_applied && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Typography variant="body2" className="text-gray-700">
                          <strong>Treatments Applied:</strong> {service.treatments_applied}
                        </Typography>
                      </div>
                    )}

                    {/* Technician notes preview */}
                    {service.technician_notes && (
                      <div className="mt-2">
                        <Typography variant="body2" className="text-gray-600 line-clamp-2">
                          <strong>Notes:</strong> {service.technician_notes}
                        </Typography>
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
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={`Service Details - ${selectedService?.service_type}`}
        size="lg"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-600">Date</Typography>
                <Typography variant="body1">{formatDate(selectedService.service_date)}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Cost</Typography>
                <Typography variant="body1">${selectedService.cost.toFixed(2)}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Status</Typography>
                <Chip color={getStatusColor(selectedService.status)} size="sm">
                  {selectedService.status}
                </Chip>
              </div>
              {selectedService.effectiveness_score && (
                <div>
                  <Typography variant="body2" className="text-gray-600">Effectiveness</Typography>
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      value={selectedService.effectiveness_score * 10}
                      color={getEffectivenessColor(selectedService.effectiveness_score)}
                      className="flex-1"
                    />
                    <Typography variant="body2">{selectedService.effectiveness_score}/10</Typography>
                  </div>
                </div>
              )}
            </div>

            {selectedService.treatments_applied && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-2">Treatments Applied</Typography>
                <Typography variant="body1">{selectedService.treatments_applied}</Typography>
              </div>
            )}

            {selectedService.technician_notes && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-2">Technician Notes</Typography>
                <Typography variant="body1">{selectedService.technician_notes}</Typography>
              </div>
            )}

            {/* Weather conditions */}
            {(selectedService.weather_conditions || selectedService.temperature || selectedService.humidity) && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-2">Weather Conditions</Typography>
                <div className="flex gap-4">
                  {selectedService.weather_conditions && (
                    <div className="flex items-center gap-1">
                      <Cloud className="h-4 w-4 text-gray-400" />
                      <Typography variant="body2">{selectedService.weather_conditions}</Typography>
                    </div>
                  )}
                  {selectedService.temperature && (
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <Typography variant="body2">{selectedService.temperature}°F</Typography>
                    </div>
                  )}
                  {selectedService.humidity && (
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      <Typography variant="body2">{selectedService.humidity}%</Typography>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Photo Gallery Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Service Photos"
        size="xl"
      >
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
                <Typography variant="body2" className="text-gray-600">
                  Photo {photoIndex + 1} of {selectedPhotos.length}
                </Typography>
              </div>
              
              {/* Thumbnail navigation */}
              {selectedPhotos.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {selectedPhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setPhotoIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === photoIndex ? 'border-blue-500' : 'border-gray-200'
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
      </Modal>
    </>
  );
}






