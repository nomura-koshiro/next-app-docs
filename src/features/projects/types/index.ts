/**
 * プロジェクト管理機能の型定義
 *
 * @module features/projects/types
 */

import { z } from "zod";

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

/**
 * プロジェクトメンバー一覧の出力型
 */
export type ProjectMembersOutput = {
  data: ProjectMember[];
};

/**
 * プロジェクトメンバー詳細の出力型
 */
export type ProjectMemberOutput = {
  data: ProjectMember;
};

/**
 * プロジェクトメンバー追加入力スキーマ
 */
export const addProjectMemberSchema = z.object({
  user_id: z.string(),
  role: projectRoleSchema,
});

/**
 * プロジェクトメンバー追加入力型
 */
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;

/**
 * プロジェクトメンバー複数追加入力スキーマ
 */
export const bulkAddMembersSchema = z.object({
  members: z.array(
    z.object({
      user_id: z.string(),
      role: projectRoleSchema,
    })
  ),
});

/**
 * プロジェクトメンバー複数追加入力型
 */
export type BulkAddMembersInput = z.infer<typeof bulkAddMembersSchema>;

/**
 * プロジェクトメンバーロール更新入力スキーマ
 */
export const updateMemberRoleSchema = z.object({
  role: projectRoleSchema,
});

/**
 * プロジェクトメンバーロール更新入力型
 */
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

/**
 * プロジェクトメンバー複数ロール更新入力スキーマ
 */
export const bulkUpdateRolesSchema = z.object({
  updates: z.array(
    z.object({
      member_id: z.string(),
      role: projectRoleSchema,
    })
  ),
});

/**
 * プロジェクトメンバー複数ロール更新入力型
 */
export type BulkUpdateRolesInput = z.infer<typeof bulkUpdateRolesSchema>;

/**
 * エラー出力型
 */
export type ErrorOutput = {
  message: string;
  detail?: string;
};
