/**
 * ユーザー管理機能のフォームスキーマ
 *
 * ユーザー作成・編集フォームで使用するバリデーションスキーマ。
 * react-hook-form と組み合わせて使用します。
 *
 * @module features/sample-users/types/forms
 */

import { z } from "zod";

import { emailSchema } from "@/lib/validations/fields/email";
import { nameSchema } from "@/lib/validations/fields/name";
import { roleSchema } from "@/lib/validations/fields/role";

// ================================================================================
// フォームバリデーションスキーマ
// ================================================================================

/**
 * ユーザーフォームのバリデーションスキーマ
 *
 * 新規作成・編集フォームで使用します。
 * lib/validations から再利用可能なフィールドスキーマを組み合わせて構成しています。
 *
 * @example
 * ```typescript
 * const formData: UserFormValues = {
 *   name: '山田太郎',
 *   email: 'yamada@example.com',
 *   role: 'user'
 * }
 * const result = userFormSchema.safeParse(formData)
 * ```
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
