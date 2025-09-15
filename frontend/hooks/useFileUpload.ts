import { useState, useCallback } from 'react';
import { FileUploadStatus } from '@/types';
import { API_CONFIG, ERROR_MESSAGES } from '@/lib/constants';

export interface UseFileUploadReturn {
  uploadStatus: FileUploadStatus;
  validateFile: (file: File) => { isValid: boolean; error?: string };
  resetUpload: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>({
    uploading: false,
    progress: 0,
  });

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > API_CONFIG.maxFileSize) {
      return { isValid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
    }

    // Check file is not empty
    if (file.size === 0) {
      return { isValid: false, error: 'File cannot be empty' };
    }

    return { isValid: true };
  }, []);

  const resetUpload = useCallback(() => {
    setUploadStatus({
      uploading: false,
      progress: 0,
      error: undefined,
    });
  }, []);

  return {
    uploadStatus,
    validateFile,
    resetUpload,
  };
};