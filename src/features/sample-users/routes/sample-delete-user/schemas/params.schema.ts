/**
 * 削除ルート パラメータスキーマ
 *
 * ルートパラメータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * ユーザーID パラメータスキーマ
 *
 * /sample-users/delete/[id] のパラメータを検証
 */
export const DeleteUserParamsSchema = z.object({
  id: z.string().min(1, "ユーザーIDは必須です"),
});

/**
 * 型推論
 */
export type DeleteUserParams = z.infer<typeof DeleteUserParamsSchema>;
