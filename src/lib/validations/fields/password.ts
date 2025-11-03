/**
 * パスワードフィールドのバリデーションスキーマ
 *
 * @module lib/validations/fields/password
 */

import { z } from "zod";

/**
 * パスワードバリデーションスキーマ（基本）
 *
 * 最小限のパスワードバリデーション。空文字列のみを拒否します。
 * より厳密なバリデーションが必要な場合は strongPasswordSchema を使用してください。
 *
 * @example
 * ```typescript
 * // 有効な値
 * passwordSchema.parse('password123')
 * passwordSchema.parse('p')
 *
 * // 無効な値
 * passwordSchema.parse('') // エラー: パスワードは必須です
 * ```
 */
export const passwordSchema = z.string().min(1, { message: "パスワードは必須です" });

/**
 * パスワードバリデーションスキーマ（強力）
 *
 * セキュリティを考慮した厳密なパスワードバリデーション。
 * 最小8文字で、英字と数字の両方を含むことを要求します。
 *
 * @example
 * ```typescript
 * // 有効な値
 * strongPasswordSchema.parse('Password123')
 * strongPasswordSchema.parse('myPass2024')
 *
 * // 無効な値
 * strongPasswordSchema.parse('short1') // エラー: パスワードは8文字以上で入力してください
 * strongPasswordSchema.parse('onlyletters') // エラー: パスワードは英字と数字を含む必要があります
 * strongPasswordSchema.parse('12345678') // エラー: パスワードは英字と数字を含む必要があります
 * ```
 */
export const strongPasswordSchema = z
  .string()
  .min(8, { message: "パスワードは8文字以上で入力してください" })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: "パスワードは英字と数字を含む必要があります",
  });
