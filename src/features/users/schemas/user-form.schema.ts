import { z } from "zod";

/**
 * ユーザーフォームのバリデーションスキーマ
 */
export const userFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "名前は必須です" })
    .max(100, { message: "名前は100文字以内で入力してください" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "ロールを選択してください" }),
  }),
});

/**
 * ユーザーフォームの型定義
 */
export type UserFormValues = z.infer<typeof userFormSchema>;
