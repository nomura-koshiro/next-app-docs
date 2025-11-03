/**
 * CSRF（Cross-Site Request Forgery）保護ユーティリティ
 *
 * FastAPIバックエンドとの連携を想定したCSRFトークン管理
 * Zodスキーマによるトークンバリデーションを実装
 *
 * @see https://fastapi.tiangolo.com/tutorial/security/
 */

import { CsrfTokenSchema } from "./schemas/csrf-token.schema";

const CSRF_COOKIE_NAME = "csrftoken";
const CSRF_HEADER_NAME = "X-CSRF-Token";

/**
 * クッキーから値を取得する内部ヘルパー関数
 *
 * @param name - クッキー名
 * @returns クッキー値、または null
 */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }

  return null;
};

/**
 * CSRFトークンを取得し、バリデーション実行
 *
 * クッキーから取得したCSRFトークンをZodスキーマで検証
 * 不正なトークンの場合はnullを返す
 *
 * @returns 検証済みCSRFトークン、または null（トークンなし/不正な場合）
 *
 * @example
 * ```typescript
 * const csrfToken = getCsrfToken();
 * if (csrfToken) {
 *   // トークンは検証済み、安全に使用可能
 *   config.headers["X-CSRF-Token"] = csrfToken;
 * }
 * ```
 */
export const getCsrfToken = (): string | null => {
  const rawToken = getCookie(CSRF_COOKIE_NAME);
  if (!rawToken) return null;

  // ✅ Zodスキーマでバリデーション
  const result = CsrfTokenSchema.safeParse(rawToken);

  if (!result.success) {
    console.warn(`[CSRF] 不正なCSRFトークンを検出しました: ${result.error.message}`);

    return null;
  }

  return result.data;
};

/**
 * CSRFヘッダー名を取得
 *
 * @returns CSRFヘッダー名
 */
export const getCsrfHeaderName = (): string => {
  return CSRF_HEADER_NAME;
};

/**
 * CSRFクッキー名を取得（テスト・デバッグ用）
 *
 * @returns CSRFクッキー名
 */
export const getCsrfCookieName = (): string => {
  return CSRF_COOKIE_NAME;
};
