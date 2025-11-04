import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import { type ProjectsOutput, projectsOutputSchema } from "../types/api";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクト一覧取得
 *
 * @returns プロジェクト一覧（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const projects = await getProjects()
 * console.log(projects.data) // Project[]
 * ```
 */
export const getProjects = async (): Promise<ProjectsOutput> => {
  const response = await api.get("/api/v1/projects");

  return projectsOutputSchema.parse(response);
};

export const getProjectsQueryOptions = () => {
  return queryOptions({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseProjectsOptions = {
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

/**
 * プロジェクト一覧取得フック
 *
 * @example
 * ```tsx
 * const { data } = useProjects()
 * console.log(data.data) // Project[]
 * ```
 */
export const useProjects = ({ queryConfig }: UseProjectsOptions = {}) => {
  return useSuspenseQuery({
    ...getProjectsQueryOptions(),
    ...queryConfig,
  });
};
