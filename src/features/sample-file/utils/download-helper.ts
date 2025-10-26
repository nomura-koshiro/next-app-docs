import { format } from 'date-fns';
import { saveAs } from 'file-saver';

import { api } from '@/lib/api-client';

/**
 * Blobをファイルとしてダウンロード
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  saveAs(blob, filename);
};

/**
 * タイムスタンプ付きファイル名を生成
 */
export const generateFilename = (baseName: string, extension: string): string => {
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');

  return `${baseName}_${timestamp}.${extension}`;
};

/**
 * API経由でファイルをダウンロード（進捗コールバック付き）
 */
export const downloadFromApi = async (url: string, filename: string, onProgress?: (progress: number) => void): Promise<void> => {
  await api
    .get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total != null && progressEvent.total > 0) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    })
    .then((blob) => {
      // api-clientのインターセプターがresponse.dataを返すため、Blobとして扱う
      downloadBlob(blob as Blob, filename);
    })
    .catch((error) => {
      console.error('Download failed:', error);
      throw error;
    });
};
