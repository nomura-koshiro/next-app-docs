import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import { updateProjectOutputSchema } from "../types/api";
import type { UpdateProjectInput } from "../types/forms";
import { updateProjectSchema } from "../types/forms";
import { getProjectQueryOptions } from "./get-project";
import { getProjectsQueryOptions } from "./get-projects";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクト更新
 *
 * @param params - プロジェクトIDと更新データ
 * @returns 更新されたプロジェクト（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const updatedProject = await updateProject({
 *   projectId: '123',
 *   data: {
 *     name: 'プロジェクト名更新',
 *     description: '説明更新',
 *     is_active: true
 *   }
 * });
 * console.log(updatedProject.data);
 * ```
 */
export const updateProject = async ({ projectId, data }: { projectId: string; data: UpdateProjectInput }) => {
  const response = await api.put(`/api/v1/projects/${projectId}`, data);

  return updateProjectOutputSchema.parse(response);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUpdateProjectOptions = {
  mutationConfig?: MutationConfig<typeof updateProject>;
};

/**
 * ミューテーション成功時に以下の処理を実行:
 * - プロジェクト一覧のクエリキャッシュを無効化
 * - 更新したプロジェクトの詳細クエリキャッシュを無効化
 *
 * @example
 * ```tsx
 * import { useUpdateProject } from '@/features/projects/api/update-project';
 *
 * function UpdateProjectForm({ projectId }: { projectId: string }) {
 *   const updateProjectMutation = useUpdateProject({
 *     mutationConfig: {
 *       onSuccess: (data) => {
 *         console.log('プロジェクトが更新されました:', data);
 *       },
 *     },
 *   });
 *
 *   const handleSubmit = (values: UpdateProjectInput) => {
 *     updateProjectMutation.mutate({ projectId, data: values });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export const useUpdateProject = ({ mutationConfig }: UseUpdateProjectOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient
        .invalidateQueries({
          queryKey: getProjectsQueryOptions().queryKey,
        })
        .catch((error) => {
          logger.error("プロジェクト一覧クエリの無効化に失敗しました", error);
        });
      queryClient
        .invalidateQueries({
          queryKey: getProjectQueryOptions({ projectId: data.data.id }).queryKey,
        })
        .catch((error) => {
          logger.error("プロジェクト詳細クエリの無効化に失敗しました", error, { projectId: data.data.id });
        });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateProject,
  });
};

// ================================================================================
// バリデーション用のエクスポート
// ================================================================================
export { updateProjectSchema as updateProjectInputSchema };
