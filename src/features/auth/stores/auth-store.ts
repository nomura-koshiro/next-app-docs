// ================================================================================
// Imports
// ================================================================================

import type { AccountInfo } from "@azure/msal-browser";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ================================================================================
// 定数
// ================================================================================

/**
 * Zustandの認証ストアで使用されるsessionStorageのキー
 */
const AUTH_STORAGE_KEY = "azure-auth-storage";

// ================================================================================
// 型定義
// ================================================================================

/**
 * 認証ストア用のユーザー型
 *
 * Azure Entra ID (MSAL) からの認証情報を保持するフロントエンド専用の型。
 * バックエンドAPIのUser型（src/types/models/user.ts）とは異なり、
 * セッションストレージに永続化する最小限の情報のみを含む。
 *
 * @see {@link src/types/models/user.ts} - バックエンドAPI用のグローバルUser型
 */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  azureOid: string;
  roles: string[];
};

export type AuthStore = {
  // ================================================================================
  // State
  // ================================================================================
  user: AuthUser | null;
  isAuthenticated: boolean;
  account: AccountInfo | null;

  // ================================================================================
  // Actions
  // ================================================================================
  setUser: (user: AuthUser | null) => void;
  setAccount: (account: AccountInfo | null) => void;
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
      setUser: (user: AuthUser | null) => {
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

export const selectUser = (state: AuthStore): AuthUser | null => state.user;

export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated;

// ================================================================================
// カスタムフック（セレクター関数を使いやすくする）
// ================================================================================

/**
 * コンポーネントの再レンダリングを最適化します。
 */
export const useUser = () => useAuthStore(selectUser);

/**
 * コンポーネントの再レンダリングを最適化します。
 */
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
