/**
 * 利用規約・チェックボックスフィールドのバリデーションスキーマ
 *
 * @module schemas/fields/terms
 */

import { z } from 'zod';

/**
 * @example
 * ```typescript
 * // 有効な値
 * termsSchema.parse(true)
 *
 * // 無効な値
 * termsSchema.parse(false) // エラー: 利用規約に同意する必要があります
 * ```
 */
export const termsSchema = z.boolean().refine((val) => val === true, {
  message: '利用規約に同意する必要があります',
});

/**
 * @example
 * ```typescript
 * // すべて有効な値
 * optionalCheckboxSchema.parse(true)
 * optionalCheckboxSchema.parse(false)
 * optionalCheckboxSchema.parse(undefined)
 * ```
 */
export const optionalCheckboxSchema = z.boolean().optional();
