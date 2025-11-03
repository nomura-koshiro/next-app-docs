/**
 * フィールドバリデーションスキーマのバレルエクスポート
 *
 * @module lib/validations/fields
 *
 * @description
 * アプリケーション全体で使用する再利用可能なフィールドバリデーションスキーマを提供。
 * Zodを使用したバリデーションスキーマをカテゴリ別に整理。
 *
 * @example
 * ```typescript
 * import { emailSchema, passwordSchema, nameSchema } from '@/lib/validations/fields'
 *
 * const userSchema = z.object({
 *   name: nameSchema,
 *   email: emailSchema,
 *   password: passwordSchema
 * })
 * ```
 */

// ================================================================================
// 基本フィールドバリデーションスキーマ
// ================================================================================

export * from "./age";
export * from "./bio";
export * from "./birthdate";
export * from "./country";
export * from "./email";
export * from "./gender";
export * from "./name";
export * from "./password";
export * from "./role";
export * from "./terms";
export * from "./username";
