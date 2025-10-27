import { AxiosError } from 'axios';

import type { ApiErrorResponse } from '@/lib/api-client';

/**
 * 非同期処理の結果を型安全にハンドリングするためのユーティリティ型
 */
export type AsyncResult<T> = [T, null] | [null, Error];

/**
 * 非同期処理を実行し、エラーを安全にハンドリングする
 *
 * @example
 * ```typescript
 * const [data, error] = await handleAsync(fetchUser(userId));
 *
 * if (error) {
 *   console.error('Failed to fetch user:', error);
 *   return;
 * }
 *
 * // dataは型安全に使用可能
 * console.log(data.name);
 * ```
 */
export const handleAsync = async <T>(promise: Promise<T>): Promise<AsyncResult<T>> => {
  try {
    const data = await promise;

    return [data, null];
  } catch (error) {
    if (error instanceof Error) {
      return [null, error];
    }

    return [null, new Error(String(error))];
  }
};

/**
 * Axiosエラーからユーザーフレンドリーなエラーメッセージを抽出する
 *
 * @example
 * ```typescript
 * try {
 *   await api.post('/users', data);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   alert(message);
 * }
 * ```
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse | undefined;

    return apiError?.message ?? error.message ?? 'エラーが発生しました';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

/**
 * エラーがAxiosエラーかどうかを判定する型ガード
 *
 * @example
 * ```typescript
 * if (isAxiosError(error)) {
 *   console.log('Status:', error.response?.status);
 * }
 * ```
 */
export const isAxiosError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
  return error instanceof AxiosError;
};

/**
 * エラーが特定のHTTPステータスコードかどうかを判定する
 *
 * @example
 * ```typescript
 * if (isHttpError(error, 404)) {
 *   console.log('Not found');
 * }
 *
 * if (isHttpError(error, [401, 403])) {
 *   console.log('Unauthorized or Forbidden');
 * }
 * ```
 */
export const isHttpError = (error: unknown, status: number | number[]): boolean => {
  if (!isAxiosError(error)) {
    return false;
  }

  const errorStatus = error.response?.status;
  if (errorStatus === undefined) {
    return false;
  }

  if (Array.isArray(status)) {
    return status.includes(errorStatus);
  }

  return errorStatus === status;
};
