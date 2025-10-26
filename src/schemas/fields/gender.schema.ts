import { z } from 'zod';

/**
 * 性別のバリデーションスキーマ
 */
export const genderSchema = z.enum(['male', 'female', 'other'], {
  message: '性別を選択してください',
});

/**
 * 性別の型定義
 */
export type Gender = z.infer<typeof genderSchema>;
