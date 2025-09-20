import React, { useState } from 'react';
import { Building2, Phone, Mail, Globe, MapPin, Image, Upload, X, AlertTriangle, Save } from 'lucide-react';
import { SettingsCard } from '../shared/SettingsCard';
import { SuccessMessage } from '../shared/SuccessMessage';
import { useCompanySettings } from '../hooks/useCompanySettings';
import { useLogoUpload } from '../hooks/useLogoUpload';

interface CompanySettingsProps {
  isLoading: boolean;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({ isLoading: parentLoading }) => {
  const { companyData, updateCompanyData, companySettings, saveCompanySettings } = useCompanySettings();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    headerLogoPreview,
    invoiceLogoPreview,
    handleHeaderLogoSelect,
    handleInvoiceLogoSelect,
    deleteLogoMutation,
    uploadHeaderLogoMutation,
    uploadInvoiceLogoMutation,
    setLogoPreviews
  } = useLogoUpload();

  // Set logo previews when company settings load
  React.useEffect(() => {
    console.log('🔄 CompanySettings: companySettings loaded:', companySettings);
    console.log('🔄 CompanySettings: companyData state:', companyData);
    if (companySettings) {
      console.log('🖼️ Setting logo previews:');
      console.log('  - header_logo_url:', companySettings.header_logo_url);
      console.log('  - invoice_logo_url:', companySettings.invoice_logo_url);
      console.log('  - logo_url (fallback):', companySettings.logo_url);
      setLogoPreviews(companySettings);
    }
  }, [companySettings, companyData, setLogoPreviews]);

