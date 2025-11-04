"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

import { ProjectsTable } from "./components/projects-table";
import { useProjectsListLogic } from "./projects-list.hook";

/**
 * プロジェクト一覧ページのコンテンツ
 */
const ProjectsListContent = () => {
  const { projects, handleCreateNew, handleViewProject, handleViewMembers } = useProjectsListLogic();

  return (
    <PageLayout>
      <PageHeader title="プロジェクト一覧" action={<Button onClick={handleCreateNew}>新規プロジェクト作成</Button>} />

      <ProjectsTable projects={projects} onViewProject={handleViewProject} onViewMembers={handleViewMembers} />
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
