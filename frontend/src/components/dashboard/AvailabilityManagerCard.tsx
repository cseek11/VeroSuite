/**
 * Availability Manager Card Component
 * 
 * Dashboard card for managing technician availability.
 * Shows list of technicians and allows setting availability patterns.
 */

import React, { useState } from 'react';
import { Calendar, Users, Clock, ChevronRight, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TechnicianAvailabilityCalendar } from '../scheduling/TechnicianAvailabilityCalendar';
import Button from '@/components/ui/Button';

interface AvailabilityManagerCardProps {
  cardId?: string;
  className?: string;
}

interface Technician {
  id: string;
  name: string;
  email?: string;
  status?: string;
}

export default function AvailabilityManagerCard({
  cardId = 'availability-manager',
  className = ''
}: AvailabilityManagerCardProps): React.ReactElement {
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  // Fetch technicians
  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ['technicians', 'availability-manager'],
    queryFn: async () => {
      try {
        if (enhancedApi.technicians && typeof enhancedApi.technicians.list === 'function') {
          return await enhancedApi.technicians.list();
        } else if (enhancedApi.users && typeof enhancedApi.users.list === 'function') {
          const users = await enhancedApi.users.list();
          return users.filter((u: any) => u.roles?.includes('technician'));
        }
        return [];
      } catch (error) {
        logger.error('Failed to fetch technicians', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const handleTechnicianSelect = (technician: any) => {
    setSelectedTechnician({
      id: technician.id || technician.user_id,
      name: `${technician.first_name || ''} ${technician.last_name || ''}`.trim() || technician.email || technician.name || 'Unknown',
      email: technician.email,
      status: technician.status
    });
  };

  const handleCloseCalendar = () => {
    setSelectedTechnician(null);
  };

  if (selectedTechnician) {
    return (
      <div className={`h-full flex flex-col min-h-[400px] ${className}`} data-card-id={cardId}>
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Manage Availability</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCloseCalendar}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Setting availability for {selectedTechnician.name}
          </p>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <TechnicianAvailabilityCalendar
            technicianId={selectedTechnician.id}
            technicianName={selectedTechnician.name}
            onClose={handleCloseCalendar}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col min-h-[400px] ${className}`} data-card-id={cardId}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Availability Manager</h3>
        </div>
        <p className="text-sm text-gray-600">Manage technician availability schedules</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="Loading technicians..." />
          </div>
        ) : technicians.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No technicians found</p>
            <p className="text-sm text-gray-500 mt-1">
              Add technicians to manage their availability
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Technicians</h4>
            {technicians.map((technician: any) => {
              const techId = technician.id || technician.user_id;
              const techName = `${technician.first_name || ''} ${technician.last_name || ''}`.trim() || technician.email || technician.name || 'Unknown';
              
              return (
                <div
                  key={techId}
                  onClick={() => handleTechnicianSelect(technician)}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {techName}
                      </p>
                      {technician.email && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {technician.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">About Availability</p>
              <p className="text-xs text-blue-700 mt-1">
                Set recurring weekly availability patterns for each technician. These patterns determine when technicians are available for job assignments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






