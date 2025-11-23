import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  Calendar as CalendarIcon,
  Clock,
  MapPin,
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
    mutationFn: (_data: {
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
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
        />
      );
    }
    return stars;
  };

  const _getSkillColor = (skill: string) => {
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
          <Heading level={3} className="text-slate-900">
            Smart Scheduler
          </Heading>
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
            <Heading level={4} className="text-slate-900">
              AI Recommendations
            </Heading>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border">
              <Text variant="small" className="text-slate-600 mb-1">
                Optimal Date
              </Text>
              <Heading level={4} className="text-green-900 font-semibold">
                {aiRecommendations.optimalDate}
              </Heading>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <Text variant="small" className="text-slate-600 mb-1">
                Optimal Time
              </Text>
              <Heading level={4} className="text-blue-900 font-semibold">
                {aiRecommendations.optimalTime}
              </Heading>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <Text variant="small" className="text-slate-600 mb-1">
                Duration
              </Text>
              <Heading level={4} className="text-purple-900 font-semibold">
                {aiRecommendations.estimatedDuration} min
              </Heading>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-500" />
              <Text variant="small" className="text-slate-900">
                {aiRecommendations.routeOptimization}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Text variant="small" className="text-slate-900">
                {aiRecommendations.weatherForecast}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <Text variant="small" className="text-slate-900">
                {aiRecommendations.seasonalFactors}
              </Text>
            </div>
          </div>
        </div>

        {/* Available Technicians */}
        <div className="mb-6">
          <Heading level={4} className="text-slate-900 mb-4">
            Available Technicians
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicians.map((tech: Technician) => (
              <div
                key={tech.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTechnician(tech.id);
                  setShowSchedulingModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Heading level={5} className="text-slate-900">
                    {tech.name}
                  </Heading>
                  <div className="flex items-center gap-1">
                    {getTechnicianRating(tech.rating)}
                  </div>
                </div>
                
                                   <div className="flex flex-wrap gap-1 mb-3">
                     {tech.skills.map((skill) => (
                       <Badge
                         key={skill}
                         variant="default"
                       >
                         {skill}
                       </Badge>
                     ))}
                   </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>Available today</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Types */}
        <div>
          <Heading level={4} className="text-slate-900 mb-4">
            Service Types
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceTypes.map((service: ServiceType) => (
              <div
                key={service.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedService(service.id);
                  setShowSchedulingModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Heading level={5} className="text-slate-900">
                    {service.name}
                  </Heading>
                  <Heading level={5} className="text-green-600 font-semibold">
                    ${service.estimatedCost}
                  </Heading>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <Text variant="small" className="text-slate-600">
                    {service.duration} minutes
                  </Text>
                </div>
                
                                 <div className="flex flex-wrap gap-1">
                   {service.requiredSkills.map((skill) => (
                     <Badge
                       key={skill}
                       variant="default"
                     >
                       {skill}
                     </Badge>
                   ))}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Scheduling Dialog */}
      <Dialog open={showSchedulingModal} onOpenChange={(open) => !open && setShowSchedulingModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Service</DialogTitle>
          </DialogHeader>
        <div className="space-y-6">
          {/* Service Type Selection */}
          <div>
            <Text variant="small" className="crm-label !mb-1">
              Service Type
            </Text>
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
            <Text variant="small" className="crm-label !mb-1">
              Date
            </Text>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="crm-input"
            />
          </div>

          {/* Time Selection */}
          <div>
            <Text variant="small" className="crm-label !mb-1">
              Time
            </Text>
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
            <Text variant="small" className="crm-label !mb-1">
              Technician
            </Text>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">AI Insights</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Text variant="small">
                    Optimal weather conditions for {selectedDate}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <Text variant="small">
                    Route optimized - 15% time savings
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <Text variant="small">
                    ${aiRecommendations.costSavings} potential savings with bundle
                  </Text>
                </div>
              </div>
            </div>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
