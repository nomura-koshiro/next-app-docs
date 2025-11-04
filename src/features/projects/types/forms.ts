/**
 * プロジェクト入力スキーマ
 *
 * API呼び出し時の入力データのランタイムバリデーション用スキーマ。
 *
 * @module features/projects/types/forms
 */

import { z } from "zod";

import { projectRoleSchema } from "./index";

// ================================================================================
// プロジェクト入力スキーマ
// ================================================================================

/**
 * プロジェクト作成入力スキーマ
 */
export const createProjectSchema = z.object({
  name: z.string().min(1, "プロジェクト名は必須です").max(100, "プロジェクト名は100文字以内で入力してください"),
  description: z.string().max(500, "説明は500文字以内で入力してください").nullable().optional(),
  is_active: z.boolean(),
});

/**
 * プロジェクト作成入力型
 */
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * プロジェクト更新入力スキーマ
 */
export const updateProjectSchema = z.object({
  name: z.string().min(1, "プロジェクト名は必須です").max(100, "プロジェクト名は100文字以内で入力してください"),
  description: z.string().max(500, "説明は500文字以内で入力してください").nullable().optional(),
  is_active: z.boolean(),
});

/**
 * プロジェクト更新入力型
 */
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ================================================================================
// プロジェクトメンバー入力スキーマ
// ================================================================================

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
 * メンバーロール更新入力スキーマ
 */
export const updateMemberRoleSchema = z.object({
  role: projectRoleSchema,
});

/**
 * メンバーロール更新入力型
 */
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

// ================================================================================
// 一括操作入力スキーマ
// ================================================================================

/**
 * メンバー一括追加入力スキーマ
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
 * メンバー一括追加入力型
 */
export type BulkAddMembersInput = z.infer<typeof bulkAddMembersSchema>;

/**
 * ロール一括更新入力スキーマ
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
 * ロール一括更新入力型
 */
export type BulkUpdateRolesInput = z.infer<typeof bulkUpdateRolesSchema>;
