/**
 * CSRF（Cross-Site Request Forgery）保護ユーティリティ
 *
 * FastAPIバックエンドとの連携を想定したCSRFトークン管理
 *
 * @see https://fastapi.tiangolo.com/tutorial/security/
 */

const CSRF_COOKIE_NAME = 'csrftoken';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Cookieから値を取得する
 *
 * @param name - Cookieの名前
 * @returns Cookieの値、存在しない場合はnull
 */
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }

  return null;
};

/**
 * CSRFトークンをCookieから取得する
 *
 * @returns CSRFトークン、存在しない場合はnull
 */
export const getCsrfToken = (): string | null => {
  return getCookie(CSRF_COOKIE_NAME);
};

/**
 * CSRFトークンのヘッダー名を取得する
 *
 * @returns CSRFトークンのヘッダー名
 */
export const getCsrfHeaderName = (): string => {
  return CSRF_HEADER_NAME;
};
