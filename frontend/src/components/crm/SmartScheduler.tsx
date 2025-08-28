import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Button,
  Input,
  Typography,
  Chip,
  Modal,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Route,
  Zap
} from 'lucide-react';

interface SmartSchedulerProps {
  customerId: string;
}

interface Technician {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  availability: {
    date: string;
    slots: string[];
  }[];
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  requiredSkills: string[];
  estimatedCost: number;
}

export default function SmartScheduler({ customerId }: SmartSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const technicians: Technician[] = [
    {
      id: 'tech-1',
      name: 'John Smith',
      skills: ['termite', 'ant', 'rodent'],
      rating: 4.8,
      availability: []
    },
    {
      id: 'tech-2',
      name: 'Sarah Johnson',
      skills: ['spider', 'mosquito', 'prevention'],
      rating: 4.9,
      availability: []
    }
  ];

  const serviceTypes: ServiceType[] = [
    {
      id: 'service-1',
      name: 'General Pest Control',
      duration: 90,
      requiredSkills: ['ant', 'spider'],
      estimatedCost: 150
    },
    {
      id: 'service-2',
      name: 'Termite Treatment',
      duration: 120,
      requiredSkills: ['termite'],
      estimatedCost: 300
    },
    {
      id: 'service-3',
      name: 'Rodent Control',
      duration: 60,
      requiredSkills: ['rodent'],
      estimatedCost: 200
    }
  ];

  // Schedule service mutation
  const scheduleService = useMutation({
    mutationFn: (data: {
      customerId: string;
      serviceTypeId: string;
      technicianId: string;
      scheduledDate: string;
      scheduledTime: string;
    }) => {
      // Mock API call
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customerId, 'service-history'] });
      setShowSchedulingModal(false);
    },
  });

  // Mock AI recommendations
  const aiRecommendations = {
    optimalDate: '2024-02-01',
    optimalTime: '09:00',
    recommendedTechnician: 'tech-1',
    routeOptimization: 'Can be combined with nearby jobs',
    weatherForecast: 'Sunny, 75°F - Optimal for outdoor treatments',
    seasonalFactors: 'Peak ant season - Recommend preventive treatment',
    estimatedDuration: 90,
    costSavings: 25
  };

  const getTechnicianRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const getSkillColor = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'termite': return 'red';
      case 'rodent': return 'brown';
      case 'ant': return 'orange';
      case 'spider': return 'purple';
      case 'mosquito': return 'blue';
      default: return 'gray';
    }
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime && selectedService && selectedTechnician) {
      scheduleService.mutate({
        customerId,
        serviceTypeId: selectedService,
        technicianId: selectedTechnician,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
      });
    }
  };

  const availableTimeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h3" className="text-gray-900">
            Smart Scheduler
          </Typography>
          <Button
            variant="primary"
            onClick={() => setShowSchedulingModal(true)}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Schedule Service
          </Button>
        </div>

        {/* AI Recommendations */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-green-600" />
            <Typography variant="h4" className="text-gray-900">
              AI Recommendations
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border">
              <Typography variant="body2" className="text-gray-600 mb-1">
                Optimal Date
              </Typography>
              <Typography variant="h4" className="text-green-900 font-semibold">
                {aiRecommendations.optimalDate}
              </Typography>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <Typography variant="body2" className="text-gray-600 mb-1">
                Optimal Time
              </Typography>
              <Typography variant="h4" className="text-blue-900 font-semibold">
                {aiRecommendations.optimalTime}
              </Typography>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <Typography variant="body2" className="text-gray-600 mb-1">
                Duration
              </Typography>
              <Typography variant="h4" className="text-purple-900 font-semibold">
                {aiRecommendations.estimatedDuration} min
              </Typography>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-500" />
              <Typography variant="body2" className="text-gray-900">
                {aiRecommendations.routeOptimization}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Typography variant="body2" className="text-gray-900">
                {aiRecommendations.weatherForecast}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <Typography variant="body2" className="text-gray-900">
                {aiRecommendations.seasonalFactors}
              </Typography>
            </div>
          </div>
        </div>

        {/* Available Technicians */}
        <div className="mb-6">
          <Typography variant="h4" className="text-gray-900 mb-4">
            Available Technicians
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicians.map((tech: Technician) => (
              <div
                key={tech.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTechnician(tech.id);
                  setShowSchedulingModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="h5" className="text-gray-900">
                    {tech.name}
                  </Typography>
                  <div className="flex items-center gap-1">
                    {getTechnicianRating(tech.rating)}
                  </div>
                </div>
                
                                   <div className="flex flex-wrap gap-1 mb-3">
                     {tech.skills.map((skill) => (
                       <Chip
                         key={skill}
                         variant="default"
                       >
                         {skill}
                       </Chip>
                     ))}
                   </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Available today</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Types */}
        <div>
          <Typography variant="h4" className="text-gray-900 mb-4">
            Service Types
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceTypes.map((service: ServiceType) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedService(service.id);
                  setShowSchedulingModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="h5" className="text-gray-900">
                    {service.name}
                  </Typography>
                  <Typography variant="h5" className="text-green-600 font-semibold">
                    ${service.estimatedCost}
                  </Typography>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Typography variant="body2" className="text-gray-600">
                    {service.duration} minutes
                  </Typography>
                </div>
                
                                 <div className="flex flex-wrap gap-1">
                   {service.requiredSkills.map((skill) => (
                     <Chip
                       key={skill}
                       variant="default"
                     >
                       {skill}
                     </Chip>
                   ))}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Scheduling Modal */}
      <Modal
        isOpen={showSchedulingModal}
        onClose={() => setShowSchedulingModal(false)}
        title="Schedule Service"
        size="lg"
      >
        <div className="space-y-6">
          {/* Service Type Selection */}
          <div>
            <Typography variant="body2" className="crm-label !mb-1">
              Service Type
            </Typography>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="crm-select"
            >
              <option value="">Select service type</option>
              {serviceTypes.map((service: ServiceType) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.estimatedCost}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <Typography variant="body2" className="crm-label !mb-1">
              Date
            </Typography>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="crm-input"
            />
          </div>

          {/* Time Selection */}
          <div>
            <Typography variant="body2" className="crm-label !mb-1">
              Time
            </Typography>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="crm-select"
            >
              <option value="">Select time</option>
              {availableTimeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Technician Selection */}
          <div>
            <Typography variant="body2" className="crm-label !mb-1">
              Technician
            </Typography>
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="crm-select"
            >
              <option value="">Select technician</option>
              {technicians.map((tech: Technician) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.rating}/5 stars
                </option>
              ))}
            </select>
          </div>

          {/* AI Recommendations for selected options */}
          {selectedDate && selectedTime && (
            <Alert type="info" title="AI Insights">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Typography variant="body2">
                    Optimal weather conditions for {selectedDate}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <Typography variant="body2">
                    Route optimized - 15% time savings
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <Typography variant="body2">
                    ${aiRecommendations.costSavings} potential savings with bundle
                  </Typography>
                </div>
              </div>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowSchedulingModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!selectedDate || !selectedTime || !selectedService || !selectedTechnician || scheduleService.isPending}
            >
              {scheduleService.isPending ? 'Scheduling...' : 'Schedule Service'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
