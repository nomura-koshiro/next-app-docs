/**
 * サンプルフォーム機能のフォームスキーマ
 *
 * @module features/sample-form/types/forms
 */

import { z } from "zod";

import { ageSchema } from "@/lib/validations/fields/age";
import { bioSchema } from "@/lib/validations/fields/bio";
import { birthdateSchema } from "@/lib/validations/fields/birthdate";
import { countrySchema } from "@/lib/validations/fields/country";
import { emailSchema } from "@/lib/validations/fields/email";
import { genderSchema } from "@/lib/validations/fields/gender";
import { optionalCheckboxSchema, termsSchema } from "@/lib/validations/fields/terms";
import { usernameSchema } from "@/lib/validations/fields/username";

/**
 * サンプルフォームのバリデーションスキーマ
 */
export const sampleFormSchema = z.object({
  // Input系
  username: usernameSchema,
  email: emailSchema,
  age: ageSchema,

  // セレクト
  country: countrySchema,

  // テキストエリア
  bio: bioSchema,

  // チェックボックス
  terms: termsSchema,
  newsletter: optionalCheckboxSchema,

  // ラジオグループ
  gender: genderSchema,

  // スイッチ
  notifications: z.boolean(),
  darkMode: z.boolean(),

  // 日付
  birthdate: birthdateSchema,
});

export type SampleFormValues = z.infer<typeof sampleFormSchema>;
