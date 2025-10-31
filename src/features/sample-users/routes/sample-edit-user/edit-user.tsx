"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";
import { UserForm } from "@/features/sample-users/components/user-form";
import { useDevTools } from "@/hooks/use-devtools";

import { useEditUser } from "./edit-user.hook";

/**
 * ユーザー編集ページのコンテンツ (Client Component)
 */
const EditUserPageContent = () => {
  const params = useParams();
  const userId = params.id as string;

  const { control, onSubmit, handleCancel, errors, isSubmitting } = useEditUser(userId);

  const DevTools = useDevTools(control);

  return (
    <>
      <PageLayout maxWidth="2xl">
        <PageHeader title="ユーザー情報編集" description="ユーザーの情報を編集してください" />

        <UserForm
          control={control}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          errors={errors}
          isSubmitting={isSubmitting}
          isEditMode={true}
        />
      </PageLayout>
      {DevTools}
    </>
  );
};

/**
 * ユーザー編集ページ (Client Component)
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 */
const EditUserPage = () => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <EditUserPageContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default EditUserPage;
