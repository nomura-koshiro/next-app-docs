import { z } from 'zod';

/**
 * ユーザー名のバリデーションスキーマ
 * 3〜20文字
 */
export const usernameSchema = z
  .string()
  .min(3, { message: 'ユーザー名は3文字以上で入力してください' })
  .max(20, { message: 'ユーザー名は20文字以内で入力してください' });
