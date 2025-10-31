/**
 * 本番認証API統合エクスポート
 *
 * @module features/auth/api
 *
 * @description
 * 本番環境で使用する認証機能のAPI関数とフックを提供。
 * Azure Entra ID認証を使用した現在のユーザー情報取得を含む。
 *
 * @example
 * ```typescript
 * import { useGetMe } from '@/features/auth/api'
 *
 * // 現在のユーザー情報取得
 * const { data: user } = useGetMe()
 * console.log(user.data.name)
 * ```
 */

// ================================================================================
// Auth API Exports
// ================================================================================

export * from "./get-me";
