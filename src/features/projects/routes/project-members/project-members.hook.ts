import { useCallback } from "react";

import { useAddProjectMember, useProjectMembers, useRemoveProjectMember, useUpdateMemberRole } from "../../api";
import type { AddProjectMemberInput, ProjectRole, UpdateMemberRoleInput } from "../../types";

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
 *   handleAddMember,
 *   handleUpdateRole,
 *   handleRemoveMember
 * } = useProjectMembersLogic({ projectId: 'project-123' });
 * ```
 */
export const useProjectMembersLogic = ({ projectId }: UseProjectMembersOptions) => {
  // メンバー一覧取得（ドメインモデルの配列を直接取得）
  const { data: members, isLoading } = useProjectMembers({ projectId });

  // ミューテーション
  const addMemberMutation = useAddProjectMember({ projectId });
  const updateRoleMutation = useUpdateMemberRole({ projectId });
  const removeMemberMutation = useRemoveProjectMember({ projectId });

  // メンバー追加
  const handleAddMember = useCallback(
    async (input: AddProjectMemberInput) => {
      await addMemberMutation.mutateAsync(input);
    },
    [addMemberMutation]
  );

  // ロール更新
  const handleUpdateRole = useCallback(
    async (memberId: string, role: ProjectRole) => {
      const input: UpdateMemberRoleInput = { role };
      await updateRoleMutation.mutateAsync({ memberId, input });
    },
    [updateRoleMutation]
  );

  // メンバー削除
  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      await removeMemberMutation.mutateAsync({ memberId });
    },
    [removeMemberMutation]
  );

  return {
    members: members ?? [],
    isLoading,
    isAdding: addMemberMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isRemoving: removeMemberMutation.isPending,
    handleAddMember,
    handleUpdateRole,
    handleRemoveMember,
  };
};
