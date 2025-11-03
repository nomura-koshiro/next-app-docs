import { useMutation, type UseMutationOptions,useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { logger } from "@/utils/logger";

import { ProjectMemberResponseSchema } from "./schemas/project-member-response.schema";
import type { ProjectMemberResponse } from "./schemas/project-member-response.schema";
import type { AddProjectMemberDTO } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーを追加
 *
 * @param projectId プロジェクトID
 * @param data メンバー追加データ
 * @returns 追加されたプロジェクトメンバー
 *
 * @example
 * ```tsx
 * await addProjectMember({
 *   projectId: 'project-123',
 *   data: { user_id: 'user-456', role: ProjectRole.MEMBER }
 * });
 * ```
 */
export const addProjectMember = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: AddProjectMemberDTO;
}): Promise<ProjectMemberResponse> => {
  const response = await api.post(`/projects/${projectId}/members`, data);
  return ProjectMemberResponseSchema.parse(response);
};

// ================================================================================
// Hooks
// ================================================================================

type UseAddProjectMemberOptions = {
  projectId: string;
  mutationConfig?: Omit<
    UseMutationOptions<ProjectMemberResponse, Error, AddProjectMemberDTO, unknown>,
    "mutationFn"
  >;
};

/**
 * プロジェクトメンバー追加フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const addMemberMutation = useAddProjectMember({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('メンバーが追加されました');
 *     },
 *   },
 * });
 *
 * const handleAdd = () => {
 *   addMemberMutation.mutate({
 *     user_id: 'user-456',
 *     role: ProjectRole.MEMBER
 *   });
 * };
 * ```
 */
export const useAddProjectMember = ({ projectId, mutationConfig }: UseAddProjectMemberOptions) => {
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
    mutationFn: (data: AddProjectMemberDTO) => addProjectMember({ projectId, data }),
  });
};
