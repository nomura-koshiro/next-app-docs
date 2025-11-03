/**
 * 認証API レスポンススキーマ
 *
 * APIから返されるユーザーデータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * ユーザー情報スキーマ
 *
 * GET /auth/me のレスポンス
 */
export const UserSchema = z.object({
  id: z.string().min(1, "ユーザーIDは必須です"),
  email: z.string().email("有効なメールアドレスではありません"),
  name: z.string().min(1, "名前は必須です"),
  azureOid: z.string().min(1, "Azure OIDは必須です"),
  roles: z.array(z.string()),
});

/**
 * 型推論
 */
export type User = z.infer<typeof UserSchema>;
