/**
 * 名前フィールドのバリデーションスキーマ
 *
 * @module lib/validations/fields/name
 */

import { z } from "zod";

/**
 * 名前バリデーションスキーマ
 *
 * ユーザー名や表示名などに使用する汎用的な名前フィールドのバリデーション。
 * 空文字列を許容せず、最大100文字までの制限を設けています。
 *
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
