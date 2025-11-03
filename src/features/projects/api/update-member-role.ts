import { useMutation, type UseMutationOptions,useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { logger } from "@/utils/logger";

import { ProjectMemberResponseSchema } from "./schemas/project-member-response.schema";
import type { ProjectMemberResponse } from "./schemas/project-member-response.schema";
import type { UpdateMemberRoleDTO } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーのロールを更新
 *
 * @param projectId プロジェクトID
 * @param memberId メンバーID
 * @param data ロール更新データ
 * @returns 更新されたプロジェクトメンバー
 *
 * @example
 * ```tsx
 * await updateMemberRole({
 *   projectId: 'project-123',
 *   memberId: 'member-456',
 *   data: { role: ProjectRole.PROJECT_MODERATOR }
 * });
 * ```
 */
export const updateMemberRole = async ({
  projectId,
  memberId,
  data,
}: {
  projectId: string;
  memberId: string;
  data: UpdateMemberRoleDTO;
}): Promise<ProjectMemberResponse> => {
  // 重要: エンドポイントは /members/{member_id} で、/role サフィックスなし
  const response = await api.patch(`/projects/${projectId}/members/${memberId}`, data);
  return ProjectMemberResponseSchema.parse(response);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUpdateMemberRoleOptions = {
  projectId: string;
  mutationConfig?: Omit<
    UseMutationOptions<ProjectMemberResponse, Error, { memberId: string; data: UpdateMemberRoleDTO }, unknown>,
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
 *     data: { role: ProjectRole.PROJECT_MODERATOR }
 *   });
 * };
 * ```
 */
export const useUpdateMemberRole = ({ projectId, mutationConfig }: UseUpdateMemberRoleOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] }).catch((error) => {
        logger.error("プロジェクトメンバークエリの無効化に失敗しました", error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: ({ memberId, data }: { memberId: string; data: UpdateMemberRoleDTO }) =>
      updateMemberRole({ projectId, memberId, data }),
  });
};
