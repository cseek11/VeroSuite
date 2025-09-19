import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Typography,
  Button,
  Alert
} from '@/components/ui/EnhancedUI';
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
  Clock
} from 'lucide-react';
import { Invoice } from '@/types/enhanced-types';
import { company } from '@/lib/enhanced-api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
      
      console.log('📄 PDF generated successfully for invoice:', invoice.invoice_number);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                        {(companySettings?.invoice_logo_url || companySettings?.logo_url) ? (
                            <img 
                                src={companySettings.invoice_logo_url || companySettings.logo_url} 
                                alt="Company Logo" 
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <div 
                          className="text-white font-bold text-xs" 
                          style={{ display: (companySettings?.invoice_logo_url || companySettings?.logo_url) ? 'none' : 'block' }}
                        >
                          {companySettings?.company_name?.substring(0, 2).toUpperCase() || "VC"}
                        </div>
            </div>
            <div className="flex-1">
              <Typography variant="h3" className="font-bold text-slate-800">
                Invoice {invoice.invoice_number}
              </Typography>
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
                {invoice.accounts?.address && (
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 mr-1.5 text-slate-500" />
                      {[invoice.accounts.address, invoice.accounts.city, invoice.accounts.state, invoice.accounts.zip_code]
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
                        {(companySettings?.invoice_logo_url || companySettings?.logo_url) ? (
                            <img 
                                src={companySettings.invoice_logo_url || companySettings.logo_url} 
                                alt="Company Logo" 
                                className="w-16 h-16 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <div 
                          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                          style={{ display: (companySettings?.invoice_logo_url || companySettings?.logo_url) ? 'none' : 'flex' }}
                        >
                          {companySettings?.company_name?.substring(0, 2).toUpperCase() || "VC"}
                        </div>
                  <div>
                    <h1 className="text-3xl font-bold text-purple-800 mb-2">
                      {companySettings?.company_name || 'VeroField Pest Control'}
                    </h1>
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
              <Alert type="warning" className="mb-6">
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
              </Alert>
            )}

            {/* Invoice Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Company Info */}
              <Card>
                <div className="p-6">
                  <Typography variant="h4" className="font-semibold mb-4 text-purple-800">
                    {companySettings?.company_name || 'VeroField Pest Control'}
                  </Typography>
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
                  <Typography variant="h4" className="font-semibold mb-4">
                    Bill To
                  </Typography>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium">{invoice.accounts?.name}</div>
                    {invoice.accounts?.address && (
                      <div className="flex items-start text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          {[invoice.accounts.address, invoice.accounts.city, invoice.accounts.state, invoice.accounts.zip_code]
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
                <Typography variant="h4" className="font-semibold mb-4">
                  Services
                </Typography>
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
                  <Typography variant="h4" className="font-semibold mb-3">
                    Notes
                  </Typography>
                  <Typography variant="body2" className="text-gray-700">
                    {invoice.notes}
                  </Typography>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {isPayable && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" className="font-semibold">
                  Amount Due: ${Number(invoice.total_amount).toFixed(2)}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Due {new Date(invoice.due_date).toLocaleDateString()}
                </Typography>
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
