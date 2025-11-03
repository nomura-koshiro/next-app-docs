/**
 * 認証ストア永続化データバリデーションスキーマ
 *
 * sessionStorageから読み込まれるデータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * ユーザー情報スキーマ
 */
export const UserStorageSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  azureOid: z.string().min(1),
  roles: z.array(z.string()),
});

/**
 * Azure MSAL AccountInfo スキーマ
 *
 * @see https://azuread.github.io/microsoft-authentication-library-for-js/ref/interfaces/_azure_msal_common.AccountInfo.html
 */
export const AccountInfoStorageSchema = z.object({
  homeAccountId: z.string(),
  environment: z.string(),
  tenantId: z.string(),
  username: z.string(),
  localAccountId: z.string(),
  name: z.string().optional(),
  idTokenClaims: z.record(z.string(), z.unknown()).optional(),
});

/**
 * 認証ストア永続化データスキーマ
 *
 * Zustand persistによってsessionStorageに保存されるデータの構造
 */
export const AuthStorageSchema = z.object({
  user: UserStorageSchema.nullable(),
  isAuthenticated: z.boolean(),
  account: AccountInfoStorageSchema.nullable(),
});

/**
 * 型推論
 */
export type UserStorage = z.infer<typeof UserStorageSchema>;
export type AccountInfoStorage = z.infer<typeof AccountInfoStorageSchema>;
export type AuthStorage = z.infer<typeof AuthStorageSchema>;
