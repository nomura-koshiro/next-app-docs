/**
 * 認証ストア統合エクスポート
 *
 * @module features/auth/stores
 *
 * @description
 * 認証状態管理ストアを提供。
 * Zustandを使用したグローバル認証状態の管理。
 *
 * @example
 * ```typescript
 * import { useAuthStore } from '@/features/auth/stores'
 *
 * const { user, setUser, isAuthenticated } = useAuthStore()
 *
 * // ユーザー情報設定
 * setUser({ id: '1', name: 'John', email: 'john@example.com' })
 * ```
 */

// ================================================================================
// Auth Stores Exports
// ================================================================================

export * from './auth-store';
