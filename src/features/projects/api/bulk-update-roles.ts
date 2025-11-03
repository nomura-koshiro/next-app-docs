import { useMutation, type UseMutationOptions,useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { logger } from "@/utils/logger";

import { ProjectMembersResponseSchema } from "./schemas/project-member-response.schema";
import type { ProjectMembersResponse } from "./schemas/project-member-response.schema";
import type { BulkUpdateRolesDTO } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーのロールを一括更新
 *
 * @param projectId プロジェクトID
 * @param data 一括更新データ
 * @returns 更新されたプロジェクトメンバー一覧
 *
 * @example
 * ```tsx
 * await bulkUpdateRoles({
 *   projectId: 'project-123',
 *   data: {
 *     updates: [
 *       { member_id: 'member-456', role: ProjectRole.PROJECT_MODERATOR },
 *       { member_id: 'member-789', role: ProjectRole.MEMBER }
 *     ]
 *   }
 * });
 * ```
 */
export const bulkUpdateRoles = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: BulkUpdateRolesDTO;
}): Promise<ProjectMembersResponse> => {
  // 重要: エンドポイントは /members/bulk で、/roles サフィックスなし
  const response = await api.patch(`/projects/${projectId}/members/bulk`, data);
  return ProjectMembersResponseSchema.parse(response);
};

// ================================================================================
// Hooks
// ================================================================================

type UseBulkUpdateRolesOptions = {
  projectId: string;
  mutationConfig?: Omit<
    UseMutationOptions<ProjectMembersResponse, Error, BulkUpdateRolesDTO, unknown>,
    "mutationFn"
  >;
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
 *       { member_id: 'member-456', role: ProjectRole.PROJECT_MODERATOR },
 *       { member_id: 'member-789', role: ProjectRole.MEMBER }
 *     ]
 *   });
 * };
 * ```
 */
export const useBulkUpdateRoles = ({ projectId, mutationConfig }: UseBulkUpdateRolesOptions) => {
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
    mutationFn: (data: BulkUpdateRolesDTO) => bulkUpdateRoles({ projectId, data }),
  });
};
