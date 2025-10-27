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

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthStore, User } from '../types';

/**
 * 認証ストア
 *
 * LocalStorageに永続化され、ページリロード後も状態を保持します。
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
            id: '1',
            email: email,
            name: 'Sample User',
            role: 'user',
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
      name: 'auth-storage', // LocalStorageのキー名
      storage: createJSONStorage(() => localStorage), // LocalStorageを使用
      // セッションストレージを使用したい場合:
      // storage: createJSONStorage(() => sessionStorage),

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
