/**
 * 認証状態管理ストア
 *
 * TODO: これはZustand + LocalStorage永続化のサンプル実装です。
 * TODO: 実際の認証ロジックは実装していません。
 * TODO: 実際に使用する際は、以下を実装してください：
 * TODO: - 実際のAPI呼び出し (api/login.ts, api/logout.ts)
 * TODO: - JWTトークンの管理
 * TODO: - リフレッシュトークンの処理
 * TODO: - エラーハンドリング
 *
 * @example
 * ```tsx
 * import { useAuthStore } from '@/features/sample-auth/stores/auth-store'
 *
 * function LoginButton() {
 *   const { login, isLoading } = useAuthStore()
 *
 *   const handleLogin = async () => {
 *     await login('user@example.com', 'password')
 *   }
 *
 *   return <button onClick={handleLogin}>Login</button>
 * }
 * ```
 */

import { create } from "zustand";
import { createJSONStorage, persist, type StorageValue } from "zustand/middleware";

import type { AuthStore, User } from "../types";
import { AuthStorageSchema } from "./schemas/auth-storage.schema";

// ================================================================================
// カスタムストレージ（バリデーション付き）
// ================================================================================

/**
 * localStorageから読み込む際にZodスキーマでバリデーションを行うカスタムストレージ
 *
 * 不正なデータや改ざんされたデータをロードしないことで、セキュリティとデータ整合性を保証
 */
const validatedLocalStorage = {
  getItem: (name: string): StorageValue<Pick<AuthStore, "user" | "isAuthenticated">> | null => {
    const item = localStorage.getItem(name);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      const result = AuthStorageSchema.safeParse(parsed.state);

      if (!result.success) {
        // バリデーション失敗時は不正なデータを削除してnullを返す
        console.warn("[Sample Auth Store] ローカルストレージの認証データが不正です。データを削除します:", result.error);
        localStorage.removeItem(name);

        return null;
      }

      return parsed;
    } catch (error) {
      // JSON.parse エラー時も削除
      console.warn("[Sample Auth Store] ローカルストレージのデータが破損しています。データを削除します:", error);
      localStorage.removeItem(name);

      return null;
    }
  },
  setItem: (name: string, value: StorageValue<Pick<AuthStore, "user" | "isAuthenticated">>) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

// ================================================================================
// Zustandストア
// ================================================================================

/**
 * 認証ストア
 *
 * - LocalStorageに永続化（Zodバリデーション付き）
 * - ユーザー情報、認証状態を管理
 * - ストレージからの読み込み時に不正なデータを自動的に除外
 *
 * TODO: これはZustand + LocalStorage永続化のサンプル実装です。
 * TODO: 実際の認証ロジックは実装していません。
 * TODO: 実際に使用する際は、以下を実装してください：
 * TODO: - 実際のAPI呼び出し (api/login.ts, api/logout.ts)
 * TODO: - JWTトークンの管理
 * TODO: - リフレッシュトークンの処理
 * TODO: - エラーハンドリング
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ================================================================================
      // State
      // ================================================================================
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // ================================================================================
      // Actions
      // ================================================================================

      /**
       * ログイン処理
       *
       * TODO: 実際のAPI呼び出しを実装してください
       * TODO: エラーハンドリングを追加してください
       */
      login: async (email: string, _password: string) => {
        set({ isLoading: true });

        try {
          // TODO: 実際のAPI呼び出しに置き換える
          // const response = await api.post('/auth/login', { email, password })
          // const user = response.data

          // サンプルデータ（実際は削除）
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const mockUser: User = {
            id: "1",
            email: email,
            name: "Sample User",
            role: "user",
            createdAt: new Date().toISOString(),
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      /**
       * ログアウト処理
       *
       * TODO: 実際のAPI呼び出しを実装してください（必要に応じて）
       */
      logout: () => {
        // TODO: 必要に応じてサーバー側のセッション削除API呼び出し
        // await api.post('/auth/logout')

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      /**
       * ユーザー情報を直接設定
       *
       * TODO: 通常はログイン成功時に自動的に設定されるため、
       * TODO: このメソッドの使用は慎重に検討してください
       */
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "auth-storage", // LocalStorageのキー名
      storage: createJSONStorage(() => validatedLocalStorage), // ✅ Zodバリデーション付きLocalStorageを使用

      // 永続化する状態を選択（パフォーマンス最適化）
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // isLoadingは永続化しない
      }),
    }
  )
);

// ================================================================================
// セレクター
// ================================================================================

/**
 * 認証状態のセレクター（パフォーマンス最適化用）
 *
 * @example
 * ```tsx
 * const user = useAuthStore(selectUser)
 * const isAuthenticated = useAuthStore(selectIsAuthenticated)
 * ```
 */
export const selectUser = (state: AuthStore): User | null => state.user;
export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore): boolean => state.isLoading;
