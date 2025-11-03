import type { UseMutationOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";

import type { AddProjectMemberInput, ProjectMember } from "../types";
import { useProjectMemberMutation } from "./helpers";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーを追加
 *
 * @param projectId プロジェクトID
 * @param input メンバー追加の入力データ
 * @returns 追加されたプロジェクトメンバー（ドメインモデル）
 *
 * @example
 * ```tsx
 * const member = await addProjectMember(
 *   'project-123',
 *   { user_id: 'user-456', role: PROJECT_ROLES.MEMBER }
 * );
 * ```
 */
export const addProjectMember = (projectId: string, input: AddProjectMemberInput): Promise<ProjectMember> => {
  return api.post(`/projects/${projectId}/members`, input);
};

// ================================================================================
// Hooks
// ================================================================================

type UseAddProjectMemberOptions = {
  projectId: string;
  mutationConfig?: Omit<UseMutationOptions<ProjectMember, Error, AddProjectMemberInput, unknown>, "mutationFn">;
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
 *     role: PROJECT_ROLES.MEMBER
 *   });
 * };
 * ```
 */
export const useAddProjectMember = ({ projectId, mutationConfig }: UseAddProjectMemberOptions) => {
  return useProjectMemberMutation({
    mutationFn: (input: AddProjectMemberInput) => addProjectMember(projectId, input),
    projectId,
    mutationConfig,
  });
};
