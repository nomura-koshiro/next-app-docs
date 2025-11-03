/**
 * メールアドレスフィールドのバリデーションスキーマ
 *
 * @module lib/validations/fields/email
 */

import { z } from "zod";

/**
 * メールアドレスバリデーションスキーマ
 *
 * 標準的なメールアドレス形式のバリデーションを実施します。
 * 空文字列を許容せず、RFC 5322準拠のメールアドレス形式を要求します。
 *
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
