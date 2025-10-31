/**
 * 国選択フィールドのバリデーションスキーマ
 *
 * @module schemas/fields/country
 */

import { z } from "zod";

/**
 * 国選択のバリデーションスキーマ
 *
 * - 必須フィールド（空文字不可）
 * - 国コードまたは国名の選択を要求
 *
 * @example
 * ```typescript
 * // 有効な値
 * countrySchema.parse('JP')
 * countrySchema.parse('日本')
 *
 * // 無効な値
 * countrySchema.parse('') // エラー: 国を選択してください
 * ```
 */
export const countrySchema = z.string().min(1, { message: "国を選択してください" });
