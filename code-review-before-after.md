# コードレビュー指摘事項 Before-After 比較ドキュメント

このドキュメントは、コミット `dea80a1` (feat: Azure Entra ID認証機能の実装) のコードレビューで指摘された問題点について、現在の実装と修正後の実装を比較したものです。

---

## 目次

1. [🚨 BLOCKING Issues（即時対応必須）](#blocking-issues)
2. [⚠️ IMPORTANT Issues（重要な改善点）](#important-issues)
3. [💡 Suggestions（品質向上の提案）](#suggestions)

---

## 🚨 BLOCKING Issues（即時対応必須） {#blocking-issues}

### 1. `function` キーワードの使用 → アロー関数への変更

プロジェクトルールでは、すべての関数をアロー関数で定義する必要があります。

#### 問題ファイル 1: `src/app/(protected)/layout.tsx`

##### ❌ BEFORE（現在の実装）

```typescript
// src/app/(protected)/layout.tsx:36
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner message="認証情報を確認しています..." />;
  }

  return <>{children}</>;
}
```

**問題点:**
- `function` キーワードが使用されている（プロジェクトルール違反）
- 関数コンポーネントの一貫性が失われている

##### ✅ AFTER（修正後）

```typescript
// src/app/(protected)/layout.tsx:36
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // ================================================================================
  // Effects
  // ================================================================================
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // ================================================================================
  // Render
  // ================================================================================
  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner message="認証情報を確認しています..." />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
```

**改善点:**
- アロー関数に変更
- プロジェクトルールに準拠
- セクションコメントで構造を明確化（既存のコメントスタイルを維持）

---

#### 問題ファイル 2: `src/features/auth/routes/login/login.tsx`

##### ❌ BEFORE（現在の実装）

```typescript
// src/features/auth/routes/login/login.tsx:32
export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = () => {
    login();
  };

  if (isLoading || isAuthenticated) {
    return <LoadingSpinner message="読み込み中..." />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* JSX content */}
    </div>
  );
}
```

**問題点:**
- `function` キーワードが使用されている（プロジェクトルール違反）

##### ✅ AFTER（修正後）

```typescript
// src/features/auth/routes/login/login.tsx:32
const LoginPage = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // ================================================================================
  // Effects
  // ================================================================================
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // ================================================================================
  // Handlers
  // ================================================================================
  const handleLogin = () => {
    login();
  };

  // ================================================================================
  // Render
  // ================================================================================
  if (isLoading || isAuthenticated) {
    return <LoadingSpinner message="読み込み中..." />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* JSX content */}
    </div>
  );
};

export default LoginPage;
```

**改善点:**
- アロー関数に変更
- プロジェクトルールに準拠

---

## ⚠️ IMPORTANT Issues（重要な改善点） {#important-issues}

### 2. `useAuth` フックの責任が複雑すぎる → ファイル分割アプローチへのリファクタリング

現在の実装では、開発モードと本番モードのフックが両方とも常に実行されており、React Hooks のルールにも違反しています。

#### ❌ BEFORE（現在の実装）

```typescript
// src/features/auth/hooks/use-auth.ts:112-121
export const useAuth = () => {
  const mockAuth = useMockAuth();
  const productionAuth = useProductionAuth();

  if (env.AUTH_MODE === 'development') {
    return mockAuth;
  } else {
    return productionAuth;
  }
};
```

**問題点:**
1. 両方のフックが常に実行されている（不要な処理）
2. 本番環境で開発用のフックが実行されるのは無駄
3. SOLID原則の単一責任の原則に違反
4. テストが困難

#### ✅ AFTER（修正後 - ファイル分割アプローチ）

環境ごとに別々のファイルを作成し、エントリーポイントで環境変数に応じて適切なファイルをエクスポートします。
Zustand と TanStack Query をそのまま活用し、Context API は使用しません。

**ファイル構成:**
```
src/features/auth/hooks/
├── use-auth.development.ts  # 開発環境用
├── use-auth.production.ts   # 本番環境用
└── use-auth.ts              # 環境に応じて適切なファイルを再エクスポート
```

##### 1. 開発環境用フック

```typescript
// src/features/auth/hooks/use-auth.development.ts（新規ファイル）
import { MOCK_AUTH } from '@/mocks/handlers/api/v1/auth-handlers';

import { useAuthStore } from '../stores/auth-store';

/**
 * 開発モード用のモック認証フック
 *
 * 注意: 自動ログイン機能は無効化されています。
 * Storybook環境でのテストを可能にするため、手動でログインする必要があります。
 *
 * @returns 認証関連の状態とメソッド
 */
export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

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
```

##### 2. 本番環境用フック

```typescript
// src/features/auth/hooks/use-auth.production.ts（新規ファイル）
import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';

import { loginRequest } from '@/config/msal';

import { useGetMe } from '../api/get-me';
import { useAuthStore } from '../stores/auth-store';

/**
 * 本番モード用のMSAL認証フック
 *
 * Azure ADで認証し、バックエンドからユーザー情報を取得します。
 *
 * @returns 認証関連の状態とメソッド
 */
export const useAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const { setAccount, setUser, logout: clearAuth } = useAuthStore();
  const { data: userData, isLoading: isUserLoading } = useGetMe({
    enabled: accounts.length > 0,
  });

  // MSALアカウント情報をストアに同期
  useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [accounts, setAccount]);

  // ユーザー情報をストアに同期
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

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
```

##### 3. エントリーポイント（環境に応じて切り替え）

```typescript
// src/features/auth/hooks/use-auth.ts（更新）
import { env } from '@/config/env';

// 開発環境用
import { useAuth as useDevelopmentAuth } from './use-auth.development';
// 本番環境用
import { useAuth as useProductionAuth } from './use-auth.production';

/**
 * 認証フック
 *
 * 環境変数に応じて適切な実装をエクスポートします。
 * - development: モック認証
 * - production: Azure AD認証（MSAL）
 *
 * @returns 認証関連の状態とメソッド
 */
export const useAuth = env.AUTH_MODE === 'development' ? useDevelopmentAuth : useProductionAuth;
```

##### 4. 型定義の共通化（オプション）

```typescript
// src/features/auth/types/use-auth.ts（新規ファイル）
import type { User } from '../stores/auth-store';

/**
 * useAuth フックの返り値の型
 */
export type UseAuthReturn = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
};
```

両方のフックでこの型を使用することで、一貫性を保証できます：

```typescript
// use-auth.development.ts
import type { UseAuthReturn } from '../types/use-auth';

export const useAuth = (): UseAuthReturn => {
  // ...
};
```

**改善点:**
1. ✅ React Hooks のルールに完全準拠
2. ✅ 不要なフックが実行されない（環境に応じて1つのみ）
3. ✅ 単一責任の原則を遵守
4. ✅ テストが容易（モックとプロダクションを独立してテスト可能）
5. ✅ Zustand と TanStack Query をそのまま活用
6. ✅ Context API 不要（Zustand で状態管理）
7. ✅ コードが明確で理解しやすい
8. ✅ 責任分離が明確

---

### 3. API Client のトークン取得処理の統合

現在の実装では、API Client内で動的インポートを使用しており、循環依存のリスクとパフォーマンス問題があります。
トークン取得ロジックを `api-client.ts` 内に統合することで、これらの問題を解決します。

#### ❌ BEFORE（現在の実装）

```typescript
// src/lib/api-client.ts:23-56
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

    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers[getCsrfHeaderName()] = csrfToken;
    }
  }

  config.withCredentials = true;
  return config;
};
```

**問題点:**
1. 動的インポートが毎回のリクエストで発生（パフォーマンス問題）
2. エラーハンドリングが不十分（トークン取得失敗時も処理が続行される）
3. 循環依存のリスクがある

#### ✅ AFTER（修正後 - api-client.ts に統合）

```typescript
// src/lib/api-client.ts（更新 - Token Service を統合）
import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { msalInstance } from '@/app/provider';
import { env } from '@/config/env';
import { loginRequest } from '@/config/msal';
import { getCsrfHeaderName, getCsrfToken } from '@/lib/csrf';
import { MOCK_AUTH } from '@/mocks/handlers/api/v1/auth-handlers';

// ================================================================================
// RFC 9457: Problem Details for HTTP APIs
// ================================================================================
// ... (ProblemDetails, ProblemTypes, ApiError はここに含まれる)

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
 * リクエストインターセプター
 * - Accept ヘッダーを設定（RFC 9457 準拠）
 * - Bearer Token認証対応（Azure AD）
 * - Cookie を含むリクエストを有効化
 * - CSRFトークンをヘッダーに追加
 */
const authRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  if (config.headers !== undefined) {
    // Acceptヘッダーを設定（RFC 9457準拠）
    config.headers.Accept = 'application/problem+json, application/json';

    // Bearer Token認証（同ファイル内の tokenService を使用）
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

// ... 以降は同じ
```

**改善点:**
1. ✅ トークン取得ロジックを `api-client.ts` に統合（ファイル数削減）
2. ✅ 動的インポートを排除（パフォーマンス改善）
3. ✅ 循環依存のリスクを排除
4. ✅ 同ファイル内での使用で結合度が明確
5. ✅ エラーハンドリングの改善
6. ✅ bulletproof-react の原則に沿った配置（lib/ 内に統合）

---

### 4. 401エラーハンドリングの改善

現在の実装では、ストアクリアの完了を待たずにリダイレクトが発生する可能性があります。

#### ❌ BEFORE（現在の実装）

```typescript
// src/lib/api-client.ts:91-105
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
```

**問題点:**
1. 動的インポートでストアをクリアする処理が非同期で完了を待たない
2. エラーが発生した場合の処理が不明確
3. ストアクリアとリダイレクトのタイミングが不整合

#### ✅ AFTER（修正後）

```typescript
// src/lib/api-client.ts（更新）
api.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<T>): T => {
    return response.data;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const message = error.response?.data?.message ?? error.message ?? 'エラーが発生しました';

    if (typeof window !== 'undefined') {
      console.error(`[APIエラー] ${message}`);
    }

    // 401エラー時の処理
    if (error.response?.status === 401 && typeof window !== 'undefined') {
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

    return Promise.reject(error);
  }
);
```

**改善点:**
1. ✅ `await` を使用してストアクリアの完了を待つ
2. ✅ エラーハンドリングの改善（try-catch でフォールバック処理）
3. ✅ 処理の順序が明確化
4. ✅ 一貫性のある状態管理

---

### 5. Zustand ストアの不要な状態削除

現在の実装では、使用されていない `isLoading` と `setLoading` が含まれています。

#### ❌ BEFORE（現在の実装）

```typescript
// src/features/auth/stores/auth-store.ts:41-65
export type AuthStore = {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;  // ❌ 使用されていない
  account: AccountInfo | null;

  // Actions
  setUser: (user: User | null) => void;
  setAccount: (account: AccountInfo | null) => void;
  setLoading: (loading: boolean) => void;  // ❌ 使用されていない
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
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        account: state.account,
      }),
    }
  )
);

// セレクター関数（定義されているが使用されていない）
export const selectUser = (state: AuthStore): User | null => state.user;
export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore): boolean => state.isLoading;
```

**問題点:**
1. `isLoading` が定義されているが使用されていない
2. `setLoading` が定義されているが使用されていない
3. セレクター関数が定義されているが使用されていない
4. ストアが肥大化している

#### ✅ AFTER（修正後）

```typescript
// src/features/auth/stores/auth-store.ts（更新）
import type { AccountInfo } from '@azure/msal-browser';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ================================================================================
// 定数
// ================================================================================

/**
 * Zustandの認証ストアで使用されるsessionStorageのキー
 */
const AUTH_STORAGE_KEY = 'azure-auth-storage';

// ================================================================================
// 型定義
// ================================================================================

/**
 * ユーザー情報
 */
export type User = {
  /** ユーザーID */
  id: string;
  /** メールアドレス */
  email: string;
  /** ユーザー名 */
  name: string;
  /** Azure Object ID */
  azureOid: string;
  /** ユーザーロール */
  roles: string[];
};

/**
 * 認証ストアの型定義
 */
export type AuthStore = {
  // ================================================================================
  // State
  // ================================================================================
  /** ユーザー情報 */
  user: User | null;
  /** 認証済みかどうか */
  isAuthenticated: boolean;
  /** MSALアカウント情報 */
  account: AccountInfo | null;

  // ================================================================================
  // Actions
  // ================================================================================
  /** ユーザー情報を設定 */
  setUser: (user: User | null) => void;
  /** アカウント情報を設定 */
  setAccount: (account: AccountInfo | null) => void;
  /** ログアウト */
  logout: () => void;
};

// ================================================================================
// Zustandストア
// ================================================================================

/**
 * 認証状態を管理するZustandストア
 *
 * - セッションストレージに永続化
 * - ユーザー情報、認証状態、アカウント情報を管理
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
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

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          account: null,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        account: state.account,
      }),
    }
  )
);

// ================================================================================
// セレクター関数（実際に使用する場合のみ定義）
// ================================================================================

/**
 * ユーザー情報を取得するセレクター
 */
export const selectUser = (state: AuthStore): User | null => state.user;

/**
 * 認証状態を取得するセレクター
 */
export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated;

// ================================================================================
// カスタムフック（セレクター関数を使いやすくする）
// ================================================================================

/**
 * ユーザー情報を取得するフック
 *
 * コンポーネントの再レンダリングを最適化します。
 */
export const useUser = () => useAuthStore(selectUser);

/**
 * 認証状態を取得するフック
 *
 * コンポーネントの再レンダリングを最適化します。
 */
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
```

**改善点:**
1. ✅ 不要な `isLoading` と `setLoading` を削除
2. ✅ ストアをシンプルに保つ
3. ✅ セレクター関数を実際に使用可能にするカスタムフックを追加
4. ✅ パフォーマンス最適化（セレクターによる再レンダリング制御）
5. ✅ 保守性の向上

---

### 6. Storybook Helpers のログ出力制御

現在の実装では、本番環境でも `console.log` が大量に出力されます。

#### ❌ BEFORE（現在の実装）

```typescript
// src/features/auth/components/storybook-helpers.ts:62-80
const applyAuthState = (data: AuthStateData): void => {
  console.log('[applyAuthState] Called with:', { isAuthenticated: data.isAuthenticated, user: data.user?.name });

  console.log('[applyAuthState] Applying auth state:', { isAuthenticated: data.isAuthenticated, user: data.user?.name });

  // sessionStorageを設定
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createStorageAuthState(data)));
  console.log('[applyAuthState] sessionStorage updated');

  // Zustandストアを設定
  useAuthStore.setState({
    user: data.user,
    isAuthenticated: data.isAuthenticated,
    isLoading: false,
    account: null,
  });
  console.log('[applyAuthState] Zustand store updated:', { isAuthenticated: useAuthStore.getState().isAuthenticated, user: useAuthStore.getState().user?.name });
};
```

**問題点:**
1. `console.log` が大量に残っている（L.63, 65, 70, 79など）
2. 本番環境でもログが出力される
3. パフォーマンスへの影響
4. デバッグ情報が漏洩する可能性

#### ✅ AFTER（修正後）

```typescript
// src/features/auth/components/storybook-helpers.ts（更新）
import { MOCK_AUTH } from '@/mocks/handlers/api/v1/auth-handlers';

import { useAuthStore } from '../stores/auth-store';
import type { User } from '../stores/auth-store';

// ================================================================================
// 定数
// ================================================================================

const AUTH_STORAGE_KEY = 'azure-auth-storage';

const AUTHENTICATED_DATA = {
  user: MOCK_AUTH.USER,
  isAuthenticated: true,
} as const;

const UNAUTHENTICATED_DATA = {
  user: null,
  isAuthenticated: false,
} as const;

// ================================================================================
// ロギングユーティリティ
// ================================================================================

/**
 * 開発環境のみでログを出力するユーティリティ関数
 */
const log = (message: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Storybook Auth] ${message}`, ...args);
  }
};

