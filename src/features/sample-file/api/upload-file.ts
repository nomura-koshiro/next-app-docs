import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';

// ================================================================================
// Types
// ================================================================================

export type UploadFileResponse = {
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
};

// ================================================================================
// API Functions
// ================================================================================

/**
 * ファイルをアップロード
 *
 * @param file - アップロードするファイル
 * @param onProgress - アップロード進捗コールバック（0-100）
 * @returns アップロード結果
 */
export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return await api
    .post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total != null && progressEvent.total > 0) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    })
    .then((response) => {
      // api-clientのインターセプターがresponse.dataを返すため、型アサーションが必要
      return response as UploadFileResponse;
    })
    .catch((error) => {
      console.error('File upload failed:', error);
      throw error;
    });
};

/**
 * ファイルをアップロード（進捗コールバックなし）
 */
export const uploadFileSimple = async (file: File): Promise<UploadFileResponse> => {
  return uploadFile(file);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUploadFileOptions = {
  mutationConfig?: MutationConfig<typeof uploadFileSimple>;
};

export const useUploadFile = ({ mutationConfig }: UseUploadFileOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: uploadFileSimple,
  });
};
