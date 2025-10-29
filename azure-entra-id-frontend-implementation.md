# フロントエンド実装詳細（既存構造に合わせた形）

このドキュメントは、既存のCAMP_frontプロジェクト構造に合わせたAzure AD認証の実装詳細です。

---

## 1. APIクライアントの更新（Bearer Token対応）

**src/lib/api-client.ts（更新）**

```typescript
import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { getCsrfHeaderName, getCsrfToken } from '@/lib/csrf';

export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

/**
 * リクエストインターセプター
 * - Bearer Token認証対応（Azure AD）
 * - CSRF対応（既存機能）
 */
const authRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  if (config.headers !== undefined) {
    config.headers.Accept = 'application/json';

    // ✨ 追加: Azure AD Bearer Token
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
      const mockToken = 'mock-access-token-dev-12345';
      config.headers.Authorization = `Bearer ${mockToken}`;
    }

    // CSRF対応（既存）
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers[getCsrfHeaderName()] = csrfToken;
    }
  }

  config.withCredentials = true;
  return config;
};

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<T>): T => {
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const message = error.response?.data?.message ?? error.message ?? 'エラーが発生しました';

    if (typeof window !== 'undefined') {
      console.error(`[APIエラー] ${message}`);
    }

    // 401エラー時はログインページへリダイレクト
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
```

---

## 2. AppProviderの更新

**src/app/provider.tsx（更新）**

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { MSWProvider } from '@/lib/msw';
import { AuthProvider } from '@/lib/auth/authProvider'; // ✨ 追加
import { queryConfig } from '@/lib/tanstack-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps): React.ReactElement => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <MSWProvider>
      <AuthProvider> {/* ✨ 追加 */}
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
            {children}
          </QueryClientProvider>
        </ErrorBoundary>
      </AuthProvider> {/* ✨ 追加 */}
    </MSWProvider>
  );
};
```

---

## 3. 認証フィーチャーの実装

### Zustand認証ストア

**src/features/auth/stores/auth-store.ts（新規）**

```typescript
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AccountInfo } from '@azure/msal-browser';

export type User = {
  id: string;
  email: string;
  name: string;
  azureOid: string;
  roles: string[];
};

export type AuthStore = {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  account: AccountInfo | null;

  // Actions
  setUser: (user: User | null) => void;
  setAccount: (account: AccountInfo | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      account: null,

      // Actions
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setAccount: (account: AccountInfo | null) => {
        set({ account });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          account: null,
        });
      },
    }),
    {
      name: 'azure-auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        account: state.account,
      }),
    }
  )
);

// セレクター
export const selectUser = (state: AuthStore): User | null => state.user;
export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore): boolean => state.isLoading;
```

### 認証フック

**src/features/auth/hooks/use-auth.ts（新規）**

```typescript
import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useAuthStore } from '../stores/auth-store';
import { useGetMe } from '../api/get-me';
import { loginRequest } from '@/lib/auth/msalConfig';
import { env } from '@/config/env';

// 開発モード用のモック関数
const useMockAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    // 開発モード: 自動ログイン
    if (!isAuthenticated) {
      setUser({
        id: 'dev-user-uuid',
        email: 'dev.user@example.com',
        name: 'Development User',
        azureOid: 'dev-azure-oid-12345',
        roles: ['User'],
      });
    }
  }, [isAuthenticated, setUser]);

  return {
    user,
    isAuthenticated,
    isLoading: false,
    login: () => {
      setUser({
        id: 'dev-user-uuid',
        email: 'dev.user@example.com',
        name: 'Development User',
        azureOid: 'dev-azure-oid-12345',
        roles: ['User'],
      });
    },
    logout: () => logout(),
    getAccessToken: async () => 'mock-access-token-dev-12345',
  };
};

// 本番モード用のMSAL認証
const useProductionAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const { setAccount, setLoading, logout: clearAuth } = useAuthStore();
  const { data: userData, isLoading: isUserLoading } = useGetMe({
    enabled: accounts.length > 0,
  });

  useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [accounts, setAccount]);

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = async () => {
    await instance.logoutRedirect();
    clearAuth();
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (accounts.length === 0) return null;

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      console.error('Token acquisition failed:', error);
      await instance.acquireTokenRedirect(loginRequest);
      return null;
    }
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

/**
 * 認証フック
 *
 * 環境変数AUTH_MODEによって開発モード/本番モードを切り替え
 */
export const useAuth = () => {
  if (env.AUTH_MODE === 'development') {
    return useMockAuth();
  } else {
    return useProductionAuth();
  }
};

