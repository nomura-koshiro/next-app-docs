/**
 * 認証API レスポンススキーマ
 *
 * APIから返されるレスポンスデータのランタイムバリデーション用スキーマ。
 * Zodを使用してAPIレスポンスの型安全性を実現します。
 *
 * @module features/sample-auth/types/api
 */

import { z } from "zod";

import { userSchema } from "@/types/models/user";

// ================================================================================
// API レスポンススキーマ
// ================================================================================

/**
 * ログインレスポンススキーマ
 *
 * POST /api/v1/sample/auth/login のレスポンス
 *
 * @example
 * ```typescript
 * const response: LoginOutput = {
 *   user: {
 *     id: '123',
 *     name: '山田太郎',
 *     email: 'yamada@example.com',
 *     role: 'user',
 *     createdAt: '2024-01-01T00:00:00Z'
 *   },
 *   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * }
 * ```
 */
export const loginOutputSchema = z.object({
  user: userSchema,
  token: z.string().min(1, "トークンは必須です"),
});

/**
 * ログインレスポンス型
 */
export type LoginOutput = z.infer<typeof loginOutputSchema>;

/**
 * ユーザー情報取得レスポンススキーマ
 *
 * GET /api/v1/sample/auth/me のレスポンス
 *
 * @example
 * ```typescript
 * const response: GetUserOutput = {
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
export const getUserOutputSchema = z.object({
  data: userSchema,
});

/**
 * ユーザー情報取得レスポンス型
 */
export type GetUserOutput = z.infer<typeof getUserOutputSchema>;
