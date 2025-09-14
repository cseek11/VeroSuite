import React, { useState, useEffect, useMemo } from 'react';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useJobs, useJobsByTechnician } from '@/hooks/useJobs';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { TechnicianProfile, TechnicianStatus } from '@/types/technician';
import { Job, JobStatus } from '@/types/jobs';
import { WorkOrder } from '@/types/work-orders';
import { 
  User, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Filter,
  Search,
  Star,
  Award,
  Shield,
  Car,
  Navigation,
  Timer,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';

interface TechnicianAssignmentInterfaceProps {
  workOrder?: WorkOrder;
  selectedDate?: string;
  selectedTimeSlot?: { start: string; end: string };
  onTechnicianSelect?: (technician: TechnicianProfile) => void;
  onAssignmentComplete?: (assignment: AssignmentResult) => void;
  mode?: 'work-order' | 'job' | 'bulk';
}

interface AssignmentResult {
  technician: TechnicianProfile;
  workOrder?: WorkOrder;
  scheduledDate: string;
  timeSlot: { start: string; end: string };
  conflicts: ConflictInfo[];
  availability: AvailabilityInfo;
}

interface ConflictInfo {
  type: 'time' | 'location' | 'skill' | 'workload';
  severity: 'low' | 'medium' | 'high';
  message: string;
  conflictingJob?: Job;
}

interface AvailabilityInfo {
  isAvailable: boolean;
  currentWorkload: number;
  maxWorkload: number;
  skills: string[];
  certifications: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedTravelTime: number; // in minutes
}

interface TechnicianWithAvailability extends TechnicianProfile {
  availability: AvailabilityInfo;
  conflicts: ConflictInfo[];
  score: number; // Overall assignment score
}

export default function TechnicianAssignmentInterface({
  workOrder,
  selectedDate,
  selectedTimeSlot,
  onTechnicianSelect,
  onAssignmentComplete,
  mode = 'work-order'
}: TechnicianAssignmentInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TechnicianStatus | ''>('');
  const [sortBy, setSortBy] = useState<'score' | 'workload' | 'distance' | 'name'>('score');
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianProfile | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const { data: techniciansData, isLoading: techniciansLoading } = useTechnicians({
    status: filterStatus || undefined,
    limit: 50
  });

  // Get jobs for all technicians to check availability
  const technicians = techniciansData?.technicians || [];

  // Calculate availability and conflicts for each technician
  const techniciansWithAvailability = useMemo((): TechnicianWithAvailability[] => {
    if (!technicians.length || !selectedDate || !selectedTimeSlot) {
      return technicians.map(tech => ({
        ...tech,
        availability: {
          isAvailable: false,
          currentWorkload: 0,
          maxWorkload: 8, // 8 hours default
          skills: [],
          certifications: [],
          location: { lat: 0, lng: 0, address: '' },
          estimatedTravelTime: 0
        },
        conflicts: [],
        score: 0
      }));
    }

    return technicians.map(technician => {
      const availability = calculateAvailability(technician, selectedDate, selectedTimeSlot);
      const conflicts = detectConflicts(technician, selectedDate, selectedTimeSlot, workOrder);
      const score = calculateAssignmentScore(technician, availability, conflicts);

      return {
        ...technician,
        availability,
        conflicts,
        score
      };
    });
  }, [technicians, selectedDate, selectedTimeSlot, workOrder]);

  // Filter and sort technicians
  const filteredAndSortedTechnicians = useMemo(() => {
    let filtered = techniciansWithAvailability;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.user?.first_name?.toLowerCase().includes(searchLower) ||
        tech.user?.last_name?.toLowerCase().includes(searchLower) ||
        tech.user?.email?.toLowerCase().includes(searchLower) ||
        tech.position?.toLowerCase().includes(searchLower) ||
        tech.department?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(tech => tech.status === filterStatus);
    }

    // Sort technicians
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'workload':
          return a.availability.currentWorkload - b.availability.currentWorkload;
        case 'distance':
          return a.availability.estimatedTravelTime - b.availability.estimatedTravelTime;
        case 'name':
          return `${a.user?.first_name} ${a.user?.last_name}`.localeCompare(
            `${b.user?.first_name} ${b.user?.last_name}`
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [techniciansWithAvailability, searchTerm, filterStatus, sortBy]);

  // Calculate technician availability
  const calculateAvailability = (
    technician: TechnicianProfile,
    date: string,
    timeSlot: { start: string; end: string }
  ): AvailabilityInfo => {
    // Mock implementation - in real app, this would check actual schedules
    const isAvailable = technician.status === TechnicianStatus.ACTIVE;
    const currentWorkload = Math.floor(Math.random() * 6) + 2; // 2-8 hours
    const maxWorkload = 8;
    
    const skills = ['General Pest Control', 'Termite Treatment', 'Rodent Control'];
    const certifications = ['Pesticide License', 'Safety Certification'];
    
    const location = {
      lat: 40.4406 + (Math.random() - 0.5) * 0.1,
      lng: -79.9959 + (Math.random() - 0.5) * 0.1,
      address: 'Pittsburgh, PA'
    };
    
    const estimatedTravelTime = Math.floor(Math.random() * 30) + 10; // 10-40 minutes

    return {
      isAvailable,
      currentWorkload,
      maxWorkload,
      skills,
      certifications,
      location,
      estimatedTravelTime
    };
  };

  // Detect conflicts for technician assignment
  const detectConflicts = (
    technician: TechnicianProfile,
    date: string,
    timeSlot: { start: string; end: string },
    workOrder?: WorkOrder
  ): ConflictInfo[] => {
    const conflicts: ConflictInfo[] = [];

    // Check if technician is available
    if (technician.status !== TechnicianStatus.ACTIVE) {
      conflicts.push({
        type: 'time',
        severity: 'high',
        message: 'Technician is not active'
      });
    }

    // Check workload
    const availability = calculateAvailability(technician, date, timeSlot);
    if (availability.currentWorkload >= availability.maxWorkload) {
      conflicts.push({
        type: 'workload',
        severity: 'high',
        message: 'Technician is at maximum workload'
      });
    } else if (availability.currentWorkload >= availability.maxWorkload * 0.8) {
      conflicts.push({
        type: 'workload',
        severity: 'medium',
        message: 'Technician has high workload'
      });
    }

    // Check skills match
    if (workOrder?.service_type) {
      const hasRequiredSkill = availability.skills.some(skill =>
        skill.toLowerCase().includes(workOrder.service_type!.toLowerCase())
      );
      
      if (!hasRequiredSkill) {
        conflicts.push({
          type: 'skill',
          severity: 'medium',
          message: `Technician may not have required skills for ${workOrder.service_type}`
        });
      }
    }

    // Check travel time
    if (availability.estimatedTravelTime > 45) {
      conflicts.push({
        type: 'location',
        severity: 'low',
        message: `Long travel time: ${availability.estimatedTravelTime} minutes`
      });
    }

    return conflicts;
  };

  // Calculate assignment score
  const calculateAssignmentScore = (
    technician: TechnicianProfile,
    availability: AvailabilityInfo,
    conflicts: ConflictInfo[]
  ): number => {
    let score = 100;

    // Deduct points for conflicts
    conflicts.forEach(conflict => {
      switch (conflict.severity) {
        case 'high':
          score -= 30;
          break;
        case 'medium':
          score -= 15;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // Bonus for low workload
    const workloadRatio = availability.currentWorkload / availability.maxWorkload;
    if (workloadRatio < 0.5) {
      score += 10;
    } else if (workloadRatio < 0.8) {
      score += 5;
    }

    // Bonus for short travel time
    if (availability.estimatedTravelTime < 20) {
      score += 10;
    } else if (availability.estimatedTravelTime < 30) {
      score += 5;
    }

    // Bonus for active status
    if (technician.status === TechnicianStatus.ACTIVE) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  };

  // Handle technician selection
  const handleTechnicianSelect = (technician: TechnicianProfile) => {
    setSelectedTechnician(technician);
    setShowAssignmentDialog(true);
  };

  // Handle assignment completion
  const handleAssignmentComplete = () => {
    if (!selectedTechnician || !selectedDate || !selectedTimeSlot) return;

    const technicianWithAvailability = techniciansWithAvailability.find(
      t => t.id === selectedTechnician.id
    );

    if (technicianWithAvailability) {
      const assignment: AssignmentResult = {
        technician: selectedTechnician,
        workOrder,
        scheduledDate: selectedDate,
        timeSlot: selectedTimeSlot,
        conflicts: technicianWithAvailability.conflicts,
        availability: technicianWithAvailability.availability
      };

      onAssignmentComplete?.(assignment);
      setShowAssignmentDialog(false);
      setSelectedTechnician(null);
      setAssignmentNotes('');
    }
  };

  // Get conflict severity color
  const getConflictColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (techniciansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading technicians..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Technician Assignment</h2>
          <p className="text-gray-600">Select the best technician for this assignment</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredAndSortedTechnicians.length} technician(s) available
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TechnicianStatus | '')}
              className="crm-input"
            >
              <option value="">All Statuses</option>
              <option value={TechnicianStatus.ACTIVE}>Active</option>
              <option value={TechnicianStatus.INACTIVE}>Inactive</option>
              <option value={TechnicianStatus.ON_LEAVE}>On Leave</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="crm-input"
            >
              <option value="score">Best Match</option>
              <option value="workload">Lowest Workload</option>
              <option value="distance">Closest Distance</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTechnicians.map((technician) => (
          <Card key={technician.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-purple-600">
                    {technician.user?.first_name?.[0]}{technician.user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {technician.user?.first_name} {technician.user?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{technician.position}</p>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(technician.score)}`}>
                {technician.score}%
              </div>
            </div>

            {/* Availability Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Workload:</span>
                <span className="font-medium">
                  {technician.availability.currentWorkload}h / {technician.availability.maxWorkload}h
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ 
                      width: `${(technician.availability.currentWorkload / technician.availability.maxWorkload) * 100}%` 
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Navigation className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Travel Time:</span>
                <span className="font-medium">{technician.availability.estimatedTravelTime} min</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Skills:</span>
                <span className="font-medium">{technician.availability.skills.length}</span>
              </div>
            </div>

            {/* Conflicts */}
            {technician.conflicts.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Conflicts:</h4>
                <div className="space-y-1">
                  {technician.conflicts.slice(0, 2).map((conflict, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 rounded text-xs ${getConflictColor(conflict.severity)}`}
                    >
                      {conflict.message}
                    </div>
                  ))}
                  {technician.conflicts.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{technician.conflicts.length - 2} more conflicts
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {technician.availability.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {technician.availability.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{technician.availability.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 mb-4">
              {technician.user?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3 w-3" />
                  {technician.user.phone}
                </div>
              )}
              {technician.user?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3 w-3" />
                  {technician.user.email}
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => handleTechnicianSelect(technician)}
              variant="primary"
              className="w-full"
              disabled={!technician.availability.isAvailable}
            >
              {technician.availability.isAvailable ? 'Assign' : 'Not Available'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Assignment Dialog */}
      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Technician Assignment</DialogTitle>
            <DialogDescription>
              Review the assignment details before confirming
            </DialogDescription>
          </DialogHeader>
          
          {selectedTechnician && (
            <div className="space-y-6">
              {/* Technician Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xl font-medium text-purple-600">
                    {selectedTechnician.user?.first_name?.[0]}{selectedTechnician.user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTechnician.user?.first_name} {selectedTechnician.user?.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedTechnician.position}</p>
                  <p className="text-sm text-gray-500">{selectedTechnician.department}</p>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <p className="text-sm text-gray-900">{selectedDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <p className="text-sm text-gray-900">
                    {selectedTimeSlot?.start} - {selectedTimeSlot?.end}
                  </p>
                </div>
              </div>

              {/* Work Order Info */}
              {workOrder && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Order</label>
                  <p className="text-sm text-gray-900">{workOrder.description}</p>
                  <p className="text-sm text-gray-500">Customer: {workOrder.account?.name}</p>
                </div>
              )}

              {/* Assignment Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  rows={3}
                  className="crm-textarea"
                  placeholder="Add any special instructions or notes for this assignment..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignmentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssignmentComplete}
            >
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}






