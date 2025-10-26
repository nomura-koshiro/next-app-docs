import { z } from 'zod';

/**
 * 国選択のバリデーションスキーマ
 */
export const countrySchema = z.string().min(1, { message: '国を選択してください' });
