/**
 * 名前フィールドのバリデーションスキーマ
 *
 * @module schemas/fields/name
 */

import { z } from "zod";

/**
 * @example
 * ```typescript
 * // 有効な値
 * nameSchema.parse('山田太郎')
 * nameSchema.parse('John Doe')
 * nameSchema.parse('田中')
 *
 * // 無効な値
 * nameSchema.parse('') // エラー: 名前は必須です
 * nameSchema.parse('a'.repeat(101)) // エラー: 名前は100文字以内で入力してください
 * ```
 */
export const nameSchema = z.string().min(1, { message: "名前は必須です" }).max(100, { message: "名前は100文字以内で入力してください" });
