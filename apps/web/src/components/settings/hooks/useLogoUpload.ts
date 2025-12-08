import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { company } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

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
      logger.debug('Header logo uploaded successfully', { logo_url: data.logo_url }, 'useLogoUpload');
      setHeaderLogoPreview(data.logo_url);
      setHeaderLogoFile(null);
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (error) => {
      logger.error('Failed to upload header logo', error, 'useLogoUpload');
      toast.error('Failed to upload header logo. Please try again.');
    }
  });

  // Invoice logo upload mutation
  const uploadInvoiceLogoMutation = useMutation({
    mutationFn: (file: File) => company.uploadLogo(file, 'invoice'),
    onSuccess: (data) => {
      logger.debug('Invoice logo uploaded successfully', { logo_url: data.logo_url }, 'useLogoUpload');
      setInvoiceLogoPreview(data.logo_url);
      setInvoiceLogoFile(null);
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (error) => {
      logger.error('Failed to upload invoice logo', error, 'useLogoUpload');
      toast.error('Failed to upload invoice logo. Please try again.');
    }
  });

  // Logo deletion mutations
  const deleteLogoMutation = useMutation({
    mutationFn: (logoType: 'header' | 'invoice') => company.deleteLogo(logoType),
    onSuccess: (_data, logoType) => {
      logger.debug(`${logoType} logo deleted successfully`, {}, 'useLogoUpload');
      if (logoType === 'header') {
        setHeaderLogoPreview('');
      } else {
        setInvoiceLogoPreview('');
      }
      queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
    },
    onError: (error) => {
      logger.error('Failed to delete logo', error, 'useLogoUpload');
      toast.error('Failed to delete logo. Please try again.');
    }
  });

  // Validate logo file
  const validateLogoFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB');
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
          logger.debug('Replacing existing header logo - deleting old one first', {}, 'useLogoUpload');
          await deleteLogoMutation.mutateAsync('header');
        }
        
        // Upload to Supabase Storage
        await uploadHeaderLogoMutation.mutateAsync(file);
      } catch (error) {
        setHeaderLogoPreview(''); // Clear preview on error
        logger.error('Failed to upload/replace header logo', error, 'useLogoUpload');
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
          logger.debug('Replacing existing invoice logo - deleting old one first', {}, 'useLogoUpload');
          await deleteLogoMutation.mutateAsync('invoice');
        }
        
        // Upload to Supabase Storage
        await uploadInvoiceLogoMutation.mutateAsync(file);
      } catch (error) {
        setInvoiceLogoPreview(''); // Clear preview on error
        logger.error('Failed to upload/replace invoice logo', error, 'useLogoUpload');
      }
    }
    // Reset input
    event.target.value = '';
  };

  // Set logo previews from company settings
  const setLogoPreviews = (companySettings: Record<string, unknown>) => {
    const headerUrl = (companySettings.header_logo_url as string) || '';
    const invoiceUrl = (companySettings.invoice_logo_url as string) || '';
    
    setHeaderLogoPreview(headerUrl);
    setInvoiceLogoPreview(invoiceUrl);
    
    logger.debug('Logo previews updated', { headerUrl, invoiceUrl }, 'useLogoUpload');
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
