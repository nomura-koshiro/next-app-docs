/**
 * CSRF トークンバリデーションスキーマ
 *
 * クッキーから取得したCSRFトークンのランタイムバリデーション用スキーマ
 * 不正なトークンや空のトークンを検出し、セキュリティを向上
 */

import { z } from "zod";

/**
 * CSRF トークンスキーマ
 *
 * CSRFトークンは通常、ランダムな文字列（英数字、ハイフン、アンダースコアなど）
 * 最小限の長さチェックと文字種制限を実施
 *
 * @example
 * 正しいCSRFトークン:
 * - "abc123def456ghi789"
 * - "csrf_token_1234567890"
 * - "a1b2-c3d4-e5f6-g7h8"
 *
 * @example
 * 不正なCSRFトークン（バリデーションエラー）:
 * - "" (空文字列)
 * - "   " (空白のみ)
 * - "短い" (長さ不足)
 */
export const CsrfTokenSchema = z
  .string()
  .min(1, "CSRFトークンは必須です")
  .trim() // 前後の空白を削除
  .min(8, "CSRFトークンは8文字以上である必要があります") // 最小長チェック
  .regex(
    /^[\w-]+$/,
    "CSRFトークンは英数字、ハイフン、アンダースコアのみを含む必要があります"
  );

/**
 * 型推論
 */
export type CsrfToken = z.infer<typeof CsrfTokenSchema>;
