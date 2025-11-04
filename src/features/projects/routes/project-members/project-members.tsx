"use client";

import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

import { ProjectMembersParamsSchema } from "../../types";
import { AddMemberDialog, MembersTable } from "./components";
import { useProjectMembersLogic } from "./project-members.hook";

/**
 * プロジェクトメンバー管理ページコンポーネント（内部実装）
 */
const ProjectMembersContent = () => {
  const params = useParams();
  const { id: projectId } = ProjectMembersParamsSchema.parse(params);
  const { project, members, isLoading, handleBackToDetail, handleAddMember, handleUpdateRole, handleRemoveMember, isAdding } =
    useProjectMembersLogic({
      projectId,
    });

  // ================================================================================
  // State
  // ================================================================================
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ================================================================================
  // Handlers
  // ================================================================================
  const handleAdd = async (data: Parameters<typeof handleAddMember>[0]) => {
    await handleAddMember(data);
  };

  return (
    <PageLayout>
      <PageHeader
        title={project?.name ? `${project.name} - メンバー管理` : "プロジェクトメンバー"}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToDetail}>
              プロジェクト詳細に戻る
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>メンバーを追加</Button>
          </div>
        }
      />

      <MembersTable members={members} isLoading={isLoading} onRoleChange={handleUpdateRole} onRemoveMember={handleRemoveMember} />

      <AddMemberDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAdd={handleAdd} isAdding={isAdding} />
    </PageLayout>
  );
};

/**
 * プロジェクトメンバー管理ページコンポーネント
 *
 * Suspenseとエラーバウンダリーでラップされた安全なコンポーネント。
 * プロジェクトメンバーの一覧表示、ロール変更、削除を行います。
 *
 * @example
 * ```tsx
 * <ProjectMembers />
 * ```
 */
const ProjectMembers = () => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <ProjectMembersContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectMembers;
