import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presignUpload } from '@/lib/api';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { FileUploadData } from '@/lib/validation';

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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fileData: FileUploadData) => {
      // Get presigned URL
      const presignedData = await presignUpload(
        fileData.file.name,
        fileData.file.type
      );
      
      // Upload file to presigned URL
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
    },
    onSuccess: () => {
      invalidateQueries.uploads();
    },
  });
};

// Hook to upload multiple files
export const useUploadMultipleFiles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (files: FileUploadData[]) => {
      const uploadPromises = files.map(async (fileData) => {
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
      });
      
      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      invalidateQueries.uploads();
    },
  });
};
