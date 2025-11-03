/**
 * Sample Auth ストア永続化データバリデーションスキーマ
 *
 * localStorageから読み込まれるデータのランタイムバリデーション用スキーマ
 * 改ざんや不正なデータからアプリケーションを保護
 */

import { z } from "zod";

/**
 * ユーザーロールスキーマ
 */
export const UserRoleStorageSchema = z.enum(["user", "admin"]);

/**
 * ユーザー情報ストレージスキーマ
 */
export const UserStorageSchema = z.object({
  id: z.string().min(1, "ユーザーIDは必須です"),
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスではありません"),
  role: UserRoleStorageSchema,
  createdAt: z.string().min(1, "作成日時は必須です"),
  updatedAt: z.string().optional(),
});

/**
 * 認証ストア永続化データスキーマ
 *
 * Zustand persistによってlocalStorageに保存されるデータの構造
 * 不正なデータや改ざんされたデータを検出・除外
 */
export const AuthStorageSchema = z.object({
  user: UserStorageSchema.nullable(),
  isAuthenticated: z.boolean(),
  // isLoadingは永続化されない（parializeで除外）
});

/**
 * 型推論
 */
export type UserStorage = z.infer<typeof UserStorageSchema>;
export type AuthStorage = z.infer<typeof AuthStorageSchema>;
