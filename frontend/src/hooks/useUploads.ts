import { useQuery, useMutation } from '@tanstack/react-query';
// TODO: Update to use enhanced API for file uploads
// import { enhancedApi } from '@/lib/enhanced-api';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { FileUploadData } from '@/lib/validation';
import { presignUpload } from '@/lib/upload-service';
import { logger } from '@/utils/logger';

// Hook to get presigned upload URL
export const usePresignedUpload = (filename: string, contentType: string) => {
  return useQuery({
    queryKey: queryKeys.uploads.presignedUrl(filename),
    queryFn: () => presignUpload(filename, contentType),
    enabled: !!filename && !!contentType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to upload file
export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (fileData: FileUploadData) => {
      try {
        const presignedData = await presignUpload(
          fileData.file.name,
          fileData.file.type
        );
        
        const uploadResponse = await fetch(presignedData.uploadUrl, {
          method: presignedData.method,
          headers: presignedData.headers,
          body: fileData.file,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }
        
        return {
          fileUrl: presignedData.fileUrl,
          filename: fileData.file.name,
          description: fileData.description,
        };
      } catch (error) {
        logger.error('File upload failed', { fileName: fileData.file.name, error }, 'useUploadFile');
        throw error;
      }
    },
    onSuccess: () => {
      invalidateQueries.uploads();
    },
  });
};

// Hook to upload multiple files
export const useUploadMultipleFiles = () => {
  
  return useMutation({
    mutationFn: async (files: FileUploadData[]) => {
      try {
        const uploadPromises = files.map(async (fileData) => {
          try {
            const presignedData = await presignUpload(
              fileData.file.name,
              fileData.file.type
            );
            
            const uploadResponse = await fetch(presignedData.uploadUrl, {
              method: presignedData.method,
              headers: presignedData.headers,
              body: fileData.file,
            });
            
            if (!uploadResponse.ok) {
              throw new Error(`Upload failed for ${fileData.file.name}`);
            }
            
            return {
              fileUrl: presignedData.fileUrl,
              filename: fileData.file.name,
              description: fileData.description,
            };
          } catch (error) {
            logger.error('File upload failed', { fileName: fileData.file.name, error }, 'useUploadMultipleFiles');
            throw error;
          }
        });
        
        return await Promise.all(uploadPromises);
      } catch (error) {
        logger.error('One or more uploads failed', { fileCount: files.length, error }, 'useUploadMultipleFiles');
        throw error;
      }
    },
    onSuccess: () => {
      invalidateQueries.uploads();
    },
  });
};
