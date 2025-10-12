import { z } from "zod";
import { usernameSchema } from "@/schemas/fields/username.schema";
import { emailSchema } from "@/schemas/fields/email.schema";
import { ageSchema } from "@/schemas/fields/age.schema";
import { countrySchema } from "@/schemas/fields/country.schema";
import { bioSchema } from "@/schemas/fields/bio.schema";
import {
  termsSchema,
  optionalCheckboxSchema,
} from "@/schemas/fields/terms.schema";
import { genderSchema } from "@/schemas/fields/gender.schema";
import { birthdateSchema } from "@/schemas/fields/birthdate.schema";

/**
 * サンプルフォームのバリデーションスキーマ
 */
export const sampleFormSchema = z.object({
  // Input系
  username: usernameSchema,
  email: emailSchema,
  age: ageSchema,

  // Select
  country: countrySchema,

  // Textarea
  bio: bioSchema,

  // Checkbox
  terms: termsSchema,
  newsletter: optionalCheckboxSchema,

  // RadioGroup
  gender: genderSchema,

  // Switch
  notifications: z.boolean(),
  darkMode: z.boolean(),

  // Date
  birthdate: birthdateSchema,
});

export type SampleFormValues = z.infer<typeof sampleFormSchema>;