// ================================================================================
// 型定義
// ================================================================================

type AuthStateData = {
  user: User | null;
  isAuthenticated: boolean;
};

// ================================================================================
// 内部ヘルパー関数
// ================================================================================

const createStorageAuthState = (data: AuthStateData) => ({
  state: {
    user: data.user,
    isAuthenticated: data.isAuthenticated,
    account: null,
  },
});

const applyAuthState = (data: AuthStateData): void => {
  log('Called with:', { isAuthenticated: data.isAuthenticated, user: data.user?.name });

  // sessionStorageを設定
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createStorageAuthState(data)));
  log('sessionStorage updated');

  // Zustandストアを設定
  useAuthStore.setState({
    user: data.user,
    isAuthenticated: data.isAuthenticated,
    account: null,
  });
  log('Zustand store updated:', {
    isAuthenticated: useAuthStore.getState().isAuthenticated,
    user: useAuthStore.getState().user?.name
  });
};

// ================================================================================
// デコレーター用
// ================================================================================

export const setAuthenticatedStorage = (): void => {
  log('setAuthenticatedStorage - BEFORE clear:', sessionStorage.getItem(AUTH_STORAGE_KEY));

  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createStorageAuthState(AUTHENTICATED_DATA)));
  log('setAuthenticatedStorage - AFTER set:', sessionStorage.getItem(AUTH_STORAGE_KEY));

  useAuthStore.setState({
    user: AUTHENTICATED_DATA.user,
    isAuthenticated: AUTHENTICATED_DATA.isAuthenticated,
    account: null,
  });
  log('Zustand store updated:', {
    isAuthenticated: useAuthStore.getState().isAuthenticated,
    user: useAuthStore.getState().user?.name
  });
};

