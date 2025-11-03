/**
 * ユーザーAPI レスポンススキーマ
 *
 * APIから返されるユーザーデータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * ユーザーロールスキーマ
 */
export const UserRoleSchema = z.enum(["user", "admin"]);

/**
 * ユーザースキーマ
 *
 * APIレスポンスから返されるユーザーオブジェクトを検証
 */
export const UserSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスではありません"),
  role: UserRoleSchema,
  createdAt: z.string().min(1, "作成日時は必須です"),
  updatedAt: z.string().optional(),
});

/**
 * ユーザー詳細レスポンススキーマ
 *
 * GET /api/v1/sample/users/:id のレスポンス
 */
export const UserResponseSchema = z.object({
  data: UserSchema,
});

/**
 * ユーザー一覧レスポンススキーマ
 *
 * GET /api/v1/sample/users のレスポンス
 */
export const UsersResponseSchema = z.object({
  data: z.array(UserSchema),
});

/**
 * ユーザー作成レスポンススキーマ
 *
 * POST /api/v1/sample/users のレスポンス
 */
export const CreateUserResponseSchema = UserSchema;

/**
 * ユーザー更新レスポンススキーマ
 *
 * PUT /api/v1/sample/users/:id のレスポンス
 * PATCH /api/v1/sample/users/:id のレスポンス
 */
export const UpdateUserResponseSchema = z.object({
  data: UserSchema,
});

/**
 * 型推論
 */
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;
