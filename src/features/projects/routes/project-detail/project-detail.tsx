"use client";

import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

import { ProjectDetailParamsSchema } from "../../types";
import { DeleteProjectDialog, EditProjectDialog, ProjectInfo } from "./components";
import { useProjectDetailLogic } from "./project-detail.hook";

/**
 * プロジェクト詳細ページのコンテンツ
 */
const ProjectDetailContent = () => {
  const params = useParams();
  const { id: projectId } = ProjectDetailParamsSchema.parse(params);
  const { project, handleBackToList, handleViewMembers, handleUpdate, handleDelete, deleteError, isDeleting, isUpdating } =
    useProjectDetailLogic({
      projectId,
    });

  // ================================================================================
  // State
  // ================================================================================
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // ================================================================================
  // Handlers
  // ================================================================================
  const confirmDelete = () => {
    handleDelete();
  };

  return (
    <PageLayout>
      <PageHeader
        title={project.name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToList}>
              一覧に戻る
            </Button>
            <Button variant="outline" onClick={() => setShowEditDialog(true)}>
              編集
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}>
              削除
            </Button>
            <Button onClick={handleViewMembers}>メンバー管理</Button>
          </div>
        }
      />

      <ProjectInfo project={project} />

      {/* 編集ダイアログ */}
      <EditProjectDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        project={project}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />

      {/* 削除確認ダイアログ */}
      <DeleteProjectDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        project={project}
        onDelete={confirmDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </PageLayout>
  );
};

/**
 * プロジェクト詳細ページ（Client Component）
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 * プロジェクトの詳細情報を表示し、メンバー管理ページへの遷移を提供します。
 */
const ProjectDetail = () => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <ProjectDetailContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectDetail;
