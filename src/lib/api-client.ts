import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { getCsrfHeaderName, getCsrfToken } from '@/lib/csrf';
import { MOCK_AUTH } from '@/mocks/handlers/api/v1/auth-handlers';

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
 * - Bearer Token認証対応（Azure AD）
 * - Cookie を含むリクエストを有効化
 * - CSRFトークンをヘッダーに追加
 */
const authRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  if (config.headers !== undefined) {
    config.headers.Accept = 'application/json';

    // Bearer Token認証（Azure AD対応）
    if (env.AUTH_MODE === 'production') {
      // 本番モード: MSALからトークン取得
      try {
        const { getAccessToken } = await import('@/features/auth/hooks/use-auth');
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('[API Client] トークン取得エラー:', error);
      }
    } else {
      // 開発モード: モックトークン
      config.headers.Authorization = `Bearer ${MOCK_AUTH.TOKEN}`;
    }

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

    // 401エラー時はログインページへリダイレクト（ただし既にログインページにいる場合は除く）
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        // 認証ストアをクリア
        import('@/features/auth/stores/auth-store')
          .then(({ useAuthStore }) => {
            useAuthStore.getState().logout();
          })
          .catch((err) => {
            console.error('[API Client] ストアクリアエラー:', err);
          });
        // ログインページにリダイレクト
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
