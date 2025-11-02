import type { UseMutationOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";

import type { BulkUpdateMembersInput, ProjectMember } from "../types";
import { useProjectMemberMutation } from "./helpers";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーのロールを一括更新
 *
 * @param projectId プロジェクトID
 * @param input 一括更新の入力データ
 * @returns 更新されたプロジェクトメンバー一覧（ドメインモデルの配列）
 *
 * @example
 * ```tsx
 * const updatedMembers = await bulkUpdateRoles(
 *   'project-123',
 *   {
 *     updates: [
 *       { member_id: 'member-456', role: PROJECT_ROLES.PROJECT_MODERATOR },
 *       { member_id: 'member-789', role: PROJECT_ROLES.MEMBER }
 *     ]
 *   }
 * );
 * ```
 */
export const bulkUpdateRoles = (projectId: string, input: BulkUpdateMembersInput): Promise<ProjectMember[]> => {
  // 重要: エンドポイントは /members/bulk で、/roles サフィックスなし
  return api.patch(`/projects/${projectId}/members/bulk`, input);
};

// ================================================================================
// Hooks
// ================================================================================

type UseBulkUpdateRolesOptions = {
  projectId: string;
  mutationConfig?: Omit<UseMutationOptions<ProjectMember[], Error, BulkUpdateMembersInput, unknown>, "mutationFn">;
};

/**
 * プロジェクトメンバーロール一括更新フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const bulkUpdateMutation = useBulkUpdateRoles({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('ロールが一括更新されました');
 *     },
 *   },
 * });
 *
 * const handleBulkUpdate = () => {
 *   bulkUpdateMutation.mutate({
 *     updates: [
 *       { member_id: 'member-456', role: PROJECT_ROLES.PROJECT_MODERATOR },
 *       { member_id: 'member-789', role: PROJECT_ROLES.MEMBER }
 *     ]
 *   });
 * };
 * ```
 */
export const useBulkUpdateRoles = ({ projectId, mutationConfig }: UseBulkUpdateRolesOptions) => {
  return useProjectMemberMutation({
    mutationFn: (input: BulkUpdateMembersInput) => bulkUpdateRoles(projectId, input),
    projectId,
    mutationConfig,
  });
};
