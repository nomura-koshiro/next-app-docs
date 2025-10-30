import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { msalInstance } from '@/app/provider';
import { env } from '@/config/env';
import { loginRequest } from '@/config/msal';
import { getCsrfHeaderName, getCsrfToken } from '@/lib/csrf';
import { MOCK_AUTH } from '@/mocks/handlers/api/v1/auth-handlers';

// ================================================================================
// RFC 9457: Problem Details for HTTP APIs
// ================================================================================

/**
 * RFC 9457: Problem Details for HTTP APIs
 *
 * @see https://www.rfc-editor.org/rfc/rfc9457.html
 */
export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
};

/**
 * エラータイプ定数（型安全なエラー判定用）
 */
export const ProblemTypes = {
  // 認証エラー
  UNAUTHORIZED: 'https://api.example.com/problems/unauthorized',
  FORBIDDEN: 'https://api.example.com/problems/forbidden',
  TOKEN_EXPIRED: 'https://api.example.com/problems/token-expired',

  // バリデーションエラー
  VALIDATION_ERROR: 'https://api.example.com/problems/validation-error',
  INVALID_REQUEST: 'https://api.example.com/problems/invalid-request',

  // ビジネスロジックエラー
  RESOURCE_NOT_FOUND: 'https://api.example.com/problems/resource-not-found',
  DUPLICATE_RESOURCE: 'https://api.example.com/problems/duplicate-resource',
  INSUFFICIENT_CREDIT: 'https://api.example.com/problems/insufficient-credit',

  // サーバーエラー
  INTERNAL_SERVER_ERROR: 'https://api.example.com/problems/internal-server-error',
  SERVICE_UNAVAILABLE: 'https://api.example.com/problems/service-unavailable',

  // デフォルト
  ABOUT_BLANK: 'about:blank',
} as const;

export type ProblemType = (typeof ProblemTypes)[keyof typeof ProblemTypes];

// ================================================================================
// ApiError Class
// ================================================================================

/**
 * RFC 9457 Problem Details を扱いやすくするラッパー
 */
export class ApiError extends Error {
  public readonly problemDetails: ProblemDetails;
  public readonly status: number;
  public readonly originalError: AxiosError<ProblemDetails>;

  constructor(axiosError: AxiosError<ProblemDetails>) {
    const problemDetails = axiosError.response?.data ?? {};
    const message = problemDetails.detail ?? problemDetails.title ?? axiosError.message ?? 'エラーが発生しました';

    super(message);

    this.name = 'ApiError';
    this.problemDetails = problemDetails;
    this.status = axiosError.response?.status ?? 0;
    this.originalError = axiosError;

    // スタックトレースを正しく保持
    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  get type(): string {
    return this.problemDetails.type ?? 'about:blank';
  }

  get title(): string {
    return this.problemDetails.title ?? 'エラー';
  }

  get detail(): string {
    return this.problemDetails.detail ?? this.message;
  }

  get instance(): string | undefined {
    return this.problemDetails.instance;
  }

  /**
   * @example
   * const validationErrors = error.getExtension<Record<string, string[]>>('errors');
   */
  getExtension<T = unknown>(key: string): T | undefined {
    return this.problemDetails[key] as T;
  }

  /**
   * @example
   * if (error.isType(ProblemTypes.VALIDATION_ERROR)) {
   *   // バリデーションエラー固有の処理
   * }
   */
  isType(typeUri: string): boolean {
    return this.type === typeUri;
  }

  /**
   * @example
   * if (error.isStatus(403)) {
   *   // 403エラー固有の処理
   * }
   */
  isStatus(statusCode: number): boolean {
    return this.status === statusCode;
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  toJSON(): ProblemDetails {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
      ...this.problemDetails,
    };
  }
}

// ================================================================================
// Token Service
// ================================================================================

/**
 * トークンサービスのインターフェース
 */
export type TokenService = {
  getAccessToken: () => Promise<string | null>;
};

/**
 * 本番環境用のトークンサービス
 *
 * MSALからアクセストークンを取得します。
 */
class ProductionTokenService implements TokenService {
  async getAccessToken(): Promise<string | null> {
    if (!msalInstance) {
      console.error('[TokenService] MSAL instance is not initialized');

      return null;
    }

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      console.warn('[TokenService] No accounts found');

      return null;
    }

    return msalInstance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => response.accessToken)
      .catch((error) => {
        console.error('[TokenService] Token acquisition failed:', error);

        return null;
      });
  }
}

/**
 * 開発環境用のトークンサービス
 *
 * モックトークンを返します。
 */
class DevelopmentTokenService implements TokenService {
  async getAccessToken(): Promise<string | null> {
    return MOCK_AUTH.TOKEN;
  }
}

/**
 * トークンサービスのインスタンス
 *
 * 環境変数に応じて適切な実装を提供します。
 */
export const tokenService: TokenService = env.AUTH_MODE === 'production' ? new ProductionTokenService() : new DevelopmentTokenService();

// ================================================================================
// Axios Instance Configuration
// ================================================================================

/**
 * すべてのAxiosリクエストに以下の処理を適用:
 * - Accept ヘッダーを設定（RFC 9457 準拠）
 * - Bearer Token認証対応（Azure AD）
 * - Cookie を含むリクエストを有効化
 * - CSRFトークンをヘッダーに追加
 */
const authRequestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  if (config.headers !== undefined) {
    // Acceptヘッダーを設定（RFC 9457準拠）
    config.headers.Accept = 'application/problem+json, application/json';

    // Bearer Token認証
    const token = await tokenService.getAccessToken();
    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRFトークンをヘッダーに追加
    const csrfToken = getCsrfToken();
    if (csrfToken !== null) {
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

// リクエストインターセプター
api.interceptors.request.use(authRequestInterceptor);

// レスポンスインターセプター
api.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<T>): T => {
    return response.data;
  },
  async (error: AxiosError<ProblemDetails>) => {
    // ApiErrorクラスでラップ
    const apiError = new ApiError(error);

    // クライアントサイドでのエラーログ
    if (typeof window !== 'undefined') {
      console.error('[API Error]', {
        type: apiError.type,
        title: apiError.title,
        detail: apiError.detail,
        status: apiError.status,
        instance: apiError.instance,
        problemDetails: apiError.toJSON(),
      });
    }

    // 401エラー時の自動ログアウト・リダイレクト
    if (apiError.isStatus(401) && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;

      if (currentPath !== '/login') {
        try {
          // ストアをクリア（awaitで完了を待つ）
          const { useAuthStore } = await import('@/features/auth/stores/auth-store');
          useAuthStore.getState().logout();

          // 認証状態のクリアが完了してからリダイレクト
          window.location.href = '/login';
        } catch (err) {
          console.error('[API Client] 認証エラー処理に失敗:', err);
          // フォールバック：強制的にログインページへ
          window.location.href = '/login';
        }
      }
    }

    // ApiErrorをreject
    return Promise.reject(apiError);
  }
);
