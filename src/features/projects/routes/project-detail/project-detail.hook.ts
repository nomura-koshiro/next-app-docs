"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useProject } from "../../api";

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
 *
 * @example
 * ```tsx
 * const { project, handleBackToList, handleViewMembers } = useProjectDetailLogic({ projectId: 'project-1' })
 *
 * <h1>{project.name}</h1>
 * <button onClick={handleBackToList}>一覧に戻る</button>
 * <button onClick={handleViewMembers}>メンバー管理</button>
 * ```
 */
export const useProjectDetailLogic = ({ projectId }: UseProjectDetailLogicProps) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { data } = useProject({ projectId });

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * プロジェクト一覧ページへ遷移
   */
  const handleBackToList = useCallback(() => {
    router.push("/projects");
  }, [router]);

  /**
   * プロジェクトメンバー管理ページへ遷移
   */
  const handleViewMembers = useCallback(() => {
    router.push(`/projects/${projectId}/members`);
  }, [router, projectId]);

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    project: data.data,
    handleBackToList,
    handleViewMembers,
  };
};
