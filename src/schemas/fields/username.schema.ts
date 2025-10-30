/**
 * ユーザー名フィールドのバリデーションスキーマ
 *
 * @module schemas/fields/username
 */

import { z } from 'zod';

/**
 * @example
 * ```typescript
 * // 有効な値
 * usernameSchema.parse('johndoe')
 * usernameSchema.parse('user123')
 * usernameSchema.parse('山田太郎')
 *
 * // 無効な値
 * usernameSchema.parse('ab') // エラー: ユーザー名は3文字以上で入力してください
 * usernameSchema.parse('a'.repeat(21)) // エラー: ユーザー名は20文字以内で入力してください
 * ```
 */
export const usernameSchema = z
  .string()
  .min(3, { message: 'ユーザー名は3文字以上で入力してください' })
  .max(20, { message: 'ユーザー名は20文字以内で入力してください' });
