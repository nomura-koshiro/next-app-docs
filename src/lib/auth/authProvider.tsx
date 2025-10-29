'use client';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import type { ReactNode } from 'react';

import { env } from '@/config/env';

import { msalConfig } from './msalConfig';

// MSALインスタンス（本番モードのみ初期化）
let msalInstance: PublicClientApplication | null = null;

if (env.AUTH_MODE === 'production') {
  msalInstance = new PublicClientApplication(msalConfig);
}

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * 認証プロバイダー
 *
 * 環境変数AUTH_MODEによって以下を切り替え:
 * - production: MSALProviderでラップ（Azure AD認証）
 * - development: そのまま子要素を返す（モック認証）
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 開発モードの場合はMSALを使わない
  if (env.AUTH_MODE === 'development') {
    return <>{children}</>;
  }

  // 本番モードの場合はMSALProviderでラップ
  if (!msalInstance) {
    throw new Error('MSAL instance is not initialized in production mode');
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

// MSALインスタンスをエクスポート（他のモジュールで使用）
export { msalInstance };
