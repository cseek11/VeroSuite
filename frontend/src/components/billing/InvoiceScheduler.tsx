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

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Heading, Text } from '@/components/ui';
import {
  Calendar,
  Clock,
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
import { billing } from '@/lib/enhanced-api';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import type { Account } from '@/types/enhanced-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

interface ScheduledInvoice {
  id: string;
  customer_id: string;
  customer_name?: string;
  schedule_type: 'recurring' | 'one-time';
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_run_date: string;
  is_active: boolean;
  template_id?: string;
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface InvoiceSchedulerProps {
  onScheduleCreated?: () => void;
}

export default function InvoiceScheduler({ onScheduleCreated }: InvoiceSchedulerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledInvoice | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);

  const queryClient = useQueryClient();

  // Fetch schedules from API
  const { data: schedules = [], isLoading } = useQuery<ScheduledInvoice[]>({    
    queryKey: ['invoice-schedules'],
    queryFn: async () => {
      try {
        const data = await billing.getInvoiceSchedules();
        return data.map(schedule => ({
          id: schedule.id,
          customer_id: schedule.account_id || schedule.customer_id,
          customer_name: schedule.customer_name || schedule.account?.name,
          schedule_type: schedule.schedule_type as 'recurring' | 'one-time',
          frequency: schedule.frequency as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | undefined,
          start_date: schedule.start_date instanceof Date ? schedule.start_date.toISOString().split('T')[0] : schedule.start_date,
          end_date: schedule.end_date ? (schedule.end_date instanceof Date ? schedule.end_date.toISOString().split('T')[0] : schedule.end_date) : undefined,
          next_run_date: schedule.next_run_date instanceof Date ? schedule.next_run_date.toISOString() : schedule.next_run_date,
          is_active: schedule.is_active,
          template_id: schedule.template_id,
          amount: schedule.amount || 0,
          description: schedule.description,
          created_at: schedule.created_at instanceof Date ? schedule.created_at.toISOString() : schedule.created_at,
          updated_at: schedule.updated_at instanceof Date ? schedule.updated_at.toISOString() : schedule.updated_at,
        }));
      } catch (error) {
        logger.error('Failed to fetch invoice schedules', error, 'InvoiceScheduler');
        toast.error('Failed to load schedules. Please try again.');
        return [];
      }
    },
  });

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    let filtered = schedules;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(schedule =>
        schedule.customer_name?.toLowerCase().includes(searchLower) ||
        schedule.description?.toLowerCase().includes(searchLower) ||
        schedule.customer_id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(schedule =>
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

  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      await billing.deleteInvoiceSchedule(scheduleId);
    },
    onSuccess: () => {
      logger.debug('Schedule deleted', {}, 'InvoiceScheduler');
      toast.success('Schedule deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['invoice-schedules'] });
    },
    onError: (error: unknown) => {
      logger.error('Failed to delete schedule', error, 'InvoiceScheduler');
      toast.error('Failed to delete schedule. Please try again.');
    },
  });

  const toggleScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      return await billing.toggleInvoiceSchedule(scheduleId);
    },
    onSuccess: (data) => {
      logger.debug('Schedule toggled', { scheduleId: data.id, newStatus: data.is_active }, 'InvoiceScheduler');
      toast.success(`Schedule ${data.is_active ? 'activated' : 'paused'}`);
      queryClient.invalidateQueries({ queryKey: ['invoice-schedules'] });
    },
    onError: (error: unknown) => {
      logger.error('Failed to toggle schedule', error, 'InvoiceScheduler');
      toast.error('Failed to update schedule. Please try again.');
    },
  });

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }
    deleteScheduleMutation.mutate(scheduleId);
  };

  const handleToggleActive = async (schedule: ScheduledInvoice) => {
    toggleScheduleMutation.mutate(schedule.id);
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
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-32"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
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
              {filteredSchedules.map((schedule) => (
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
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        />
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


