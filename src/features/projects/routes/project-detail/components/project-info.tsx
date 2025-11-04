"use client";

import { format } from "date-fns";

import type { Project } from "@/features/projects/types";

// ================================================================================
// Props
// ================================================================================

type ProjectInfoProps = {
  project: Project;
};

// ================================================================================
// Component
// ================================================================================

/**
 * プロジェクト情報表示コンポーネント
 *
 * プロジェクトの詳細情報をカード形式で表示します。
 * 基本情報と詳細情報の2つのセクションに分けて表示されます。
 *
 * 機能:
 * - 基本情報の表示（名前、ステータス、説明）
 * - 詳細情報の表示（作成日時、更新日時、作成者ID、プロジェクトID）
 * - ステータスに応じたバッジ表示
 *
 * @param props - コンポーネントのプロパティ
 * @param props.project - 表示するプロジェクト情報
 * @returns プロジェクト情報表示コンポーネント
 *
 * @example
 * ```tsx
 * <ProjectInfo project={project} />
 * ```
 */
export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 基本情報 */}
      {/* ============================================================ */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">基本情報</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">プロジェクト名</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">ステータス</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  project.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {project.is_active ? "アクティブ" : "非アクティブ"}
              </span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">説明</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.description || "説明なし"}</dd>
          </div>
        </dl>
      </div>

      {/* ============================================================ */}
      {/* 詳細情報 */}
      {/* ============================================================ */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">詳細情報</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">作成日時</dt>
            <dd className="mt-1 text-sm text-gray-900">{format(new Date(project.created_at), "yyyy/MM/dd HH:mm")}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">更新日時</dt>
            <dd className="mt-1 text-sm text-gray-900">{format(new Date(project.updated_at), "yyyy/MM/dd HH:mm")}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">作成者ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.created_by}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">プロジェクトID</dt>
            <dd className="mt-1 text-sm text-gray-500">{project.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
