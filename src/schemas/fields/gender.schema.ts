/**
 * 性別フィールドのバリデーションスキーマ
 *
 * @module schemas/fields/gender
 */

import { z } from "zod";

/**
 * 性別のバリデーションスキーマ
 *
 * - 'male', 'female', 'other' のいずれかを選択
 * - 必須フィールド
 *
 * @example
 * ```typescript
 * // 有効な値
 * genderSchema.parse('male')
 * genderSchema.parse('female')
 * genderSchema.parse('other')
 *
 * // 無効な値
 * genderSchema.parse('unknown') // エラー: 性別を選択してください
 * genderSchema.parse('') // エラー: 性別を選択してください
 * ```
 */
export const genderSchema = z.enum(["male", "female", "other"], {
  message: "性別を選択してください",
});

/**
 * 性別の型定義
 *
 * genderSchemaから推論される型（'male' | 'female' | 'other'）
 */
export type Gender = z.infer<typeof genderSchema>;
