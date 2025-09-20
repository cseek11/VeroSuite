import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { company } from '@/lib/enhanced-api';

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
    mutationFn: (data: any) => {
      console.log('🔄 Mutation starting with data:', data);
      return company.updateSettings(data);
    },
    onSuccess: (result) => {
      console.log('✅ Mutation success:', result);
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
    },
    onMutate: (variables) => {
      console.log('🚀 Mutation starting with variables:', variables);
    },
    onSettled: (data, error) => {
      console.log('🏁 Mutation settled - data:', data, 'error:', error);
    }
  });

  // Load company data when fetched
  useEffect(() => {
    console.log('🔄 useCompanySettings: Raw companySettings from API:', companySettings);
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
      console.log('🔄 useCompanySettings: Setting companyData to:', newCompanyData);
      setCompanyData(newCompanyData);
    }
  }, [companySettings]);

  const updateCompanyData = (updates: Partial<CompanyData>) => {
    setCompanyData(prev => ({ ...prev, ...updates }));
  };

  const saveCompanySettings = async () => {
    try {
      console.log('🚀 Starting company settings save...');
      
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

      console.log('💾 Attempting to save company data:', cleanedData);
      
      // Try direct API call instead of mutation
      console.log('📡 Making direct API call...');
      const result = await company.updateSettings(cleanedData);
      console.log('✅ Direct API call completed:', result);
      
      // Manually invalidate queries
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
      
      return true;
    } catch (error) {
      console.error('❌ Company settings save failed:', error);
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
