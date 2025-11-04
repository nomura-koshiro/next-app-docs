"use client";

import { useRouter } from "next/navigation";

import { useAddProjectMember, useProjectMembers, useRemoveProjectMember, useUpdateMemberRole } from "../../api";
import { useProject } from "../../api/get-project";
import type { ProjectRole } from "../../types";
import type { AddProjectMemberInput, UpdateMemberRoleInput } from "../../types/forms";

type UseProjectMembersOptions = {
  projectId: string;
};

/**
 * プロジェクトメンバー管理のビジネスロジックフック
 *
 * プロジェクトメンバーの取得、追加、ロール更新、削除を行います。
 *
 * @param projectId プロジェクトID
 *
 * @example
 * ```tsx
 * const {
 *   members,
 *   isLoading,
 *   handleBackToDetail,
 *   handleAddMember,
 *   handleUpdateRole,
 *   handleRemoveMember
 * } = useProjectMembersLogic({ projectId: 'project-123' });
 * ```
 */
export const useProjectMembersLogic = ({ projectId }: UseProjectMembersOptions) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();

  // プロジェクト情報取得
  const { data: projectData } = useProject({ projectId });
  const project = projectData?.data;

  // メンバー一覧取得
  const { data, isLoading } = useProjectMembers({ projectId });

  // ミューテーション
  const addMemberMutation = useAddProjectMember({ projectId });
  const updateRoleMutation = useUpdateMemberRole({ projectId });
  const removeMemberMutation = useRemoveProjectMember({ projectId });

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * プロジェクト詳細へ戻る
   */
  const handleBackToDetail = () => {
    router.push(`/projects/${projectId}`);
  };

  // メンバー追加
  const handleAddMember = async (data: AddProjectMemberInput) => {
    await addMemberMutation.mutateAsync(data);
  };

  // ロール更新
  const handleUpdateRole = async (memberId: string, role: ProjectRole) => {
    const data: UpdateMemberRoleInput = { role };
    await updateRoleMutation.mutateAsync({ memberId, data });
  };

  // メンバー削除
  const handleRemoveMember = async (memberId: string) => {
    await removeMemberMutation.mutateAsync({ memberId });
  };

  return {
    project,
    members: data?.data ?? [],
    isLoading,
    handleBackToDetail,
    isAdding: addMemberMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isRemoving: removeMemberMutation.isPending,
    handleAddMember,
    handleUpdateRole,
    handleRemoveMember,
  };
};
