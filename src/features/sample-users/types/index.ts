/**
 * ユーザー管理機能の型定義
 *
 * @module features/sample-users/types
 */

/**
 * サンプル機能用のUser型をre-export
 *
 * サンプル機能では簡易的なSampleUser型を使用します。
 * 実際のアプリケーションではUser型を使用してください。
 *
 * @example
 * ```typescript
 * import { User, CreateUserInput, UpdateUserInput, UserRole } from '@/features/sample-users/types'
 *
 * const user: User = {
 *   id: '123',
 *   name: '山田太郎',
 *   email: 'yamada@example.com',
 *   role: 'user'
 * }
 *
 * const createInput: CreateUserInput = {
 *   name: '田中花子',
 *   email: 'tanaka@example.com',
 *   role: 'admin'
 * }
 * ```
 */
export type { CreateUserInput, UpdateUserInput, SampleUser as User, UserRole } from "@/types/models/user";

// ================================================================================
// Zodスキーマのエクスポート
// ================================================================================

/**
 * Zodスキーマをエクスポート
 *
 * バリデーションが必要な場合は、これらのスキーマを使用してください。
 */
export { createUserInputSchema, sampleUserSchema, updateUserInputSchema, userRoleSchema } from "@/types/models/user";
