import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import { type ProjectOutput, projectOutputSchema } from "../types/api";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクト詳細取得
 *
 * @param projectId - プロジェクトID
 * @returns プロジェクト詳細（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const project = await getProject({ projectId: "project-1" })
 * console.log(project.data) // Project
 * ```
 */
export const getProject = async ({ projectId }: { projectId: string }): Promise<ProjectOutput> => {
  const response = await api.get(`/api/v1/projects/${projectId}`);

  return projectOutputSchema.parse(response);
};

export const getProjectQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ["projects", projectId],
    queryFn: () => getProject({ projectId }),
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseProjectOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getProjectQueryOptions>;
};

/**
 * プロジェクト詳細取得フック
 *
 * @example
 * ```tsx
 * const { data } = useProject({ projectId: "project-1" })
 * console.log(data.data) // Project
 * ```
 */
export const useProject = ({ projectId, queryConfig }: UseProjectOptions) => {
  return useSuspenseQuery({
    ...getProjectQueryOptions(projectId),
    ...queryConfig,
  });
};
