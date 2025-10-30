/**
 * サンプル認証API統合エクスポート
 *
 * @module features/sample-auth/api
 *
 * @description
 * サンプル認証機能のAPI関数とフックを提供。
 * ログイン、ログアウト、ユーザー情報取得などの認証操作を含む。
 *
 * @example
 * ```typescript
 * import { useLogin, useLogout, useGetUser } from '@/features/sample-auth/api'
 *
 * // ログイン
 * const { mutate: login } = useLogin()
 * login({ email: 'user@example.com', password: 'password' })
 *
 * // ログアウト
 * const { mutate: logout } = useLogout()
 * logout()
 * ```
 */

// ================================================================================
// Auth API Exports
// ================================================================================

export * from './get-user';
export * from './login';
export * from './logout';
