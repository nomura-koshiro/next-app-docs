import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { getCsrfHeaderName, getCsrfToken } from '@/lib/csrf';

/**
 * API エラーレスポンスの型定義
 */
export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

/**
 * リクエストインターセプター
 * - Accept ヘッダーを設定
 * - Cookie を含むリクエストを有効化
 * - CSRFトークンをヘッダーに追加
 */
const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.headers !== undefined) {
    config.headers.Accept = 'application/json';

    // CSRFトークンをヘッダーに追加
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers[getCsrfHeaderName()] = csrfToken;
    }
  }

  config.withCredentials = true;

  return config;
};

/**
 * Axios インスタンスの作成
 * - ベースURL: env.API_URL
 * - Cookie ベース認証を使用
 */
export const api = Axios.create({
  baseURL: env.API_URL,
});

// リクエストインターセプターを適用
api.interceptors.request.use(authRequestInterceptor);

// レスポンスインターセプターを適用
api.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<T>): T => {
    // 成功時はレスポンスデータのみを返す
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const message = error.response?.data?.message ?? error.message ?? 'エラーが発生しました';

    // クライアントサイドでエラーログ出力
    if (typeof window !== 'undefined') {
      console.error(`[APIエラー] ${message}`);
      // TODO: 通知システムと統合
      // useNotifications.getState().addNotification({
      //   type: 'error',
      //   title: 'Error',
      //   message,
      // });
    }

    // 401エラー時の処理（将来的にログインページへリダイレクト）
    // if (error.response?.status === 401) {
    //   const searchParams = new URLSearchParams();
    //   const redirectTo = searchParams.get('redirectTo') || window.location.pathname;
    //   window.location.href = paths.auth.login.getHref(redirectTo);
    // }

    return Promise.reject(error);
  }
);
