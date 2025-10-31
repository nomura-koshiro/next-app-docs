/**
 * パスワードフィールドのバリデーションスキーマ
 *
 * @module schemas/fields/password
 */

import { z } from "zod";

/**
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
