/**
 * 認証機能の型定義
 *
 * @module features/sample-auth/types
 */

import type { SampleUser as User } from "@/types/models/user";

/**
 * サンプル機能用のUser型をre-export
 *
 * サンプル機能では簡易的なSampleUser型を使用します。
 * 実際のアプリケーションではUser型を使用してください。
 */
export type { SampleUser as User } from "@/types/models/user";

/**
 * 認証状態を表す型
 *
 * @property user - 現在ログイン中のユーザー情報（未ログイン時はnull）
 * @property isAuthenticated - 認証済みかどうか
 * @property isLoading - 認証状態の読み込み中かどうか
 *
 * @example
 * ```typescript
 * const authState: AuthState = {
 *   user: { id: '1', name: 'John', email: 'john@example.com' },
 *   isAuthenticated: true,
 *   isLoading: false
 * }
 * ```
 */
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

/**
 * 認証アクションを表す型
 *
 * @property login - ログイン処理を実行する関数
 * @property logout - ログアウト処理を実行する関数
 * @property setUser - ユーザー情報を設定する関数
 *
 * @example
 * ```typescript
 * const authActions: AuthActions = {
 *   login: async (email, password) => { ... },
 *   logout: () => { ... },
 *   setUser: (user) => { ... }
 * }
 * ```
 */
export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
};

/**
 * 認証ストアの完全な型
 *
 * AuthStateとAuthActionsを統合した型。
 * Zustandストアなどの状態管理で使用。
 *
 * @example
 * ```typescript
 * const useAuthStore = create<AuthStore>((set) => ({
 *   user: null,
 *   isAuthenticated: false,
 *   isLoading: false,
 *   login: async (email, password) => { ... },
 *   logout: () => { ... },
 *   setUser: (user) => set({ user })
 * }))
 * ```
 */
export type AuthStore = AuthState & AuthActions;
