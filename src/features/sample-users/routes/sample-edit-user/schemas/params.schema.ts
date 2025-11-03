/**
 * 編集ルート パラメータスキーマ
 *
 * ルートパラメータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * ユーザーID パラメータスキーマ
 *
 * /sample-users/edit/[id] のパラメータを検証
 */
export const EditUserParamsSchema = z.object({
  id: z.string().min(1, "ユーザーIDは必須です"),
});

/**
 * 型推論
 */
export type EditUserParams = z.infer<typeof EditUserParamsSchema>;
