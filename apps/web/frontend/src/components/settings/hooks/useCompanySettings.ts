import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { company } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';

export interface CompanyData {
  company_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  header_logo_url: string;
  invoice_logo_url: string;
}

export const useCompanySettings = () => {
  const queryClient = useQueryClient();
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    company_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    phone: '',
    email: '',
    website: '',
    logo_url: '',
    header_logo_url: '',
    invoice_logo_url: ''
  });

  // Fetch company settings
  const { data: companySettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['company', 'settings'],
    queryFn: company.getSettings,
  });

  // Update company settings mutation
  const updateCompanyMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      return company.updateSettings(data);
    },
    onSuccess: (_result) => {
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (_error) => {
      // Error handling is done at component level
    }
  });

  // Load company data when fetched
  useEffect(() => {
    if (companySettings) {
      const newCompanyData = {
        company_name: companySettings.company_name || '',
        address: companySettings.address || '',
        city: companySettings.city || '',
        state: companySettings.state || '',
        zip_code: companySettings.zip_code || '',
        country: companySettings.country || 'USA',
        phone: companySettings.phone || '',
        email: companySettings.email || '',
        website: companySettings.website || '',
        logo_url: companySettings.logo_url || '',
        header_logo_url: companySettings.header_logo_url || '',
        invoice_logo_url: companySettings.invoice_logo_url || '',
      };
      setCompanyData(newCompanyData);
    }
  }, [companySettings]);

  const updateCompanyData = (updates: Partial<CompanyData>) => {
    setCompanyData(prev => ({ ...prev, ...updates }));
  };

  const saveCompanySettings = async () => {
    try {
      // Clean data for validation - convert empty strings to undefined for optional fields
      const cleanedData = {
        ...companyData,
        email: companyData.email.trim() || undefined,
        website: companyData.website.trim() || undefined,
        phone: companyData.phone.trim() || undefined,
        address: companyData.address.trim() || undefined,
        city: companyData.city.trim() || undefined,
        state: companyData.state.trim() || undefined,
        zip_code: companyData.zip_code.trim() || undefined,
      };

      await company.updateSettings(cleanedData);
      
      // Manually invalidate queries
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
      
      return true;
    } catch (error) {
      logger.error('Company settings save failed', error, 'useCompanySettings');
      throw error;
    }
  };

  return {
    companyData,
    companySettings,
    isLoadingSettings,
    updateCompanyData,
    saveCompanySettings,
    updateCompanyMutation,
  };
};
