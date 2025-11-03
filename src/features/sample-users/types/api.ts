/**
 * ユーザーAPI レスポンススキーマ
 *
 * APIから返されるレスポンスデータのランタイムバリデーション用スキーマ。
 * Zodを使用してAPIレスポンスの型安全性を実現します。
 *
 * @module features/sample-users/types/api
 */

import { z } from "zod";

import { userSchema } from "./index";

// ================================================================================
// API レスポンススキーマ
// ================================================================================

/**
 * ユーザー詳細レスポンススキーマ
 *
 * GET /api/v1/sample/users/:id のレスポンス
 *
 * @example
 * ```typescript
 * const response: UserOutput = {
 *   data: {
 *     id: '123',
 *     name: '山田太郎',
 *     email: 'yamada@example.com',
 *     role: 'user',
 *     createdAt: '2024-01-01T00:00:00Z'
 *   }
 * }
 * ```
 */
export const userOutputSchema = z.object({
  data: userSchema,
});

/**
 * ユーザー詳細レスポンス型
 */
export type UserOutput = z.infer<typeof userOutputSchema>;

/**
 * ユーザー一覧レスポンススキーマ
 *
 * GET /api/v1/sample/users のレスポンス
 *
 * @example
 * ```typescript
 * const response: UsersOutput = {
 *   data: [
 *     { id: '1', name: '山田太郎', email: 'yamada@example.com', role: 'user', createdAt: '2024-01-01T00:00:00Z' },
 *     { id: '2', name: '田中花子', email: 'tanaka@example.com', role: 'admin', createdAt: '2024-01-02T00:00:00Z' }
 *   ]
 * }
 * ```
 */
export const usersOutputSchema = z.object({
  data: z.array(userSchema),
});

/**
 * ユーザー一覧レスポンス型
 */
export type UsersOutput = z.infer<typeof usersOutputSchema>;

/**
 * ユーザー作成レスポンススキーマ
 *
 * POST /api/v1/sample/users のレスポンス
 *
 * @example
 * ```typescript
 * const response: CreateUserOutput = {
 *   id: '123',
 *   name: '新規ユーザー',
 *   email: 'new@example.com',
 *   role: 'user',
 *   createdAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export const createUserOutputSchema = userSchema;

/**
 * ユーザー作成レスポンス型
 */
export type CreateUserOutput = z.infer<typeof createUserOutputSchema>;
