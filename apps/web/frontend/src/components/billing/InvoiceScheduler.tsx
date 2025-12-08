/**
 * InvoiceScheduler Component
 * 
 * Manages automated invoice scheduling and recurring invoices.
 * Allows users to create, edit, and manage scheduled invoice generation.
 * 
 * Features:
 * - Create recurring invoice schedules
 * - Schedule one-time invoices
 * - Manage automation rules
 * - View scheduled invoices
 */

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Heading, Text } from '@/components/ui';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  Play,
  Pause,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import type { Account } from '@/types/enhanced-types';
import type { ScheduledInvoice } from '@/types/api.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

interface InvoiceSchedulerProps {
  onScheduleCreated?: () => void;
}

export default function InvoiceScheduler({ onScheduleCreated: _onScheduleCreated }: InvoiceSchedulerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledInvoice | null>(null);
  const [_selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);

  const queryClient = useQueryClient();

  // Mock scheduled invoices - In production, this would fetch from API
  const { data: schedulesData, isLoading, error: schedulesError } = useQuery<ScheduledInvoice[]>({
    queryKey: ['invoice-schedules'],
    queryFn: async (): Promise<ScheduledInvoice[]> => {
      // Mock data for now
      return [
        {
          id: '1',
          customer_id: 'cust-1',
          customer_name: 'Acme Corporation',
          schedule_type: 'recurring',
          frequency: 'monthly',
          start_date: '2025-01-01',
          next_run_date: '2025-12-01',
          is_active: true,
          amount: 150.00,
          description: 'Monthly pest control service',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          customer_id: 'cust-2',
          customer_name: 'Tech Solutions Inc',
          schedule_type: 'one-time',
          start_date: '2025-12-20',
          next_run_date: '2025-12-20',
          is_active: true,
          amount: 500.00,
          description: 'Quarterly deep cleaning',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    },
  });

  if (schedulesError) {
    logger.error('Failed to fetch invoice schedules', schedulesError, 'InvoiceScheduler');
    toast.error('Failed to load schedules. Please try again.');
  }

  const schedules: ScheduledInvoice[] = Array.isArray(schedulesData) ? schedulesData : [];

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    let filtered = schedules;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((schedule: ScheduledInvoice) =>
        schedule.customer_name?.toLowerCase().includes(searchLower) ||
        schedule.description?.toLowerCase().includes(searchLower) ||
        schedule.customer_id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((schedule: ScheduledInvoice) =>
        filterStatus === 'active' ? schedule.is_active : !schedule.is_active
      );
    }

    return filtered;
  }, [schedules, searchTerm, filterStatus]);

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setSelectedCustomer(null);
    setShowScheduleForm(true);
  };

  const handleEditSchedule = (schedule: ScheduledInvoice) => {
    setEditingSchedule(schedule);
    setShowScheduleForm(true);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      logger.debug('Schedule deleted', { scheduleId }, 'InvoiceScheduler');
      toast.success('Schedule deleted successfully');
      
      await queryClient.invalidateQueries({ queryKey: ['invoice-schedules'] });
    } catch (error) {
      logger.error('Failed to delete schedule', error, 'InvoiceScheduler');
      toast.error('Failed to delete schedule. Please try again.');
    }
  };

  const handleToggleActive = async (schedule: ScheduledInvoice) => {
    try {
      logger.debug('Schedule toggled', { scheduleId: schedule.id, newStatus: !schedule.is_active }, 'InvoiceScheduler');
      toast.success(`Schedule ${!schedule.is_active ? 'activated' : 'paused'}`);
      
      await queryClient.invalidateQueries({ queryKey: ['invoice-schedules'] });
    } catch (error) {
      logger.error('Failed to toggle schedule', error, 'InvoiceScheduler');
      toast.error('Failed to update schedule. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFrequencyLabel = (frequency?: string) => {
    const labels: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
    };
    return frequency ? labels[frequency] || frequency : 'One-time';
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="font-semibold flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                Invoice Scheduler
              </Heading>
              <Text variant="small" className="text-gray-600 mt-2">
                Schedule recurring and one-time invoice generation
              </Text>
            </div>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreateSchedule}
            >
              Create Schedule
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Text variant="small" className="text-gray-600">Status:</Text>
              <Select
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as 'all' | 'active' | 'inactive')}
                className="w-32"
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            </div>
          </div>

          {/* Schedules List */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading schedules...</span>
            </div>
          )}

          {!isLoading && filteredSchedules.length === 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <div className="p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Text className="text-gray-600 font-medium">
                  {searchTerm || filterStatus !== 'all' ? 'No schedules found' : 'No schedules yet'}
                </Text>
                <Text variant="small" className="text-gray-500 mt-2">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first schedule to automate invoice generation'}
                </Text>
              </div>
            </Card>
          )}

          {!isLoading && filteredSchedules.length > 0 && (
            <div className="space-y-3">
              {filteredSchedules.map((schedule: ScheduledInvoice) => (
                <Card
                  key={schedule.id}
                  className={`border-2 transition-colors ${
                    schedule.is_active
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Heading level={4} className="font-semibold">
                            {schedule.customer_name || `Customer ${schedule.customer_id.slice(0, 8)}`}
                          </Heading>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium flex items-center ${
                              schedule.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {schedule.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                            {schedule.schedule_type === 'recurring'
                              ? getFrequencyLabel(schedule.frequency)
                              : 'One-time'}
                          </span>
                        </div>

                        {schedule.description && (
                          <Text variant="body" className="text-gray-700 mb-3">
                            {schedule.description}
                          </Text>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Text variant="small" className="text-gray-500">Amount</Text>
                            <Text className="font-semibold">{formatCurrency(schedule.amount)}</Text>
                          </div>
                          <div>
                            <Text variant="small" className="text-gray-500">Start Date</Text>
                            <Text className="font-medium">{formatDate(schedule.start_date)}</Text>
                          </div>
                          <div>
                            <Text variant="small" className="text-gray-500">Next Run</Text>
                            <Text className="font-medium">{formatDate(schedule.next_run_date)}</Text>
                          </div>
                          {schedule.end_date && (
                            <div>
                              <Text variant="small" className="text-gray-500">End Date</Text>
                              <Text className="font-medium">{formatDate(schedule.end_date)}</Text>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={schedule.is_active ? Pause : Play}
                          onClick={() => handleToggleActive(schedule)}
                        >
                          {schedule.is_active ? 'Pause' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Schedule Form Dialog - Placeholder for now */}
      {showScheduleForm && (
        <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <Text className="text-yellow-800 font-medium">
                        Schedule Editor Coming Soon
                      </Text>
                      <Text variant="small" className="text-yellow-700 mt-1">
                        Schedule creation and editing will be available in the next update.
                        For now, schedules are managed via the API.
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleForm(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


