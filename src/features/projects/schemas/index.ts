/**
 * プロジェクトメンバー機能のZodスキーマ定義
 *
 * このファイルでは、プロジェクトメンバー関連のバリデーションスキーマと型定義を提供します。
 * Zodスキーマからz.inferで型を推論することで、DRY原則を徹底します。
 *
 * @module features/projects/schemas
 */

import { z } from "zod";

// ================================================================================
// 基本スキーマ
// ================================================================================

/**
 * プロジェクトロールのスキーマ
 */
export const projectRoleSchema = z.enum(["project_manager", "project_moderator", "member", "viewer"]);

/**
 * プロジェクトロール型（Zodから推論）
 */
export type ProjectRole = z.infer<typeof projectRoleSchema>;

// ================================================================================
// ドメインモデルスキーマ
// ================================================================================

/**
 * プロジェクトメンバーのスキーマ
 */
export const projectMemberSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: projectRoleSchema,
  joined_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user: z
    .object({
      id: z.string().uuid(),
      azure_oid: z.string().uuid(),
      email: z.string().email(),
      display_name: z.string().nullable(),
      roles: z.array(z.string()).optional(),
      is_active: z.boolean().optional(),
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
      last_login: z.string().nullable().optional(),
    })
    .optional(),
  project: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
});

/**
 * プロジェクトメンバー型（Zodから推論）
 */
export type ProjectMember = z.infer<typeof projectMemberSchema>;

// ================================================================================
// Input スキーマ（API入力）
// ================================================================================

/**
 * プロジェクトメンバー追加の入力スキーマ
 */
export const addProjectMemberInputSchema = z.object({
  user_id: z.string().uuid("有効なユーザーIDを指定してください"),
  role: projectRoleSchema,
});

/**
 * プロジェクトメンバー追加の入力型
 */
export type AddProjectMemberInput = z.infer<typeof addProjectMemberInputSchema>;

/**
 * プロジェクトメンバーロール更新の入力スキーマ
 */
export const updateMemberRoleInputSchema = z.object({
  role: projectRoleSchema,
});

/**
 * プロジェクトメンバーロール更新の入力型
 */
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleInputSchema>;

/**
 * プロジェクトメンバー一括追加の入力スキーマ
 */
export const bulkAddMembersInputSchema = z.object({
  members: z.array(addProjectMemberInputSchema).min(1, "最低1人のメンバーを指定してください"),
});

/**
 * プロジェクトメンバー一括追加の入力型
 */
export type BulkAddMembersInput = z.infer<typeof bulkAddMembersInputSchema>;

/**
 * プロジェクトメンバー一括ロール更新の入力スキーマ
 */
export const bulkUpdateMembersInputSchema = z.object({
  updates: z
    .array(
      z.object({
        member_id: z.string().uuid("有効なメンバーIDを指定してください"),
        role: projectRoleSchema,
      })
    )
    .min(1, "最低1件の更新を指定してください"),
});

/**
 * プロジェクトメンバー一括ロール更新の入力型
 */
export type BulkUpdateMembersInput = z.infer<typeof bulkUpdateMembersInputSchema>;
