/**
 * ファイルアップロードAPI レスポンススキーマ
 *
 * APIから返されるファイルアップロードデータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * ファイルアップロードレスポンススキーマ
 *
 * POST /api/v1/sample/files/upload のレスポンス
 */
export const UploadFileResponseSchema = z.object({
  id: z.string().min(1, "ファイルIDは必須です"),
  filename: z.string().min(1, "ファイル名は必須です"),
  size: z.number().int().nonnegative("ファイルサイズは0以上でなければなりません"),
  uploadedAt: z.string().min(1, "アップロード日時は必須です"),
});

/**
 * 型推論
 */
export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;
