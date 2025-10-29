import { Configuration, LogLevel } from '@azure/msal-browser';

import { env } from '@/config/env';

/**
 * MSAL (Microsoft Authentication Library) 設定
 *
 * Azure Entra ID (旧Azure AD) 認証のための設定
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: env.AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${env.AZURE_TENANT_ID}`,
    redirectUri: env.AZURE_REDIRECT_URI || env.APP_URL,
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage', // セッションストレージにトークンを保存
    storeAuthStateInCookie: false, // Cookieに認証状態を保存しない
  },
  system: {
    loggerOptions: {
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.Info : LogLevel.Error,
      piiLoggingEnabled: false, // 個人識別情報のログを無効化
    },
  },
};

/**
 * ログインリクエストの設定
 *
 * 必要なスコープ（権限）を定義
 */
export const loginRequest = {
  scopes: ['User.Read', `api://${env.AZURE_CLIENT_ID}/access_as_user`],
};
