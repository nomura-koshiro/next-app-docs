"use client";

import { format } from "date-fns";

import { Button } from "@/components/sample-ui/button";
import type { Project } from "@/features/projects/types";

// ================================================================================
// Props
// ================================================================================

type ProjectsTableProps = {
  projects: Project[];
  onViewProject: (projectId: string) => void;
  onViewMembers: (projectId: string) => void;
};

// ================================================================================
// Component
// ================================================================================

/**
 * プロジェクト一覧テーブルコンポーネント
 *
 * プロジェクト情報をテーブル形式で表示し、詳細・メンバー管理への遷移を提供します。
 *
 * 機能:
 * - プロジェクト情報の表示（名前、説明、ステータス、作成日）
 * - ステータスに応じたバッジ表示
 * - 詳細・メンバー管理ボタンの提供
 * - 空状態の表示
 *
 * @param props - コンポーネントのプロパティ
 * @param props.projects - 表示するプロジェクトの配列
 * @param props.onViewProject - プロジェクト詳細表示時のコールバック関数
 * @param props.onViewMembers - メンバー管理表示時のコールバック関数
 * @returns プロジェクト一覧テーブルコンポーネント
 *
 * @example
 * ```tsx
 * <ProjectsTable
 *   projects={projects}
 *   onViewProject={(projectId) => console.log('View:', projectId)}
 *   onViewMembers={(projectId) => console.log('Members:', projectId)}
 * />
 * ```
 */
export const ProjectsTable = ({ projects, onViewProject, onViewMembers }: ProjectsTableProps) => {
  // ================================================================================
  // Render - Empty State
  // ================================================================================

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">プロジェクトがありません</p>
      </div>
    );
  }

  // ================================================================================
  // Render - Table
  // ================================================================================

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">プロジェクト名</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">説明</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ステータス</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">作成日</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">アクション</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{project.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{project.description || "-"}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    project.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.is_active ? "アクティブ" : "非アクティブ"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{format(new Date(project.created_at), "yyyy/MM/dd")}</td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onViewProject(project.id)}>
                    詳細
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onViewMembers(project.id)}>
                    メンバー
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
