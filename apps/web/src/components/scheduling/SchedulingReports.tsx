import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  Calendar,
  Loader2,
  Filter,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { useDialog } from '@/hooks/useDialog';

interface SchedulingReportsProps {
  startDate?: Date;
  endDate?: Date;
}

type ReportType = 'utilization' | 'performance' | 'efficiency';

type SchedulingReportData = {
  utilization: any[];
  performance: any[];
  efficiency: {
    totalJobs: number;
    completedJobs: number;
    scheduledJobs: number;
    averageJobDuration: number;
    overallUtilization: number;
    onTimeCompletionRate: number;
  } | null;
};

export default function SchedulingReports({
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate = new Date()
}: SchedulingReportsProps) {
  const { showAlert, DialogComponents } = useDialog();
  const [reportType, setReportType] = useState<ReportType>('utilization');
  const [dateRangeStart, setDateRangeStart] = useState(
    startDate.toISOString().split('T')[0]
  );
  const [dateRangeEnd, setDateRangeEnd] = useState(
    endDate.toISOString().split('T')[0]
  );

  // Fetch report data
  const { data: reportData, isLoading } = useQuery<SchedulingReportData>({
    queryKey: ['scheduling-reports', reportType, dateRangeStart, dateRangeEnd],
    queryFn: async () => {
      if (!dateRangeStart || !dateRangeEnd) {
        return {
          utilization: [],
          performance: [],
          efficiency: null,
        };
      }
      const jobs = await enhancedApi.jobs.getByDateRange(dateRangeStart, dateRangeEnd);
      const technicians = await enhancedApi.technicians.list();

      // Calculate utilization report data
      const utilizationReport = technicians.map((tech: any) => {
        const techJobs = jobs.filter((j: any) => j.technician_id === (tech.id || tech.user_id));
        const completedJobs = techJobs.filter((j: any) => j.status === 'completed');
        
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
          scheduledHours: Math.round(scheduledHours * 10) / 10,
          availableHours: Math.round(availableHours * 10) / 10,
          jobsCompleted: completedJobs.length,
          jobsScheduled: techJobs.length
        };
      });

      // Calculate performance report data
      const performanceReport = technicians.map((tech: any) => {
        const techJobs = jobs.filter((j: any) => j.technician_id === (tech.id || tech.user_id));
        const completedJobs = techJobs.filter((j: any) => j.status === 'completed');
        
        const onTimeJobs = completedJobs.filter((j: any) => {
          if (!j.actual_end_time || !j.scheduled_end_time) return false;
          const actualEnd = new Date(j.actual_end_time);
          const scheduledEnd = new Date(`${j.scheduled_date}T${j.scheduled_end_time}`);
          return actualEnd <= scheduledEnd;
        });

        const jobsWithDuration = completedJobs.filter((j: any) => 
          j.actual_start_time && j.actual_end_time
        );
        const totalDuration = jobsWithDuration.reduce((sum: number, j: any) => {
          const start = new Date(j.actual_start_time);
          const end = new Date(j.actual_end_time);
          return sum + (end.getTime() - start.getTime());
        }, 0);
        const avgDuration = jobsWithDuration.length > 0 
          ? totalDuration / jobsWithDuration.length / (1000 * 60)
          : 0;

        return {
          technicianId: tech.id || tech.user_id,
          technicianName: `${tech.first_name} ${tech.last_name}`,
          totalJobs: techJobs.length,
          completedJobs: completedJobs.length,
          onTimeJobs: onTimeJobs.length,
          onTimeRate: completedJobs.length > 0 ? (onTimeJobs.length / completedJobs.length) * 100 : 0,
          averageDuration: Math.round(avgDuration),
          completionRate: techJobs.length > 0 ? (completedJobs.length / techJobs.length) * 100 : 0
        };
      });

      // Calculate efficiency report data
      const efficiencyReport = {
        totalJobs: jobs.length,
        completedJobs: jobs.filter((j: any) => j.status === 'completed').length,
        scheduledJobs: jobs.filter((j: any) => j.status === 'scheduled' || j.status === 'in_progress').length,
        averageJobDuration: (() => {
          const jobsWithDuration = jobs.filter((j: any) => 
            j.actual_start_time && j.actual_end_time
          );
          const totalDuration = jobsWithDuration.reduce((sum: number, j: any) => {
            const start = new Date(j.actual_start_time);
            const end = new Date(j.actual_end_time);
            return sum + (end.getTime() - start.getTime());
          }, 0);
          return jobsWithDuration.length > 0 
            ? totalDuration / jobsWithDuration.length / (1000 * 60)
            : 0;
        })(),
        overallUtilization: (() => {
          const totalScheduledHours = utilizationReport.reduce((sum, u) => sum + u.scheduledHours, 0);
          const totalAvailableHours = utilizationReport.reduce((sum, u) => sum + u.availableHours, 0);
          return totalAvailableHours > 0 ? (totalScheduledHours / totalAvailableHours) * 100 : 0;
        })(),
        onTimeCompletionRate: (() => {
          const completedJobs = jobs.filter((j: any) => j.status === 'completed');
          const onTimeJobs = completedJobs.filter((j: any) => {
            if (!j.actual_end_time || !j.scheduled_end_time) return false;
            const actualEnd = new Date(j.actual_end_time);
            const scheduledEnd = new Date(`${j.scheduled_date}T${j.scheduled_end_time}`);
            return actualEnd <= scheduledEnd;
          });
          return completedJobs.length > 0 ? (onTimeJobs.length / completedJobs.length) * 100 : 0;
        })()
      };

      return {
        utilization: utilizationReport.sort((a, b) => b.utilizationRate - a.utilizationRate),
        performance: performanceReport.sort((a, b) => b.completionRate - a.completionRate),
        efficiency: efficiencyReport
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleExportCSV = () => {
    if (!reportData) return;

    let csvContent = '';
    const headers: string[] = [];
    const rows: any[] = [];

    if (reportType === 'utilization' && reportData.utilization) {
      headers.push('Technician', 'Utilization Rate (%)', 'Scheduled Hours', 'Available Hours', 'Jobs Completed', 'Jobs Scheduled');
      reportData.utilization.forEach((row: any) => {
        rows.push([
          row.technicianName,
          row.utilizationRate.toFixed(1),
          row.scheduledHours.toFixed(1),
          row.availableHours.toFixed(1),
          row.jobsCompleted,
          row.jobsScheduled
        ]);
      });
    } else if (reportType === 'performance' && reportData.performance) {
      headers.push('Technician', 'Total Jobs', 'Completed Jobs', 'On-Time Jobs', 'On-Time Rate (%)', 'Avg Duration (min)', 'Completion Rate (%)');
      reportData.performance.forEach((row: any) => {
        rows.push([
          row.technicianName,
          row.totalJobs,
          row.completedJobs,
          row.onTimeJobs,
          row.onTimeRate.toFixed(1),
          row.averageDuration,
          row.completionRate.toFixed(1)
        ]);
      });
    } else if (reportType === 'efficiency' && reportData.efficiency) {
      headers.push('Metric', 'Value');
      rows.push(['Total Jobs', reportData.efficiency.totalJobs]);
      rows.push(['Completed Jobs', reportData.efficiency.completedJobs]);
      rows.push(['Scheduled Jobs', reportData.efficiency.scheduledJobs]);
      rows.push(['Average Job Duration (min)', Math.round(reportData.efficiency.averageJobDuration)]);
      rows.push(['Overall Utilization (%)', reportData.efficiency.overallUtilization.toFixed(1)]);
      rows.push(['On-Time Completion Rate (%)', reportData.efficiency.onTimeCompletionRate.toFixed(1)]);
    }

    csvContent = headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheduling-${reportType}-report-${dateRangeStart}-${dateRangeEnd}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    // TODO: Implement PDF export using a library like jsPDF or pdfmake
    logger.info('PDF export not yet implemented', { reportType }, 'SchedulingReports');
    try {
      await showAlert({
        title: 'Coming Soon',
        message: 'PDF export coming soon!',
        type: 'info',
      });
    } catch (error) {
      logger.error('Failed to show PDF export alert', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <DialogComponents />
        <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Generating report...</span>
      </div>
      </>
    );
  }

  return (
    <>
      <DialogComponents />
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Scheduling Reports
          </Heading>
          <Text className="text-gray-600 mt-1">
            Generate detailed reports on scheduling performance
          </Text>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportCSV} icon={FileSpreadsheet}>
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF} icon={FileDown}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Text className="text-sm font-medium">Report Type:</Text>
            </div>
            <div className="flex space-x-2">
              {(['utilization', 'performance', 'efficiency'] as ReportType[]).map((type) => (
                <Button
                  key={type}
                  variant={reportType === type ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setReportType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Date Range Filter */}
      <Card>
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Text className="text-sm font-medium">Date Range:</Text>
            </div>
            <Input
              type="date"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
              className="w-40"
            />
            <Text className="text-gray-500">to</Text>
            <Input
              type="date"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Report Content */}
      <Card>
        <div className="p-6">
          {reportType === 'utilization' && reportData?.utilization && (
            <div>
              <Heading level={3} className="font-semibold mb-4">
                Utilization Report
              </Heading>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Technician</th>
                      <th className="text-right p-2">Utilization Rate</th>
                      <th className="text-right p-2">Scheduled Hours</th>
                      <th className="text-right p-2">Available Hours</th>
                      <th className="text-right p-2">Jobs Completed</th>
                      <th className="text-right p-2">Jobs Scheduled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.utilization.map((row: any) => (
                      <tr key={row.technicianId} className="border-b">
                        <td className="p-2">{row.technicianName}</td>
                        <td className="text-right p-2">{row.utilizationRate.toFixed(1)}%</td>
                        <td className="text-right p-2">{row.scheduledHours.toFixed(1)}</td>
                        <td className="text-right p-2">{row.availableHours.toFixed(1)}</td>
                        <td className="text-right p-2">{row.jobsCompleted}</td>
                        <td className="text-right p-2">{row.jobsScheduled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'performance' && reportData?.performance && (
            <div>
              <Heading level={3} className="font-semibold mb-4">
                Performance Report
              </Heading>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Technician</th>
                      <th className="text-right p-2">Total Jobs</th>
                      <th className="text-right p-2">Completed</th>
                      <th className="text-right p-2">On-Time</th>
                      <th className="text-right p-2">On-Time Rate</th>
                      <th className="text-right p-2">Avg Duration</th>
                      <th className="text-right p-2">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.performance.map((row: any) => (
                      <tr key={row.technicianId} className="border-b">
                        <td className="p-2">{row.technicianName}</td>
                        <td className="text-right p-2">{row.totalJobs}</td>
                        <td className="text-right p-2">{row.completedJobs}</td>
                        <td className="text-right p-2">{row.onTimeJobs}</td>
                        <td className="text-right p-2">{row.onTimeRate.toFixed(1)}%</td>
                        <td className="text-right p-2">{row.averageDuration} min</td>
                        <td className="text-right p-2">{row.completionRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'efficiency' && reportData?.efficiency && (
            <div>
              <Heading level={3} className="font-semibold mb-4">
                Efficiency Report
              </Heading>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Total Jobs</Text>
                    <Text className="font-semibold">{reportData.efficiency.totalJobs}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Completed Jobs</Text>
                    <Text className="font-semibold">{reportData.efficiency.completedJobs}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Scheduled Jobs</Text>
                    <Text className="font-semibold">{reportData.efficiency.scheduledJobs}</Text>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Average Job Duration</Text>
                    <Text className="font-semibold">
                      {Math.round(reportData.efficiency.averageJobDuration)} min
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Overall Utilization</Text>
                    <Text className="font-semibold">
                      {reportData.efficiency.overallUtilization.toFixed(1)}%
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-gray-600">On-Time Completion Rate</Text>
                    <Text className="font-semibold">
                      {reportData.efficiency.onTimeCompletionRate.toFixed(1)}%
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
    </>
  );
}

