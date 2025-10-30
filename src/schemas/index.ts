/**
 * スキーマのバレルエクスポート
 *
 * @module schemas
 *
 * @description
 * アプリケーション全体で使用するバリデーションスキーマの統合エクスポート。
 * Zodスキーマを用いたフォーム入力やAPI リクエストの検証を提供。
 *
 * @example
 * ```typescript
 * import { emailSchema, passwordSchema } from '@/schemas'
 *
 * const loginSchema = z.object({
 *   email: emailSchema,
 *   password: passwordSchema
 * })
 * ```
 */

// ================================================================================
// フィールドスキーマ
// ================================================================================

export * from './fields';