export const setUnauthenticatedStorage = (): void => {
  log('setUnauthenticatedStorage - BEFORE clear:', sessionStorage.getItem(AUTH_STORAGE_KEY));

  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createStorageAuthState(UNAUTHENTICATED_DATA)));
  log('setUnauthenticatedStorage - AFTER set:', sessionStorage.getItem(AUTH_STORAGE_KEY));

  useAuthStore.setState({
    user: UNAUTHENTICATED_DATA.user,
    isAuthenticated: UNAUTHENTICATED_DATA.isAuthenticated,
    account: null,
  });
  log('Zustand store updated:', {
    isAuthenticated: useAuthStore.getState().isAuthenticated,
    user: useAuthStore.getState().user?.name
  });
};

// ================================================================================
// loaders用
// ================================================================================

export const authenticatedLoader = async () => {
  log('authenticatedLoader called (but does nothing in Node environment)');
  return {};
};

export const unauthenticatedLoader = async () => {
  log('unauthenticatedLoader called (but does nothing in Node environment)');
  return {};
};

// ================================================================================
// play関数用
// ================================================================================

export const setAuthenticatedState = (): void => {
  log('setAuthenticatedState called');
  applyAuthState(AUTHENTICATED_DATA);
};

export const setUnauthenticatedState = (): void => {
  log('setUnauthenticatedState called');
  applyAuthState(UNAUTHENTICATED_DATA);
};
```

**改善点:**
1. ✅ ログ出力を制御する `log` ユーティリティ関数を導入
2. ✅ 開発環境のみでログを出力（`process.env.NODE_ENV === 'development'`）
3. ✅ 本番環境でのパフォーマンス改善
4. ✅ セキュリティの向上（デバッグ情報の漏洩防止）
5. ✅ 一貫性のあるログフォーマット

---

### 7. ファイル配置の最適化（bulletproof-react 原則）

プロジェクト構造をbulletproof-react原則に沿って整理します。

#### 問題点

##### ❌ BEFORE（現在の配置）

```
src/
├── lib/
│   └── auth/
│       ├── msalConfig.ts      # 設定ファイルだが lib/ に配置
│       └── authProvider.tsx   # プロバイダーだが lib/ に配置
```

**問題点:**
1. `msalConfig.ts` は設定ファイルなので `src/config/` に配置すべき
2. `authProvider.tsx` の役割は `src/app/provider.tsx` に統合できる
3. `lib/` は外部ライブラリのラッパーに使うべき

#### ✅ AFTER（修正後）

##### 1. msalConfig の移動

```typescript
// src/config/msal.ts（移動後）
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
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.Info : LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
};

