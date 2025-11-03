/**
 * プロジェクトメンバーAPI レスポンススキーマ
 *
 * APIから返されるプロジェクトメンバーデータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * システムレベルのロールスキーマ
 */
export const SystemRoleSchema = z.enum(["system_admin", "user"]);

/**
 * プロジェクトレベルのロールスキーマ
 */
export const ProjectRoleSchema = z.enum(["project_manager", "project_moderator", "member", "viewer"]);

/**
 * ユーザー情報スキーマ
 */
export const UserSchema = z.object({
  id: z.string().min(1, "ユーザーIDは必須です"),
  azure_oid: z.string().min(1, "Azure OIDは必須です"),
  email: z.string().email("有効なメールアドレスではありません"),
  display_name: z.string().nullable(),
  roles: z.array(SystemRoleSchema),
  is_active: z.boolean(),
  created_at: z.string().min(1, "作成日時は必須です"),
  updated_at: z.string().min(1, "更新日時は必須です"),
  last_login: z.string().nullable(),
});

/**
 * プロジェクト情報スキーマ
 */
export const ProjectSchema = z.object({
  id: z.string().min(1, "プロジェクトIDは必須です"),
  name: z.string().min(1, "プロジェクト名は必須です"),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string().min(1, "作成日時は必須です"),
  updated_at: z.string().min(1, "更新日時は必須です"),
  created_by: z.string().min(1, "作成者IDは必須です"),
});

/**
 * プロジェクトメンバー情報スキーマ
 */
export const ProjectMemberSchema = z.object({
  id: z.string().min(1, "メンバーIDは必須です"),
  project_id: z.string().min(1, "プロジェクトIDは必須です"),
  user_id: z.string().min(1, "ユーザーIDは必須です"),
  role: ProjectRoleSchema,
  joined_at: z.string().min(1, "参加日時は必須です"),
  updated_at: z.string().min(1, "更新日時は必須です"),
  user: UserSchema.optional(),
  project: ProjectSchema.optional(),
});

/**
 * プロジェクトメンバー一覧レスポンススキーマ
 *
 * GET /projects/:projectId/members のレスポンス
 * PATCH /projects/:projectId/members/bulk のレスポンス
 */
export const ProjectMembersResponseSchema = z.object({
  data: z.array(ProjectMemberSchema),
});

/**
 * プロジェクトメンバー詳細レスポンススキーマ
 *
 * POST /projects/:projectId/members のレスポンス
 * PATCH /projects/:projectId/members/:memberId のレスポンス
 */
export const ProjectMemberResponseSchema = z.object({
  data: ProjectMemberSchema,
});

/**
 * 型推論
 */
export type User = z.infer<typeof UserSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectMember = z.infer<typeof ProjectMemberSchema>;
export type ProjectMembersResponse = z.infer<typeof ProjectMembersResponseSchema>;
export type ProjectMemberResponse = z.infer<typeof ProjectMemberResponseSchema>;
