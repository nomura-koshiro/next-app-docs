// ================================================================================
// Imports
// ================================================================================

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
  /** ローディング中かどうか */
  isLoading: boolean;
  /** MSALアカウント情報 */
  account: AccountInfo | null;

  // ================================================================================
  // Actions
  // ================================================================================
  /** ユーザー情報を設定 */
  setUser: (user: User | null) => void;
  /** アカウント情報を設定 */
  setAccount: (account: AccountInfo | null) => void;
  /** ローディング状態を設定 */
  setLoading: (loading: boolean) => void;
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

// ================================================================================
// セレクター関数
// ================================================================================

/**
 * ユーザー情報を取得するセレクター
 *
 * @param state - 認証ストアの状態
 * @returns ユーザー情報
 */
export const selectUser = (state: AuthStore): User | null => state.user;

/**
 * 認証状態を取得するセレクター
 *
 * @param state - 認証ストアの状態
 * @returns 認証済みかどうか
 */
export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated;

/**
 * ローディング状態を取得するセレクター
 *
 * @param state - 認証ストアの状態
 * @returns ローディング中かどうか
 */
export const selectIsLoading = (state: AuthStore): boolean => state.isLoading;
