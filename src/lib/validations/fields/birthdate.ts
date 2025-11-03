/**
 * 生年月日フィールドのバリデーションスキーマ
 *
 * @module lib/validations/fields/birthdate
 */

import { z } from "zod";

/**
 * 生年月日のバリデーションスキーマ
 *
 * - 必須フィールド（空文字不可）
 * - 日付形式の検証は行わず、入力の有無のみチェック
 *
 * @example
 * ```typescript
 * // 有効な値
 * birthdateSchema.parse('1990-01-01')
 * birthdateSchema.parse('2000/12/31')
 *
 * // 無効な値
 * birthdateSchema.parse('') // エラー: 生年月日を入力してください
 * ```
 */
export const birthdateSchema = z.string().min(1, { message: "生年月日を入力してください" });