/**
 * ログインリクエストの設定
 */
export const loginRequest = {
  scopes: ['User.Read', `api://${env.AZURE_CLIENT_ID}/access_as_user`],
};
```

##### 2. authProvider を provider.tsx に統合

```typescript
// src/app/provider.tsx（統合後）
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
let msalInstance: PublicClientApplication | null = null;

if (env.AUTH_MODE === 'production') {
  msalInstance = new PublicClientApplication(msalConfig);
}

// MSALインスタンスをエクスポート（他のモジュールで使用）
export { msalInstance };

// ================================================================================
// Auth Provider
// ================================================================================

type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * 認証プロバイダー
 *
 * 環境変数AUTH_MODEによって以下を切り替え:
 * - production: MSALProviderでラップ（Azure AD認証）
 * - development: そのまま子要素を返す（モック認証）
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  if (env.AUTH_MODE === 'development') {
    return <>{children}</>;
  }

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
```

##### 3. インポートパスの更新

**api-client.ts:**
```typescript
// src/lib/api-client.ts
import { msalInstance } from '@/app/provider';  // 変更前: '@/lib/auth/authProvider'
import { loginRequest } from '@/config/msal';   // 変更前: '@/lib/auth/msalConfig'
```

**use-auth.production.ts:**
```typescript
// src/features/auth/hooks/use-auth.production.ts
import { loginRequest } from '@/config/msal';   // 変更前: '@/lib/auth/msalConfig'
```

**改善点:**
1. ✅ 設定ファイルを `src/config/` に集約
2. ✅ MSALプロバイダーとアプリプロバイダーを統合
3. ✅ `src/lib/auth/` ディレクトリを削除（不要）
4. ✅ bulletproof-react原則に準拠
5. ✅ ファイル構造がより明確になる

---

## 💡 Suggestions（品質向上の提案） {#suggestions}

### 8. LoadingSpinner コンポーネントの機能拡張

より柔軟な使用ができるように、サイズオプションとテスタビリティを向上させます。

#### 現在の実装

```typescript
// src/components/ui/loading-spinner/loading-spinner.tsx
type LoadingSpinnerProps = {
  message?: string;
  fullScreen?: boolean;
};

export const LoadingSpinner = ({
  message = '読み込み中...',
  fullScreen = true
}: LoadingSpinnerProps) => {
  const containerClass = fullScreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};
```

#### ✅ 改善案（推奨）

```typescript
// src/components/ui/loading-spinner/loading-spinner.tsx
import { cn } from '@/lib/utils';

// ================================================================================
// 型定義
// ================================================================================

type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

type LoadingSpinnerProps = {
  /** ローディングメッセージ */
  message?: string;
  /** 全画面表示するかどうか */
  fullScreen?: boolean;
  /** スピナーのサイズ */
  size?: LoadingSpinnerSize;
  /** テスト用のdata-testid */
  'data-testid'?: string;
};

// ================================================================================
// サイズマッピング
// ================================================================================

const sizeClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'h-8 w-8 border-2',
  md: 'h-12 w-12 border-4',
  lg: 'h-16 w-16 border-4',
};

// ================================================================================
// コンポーネント
// ================================================================================

