/**
 * メールアドレスフィールドのバリデーションスキーマ
 *
 * @module schemas/fields/email
 */

import { z } from "zod";

/**
 * @example
 * ```typescript
 * // 有効な値
 * emailSchema.parse('user@example.com')
 * emailSchema.parse('test.user+tag@domain.co.jp')
 *
 * // 無効な値
 * emailSchema.parse('') // エラー: メールアドレスは必須です
 * emailSchema.parse('invalid') // エラー: 有効なメールアドレスを入力してください
 * emailSchema.parse('@example.com') // エラー: 有効なメールアドレスを入力してください
 * ```
 */
export const emailSchema = z
  .string()
  .min(1, { message: "メールアドレスは必須です" })
  .email({ message: "有効なメールアドレスを入力してください" });
