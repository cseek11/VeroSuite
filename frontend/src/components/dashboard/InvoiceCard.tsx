/**
 * Invoice Card Component
 * 
 * Dashboard card for creating invoices by dragging customers or jobs onto it.
 * Supports drag-and-drop interactions with Customer Search Card and Jobs Calendar Card.
 */

import React, { useState, useCallback } from 'react';
import { Receipt, Download, Eye, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { DropZone } from '@/routes/dashboard/components';
import { DropZoneConfig, DragPayload, ActionResult } from '@/routes/dashboard/types/cardInteractions.types';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';
import { billing } from '@/lib/enhanced-api';

interface InvoiceCardProps {
  cardId?: string;
  className?: string;
}

interface GeneratedInvoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  jobId?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  amount: number;
  createdAt: Date;
  downloadUrl?: string;
}

export default function InvoiceCard({ 
  cardId = 'invoice-card',
  className = '' 
}: InvoiceCardProps): React.ReactElement {
  const { user } = useAuthStore();
  const [generatedInvoices, setGeneratedInvoices] = useState<GeneratedInvoice[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Handle invoice creation
  const handleCreateInvoice = useCallback(async (customer: Record<string, unknown>, job?: Record<string, unknown>): Promise<void> => {
    setIsCreating(true);
    
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;
    const invoiceId = `invoice-${Date.now()}`;
    
    const newInvoice: GeneratedInvoice = {
      id: invoiceId,
      invoiceNumber,
      customerId: customer.id,
      customerName: customer.name,
      jobId: job?.id,
      status: 'draft',
      amount: job?.total_amount || 0,
      createdAt: new Date(),
    };

    setGeneratedInvoices(prev => [newInvoice, ...prev]);
    
    try {
      // Create invoice using billing API
      const invoiceData = {
        account_id: customer.id,
        job_id: job?.id || null,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: job?.items || [{
          service_type_id: '',
          description: job?.description || 'Service',
          quantity: 1,
          unit_price: job?.total_amount || 0
        }],
        notes: job ? `Invoice for job ${job.id}` : `Invoice for ${customer.name}`
      };

      // Call billing API
      const createdInvoice = await billing.createInvoice(invoiceData);

      // Update invoice with real data
      setGeneratedInvoices(prev => 
        prev.map(inv => 
          inv.id === invoiceId 
            ? { 
                ...inv, 
                id: createdInvoice.id,
                invoiceNumber: createdInvoice.invoice_number,
                amount: createdInvoice.total_amount,
                status: createdInvoice.status as any,
                downloadUrl: `/invoices/${createdInvoice.id}`
              }
            : inv
        )
      );

      logger.info('Invoice created successfully', { 
        invoiceId: createdInvoice.id,
        customerId: customer.id,
        jobId: job?.id
      });
    } catch (error) {
      logger.error('Failed to create invoice', { error, customerId: customer.id });
      
      // Update invoice status to error
      setGeneratedInvoices(prev => 
        prev.map(inv => 
          inv.id === invoiceId 
            ? { ...inv, status: 'draft' } // Keep as draft on error
            : inv
        )
      );
    } finally {
      setIsCreating(false);
    }
  }, [user]);

  // Invoice creation handler for drag-and-drop
  const createInvoiceHandler = useCallback(async (payload: DragPayload): Promise<ActionResult> => {
    try {
      if (payload.sourceDataType === 'customer') {
        const customer = payload.data.entity;
        
        logger.debug('Creating invoice from customer drag', {
          customerId: customer.id,
          customerName: customer.name
        });

        await handleCreateInvoice(customer);

        return {
          success: true,
          message: `Creating invoice for ${customer.name}`,
          data: { customerId: customer.id }
        };
      } else if (payload.sourceDataType === 'job') {
        const job = payload.data.entity;
        // Try to get customer from job
        const customer = job.account || job.customer || job.accounts;
        
        if (!customer) {
          return {
            success: false,
            error: 'Job does not have associated customer information.'
          };
        }

        logger.debug('Creating invoice from job drag', {
          jobId: job.id,
          customerId: customer.id
        });

        await handleCreateInvoice(customer, job);

        return {
          success: true,
          message: `Creating invoice for job ${job.id}`,
          data: { jobId: job.id, customerId: customer.id }
        };
      } else {
        return {
          success: false,
          error: 'Invalid data type. Expected customer or job data.'
        };
      }
    } catch (error) {
      logger.error('Error creating invoice from drag', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create invoice'
      };
    }
  }, [handleCreateInvoice]);

  // Drop zone configuration
  const dropZoneConfig: DropZoneConfig = {
    cardId: cardId,
    cardType: 'invoice',
    accepts: {
      dataTypes: ['customer', 'job'],
      maxItems: undefined
    },
    actions: {
      'create-invoice': {
        id: 'create-invoice',
        label: 'Create Invoice',
        icon: '💰',
        description: 'Create an invoice for this customer or job',
        handler: createInvoiceHandler,
        requiresConfirmation: false
      }
    },
    dropZoneStyle: {
      highlightColor: '#ef4444',
      borderStyle: 'dashed',
      borderWidth: 2,
      backgroundColor: 'rgba(239, 68, 68, 0.05)'
    }
  };

  const handleDownloadInvoice = (e: React.MouseEvent, invoice: GeneratedInvoice) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!invoice.downloadUrl) {
      logger.warn('Invoice download URL not available', { invoiceId: invoice.id });
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = invoice.downloadUrl;
      link.download = `${invoice.invoiceNumber}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      logger.info('Invoice download initiated', { 
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber
      });
    } catch (error) {
      logger.error('Failed to download invoice', { error, invoiceId: invoice.id });
      window.open(invoice.downloadUrl, '_blank');
    }
  };

  const handleViewInvoice = (e: React.MouseEvent, invoice: GeneratedInvoice) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!invoice.downloadUrl) {
      logger.warn('Invoice view URL not available', { invoiceId: invoice.id });
      return;
    }

    try {
      const viewUrl = invoice.downloadUrl.replace('/download', '/view') || invoice.downloadUrl;
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
      
      logger.info('Invoice view opened', { 
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber
      });
    } catch (error) {
      logger.error('Failed to open invoice view', { error, invoiceId: invoice.id });
      window.open(invoice.downloadUrl, '_blank');
    }
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setGeneratedInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'sent':
        return 'text-blue-600 bg-blue-50';
      case 'overdue':
        return 'text-red-600 bg-red-50';
      case 'draft':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Loader2 className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`h-full flex flex-col min-h-[400px] ${className}`} data-card-id={cardId}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="flex items-center gap-2 mb-2">
          <Receipt className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
        </div>
        <p className="text-sm text-gray-600">Drag customers or jobs here to create invoices</p>
      </div>

      {/* Drop Zone */}
      <div className="flex-1 p-4 overflow-auto">
        <DropZone
          cardId={cardId}
          dropZoneConfig={dropZoneConfig}
          onDrop={(payload, result) => {
            if (result.success) {
              logger.info('Invoice creation initiated', { 
                customerId: payload.data?.id,
                dataType: payload.sourceDataType
              });
            }
          }}
          className="min-h-[200px]"
        >
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-red-400 hover:bg-red-50 transition-colors">
            <Receipt className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium mb-1">Drop customer or job here</p>
            <p className="text-sm text-gray-500">to create an invoice</p>
          </div>

          {/* Generated Invoices List */}
          {generatedInvoices.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Generated Invoices</h4>
              <div className="space-y-2">
                {generatedInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {invoice.invoiceNumber}
                        </p>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="capitalize">{invoice.status}</span>
                        </div>
                      </div>
                      {invoice.customerName && (
                        <p className="text-xs text-gray-500 truncate">
                          {invoice.customerName}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs font-medium text-gray-700">
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {invoice.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {invoice.status !== 'draft' && (
                        <>
                          <button
                            onClick={(e) => handleViewInvoice(e, invoice)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View invoice"
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDownloadInvoice(e, invoice)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Download invoice"
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
                          handleDeleteInvoice(invoice.id);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete invoice"
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
          {generatedInvoices.length === 0 && !isCreating && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              <p>No invoices created yet.</p>
              <p className="mt-1">Drag a customer or job from another card to get started.</p>
            </div>
          )}
        </DropZone>
      </div>
    </div>
  );
}

