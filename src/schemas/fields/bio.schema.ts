import { z } from 'zod';

/**
 * 自己紹介のバリデーションスキーマ
 * 10〜500文字
 */
export const bioSchema = z
  .string()
  .min(10, { message: '自己紹介は10文字以上で入力してください' })
  .max(500, { message: '自己紹介は500文字以内で入力してください' });
