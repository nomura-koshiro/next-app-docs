import { z } from 'zod';

/**
 * ユーザーロールのバリデーションスキーマ
 */
export const roleSchema = z.enum(['user', 'admin'], {
  message: 'ロールを選択してください',
});

/**
 * ユーザーロールの型定義
 */
export type Role = z.infer<typeof roleSchema>;
