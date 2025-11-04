"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

import { ProjectInfo } from "./components/project-info";
import { useProjectDetailLogic } from "./project-detail.hook";

type ProjectDetailProps = {
  projectId: string;
};

/**
 * プロジェクト詳細ページのコンテンツ
 */
const ProjectDetailContent = ({ projectId }: ProjectDetailProps) => {
  const { project, handleBackToList, handleViewMembers } = useProjectDetailLogic({ projectId });

  return (
    <PageLayout>
      <PageHeader
        title={project.name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToList}>
              一覧に戻る
            </Button>
            <Button onClick={handleViewMembers}>メンバー管理</Button>
          </div>
        }
      />

      <ProjectInfo project={project} />
    </PageLayout>
  );
};

/**
 * プロジェクト詳細ページ（Client Component）
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 * プロジェクトの詳細情報を表示し、メンバー管理ページへの遷移を提供します。
 */
const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <ProjectDetailContent projectId={projectId} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectDetail;
