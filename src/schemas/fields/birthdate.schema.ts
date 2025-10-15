import { z } from 'zod';

/**
 * 生年月日のバリデーションスキーマ
 */
export const birthdateSchema = z.string().min(1, { message: '生年月日を入力してください' });
