import { z } from "zod";

/**
 * フォームサンプルのバリデーションスキーマ
 */
export const formSampleSchema = z.object({
  // Input系
  username: z
    .string()
    .min(3, { message: "ユーザー名は3文字以上で入力してください" })
    .max(20, { message: "ユーザー名は20文字以内で入力してください" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "0以上の数値を入力してください",
  }),

  // Select
  country: z.string().min(1, { message: "国を選択してください" }),

  // Textarea
  bio: z
    .string()
    .min(10, { message: "自己紹介は10文字以上で入力してください" })
    .max(500, { message: "自己紹介は500文字以内で入力してください" }),

  // Checkbox
  terms: z.boolean().refine((val) => val === true, {
    message: "利用規約に同意する必要があります",
  }),
  newsletter: z.boolean().optional(),

  // RadioGroup
  gender: z.enum(["male", "female", "other"], {
    message: "性別を選択してください",
  }),

  // Switch
  notifications: z.boolean(),
  darkMode: z.boolean(),

  // Date
  birthdate: z.string().min(1, { message: "生年月日を入力してください" }),
});

export type FormSampleValues = z.infer<typeof formSampleSchema>;
