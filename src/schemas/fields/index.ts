/**
 * フィールドスキーマのバレルエクスポート
 *
 * @module schemas/fields
 *
 * @description
 * アプリケーション全体で使用する再利用可能なフィールドスキーマを提供。
 * Zodを使用したバリデーションスキーマをカテゴリ別に整理。
 *
 * @example
 * ```typescript
 * import { emailSchema, passwordSchema, nameSchema } from '@/schemas/fields'
 *
 * const userSchema = z.object({
 *   name: nameSchema,
 *   email: emailSchema,
 *   password: passwordSchema
 * })
 * ```
 */

// ================================================================================
// 基本フィールドスキーマ
// ================================================================================

export * from "./age.schema";
export * from "./bio.schema";
export * from "./birthdate.schema";
export * from "./country.schema";
export * from "./email.schema";
export * from "./gender.schema";
export * from "./name.schema";
export * from "./password.schema";
export * from "./role.schema";
export * from "./terms.schema";
export * from "./username.schema";
