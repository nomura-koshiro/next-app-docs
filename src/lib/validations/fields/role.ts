/**
 * ユーザーロールフィールドのバリデーションスキーマ
 *
 * @module lib/validations/fields/role
 */

import { z } from "zod";

/**
 * @example
 * ```typescript
 * // 有効な値
 * roleSchema.parse('user')
 * roleSchema.parse('admin')
 *
 * // 無効な値
 * roleSchema.parse('moderator') // エラー: ロールを選択してください
 * roleSchema.parse('') // エラー: ロールを選択してください
 * ```
 */
export const roleSchema = z.enum(["user", "admin"], {
  message: "ロールを選択してください",
});

export type Role = z.infer<typeof roleSchema>;
