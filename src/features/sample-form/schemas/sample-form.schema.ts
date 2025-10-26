import { z } from 'zod';

import { ageSchema } from '@/schemas/fields/age.schema';
import { bioSchema } from '@/schemas/fields/bio.schema';
import { birthdateSchema } from '@/schemas/fields/birthdate.schema';
import { countrySchema } from '@/schemas/fields/country.schema';
import { emailSchema } from '@/schemas/fields/email.schema';
import { genderSchema } from '@/schemas/fields/gender.schema';
import { optionalCheckboxSchema, termsSchema } from '@/schemas/fields/terms.schema';
import { usernameSchema } from '@/schemas/fields/username.schema';

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
