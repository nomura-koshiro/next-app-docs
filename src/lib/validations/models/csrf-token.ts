/**
 * CSRFトークンバリデーションスキーマ
 *
 * クッキーから取得したCSRFトークンのランタイムバリデーション用スキーマ。
 * 不正なトークンや空のトークンを検出し、セキュリティを向上します。
 *
 * @module lib/validations/models/csrf-token
 */

import { z } from "zod";

/**
 * CSRFトークンバリデーションスキーマ
 *
 * CSRFトークンは通常、ランダムな文字列（英数字、ハイフン、アンダースコアなど）。
 * 最小限の長さチェックと文字種制限を実施します。
 *
 * @example
 * ```typescript
 * // 有効な値
 * csrfTokenSchema.parse('abc123def456ghi789')
 * csrfTokenSchema.parse('csrf_token_1234567890')
 * csrfTokenSchema.parse('a1b2-c3d4-e5f6-g7h8')
 *
 * // 無効な値
 * csrfTokenSchema.parse('') // エラー: CSRFトークンは必須です
 * csrfTokenSchema.parse('   ') // エラー: CSRFトークンは8文字以上である必要があります
 * csrfTokenSchema.parse('短い') // エラー: CSRFトークンは8文字以上である必要があります
 * ```
 */
export const csrfTokenSchema = z
  .string()
  .min(1, "CSRFトークンは必須です")
  .trim() // 前後の空白を削除
  .min(8, "CSRFトークンは8文字以上である必要があります") // 最小長チェック
  .regex(/^[\w-]+$/, "CSRFトークンは英数字、ハイフン、アンダースコアのみを含む必要があります");

/**
 * CSRFトークン型
 */
export type CsrfToken = z.infer<typeof csrfTokenSchema>;
