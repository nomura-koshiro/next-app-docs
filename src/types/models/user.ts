// ================================================================================
// Zodスキーマのエクスポート
// ================================================================================

/**
 * Zodスキーマをエクスポート
 *
 * バリデーションが必要な場合は、これらのスキーマを使用してください。
 */
export {
  createUserInputSchema,
  sampleUserSchema,
  systemRoleSchema,
  updateUserInputSchema,
  userRoleSchema,
  userSchema,
} from "../schemas/user";

// ================================================================================
// 定数
// ================================================================================

/**
 * システムレベルのロール定数
 */
export const SYSTEM_ROLES = {
  SYSTEM_ADMIN: "system_admin",
  USER: "user",
} as const;

/**
 * システムレベルのロール型
 */
export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

/**
 * SystemRoleの型ガード関数
 */
export const isSystemRole = (value: unknown): value is SystemRole => {
  return Object.values(SYSTEM_ROLES).includes(value as SystemRole);
};

/**
 * ユーザー型
 *
 * アプリケーション全体で使用する統一User型定義
 */
export type User = {
  id: string;
  azure_oid: string;
  email: string;
  display_name: string | null;
  roles: SystemRole[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
};

// ================================================================================
// Sample機能用の型定義
// ================================================================================

/**
 * サンプル機能用のユーザーロール型
 */
export type UserRole = "user" | "admin";

/**
 * サンプル機能用のユーザー型
 */
export type SampleUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};

/**
 * サンプル機能用の新規ユーザー作成入力型
 *
 * バリデーションが必要な場合は createUserInputSchema を使用してください。
 */
export type CreateUserInput = {
  name: string;
  email: string;
  role: UserRole;
};

/**
 * サンプル機能用のユーザー更新入力型
 *
 * バリデーションが必要な場合は updateUserInputSchema を使用してください。
 */
export type UpdateUserInput = Partial<CreateUserInput>;
