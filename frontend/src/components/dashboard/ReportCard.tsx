/**
 * Report Card Component
 * 
 * Dashboard card for generating reports by dragging customers onto it.
 * Supports drag-and-drop interactions with Customer Search Card.
 */

import React, { useState, useCallback } from 'react';
import { FileText, Download, Eye, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { DropZone } from '@/routes/dashboard/components';
import { DropZoneConfig, DragPayload, ActionResult } from '@/routes/dashboard/types/cardInteractions.types';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

interface ReportCardProps {
  cardId?: string;
  className?: string;
}

interface GeneratedReport {
  id: string;
  type: string;
  customerId?: string;
  customerName?: string;
  status: 'generating' | 'completed' | 'error';
  createdAt: Date;
  downloadUrl?: string;
}

// Available report types for customer reports
const customerReportTypes = [
  { id: 'customer-summary', name: 'Customer Summary', description: 'Complete customer information and history' },
  { id: 'customer-jobs', name: 'Job History', description: 'All jobs and services for this customer' },
  { id: 'customer-invoices', name: 'Invoice History', description: 'All invoices and payments' },
  { id: 'customer-ltv', name: 'Lifetime Value', description: 'Customer lifetime value analysis' },
];

export default function ReportCard({ 
  cardId = 'report-card',
  className = '' 
}: ReportCardProps) {
  const { user } = useAuthStore();
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle report generation
  const handleGenerateReport = useCallback(async (customer: any, reportType: string): Promise<void> => {
    setIsGenerating(true);
    
    // Create a new report entry
    const reportId = `report-${Date.now()}`;
    const newReport: GeneratedReport = {
      id: reportId,
      type: reportType,
      customerId: customer.id,
      customerName: customer.name,
      status: 'generating',
      createdAt: new Date(),
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    
    try {
      // Simulate report generation (replace with actual API call)
      // TODO: Replace with actual report generation API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update report status with proper URL
      // TODO: Replace with actual API endpoint when backend is ready
      // For now, use a URL that can be handled by the Reports page
      const reportUrl = `/reports/view/${reportId}?customerId=${customer.id}&type=${reportType}`;
      setGeneratedReports(prev => 
        prev.map(r => 
          r.id === reportId 
            ? { ...r, status: 'completed', downloadUrl: reportUrl }
            : r
        )
      );

      logger.info('Report generated successfully', { 
        reportId, 
        customerId: customer.id,
        reportType 
      });
    } catch (error) {
      logger.error('Failed to generate report', { error, customerId: customer.id });
      
      // Update report status to error
      setGeneratedReports(prev => 
        prev.map(r => 
          r.id === reportId 
            ? { ...r, status: 'error' }
            : r
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Report generation handler for drag-and-drop
  const generateReportHandler = useCallback(async (payload: DragPayload): Promise<ActionResult> => {
    try {
      if (payload.sourceDataType !== 'customer' || !payload.data?.entity) {
        return {
          success: false,
          error: 'Invalid data type. Expected customer data.'
        };
      }

      const customer = payload.data.entity;
      const reportType = selectedReportType || 'customer-summary';
      
      logger.debug('Generating report from customer drag', {
        customerId: customer.id,
        customerName: customer.name,
        reportType
      });

      await handleGenerateReport(customer, reportType);

      return {
        success: true,
        message: `Generating ${customerReportTypes.find(t => t.id === reportType)?.name || reportType} report for ${customer.name}`,
        data: { customerId: customer.id, reportType }
      };
    } catch (error) {
      logger.error('Error generating report from customer', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate report'
      };
    }
  }, [selectedReportType, handleGenerateReport]);

  // Drop zone configuration
  const dropZoneConfig: DropZoneConfig = {
    cardId: cardId,
    cardType: 'report',
    accepts: {
      dataTypes: ['customer'],
      maxItems: undefined
    },
    actions: {
      'generate-customer-report': {
        id: 'generate-customer-report',
        label: 'Generate Customer Report',
        icon: '📊',
        description: 'Generate a report for this customer',
        handler: generateReportHandler,
        requiresConfirmation: false
      }
    },
    dropZoneStyle: {
      highlightColor: '#3b82f6',
      borderStyle: 'dashed',
      borderWidth: 2,
      backgroundColor: 'rgba(59, 130, 246, 0.05)'
    }
  };


  const handleDownloadReport = (e: React.MouseEvent, report: GeneratedReport) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!report.downloadUrl) {
      logger.warn('Report download URL not available', { reportId: report.id });
      return;
    }

    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.download = `${report.type}-${report.customerName || report.id}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      logger.info('Report download initiated', { 
        reportId: report.id, 
        reportType: report.type,
        customerId: report.customerId 
      });
    } catch (error) {
      logger.error('Failed to download report', { error, reportId: report.id });
      // Fallback: open in new tab
      window.open(report.downloadUrl, '_blank');
    }
  };

  const handleViewReport = (e: React.MouseEvent, report: GeneratedReport) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!report.downloadUrl) {
      logger.warn('Report view URL not available', { reportId: report.id });
      return;
    }

    try {
      // Open report in new tab for viewing
      const viewUrl = report.downloadUrl.replace('/download', '/view') || report.downloadUrl;
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
      
      logger.info('Report view opened', { 
        reportId: report.id, 
        reportType: report.type,
        customerId: report.customerId 
      });
    } catch (error) {
      logger.error('Failed to open report view', { error, reportId: report.id });
      // Fallback: open download URL
      window.open(report.downloadUrl, '_blank');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setGeneratedReports(prev => prev.filter(r => r.id !== reportId));
  };

  return (
    <div className={`h-full flex flex-col ${className}`} data-card-id={cardId}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
        </div>
        <p className="text-sm text-gray-600">Drag customers here to generate reports</p>
      </div>

      {/* Drop Zone */}
      <div className="flex-1 p-4 overflow-auto">
        <DropZone
          cardId={cardId}
          dropZoneConfig={dropZoneConfig}
          onDrop={(payload, result) => {
            if (result.success) {
              logger.info('Report generation initiated', { 
                customerId: payload.data?.id,
                reportType: selectedReportType 
              });
            }
          }}
          className="min-h-[200px]"
        >
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <FileText className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium mb-1">Drop customer here</p>
            <p className="text-sm text-gray-500">to generate a report</p>
          </div>

        {/* Report Type Selection */}
        {selectedReportType && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {customerReportTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Generated Reports List */}
        {generatedReports.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Generated Reports</h4>
            <div className="space-y-2">
              {generatedReports.map(report => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {customerReportTypes.find(t => t.id === report.type)?.name || report.type}
                      </p>
                      {report.status === 'generating' && (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      )}
                      {report.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {report.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {report.customerName && (
                      <p className="text-xs text-gray-500 truncate">
                        {report.customerName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {report.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {report.status === 'completed' && (
                      <>
                        <button
                          onClick={(e) => handleViewReport(e, report)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View report"
                          type="button"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDownloadReport(e, report)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Download report"
                          type="button"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteReport(report.id);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete report"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedReports.length === 0 && !isGenerating && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>No reports generated yet.</p>
            <p className="mt-1">Drag a customer from Customer Search Card to get started.</p>
          </div>
        )}
        </DropZone>
      </div>
    </div>
  );
}

