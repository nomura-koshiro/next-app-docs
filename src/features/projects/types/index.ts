/**
 * プロジェクト管理機能の型定義
 *
 * ドメインモデル（エンティティ、値オブジェクト、ロール）の定義。
 * - API レスポンススキーマ: api.ts を参照
 * - 入力スキーマ: forms.ts を参照
 *
 * @module features/projects/types
 */

import { z } from "zod";

// ================================================================================
// ロール関連
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

/**
 * ユーザー情報スキーマ
 */
export const userSchema = z.object({
  id: z.string(),
  azure_oid: z.string(),
  email: z.string().email(),
  display_name: z.string().nullable(),
  roles: z.array(systemRoleSchema),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_login: z.string().datetime().nullable(),
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
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
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
  joined_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user: userSchema.optional(),
  project: projectSchema.optional(),
});

/**
 * プロジェクトメンバー情報型
 */
export type ProjectMember = z.infer<typeof projectMemberSchema>;

// ================================================================================
// Re-export
// ================================================================================

/**
 * API レスポンス型とスキーマをre-export
 */
export type { CreateProjectOutput, ErrorOutput, ProjectMemberOutput, ProjectMembersOutput, ProjectOutput, ProjectsOutput } from "./api";
export {
  createProjectOutputSchema,
  projectMemberOutputSchema,
  projectMembersOutputSchema,
  projectOutputSchema,
  projectsOutputSchema,
} from "./api";

/**
 * 入力型とスキーマをre-export
 */
export type { AddProjectMemberInput, BulkAddMembersInput, BulkUpdateRolesInput, CreateProjectInput, UpdateMemberRoleInput } from "./forms";
export { addProjectMemberSchema, bulkAddMembersSchema, bulkUpdateRolesSchema, createProjectSchema, updateMemberRoleSchema } from "./forms";