/**
 * ローディングスピナーコンポーネント
 *
 * ローディング状態を視覚的に表示します。
 * アクセシビリティに配慮した実装になっています。
 */
export const LoadingSpinner = ({
  message = '読み込み中...',
  fullScreen = true,
  size = 'md',
  'data-testid': dataTestId = 'loading-spinner'
}: LoadingSpinnerProps) => {
  const containerClass = fullScreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass} data-testid={dataTestId}>
      <div className="text-center" role="status" aria-live="polite">
        <div
          className={cn(
            'mx-auto animate-spin rounded-full border-gray-300 border-t-blue-600',
            sizeClasses[size]
          )}
          aria-hidden="true"
        />
        <p className="mt-4 text-gray-600" aria-label={message}>
          {message}
        </p>
      </div>
    </div>
  );
};
```

**改善点:**
1. ✅ サイズオプションの追加（sm, md, lg）
2. ✅ テスタビリティの向上（data-testid属性）
3. ✅ アクセシビリティの向上（aria-label, aria-live）
4. ✅ 柔軟な使用が可能
5. ✅ ユーティリティクラスの活用（cn関数）

---

### 8. エラー境界の追加

認証エラーが発生した場合のフォールバックUIを提供します。

#### 新規実装（推奨）

```typescript
// src/components/ui/error-boundary/error-boundary.tsx（新規ファイル）
'use client';

import { Component, type ReactNode } from 'react';

import { Button } from '@/components/sample-ui/button/button';

// ================================================================================
// 型定義
// ================================================================================