// getAccessToken単独エクスポート（api-client.tsで使用）
export const getAccessToken = async (): Promise<string | null> => {
  if (env.AUTH_MODE === 'development') {
    return 'mock-access-token-dev-12345';
  }

  // 本番モードの場合はMSALインスタンスから取得
  const { PublicClientApplication } = await import('@azure/msal-browser');
  const { msalConfig, loginRequest } = await import('@/lib/auth/msalConfig');

  const msalInstance = new PublicClientApplication(msalConfig);
  const accounts = msalInstance.getAllAccounts();

  if (accounts.length === 0) return null;

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return response.accessToken;
  } catch (error) {
    console.error('Token acquisition failed:', error);
    return null;
  }
};
```

### ユーザー情報取得API

**src/features/auth/api/get-me.ts（新規）**

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/tanstack-query';
import { User } from '../stores/auth-store';

export const getMe = (): Promise<User> => {
  return api.get('/auth/me');
};

type UseGetMeOptions = {
  queryConfig?: QueryConfig<typeof getMe>;
  enabled?: boolean;
};

export const useGetMe = ({ queryConfig, enabled = true }: UseGetMeOptions = {}) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled,
    ...queryConfig,
  });
};
```

---

## 4. MSWハンドラーの追加

**src/mocks/handlers/auth-handlers.ts（新規）**

```typescript
import { http, HttpResponse } from 'msw';

const mockUser = {
  id: 'dev-user-uuid',
  email: 'dev.user@example.com',
  name: 'Development User',
  azureOid: 'dev-azure-oid-12345',
  roles: ['User'],
};

export const authHandlers = [
  // ユーザー情報取得
  http.get('/api/v1/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.includes('mock-access-token')) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(mockUser);
  }),

  // ログアウト
  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),
];
```

**src/mocks/handlers.ts（更新）**

```typescript
import { authHandlers } from './handlers/auth-handlers'; // ✨ 追加
import { authHandlers as sampleAuthHandlers } from './handlers/api/v1/sample/auth-handlers';
import { chatHandlers } from './handlers/api/v1/sample/chat-handlers';
import { fileHandlers } from './handlers/api/v1/sample/file-handlers';
import { userHandlers } from './handlers/api/v1/sample/user-handlers';

export const handlers = [
  ...authHandlers,        // ✨ 追加: Azure AD認証
  ...sampleAuthHandlers,  // 既存: サンプル認証
  ...userHandlers,
  ...fileHandlers,
  ...chatHandlers,
];
```

---

## 5. ログインページ

**src/app/(auth)/login/page.tsx（新規）**

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { LoadingSpinner } from '@/components/sample-ui/loading-spinner';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    login();
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">CAMP</h2>
          <p className="mt-2 text-gray-600">Azure ADでサインイン</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
        >
          Microsoftアカウントでサインイン
        </button>
      </div>
    </div>
  );
}
```

---

## 6. 環境変数設定

**.env.local（開発モード）**

```bash
# 既存の設定
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ENABLE_API_MOCKING=true
NEXT_PUBLIC_URL=http://localhost:3000

# ✨ 追加: 認証設定
NEXT_PUBLIC_AUTH_MODE=development

# Azure AD設定（開発時は不要）
NEXT_PUBLIC_AZURE_CLIENT_ID=
NEXT_PUBLIC_AZURE_TENANT_ID=
NEXT_PUBLIC_AZURE_REDIRECT_URI=
```

**.env.local（本番モード）**

```bash
# 既存の設定
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
NEXT_PUBLIC_ENABLE_API_MOCKING=false
NEXT_PUBLIC_URL=https://app.example.com

# ✨ 追加: 認証設定
NEXT_PUBLIC_AUTH_MODE=production

# Azure AD設定
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=https://app.example.com
```

---

## 7. 使い方

### 開発モード

1. `.env.local`で`NEXT_PUBLIC_AUTH_MODE=development`を設定
2. `pnpm dev`でアプリ起動
3. 自動的にモックユーザーでログイン
4. APIリクエストはMSWがモック

### 本番モード

1. `.env.local`で`NEXT_PUBLIC_AUTH_MODE=production`を設定
2. Azure Portal でアプリ登録
3. Client ID, Tenant ID を設定
4. アプリ起動で Azure AD ログイン画面が表示

---

## 8. 既存構造との統合ポイント

| 既存機能 | 統合方法 |
|---------|---------|
| `src/lib/msw.tsx` | そのまま使用、MSWProvider経由でモック有効化 |
| `src/lib/api-client.ts` | Bearer Token インターセプター追加 |
| `src/app/provider.tsx` | AuthProvider を追加 |
| `src/config/env.ts` | Azure AD環境変数を追加 |
| `src/features/sample-auth/` | 既存のまま（サンプルとして保持） |
| `src/mocks/handlers.ts` | auth-handlers.ts を追加 |

既存のアーキテクチャを尊重しながら、Azure AD認証を追加する形になります。
