// ================================================================================
// Imports
// ================================================================================

import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';

import { env } from '@/config/env';
import { loginRequest } from '@/lib/auth/msalConfig';
import { MOCK_AUTH } from '@/mocks/handlers/api/v1/auth-handlers';

import { useGetMe } from '../api/get-me';
import { useAuthStore } from '../stores/auth-store';

// ================================================================================
// 開発モード用フック
// ================================================================================

/**
 * 開発モード用のモック認証フック
 *
 * 注意: 自動ログイン機能は無効化されています。
 * Storybook環境でのテストを可能にするため、手動でログインする必要があります。
 */
const useMockAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  // 自動ログイン機能は無効化
  // Storybook環境でのテストを可能にするため、デコレーターやloaderで状態を制御します

  return {
    user,
    isAuthenticated,
    isLoading: false,
    login: () => {
      setUser(MOCK_AUTH.USER);
    },
    logout: () => logout(),
    getAccessToken: async () => MOCK_AUTH.TOKEN,
  };
};

// ================================================================================
// 本番モード用フック
// ================================================================================

/**
 * 本番モード用のMSAL認証フック
 *
 * Azure ADで認証し、バックエンドからユーザー情報を取得
 */
const useProductionAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const { setAccount, logout: clearAuth } = useAuthStore();
  const { data: userData, isLoading: isUserLoading } = useGetMe({
    enabled: accounts.length > 0,
  });

  useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [accounts, setAccount]);

  const login = () => {
    void instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    void instance.logoutRedirect();
    clearAuth();
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (accounts.length === 0) return null;

    return instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => response.accessToken)
      .catch((error) => {
        console.error('Token acquisition failed:', error);
        void instance.acquireTokenRedirect(loginRequest);

        return null;
      });
  };

  return {
    user: userData || null,
    isAuthenticated: accounts.length > 0,
    isLoading: inProgress !== 'none' || isUserLoading,
    login,
    logout,
    getAccessToken,
  };
};

// ================================================================================
// メインフック
// ================================================================================

/**
 * 認証フック
 *
 * 環境変数AUTH_MODEによって開発モード/本番モードを切り替え
 * - development: モック認証（自動ログイン）
 * - production: Azure AD認証（MSAL）
 */
export const useAuth = () => {
  const mockAuth = useMockAuth();
  const productionAuth = useProductionAuth();

  if (env.AUTH_MODE === 'development') {
    return mockAuth;
  } else {
    return productionAuth;
  }
};

// ================================================================================
// ユーティリティ関数
// ================================================================================

/**
 * アクセストークン取得関数（単独エクスポート）
 *
 * api-client.tsなどで使用
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (env.AUTH_MODE === 'development') {
    return MOCK_AUTH.TOKEN;
  }

  // 本番モードの場合はauthProvider.tsxで作成したインスタンスを再利用
  const { msalInstance } = await import('@/lib/auth/authProvider');

  if (!msalInstance) return null;

  const accounts = msalInstance.getAllAccounts();

  if (accounts.length === 0) return null;

  const { loginRequest } = await import('@/lib/auth/msalConfig');

  return msalInstance
    .acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    })
    .then((response) => response.accessToken)
    .catch((error) => {
      console.error('Token acquisition failed:', error);

      return null;
    });
};
