/**
 * Technician Dispatch Card Component
 * 
 * Dashboard card for assigning jobs to technicians via drag-and-drop.
 * Supports dragging technicians and dropping jobs onto technicians.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Users, CheckCircle, AlertCircle, XCircle, MapPin } from 'lucide-react';
import { DropZone, DraggableContent } from '@/routes/dashboard/components';
import { DropZoneConfig, DragPayload, ActionResult } from '@/routes/dashboard/types/cardInteractions.types';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';
import { enhancedApi } from '@/lib/enhanced-api';
import { useQuery } from '@tanstack/react-query';
import { ConflictResolutionDialog } from './ConflictResolutionDialog';
import { useCardDataDragDrop } from '@/routes/dashboard/hooks/useCardDataDragDrop';

interface TechnicianDispatchCardProps {
  cardId?: string;
  className?: string;
}

interface Technician {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'available' | 'busy' | 'offline';
  location?: string;
  rating?: number;
  jobsCompleted?: number;
  specialties?: string[];
  currentJob?: string;
  avatar?: string;
  availabilityStatus?: {
    is_available: boolean;
    reason?: string;
  };
}

interface Assignment {
  id: string;
  jobId: string;
  jobName: string;
  technicianId: string;
  technicianName: string;
  assignedAt: Date;
  status: 'assigned' | 'completed' | 'cancelled';
}

export default function TechnicianDispatchCard({ 
  cardId = 'technician-dispatch',
  className = '' 
}: TechnicianDispatchCardProps): React.ReactElement {
  const { user: _user } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [_isAssigning, setIsAssigning] = useState(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<{ job: Record<string, unknown>; technician: Technician } | null>(null);
  const [conflictData, setConflictData] = useState<{ conflicts: Array<{
    type: 'time_overlap' | 'technician_double_booking' | 'location_conflict';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    conflicting_job_ids: string[];
    conflicting_jobs: Array<{
      id: string;
      scheduled_date: string;
      scheduled_start_time: string;
      scheduled_end_time: string;
      customer_name?: string;
      location_address?: string;
    }>;
  }>; canProceed: boolean } | null>(null);
  const [selectedJobForAvailability, setSelectedJobForAvailability] = useState<Record<string, unknown> | null>(null);

  // Get drag state to detect when a job is being dragged
  const { isDragging, draggingPayload } = useCardDataDragDrop({});

  // Update selected job when dragging a job
  useEffect(() => {
    if (isDragging && draggingPayload?.sourceDataType === 'job' && draggingPayload?.data?.entity) {
      setSelectedJobForAvailability(draggingPayload.data.entity);
    } else if (!isDragging) {
      setSelectedJobForAvailability(null);
    }
  }, [isDragging, draggingPayload]);

  // Fetch availability when a job is selected
  const { data: availableTechnicians } = useQuery({
    queryKey: ['technicians', 'availability', selectedJobForAvailability?.id, selectedJobForAvailability?.scheduled_date, selectedJobForAvailability?.scheduled_start_time, selectedJobForAvailability?.scheduled_end_time],
    queryFn: async () => {
      if (!selectedJobForAvailability || !selectedJobForAvailability.scheduled_date || !selectedJobForAvailability.scheduled_start_time || !selectedJobForAvailability.scheduled_end_time) {
        return undefined;
      }
      try {
        return await enhancedApi.technicians.getAvailable(
          String(selectedJobForAvailability.scheduled_date),
          String(selectedJobForAvailability.scheduled_start_time),
          String(selectedJobForAvailability.scheduled_end_time)
        );
      } catch (error) {
        logger.warn('Failed to fetch technician availability', error as Error);
        return undefined;
      }
    },
    enabled: !!selectedJobForAvailability && !!selectedJobForAvailability.scheduled_date && !!selectedJobForAvailability.scheduled_start_time && !!selectedJobForAvailability.scheduled_end_time
  });

  // Fetch technicians
  const { data: techniciansData = [], isLoading: isLoadingTechnicians } = useQuery({
    queryKey: ['technicians', 'dispatch'],
    queryFn: async () => {
      try {
        // Try technicians API first, then fallback to users API
        let users: any[] = [];
        
        if (enhancedApi.technicians && typeof enhancedApi.technicians.list === 'function') {
          users = await enhancedApi.technicians.list();
        } else if (enhancedApi.users && typeof enhancedApi.users.list === 'function') {
          users = await enhancedApi.users.list();
        } else {
          logger.warn('Technicians API not available, using empty list');
          return [];
        }
        
        return users.map((user: any) => ({
          id: user.id || user.user_id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || user.name || 'Unknown',
          email: user.email,
          phone: user.phone,
          status: user.status || 'available',
          location: user.location || 'Unknown',
          rating: user.rating || 0,
          jobsCompleted: user.jobs_completed || 0,
          specialties: user.specialties || [],
          avatar: user.avatar
        })) as Technician[];
      } catch (error) {
        logger.error('Failed to fetch technicians', error);
        return [];
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  // Handle job assignment with conflict checking
  const handleAssignJob = useCallback(async (job: any, technician: Technician, skipConflictCheck = false): Promise<void> => {
    setIsAssigning(true);
    
    try {
      // Check for conflicts before assigning (unless explicitly skipped)
      if (!skipConflictCheck && job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time) {
        try {
          const conflictResult = await enhancedApi.jobs.checkConflicts(
            technician.id,
            job.scheduled_date,
            job.scheduled_start_time,
            job.scheduled_end_time,
            [job.id] // Exclude current job if rescheduling
          );

          if (conflictResult.has_conflicts) {
            // Show conflict dialog
            setConflictData({
              conflicts: conflictResult.conflicts,
              canProceed: conflictResult.can_proceed
            });
            setPendingAssignment({ job, technician });
            setConflictDialogOpen(true);
            setIsAssigning(false);
            return;
          }
        } catch (error) {
          logger.warn('Failed to check conflicts, proceeding with assignment', { error });
          // Continue with assignment if conflict check fails
        }
      }

      // Proceed with assignment
      const assignmentId = `assignment-${Date.now()}`;
      const newAssignment: Assignment = {
        id: assignmentId,
        jobId: job.id,
        jobName: job.description || job.name || `Job ${job.id}`,
        technicianId: technician.id,
        technicianName: technician.name,
        assignedAt: new Date(),
        status: 'assigned',
      };

      setAssignments(prev => [newAssignment, ...prev]);
      
      // Assign job to technician using jobs API
      await enhancedApi.jobs.update(job.id, {
        technician_id: technician.id,
        status: 'assigned'
      });

      // Update assignment status
      setAssignments(prev => 
        prev.map(a => 
          a.id === assignmentId 
            ? { ...a, status: 'assigned' }
            : a
        )
      );

      logger.info('Job assigned successfully', { 
        jobId: job.id,
        technicianId: technician.id,
        technicianName: technician.name
      });
    } catch (error) {
      logger.error('Failed to assign job', { error, jobId: job.id });
      
      // Show error to user
      if (pendingAssignment) {
        setPendingAssignment(null);
        setConflictDialogOpen(false);
      }
    } finally {
      setIsAssigning(false);
    }
  }, [pendingAssignment]);

  // Handle conflict resolution - proceed with assignment
  const handleConflictProceed = useCallback(() => {
    if (pendingAssignment) {
      setConflictDialogOpen(false);
      handleAssignJob(pendingAssignment.job, pendingAssignment.technician, true);
      setPendingAssignment(null);
      setConflictData(null);
    }
  }, [pendingAssignment, handleAssignJob]);

  // Handle conflict resolution - cancel assignment
  const handleConflictCancel = useCallback(() => {
    setConflictDialogOpen(false);
    setPendingAssignment(null);
    setConflictData(null);
  }, []);

  // Job assignment handler for drag-and-drop (general drop zone)
  const assignJobHandler = useCallback(async (payload: DragPayload, technicianId?: string): Promise<ActionResult> => {
    try {
      if (payload.sourceDataType !== 'job' || !payload.data?.entity) {
        return {
          success: false,
          error: 'Invalid data type. Expected job data.'
        };
      }

      const job = payload.data.entity;
      
      // Set selected job to trigger availability check
      setSelectedJobForAvailability(job);
      
      // If technicianId is provided (dropped on specific technician), use it
      // Otherwise, find first available technician
      let targetTechnician: Technician | undefined;
      
      if (technicianId) {
        targetTechnician = techniciansData.find(t => t.id === technicianId);
        
        // Check availability if job has scheduled time
        if (job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time && targetTechnician) {
          try {
            const available = await enhancedApi.technicians.getAvailable(
              job.scheduled_date,
              job.scheduled_start_time,
              job.scheduled_end_time
            );
            const techAvailability = available.find((t: any) => t.id === technicianId);
            if (techAvailability && !techAvailability.is_available) {
              return {
                success: false,
                error: `${targetTechnician.name} is not available: ${techAvailability.reason || 'Not available at this time'}`
              };
            }
          } catch (error) {
            logger.warn('Failed to check availability, proceeding anyway', error as Error);
          }
        }
      } else {
        // Find first available technician based on availability API if job has scheduled time
        if (job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time) {
          try {
            const available = await enhancedApi.technicians.getAvailable(
              job.scheduled_date,
              job.scheduled_start_time,
              job.scheduled_end_time
            );
            const availableTechIds = available.filter((t: { is_available: boolean; id: string }) => t.is_available).map((t: { id: string }) => t.id);
            targetTechnician = techniciansData.find(t => availableTechIds.includes(t.id)) || techniciansData[0];
          } catch (error) {
            logger.warn('Failed to check availability, using fallback', error as Error);
            targetTechnician = techniciansData.find(t => t.status === 'available') || techniciansData[0];
          }
        } else {
          // Find first available technician, or any technician if none available
          targetTechnician = techniciansData.find(t => t.status === 'available') || techniciansData[0];
        }
      }
      
      if (!targetTechnician) {
        return {
          success: false,
          error: 'No technicians available. Please add technicians first.'
        };
      }

      logger.debug('Assigning job from drag', {
        jobId: job.id,
        technicianId: targetTechnician.id,
        technicianName: targetTechnician.name,
        droppedOnTechnician: !!technicianId
      });

      await handleAssignJob(job, targetTechnician);

      return {
        success: true,
        message: `Job assigned to ${targetTechnician.name}`,
        data: { jobId: job.id, technicianId: targetTechnician.id }
      };
    } catch (error) {
      logger.error('Error assigning job from drag', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign job'
      };
    }
  }, [techniciansData, handleAssignJob]);

  // Drop zone configuration
  const dropZoneConfig: DropZoneConfig = {
    cardId: cardId,
    cardType: 'technician-dispatch',
    accepts: {
      dataTypes: ['job', 'workorder']
    },
    actions: {
      'assign-job': {
        id: 'assign-job',
        label: 'Assign Job',
        icon: '👷',
        description: 'Assign this job to a technician',
        handler: assignJobHandler,
        requiresConfirmation: false
      }
    },
    dropZoneStyle: {
      highlightColor: '#10b981',
      borderStyle: 'dashed',
      borderWidth: 2,
      backgroundColor: 'rgba(16, 185, 129, 0.05)'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'busy':
        return 'text-yellow-600 bg-yellow-50';
      case 'offline':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'busy':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`h-full flex flex-col min-h-[400px] ${className}`} data-card-id={cardId}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Technician Dispatch</h3>
        </div>
        <p className="text-sm text-gray-600">Drag jobs here to assign technicians</p>
      </div>

      {/* Drop Zone */}
      <div className="flex-1 p-4 overflow-auto">
        <DropZone
          cardId={cardId}
          dropZoneConfig={dropZoneConfig}
          onDrop={(payload, result) => {
            if (result.success) {
              logger.info('Job assignment initiated', { 
                jobId: payload.data?.id
              });
            }
          }}
          className="min-h-[200px]"
        >
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-colors">
            <Users className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium mb-1">Drop job here</p>
            <p className="text-sm text-gray-500">to assign to a technician</p>
          </div>

          {/* Technicians List - Each technician can accept job drops */}
          {techniciansData.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Technicians {selectedJobForAvailability && '(Availability checked for selected job)'}
              </h4>
              <div className="space-y-2">
                {techniciansData.map((technician) => {
                  // Get availability status for this technician if job is selected
                  const techAvailability = availableTechnicians?.find((t: { id: string; is_available: boolean; reason?: string }) => t.id === technician.id);
                  const isAvailable = techAvailability ? techAvailability.is_available : undefined;
                  const availabilityReason = techAvailability?.reason;
                  // Create drop zone config for this specific technician
                  const technicianDropZoneConfig: DropZoneConfig = {
                    cardId: `${cardId}-technician-${technician.id}`,
                    cardType: 'technician-dispatch',
                    accepts: {
                      dataTypes: ['job', 'workorder']
                    },
                    actions: {
                      'assign-to-technician': {
                        id: 'assign-to-technician',
                        label: `Assign to ${technician.name}`,
                        icon: '👷',
                        description: `Assign this job to ${technician.name}`,
                        handler: async (payload: DragPayload) => assignJobHandler(payload, technician.id),
                        requiresConfirmation: false
                      }
                    },
                    dropZoneStyle: {
                      highlightColor: '#10b981',
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      backgroundColor: 'rgba(16, 185, 129, 0.05)'
                    }
                  };

                  return (
                    <DropZone
                      key={technician.id}
                      cardId={`${cardId}-technician-${technician.id}`}
                      dropZoneConfig={technicianDropZoneConfig}
                      className="cursor-move"
                    >
                      <DraggableContent
                        cardId={cardId}
                        dataType="technician"
                        data={technician}
                        className="cursor-move"
                      >
                        <div className={`flex items-center justify-between p-3 bg-white border-2 rounded-lg transition-all ${
                          isAvailable === false 
                            ? 'border-red-300 bg-red-50 opacity-75' 
                            : isAvailable === true 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 hover:border-green-400 hover:shadow-md'
                        }`}>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${getStatusColor(technician.status)}`}>
                              {getStatusIcon(technician.status)}
                              <span className="text-xs font-medium capitalize">{technician.status}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {technician.name}
                              </p>
                              {technician.location && (
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <p className="text-xs text-gray-500 truncate">{technician.location}</p>
                                </div>
                              )}
                              {isAvailable === false && availabilityReason && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertCircle className="w-3 h-3 text-red-500" />
                                  <p className="text-xs text-red-600 truncate">{availabilityReason}</p>
                                </div>
                              )}
                              {isAvailable === true && (
                                <div className="flex items-center gap-1 mt-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <p className="text-xs text-green-600">Available for this time slot</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-2">
                            {technician.rating !== undefined && (
                              <div className="text-xs text-gray-600">
                                ⭐ {technician.rating}
                              </div>
                            )}
                            {technician.jobsCompleted !== undefined && (
                              <div className="text-xs text-gray-500">
                                {technician.jobsCompleted} jobs
                              </div>
                            )}
                          </div>
                        </div>
                      </DraggableContent>
                    </DropZone>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assignments List */}
          {assignments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Assignments</h4>
              <div className="space-y-2">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {assignment.jobName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Assigned to {assignment.technicianName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {assignment.assignedAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="ml-2">
                      {assignment.status === 'assigned' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {assignment.status === 'cancelled' && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {techniciansData.length === 0 && !isLoadingTechnicians && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              <p>No technicians available.</p>
            </div>
          )}

          {isLoadingTechnicians && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              <p>Loading technicians...</p>
            </div>
          )}
        </DropZone>
      </div>

      {/* Conflict Resolution Dialog */}
      {conflictData && (
        <ConflictResolutionDialog
          open={conflictDialogOpen}
          conflicts={conflictData.conflicts as Array<{
            type: 'time_overlap' | 'technician_double_booking' | 'location_conflict';
            severity: 'low' | 'medium' | 'high' | 'critical';
            description: string;
            conflicting_job_ids: string[];
            conflicting_jobs: Array<{
              id: string;
              scheduled_date: string;
              scheduled_start_time: string;
              scheduled_end_time: string;
              customer_name?: string;
              location_address?: string;
            }>;
          }>}
          canProceed={conflictData.canProceed}
          onProceed={handleConflictProceed}
          onCancel={handleConflictCancel}
          {...(() => {
            const name = pendingAssignment?.technician.name;
            return name ? { technicianName: name } : {};
          })()}
        />
      )}
    </div>
  );
}

