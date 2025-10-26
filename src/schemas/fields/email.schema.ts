import { z } from 'zod';

/**
 * メールアドレスのバリデーションスキーマ
 * 全機能で共通のメールアドレスバリデーション
 */
export const emailSchema = z
  .string()
  .min(1, { message: 'メールアドレスは必須です' })
  .email({ message: '有効なメールアドレスを入力してください' });
