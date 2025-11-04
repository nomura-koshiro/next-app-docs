"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

import { CreateProjectDialog, ProjectsTable } from "./components";
import { useProjectsListLogic } from "./projects-list.hook";

/**
 * プロジェクト一覧ページのコンテンツ
 */
const ProjectsListContent = () => {
  const { projects, handleCreate, handleViewProject, handleViewMembers, isCreating } = useProjectsListLogic();

  // ================================================================================
  // State
  // ================================================================================
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <PageLayout>
      <PageHeader title="プロジェクト一覧" action={<Button onClick={() => setShowCreateDialog(true)}>新規プロジェクト作成</Button>} />

      <ProjectsTable projects={projects} onViewProject={handleViewProject} onViewMembers={handleViewMembers} />

      {/* 新規作成ダイアログ */}
      <CreateProjectDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreate}
        isCreating={isCreating}
      />
    </PageLayout>
  );
};

/**
 * プロジェクト一覧ページ（Client Component）
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 * プロジェクトの一覧を表示し、詳細ページやメンバー管理ページへの遷移を提供します。
 */
const ProjectsList = () => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <ProjectsListContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectsList;
