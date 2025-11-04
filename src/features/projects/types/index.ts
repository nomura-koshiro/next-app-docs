/**
 * プロジェクト管理機能の型定義
 *
 * ドメインモデル（エンティティ、値オブジェクト、ロール）の定義。
 * - API レスポンススキーマ: api.ts を参照
 * - 入力スキーマ: forms.ts を参照
 * - ルートパラメータスキーマ: このファイル内で定義
 *
 * @module features/projects/types
 */

import { z } from "zod";

// ================================================================================
// ロール・権限関連（値オブジェクト）
// ================================================================================

/**
 * システムレベルのロールスキーマ
 */
export const systemRoleSchema = z.enum(["system_admin", "user"]);

/**
 * システムレベルのロール型
 */
export type SystemRole = z.infer<typeof systemRoleSchema>;

/**
 * プロジェクトレベルのロールスキーマ（4段階）
 */
export const projectRoleSchema = z.enum([
  "project_manager", // プロジェクトマネージャー（最高権限）
  "project_moderator", // 権限管理者（メンバー管理担当）
  "member", // メンバー（編集権限）
  "viewer", // 閲覧者（閲覧のみ）
]);

/**
 * プロジェクトレベルのロール型
 */
export type ProjectRole = z.infer<typeof projectRoleSchema>;

/**
 * 権限の種類スキーマ
 */
export const permissionSchema = z.enum([
  // プロジェクトレベル権限
  "project:view",
  "project:edit",
  "project:delete",
  "project:manage_members",
  "project:manage_settings",
  // システムレベル権限
  "system:admin",
  "system:manage_users",
  "system:view_audit_logs",
]);

/**
 * 権限の種類型
 */
export type Permission = z.infer<typeof permissionSchema>;

// ================================================================================
// エンティティ（ドメインモデル）
// ================================================================================

/**
 * ユーザー情報スキーマ
 */
export const userSchema = z.object({
  id: z.string(),
  azure_oid: z.string(),
  email: z.email(),
  display_name: z.string().nullable(),
  roles: z.array(systemRoleSchema),
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  last_login: z.iso.datetime().nullable(),
});

/**
 * ユーザー情報型
 */
export type User = z.infer<typeof userSchema>;

/**
 * プロジェクト情報スキーマ
 */
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "プロジェクト名は必須です"),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  created_by: z.string(),
});

/**
 * プロジェクト情報型
 */
export type Project = z.infer<typeof projectSchema>;

/**
 * プロジェクトメンバー情報スキーマ
 */
export const projectMemberSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  user_id: z.string(),
  role: projectRoleSchema,
  joined_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  user: userSchema.optional(),
  project: projectSchema.optional(),
});

/**
 * プロジェクトメンバー情報型
 */
export type ProjectMember = z.infer<typeof projectMemberSchema>;

// ================================================================================
// ルートパラメータ（パスパラメータ）
// ================================================================================

/**
 * プロジェクト詳細ルート パラメータスキーマ
 *
 * /projects/[id] のパラメータを検証
 *
 * @example
 * ```tsx
 * const params = useParams();
 * const { id: projectId } = ProjectDetailParamsSchema.parse(params);
 * ```
 */
export const ProjectDetailParamsSchema = z.object({
  id: z.string().min(1, "プロジェクトIDは必須です"),
});

export type ProjectDetailParams = z.infer<typeof ProjectDetailParamsSchema>;

/**
 * プロジェクトメンバー管理ルート パラメータスキーマ
 *
 * /projects/[id]/members のパラメータを検証
 *
 * @example
 * ```tsx
 * const params = useParams();
 * const { id: projectId } = ProjectMembersParamsSchema.parse(params);
 * ```
 */
export const ProjectMembersParamsSchema = z.object({
  id: z.string().min(1, "プロジェクトIDは必須です"),
});

export type ProjectMembersParams = z.infer<typeof ProjectMembersParamsSchema>;
