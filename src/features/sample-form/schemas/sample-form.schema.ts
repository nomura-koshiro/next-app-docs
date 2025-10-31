import { z } from "zod";

import { ageSchema } from "@/schemas/fields/age.schema";
import { bioSchema } from "@/schemas/fields/bio.schema";
import { birthdateSchema } from "@/schemas/fields/birthdate.schema";
import { countrySchema } from "@/schemas/fields/country.schema";
import { emailSchema } from "@/schemas/fields/email.schema";
import { genderSchema } from "@/schemas/fields/gender.schema";
import { optionalCheckboxSchema, termsSchema } from "@/schemas/fields/terms.schema";
import { usernameSchema } from "@/schemas/fields/username.schema";

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
