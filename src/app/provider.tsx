'use client';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { env } from '@/config/env';
import { msalConfig } from '@/config/msal';
import { MSWProvider } from '@/lib/msw';
import { queryConfig } from '@/lib/tanstack-query';

// ================================================================================
// MSAL Instance Initialization
// ================================================================================

// MSALインスタンス（本番モードのみ初期化）
const msalInstance: PublicClientApplication | null = env.AUTH_MODE === 'production' ? new PublicClientApplication(msalConfig) : null;

// MSALインスタンスをエクスポート（他のモジュールで使用）
export { msalInstance };

// ================================================================================
// Auth Provider
// ================================================================================

type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * 環境変数AUTH_MODEによって以下を切り替え:
 * - production: MSALProviderでラップ（Azure AD認証）
 * - development: そのまま子要素を返す（モック認証）
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  // 開発モードの場合はMSALを使わない
  if (env.AUTH_MODE === 'development') {
    return <>{children}</>;
  }

  // 本番モードの場合はMSALProviderでラップ
  if (!msalInstance) {
    throw new Error('本番モードでMSALインスタンスが初期化されていません');
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

// ================================================================================
// App Provider
// ================================================================================

type AppProviderProps = {
  children: React.ReactNode;
};

/**
 * アプリケーション全体で使用するプロバイダーをまとめて提供:
 * - MSWProvider: モックサーバー（開発環境のみ）
 * - AuthProvider: 認証プロバイダー
 * - ErrorBoundary: エラー境界
 * - QueryClientProvider: TanStack Query
 * - ReactQueryDevtools: クエリデバッグツール（開発環境のみ）
 */
export const AppProvider = ({ children }: AppProviderProps): React.ReactElement => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <MSWProvider>
      <AuthProvider>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
            {children}
          </QueryClientProvider>
        </ErrorBoundary>
      </AuthProvider>
    </MSWProvider>
  );
};
