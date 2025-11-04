"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";

import { ProjectForm } from "./components/project-form";
import { useNewProject } from "./new-project.hook";

/**
 * 新規プロジェクト作成ページ（Client Component）
 *
 * プロジェクトの新規作成フォームを提供します。
 */
const NewProject = () => {
  const { register, onSubmit, handleCancel, errors, isSubmitting } = useNewProject();

  return (
    <PageLayout>
      <PageHeader title="新規プロジェクト作成" />

      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <ProjectForm register={register} onSubmit={onSubmit} onCancel={handleCancel} errors={errors} isSubmitting={isSubmitting} />
        </div>
      </div>
    </PageLayout>
  );
};

export default NewProject;
