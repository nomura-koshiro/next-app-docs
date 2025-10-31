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

export type User = {
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
  user: User | null;
  isAuthenticated: boolean;
  account: AccountInfo | null;

  // ================================================================================
  // Actions
  // ================================================================================
  setUser: (user: User | null) => void;
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

export const selectUser = (state: AuthStore): User | null => state.user;

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
