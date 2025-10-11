import { z } from "zod";

/**
 * ログインフォームのバリデーションスキーマ
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(1, { message: "パスワードは必須です" }),
});

/**
 * ログインフォームの型定義
 */
export type LoginFormValues = z.infer<typeof loginFormSchema>;
