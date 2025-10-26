import { z } from 'zod';

/**
 * 名前のバリデーションスキーマ
 * 汎用的な名前フィールド（1〜100文字）
 */
export const nameSchema = z.string().min(1, { message: '名前は必須です' }).max(100, { message: '名前は100文字以内で入力してください' });
