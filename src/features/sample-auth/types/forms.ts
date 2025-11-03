/**
 * 認証機能のフォームスキーマ
 *
 * ログインフォームで使用するバリデーションスキーマ。
 * react-hook-form と組み合わせて使用します。
 *
 * @module features/sample-auth/types/forms
 */

import { z } from "zod";

import { emailSchema } from "@/lib/validations/fields/email";
import { passwordSchema } from "@/lib/validations/fields/password";

// ================================================================================
// フォームバリデーションスキーマ
// ================================================================================

/**
 * ログインフォームのバリデーションスキーマ
 *
 * メールアドレスとパスワードによる認証フォームで使用します。
 * lib/validations から再利用可能なフィールドスキーマを組み合わせて構成しています。
 *
 * @example
 * ```typescript
 * const formData: LoginFormValues = {
 *   email: 'user@example.com',
 *   password: 'password123'
 * }
 * const result = loginFormSchema.safeParse(formData)
 * ```
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * ログインフォームの型定義
 */
export type LoginFormValues = z.infer<typeof loginFormSchema>;
