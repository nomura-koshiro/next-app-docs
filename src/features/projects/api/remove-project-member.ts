import type { UseMutationOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";

import { useProjectMemberMutation } from "./helpers";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーを削除
 *
 * @param projectId プロジェクトID
 * @param memberId メンバーID
 * @returns void
 *
 * @example
 * ```tsx
 * await removeProjectMember('project-123', 'member-456');
 * ```
 */
export const removeProjectMember = (projectId: string, memberId: string): Promise<void> => {
  return api.delete(`/projects/${projectId}/members/${memberId}`);
};

// ================================================================================
// Hooks
// ================================================================================

type UseRemoveProjectMemberOptions = {
  projectId: string;
  mutationConfig?: Omit<UseMutationOptions<void, Error, { memberId: string }, unknown>, "mutationFn">;
};

/**
 * プロジェクトメンバー削除フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const removeMemberMutation = useRemoveProjectMember({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('メンバーが削除されました');
 *     },
 *   },
 * });
 *
 * const handleRemove = () => {
 *   removeMemberMutation.mutate({ memberId: 'member-456' });
 * };
 * ```
 */
export const useRemoveProjectMember = ({ projectId, mutationConfig }: UseRemoveProjectMemberOptions) => {
  return useProjectMemberMutation({
    mutationFn: ({ memberId }: { memberId: string }) => removeProjectMember(projectId, memberId),
    projectId,
    mutationConfig,
  });
};
