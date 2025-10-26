import { z } from 'zod';

/**
 * 利用規約同意のバリデーションスキーマ
 * 必ずtrueである必要がある
 */
export const termsSchema = z.boolean().refine((val) => val === true, {
  message: '利用規約に同意する必要があります',
});

/**
 * オプショナルなチェックボックス（ニュースレター購読など）
 */
export const optionalCheckboxSchema = z.boolean().optional();
