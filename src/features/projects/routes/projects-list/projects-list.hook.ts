"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useProjects } from "../../api";

/**
 * プロジェクト一覧ページのロジックを管理するカスタムフック
 *
 * API層のuseProjectsを呼び出し、ページ固有のビジネスロジック（ナビゲーション）を追加します。
 * プロジェクトの一覧表示、新規作成、詳細表示、メンバー管理への遷移を提供します。
 *
 * @returns プロジェクト一覧の状態と操作関数
 * @returns projects - プロジェクトリスト
 * @returns handleCreateNew - プロジェクト作成ページへ遷移
 * @returns handleViewProject - プロジェクト詳細ページへ遷移
 * @returns handleViewMembers - プロジェクトメンバー管理ページへ遷移
 *
 * @example
 * ```tsx
 * const { projects, handleCreateNew, handleViewProject, handleViewMembers } = useProjectsListLogic()
 *
 * <button onClick={handleCreateNew}>新規作成</button>
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

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * プロジェクト作成ページへ遷移
   */
  const handleCreateNew = useCallback(() => {
    router.push("/projects/new");
  }, [router]);

  /**
   * プロジェクト詳細ページへ遷移
   */
  const handleViewProject = useCallback(
    (projectId: string) => {
      router.push(`/projects/${projectId}`);
    },
    [router]
  );

  /**
   * プロジェクトメンバー管理ページへ遷移
   */
  const handleViewMembers = useCallback(
    (projectId: string) => {
      router.push(`/projects/${projectId}/members`);
    },
    [router]
  );

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    projects: data.data,
    handleCreateNew,
    handleViewProject,
    handleViewMembers,
  };
};
