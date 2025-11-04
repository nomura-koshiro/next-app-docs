"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDeleteProject, useProject, useUpdateProject } from "../../api";
import { PROJECT_MESSAGES } from "../../constants/messages";
import type { UpdateProjectInput } from "../../types/forms";

type UseProjectDetailLogicProps = {
  projectId: string;
};

/**
 * プロジェクト詳細ページのロジックを管理するカスタムフック
 *
 * API層のuseProjectを呼び出し、ページ固有のビジネスロジック（ナビゲーション）を追加します。
 * プロジェクトの詳細情報表示、一覧への戻る、メンバー管理への遷移を提供します。
 *
 * @param projectId - プロジェクトID
 *
 * @returns プロジェクト詳細の状態と操作関数
 * @returns project - プロジェクト詳細情報
 * @returns handleBackToList - プロジェクト一覧ページへ遷移
 * @returns handleViewMembers - プロジェクトメンバー管理ページへ遷移
 * @returns handleUpdate - プロジェクト更新処理
 * @returns handleDelete - プロジェクト削除処理
 * @returns deleteError - 削除エラーメッセージ
 * @returns isDeleting - 削除中フラグ
 * @returns isUpdating - 更新中フラグ
 *
 * @example
 * ```tsx
 * const {
 *   project,
 *   handleBackToList,
 *   handleViewMembers,
 *   handleEdit,
 *   handleDelete,
 *   deleteError,
 *   isDeleting
 * } = useProjectDetailLogic({ projectId: 'project-1' })
 *
 * <h1>{project.name}</h1>
 * <button onClick={handleBackToList}>一覧に戻る</button>
 * <button onClick={handleViewMembers}>メンバー管理</button>
 * <button onClick={() => handleUpdate(data)}>更新</button>
 * <button onClick={handleDelete}>削除</button>
 * ```
 */
export const useProjectDetailLogic = ({ projectId }: UseProjectDetailLogicProps) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { data } = useProject({ projectId });
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // ================================================================================
  // State
  // ================================================================================
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * プロジェクト一覧ページへ遷移
   */
  const handleBackToList = () => {
    router.push("/projects");
  };

  /**
   * プロジェクトメンバー管理ページへ遷移
   */
  const handleViewMembers = () => {
    router.push(`/projects/${projectId}/members`);
  };

  /**
   * プロジェクト更新処理
   *
   * 処理フロー:
   * 1. FastAPIにプロジェクト更新リクエスト送信
   * 2. 成功時: データが自動的に再取得される
   */
  const handleUpdate = async (data: UpdateProjectInput) => {
    await updateProjectMutation.mutateAsync({ projectId, data });
  };

  /**
   * プロジェクト削除処理
   *
   * 処理フロー:
   * 1. FastAPIにプロジェクト削除リクエスト送信
   * 2. 成功時: プロジェクト一覧ページへ遷移
   * 3. エラー時: エラーメッセージを状態に保存
   */
  const handleDelete = () => {
    setDeleteError(null);
    deleteProjectMutation
      .mutateAsync(projectId)
      .then(() => {
        router.push("/projects");
      })
      .catch((error: Error) => {
        setDeleteError(error?.message ?? PROJECT_MESSAGES.ERRORS.DELETE_FAILED);
      });
  };

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    project: data.data,
    handleBackToList,
    handleViewMembers,
    handleUpdate,
    handleDelete,
    deleteError,
    isDeleting: deleteProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
  };
};
