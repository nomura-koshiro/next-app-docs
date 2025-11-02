import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

// ================================================================================
// Types
// ================================================================================

/**
 * アップロードされたファイルの詳細情報
 */
export type UploadFileDetail = {
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
};

// ================================================================================
// API関数
// ================================================================================

export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<UploadFileDetail> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api
    .post("/api/v1/sample/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total != null && progressEvent.total > 0) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    })
    .catch((error) => {
      logger.error("ファイルのアップロードに失敗しました", error);
      throw error;
    });

  return response as unknown as UploadFileDetail;
};

/**
 * @example
 * ```tsx
 * const result = await uploadFileSimple(file)
 * console.log(result.id) // アップロードされたファイルのID
 * ```
 */
export const uploadFileSimple = async (file: File): Promise<UploadFileDetail> => {
  return uploadFile(file);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUploadFileOptions = {
  mutationConfig?: MutationConfig<typeof uploadFileSimple>;
};

/**
 * @example
 * ```tsx
 * const { mutate, isPending } = useUploadFile()
 * mutate(file)
 * ```
 */
export const useUploadFile = ({ mutationConfig }: UseUploadFileOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: uploadFileSimple,
  });
};
