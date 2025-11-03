/**
 * ファイルAPI レスポンススキーマ
 *
 * APIから返されるレスポンスデータのランタイムバリデーション用スキーマ
 *
 * @module features/sample-file/types/api
 */

import { z } from "zod";

/**
 * ファイルアップロード出力スキーマ
 *
 * POST /api/v1/sample/files/upload のレスポンス
 */
export const uploadFileOutputSchema = z.object({
  id: z.string().min(1, "ファイルIDは必須です"),
  filename: z.string().min(1, "ファイル名は必須です"),
  size: z.number().int().nonnegative("ファイルサイズは0以上でなければなりません"),
  uploadedAt: z.string().min(1, "アップロード日時は必須です"),
});

/**
 * 型推論
 */
export type UploadFileOutput = z.infer<typeof uploadFileOutputSchema>;
