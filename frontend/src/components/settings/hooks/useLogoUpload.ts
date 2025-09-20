import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { company } from '@/lib/enhanced-api';

export const useLogoUpload = () => {
  const queryClient = useQueryClient();
  
  // Separate states for header and invoice logos
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  const [headerLogoPreview, setHeaderLogoPreview] = useState<string>('');
  const [invoiceLogoFile, setInvoiceLogoFile] = useState<File | null>(null);
  const [invoiceLogoPreview, setInvoiceLogoPreview] = useState<string>('');

  // Header logo upload mutation
  const uploadHeaderLogoMutation = useMutation({
    mutationFn: (file: File) => company.uploadLogo(file, 'header'),
    onSuccess: (data) => {
      console.log('✅ Header logo uploaded successfully:', data.logo_url);
      setHeaderLogoPreview(data.logo_url);
      setHeaderLogoFile(null);
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (error) => {
      console.error('❌ Failed to upload header logo:', error);
      alert('Failed to upload header logo. Please try again.');
    }
  });

  // Invoice logo upload mutation
  const uploadInvoiceLogoMutation = useMutation({
    mutationFn: (file: File) => company.uploadLogo(file, 'invoice'),
    onSuccess: (data) => {
      console.log('✅ Invoice logo uploaded successfully:', data.logo_url);
      setInvoiceLogoPreview(data.logo_url);
      setInvoiceLogoFile(null);
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (error) => {
      console.error('❌ Failed to upload invoice logo:', error);
      alert('Failed to upload invoice logo. Please try again.');
    }
  });

  // Logo deletion mutations
  const deleteLogoMutation = useMutation({
    mutationFn: (logoType: 'header' | 'invoice') => company.deleteLogo(logoType),
    onSuccess: (data, logoType) => {
      console.log(`✅ ${logoType} logo deleted successfully`);
      if (logoType === 'header') {
        setHeaderLogoPreview('');
      } else {
        setInvoiceLogoPreview('');
      }
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (error) => {
      console.error('❌ Failed to delete logo:', error);
      alert('Failed to delete logo. Please try again.');
    }
  });

  // Validate logo file
  const validateLogoFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 2MB');
      return false;
    }

    return true;
  };

  // Handle header logo selection and upload
  const handleHeaderLogoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateLogoFile(file)) {
      try {
        // If replacing an existing logo, delete the old one first
        if (headerLogoPreview) {
          console.log('🔄 Replacing existing header logo - deleting old one first');
          await deleteLogoMutation.mutateAsync('header');
        }
        
        // Upload to Supabase Storage
        await uploadHeaderLogoMutation.mutateAsync(file);
      } catch (error) {
        setHeaderLogoPreview(''); // Clear preview on error
        console.error('❌ Failed to upload/replace header logo:', error);
      }
    }
    // Reset input
    event.target.value = '';
  };

  // Handle invoice logo selection and upload
  const handleInvoiceLogoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateLogoFile(file)) {
      try {
        // If replacing an existing logo, delete the old one first
        if (invoiceLogoPreview) {
          console.log('🔄 Replacing existing invoice logo - deleting old one first');
          await deleteLogoMutation.mutateAsync('invoice');
        }
        
        // Upload to Supabase Storage
        await uploadInvoiceLogoMutation.mutateAsync(file);
      } catch (error) {
        setInvoiceLogoPreview(''); // Clear preview on error
        console.error('❌ Failed to upload/replace invoice logo:', error);
      }
    }
    // Reset input
    event.target.value = '';
  };

  // Set logo previews from company settings
  const setLogoPreviews = (companySettings: any) => {
    const headerUrl = companySettings.header_logo_url || '';
    const invoiceUrl = companySettings.invoice_logo_url || '';
    
    console.log('🔄 setLogoPreviews called with:');
    console.log('  - headerUrl:', headerUrl);
    console.log('  - invoiceUrl:', invoiceUrl);
    
    setHeaderLogoPreview(headerUrl);
    setInvoiceLogoPreview(invoiceUrl);
    
    console.log('✅ Logo previews updated');
  };

  return {
    // State
    headerLogoFile,
    headerLogoPreview,
    invoiceLogoFile,
    invoiceLogoPreview,
    
    // Actions
    handleHeaderLogoSelect,
    handleInvoiceLogoSelect,
    setLogoPreviews,
    
    // Mutations
    uploadHeaderLogoMutation,
    uploadInvoiceLogoMutation,
    deleteLogoMutation,
    
    // Utilities
    validateLogoFile,
  };
};