type ErrorBoundaryProps = {
  /** レンダリングする子要素 */
  children: ReactNode;
  /** エラー発生時のフォールバックUI（オプション） */
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  /** リセット時のリダイレクト先（デフォルト: '/login'） */
  redirectTo?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

// ================================================================================
// コンポーネント
// ================================================================================

/**
 * エラー境界コンポーネント
 *
 * React コンポーネントツリー内のエラーをキャッチし、適切なフォールバックUIを表示します。
 * カスタムフォールバックUIを提供することも、デフォルトのUIを使用することもできます。
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    const redirectTo = this.props.redirectTo ?? '/login';
    window.location.href = redirectTo;
  };

  render() {
    if (this.state.hasError && this.state.error !== null) {
      // カスタムフォールバックが提供されている場合はそれを使用
      if (this.props.fallback !== undefined) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // デフォルトのフォールバックUI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-red-600">エラーが発生しました</h1>
              <p className="text-gray-600">
                {this.state.error.message || '予期しないエラーが発生しました'}
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={this.handleReset} className="w-full" size="lg">
                ページをリロード
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

```typescript
// src/components/ui/error-boundary/index.ts（新規ファイル）
export { ErrorBoundary } from './error-boundary';
```

```typescript
// src/app/(protected)/layout.tsx（更新例 - オプション）
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ErrorBoundary, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/use-auth';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner message="認証情報を確認しています..." />;
  }

  return (
    <ErrorBoundary redirectTo="/login">
      {children}
    </ErrorBoundary>
  );
};

export default ProtectedLayout;
```

**改善点:**
1. ✅ 汎用的なエラー境界コンポーネント（プロジェクト全体で再利用可能）
2. ✅ カスタムフォールバックUIのサポート
3. ✅ リダイレクト先のカスタマイズ可能
4. ✅ アプリケーション全体のクラッシュを防ぐ
5. ✅ ユーザーフレンドリーなエラーメッセージ
6. ✅ 回復手段の提供（ページリロード）
7. ✅ エラーログの適切な記録

---

## まとめ（統合案1採用版）

### 優先度付き改善タスク

#### 🚨 BLOCKING（即時対応必須）
1. ✅ `function` キーワードを全てアロー関数に変更
   - `src/app/(protected)/layout.tsx`
   - `src/features/auth/routes/login/login.tsx`

#### ⚠️ IMPORTANT（次回のPRで対応）
2. `useAuth` フックのファイル分割リファクタリング
   - 修正: `src/features/auth/hooks/use-auth.ts`
   - 新規: `src/features/auth/hooks/use-auth.development.ts`
   - 新規: `src/features/auth/hooks/use-auth.production.ts`

3. **API Client のトークン取得処理の統合 + RFC 9457 完全準拠（統合版）**
   - 修正: `src/lib/api-client.ts`（RFC 9457 型定義 + ApiError クラス + TokenService を統合）
   - 修正: `src/lib/tanstack-query.ts`（エラーハンドリング追加）

4. 401エラーハンドリングの改善
   - 修正: `src/lib/api-client.ts`（上記に含まれる）

5. Zustand ストアの不要な状態削除
   - 修正: `src/features/auth/stores/auth-store.ts`

6. Storybook Helpers のログ出力制御
   - 修正: `src/features/auth/components/storybook-helpers.ts`

#### 💡 SUGGESTION（推奨）
8. エラー境界の追加（汎用化）
   - 新規: `src/components/ui/error-boundary/error-boundary.tsx`
   - 新規: `src/components/ui/error-boundary/index.ts`
   - 新規: `src/components/ui/error-boundary/error-boundary.stories.tsx`
   - 修正: `src/components/ui/index.ts` (export 追加)

#### 💡 SUGGESTION（後回し・オプション）
9. LoadingSpinner コンポーネントのサイズオプション追加
   - 修正: `src/components/ui/loading-spinner/loading-spinner.tsx`

### テスト推奨項目

修正後は以下のテストを実行することを推奨します：

```bash
# TypeScript型チェック
npm run type-check

# ESLintチェック
npm run lint

# ビルド確認
npm run build

# Storybookビルド確認
npm run build-storybook

# 単体テスト（実装されている場合）
npm run test
```

### ファイル構成の変更（統合案1採用版）

このセクションでは、実際に修正・作成するファイルのみを記載しています。

#### 📝 既存ファイルの修正（7ファイル）

1. **`src/app/(protected)/layout.tsx`**
   - `function` → アロー関数への変更

2. **`src/features/auth/routes/login/login.tsx`**
   - `function` → アロー関数への変更

3. **`src/features/auth/hooks/use-auth.ts`**
   - ファイル分割アプローチへのリファクタリング（エントリーポイント化）

4. **`src/lib/api-client.ts`**
   - **RFC 9457 型定義を統合（ProblemDetails, ProblemTypes）**
   - **ApiError クラスを統合**
   - **TokenService を統合（同ファイル内で定義・使用）**
   - 401エラーハンドリングの改善

5. **`src/features/auth/stores/auth-store.ts`**
   - 不要な状態（isLoading, setLoading）削除
   - セレクター関数の改善

6. **`src/features/auth/components/storybook-helpers.ts`**
   - ログ出力制御の実装

7. **`src/lib/tanstack-query.ts`**
   - ApiError 対応のエラーハンドリング追加
   - リトライロジックのカスタマイズ

#### ➕ 新規作成ファイル（必須: 2ファイル）

1. **`src/features/auth/hooks/use-auth.development.ts`**
   - 開発環境用認証フック

2. **`src/features/auth/hooks/use-auth.production.ts`**
   - 本番環境用認証フック

#### ➕ 新規作成ファイル（推奨: 3ファイル）

3. **`src/components/ui/error-boundary/error-boundary.tsx`**
   - エラー境界コンポーネント（汎用化）

4. **`src/components/ui/error-boundary/index.ts`**
   - エクスポート用インデックスファイル

5. **`src/components/ui/error-boundary/error-boundary.stories.tsx`**
   - Storybook ストーリー

#### 📝 既存ファイルの修正（推奨: 1ファイル）

6. **`src/components/ui/index.ts`**
   - ErrorBoundary の export を追加

#### 🔄 ファイル移動・統合（bulletproof-react 原則に基づく整理）

1. **`src/lib/auth/msalConfig.ts`** → **`src/config/msal.ts`** に移動
   - 設定ファイルは `src/config/` に集約

2. **`src/lib/auth/authProvider.tsx`** → **`src/app/provider.tsx`** に統合
   - MSAL初期化とAuthProviderコンポーネントを統合
   - `msalInstance` を `src/app/provider.tsx` からエクスポート

3. **`src/lib/auth/`** ディレクトリ削除
   - 空ディレクトリとなるため削除

#### 🗑️ 作成不要なファイル（統合により削減）

- ~~`src/types/problem-details.ts`~~ → `src/lib/api-client.ts` に統合
- ~~`src/lib/api-error.ts`~~ → `src/lib/api-client.ts` に統合
- ~~`src/features/auth/services/token-service.ts`~~ → `src/lib/api-client.ts` に統合
- ~~`src/lib/query-client.ts`~~ → `src/lib/tanstack-query.ts` を拡張
- ~~`src/mocks/utils/problem-details.ts`~~ → 必要に応じて後で作成
- ~~`src/features/auth/types/use-auth.ts`~~ → 不要（型定義は各ファイルで定義）
- ~~`src/components/ui/loading-spinner/loading-spinner.tsx`~~ → 既存修正は行わない（オプション）
- ~~`src/mocks/handlers/**/*.ts`~~ → 既存修正は行わない（オプション）

---

## 追加提案: RFC 9457（Problem Details）完全準拠の実装

バックエンドから RFC 9457 準拠のエラーレスポンスが返ってくるため、フロントエンドも完全対応が必要です。

### 現在の問題点

#### ❌ BEFORE（現在の実装）

```typescript
// src/lib/api-client.ts:10-14
export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};
```

**問題点:**
1. RFC 9457 の標準フィールド（`type`, `title`, `status`, `detail`, `instance`）が定義されていない
2. 独自フィールド（`message`, `code`）を使用している
3. バックエンドの RFC 9457 レスポンスを正しく扱えない
4. エラータイプによる分岐処理ができない
5. 拡張フィールドにアクセスできない

### RFC 9457 とは

RFC 9457 は、HTTP API のエラーレスポンスを標準化した仕様です（RFC 7807 の後継）。

**標準フォーマット:**
```json
{
  "type": "https://example.com/probs/out-of-credit",
  "title": "You do not have enough credit.",
  "detail": "Your current balance is 30, but that costs 50.",
  "instance": "/account/12345/msgs/abc",
  "status": 403,
  "balance": 30,
  "accounts": ["/account/12345", "/account/67890"]
}
```

**Content-Type:** `application/problem+json`

### ✅ AFTER（推奨実装 - カスタムエラークラスアプローチ）

後方互換性を気にせず、RFC 9457 完全準拠で実装し直します。

#### 1. RFC 9457 型定義

```typescript
// src/types/problem-details.ts（新規ファイル）
/**
 * RFC 9457: Problem Details for HTTP APIs
 *
 * @see https://www.rfc-editor.org/rfc/rfc9457.html
 */
