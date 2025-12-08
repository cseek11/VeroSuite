import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui';
import {
  Lightbulb,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';

interface OptimizationSuggestion {
  type: 'workload_balancing' | 'time_slot_optimization' | 'conflict_resolution' | 'utilization_improvement';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: string;
  actionItems: string[];
  affectedTechnicians?: string[];
  affectedJobs?: string[];
}

interface OptimizationSuggestionsProps {
  startDate?: Date;
  endDate?: Date;
}

export default function OptimizationSuggestions({
  startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
  endDate = new Date()
}: OptimizationSuggestionsProps) {
  const [dateRangeStart] = useState(startDate.toISOString().split('T')[0]);
  const [dateRangeEnd] = useState(endDate.toISOString().split('T')[0]);

  // Fetch data and generate suggestions
  const { data: suggestions, isLoading, refetch } = useQuery({
    queryKey: ['optimization-suggestions', dateRangeStart, dateRangeEnd],
    queryFn: async () => {
      if (!dateRangeStart || !dateRangeEnd) return [];
      const jobs = await enhancedApi.jobs.getByDateRange(dateRangeStart, dateRangeEnd);
      const technicians = await enhancedApi.technicians.list();

      const suggestionsList: OptimizationSuggestion[] = [];

      // Calculate utilization per technician
      const technicianUtilization = technicians.map((tech: any) => {
        const techJobs = jobs.filter((j: any) => j.technician_id === (tech.id || tech.user_id));
        const scheduledHours = techJobs.reduce((sum: number, j: any) => {
          if (!j.scheduled_start_time || !j.scheduled_end_time) return sum;
          const start = new Date(`${j.scheduled_date}T${j.scheduled_start_time}`);
          const end = new Date(`${j.scheduled_date}T${j.scheduled_end_time}`);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0);
        const daysInRange = Math.ceil((new Date(dateRangeEnd).getTime() - new Date(dateRangeStart).getTime()) / (1000 * 60 * 60 * 24));
        const availableHours = daysInRange * 8;
        const utilizationRate = availableHours > 0 ? (scheduledHours / availableHours) * 100 : 0;

        return {
          technicianId: tech.id || tech.user_id,
          technicianName: `${tech.first_name} ${tech.last_name}`,
          utilizationRate: Math.min(100, utilizationRate),
          jobCount: techJobs.length
        };
      });

      // Workload balancing suggestions
      const sortedUtilization = [...technicianUtilization].sort((a, b) => b.utilizationRate - a.utilizationRate);
      const highUtilization = sortedUtilization.filter(t => t.utilizationRate > 85);
      const lowUtilization = sortedUtilization.filter(t => t.utilizationRate < 50);

      if (highUtilization.length > 0 && lowUtilization.length > 0) {
        suggestionsList.push({
          type: 'workload_balancing',
          priority: 'high',
          title: 'Workload Imbalance Detected',
          description: `Some technicians are overloaded while others are underutilized. Consider redistributing jobs to balance workload.`,
          impact: `Redistributing ${highUtilization[0]?.jobCount ?? 0} jobs from ${highUtilization[0]?.technicianName ?? 'technician'} could improve overall efficiency.`,
          actionItems: [
            `Move jobs from ${highUtilization[0]?.technicianName ?? 'technician'} (${highUtilization[0]?.utilizationRate.toFixed(1) ?? '0'}% utilization)`,
            `Assign jobs to ${lowUtilization[0]?.technicianName ?? 'technician'} (${lowUtilization[0]?.utilizationRate.toFixed(1) ?? '0'}% utilization)`,
            'Review job priorities and technician skills before reassigning'
          ],
          affectedTechnicians: [
            ...highUtilization.map(t => t.technicianName),
            ...lowUtilization.map(t => t.technicianName)
          ]
        });
      }

      // Utilization improvement suggestions
      const overallUtilization = technicianUtilization.reduce((sum, t) => sum + t.utilizationRate, 0) / technicianUtilization.length;
      if (overallUtilization < 60) {
        suggestionsList.push({
          type: 'utilization_improvement',
          priority: 'medium',
          title: 'Low Overall Utilization',
          description: `Average technician utilization is ${overallUtilization.toFixed(1)}%, indicating potential capacity for additional jobs.`,
          impact: 'Increasing utilization could allow for more jobs to be scheduled without hiring additional technicians.',
          actionItems: [
            'Review upcoming scheduled jobs and customer requests',
            'Consider offering additional time slots to customers',
            'Evaluate if current scheduling practices are maximizing capacity'
          ]
        });
      }

      // Time slot optimization
      const jobsByHour: { [hour: number]: number } = {};
      jobs.forEach((job: any) => {
        if (job.scheduled_start_time) {
          const hour = parseInt(job.scheduled_start_time.split(':')[0]);
          jobsByHour[hour] = (jobsByHour[hour] || 0) + 1;
        }
      });

      const peakHours = Object.entries(jobsByHour)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));

      const offPeakHours = Object.entries(jobsByHour)
        .filter(([hour]) => !peakHours.includes(parseInt(hour)))
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));

      if (peakHours.length > 0 && offPeakHours.length > 0) {
        suggestionsList.push({
          type: 'time_slot_optimization',
          priority: 'medium',
          title: 'Peak Hour Concentration',
          description: `Most jobs are scheduled during peak hours (${peakHours.map(h => `${h}:00`).join(', ')}), while off-peak hours have fewer jobs.`,
          impact: 'Distributing jobs more evenly could reduce scheduling conflicts and improve technician availability.',
          actionItems: [
            `Consider offering incentives for off-peak scheduling (${offPeakHours.map(h => `${h}:00`).join(', ')})`,
            'Review customer preferences and availability',
            'Adjust pricing or promotions to encourage off-peak bookings'
          ]
        });
      }

      // Conflict detection suggestions
      const unassignedJobs = jobs.filter((j: any) => !j.technician_id && j.status === 'scheduled');
      if (unassignedJobs.length > 0) {
        suggestionsList.push({
          type: 'conflict_resolution',
          priority: 'high',
          title: 'Unassigned Scheduled Jobs',
          description: `${unassignedJobs.length} job(s) are scheduled but not yet assigned to technicians.`,
          impact: 'Unassigned jobs may lead to missed appointments or last-minute scrambling.',
          actionItems: [
            `Assign ${unassignedJobs.length} unassigned job(s) to available technicians`,
            'Review technician availability and skills',
            'Consider using bulk assignment tools for efficiency'
          ],
          affectedJobs: unassignedJobs.map((j: any) => j.id).slice(0, 5)
        });
      }

      return suggestionsList.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'workload_balancing': return Users;
      case 'time_slot_optimization': return Clock;
      case 'conflict_resolution': return AlertTriangle;
      case 'utilization_improvement': return TrendingUp;
      default: return Lightbulb;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Analyzing scheduling patterns...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Optimization Suggestions
          </Heading>
          <Text className="text-gray-600 mt-1">
            AI-powered recommendations to improve scheduling efficiency
          </Text>
        </div>
        <Button variant="outline" onClick={() => refetch()} icon={RefreshCw}>
          Refresh Analysis
        </Button>
      </div>

      {/* Suggestions List */}
      {!suggestions || suggestions.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <Heading level={3} className="font-semibold text-gray-900 mb-2">
              No Optimization Needed
            </Heading>
            <Text className="text-gray-600">
              Your scheduling appears to be well-optimized. Continue monitoring for future improvements.
            </Text>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => {
            const Icon = getSuggestionIcon(suggestion.type);
            return (
              <Card key={index} className={`border-l-4 ${getPriorityColor(suggestion.priority).split(' ')[2]}`}>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Heading level={4} className="font-semibold">
                            {suggestion.title}
                          </Heading>
                          <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority} priority
                          </span>
                        </div>
                      </div>
                      <Text className="text-gray-700 mb-3">
                        {suggestion.description}
                      </Text>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <Text className="text-sm font-medium text-blue-900 mb-1">Impact:</Text>
                        <Text className="text-sm text-blue-800">{suggestion.impact}</Text>
                      </div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium text-gray-700">Recommended Actions:</Text>
                        <ul className="list-disc list-inside space-y-1">
                          {suggestion.actionItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-sm text-gray-600">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {suggestion.affectedTechnicians && suggestion.affectedTechnicians.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <Text className="text-xs text-gray-500">
                            Affected: {suggestion.affectedTechnicians.join(', ')}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}





