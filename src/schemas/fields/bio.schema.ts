/**
 * 自己紹介フィールドのバリデーションスキーマ
 *
 * @module schemas/fields/bio
 */

import { z } from 'zod';

/**
 * 自己紹介のバリデーションスキーマ
 *
 * - 10文字以上500文字以内
 * - ユーザープロフィールなどで使用
 *
 * @example
 * ```typescript
 * // 有効な値
 * bioSchema.parse('こんにちは。エンジニアとして働いています。')
 *
 * // 無効な値
 * bioSchema.parse('短い') // エラー: 自己紹介は10文字以上で入力してください
 * bioSchema.parse('a'.repeat(501)) // エラー: 自己紹介は500文字以内で入力してください
 * ```
 */
export const bioSchema = z
  .string()
  .min(10, { message: '自己紹介は10文字以上で入力してください' })
  .max(500, { message: '自己紹介は500文字以内で入力してください' });
