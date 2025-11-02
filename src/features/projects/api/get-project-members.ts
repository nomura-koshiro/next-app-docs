import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import type { ProjectMember } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバー一覧を取得
 *
 * @param projectId プロジェクトID
 * @returns プロジェクトメンバー一覧（ドメインモデルの配列）
 *
 * @example
 * ```tsx
 * const members = await getProjectMembers('project-123')
 * console.log(members) // ProjectMember[]
 * ```
 */
export const getProjectMembers = (projectId: string): Promise<ProjectMember[]> => {
  return api.get(`/projects/${projectId}/members`);
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
 * @returns プロジェクトメンバー一覧（ドメインモデルの配列）
 *
 * @example
 * ```tsx
 * const { data: members } = useProjectMembers({ projectId: 'project-123' })
 * console.log(members) // ProjectMember[]
 * ```
 */
export const useProjectMembers = ({ projectId, queryConfig }: UseProjectMembersOptions) => {
  return useSuspenseQuery({
    ...getProjectMembersQueryOptions(projectId),
    ...queryConfig,
  });
};
