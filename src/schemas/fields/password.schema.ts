import { z } from 'zod';

/**
 * パスワードのバリデーションスキーマ
 */
export const passwordSchema = z.string().min(1, { message: 'パスワードは必須です' });

/**
 * 強力なパスワードのバリデーションスキーマ
 * 8文字以上、英数字を含む
 */
export const strongPasswordSchema = z
  .string()
  .min(8, { message: 'パスワードは8文字以上で入力してください' })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'パスワードは英字と数字を含む必要があります',
  });
