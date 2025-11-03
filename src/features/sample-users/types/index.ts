/**
 * ユーザー管理機能の型定義
 *
 * @module features/sample-users/types
 */

/**
 * 共通User型とスキーマをre-export
 *
 * アプリケーション全体で統一されたUser型とZodスキーマを使用。
 * 実際の型定義とスキーマは @/types/models/user を参照。
 *
 * @example
 * ```typescript
 * import { User, CreateUserInput, UpdateUserInput, UserRole, createUserSchema } from '@/features/sample-users/types'
 *
 * // 型の使用
 * const user: User = {
 *   id: '123',
 *   name: '山田太郎',
 *   email: 'yamada@example.com',
 *   role: 'user',
 *   createdAt: '2024-01-01T00:00:00Z'
 * }
 *
 * // スキーマでバリデーション
 * const input: CreateUserInput = {
 *   name: '田中花子',
 *   email: 'tanaka@example.com',
 *   role: 'admin'
 * }
 * const result = createUserSchema.safeParse(input)
 * ```
 */
export type { CreateUserInput, UpdateUserInput, User, UserRole } from "@/types/models/user";
export { createUserSchema, updateUserSchema, userRoleSchema, userSchema } from "@/types/models/user";
