/**
 * 認証関連の型定義
 */

/**
 * ユーザー情報
 */
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
};

/**
 * 認証状態
 */
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

/**
 * 認証アクション
 */
export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
};

/**
 * 認証ストアの完全な型
 */
export type AuthStore = AuthState & AuthActions;
