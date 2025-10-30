/**
 * ユーザー管理機能の型定義
 *
 * @module features/sample-users/types
 */

/**
 * 共通User型をre-export
 *
 * アプリケーション全体で統一されたUser型を使用。
 * 実際の型定義は @/types/models/user を参照。
 *
 * @example
 * ```typescript
 * import { User, CreateUserDTO, UpdateUserDTO, UserRole } from '@/features/sample-users/types'
 *
 * const user: User = {
 *   id: '123',
 *   name: '山田太郎',
 *   email: 'yamada@example.com',
 *   role: 'user'
 * }
 *
 * const createDTO: CreateUserDTO = {
 *   name: '田中花子',
 *   email: 'tanaka@example.com',
 *   role: 'admin'
 * }
 * ```
 */
export type { CreateUserDTO, UpdateUserDTO, User, UserRole } from '@/types/models/user';