  const handleInputChange = (field: string, value: string) => {
    updateCompanyData({ [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('🎯 CompanySettings: Starting save process...');
      
      // Add timeout to prevent infinite loading
      const savePromise = saveCompanySettings();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Save operation timed out after 30 seconds')), 30000)
      );
      
      await Promise.race([savePromise, timeoutPromise]);
      
      console.log('✅ CompanySettings: Save completed successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('❌ CompanySettings: Save failed:', error);
      alert(`Failed to save company settings: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Message */}
      <SuccessMessage show={showSuccess} message="Company settings saved successfully!" />
      {/* Company Information */}
      <SettingsCard title="Company Information" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={companyData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={companyData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={companyData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="contact@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={companyData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="https://www.company.com"
            />
          </div>
        </div>
      </SettingsCard>

      {/* Company Address */}
      <SettingsCard title="Company Address" icon={MapPin}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={companyData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="123 Main Street"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={companyData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="City"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={companyData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="State"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              value={companyData.zip_code}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="12345"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Country
            </label>
            <select
              value={companyData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="USA">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      {/* Header Logo Upload */}
      <SettingsCard title="Header Logo" description="Navigation & Header" icon={Image}>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
            {headerLogoPreview ? (
              <img 
                src={headerLogoPreview} 
                alt="Header Logo" 
                className="w-20 h-20 object-contain rounded"
                onError={(e) => {
                  console.error('❌ Header logo preview failed to load:', headerLogoPreview);
                  // Try adding cache-busting parameter
                  const img = e.currentTarget;
                  if (!img.src.includes('?t=')) {
                    img.src = headerLogoPreview + '?t=' + Date.now();
                  }
                }}
                onLoad={() => console.log('✅ Header logo preview loaded:', headerLogoPreview)}
              />
            ) : (
              <div className="text-center">
                <Image className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">No header logo</p>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Upload/Replace Button */}
            {!headerLogoPreview ? (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderLogoSelect}
                  className="hidden"
                  disabled={uploadHeaderLogoMutation.isPending}
                />
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                  uploadHeaderLogoMutation.isPending
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                }`}>
                  {uploadHeaderLogoMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Header Logo</span>
                    </>
                  )}
                </div>
              </label>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderLogoSelect}
                  className="hidden"
                  disabled={uploadHeaderLogoMutation.isPending || deleteLogoMutation.isPending}
                />
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                  (uploadHeaderLogoMutation.isPending || deleteLogoMutation.isPending)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}>
                  {(uploadHeaderLogoMutation.isPending || deleteLogoMutation.isPending) ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>{deleteLogoMutation.isPending ? 'Removing old logo...' : 'Uploading new logo...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Replace Header Logo</span>
                    </>
                  )}
                </div>
              </label>
            )}
            
            {/* Delete Button - Only show if logo exists */}
            {headerLogoPreview && (
              <button
                onClick={() => deleteLogoMutation.mutate('header')}
                disabled={deleteLogoMutation.isPending}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium ${
                  deleteLogoMutation.isPending
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                }`}
              >
                {deleteLogoMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Delete Header Logo</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </SettingsCard>

      {/* Invoice Logo Upload */}
      <SettingsCard title="Invoice Logo" description="Invoices & PDFs" icon={Image}>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
            {invoiceLogoPreview ? (
              <img 
                src={invoiceLogoPreview} 
                alt="Invoice Logo" 
                className="w-20 h-20 object-contain rounded"
                onError={(e) => {
                  console.error('❌ Invoice logo preview failed to load:', invoiceLogoPreview);
                  // Try adding cache-busting parameter
                  const img = e.currentTarget;
                  if (!img.src.includes('?t=')) {
                    img.src = invoiceLogoPreview + '?t=' + Date.now();
                  }
                }}
                onLoad={() => console.log('✅ Invoice logo preview loaded:', invoiceLogoPreview)}
              />
            ) : (
              <div className="text-center">
                <Image className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">No invoice logo</p>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Upload/Replace Button */}
            {!invoiceLogoPreview ? (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInvoiceLogoSelect}
                  className="hidden"
                  disabled={uploadInvoiceLogoMutation.isPending}
                />
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                  uploadInvoiceLogoMutation.isPending
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}>
                  {uploadInvoiceLogoMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Invoice Logo</span>
                    </>
                  )}
                </div>
              </label>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInvoiceLogoSelect}
                  className="hidden"
                  disabled={uploadInvoiceLogoMutation.isPending || deleteLogoMutation.isPending}
                />
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                  (uploadInvoiceLogoMutation.isPending || deleteLogoMutation.isPending)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                }`}>
                  {(uploadInvoiceLogoMutation.isPending || deleteLogoMutation.isPending) ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>{deleteLogoMutation.isPending ? 'Removing old logo...' : 'Uploading new logo...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Replace Invoice Logo</span>
                    </>
                  )}
                </div>
              </label>
            )}
            
            {/* Delete Button - Only show if logo exists */}
            {invoiceLogoPreview && (
              <button
                onClick={() => deleteLogoMutation.mutate('invoice')}
                disabled={deleteLogoMutation.isPending}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium ${
                  deleteLogoMutation.isPending
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                }`}
              >
                {deleteLogoMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Delete Invoice Logo</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </SettingsCard>

      {/* Logo Guidelines */}
      <SettingsCard title="Logo Guidelines" icon={AlertTriangle}>
        <div className="bg-blue-50/80 backdrop-blur-xl rounded-xl border border-blue-200/50 p-4">
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Size:</strong> 200x200px or larger (square format preferred)</p>
            <p>• <strong>Format:</strong> PNG, JPEG, GIF, or WebP</p>
            <p>• <strong>File Size:</strong> Maximum 2MB per logo</p>
            <p>• <strong>Background:</strong> Transparent PNG recommended</p>
            <p>• <strong>Actions:</strong> Upload, replace, or delete logos independently</p>
            <p>• <strong>Limit:</strong> One header logo + one invoice logo per tenant</p>
          </div>
        </div>
      </SettingsCard>

      {/* Save Button */}
      <SettingsCard title="">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Company Settings</span>
              </>
            )}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
};
