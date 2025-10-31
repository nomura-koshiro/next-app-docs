/**
 * 認証フック統合エクスポート
 *
 * @module features/auth/hooks
 *
 * @description
 * 認証機能のカスタムフックを提供。
 * 環境に応じて本番認証（Azure Entra ID）または開発認証（モック）を切り替え。
 *
 * @example
 * ```typescript
 * import { useAuth } from '@/features/auth/hooks'
 *
 * const { user, isAuthenticated, login, logout } = useAuth()
 *
 * // ログイン状態確認
 * if (isAuthenticated) {
 *   console.log('ログイン中:', user?.name)
 * }
 * ```
 */

// ================================================================================
// Auth Hooks Exports
// ================================================================================

export * from "./use-auth";
