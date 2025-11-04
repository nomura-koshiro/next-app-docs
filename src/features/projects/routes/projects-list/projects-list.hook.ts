"use client";

import { useRouter } from "next/navigation";

import { useCreateProject, useProjects } from "../../api";
import type { CreateProjectInput } from "../../types/forms";

/**
 * プロジェクト一覧ページのロジックを管理するカスタムフック
 *
 * API層のuseProjectsを呼び出し、ページ固有のビジネスロジック（ナビゲーション）を追加します。
 * プロジェクトの一覧表示、新規作成、詳細表示、メンバー管理への遷移を提供します。
 *
 * @returns プロジェクト一覧の状態と操作関数
 * @returns projects - プロジェクトリスト
 * @returns handleCreate - プロジェクト作成処理
 * @returns handleViewProject - プロジェクト詳細ページへ遷移
 * @returns handleViewMembers - プロジェクトメンバー管理ページへ遷移
 * @returns isCreating - プロジェクト作成中フラグ
 *
 * @example
 * ```tsx
 * const { projects, handleCreate, handleViewProject, handleViewMembers, isCreating } = useProjectsListLogic()
 *
 * <button onClick={() => handleCreate(data)}>新規作成</button>
 * <button onClick={() => handleViewProject(project.id)}>詳細</button>
 * <button onClick={() => handleViewMembers(project.id)}>メンバー</button>
 * ```
 */
export const useProjectsListLogic = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { data } = useProjects();
  const createProjectMutation = useCreateProject();

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * プロジェクト作成処理
   *
   * 処理フロー:
   * 1. FastAPIにプロジェクト作成リクエスト送信
   * 2. 成功時: 作成されたプロジェクトの詳細ページへ遷移
   */
  const handleCreate = async (data: CreateProjectInput) => {
    const result = await createProjectMutation.mutateAsync(data);
    router.push(`/projects/${result.data.id}`);
  };

  /**
   * プロジェクト詳細ページへ遷移
   */
  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  /**
   * プロジェクトメンバー管理ページへ遷移
   */
  const handleViewMembers = (projectId: string) => {
    router.push(`/projects/${projectId}/members`);
  };

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    projects: data.data,
    handleCreate,
    handleViewProject,
    handleViewMembers,
    isCreating: createProjectMutation.isPending,
  };
};
