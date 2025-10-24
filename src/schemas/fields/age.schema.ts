import { z } from 'zod';

/**
 * 年齢のバリデーションスキーマ
 * 0以上の数値
 */
export const ageSchema = z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
  message: '0以上の数値を入力してください',
});
