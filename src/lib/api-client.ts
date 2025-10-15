import Axios, { InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';

/**
 * リクエストインターセプター
 * - Accept ヘッダーを設定
 * - Cookie を含むリクエストを有効化
 */
const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.headers !== undefined) {
    config.headers.Accept = 'application/json';
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
  (response) => {
    // 成功時はレスポンスデータのみを返す
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data as any;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    const message = error.response?.data?.message ?? error.message ?? 'An error occurred';

    // クライアントサイドでエラーログ出力
    if (typeof window !== 'undefined') {
      console.error(`[API Error] ${message}`);
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
