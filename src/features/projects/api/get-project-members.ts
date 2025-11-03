import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import type { ProjectMembersResponse } from "./schemas/project-member-response.schema";
import { ProjectMembersResponseSchema } from "./schemas/project-member-response.schema";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバー一覧を取得
 *
 * @param projectId プロジェクトID
 * @returns プロジェクトメンバー一覧
 *
 * @example
 * ```tsx
 * const members = await getProjectMembers('project-123')
 * console.log(members.data) // ProjectMember[]
 * ```
 */
export const getProjectMembers = async (projectId: string): Promise<ProjectMembersResponse> => {
  const response = await api.get(`/projects/${projectId}/members`);

  return ProjectMembersResponseSchema.parse(response);
};

export const getProjectMembersQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => getProjectMembers(projectId),
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseProjectMembersOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getProjectMembersQueryOptions>;
};

/**
 * プロジェクトメンバー一覧取得フック
 *
 * @param projectId プロジェクトID
 * @param queryConfig React Query設定
 * @returns プロジェクトメンバー一覧
 *
 * @example
 * ```tsx
 * const { data } = useProjectMembers({ projectId: 'project-123' })
 * console.log(data.data) // ProjectMember[]
 * ```
 */
export const useProjectMembers = ({ projectId, queryConfig }: UseProjectMembersOptions) => {
  return useSuspenseQuery({
    ...getProjectMembersQueryOptions(projectId),
    ...queryConfig,
  });
};
