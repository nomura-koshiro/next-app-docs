/**
 * 認証機能のZodスキーマ定義
 *
 * @module features/sample-auth/schemas
 */

import { z } from "zod";

// ================================================================================
// 基本スキーマ
// ================================================================================

/**
 * ユーザーロールのスキーマ（サンプル用）
 */
export const userRoleSchema = z.enum(["user", "admin"]);

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
 * ログイン入力スキーマ
 */
export const loginInputSchema = z.object({
  email: z.string().min(1, "メールアドレスは必須です").email("正しいメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードは必須です"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// ================================================================================
// レスポンススキーマ
// ================================================================================

/**
 * ログイン成功レスポンスのスキーマ
 */
export const loginDetailSchema = z.object({
  user: sampleUserSchema,
  token: z.string(),
});

export type LoginDetail = z.infer<typeof loginDetailSchema>;
