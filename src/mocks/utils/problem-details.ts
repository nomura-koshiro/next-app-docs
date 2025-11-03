/**
 * RFC 9457 Problem Details for HTTP APIs
 *
 * @see https://www.rfc-editor.org/rfc/rfc9457.html
 */

import { HttpResponse } from "msw";

/**
 * RFC 9457 Problem Details型
 *
 * @property type - 問題タイプを識別するURI（デフォルト: "about:blank"）
 * @property title - 人間が読める短い問題の要約
 * @property status - HTTPステータスコード
 * @property detail - 問題の詳細説明（オプション）
 * @property instance - 問題が発生した特定のリソース（オプション）
 */
export type ProblemDetails = {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
};

/**
 * RFC 9457準拠のエラーレスポンスを作成
 *
 * @param problem - Problem Details オブジェクト
 * @returns MSW HttpResponse
 *
 * @example
 * ```typescript
 * return problemResponse({
 *   title: "User not found",
 *   status: 404,
 *   detail: "The requested user with id 'user-123' was not found",
 *   instance: "/api/v1/users/user-123"
 * });
 * ```
 */
export const problemResponse = (problem: ProblemDetails): ReturnType<typeof HttpResponse.json> => {
  const { type = "about:blank", title, status, detail, instance, ...extensions } = problem;

  return HttpResponse.json(
    {
      type,
      title,
      status,
      ...(detail && { detail }),
      ...(instance && { instance }),
      ...extensions,
    },
    {
      status,
      headers: {
        "Content-Type": "application/problem+json",
      },
    }
  );
};

/**
 * 404 Not Found エラーレスポンスのヘルパー
 */
export const notFoundResponse = (resource: string, id: string, instance?: string): ReturnType<typeof HttpResponse.json> => {
  return problemResponse({
    title: `${resource} not found`,
    status: 404,
    detail: `The requested ${resource.toLowerCase()} with id '${id}' was not found`,
    instance,
  });
};

/**
 * 401 Unauthorized エラーレスポンスのヘルパー
 */
export const unauthorizedResponse = (detail?: string, instance?: string): ReturnType<typeof HttpResponse.json> => {
  return problemResponse({
    title: "Unauthorized",
    status: 401,
    detail: detail ?? "Authentication is required to access this resource",
    instance,
  });
};

/**
 * 400 Bad Request エラーレスポンスのヘルパー
 */
export const badRequestResponse = (detail: string, instance?: string): ReturnType<typeof HttpResponse.json> => {
  return problemResponse({
    title: "Bad Request",
    status: 400,
    detail,
    instance,
  });
};

/**
 * 409 Conflict エラーレスポンスのヘルパー
 */
export const conflictResponse = (detail: string, instance?: string): ReturnType<typeof HttpResponse.json> => {
  return problemResponse({
    title: "Conflict",
    status: 409,
    detail,
    instance,
  });
};
