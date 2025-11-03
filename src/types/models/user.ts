/**
 * ユーザーモデルの型定義
 *
 * アプリケーション全体で使用するユーザーエンティティの型定義とバリデーションスキーマ。
 * Zodスキーマを使用してランタイムバリデーションを提供します。
 *
 * @module types/models/user
 */

import { z } from "zod";

// ================================================================================
// ユーザーロールスキーマ
// ================================================================================

/**
 * ユーザーロールスキーマ
 *
 * システム内でのユーザーの権限レベルを定義します。
 * - user: 一般ユーザー
 * - admin: 管理者
 */
export const userRoleSchema = z.enum(["user", "admin"]);

/**
 * ユーザーロール型
 */
export type UserRole = z.infer<typeof userRoleSchema>;

// ================================================================================
// ユーザースキーマ
// ================================================================================

/**
 * ベースユーザースキーマ（内部使用）
 *
 * ユーザーの基本情報を定義します。
 * createUserSchema と updateUserSchema の基礎となります。
 */
const userBaseSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  role: userRoleSchema,
});

/**
 * ユーザースキーマ
 *
 * アプリケーション全体で使用する統一ユーザーエンティティの定義。
 * データベースに保存されている完全なユーザー情報を表します。
 *
 * @property id - ユーザーの一意識別子
 * @property name - ユーザーの表示名
 * @property email - ユーザーのメールアドレス
 * @property role - ユーザーの権限レベル
 * @property createdAt - アカウント作成日時（ISO 8601形式）
 * @property updatedAt - 最終更新日時（ISO 8601形式、任意）
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: '123',
 *   name: '山田太郎',
 *   email: 'yamada@example.com',
 *   role: 'user',
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-15T12:30:00Z'
 * }
 * ```
 */
export const userSchema = userBaseSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * ユーザー型
 */
export type User = z.infer<typeof userSchema>;

// ================================================================================
// ユーザー入力スキーマ
// ================================================================================

/**
 * 新規ユーザー作成用のスキーマ
 *
 * POST /api/v1/sample/users のリクエストボディに使用します。
 *
 * @example
 * ```typescript
 * const input: CreateUserInput = {
 *   name: '田中花子',
 *   email: 'tanaka@example.com',
 *   role: 'admin'
 * }
 * const result = createUserSchema.safeParse(input)
 * ```
 */
export const createUserSchema = userBaseSchema;

/**
 * 新規ユーザー作成用の入力型
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * ユーザー更新用のスキーマ
 *
 * PATCH /api/v1/sample/users/:id のリクエストボディに使用します。
 * すべてのフィールドが任意（partial）となります。
 *
 * @example
 * ```typescript
 * const input: UpdateUserInput = {
 *   name: '田中花子（更新後）'
 * }
 * const result = updateUserSchema.safeParse(input)
 * ```
 */
export const updateUserSchema = userBaseSchema.partial();

/**
 * ユーザー更新用の入力型
 */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
