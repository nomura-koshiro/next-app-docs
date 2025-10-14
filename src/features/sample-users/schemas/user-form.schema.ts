import { z } from "zod";

import { emailSchema } from "@/schemas/fields/email.schema";
import { nameSchema } from "@/schemas/fields/name.schema";
import { roleSchema } from "@/schemas/fields/role.schema";

/**
 * ユーザーフォームのバリデーションスキーマ
 * 新規作成・編集フォームで使用
 */
export const userFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
});

/**
 * ユーザーフォームの型定義
 */
export type UserFormValues = z.infer<typeof userFormSchema>;
