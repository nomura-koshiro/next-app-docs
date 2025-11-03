/**
 * サンプル認証API レスポンススキーマ
 *
 * APIから返されるユーザーデータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * ユーザーロールスキーマ
 */
export const UserRoleSchema = z.enum(["user", "admin"]);

/**
 * ユーザー情報スキーマ
 */
export const UserSchema = z.object({
  id: z.string().min(1, "ユーザーIDは必須です"),
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスではありません"),
  role: UserRoleSchema,
  createdAt: z.string().min(1, "作成日時は必須です"),
  updatedAt: z.string().optional(),
});

/**
 * ログインレスポンススキーマ
 *
 * POST /api/v1/sample/auth/login のレスポンス
 */
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string().min(1, "トークンは必須です"),
});

/**
 * ユーザー詳細レスポンススキーマ
 *
 * GET /api/v1/sample/auth/me のレスポンス
 */
export const GetUserResponseSchema = z.object({
  data: UserSchema,
});

/**
 * 型推論
 */
export type User = z.infer<typeof UserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
