/**
 * CSRF（Cross-Site Request Forgery）保護ユーティリティ
 *
 * FastAPIバックエンドとの連携を想定したCSRFトークン管理
 *
 * @see https://fastapi.tiangolo.com/tutorial/security/
 */

const CSRF_COOKIE_NAME = "csrftoken";
const CSRF_HEADER_NAME = "X-CSRF-Token";

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

export const getCsrfToken = (): string | null => {
  return getCookie(CSRF_COOKIE_NAME);
};

export const getCsrfHeaderName = (): string => {
  return CSRF_HEADER_NAME;
};