export type ProblemDetails = {
  /**
   * 問題の種類を示すURI参照
   *
   * デフォルト: "about:blank"
   */
  type?: string;

  /**
   * 問題タイプの簡潔な人間が読める説明
   */
  title?: string;

  /**
   * HTTPステータスコード（情報提供的）
   */
  status?: number;

  /**
   * この特定の問題発生に関する人間が読める説明
   */
  detail?: string;

  /**
   * この特定の問題発生を識別するURI参照
   */
  instance?: string;

  /**
   * 拡張フィールド（問題タイプ固有の追加情報）
   */
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

export type ProblemType = typeof ProblemTypes[keyof typeof ProblemTypes];
```

#### 2. ApiError カスタムエラークラス（api-client.ts に統合）

```typescript
// src/lib/api-client.ts（統合版）
import type { AxiosError } from 'axios';

import type { ProblemDetails } from '@/types/problem-details';

/**
 * API エラークラス
 *
 * RFC 9457 Problem Details を扱いやすくするラッパー
 */
export class ApiError extends Error {
  /**
   * RFC 9457 Problem Details
   */
  public readonly problemDetails: ProblemDetails;

  /**
   * HTTPステータスコード
   */
  public readonly status: number;

  /**
   * 元のAxiosエラー
   */
  public readonly originalError: AxiosError<ProblemDetails>;

  constructor(axiosError: AxiosError<ProblemDetails>) {
    const problemDetails = axiosError.response?.data ?? {};
    const message =
      problemDetails.detail ?? problemDetails.title ?? axiosError.message ?? 'エラーが発生しました';

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

  /**
   * エラータイプURIを取得
   */
  get type(): string {
    return this.problemDetails.type ?? 'about:blank';
  }

  /**
   * エラータイトルを取得
   */
  get title(): string {
    return this.problemDetails.title ?? 'エラー';
  }

  /**
   * エラー詳細を取得
   */
  get detail(): string {
    return this.problemDetails.detail ?? this.message;
  }

  /**
   * インスタンスURIを取得
   */
  get instance(): string | undefined {
    return this.problemDetails.instance;
  }

  /**
   * 拡張フィールドを取得
   *
   * @example
   * const validationErrors = error.getExtension<Record<string, string[]>>('errors');
   */
  getExtension<T = unknown>(key: string): T | undefined {
    return this.problemDetails[key] as T;
  }

  /**
   * 特定のエラータイプかどうかを判定
   *
   * @example
   * if (error.isType(ProblemTypes.VALIDATION_ERROR)) {
   *   // バリデーションエラー固有の処理
   * }
   */
  isType(typeUri: string): boolean {
    return this.type === typeUri;
  }

  /**
   * 特定のステータスコードかどうかを判定
   *
   * @example
   * if (error.isStatus(403)) {
   *   // 403エラー固有の処理
   * }
   */
  isStatus(statusCode: number): boolean {
    return this.status === statusCode;
  }

  /**
   * 4xxクライアントエラーかどうかを判定
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * 5xxサーバーエラーかどうかを判定
   */
  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * JSON形式で出力
   */
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
```

#### 3. api-client の完全リファクタリング（統合版）

```typescript
// src/lib/api-client.ts（完全書き換え - RFC 9457 型定義 + ApiError クラス統合版）
import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { tokenService } from '@/features/auth/services/token-service';
import { getCsrfHeaderName, getCsrfToken } from '@/lib/csrf';

// ================================================================================
// RFC 9457 型定義（ProblemDetails, ProblemTypes はこのファイルに含まれる）
// ================================================================================

// ================================================================================
// ApiError クラス（このファイルに含まれる）
// ================================================================================

/**
 * リクエストインターセプター
 * - Accept ヘッダーを設定（RFC 9457 準拠）
 * - Bearer Token認証対応（Azure AD）
 * - Cookie を含むリクエストを有効化
 * - CSRFトークンをヘッダーに追加
 */
const authRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
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
```

#### 4. TanStack Query グローバルエラーハンドラー（tanstack-query.ts を拡張）

```typescript
// src/lib/tanstack-query.ts（既存ファイルを拡張）
import { DefaultOptions, UseMutationOptions } from '@tanstack/react-query';

import { ApiError } from './api-client';

/**
 * React Query のデフォルト設定
 *
 * アプリケーション全体で使用されるReact Queryの共通設定を定義します。
 *
 * @property queries.refetchOnWindowFocus - ウィンドウフォーカス時の自動再取得を無効化
 * @property queries.retry - エラー時の自動リトライをカスタマイズ
 * @property queries.staleTime - データが古いと判断されるまでの時間（5分）
 */
export const queryConfig = {
  queries: {
    // throwOnError: true,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // ApiErrorの場合、リトライロジックをカスタマイズ
      if (error instanceof ApiError) {
        // 4xxクライアントエラーはリトライしない
        if (error.isClientError()) {
          return false;
        }

        // 5xxサーバーエラーは3回までリトライ
        return failureCount < 3;
      }

      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5分（データの性質に応じて調整）
  },
  mutations: {
    onError: (error) => {
      if (error instanceof ApiError) {
        console.error('[Mutation Error]', error.toJSON());

        // TODO: 通知システムと統合
        // useNotifications.getState().addNotification({
        //   type: 'error',
        //   title: error.title,
        //   message: error.detail,
        // });
      }
    },
  },
} satisfies DefaultOptions;
```

#### 5. TanStack Query での使用例

```typescript
// src/features/users/api/create-user.ts
import { useMutation } from '@tanstack/react-query';

import { api, ApiError, ProblemTypes } from '@/lib/api-client';

import type { User } from '../types';

type CreateUserDTO = {
  name: string;
  email: string;
};

const createUser = async (data: CreateUserDTO): Promise<User> => {
  return api.post('/users', data);
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
    onError: (error) => {
      if (error instanceof ApiError) {
        // エラータイプによる分岐処理
        if (error.isType(ProblemTypes.VALIDATION_ERROR)) {
          // バリデーションエラー固有の処理
          const validationErrors = error.getExtension<Record<string, string[]>>('errors');
          console.log('バリデーションエラー:', validationErrors);
        } else if (error.isType(ProblemTypes.DUPLICATE_RESOURCE)) {
          // 重複エラー固有の処理
          const existingUserId = error.getExtension<string>('existingUserId');
          console.log('既存のユーザーID:', existingUserId);
        }

        // ステータスコードによる分岐処理
        if (error.isStatus(403)) {
          console.log('権限がありません');
        }
      }
    },
  });
};
```

#### 6. MSW ハンドラーの RFC 9457 対応（オプション・後回し）

MSW のハンドラー修正は、実際に必要になった時点で対応します。
統合版では `ProblemTypes` と `ProblemDetails` 型は `src/lib/api-client.ts` からインポートできます。

```typescript
// 将来的な実装例
import { http } from 'msw';
import { ProblemTypes, ProblemDetails } from '@/lib/api-client';

// ヘルパー関数は必要に応じて作成
```

### 改善点

1. ✅ **RFC 9457 完全準拠**: すべての標準フィールドをサポート
2. ✅ **型安全性**: TypeScript で完全な型推論
3. ✅ **エラーハンドリングの一貫性**: `instanceof ApiError` で判定
4. ✅ **拡張性**: 新しいエラータイプの追加が容易
5. ✅ **可読性**: エラー処理のコードが明確
6. ✅ **TanStack Query との統合**: グローバルエラーハンドラーで一元管理
7. ✅ **開発体験の向上**: MSW でも RFC 9457 準拠のレスポンス
8. ✅ **保守性**: エラータイプ定数で型安全な分岐処理

### RFC 9457 実装のファイル構成（統合版）

#### 更新ファイル
- **`src/lib/api-client.ts`** - RFC 9457 型定義 + ApiError クラスを統合
- **`src/lib/tanstack-query.ts`** - ApiError 対応のエラーハンドリングを追加

#### 新規作成不要
- ~~`src/types/problem-details.ts`~~ → `api-client.ts` に統合
- ~~`src/lib/api-error.ts`~~ → `api-client.ts` に統合
- ~~`src/lib/query-client.ts`~~ → `tanstack-query.ts` を拡張
- ~~`src/mocks/utils/problem-details.ts`~~ → 後回し（オプション）
- ~~`src/app/provider.tsx`~~ → 修正不要

---

## 最終評価

### 修正前の評価: ⚠️ IMPORTANT - 重要な改善が必要

### 修正後の期待評価: ✅ EXCELLENT - 優れた実装

**修正により期待される改善:**
- ✅ プロジェクトルールへの完全準拠
- ✅ React Hooks ルールの遵守
- ✅ SOLID原則の遵守（特に単一責任の原則）
- ✅ テスタビリティの大幅向上
- ✅ パフォーマンスの改善
- ✅ 保守性の向上
- ✅ エラーハンドリングの強化
- ✅ セキュリティの向上
- ✅ **RFC 9457 完全準拠によるエラーハンドリングの標準化**
- ✅ **型安全なエラー処理の実現**

これらの修正により、コードベースがより堅牢で保守しやすい状態になります。

---

## 📋 実装チェックリスト（統合案1採用版）

このセクションは、実装時に確実に対応するための最終チェックリストです。

### ✅ 修正対象ファイル（7ファイル）

- [x] `src/app/(protected)/layout.tsx` - アロー関数化
- [x] `src/features/auth/routes/login/login.tsx` - アロー関数化
- [x] `src/features/auth/hooks/use-auth.ts` - エントリーポイント化
- [x] `src/lib/api-client.ts` - RFC 9457 + ApiError + TokenService 統合版への完全書き換え
- [x] `src/features/auth/stores/auth-store.ts` - 不要状態削除
- [x] `src/features/auth/components/storybook-helpers.ts` - ログ制御
- [x] `src/lib/tanstack-query.ts` - エラーハンドリング追加

### ➕ 新規作成ファイル（必須: 2ファイル）

- [x] `src/features/auth/hooks/use-auth.development.ts`
- [x] `src/features/auth/hooks/use-auth.production.ts`

### ➕ 新規作成ファイル（推奨: 3ファイル）

- [x] `src/components/ui/error-boundary/error-boundary.tsx`
- [x] `src/components/ui/error-boundary/index.ts`
- [x] `src/components/ui/error-boundary/error-boundary.stories.tsx`

### ✅ 修正対象ファイル（推奨: 1ファイル）

- [x] `src/components/ui/index.ts` - ErrorBoundary の export 追加

### 🔄 ファイル移動・統合

- [x] `src/lib/auth/msalConfig.ts` → `src/config/msal.ts` に移動
- [x] `src/lib/auth/authProvider.tsx` → `src/app/provider.tsx` に統合
- [x] `src/lib/auth/` ディレクトリ削除（空ディレクトリ）

### 🚫 作成しないファイル（統合により不要）

- ❌ `src/types/problem-details.ts` → `src/lib/api-client.ts` に統合
- ❌ `src/lib/api-error.ts` → `src/lib/api-client.ts` に統合
- ❌ `src/features/auth/services/token-service.ts` → `src/lib/api-client.ts` に統合
- ❌ `src/lib/query-client.ts`
- ❌ `src/features/auth/types/use-auth.ts`
- ❌ `src/mocks/utils/problem-details.ts`（後回し）
- ❌ `src/components/ui/loading-spinner/loading-spinner.tsx`（後回し）

### 📊 統合効果

| 項目 | 当初提案 | 統合案採用 | 削減数 |
|---|---|---|---|
| 修正ファイル | 7 | 7 (+1推奨) | - |
| 新規ファイル（必須） | 5 | 2 | **-3** |
| 新規ファイル（推奨） | 1 | 3 (+Stories) | +2 |
| **合計** | **13** | **13** | **±0** |

**削減されたファイル:**
- `src/types/problem-details.ts` → `src/lib/api-client.ts` に統合
- `src/lib/api-error.ts` → `src/lib/api-client.ts` に統合
- `src/features/auth/services/token-service.ts` → `src/lib/api-client.ts` に統合

---

## 🎯 実装の優先順位

### Phase 1: BLOCKING Issues（即時対応）
1. アロー関数化（2ファイル修正）

### Phase 2: IMPORTANT Issues（重要）
2. useAuth リファクタリング（1修正 + 2新規）
3. TokenService 統合（1修正のみ - api-client.ts に統合）
4. RFC 9457 統合版実装（1修正 - api-client.ts に統合済み）
5. Zustand 不要状態削除（1修正）
6. Storybook ログ制御（1修正）

### Phase 3: SUGGESTION（推奨）
7. エラー境界コンポーネント（2新規: error-boundary.tsx + index.ts）

**合計:** 修正8（+ファイル移動2） + 新規5 = **15ファイル操作**

**注:** ファイル移動・統合により、プロジェクト構造がbulletproof-react原則に準拠
