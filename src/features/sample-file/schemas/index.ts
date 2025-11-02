/**
 * ファイル機能のZodスキーマ定義
 *
 * @module features/sample-file/schemas
 */

import { z } from "zod";

// ================================================================================
// 基本スキーマ
// ================================================================================

/**
 * ファイルタイプのスキーマ
 */
export const fileTypeSchema = z.enum(["csv", "excel", "json", "text", "image"]);

export type FileType = z.infer<typeof fileTypeSchema>;

/**
 * アップロードステータスのスキーマ
 */
export const uploadStatusSchema = z.enum(["pending", "uploading", "success", "error"]);

export type UploadStatus = z.infer<typeof uploadStatusSchema>;

// ================================================================================
// ドメインモデルスキーマ
// ================================================================================

/**
 * アップロード済みファイルのスキーマ
 */
export const uploadedFileSchema = z.object({
  file: z.instanceof(File),
  progress: z.number().min(0).max(100),
  status: uploadStatusSchema,
  error: z.string().optional(),
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;

/**
 * ダウンロード進捗のスキーマ
 */
export const downloadProgressSchema = z.object({
  fileType: fileTypeSchema.nullable(),
  progress: z.number().min(0).max(100),
});

export type DownloadProgress = z.infer<typeof downloadProgressSchema>;

/**
 * サンプルデータのスキーマ
 */
export const sampleDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
  department: z.string(),
  joinedDate: z.string(),
});

export type SampleData = z.infer<typeof sampleDataSchema>;

// ================================================================================
// レスポンススキーマ
// ================================================================================

/**
 * ファイルアップロード成功レスポンスのスキーマ
 */
export const uploadFileDetailSchema = z.object({
  id: z.string(),
  filename: z.string(),
  size: z.number().int().positive(),
  uploadedAt: z.string(),
});

export type UploadFileDetail = z.infer<typeof uploadFileDetailSchema>;
