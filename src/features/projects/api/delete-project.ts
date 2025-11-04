import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import { getProjectsQueryOptions } from "./get-projects";

// ================================================================================
// API関数
// ================================================================================

/**
 * @example
 * ```tsx
 * await deleteProject('123');
 * ```
 */
export const deleteProject = (projectId: string): Promise<void> => {
  return api.delete(`/api/v1/projects/${projectId}`);
};

// ================================================================================
// Hooks
// ================================================================================

type UseDeleteProjectOptions = {
  mutationConfig?: MutationConfig<typeof deleteProject>;
};

/**
 * ミューテーション成功時にプロジェクト一覧のクエリキャッシュを無効化します。
 *
 * @example
 * ```tsx
 * import { useDeleteProject } from '@/features/projects/api/delete-project';
 *
 * function DeleteProjectButton({ projectId }: { projectId: string }) {
 *   const deleteProjectMutation = useDeleteProject({
 *     mutationConfig: {
 *       onSuccess: () => {
 *         console.log('プロジェクトが削除されました');
 *       },
 *     },
 *   });
 *
 *   const handleDelete = () => {
 *     if (confirm('本当に削除しますか?')) {
 *       deleteProjectMutation.mutate(projectId);
 *     }
 *   };
 *
 *   return <button onClick={handleDelete}>削除</button>;
 * }
 * ```
 */
export const useDeleteProject = ({ mutationConfig }: UseDeleteProjectOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient
        .invalidateQueries({
          queryKey: getProjectsQueryOptions().queryKey,
        })
        .catch((error) => {
          logger.error("プロジェクト一覧クエリの無効化に失敗しました", error);
        });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteProject,
  });
};
