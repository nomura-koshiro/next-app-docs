/**
 * 年齢フィールドのバリデーションスキーマ
 *
 * @module lib/validations/fields/age
 */

import { z } from "zod";

/**
 * @example
 * ```typescript
 * // 有効な値
 * ageSchema.parse('25') // '25'
 * ageSchema.parse('0')  // '0'
 *
 * // 無効な値
 * ageSchema.parse('-1')  // エラー: 0以上の数値を入力してください
 * ageSchema.parse('abc') // エラー: 0以上の数値を入力してください
 * ```
 */
export const ageSchema = z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
  message: "0以上の数値を入力してください",
});
