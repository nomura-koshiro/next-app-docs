"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserForm } from "@/features/sample-users/components/user-form";
import { useDevTools } from "@/hooks/use-devtools";

import { useEditUser } from "./edit-user.hook";

/**
 * ユーザー編集ページ
 */
export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ================================================================================
  // Hooks
  // ================================================================================
  const {
    control,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting,
    isLoading,
    error,
  } = useEditUser(params);
  const DevTools = useDevTools(control);

  // ================================================================================
  // Conditional Rendering
  // ================================================================================
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error !== null) {
    return (
      <ErrorMessage message="ユーザーの読み込みに失敗しました" fullScreen />
    );
  }

  return (
    <>
      <PageLayout maxWidth="2xl">
        <PageHeader
          title="ユーザー情報編集"
          description="ユーザーの情報を編集してください"
        />

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
}
