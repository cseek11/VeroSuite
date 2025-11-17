import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui';
import {
  X,
  Download,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  History,
  ArrowRight
} from 'lucide-react';
import { Invoice } from '@/types/enhanced-types';
import { company, billing } from '@/lib/enhanced-api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface InvoiceViewerProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onPayNow?: () => void;
}

export default function InvoiceViewer({ invoice, isOpen, onClose, onPayNow }: InvoiceViewerProps) {
  const printableRef = useRef<HTMLDivElement>(null);

  // Fetch company settings for dynamic display
  const { data: companySettings } = useQuery({
    queryKey: ['company', 'settings'],
    queryFn: company.getSettings,
  });

  // Fetch payment history for this invoice
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['billing', 'payments', invoice.id],
    queryFn: () => billing.getPayments(invoice.id),
    enabled: isOpen && !!invoice.id,
  });

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      if (!printableRef.current) {
        throw new Error('Printable content not found');
      }

      // Show loading state
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating PDF...';
      }

      // Create canvas from the printable content
      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: printableRef.current.scrollWidth,
        height: printableRef.current.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`Invoice-${invoice.invoice_number}.pdf`);
      
      logger.debug('PDF generated successfully', { invoiceNumber: invoice.invoice_number }, 'InvoiceViewer');
    } catch (error) {
      logger.error('Failed to generate PDF', error, 'InvoiceViewer');
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      // Reset button state
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Download PDF';
      }
    }
  };

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'sent':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isPayable = invoice.status === 'sent' || invoice.status === 'overdue';
  const isOverdue = invoice.status === 'overdue' || 
    (invoice.status === 'sent' && new Date(invoice.due_date) < new Date());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4 flex-1">
            {companySettings?.invoice_logo_url ? (
              <img 
                src={companySettings.invoice_logo_url} 
                alt="Company Logo" 
                className="w-auto h-16 max-w-[180px] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            ) : (
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <div className="text-white font-bold text-xs">
                  {companySettings?.company_name?.substring(0, 2).toUpperCase() || "VC"}
                </div>
              </div>
            )}
            <div className="flex-1">
              <Heading level={3} className="font-bold text-slate-800">
                {!companySettings?.invoice_logo_url && `Invoice ${invoice.invoice_number}`}
              </Heading>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-slate-700 text-lg">{invoice.accounts?.name}</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(invoice.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
                {(invoice.accounts as any)?.address && (
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 mr-1.5 text-slate-500" />
                      {[(invoice.accounts as any).address, (invoice.accounts as any).city, (invoice.accounts as any).state, (invoice.accounts as any).zip_code]
                        .filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              data-pdf-button
              onClick={() => handleDownloadPDF(invoice)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div ref={printableRef} className="p-6 bg-white">
            {/* PDF Header - Only visible in PDF */}
            <div className="mb-8 pb-6 border-b-2 border-purple-200">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                        {companySettings?.invoice_logo_url ? (
                            <img 
                                src={companySettings.invoice_logo_url} 
                                alt="Company Logo" 
                                className="w-auto h-20 max-w-[200px] object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'block';
                                }}
                            />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                            {companySettings?.company_name?.substring(0, 2).toUpperCase() || "VC"}
                          </div>
                        )}
                  <div>
                    {!companySettings?.invoice_logo_url && (
                      <h1 className="text-3xl font-bold text-purple-800 mb-2">
                        {companySettings?.company_name || 'VeroField Pest Control'}
                      </h1>
                    )}
                    <p className="text-slate-600">Professional Pest Control Services</p>
                    <div className="text-sm text-slate-500 mt-2">
                      <p>
                        {companySettings?.phone && `📞 ${companySettings.phone}`}
                        {companySettings?.phone && companySettings?.email && ' | '}
                        {companySettings?.email && `✉️ ${companySettings.email}`}
                      </p>
                      {(companySettings?.address || companySettings?.city || companySettings?.state || companySettings?.zip_code) && (
                        <p>📍 {[companySettings?.address, companySettings?.city, companySettings?.state, companySettings?.zip_code].filter(Boolean).join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-slate-800">Invoice {invoice.invoice_number}</h2>
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    {getStatusIcon(invoice.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue Warning */}
            {isOverdue && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Payment Overdue</strong>
                    <div className="text-sm mt-1">
                      This invoice was due on {new Date(invoice.due_date).toLocaleDateString()}.
                      Please make payment as soon as possible to avoid late fees.
                    </div>
                  </div>
                  {onPayNow && (
                    <Button variant="primary" size="sm" onClick={onPayNow} icon={CreditCard}>
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Invoice Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Company Info */}
              <Card>
                <div className="p-6">
                  <Heading level={4} className="font-semibold mb-4 text-purple-800">
                    {companySettings?.company_name || 'VeroField Pest Control'}
                  </Heading>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Professional Pest Control Services
                    </div>
                    {companySettings?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {companySettings.phone}
                      </div>
                    )}
                    {companySettings?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {companySettings.email}
                      </div>
                    )}
                    {(companySettings?.address || companySettings?.city || companySettings?.state || companySettings?.zip_code) && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {[companySettings?.address, companySettings?.city, companySettings?.state, companySettings?.zip_code].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Customer Info */}
              <Card>
                <div className="p-6">
                  <Heading level={4} className="font-semibold mb-4">
                    Bill To
                  </Heading>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium">{invoice.accounts?.name}</div>
                    {(invoice.accounts as any)?.address && (
                      <div className="flex items-start text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          {[(invoice.accounts as any).address, (invoice.accounts as any).city, (invoice.accounts as any).state, (invoice.accounts as any).zip_code]
                            .filter(Boolean).join(', ')}
                        </div>
                      </div>
                    )}
                    {invoice.accounts?.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {invoice.accounts.email}
                      </div>
                    )}
                    {invoice.accounts?.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {invoice.accounts.phone}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Invoice Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <div className="text-sm text-blue-600 font-medium">Issue Date</div>
                    <div className="text-blue-800 font-semibold">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <div className="text-sm text-orange-600 font-medium">Due Date</div>
                    <div className="text-orange-800 font-semibold">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm text-green-600 font-medium">Total Amount</div>
                    <div className="text-green-800 font-bold text-lg">
                      ${Number(invoice.total_amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <Card>
              <div className="p-6">
                <Heading level={4} className="font-semibold mb-4">
                  Services
                </Heading>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Description</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-700">Qty</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-700">Unit Price</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.InvoiceItem?.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-2">
                            <div className="font-medium">{item.description}</div>
                          </td>
                          <td className="py-3 px-2 text-center">{item.quantity}</td>
                          <td className="py-3 px-2 text-right">${Number(item.unit_price).toFixed(2)}</td>
                          <td className="py-3 px-2 text-right font-medium">
                            ${Number(item.total_price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300">
                        <td colSpan={3} className="py-3 px-2 text-right font-semibold">Subtotal:</td>
                        <td className="py-3 px-2 text-right font-semibold">
                          ${Number(invoice.subtotal).toFixed(2)}
                        </td>
                      </tr>
                      {Number(invoice.tax_amount) > 0 && (
                        <tr>
                          <td colSpan={3} className="py-2 px-2 text-right">Tax:</td>
                          <td className="py-2 px-2 text-right">
                            ${Number(invoice.tax_amount).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t border-gray-200">
                        <td colSpan={3} className="py-3 px-2 text-right font-bold text-lg">Total:</td>
                        <td className="py-3 px-2 text-right font-bold text-lg text-purple-800">
                          ${Number(invoice.total_amount).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </Card>

            {/* Notes */}
            {invoice.notes && (
              <Card className="mt-6">
                <div className="p-6">
                  <Heading level={4} className="font-semibold mb-3">
                    Notes
                  </Heading>
                  <Text variant="small" className="text-gray-700">
                    {invoice.notes}
                  </Text>
                </div>
              </Card>
            )}

            {/* Payment History */}
            <Card className="mt-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Heading level={4} className="font-semibold flex items-center">
                    <History className="w-5 h-5 mr-2 text-purple-600" />
                    Payment History
                  </Heading>
                  {payments.length > 0 && (
                    <Text variant="small" className="text-gray-600">
                      {payments.length} payment{payments.length !== 1 ? 's' : ''}
                    </Text>
                  )}
                </div>

                {paymentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Clock className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                    <Text variant="small" className="text-gray-500">
                      Loading payment history...
                    </Text>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <Text variant="small" className="text-gray-500">
                      No payments recorded for this invoice
                    </Text>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="p-2 rounded-lg bg-green-100 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Text variant="body" className="font-semibold">
                                ${Number(payment.amount).toFixed(2)}
                              </Text>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Completed
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <Text variant="small" className="text-gray-600 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(payment.payment_date).toLocaleDateString()}
                              </Text>
                              {payment.payment_methods && (
                                <Text variant="small" className="text-gray-600 flex items-center">
                                  <CreditCard className="w-3 h-3 mr-1" />
                                  {payment.payment_methods.payment_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Payment'}
                                </Text>
                              )}
                              {payment.reference_number && (
                                <Text variant="small" className="text-gray-500 font-mono">
                                  {payment.reference_number.substring(0, 8)}...
                                </Text>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Payment Summary */}
                {payments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Text variant="small" className="text-gray-600 mb-1">
                          Total Paid
                        </Text>
                        <Text variant="body" className="font-bold text-green-700">
                          ${payments
                            .reduce((sum, p) => sum + Number(p.amount), 0)
                            .toFixed(2)}
                        </Text>
                      </div>
                      <div>
                        <Text variant="small" className="text-gray-600 mb-1">
                          Balance Due
                        </Text>
                        <Text variant="body" className="font-bold text-orange-700">
                          ${(Number(invoice.total_amount) - payments
                            .reduce((sum, p) => sum + Number(p.amount), 0))
                            .toFixed(2)}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        {isPayable && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <Heading level={4} className="font-semibold">
                  Amount Due: ${Number(invoice.total_amount).toFixed(2)}
                </Heading>
                <Text variant="small" className="text-gray-600">
                  Due {new Date(invoice.due_date).toLocaleDateString()}
                </Text>
              </div>
              {onPayNow && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onPayNow}
                  icon={CreditCard}
                  className="shadow-lg"
                >
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
