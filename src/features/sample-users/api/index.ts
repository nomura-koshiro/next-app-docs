/**
 * ユーザー管理API統合エクスポート
 *
 * @module features/sample-users/api
 *
 * @description
 * ユーザー管理機能のすべてのAPI関数とフックを提供。
 * CRUD操作（作成、読み取り、更新、削除）を含む。
 *
 * @example
 * ```typescript
 * import {
 *   useUsers,
 *   useUser,
 *   useCreateUser,
 *   useUpdateUser,
 *   useDeleteUser
 * } from '@/features/sample-users/api'
 *
 * // ユーザー一覧取得
 * const { data: users } = useUsers()
 *
 * // ユーザー作成
 * const { mutate: createUser } = useCreateUser()
 * createUser({ name: 'John', email: 'john@example.com', role: 'user' })
 * ```
 */

// ================================================================================
// User API Exports
// ================================================================================

export * from './create-user';
export * from './delete-user';
export * from './get-user';
export * from './get-users';
export * from './update-user';
