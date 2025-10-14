import { z } from "zod";

import { emailSchema } from "@/schemas/fields/email.schema";
import { passwordSchema } from "@/schemas/fields/password.schema";

/**
 * ログインフォームのバリデーションスキーマ
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * ログインフォームの型定義
 */
export type LoginFormValues = z.infer<typeof loginFormSchema>;
