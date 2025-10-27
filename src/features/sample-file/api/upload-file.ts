import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';
import { logger } from '@/utils/logger';

// ================================================================================
// 型定義
// ================================================================================

export type UploadFileResponse = {
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
};

// ================================================================================
// API関数
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
    .post('/api/v1/sample/files/upload', formData, {
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
      logger.error('ファイルのアップロードに失敗しました', error);
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
// フック
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
