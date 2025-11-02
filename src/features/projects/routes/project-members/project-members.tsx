"use client";

import { Suspense } from "react";

import { ErrorBoundary } from "@/components/ui/error-boundary";

import { MembersTable } from "./components/members-table";
import { useProjectMembersLogic } from "./project-members.hook";

type ProjectMembersProps = {
  projectId: string;
};

/**
 * プロジェクトメンバー管理ページコンポーネント（内部実装）
 */
const ProjectMembersContent = ({ projectId }: ProjectMembersProps) => {
  const { members, isLoading, handleUpdateRole, handleRemoveMember } = useProjectMembersLogic({
    projectId,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プロジェクトメンバー</h1>
          <p className="mt-1 text-sm text-gray-500">プロジェクトメンバーの管理を行います</p>
        </div>
      </div>

      <MembersTable
        members={members}
        isLoading={isLoading}
        onRoleChange={handleUpdateRole}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
};

/**
 * プロジェクトメンバー管理ページコンポーネント
 *
 * Suspenseとエラーバウンダリーでラップされた安全なコンポーネント。
 * プロジェクトメンバーの一覧表示、ロール変更、削除を行います。
 *
 * @param projectId プロジェクトID
 *
 * @example
 * ```tsx
 * <ProjectMembers projectId="project-123" />
 * ```
 */
export const ProjectMembers = ({ projectId }: ProjectMembersProps) => {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        }
      >
        <ProjectMembersContent projectId={projectId} />
      </Suspense>
    </ErrorBoundary>
  );
};
