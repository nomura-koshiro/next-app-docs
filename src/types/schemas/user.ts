/**
 * ユーザー型のZodスキーマ定義
 *
 * @module types/schemas/user
 */

import { z } from "zod";

// ================================================================================
// システムロールスキーマ
// ================================================================================

/**
 * システムロールのスキーマ
 */
export const systemRoleSchema = z.enum(["system_admin", "user"]);

export type SystemRole = z.infer<typeof systemRoleSchema>;

// ================================================================================
// ユーザースキーマ（本番用）
// ================================================================================

/**
 * ユーザーのスキーマ
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  azure_oid: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().nullable(),
  roles: z.array(systemRoleSchema),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_login: z.string().datetime().nullable(),
});

export type User = z.infer<typeof userSchema>;

// ================================================================================
// サンプルユーザースキーマ（デモ用）
// ================================================================================

/**
 * ユーザーロールのスキーマ（サンプル用）
 */
export const userRoleSchema = z.enum(["user", "admin"]);

export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * サンプルユーザーのスキーマ
 */
export const sampleUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type SampleUser = z.infer<typeof sampleUserSchema>;

// ================================================================================
// Input スキーマ
// ================================================================================

/**
 * ユーザー作成の入力スキーマ（サンプル用）
 */
export const createUserInputSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  role: userRoleSchema,
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

/**
 * ユーザー更新の入力スキーマ（サンプル用）
 */
export const updateUserInputSchema = createUserInputSchema.partial();

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
