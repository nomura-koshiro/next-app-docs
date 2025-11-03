import type { UseMutationOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";

import type { ProjectMember, UpdateMemberRoleInput } from "../types";
import { useProjectMemberMutation } from "./helpers";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーのロールを更新
 *
 * @param projectId プロジェクトID
 * @param memberId メンバーID
 * @param input ロール更新の入力データ
 * @returns 更新されたプロジェクトメンバー（ドメインモデル）
 *
 * @example
 * ```tsx
 * const updatedMember = await updateMemberRole(
 *   'project-123',
 *   'member-456',
 *   { role: PROJECT_ROLES.PROJECT_MODERATOR }
 * );
 * ```
 */
export const updateMemberRole = (projectId: string, memberId: string, input: UpdateMemberRoleInput): Promise<ProjectMember> => {
  // 重要: エンドポイントは /members/{member_id} で、/role サフィックスなし
  return api.patch(`/projects/${projectId}/members/${memberId}`, input);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUpdateMemberRoleOptions = {
  projectId: string;
  mutationConfig?: Omit<
    UseMutationOptions<ProjectMember, Error, { memberId: string; input: UpdateMemberRoleInput }, unknown>,
    "mutationFn"
  >;
};

/**
 * プロジェクトメンバーロール更新フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const updateRoleMutation = useUpdateMemberRole({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('ロールが更新されました');
 *     },
 *   },
 * });
 *
 * const handleUpdate = () => {
 *   updateRoleMutation.mutate({
 *     memberId: 'member-456',
 *     input: { role: PROJECT_ROLES.PROJECT_MODERATOR }
 *   });
 * };
 * ```
 */
export const useUpdateMemberRole = ({ projectId, mutationConfig }: UseUpdateMemberRoleOptions) => {
  return useProjectMemberMutation({
    mutationFn: ({ memberId, input }: { memberId: string; input: UpdateMemberRoleInput }) => updateMemberRole(projectId, memberId, input),
    projectId,
    mutationConfig,
  });
};
